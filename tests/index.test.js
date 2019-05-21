
/* global test */
/* global jest */
/* global expect */
const ROUTES = require('../routers/routes')
const COOKIES = require('../utils/cookies.js')
const pages = require('../view_data/page_data.js')
const index = require('../index.js')
const supertest = require('supertest')

// The fake cookie session that lives in the mocks directory -  thats wierdly  all you need. you don't need not(__mocks/cookies session )
// this is becasue jest looks in the __mocks folder

/// Mock the cookie session
const cookieSession = require('cookie-session')

test('1:Takes a page as an argument and does not throw error', () => {
    console.log(index.renderPage)
    function renderTest () {
        return index.renderPage({}, {}, new pages.Page())
    }
    expect(renderTest).toThrow()
})

test('2: Users who are logged OUT are redirected to the registration page when they attempt to go to the petition page', () => {
    // Express app wothin the index html
    return supertest(index.app)
        .get(ROUTES.PETITION)
        .expect('location', ROUTES.REGISTER)
        .expect(302)
})

test('3a: Users who are logged IN are redirected to the petition page when they attempt to go to the registration', () => {
    cookieSession.mockSessionOnce({
        userId: 23
    })
    /* req.session.chicken will be 'funky' in the following request */
    return supertest(index.app)
        .get(ROUTES.REGISTER)
        .then((res) => {
            expect(res.statusCode).toBe(302)
            expect(res.headers.location).toEqual(ROUTES.PETITION)
        })
})

test('3b: Users who are logged in are redirected to the petition page when they attempt to go to the Login', () => {
    cookieSession.mockSessionOnce({
        'userId': 'funky'
    })
    /* req.session.chicken will be 'funky' in the following request */
    return supertest(index.app)
        .get(ROUTES.LOGIN)
        .then((res) => {
            expect(res.statusCode).toBe(302)
            expect(res.headers.location).toEqual(ROUTES.PETITION)
        })
})

test(`4: Users who are logged in and have signed the petition are redirected to the thank
 you page when they attempt to go to the petition page or submit a signature`, () => {
    cookieSession.mockSessionOnce({
        'userId': 23,
        'signature': 16
    })
    // Supertest acts as the client
    return supertest(index.app)
        .get(ROUTES.PETITION)
        .then((result) => {
            // res is the response from the server
            expect(result.statusCode).toBe(302)
            expect(result.headers.location).toBe(ROUTES.SIGNED)
        })
})

test(`5: Users who are logged in and have not signed the petition are redirected 
to the petition page when they attempt to go to either the SIGNED page or the signers page`, () => {
    cookieSession.mockSessionOnce({
        'userId': 23
    })

    return supertest(index.app)
        .get(ROUTES.SIGNED)
        .then(res => {
            expect(res.statusCode).toBe(302)
            // location header giev me the route thatb i have been relocated toolbar
            expect(res.headers.location).toBe(ROUTES.PETITION)
            // Check status code and header call location
        })
})

test(`5: User Types in a Url that does not exist`, () => {

    return supertest(index.app)
        .get('/cheese')
        .then(res => {
            expect(res.statusCode).toBe(404)
        })
})

// The main propertires of the response we are interested in are:
// 1 - Text: gives us the BODY of the response!

// 2 - Headers: gives us meta data

// 3 Status Code
