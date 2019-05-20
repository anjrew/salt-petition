module.exports = {
    requireNoSignature,
    userLoggedIn
}
const COOKIES = require('./utils/cookies')
const ROUTES = require('./routers/routes')

function requireNoSignature (req, res, next) {
    if (req.session[COOKIES.SIGNATURE]) {
        // if signatureId exists, this if block will run!
        // this is my signed route
        res.redirect(ROUTES.SIGNED)
    } else {
        next()
    }
}

function userLoggedIn (req, res, next) {
    if (req.session[COOKIES.ID]) {
        // if signatureId exists, this if block will run!
        // this is my signed route
        res.redirect(ROUTES.SIGNED)
    } else {
        next()
    }
}
