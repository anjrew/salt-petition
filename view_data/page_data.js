'use strict'
const { Textfield, Button, FormField, Form, Footer } = require('./widget_data.js')
const PageType = Object.freeze({ ERROR: 'error', FORM: 'form', SIGNUP: 'sign-up', SIGNERS: 'signers', THANKYOU: 'thank-you' })

/**
 * @param {String} name - The name of the page
 * @param {Widget} data - The widget data for the page
 */

class Page {
    constructor (type, attributes) {
        this.type = type
        this.attributes = attributes
        this.attributes.layout = 'main'
        if (!this.type && !this.attributes) {
            throw Error('Arguments are missing')
        }
    }
}

// class PageAttributes {
//     constructor () {
//         this.name = name
//         this.data = data
//         this.data.layout = 'main'
//         if (!this.name && !this.data) {
//             throw Error('Arguments are missing')
//         }
//     }
// }

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
    /**
    * @constructor
    * @param {any} err - An Erro to show the user.
    */
    constructor (err) {
        super('form', {
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
        super('petition',
            {
                error: err
            })
    };
}

class ProfilePage extends Page {
    /**
    * @constructor
    * @param {string} - The error to render to screen in case of an Error
    */
    constructor (err) {
        super(PageType.FORM, {
            error: err,
            title: 'Pleasew tell us a little more about yourself',
            fieldset: new FormField([
                new Textfield('Age', 'text', 'age', ''),
                new Textfield('City', 'text', 'city', ''),
                new Textfield('Homepage', 'text', 'url', '')
            ])
        })
    }
}

module.exports.SignPetitonPage = SignPetitonPage
module.exports.Page = Page
module.exports.SignUpPage = SignUpPage
module.exports.LoginPage = LoginPage
module.exports.ProfilePage = ProfilePage

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
