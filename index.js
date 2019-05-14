const express = require('express')
const app = express()
// IMPORTS
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
const { Textfield } = require('./scripts/widget_data.js/index.js');

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
    if (req.session.id && req.url !== '/petition/signed' && req.url !== '/logout') {
        if (req.url === '/petition/signers') {
            next()
        } else {
            res.redirect('/petition/signed')
        }
    } else {
        next()
    }
})

app.get('/logout', (req, res) => {
    req.session = null
    res.redirect('/petition')
})

app.get('/petition/signed', (req, res) => {
    var signatureId = req.session.id

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
        req.session.id = result.rows[0].id
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
