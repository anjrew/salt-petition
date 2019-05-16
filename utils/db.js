// spicedPg setup

const spicedPg = require('spiced-pg')
const db = spicedPg(`postgres:postgres:postgres@localhost:5432/salt-petition`)
// Database quieries
// Vunerable to SQL injection without "$" thing

/**
    * This is just a default test function
    */
module.exports.test = function () {
    return true
}

// SIGNATURE QUERYS
module.exports.addSignature = function (userId, signatureUrl) {
    return db.query(`
        INSERT INTO signatures(user_id, signature) 
        VALUES ($1, $2)
        RETURNING id;
        `,
    [userId, signatureUrl]
    )
}

module.exports.getSigners = function () {
    return db.query(`SELECT CONCAT(first, ' ', last) AS name, signature FROM signatures;`)
}

module.exports.getAmountOfSigners = function () {
    return db.query('SELECT COUNT(id) FROM signatures;')
}

// USER QUERIES

module.exports.addUser = function (first, last, email, password) {
    return db.query(`
        INSERT INTO users(first, last, email, password) 
        VALUES ($1, $2, $3, $4)
        RETURNING id;
        `,
    [first, last, email, password]
    )
}

module.exports.getHashedPWord = function (email) {
    return db.query(`
        SELECT password FROM users WHERE $1 = email; 
        `,
    [email]
    )
}

module.exports.getNameAndSignature = function (email) {
    // return db.query(`
    //     SELECT password FROM users WHERE $1 = email; 
    //     `,
    // [email]
    // )
}

module.exports.getSingersByCity = function (){
     // return db.query(`
    //     SELECT password FROM users WHERE $1 = email; 
    //     `,
    // [email]
    // )
    // WHERE LOWER(city) = LOWER($1)
}


// function addCity(city, country) {
//     db.query(`
//         INSERT INTO cities(city, country)
//         VALUES (${city}, ${country} )`
//     )
// }

// // With new syntax it will use it as a string and not a command

// function addCity(city, country) {
//     return db.query(`
//         INSERT INTO cities(city, country)
//         VALUES ($1, $2 );
//         `,
//         [city, country]
//     )
// }
