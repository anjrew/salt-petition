const express = require('express')
const router = express.Router()
const ROUTES = require('../routers/routes')
const PAGES = require('../view_data/page_data')
const index = require('../index')
const db = require('../utils/db')
const userLoggedIn = require('../middleware').userLoggedIn

router.route(ROUTES.CITY)
    .get(userLoggedIn, (req, res, next) => {
        const city = req.params.city
        if (city) {
            db.listSignersByCity(city).then((signers) => {
                var tolist = signers.rows.map((signer) => {
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
        } else {
            next()
        }
    })

module.exports = router
