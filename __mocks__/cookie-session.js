/* eslint-disable no-return-assign */
let tempSession; let session = {}

// Acting as the cookies session middleware
module.exports = () => (req, res, next) => {
    req.session = tempSession || session
    tempSession = null
    next()
}

// For multiple tests
module.exports.mockSession = sess => session = sess

// Can only be used once
module.exports.mockSessionOnce = sess => tempSession = sess
