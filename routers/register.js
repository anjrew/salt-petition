
const express = require('express')
const router = express.Router()
const ROUTES = require('../routers/routes')
const COOKIES = require('../utils/cookies')
const PAGES = require('../view_data/page_data')
const index = require('../index')
const db = require('../utils/db')
const encryption = require('../utils/encryption')
const userLoggedInAtEntry = require('../middleware').userLoggedInAtEntry

router.route(ROUTES.REGISTER)
    .get(userLoggedInAtEntry, (req, res, next) => {
        if (req.session[COOKIES.ID] || req.session[COOKIES.LOGGEDIN]) {
            req.session[COOKIES.ID] = null
            req.session[COOKIES.LOGGEDIN] = null
            res.redirect(ROUTES.REGISTER)
        } else {
            const userId = req.session[COOKIES.ID]
            req.session[COOKIES.LOGGEDIN] = null
            if (userId) {
                res.redirect(ROUTES.LOGIN)
            } else {
                index.renderPage(res, new PAGES.RegisterPage())
            }
        }
    })

    .post((req, res) => {
        if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password) {
            return index.renderPage(res, new PAGES.RegisterPage(`You did not fill in all the fields`))
        }
        encryption.hashPassword(req.body.password).then((hashedP) => {
            return db.addUser(req.body.firstname, req.body.lastname, req.body.email, hashedP)
        }).then((result) => {
            let id = result.rows[0].id
            req.session[COOKIES.ID] = id
            req.session[COOKIES.AGE] = null
            req.session[COOKIES.CITY] = null
            req.session[COOKIES.URL] = null
            req.session[COOKIES.SIGNATURE] = null
            res.redirect(ROUTES.PROFILE)
        }).catch((e) => {
            if (e.code === `23505`) {
                index.renderPage(res, new PAGES.RegisterPage(`We already have a user registed to that email`))
            } else {
                index.renderPage(res, new PAGES.RegisterPage(`Database ${e}`))
            }
        })
    })

module.exports = router
