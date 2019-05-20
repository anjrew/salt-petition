const express = require('express')
const router = express.Router()
const ROUTES = require('../routers/routes')

router.route(ROUTES.LOGOUT)
    .get((req, res) => {
        req.session = null
        res.redirect(ROUTES.LOGIN)
    })

module.exports = router
