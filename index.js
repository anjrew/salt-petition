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

setupApp()

// MIDDLEWARE
app.use(function (req, res, next) {
    const userId = req.session.userId
    const signatureId = req.session.signatureId
    const loggedIn = req.session.loggedIn
    const url = req.url
    if (userId) {
        if (url === '/register') {
            res.redirect('/petition')
        } else {
            if (loggedIn) {
                if (signatureId) {
                    res.redirect('/petition/signed')
                } else {
                    next()
                }
            } else if (url !== '/login') {
                res.redirect('/login')
            } else {
                next()
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

// REQUESTS

app.get('/register', (req, res) => { renderPage(req, res, new pages.SignUpPage()) })

app.post('/register', (req, res) => {
    for (var propt in req.body) {
        if (!req.body[propt]) {
            renderPage(req, res, new pages.SignUpPage(`You did not fill in the ${propt} field`))
            return
        }
    }

    encryption.hashPassword(req.body.password).then((hashedP) => {
        return db.addUser(req.body.firstname, req.body.lastname, req.body.emailaddress, hashedP)
    }).then((result) => {
        // req.session is an object which was added by the cookieSession middleware above.
        // add a property to our session cookie called cook;
        req.session.userId = result.rows[0].id
        res.redirect('/profile')
    }).catch((e) => {
        if (e.code === `23505`) {
            renderPage(req, res, new pages.SignUpPage(`We already have a user registed to that email`))
        }else {
            renderPage(req, res, new pages.SignUpPage(`Database Error: ${e}`))
        }
    })
})

app.get('/profile', (req, res) => {
    const userId = req.session.userId
    renderPage(req, res, new pages.ProfilePage())
})

app.get('/login', (req, res) => {
    renderPage(req, res, new pages.LoginPage())
})

app.post('/login', (req, res) => {
    var email = req.body.emailaddress
    var password = req.body.password
    db.getHashedPWord(email).then((result) => {
        return encryption.checkPassword(password, result.rows[0].password)
    }).then((doesMatch) => {
        req.session.loggedIn = true
        res.redirect('/petition')
    }).catch((e) => {
        renderPage(req, res, new pages.LoginPage(`Error trying to login: ${e}`))
    })
})

app.get('/logout', (req, res) => {
    req.session.loggedIn = null
    res.redirect('/petition')
})

app.get('/petition/signed', (req, res) => {
    var signatureId = req.session.signatureId

    db.getSigners().then((signers) => {
        var signersCount = signers.rows.length
        res.render('thank-you', {
            layout: 'main',
            signersCount: `See the other ${signersCount > 1 ? signersCount : ''} ${signersCount > 1 ? 'signers' : 'signer'}`,
            logout: true,
            signatureId: signers.rows[signatureId - 1].signature,
            name: signers.rows[signatureId - 1].name
        })
    })
})

app.get('/signers/city', (req, res) => {
    const city = req.params.city
    db.getSingersByCity(city).then()
})

app.get('/petition/signers', (req, res) => {
    db.getSigners().then((signers) => {
        res.render('signers', {
            layout: 'main',
            people: signers.rows,
            logout: true
        })
    })
})

app.get('/petition', (req, res) => { renderPage(req, res, new pages.SignPetitonPage()) })

app.post('/petition', (req, res) => {
    for (var propt in req.body) {
        if (!req.body[propt]) {
            renderPage(req, res, new pages.SignPetitonPage(`You did not fill in the ${propt} field`))
        }
    }

    db.addSignature(req.session.userId, req.body.signature).then((result) => {
        // req.session is an object which was added by the cookieSession middleware above.
        // add a property to our session cookie called cook;
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

app.listen(8080, () => {
    console.log('Listening on port 8080')
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
}

// Parameters may be declared in a variety of syntactic forms
/**
 * @param {Object}  req - The http request object.
 * @param {Object} res - The http response object.
 * @param {Page} page - A instance of a Page class or child.
 */
function renderPage (req, res, page) {
    if (!(page instanceof pages.Page)) {
        throw new Error(`Page argument is not of type "Page"`)
    }
    res.render(page.name, page.data)
}
