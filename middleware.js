
const COOKIES = require('./index').COOKIES
const ROUTES = require('./routers/routes')

function requireNoSignature(req, res, next) {
    // next is a function we have to call in every single middleware function we ever write ever.
    if (req.session[COOKIES.SIGNATURE]) {
        // if signatureId exists, this if block will run!
        
        // this is my thank-you route
        res.redirect(ROUTES.SIGNED)
    } else {
        next()
    }
}