// Router directory in a file called profile.js
const express = require('express')
const router = express.Router()
const ROUTES = require('../routers/routes')
const COOKIES = require('../utils/cookies')
const PAGES = require('../view_data/page_data')
const index = require('../index')
const db = require('../utils/db')
const userLoggedIn = require('../middleware').userLoggedIn

router.route(ROUTES.PETITION)
    .get(userLoggedIn, (req, res, next) => {
        console.log('in get pertition')

        const userId = req.session[COOKIES.ID]
        const signatureId = req.session[COOKIES.SIGNATURE]
        if (userId && signatureId) {
            console.log('Redirecting to signed');

            res.redirect(ROUTES.SIGNED)
        } else {
            db.getName(userId).then((result) => {
                const firstname = result.rows[0].first
                index.renderPage(res, new PAGES.PetitonPage(firstname))
            }).catch((e) => {
                console.log(e)
                next()
            })
        }
    })

    .post(userLoggedIn, (req, res) => {
        if (!req.body.signature) {
            console.log('in get pertition');

            index.renderPage(res, new PAGES.PetitonPage(`You did not fill in the signature`))
        } else {
            db.addSignature(req.session[COOKIES.ID], req.body.signature).then((result) => {
                req.session[COOKIES.SIGNATURE] = result.rows[0].id
                res.redirect(ROUTES.SIGNED)
            }).catch((e) => {
                res.cookie('error_title', 'Error', { maxAge: 1000, httpOnly: true })
                res.cookie('error_type', 'data_base_error', { maxAge: 1000, httpOnly: true })
                res.cookie(`error_message`, ` 'Database error: ${e}`, { maxAge: 1000, httpOnly: true })
                res.redirect('/error')
            })
        }
    })

module.exports = router
