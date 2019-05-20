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

// EXPORTS
module.exports.app = app

// MODULES
const db = require(`./utils/db.js`)
const PAGES = require('./view_data/page_data.js')
const ROUTES = require('./routers/routes')
const profileRouter = require('./routers/profile')
const loginRouter = require('./routers/login')
const middleware = require('./middleware')

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

app.use((req, res, next) => {
    console.log(chalk.blue(`Recieve ${req.method} to ${req.url}`))
    next()
})

app.use(profileRouter, loginRouter)

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
        this.renderPage(res, new PAGES.SignersPage(tolist))
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
            this.renderPage(res, new PAGES.SignersPage(tolist))
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
            this.renderPage(res, new PAGES.PetitonPage(firstname))
        }).catch((e) => {
            console.log(e)
            next()
        })
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
            this.renderPage(res, new PAGES.RegisterPage())
        }
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
                    this.renderPage(res, new PAGES.SignedPage(name, signature, signersCount))
                }
            })
        }
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



app.post(ROUTES.REGISTER, (req, res) => {
    if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password) {
        return this.renderPage(res, new PAGES.RegisterPage(`You did not fill in all the fields`))
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
            this.renderPage(res, new PAGES.RegisterPage(`We already have a user registed to that email`))
        } else {
            this.renderPage(res, new PAGES.RegisterPage(`Database ${e}`))
        }
    })
})

app.post(ROUTES.PETITION, (req, res) => {
    if (!req.body.signature) {
        this.renderPage(res, new PAGES.PetitonPage(`You did not fill in the signature`))
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

// Stops server starting during tests
if (require.main == module) {   
    app.listen(process.env.PORT || 8080, () => {
        console.log(process.env.PORT ? `Online` : `Listening on port 8080`)
    })
}

// Parameters may be declared in a variety of syntactic forms
/**
 * @param {Object} req - The http request object.
 * @param {Object} res - The http response object.
 * @param {Page} page - A instance of a Page class or child.
 */
module.exports.renderPage = function renderPage (res, page) {
    if (!(page instanceof PAGES.Page)) {
        throw new Error(`Page argument is not of type "Page"`)
    } else {
        res.render(page.type, page.attributes)
    }
}
