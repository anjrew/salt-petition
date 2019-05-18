'use strict'
const { Textfield, Button, FormField, Form, Footer, Link } = require('./widget_data.js')
const PageType = Object.freeze({ ERROR: 'error', FORM: 'form', SIGNERS: 'signers', SIGNED: 'signed', PETITION: 'petition' })
const LAYOUT = 'layout'
const { TableId } = require(`../utils/db`)
const Routes = Object.freeze({
    SIGNED: '/petition/signed',
    PETITION: '/petition',
    REGISTER: '/register',
    SIGNERS: '/petition/signers',
    LOGIN: '/login',
    LOGOUT: '/logout',
    PROFILE: '/profile',
    CITY: '/city',
    EDITPROFILE: '/edit-profile'
})

class Page {
    /**
    * @param {PageType} name - The name of the page.
    * @param {PageAttributes} data - The widget data for the page.
    * @property {Object} attributes - An attributes object which has details that are passed to the handlebars script.
    */
    constructor (type, attributes) {
        this.type = type
        this.attributes = attributes
        this.attributes.layout = 'main'
        if (!this.type && !this.attributes) {
            throw Error('Arguments are missing')
        }
    }
}

class SignUpPage extends Page {
    constructor (err) {
        super(PageType.FORM,
            {
                title: 'Make LAVA LAMPS exempt from VAT!',
                subtitle: 'Sign up below to make a change...',
                fieldset: new FormField([
                    new Textfield('First name', 'text', 'firstname', ''),
                    new Textfield('Last name', 'text', 'lastname', ''),
                    new Textfield('Email address', 'email', 'email', ''),
                    new Textfield('Password', 'password', 'password', '')
                ]),
                footer: new Footer(
                    'If you are already a member, please ',
                    Routes.LOGIN,
                    'Log in!'),
                error: err
            })
    };
}

class LoginPage extends Page {
    /**
    * @constructor
    * @param {any} err - An Error to show the user.
    */
    constructor (err) {
        super(PageType.FORM, {
            title: 'Let\'s Login',
            fieldset: new FormField([
                new Textfield('Email address', 'email', 'email', ''),
                new Textfield('Password', 'password', 'password', '')
            ]),
            footer: new Footer(
                `If you don't have an account yet please Register`,
                Routes.REGISTER,
                'Register'),
            loginPage: true,
            error: err
        })
    };
}

class SignPetitonPage extends Page {
    constructor (firstnameIn, err) {
        super(PageType.PETITION,
            {
                error: err,
                signature: true,
                firstname: firstnameIn,
                loggedIn: true
            })
    };
}

class ProfilePage extends Page {
    /**
    * @constructor
    * @param {string} err - The error to render to screen in case of an Error.
    */
    constructor (err) {
        super(PageType.FORM, {
            loggedIn: true,
            error: err,
            title: 'Please tell us a little more about yourself',
            fieldset: new FormField([
                new Textfield('Age', 'text', 'age', ''),
                new Textfield('City', 'text', 'city', ''),
                new Textfield('Homepage', 'text', 'url', '')
            ]),
            buttonName: 'Continue'
        })
    }
}

class EditProfilePage extends Page {
    /**
    * @constructor
        @param {string} err - The error to render to screen in case of an Error.
        @param {Object} detailsObj - An object with the details of the values to be filled into the page.
        values The details object should be:
    *        - firstname
    *        - lastname
    *        - password
    *        - age
    *        - city
    *        - url
    */
    constructor (detailsObj, err) {
        super(PageType.FORM, {
            loggedIn: true,
            error: err,
            title: 'Tell the world a little more about yourself...',
            fieldset: new FormField([
                new Textfield('First name', 'text', 'firstname', '', detailsObj.firstname),
                new Textfield('Last name', 'text', 'lastname', '', detailsObj.lastname),
                new Textfield('Email address', 'email', 'email', '', detailsObj.email),
                new Textfield('Password', 'password', 'password', '', ''),
                new Textfield('Age', 'text', 'age', '', detailsObj.age),
                new Textfield('City', 'text', 'city', '', detailsObj.city),
                new Textfield('Homepage', 'text', 'url', '', detailsObj.url)
            ]),
            buttonName: 'Continue',
            editProfile: true
        })
    }
}

class SignedPage extends Page {
    /**
    * @constructor
    * @param {string} userName - The name of the person who just signed
    * @param {number} signedName - Text data for the image
    * @param {number} signers - The total number of signers
    * @property {Array<Link>} links - An array of links to display below the signature pad
    */
    constructor (userName, signedName, signers) {
        if (!userName && !signedName && !signers) {
            throw Error('Arguments are missing for Thankyou page')
        }
        if (isNaN(signers)) {
            throw Error('Signers is not a number')
        }

        var linksIn = [
            new Link('Edit your profile', Routes.EDITPROFILE),
            new Link('Delete your signature', Routes.SIGNED, true)
        ]

        if (signers === '1' || signers === 1) {
            linksIn.unshift(new Link('See the other signer', Routes.SIGNERS))
        } else if (signers > 1) {
            linksIn.unshift(new Link(`See the other ${signers} singers`, Routes.SIGNERS))
        }

        super(PageType.SIGNED, {
            loggedIn: true,
            name: userName,
            signature: signedName,
            signersCount: signers,
            links: linksIn
        })
    }
}

class SignersPage extends Page {
    /**
    * @constructor
    * @param {Array[signers]} - And array of signer data
    */
    constructor (signersArr, err) {
        if (!signersArr) {
            throw Error('Signers Argument is missing')
        }
        if (!Array.isArray(signersArr)) {
            throw Error('Signer amount is not a number')
        }
        super(PageType.SIGNERS, {
            error: err,
            loggedIn: true,
            signers: signersArr
        })
    }
}

exports.SignPetitonPage = SignPetitonPage
exports.Page = Page
exports.SignUpPage = SignUpPage
exports.LoginPage = LoginPage
exports.ProfilePage = ProfilePage
exports.SignedPage = SignedPage
exports.Routes = Routes
exports.SignersPage = SignersPage
exports.EditProfilePage = EditProfilePage
exports.LAYOUT = LAYOUT

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
