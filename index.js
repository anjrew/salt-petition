const express = require('express')
const app = express()
const hb = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const pg = require('pg')
const client = new pg.Client('postgres://spicedling:password@localhost:5432/cities')
const db = require('./utils/db.js')
// const pg = require('pg');

// Setup

app.engine('handlebars', hb())
app.set('view engine', 'handlebars')
app.use(cookieParser())

// Very important to get the POST reests of forms
app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}))

// Main functions

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
            submissionError = propt
            res.redirect('/error')
        }
    }
    res.cookie('hasSigned', true, { maxAge: 900000, httpOnly: true })
    res.redirect('/petition/signed')
})

let submissionError = ''
app.get('/error', (req, res) => {
    res.render('error', {
        layout: 'main',
        error: submissionError
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
        people: [ 'janice', 'dave' ]
    })
})

app.listen(8080, () => {
    console.log('Listening on port 8080')
})
