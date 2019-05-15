'use strict'
const { Textfield, Button, FormField, Form } = require('./widget_data.js')

/**
     * @param {String} name - The name of the page
     * @param {Widget} data - The widget data for the page
     */

class Page {
    constructor (name, data) {
        this.name = name
        this.data = data
        this.data.layout = 'main'
    };
}

class SignUpPage extends Page {
    constructor (err) {
        super('form',
            {
                title: 'Lets sign you up!',
                fieldset: new FormField([
                    new Textfield('First name', 'text', 'firstname', ''),
                    new Textfield('Last name', 'text', 'lastname', ''),
                    new Textfield('Email address', 'text', 'emailaddress', ''),
                    new Textfield('Password', 'password', 'password', '')
                ]),
                error: err
            })
    };
}

class LoginPage extends Page {
    constructor (err) {
        super('form',
            {
                title: 'Lets sign you up!',
                fieldset: new FormField([
                    new Textfield('Email address', 'text', 'emailaddress', ''),
                    new Textfield('Password', 'password', 'password', '')
                ]),
                error: err
            })
    };
}

module.exports.Page = Page
module.exports.SignUpPage = SignUpPage
module.exports.LoginPage = LoginPage

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
