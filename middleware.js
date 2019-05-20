module.exports = {
    requireNoSignature,
    userLoggedIn
}
const COOKIES = require('./utils/cookies')
const ROUTES = require('./routers/routes')
const chalk = require('chalk')

function requireNoSignature (req, res, next) {
    const isSigned = req.session[COOKIES.SIGNATURE]
    if (isSigned) {
        // if signatureId exists, this if block will run!
        // this is my signed route
        res.redirect(ROUTES.SIGNED)
    } else {
        next()
    }
}

function userLoggedIn (req, res, next) {
    const userId = req.session[COOKIES.ID]
    if (!userId) {
        // if signatureId exists, this if block will run!
        // this is my signed route
        console.log(chalk.green('going to signed in midddleware'))     
        res.redirect(ROUTES.LOGIN)
    } else {
        next()
    }
}
