// IMPORTS
const express = require('express')
const app = express()
const encryption = require('./utils/encryption')
const hb = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const csurf = require('csurf')

// MODULES
const db = require(`./utils/db.js`)
const Pages = require('./view_data/page_data.js')
const Routes = require('./view_data/page_data').Routes

// VARIABLES
const Cookies = Object.freeze({
    LOGGEDIN: 'loggedIn',
    ID: 'userId',
    SIGNATURE: 'signature',
    EMAIL: 'email',
    FIRSTNAME: 'first',
    LASTNAME: 'last',
    CITY: 'city',
    AGE: 'age',
    URL: 'url'
})

setupApp()

// SECURTIY
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    res.setHeader('X-FRAME-OPTIONS', 'DENY')
    next()
})

app.use((req, res, next) => {
    console.log(`Recieve ${req.method} to ${req.url}`)
    next()
})

// GET REQUESTS

app.get(Routes.SIGNERS, (req, res, next) => {
    const userID = req.session[Cookies.ID]
    db.listSigners(userID).then((signers) => {
        renderPage(res, new Pages.SignersPage(signers.rows))
    }).catch((e) => {
        console.log(e)
        next()
    })
})

app.get(`${Routes.SIGNERS}/:city`, (req, res, next) => {
    const city = req.params.city
    if (city) {
        db.listSignersByCity(city).then((signers) => {
            renderPage(res, new Pages.SignersPage(signers.rows))
        }).catch((e) => {
            console.log(e)
            next()
        })
    } else {
        next()
    }
})

app.get(Routes.PETITION, (req, res, next) => {
    const userId = req.session[Cookies.ID]
    const signatureId = req.session[Cookies.SIGNATURE]
    if (userId && signatureId) {
        res.redirect(Routes.SIGNED)
    } else {
        db.getName(userId).then((result) => {
            const firstname = result.rows[0].first
            renderPage(res, new Pages.SignPetitonPage(firstname))
        }).catch((e) => {
            console.log(e)
            next()
        })
    }
})

app.get(Routes.LOGIN, (req, res, next) => {
    const userId = req.session[Cookies.LOGGEDIN]
    if (userId) {
        res.redirect(Routes.PETITION)
    } else {
        renderPage(res, new Pages.LoginPage())
    }
})

app.get(Routes.REGISTER, (req, res, next) => {
    if (req.session[Cookies.ID] || req.session[Cookies.LOGGEDIN]) {
        req.session[Cookies.ID] = null
        req.session[Cookies.LOGGEDIN] = null
        res.redirect(Routes.REGISTER)
    } else {
        const userId = req.session[Cookies.ID]
        req.session[Cookies.LOGGEDIN] = null
        if (userId) {
            res.redirect(Routes.LOGIN)
        } else {
            renderPage(res, new Pages.SignUpPage())
        }
    }
})

app.get(Routes.PROFILE, (req, res) => {
    const userId = req.session[Cookies.ID]
    if (userId) {
        renderPage(res, new Pages.ProfilePage())
    } else {
        res.redirect(Routes.REGISTER)
    }
})


app.get(Routes.SIGNED, (req, res, next) => {
    let sigId = req.session[Cookies.SIGNATURE]
    let userID = req.session[Cookies.ID]
    db.getSignatureWithSigId(sigId).then((sigResult) => {
        const signature = sigResult.rows[0]
        if (!signature) {
            req.session[Cookies.SIGNATURE] = null
            res.redirect(Routes.PETITION)
        } else {
            db.signersCount(userID).then((results) => {
                if (results.rows[0] < 1) {
                    res.redirect(Routes.PETITION)
                } else {
                    const name = req.session[Cookies.FIRSTNAME]
                    const signature = sigResult.rows[0].signature
                    const signersCount = results.rows[0].count
                    renderPage(res, new Pages.SignedPage(name, signature, signersCount))
                }
            })
        }
    }).catch((e) => {
        console.log(e)
        next()
    })
})

app.get(Routes.EDITPROFILE, (req, res, next) => {
    db.getUserProfileById(req.session[Cookies.ID]).then((result) => {
        let detailsObj = {
            firstname: result.rows[0].first,
            lastname: result.rows[0].last,
            email: result.rows[0].email,
            age: req.session[Cookies.AGE],
            city: req.session[Cookies.CITY],
            url: req.session[Cookies.URL]
        }
        let pageData = new Pages.EditProfilePage(detailsObj)
        renderPage(res, pageData)
    }).catch((e) => {
        console.log(e)
        next()
    })
})

app.get(Routes.LOGOUT, (req, res) => {
    req.session[Cookies.LOGGEDIN] = false
    res.redirect(Routes.LOGIN)
})

// POST REQUESTS
app.post(Routes.EDITPROFILE, (req, res, next) => {
    const userId = req.session[Cookies.ID]
    const age = req.session[Cookies.AGE] = req.body.age
    const city = req.session[Cookies.CITY] = req.body.city
    const url = req.session[Cookies.URL] = req.body.url
    const first = req.session[Cookies.FIRSTNAME] = req.body.firstname
    const last = req.session[Cookies.LASTNAME] = req.body.lastname
    const email = req.session[Cookies.EMAIL] = req.body.email
    const password = req.body.password
    // to update Profile
    Promise.all([
        db.updateProfile(userId, age, city, url).catch((e) => { console.log(e) }),
        encryption.hashPassword(password).then((hashedP) => {
            return db.addUser(first, last, email, hashedP)
        })
    ]).then((result) => {
        req.session[Cookies.LOGGEDIN] = true
        res.redirect(Routes.PETITION)
    }).catch((e) => {
        if (e.code === '22P02') {
            renderPage(res, new Pages.ProfilePage(`Please enter a number for your age`))
        } else {
            renderPage(res, new Pages.ProfilePage(`${e}`))
        }
    })
})

app.post(Routes.REGISTER, (req, res) => {
    if (!req.body.firstname && !req.body.lastname && !req.body.email && !req.body.password) {
        return renderPage(res, new Pages.SignUpPage(`You did not fill in all the fields`))
    }
    encryption.hashPassword(req.body.password).then((hashedP) => {
        return db.addUser(req.body.firstname, req.body.lastname, req.body.email, hashedP)
    }).then((result) => {
        req.session[Cookies.ID] = result.rows[0].id
        req.session[Cookies.AGE] = null
        req.session[Cookies.CITY] = null
        req.session[Cookies.URL] = null
        req.session[Cookies.SIGNATURE] = null
        res.redirect(Routes.PROFILE)
    }).catch((e) => {
        if (e.code === `23505`) {
            renderPage(res, new Pages.SignUpPage(`We already have a user registed to that email`))
        } else {
            renderPage(res, new Pages.SignUpPage(`Database ${e}`))
        }
    })
})

app.post(Routes.PROFILE, (req, res) => {
    console.log(req.session)
    const userId = req.session[Cookies.ID]

    db.addUserProfile(req.body.age, req.body.city, req.body.url, userId).then((result) => {
        console.log(result)
        req.session[Cookies.LOGGEDIN] = true
        res.redirect(Routes.PETITION)
    }).catch((e) => {
        if (e.code === '22P02') {
            renderPage(res, new Pages.ProfilePage(`Please enter a number for your age`))
        } else {
            renderPage(res, new Pages.ProfilePage(`${e}`))
        }
    })
})

app.post(Routes.LOGIN, (req, res) => {
    const email = req.body.email
    const password = req.body.password
    if (password && email) {
        db.getHashedPWord(email).then((result) => {
            return encryption.checkPassword(password, result.rows[0].password)
        }).then((doesMatch) => {
            if (doesMatch) { return db.getUserProfile(email) }
        }).then((userProfile) => {
            req.session[Cookies.ID] = userProfile.rows[0].id
            req.session[Cookies.AGE] = userProfile.rows[0].age
            req.session[Cookies.CITY] = userProfile.rows[0].city
            req.session[Cookies.EMAIL] = userProfile.rows[0].email
            req.session[Cookies.FIRSTNAME] = userProfile.rows[0].first
            req.session[Cookies.LASTNAME] = userProfile.rows[0].last
            req.session[Cookies.SIGNATURE] = userProfile.rows[0].sigId
            req.session[Cookies.URL] = userProfile.rows[0].url
            req.session[Cookies.LOGGEDIN] = true
            return db.getSigUserId(req.session[Cookies.ID])
        }).then((result) => {
            if (result.rows[0]) {
                let sig = result.rows[0].id
                req.session[Cookies.SIGNATURE] = sig
            }
            res.redirect(Routes.PETITION)
        }).catch((_e) => { 
            renderPage(res, new Pages.LoginPage(`SOZ! We did not find a user with these credentails :/`)) 
        })
    } else {
        renderPage(res, new Pages.LoginPage('PLease fill in both fields'))
    }
})

app.post(Routes.PETITION, (req, res) => {
    if (!req.body.signature) {
        renderPage(res, new Pages.SignPetitonPage(`You did not fill in the signature`))
    } else {
        db.addSignature(req.session[Cookies.ID], req.body.signature).then((result) => {
            req.session[Cookies.SIGNATURE] = result.rows[0].id
            res.redirect(Routes.SIGNED)
        }).catch((e) => {
            res.cookie('error_title', 'Error', { maxAge: 1000, httpOnly: true })
            res.cookie('error_type', 'data_base_error', { maxAge: 1000, httpOnly: true })
            res.cookie(`error_message`, ` 'Database error: ${e}`, { maxAge: 1000, httpOnly: true })
            res.redirect('/error')
        })
    }
})

app.get('/error', (req, res) => {
    res.render('error', {
        layout: 'main',
        error: req.cookies.error_title,
        type: req.cookies.error_title,
        message: req.cookies.error_message
    })
})

app.get('*', (req, res) => {
    res.render('error', {
        layout: 'main',
        error: 'ERROR: No page found',
        type: 'no matich url',
        message: 'The url is badly formatted.'
    })
})

function setupApp () {
    app.engine('handlebars', hb())

    // sets rendering
    app.set('view engine', 'handlebars')
    app.use(cookieParser())

    // Very important to get the POST reests of forms
    app.use(bodyParser.json()) // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
        extended: true
    }))

    app.use(cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    }))
    app.use(express.static(`${__dirname}/public`))

    app.use(csurf())
}

app.listen(process.env.PORT || 8080, () => {
    console.log(process.env.PORT ? `Online` : `Listening on port 8080`)
})

// Parameters may be declared in a variety of syntactic forms
/**
 * @param {Object}  req - The http request object.
 * @param {Object} res - The http response object.
 * @param {Page} page - A instance of a Page class or child.
 */
function renderPage (res, page) {
    if (!(page instanceof Pages.Page)) {
        throw new Error(`Page argument is not of type "Page"`)
    } else {
        res.render(page.type, page.attributes)
    }
}
