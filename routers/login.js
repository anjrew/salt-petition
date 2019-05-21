// Router directory in a file called profile.js
const express = require('express')
const router = express.Router()
const ROUTES = require('../routers/routes')
const COOKIES = require('../utils/cookies')
const PAGES = require('../view_data/page_data')
const index = require('../index')
const db = require('../utils/db')
const encryption = require('../utils/encryption')
const userLoggedInAtEntry = require('../middleware').userLoggedInAtEntry

router.route(ROUTES.LOGIN)
    .get(userLoggedInAtEntry, (req, res) => {
        const userId = req.session[COOKIES.LOGGEDIN]
        if (userId) {
            res.redirect(ROUTES.PETITION)
        } else {
            index.renderPage(res, new PAGES.LoginPage())
        }
    })
    .post((req, res) => {
        const email = req.body.email
        const password = req.body.password
        if (password && email) {
            db.getHashedPWord(email).then((result) => {
                return encryption.checkPassword(password, result.rows[0].password)
            }).then((doesMatch) => {
                if (doesMatch) { return db.getUserProfile(email) }
            }).then((userProfile) => {
                req.session[COOKIES.ID] = userProfile.rows[0].id
                req.session[COOKIES.AGE] = userProfile.rows[0].age
                req.session[COOKIES.CITY] = userProfile.rows[0].city
                req.session[COOKIES.EMAIL] = userProfile.rows[0].email
                req.session[COOKIES.FIRSTNAME] = userProfile.rows[0].first
                req.session[COOKIES.LASTNAME] = userProfile.rows[0].last
                req.session[COOKIES.SIGNATURE] = userProfile.rows[0].sigId
                req.session[COOKIES.URL] = userProfile.rows[0].url
                req.session[COOKIES.LOGGEDIN] = true
                return db.getSigUserId(req.session[COOKIES.ID])
            }).then((result) => {
                if (result.rows[0]) {
                    let sig = result.rows[0].id
                    req.session[COOKIES.SIGNATURE] = sig
                }
                res.redirect(ROUTES.PETITION)
            }).catch((_e) => {
                index.renderPage(res, new PAGES.LoginPage(`SOZ! We did not find a user with these credentails :/`))
            })
        } else {
            index.renderPage(res, new PAGES.LoginPage('Please fill in both fields'))
        }
    })

module.exports = router
