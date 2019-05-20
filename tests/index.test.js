
/* global test */
/* global jest */
/* global expect */
const ROUTES = require('../routers/routes')
const pages = require('../view_data/page_data.js')
const app = require('../index.js')
const supertest = require('supertest')
const chalk = require('chalk')

// The fake cookie session that lives in the mocks directory -  thats wierdly  all you need. you don't need not(__mocks/cookies session )
// this is becasue jest looks in the __mocks folder

/// Mock the cookie session
const cookieSession = require('cookie-Session')

test.only('Takes a page as an argument and does not throw error', () => {
    console.log(app.renderPage);
    function renderTest () {
        return app.renderPage({}, {}, new pages.Page())
    }
    expect(renderTest).toThrow()
})


// Change to supertest
test('Takes a page as an argument and does not throw error', () => {
    expect(supertest(app).renderTest).toThrow()
})

// A super test
test('GET / Login returns true', () => {
    // Supertest acts as the client
    return supertest(app)
        .get(ROUTES.LOGIN)
        .then((result) => {
            // res is the response from the server
            console.log(chalk.green(result))
            expect(result.statusCode).toBe(200)
            console.log(chalk.green(result.headers))
            // expect(res.headers['content'])
        })
})

test('Making a test with no cookies casues me to be refirected', () => {
    return supertest(app)
        .get(ROUTES.LOGIN)
        .then(res => {
            expect(res.statusCode).toBe(302)
            // location header giev me the route thatb i have been relocated toolbar
            expect(res.headers.location).toBe(ROUTES.REGISTER)
            // Check status code and header call location
        })
})

test('POST login with login cookie redirects to signed', () => {
    cookieSession.mockSessionOnce({
        whatever: true
    })

    return supertest(app)
        .get(ROUTES.LOGIN)
        .then(res => {
            console.log('body of the response!', res.text)
        })
})

// The main propertires of hte response we are interested in are:
// 1 - Text: gives us the BODY of the response!

// 2 - Headers: gives us meta data

// 3 Status Code
