const redis = require('redis')
const chalk = require('chalk')
const { promisify } = require('util')

const client = redis.createClient(
    process.env.REDIS_URL || { host: 'localhost', port: 6379 }
)

client.on('error', err => {
    console.log(chalk.red(`REDIS err:`, err))
})

// TO SETUP SETEX

// SET
exports.setex = promisify(client.setex).bind(client)
// GET
exports.get = promisify(client.get).bind(client)
// DEL
exports.del = promisify(client.del).bind(client)
exports.SAVETIME = 60 * 60 * 24 * 14
