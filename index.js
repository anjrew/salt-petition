const express = require('express')
const app = express()
const hb = require('express-handlebars')

// const pg = require('pg');

const pg = require('pg')
const client = new pg.Client('postgres://spicedling:password@localhost:5432/cities')

const db = require('./utils/db.js')

app.engine('handlebars', hb())
app.set('view engine', 'handlebars')

app.use(express.static(`${__dirname}/public`))

app.use(function (req, res, next) {
    next()
})

app.get('/petition', (req, res) => {
    res.render('petition', {
        layout: 'main'
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
