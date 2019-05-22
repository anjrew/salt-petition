const express = require('express')
const router = express.Router()
const ROUTES = require('../routers/routes')
const COOKIES = require('../utils/cookies')
const PAGES = require('../view_data/page_data')
const index = require('../index')
const db = require('../utils/db')
const userLoggedIn = require('../middleware').userLoggedIn
<<<<<<< HEAD
const redis = require('../utils/redis')
const chalk = require('chalk')
const performance = require('perf_hooks').performance
// Implement redis
=======
>>>>>>> parent of 52c023d... View is now sorted

router.route(ROUTES.SIGNERS)

    .get(userLoggedIn, (req, res, next) => {
        const userID = req.session[COOKIES.ID]
        var start = performance.now()
        redis.get(db.SIGNERS).then((result) => {
            if (result) {
                var data = JSON.parse(result).rows
                console.log(chalk.blue(`Took ${performance.now() - start} milliseconds to get from Redis`))
                index.renderPage(res, new PAGES.SignersPage(data))
            } else {
                db.listSigners(userID).then((signers) => {
                    var tolist = signers.rows.map((signer) => {
                        return {
                            first: signer.first,
                            last: signer.last,
                            age: signer.age,
                            city: signer.city ? signer.city.charAt(0).toUpperCase() + signer.city.slice(1) : null,
                            url: signer.url
                        }
                    })
                    redis.setex(db.SIGNERS, 500, JSON.stringify(signers)).then(() => {
                        console.log(chalk.green('Signers saved to redis: ', signers))
                    }).catch((e) => {
                        console.log(chalk.red('Unable to save to Redis:', e))
                    })
                    console.log(chalk.blue(`Took ${performance.now() - start} milliseconds to get from Postgres`))
                    index.renderPage(res, new PAGES.SignersPage(tolist))
                }).catch((e) => {
                    console.log(e)
                    next()
                })
            }
        }).catch((e) => {
            console.log(chalk.red(`Error in REDIS GET:`, e))
        })
    })
module.exports = router
