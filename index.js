// IMPORTS
const express = require('express')
const app = express()
const encryption = require('./utils/encryption')
const hb = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')

// MODULES
const db = require(`${__dirname}/utils/db.js`)
const pages = require('./view_data/page_data.js')
const Routes = require('./view_data/page_data').Routes

setupApp()

// SECURTIY
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    res.setHeader('X-FRAME-OPTIONS', 'DENY')
    next()
})

// REDIRECTS
app.use((req, res, next) => {
    const userId = req.session.userId
    const signatureId = req.session.signatureId
    const loggedIn = req.session.loggedIn
    const url = req.url
    if (userId) {
        if (url === '/profile') {
            next()
        } else {
            if (url === '/register') {
                res.redirect('/petition')
            } else {
                if (loggedIn) {
                    if (signatureId) {
                        if (url !== Routes.SIGNED) {
                            res.redirect(Routes.SIGNED)
                        } else {
                            next()
                        }
                    } else {
                        next()
                    }
                } else if (url !== '/login') {
                    res.redirect('/login')
                } else {
                    next()
                }
            }
        }
    } else {
        if (url !== '/register') {
            res.redirect('/register')
        } else {
            next()
        }
    }
})

// GET REQUESTS
app.get('/:name/:city', (req, res, next) => {

    const routeName = `/${req.params.name}`
    const userId = req.session.userId

    switch (routeName) {

        case Routes.SIGNED:
            const userName = db.getProfileData(userId)
            const signers = db.getSigners()
            const signatureId = req.session.signatureId
            Promise.all([userName, signers]).then((results) => {
                renderPage(res, new pages.ThankyouPage(results[0], results[1]))
            }).catch((e) => { console.log(e) })
            break

        case Routes.REGISTER:
            renderPage(res, new pages.SignUpPage())
            break

        case Routes.PROFILE:
            renderPage(res, new pages.ProfilePage())
            break

        case Routes.LOGIN:
            renderPage(res, new pages.LoginPage())
            break

        case Routes.LOGOUT:
            req.session.loggedIn = null
            res.redirect('/petition')
            break

        case Routes.PETITION:
            renderPage(res, new pages.SignPetitonPage())
            break

        case Routes.SIGNERS:
            const city = req.params.city
            if (city) {
                db.getSigners(city).then((signers) => {
                    renderPage(res, new pages.SignersPage(signers.rows))
                }).catch((e) => {
                    console.log(e)
                    next()
                })
            } else {
                db.getSigners().then((signers) => {
                    renderPage(res, new pages.SignersPage(signers.rows))
                }).catch((e) => {
                    console.log(e)
                    next()
                })
            }
            break

        default: next(); break
    }
})

// POST REQUESTS



app.post('/register', (req, res) => {
    for (var propt in req.body) {
        if (!req.body[propt]) {
            renderPage(res, new pages.SignUpPage(`You did not fill in the ${propt} field`))
            return
        }
    }

    encryption.hashPassword(req.body.password).then((hashedP) => {
        return db.addUser(req.body.firstname, req.body.lastname, req.body.emailaddress, hashedP)
    }).then((result) => {
        req.session.userId = result.rows[0].id
        res.redirect('/profile')
    }).catch((e) => {
        if (e.code === `23505`) {
            renderPage(res, new pages.SignUpPage(`We already have a user registed to that email`))
        } else {
            renderPage(res, new pages.SignUpPage(`Database Error: ${e}`))
        }
    })
})

app.post('/profile', (req, res) => {
    const userId = req.session.userId
    db.addUserProfile(req.body.age, req.body.city, req.body.url, userId).then((result) => {
        console.log(result)
        res.redirect(`/petition`)
    }).catch((e) => {
        if (e.code === '22P02') {
            renderPage(res, new pages.ProfilePage(`Please enter a number for your age`))
        } else {
            renderPage(res, new pages.ProfilePage(`Error: ${e}`))
        }
    })
})

app.post('/login', (req, res) => {
    const email = req.body.emailaddress
    const password = req.body.password
    db.getHashedPWord(email).then((result) => {
        return encryption.checkPassword(password, result.rows[0].password)
    }).then((doesMatch) => {
        req.session.loggedIn = true
        res.redirect('/petition')
    }).catch((e) => {
        renderPage(res, new pages.LoginPage(`Error trying to login: ${e}`))
    })
})

app.post('/petition', (req, res) => {
    if (!req.body.signature) {
        renderPage(res, new pages.SignPetitonPage(`You did not fill in the signature`))
    }

    db.addSignature(req.session.userId, req.body.signature).then((result) => {
        req.session.signatureId = result.rows[0].id
        res.redirect('/petition/signed')
    }).catch((e) => {
        res.cookie('error_title', 'Error', { maxAge: 1000, httpOnly: true })
        res.cookie('error_type', 'data_base_error', { maxAge: 1000, httpOnly: true })
        res.cookie(`error_message`, ` 'Database error: ${e}`, { maxAge: 1000, httpOnly: true })
        res.redirect('/error')
    })
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
        error: 'No page found',
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

    const csurf = require('csurf')
    app.use(csurf())
}

app.listen(8080, () => {
    console.log('Listening on port 8080')
})

// Parameters may be declared in a variety of syntactic forms
/**
 * @param {Object}  req - The http request object.
 * @param {Object} res - The http response object.
 * @param {Page} page - A instance of a Page class or child.
 */
function renderPage (res, page) {
    if (!(page instanceof pages.Page)) {
        throw new Error(`Page argument is not of type "Page"`)
    } else {
        res.render(page.type, page.attributes)
    }
}

// db.getSigners().then((signers) => {
//     var signersCount = signers.rows.length
//     res.render('thank-you', {
//         layout: 'main',
//         signersCount: `See the other ${signersCount > 1 ? signersCount : ''} ${signersCount > 1 ? 'signers' : 'signer'}`,
//         logout: true,
//         signatureId: signers.rows[signatureId - 1].signature,
//         name: signers.rows[signatureId - 1].name
//     })
// })

// app.post('/:name/:city', (req, res) => {
//     const routeName = `/${req.params.name}`
//     const userId = req.session.userId
//     var email = req.body.emailaddress
//     var password = req.body.password
//     switch (name) {
//         case Routes.REGISTER:
            
//             break;
    
//         default:
//             break;
//     }
// })
