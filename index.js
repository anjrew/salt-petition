// IMPORTS
const express = require('express')
const app = express()
const hb = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const csurf = require('csurf')
const chalk = require('chalk')

// EXPORTS
module.exports.app = app

// MODULES
const PAGES = require('./view_data/page_data.js')
const routers = [
    require('./routers/home'),
    require('./routers/profile'),
    require('./routers/login'),
    require('./routers/petition'),
    require('./routers/register'),
    require('./routers/signed'),
    require('./routers/signers'),
    require('./routers/city'),
    require('./routers/logout'),
    require('./routers/edit_profile')
]

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

app.use(...routers)

/// Redis demo ////////////////////

const redis = require('./redis')

// This won't work because redis does not accept objects
// app.get('/redis-fun', function (req, res) {
//     redis.setex('cute-puppies', 120,
//         {
//             name: 'layla',
//             age: 9,
//             cutenessScore: 10000000
//         }
//     ).then(() => {
//         res.send('Cock')
//         // the code to be run after the property has been sset by redis
//     }).catch((e) => {
//         console.log(`Error in SETEX:`, e)
//     })
// })

// This works becasue we stringigy the object
app.get('/redis-fun', function (req, res) {
    redis.setex('cute-puppies', 12000,
        JSON.stringify({
            name: 'layla',
            age: 9,
            cutenessScore: 10000000
        })
    ).then(() => {
        res.send('Cock')
        // the code to be run after the property has been sset by redis
    }).catch((e) => {
        console.log(`Error in SETEX:`, e)
    })
})

// To GET from redis
app.get('/get-cute-puppies', function (req, res) {
    redis.get('cute-puppies').then((value) => {
        console.log(value)
        console.log(JSON.parse(value))
        // the code to be run after the property has been sset by redis
    }).catch((e) => {
        console.log(`Error in GET:`, e)
    })
})



// To Delete from redis
app.get('/delete-cute-puppies', function (req, res) {
    redis.del('get-cute-puppies').then((response) => {
        // will run after redis has completed the deletation
    }).catch((e) => {
        console.log(e)
    })
})

/// //////////////////////////////////

app.get('/error', (req, res) => {
    res.render('error', {
        layout: 'main',
        error: req.cookies.error_title,
        type: req.cookies.error_title,
        message: req.cookies.error_message
    })
})

app.get('*', (req, res) => {
    res.status(404)
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
if (require.main === module) {
    app.listen(process.env.PORT || 8080, () => {
        console.log(process.env.PORT ? `Online` : `Listening on port 8080`)
    })
}

// Parameters may be declared in a variety of syntactic forms
/**
 * @param {Object} req - The http request object.
 * @param {Page} page - A instance of a Page class or child.
 */
module.exports.renderPage = function renderPage (res, page) {
    if (!(page instanceof PAGES.Page)) {
        throw new Error(`Page argument is not of type "Page"`)
    } else {
        res.render(page.type, page.attributes)
    }
}
