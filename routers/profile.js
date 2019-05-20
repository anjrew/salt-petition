// Router directory in a file called profile.js
const express = require('express')
const router = express.Router()
const ROUTES = require('../view_data/page_data').ROUTES
const COOKIES = require('../utils/cookies')
const PAGES = require('../view_data/page_data')
const index = require('../index')
const db = require('../utils/db')

router.route(ROUTES.PROFILE)
    .get((req, res) => {
        console.log(COOKIES);
        console.log(COOKIES.ID);
        const userId = req.session[COOKIES.ID]
        if (userId) {
            console.log(index);
            
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
                renderPage(res, new PAGES.ProfilePage(`Please enter a number for your age`))
            } else {
                renderPage(res, new PAGES.ProfilePage(`${e}`))
            }
        })
    })

module.exports = router
