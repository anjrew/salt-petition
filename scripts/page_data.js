'use strict'
const { Textfield, Button, FormField, Form, Footer } = require('./widget_data.js')

/**
     * @param {String} name - The name of the page
     * @param {Widget} data - The widget data for the page
     */

class Page {
    constructor (name, data) {
        this.name = name
        this.data = data
        this.data.layout = 'main'
        if (!this.name && !this.data) {
            throw Error('Arguments are missing')
        }
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
                title: 'Lets Login',
                fieldset: new FormField([
                    new Textfield('Email address', 'text', 'emailaddress', ''),
                    new Textfield('Password', 'password', 'password', '')
                ]),
                footer: new Footer(
                    'If you are already a member, please log in',
                    '/register',
                    'Log in!'),
                error: err
            })
    };
}

class SignPetitonPage extends Page {
    constructor (err) {
        super('form',
            {
                title: 'Time to sign the Petition!',
                fieldset: new FormField([
                    new Textfield('Email address', 'text', 'emailaddress', ''),
                    new Textfield('Password', 'password', 'password', '')
                ]),
                error: err
            })
    };
}

module.exports.SignPetitonPage = SignPetitonPage
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
