const express = require('express')
const app = express()
// IMPORTS
const encryption = require('./utils/encryption')
const hb = require('express-handlebars')

// Makes the body of requests avaliable as an object
const bodyParser = require('body-parser')

// Makes the  cookies of the reqest avaliable to read as 'cookies' and abke to set cookies
const cookieParser = require('cookie-parser')

// The database app
// const pg = require('pg')
// const client = new pg.Client('postgres://spicedling:password@localhost:5432/cities')
/// encrypts cookies
const cookieSession = require('cookie-session')

// MODULES
const db = require(`${__dirname}/utils/db.js`)
const { Page, SignUpPage, LoginPage } = require('./scripts/page_data.js')

// SETUP
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

//  MAIN FUNCTIONS
app.use(express.static(`${__dirname}/public`))

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
        res.redirect('/register')
    }
})

app.get('/register', (req, res) => { renderPage(req, res, new SignUpPage()) })

app.get('/register', (req, res) => { renderPage(req, res, new LoginPage()) })

app.post('/register', (req, res) => {
    for (var propt in req.body) {
        if (!req.body[propt]) {
            renderPage(req, res, new SignUpPage(`You did not fill in the ${propt} field`))
            return
        }
    }

    encryption.hashPassword(req.body.password).then((hashedP) => {
        return db.addUser(req.body.firstname, req.body.lastname, req.body.emailaddress, hashedP)
    }).then((result) => {
        // req.session is an object which was added by the cookieSession middleware above.
        // add a property to our session cookie called cook;
        req.session.userId = result.rows[0].id
        res.redirect('/petition')
    }).catch((e) => {
        renderPage(req, res, new SignUpPage(`Database Error: ${e}`))
    })
})

app.get('/login', (req, res) => {
    renderPage(req, res, new LoginPage())
})

app.post('/login', (req, res) => {
    var email = req.body.emailaddress
    var password = req.body.password
    db.getHashedPWord(email).then((hashedP) => {
        return encryption.checkPassword(password, hashedP)
    }).then((doesMatch) => {
        res.redirect(`/petition/signed`)
    }).catch((e) => {
        renderPage(req, res, new LoginPage(`Error trying to login: ${e}`))
    })

    req.session.loggedIn = true
    res.redirect('/petition')
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

app.get('/petition/signers', (req, res) => {
    db.getSigners().then((signers) => {
        res.render('signers', {
            layout: 'main',
            people: signers.rows,
            logout: true
        })
    })
})

app.get('/petition', (req, res) => {
    res.render('petition', {
        layout: 'main'
    })
})

app.post('/petition', (req, res) => {
    for (var propt in req.body) {
        if (!req.body[propt]) {
            res.cookie('error_title', 'Error', { maxAge: 1000, httpOnly: true })
            res.cookie('error_type', 'missing_details', { maxAge: 1000, httpOnly: true })
            res.cookie('error_message', `You did not fill in the ${propt} field`, { maxAge: 1000, httpOnly: true })
            // Sends the response and ends this fuction
            res.redirect('/error')
        }
    }

    db.addSignature(req.body.firstname, req.body.lastname, req.body.signature).then((result) => {
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

function renderPage (req, res, page) {
    if (!(page instanceof Page)) {
        throw new Error('Not all fields are of type TextField')
    }
    res.render(page.name, page.data)
}
