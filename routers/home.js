const express = require('express')
const router = express.Router()
const ROUTES = require('../routers/routes')

router.route(ROUTES.HOME)
    .get((req, res) => { res.redirect(ROUTES.LOGIN) })

module.exports = router
