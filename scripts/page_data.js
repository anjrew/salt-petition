'use strict'

class Page {
    /**
     * @param {String} name - The name of the page
     * @param {Widget} data - The widget data for the page
     */
    constructor (name, data) {
        this.name = name
        this.data = data
        this.data.layout = 'main'
    };
}

module.exports.Page = Page

// class SignUp {
//     constructor () {
//         this.layout = 'main'
//     }
// }

// class EditProfile {
//     constructor () {
//         this.layout = 'main'
//     }
// }

// class MoreDetails {
//     constructor () {
//         this.layout = 'main'
//     }
// }

// class Signers {
//     constructor () {
//         this.layout = 'main'
//     }
// }

// class Sign {
//     constructor () {
//         this.layout = 'main'
//     }
// }
