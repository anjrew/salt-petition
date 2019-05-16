const spicedPg = require('spiced-pg')
const db = spicedPg(`postgres:postgres:postgres@localhost:5432/salt-petition`)

exports.test = function () {
    return true
}

exports.addSignature = function (userId, signatureUrl) {
    return db.query(`
        INSERT INTO signatures(user_id, signature) 
        VALUES ($1, $2)
        RETURNING id;
        `,
    [userId, signatureUrl]
    )
}

exports.getSigners = function () {
    // return db.query(`SELECT CONCAT(first, ' ', last) AS name, signature FROM signatures;`)
    return db.query(
        `
        SELECT user_id FROM signatures
        JOIN user_profiles
        ON signatures.user_id = user_profiles.user_id;
        `
    )
}

// CONCAT(user_profiles.first, ' ', user_profiles.last) AS name
// user_profiles.age AS age,
// user_profiles.city AS city,
// user_profiles.url AS url
// FROM user_profiles
// JOIN songs
// ON singers.id = songs.singer_id;

exports = function getAmountOfSigners () {
    return db.query('SELECT COUNT(id) FROM signatures;')
}

// USER QUERIES

exports.addUser = function (first, last, email, password) {
    return db.query(`
        INSERT INTO users(first, last, email, password) 
        VALUES ($1, $2, $3, $4)
        RETURNING id;
        `,
    [first, last, email, password]
    )
}

exports.getHashedPWord = function (email) {
    return db.query(`
        SELECT password FROM users WHERE $1 = email; 
        `,
    [email]
    )
}

exports.addUserProfile = function (age, city, url, userId) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        throw new Error('Not a valid Url')
    }
    return db.query(`
        INSERT INTO user_profiles(age, city, url, user_id) 
        VALUES ($1, $2, $3, $4)
        RETURNING id;
        `,
    [age, city, url, userId]
    )
}

exports.getSigId = function (userId) {
    return db.query(`SELECT id FROM signatures WHERE user_id =$1`, [userId])
}

exports.getNameAndSignature = function (userId) {
    return db.query(`
        SELECT first FROM users 
        WHERE $1 = userId; 
 
        `,
    [userId]
    )
}

module.exports.getProfileData = function (userId) {
    return db.query(`
    SELECT * FROM user_profiles WHERE user_id =$1;
        `,
    [userId]
    )
}

// exports.getSignersByCity

// exports.getUsersByCity = function (city){
//      // return db.query(`
//     //     SELECT password FROM users WHERE $1 = email; 
//     //     `,
//     // [email]
//     // )
//     // WHERE LOWER(city) = LOWER($1)
// }
