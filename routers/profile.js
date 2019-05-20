// Router directory in a file called profile.js
const express = require('express')
const router = express.Router()
const ROUTES = require('../routers/routes')
const COOKIES = require('../utils/cookies')
const PAGES = require('../view_data/page_data')
const index = require('../index')
const db = require('../utils/db')
const chalk = require('chalk')

const requireNoSignature = require('../middleware').requireNoSignature

router.route(ROUTES.PROFILE)
    .get(requireNoSignature, (req, res) => {
        console.log(chalk.yellow('in here'));
        const userId = req.session[COOKIES.ID]
        if (userId) {
            index.renderPage(res, new PAGES.ProfilePage())
        } else {
            res.redirect(ROUTES.REGISTER)
        }
    })
    .post((req, res, middleware) => {
        console.log(req.session)
        const userId = req.session[COOKIES.ID]
        const age = req.body.age === '' ? null : req.body.age

        db.addUserProfile(age, req.body.city, req.body.url, userId).then((result) => {
            console.log(result)
            req.session[COOKIES.AGE] = result.rows[0].age
            req.session[COOKIES.CITY] = result.rows[0].city
            req.session[COOKIES.URL] = result.rows[0].url
            req.session[COOKIES.LOGGEDIN] = true
            res.redirect(ROUTES.PETITION)
        }).catch((e) => {
            if (e.code === '22P02') {
                index.renderPage(res, new PAGES.ProfilePage(`Please enter a number for your age`))
            } else {
                index.renderPage(res, new PAGES.ProfilePage(`${e}`))
            }
        })
    })

module.exports = router
