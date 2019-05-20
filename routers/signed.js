// Router directory in a file called profile.js
const express = require('express')
const router = express.Router()
const ROUTES = require('../routers/routes')
const COOKIES = require('../utils/cookies')
const PAGES = require('../view_data/page_data')
const index = require('../index')
const db = require('../utils/db')
const userLoggedIn = require('../middleware').userLoggedIn

router.route(ROUTES.SIGNED)
    .get(userLoggedIn, (req, res, next) => {
        let sigId = req.session[COOKIES.SIGNATURE]
        let userID = req.session[COOKIES.ID]
        db.getSignatureWithSigId(sigId).then((sigResult) => {
            const signature = sigResult.rows[0]
            if (!signature) {
                req.session[COOKIES.SIGNATURE] = null
                res.redirect(ROUTES.PETITION)
            } else {
                db.signersCount(userID).then((results) => {
                    if (results.rows[0] < 1) {
                        res.redirect(ROUTES.PETITION)
                    } else {
                        const name = req.session[COOKIES.FIRSTNAME]
                        const signature = sigResult.rows[0].signature
                        const signersCount = results.rows[0].count
                        index.renderPage(res, new PAGES.SignedPage(name, signature, signersCount))
                    }
                })
            }
        }).catch((e) => {
            console.log(e)
            next()
        })
    })
    .post(userLoggedIn, (req, res, next) => {
        db.deleteSignature(req.session[COOKIES.SIGNATURE]).then(() => {
            req.cookies[COOKIES.SIGNATURE] = null
            res.redirect(ROUTES.PETITION)
        }).catch((e) => {
            console.log(e)
            next()
        })
    })

module.exports = router
