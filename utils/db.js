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
    // return db.query(`SELECT CONCAT(first, ' ', last) AS name, signature FROM signatures;`)
    return db.query(
        `
        SELECT user_id FROM signatures
        JOIN user_profiles
        ON signatures.user_id = user_profiles.user_id;
        `
    )
}

// CONCAT(user_profiles.first, ' ', user_profiles.last) AS name, 
// user_profiles.age AS age,
// user_profiles.city AS city,
// user_profiles.url AS url
// FROM user_profiles
// JOIN songs
// ON singers.id = songs.singer_id;

module.exports = function getAmountOfSigners () {
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

module.exports.addUserProfile = function (age, city, url, userId) {
    return db.query(`
        INSERT INTO user_profiles(age, city, url, user_id) 
        VALUES ($1, $2, $3, $4)
        RETURNING id;
        `,
    [age, city, url, userId]
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
