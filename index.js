const express = require('express')
const app = express()
const hb = require('express-handlebars')

// const pg = require('pg');

const pg = require('pg')
const client = new pg.Client('postgres://spicedling:password@localhost:5432/cities')

const db = require('./utils/db.js')

app.engine('handlebars', hb())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.use(function (req, res, next) {
    console.log(req.url)
    if (req.çurl.endsWith('/')) {
        res.status = 302
        res.redirect('/petition')
    } else {
        next()
    }
})

app.get('/petition', (req, res) => {
    console.log('trying to render')
    res.render('petition', {
        layout: 'main'
    })
})

app.get('/petition/', (req, res) => {
    console.log('trying to render in here')
    res.render('petition', {
        layout: 'main'
    })
})

// app.get('/petition/:name', (req, res) => {
//     switch (name) {
//         case 'css' :
//             res.end(res.sendfile('public/styles.css'));
//             break;
//         case 'script.js' :
//             res.end(res.sendfile('public/styles.css'));
//             break;
//         default:
//             break;
//     }
// })

app.post('/petition', (req, res) => {

})

app.get('/petition/signed')

app.get('/petition/signers')

app.listen(8080, () => {
    console.log('Listening on port 8080')
})

// app.post('/add-city', (req, res) => {
//     db.addCity('Berlin', 'DE').then(() => {
//         res.redirect('./submitted')
//     })
// })
