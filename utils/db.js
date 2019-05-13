// spicedPg setup

// const spicedPg = require('spiced-pg')
// const db = spicedPg('postgres:postgress/postgress/spicedling:password@localhost:5432/salt-petition')

// Database quieries
// Vunerable to SQL injection
function addCity(city, country) {
    db.query(`
        INSERT INTO cities(city, country) 
        VALUES (${city}, ${country} )`
    )
}

// With new syntax it will use it as a string and not a command

function addCity(city, country) {
    return db.query(`
        INSERT INTO cities(city, country) 
        VALUES ($1, $2 );
        `,
        [city, country]
    )
}

function addSignature(){

}

function getSigners(){

}

function getAmountOfSigners(){

}

