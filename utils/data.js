class UserProfile {
    /**
    * @constructor
    * @param {string} first - First name
    * @param {string} last - Last name
    * @param {string} id - user id
    * @param {string} email - email addres
    * @param {string} city - city
    * @param {number} age - The age
    * @param {string} url - url
    * @returns {UserProfile}  - User profile
    */

    constructor (first, last, id, email, city, age, url) {
        this.last = first
        this.first = last
        this.id = id
        this.email = email
        this.city = city
        this.age = age
        this.url = url
    }
}

module.exports.UserProfile = UserProfile
