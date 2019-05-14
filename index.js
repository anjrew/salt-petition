const express = require('express')
const app = express()
const hb = require('express-handlebars')
const bodyParser = require('body-parser')

// const pg = require('pg');

const pg = require('pg')
const client = new pg.Client('postgres://spicedling:password@localhost:5432/cities')

const db = require('./utils/db.js')

app.engine('handlebars', hb())
app.set('view engine', 'handlebars')

// Very important to get the POST reests of forms
app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}))

app.use(express.static(`${__dirname}/public`))

app.use(function (req, res, next) {
    next()
})

app.get('/petition', (req, res) => {
    res.render('petition', {
        layout: 'main'
    })
})

app.post('/petition', (req, res) => {
    for (var propt in req.body) {
        console.log(propt + ': ' + req.body[propt])
        if (req.body[propt]) {

        } else {
            submissionError = propt
            res.redirect('/error')
        }
    }
})

let submissionError = ''
app.get('/error', (req, res) => {
    res.render('error', {
        layout: 'main',
        error: submissionError
    })
})

app.get('/petition/signed', (req, res) => {
    res.render('signers', {
        layout: 'main',
        people: [ 'janice', 'dave' ]
    })
})

app.get('/petition/signers', (req, res) => {
    res.render('thank-you', {
        layout: 'main'
    })
})

app.listen(8080, () => {
    console.log('Listening on port 8080')
})

// app.post('/add-city', (req, res) => {
//     db.addCity('Berlin', 'DE').then(() => {
//         res.redirect('./submitted')
//     })
// })
