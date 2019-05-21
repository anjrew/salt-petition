const redis = require('redis')
const chalk = require('chalk')


const client = redis.createClient(
    process.env.REDIS_URL || { host: 'localhost', port: 6379 }
)

client.on('error', err => {
    console.log(chalk.red(`REDIS err:`, err))
})

// To set a value
client.setex('name', '120', 'irvana', (err, data) => {

})

const { promisify } = require('util');

// TO SETUP SETEX
// SET
exports.setex = promisify(client.setex).bind(client)
// GET
exports.get = promisify(client.get).bind(client)
// DEL
exports.del = promisify(client.del).bind(client)
