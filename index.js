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
const db = require('./utils/db.js')

// SETUP

app.engine('handlebars', hb())
// sets rendering
app.set('view engine', 'handlebars')
app.use(cookieParser())
app.use(cookieSession({
    secret: `I see dead people.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
}))

// Very important to get the POST reests of forms
app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}))

//  MAIN FUNCTIONS

app.use(express.static(`${__dirname}/public`))

app.use(function (req, res, next) {
    if (req.cookies.hasSigned) {
        res.redirect('/petition/signers')
    } else {
        next()
    }
})

app.get('/petition', (req, res) => {
    res.render('petition', {
        layout: 'main'
    })
})

app.post('/petition', (req, res) => {
    for (var propt in req.body) {
        console.log(propt + ': ' + req.body[propt])
        if (!req.body[propt]) {
            res.cookie('error_title', 'Error', { maxAge: 1000 * 60 * 60 * 24 * 14, httpOnly: true })
            res.cookie('error_type', 'missing_details', { maxAge: 1000 * 60 * 60 * 24 * 14, httpOnly: true })
            res.cookie('error_message', `You did not fill in the ${propt} field`)
            // Sends the response and ends this fuction
            res.redirect('/error')
        }
    }

    db.addSignature(req.body.firstname, req.body.lastname, req.body.signature).then((id) => {
        // req.session is an object which was added by the cookieSession middleware above.
        // add a property to our session cookie called cook;
        req.session.id = id
        res.cookie('hasSigned', true, { maxAge: 1000 * 60 * 60 * 24 * 14, httpOnly: true })
        res.redirect('/petition/signed')
    }).catch((e) => {
        res.cookie('error_title', 'Error', { maxAge: 1000 * 60 * 60 * 24 * 14, httpOnly: true })
        res.cookie('error_type', 'data_base_error', { maxAge: 1000 * 60 * 60 * 24 * 14, httpOnly: true })
        res.cookie('error_message', 'Could not add signature to the database')
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

app.get('/petition/signed', (req, res) => {
    res.render('thank-you', {
        layout: 'main'
    })
})

app.get('/petition/signers', (req, res) => {
    res.render('signers', {
        layout: 'main',
        people: ['janice', 'dave']
    })
})

app.listen(8080, () => {
    console.log('Listening on port 8080')
})
