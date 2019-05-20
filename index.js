// IMPORTS
const express = require('express')
const app = express()
const encryption = require('./utils/encryption')
const hb = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const csurf = require('csurf')
const chalk = require('chalk')

// MODULES
const db = require(`./utils/db.js`)
const PAGES = require('./view_data/page_data.js')
const ROUTES = require('./view_data/page_data').ROUTES

// VARIABLES
const COOKIES = Object.freeze({
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
    console.log(chalk.green(`Token is : ${req.csrfToken()}`))
    res.locals.csrfToken = req.csrfToken()
    res.setHeader('X-FRAME-OPTIONS', 'DENY')
    next()
})

const profileRouter = require('./routers/profile')
console.log(profileRouter);
app.use(profileRouter)

app.use((req, res, next) => {
    console.log(chalk.blue(`Recieve ${req.method} to ${req.url}`))
    next()
})

// GET REQUESTS

app.get(ROUTES.SIGNERS, (req, res, next) => {
    const userID = req.session[COOKIES.ID]
    db.listSigners(userID).then((signers) => {
        var tolist = signers.rows.map((signer) => {
            console.log(signer.city.charAt(0).toUpperCase() + signer.city.slice(1))
            return {
                first: signer.first,
                last: signer.last,
                age: signer.age,
                city: signer.city.charAt(0).toUpperCase() + signer.city.slice(1),
                url: signer.url
            }
        })
        renderPage(res, new PAGES.SignersPage(tolist))
    }).catch((e) => {
        console.log(e)
        next()
    })
})

app.get(ROUTES.CITY, (req, res, next) => {
    const city = req.params.city
    if (city) {
        db.listSignersByCity(city).then((signers) => {
            var tolist = signers.rows.map((signer) => {
                return {
                    first: signer.first,
                    last: signer.last,
                    age: signer.age,
                    city: signer.city.charAt(0).toUpperCase() + signer.city.slice(1),
                    url: signer.url
                }
            }

            )
            renderPage(res, new PAGES.SignersPage(tolist))
        }).catch((e) => {
            console.log(e)
            next()
        })
    } else {
        next()
    }
})

app.get(ROUTES.PETITION, (req, res, next) => {
    const userId = req.session[COOKIES.ID]
    const signatureId = req.session[COOKIES.SIGNATURE]
    if (userId && signatureId) {
        res.redirect(ROUTES.SIGNED)
    } else {
        db.getName(userId).then((result) => {
            const firstname = result.rows[0].first
            renderPage(res, new PAGES.PetitonPage(firstname))
        }).catch((e) => {
            console.log(e)
            next()
        })
    }
})

app.get(ROUTES.LOGIN, (req, res, next) => {
    const userId = req.session[COOKIES.LOGGEDIN]
    if (userId) {
        res.redirect(ROUTES.PETITION)
    } else {
        renderPage(res, new PAGES.LoginPage())
    }
})

app.get(ROUTES.REGISTER, (req, res, next) => {
    if (req.session[COOKIES.ID] || req.session[COOKIES.LOGGEDIN]) {
        req.session[COOKIES.ID] = null
        req.session[COOKIES.LOGGEDIN] = null
        res.redirect(ROUTES.REGISTER)
    } else {
        const userId = req.session[COOKIES.ID]
        req.session[COOKIES.LOGGEDIN] = null
        if (userId) {
            res.redirect(ROUTES.LOGIN)
        } else {
            renderPage(res, new PAGES.RegisterPage())
        }
    }
})

app.get(ROUTES.PROFILE, (req, res) => {
    const userId = req.session[COOKIES.ID]
    if (userId) {
        renderPage(res, new PAGES.ProfilePage())
    } else {
        res.redirect(ROUTES.REGISTER)
    }
})

app.get(ROUTES.SIGNED, (req, res, next) => {
    let sigId = req.session[COOKIES.SIGNATURE]
    let userID = req.session[COOKIES.ID]
    db.getSignatureWithSigId(sigId).then((sigResult) => {
        const signature = sigResult.rows[0]
        if (!signature) {
            req.session[COOKIES.SIGNATURE] = null
            res.redirect(ROUTES.PETITION)
        } else {
            db.signersCount(userID).then((results) => {
                if (results.rows[0] < 1) {
                    res.redirect(ROUTES.PETITION)
                } else {
                    const name = req.session[COOKIES.FIRSTNAME]
                    const signature = sigResult.rows[0].signature
                    const signersCount = results.rows[0].count
                    renderPage(res, new PAGES.SignedPage(name, signature, signersCount))
                }
            })
        }
    }).catch((e) => {
        console.log(e)
        next()
    })
})

app.get(ROUTES.EDITPROFILE, (req, res, next) => {
    db.getUserProfileById(req.session[COOKIES.ID]).then((result) => {
        let detailsObj = {
            firstname: result.rows[0].first,
            lastname: result.rows[0].last,
            email: result.rows[0].email,
            age: req.session[COOKIES.AGE],
            city: req.session[COOKIES.CITY],
            url: req.session[COOKIES.URL]
        }
        let pageData = new PAGES.EditProfilePage(detailsObj)
        renderPage(res, pageData)
    }).catch((e) => {
        console.log(e)
        next()
    })
})

app.get(ROUTES.LOGOUT, (req, res) => {
    req.session = null
    res.redirect(ROUTES.LOGIN)
})

// POST REQUESTS

app.post(ROUTES.SIGNED, (req, res, next) => {
    db.deleteSignature(req.session[COOKIES.SIGNATURE]).then(() => {
        req.cookies[COOKIES.SIGNATURE] = null
        res.redirect(ROUTES.PETITION)
    }).catch((e) => {
        console.log(e)
        next()
    })
})

app.post(ROUTES.EDITPROFILE, (req, res, next) => {
    if (req.body.delete) {
        db.deleteAccount(req.session[COOKIES.ID]).then(() => {
            delete req.session
            res.redirect(ROUTES.REGISTER)
        }).catch((e) => {
            renderPage(res, new PAGES.EditProfilePage({}, e))
        })
    } else {
        const userId = req.session[COOKIES.ID]
        let age = req.session[COOKIES.AGE] = req.body.age
        const city = req.session[COOKIES.CITY] = req.body.city
        const url = req.session[COOKIES.URL] = req.body.url
        const first = req.session[COOKIES.FIRSTNAME] = req.body.firstname
        const last = req.session[COOKIES.LASTNAME] = req.body.lastname
        const email = req.session[COOKIES.EMAIL] = req.body.email
        const password = req.body.password
        // to update Profile
        db.updateProfile(userId, age, city, url).catch((e) => { console.log(e) }).then((result) => {
            if (password) {
                encryption.hashPassword(password).then((hashedP) => {
                    db.updateUser(first, last, hashedP, email, userId).catch((e) => {
                        renderPage(res, new PAGES.ProfilePage({}, `${e}`))
                    })
                })
            } else {
                db.updateUser(first, last, null, email, userId).catch((e) => {
                    renderPage(res, new PAGES.ProfilePage({}, `${e}`))
                })
            }
            req.session[COOKIES.LOGGEDIN] = true
            res.redirect(ROUTES.PETITION)
        }).catch((e) => {
            if (e.code === '22P02') {
                renderPage(res, new PAGES.EditProfilePage({}, `Please enter a number for your age`))
            } else {
                renderPage(res, new PAGES.ProfilePage({}, `${e}`))
            }
        })
    }
})

app.post(ROUTES.REGISTER, (req, res) => {
    if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password) {
        return renderPage(res, new PAGES.RegisterPage(`You did not fill in all the fields`))
    }
    encryption.hashPassword(req.body.password).then((hashedP) => {
        return db.addUser(req.body.firstname, req.body.lastname, req.body.email, hashedP)
    }).then((result) => {
        let id = result.rows[0].id
        req.session[COOKIES.ID] = id
        req.session[COOKIES.AGE] = null
        req.session[COOKIES.CITY] = null
        req.session[COOKIES.URL] = null
        req.session[COOKIES.SIGNATURE] = null
        res.redirect(ROUTES.PROFILE)
    }).catch((e) => {
        if (e.code === `23505`) {
            renderPage(res, new PAGES.RegisterPage(`We already have a user registed to that email`))
        } else {
            renderPage(res, new PAGES.RegisterPage(`Database ${e}`))
        }
    })
})

app.post(ROUTES.PROFILE, (req, res) => {
    console.log(req.session)
    const userId = req.session[COOKIES.ID]
    const age = req.body.age === '' ? null : req.body.age

    db.addUserProfile(age, req.body.city, req.body.url, userId).then((result) => {
        console.log(result)
        req.session[COOKIES.AGE] = result.rows[0].age
        req.session[COOKIES.CITY] = result.rows[0].city
        req.session[COOKIES.URL] = result.rows[0].url
        req.session[COOKIES.LOGGEDIN] = true
        res.redirect(ROUTES.PETITION)
    }).catch((e) => {
        if (e.code === '22P02') {
            renderPage(res, new PAGES.ProfilePage(`Please enter a number for your age`))
        } else {
            renderPage(res, new PAGES.ProfilePage(`${e}`))
        }
    })
})

app.post(ROUTES.LOGIN, (req, res) => {
    const email = req.body.email
    const password = req.body.password
    if (password && email) {
        db.getHashedPWord(email).then((result) => {
            return encryption.checkPassword(password, result.rows[0].password)
        }).then((doesMatch) => {
            if (doesMatch) { return db.getUserProfile(email) }
        }).then((userProfile) => {
            req.session[COOKIES.ID] = userProfile.rows[0].id
            req.session[COOKIES.AGE] = userProfile.rows[0].age
            req.session[COOKIES.CITY] = userProfile.rows[0].city
            req.session[COOKIES.EMAIL] = userProfile.rows[0].email
            req.session[COOKIES.FIRSTNAME] = userProfile.rows[0].first
            req.session[COOKIES.LASTNAME] = userProfile.rows[0].last
            req.session[COOKIES.SIGNATURE] = userProfile.rows[0].sigId
            req.session[COOKIES.URL] = userProfile.rows[0].url
            req.session[COOKIES.LOGGEDIN] = true
            return db.getSigUserId(req.session[COOKIES.ID])
        }).then((result) => {
            if (result.rows[0]) {
                let sig = result.rows[0].id
                req.session[COOKIES.SIGNATURE] = sig
            }
            res.redirect(ROUTES.PETITION)
        }).catch((_e) => {
            renderPage(res, new PAGES.LoginPage(`SOZ! We did not find a user with these credentails :/`))
        })
    } else {
        renderPage(res, new PAGES.LoginPage('Please fill in both fields'))
    }
})

app.post(ROUTES.PETITION, (req, res) => {
    if (!req.body.signature) {
        renderPage(res, new PAGES.PetitonPage(`You did not fill in the signature`))
    } else {
        db.addSignature(req.session[COOKIES.ID], req.body.signature).then((result) => {
            req.session[COOKIES.SIGNATURE] = result.rows[0].id
            res.redirect(ROUTES.SIGNED)
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
 * @param {Object} req - The http request object.
 * @param {Object} res - The http response object.
 * @param {Page} page - A instance of a Page class or child.
 */
function renderPage (res, page) {
    if (!(page instanceof PAGES.Page)) {
        throw new Error(`Page argument is not of type "Page"`)
    } else {
        res.render(page.type, page.attributes)
    }
}
