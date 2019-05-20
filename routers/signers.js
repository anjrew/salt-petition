const express = require('express')
const router = express.Router()
const ROUTES = require('../routers/routes')
const COOKIES = require('../utils/cookies')
const PAGES = require('../view_data/page_data')
const index = require('../index')
const db = require('../utils/db')
const userLoggedIn = require('../middleware').userLoggedIn

router.route(ROUTES.SIGNERS)
    .get(userLoggedIn, (req, res, next) => {
        const userID = req.session[COOKIES.ID]
        db.listSigners(userID).then((signers) => {
            var tolist = signers.rows.map((signer) => {
                console.log(signer.city.charAt(0).toUpperCase() + signer.city.slice(1))
                return {
                    first: signer.first,
                    last: signer.last,
                    age: signer.age,
                    city: signer.city.charAt(0).toUpperCase() + signer.city.slice(1),
                    url: signer.url
                }
            })
            index.renderPage(res, new PAGES.SignersPage(tolist))
        }).catch((e) => {
            console.log(e)
            next()
        })
    })
module.exports = router
