const spicedPg = require('spiced-pg')

// process.env.NODE_ENV === "production" ? secrets = process.env : secrets = require('./secrets');
const dbUrl = process.env.DATABASE_URL || `postgres:postgres:postgres@localhost:5432/salt-petition`
const db = spicedPg(dbUrl)
const TableId = Object.freeze({
    USERID: 'user_id',
    SIGNATURE: 'signature',
    EMAIL: 'email',
    FIRSTNAME: 'first',
    LASTNAME: 'last',
    CITY: 'city',
    AGE: 'age',
    URL: 'url'
})
const RelationId = Object.freeze({
    SIGNATURES: 'signatures',
    USERS: 'users',
    USERPROFILES: 'user_profiles'
})

module.exports.test = function () {
    return true
}

module.exports.addSignature = function (userId, signatureUrl) {
    return db.query(`
        INSERT INTO signatures(user_id, signature) 
        VALUES ($1, $2)
        RETURNING id;
        `,
    [userId, signatureUrl]
    )
}

module.exports.getSignedInfo = function (userId) {
    return db.query(`
        INSERT INTO signatures(user_id, signature) 
        VALUES ($1, $2)
        RETURNING id;
        `,
    [userId]
    )
}

// TODO
module.exports.getSigners1 = function (userId) {
    return db.query(
        `
        SELECT CONCAT(users.first, ' ', users.last) AS name,city,age,url
        FROM signatures
        JOIN users ON signatures.user_id=users.id
        LEFT JOIN user_profiles ON users.id=user_profiles.user_id 
        WHERE users.id != $1;
        `,
        [userId]
    )
}

module.exports.getSigners = function (userId) {
    return db.query(
        `SELECT first,last,age,city,url FROM signatures
        CONCAT (first, " ", last) AS name
        FROM signatures
        JOIN users ON signatures.user_id=users.id
        LEFT JOIN user_profiles ON users.id=user_profiles.user_id;`,
        [userId]
    )
}

module.exports.listSigners = function listSigners () {
    return db.query(
        `SELECT first,last,age,city,url FROM signatures
        JOIN users ON signatures.user_id=users.id
        LEFT JOIN user_profiles ON users.id=user_profiles.user_id;
        `
    )
}

// module.exports.signersCount = function signersCount () {
//     return db.query(`SELECT COUNT(*) FROM signatures;`)
// }

// CONCAT(user_profiles.first, ' ', user_profiles.last) AS name
// user_profiles.age AS age,
// user_profiles.city AS city,
// user_profiles.url AS url
// FROM user_profiles
// JOIN songs
// ON singers.id = songs.singer_id;

module.exports.signersCount = function getAmountOfSigners () {
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
    return new Promise((resolve, reject) => {
        if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('www.') && !url === '') {
            reject(new Error('Not a valid Url. Leave blank if you like :)'))
        } else {
            if (url.startsWith('www.')) {
                url = 'https://'.concat(url)
            }
            resolve(
                db.query(`
                INSERT INTO user_profiles(age, city, url, user_id) 
                VALUES ($1, $2, $3, $4)
                RETURNING id;
                `,
                [age, city, url, userId]
                )
            )
        }
    })
}

module.exports.getSigId = function (userId) {
    return db.query(`SELECT id FROM signatures WHERE user_id =$1`, [userId])
}

module.exports.getNameAndSignature = function (userId) {
    return db.query(`
        SELECT first, signature
        FROM users 
        JOIN signatures
        ON signatures.user_id = users.id
        WHERE $1 = users.Id; 
        `,
    [userId]
    )
}

module.exports.getName = function (userId) {
    return db.query(`
        SELECT first
        FROM users 
        WHERE $1 = users.Id; 
        `,
    [userId]
    )
}

// Not working
module.exports.getProfileData = function (email) {
    return db.query(`
    SELECT * 
    FROM users 
    LEFT JOIN user_profiles
    ON users.id = user_profiles.user_id
    LEFT JOIN signatures
    ON user_profiles.user_id = signatures.user_id;
    WHERE users.email =$1;
        `,
    [email]
    )
}
// Not working
module.exports.getProfileDataById = function (id) {
    return db.query(`
    SELECT * 
    FROM users 
    LEFT JOIN user_profiles
    ON users.id = user_profiles.user_id
    LEFT JOIN signatures
    ON user_profiles.user_id = signatures.user_id;
    WHERE users.id =$1;
        `,
    [id]
    )
}

// TODO why not working
module.exports.getLoginData = function (email) {
    return db.query(`
    SELECT email,users.id, signature.id AS "sigId"
    FROM users
    LEFT JOIN signatures ON users.id=signatures.user_id
    WHERE email =$1;
    `,
    [email]
    )
}

// NOT WORKING
module.exports.getUserProfile = function (email) {
    return db.query(`
    SELECT users.id, first,last,email,password, signatures.id AS "sigId", age, city, url
    FROM users
    LEFT JOIN user_profiles
    ON users.id = user_profiles.user_id
    LEFT JOIN signatures 
    ON user_profiles.user_id=signatures.user_id
    WHERE email =$1;`,
    [email]
    )
}

module.exports.findUser = function findUser (email) {
    return db.query(
        `SELECT users.id, first,last,email,password,  age, city, url
        FROM users
        LEFT JOIN user_profiles
        ON users.id = user_profiles.userid
        WHERE email=$1;
        `,
        [email]
    );
};

module.exports.getUserProfileById = function (id) {
    return db.query(`
    SELECT first,last,email,user_profiles.age,user_profiles.city
    FROM users
    LEFT JOIN user_profiles ON users.id=user_profiles.user_id
    WHERE users.id =$1;`,
    [id]
    )
}

module.exports.getUserProfileById = function (id) {
    return db.query(`
    INSERT INTO user_profiles (name, age, oscars)
    VALUES ('Penélope Cruz', 43, 1)
    ON CONFLICT (name)
    DO UPDATE SET age = 43, oscars = 1;
    `,
    [id]
    )
}


// module.exports.getSignersByCity

// module.exports.getUsersByCity = function (city){
//      // return db.query(`
//     //     SELECT password FROM users WHERE $1 = email;
//     //     `,
//     // [email]
//     // )
//     // WHERE LOWER(city) = LOWER($1)
// }
