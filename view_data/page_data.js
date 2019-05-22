'use strict'
const { Textfield, FormField, Footer, Link } = require('./widget_data.js')
const PageType = Object.freeze({ ERROR: 'error', FORM: 'form', SIGNERS: 'signers', SIGNED: 'signed', PETITION: 'petition' })
const LAYOUT = 'layout'
const ROUTES = Object.freeze({
    SIGNED: '/petition/signed',
    PETITION: '/petition',
    REGISTER: '/register',
    SIGNERS: '/petition/signers',
    LOGIN: '/login',
    LOGOUT: '/logout',
    PROFILE: '/profile',
    CITY: '/petition/signers/:city',
    EDITPROFILE: '/edit-profile',
    DELETESIG: '/delete-sig'
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

class RegisterPage extends Page {
    constructor (err) {
        super(PageType.FORM,
            {
                subtitle: 'Sign up below to make a change...',
                buttonName: 'Sign up',
                fieldset: new FormField([
                    new Textfield('First name', 'text', 'firstname', '', null, true),
                    new Textfield('Last name', 'text', 'lastname', '', null, true),
                    new Textfield('Email address', 'email', 'email', '', null, true),
                    new Textfield('Password', 'password', 'password', '', null, true)
                ]),
                footer: new Footer(
                    'If you are already a member, please ',
                    ROUTES.LOGIN,
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
                new Textfield('Email address', 'email', 'email', '', null, true),
                new Textfield('Password', 'password', 'password', '', null, true)
            ]),
            footer: new Footer(
                `If you don't have an account yet please `,
                ROUTES.REGISTER,
                'Register'),
            loginPage: true,
            buttonName: 'Log in',
            error: err
        })
    };
}

class PetitonPage extends Page {
    constructor (firstnameIn, err) {
        super(PageType.PETITION,
            {
                error: err,
                signature: true,
                firstname: firstnameIn,
                loggedIn: true,
                signaturePad: true
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
            title: 'Edit your profile below.',
            fieldset: new FormField([
                new Textfield('First name', 'text', 'firstname', '', detailsObj.firstname),
                new Textfield('Last name', 'text', 'lastname', '', detailsObj.lastname),
                new Textfield('Email address', 'email', 'email', '', detailsObj.email),
                new Textfield('Password', 'password', 'password', '', ''),
                new Textfield('Age', 'text', 'age', '', detailsObj.age),
                new Textfield('City', 'text', 'city', '', detailsObj.city),
                new Textfield('Homepage', 'text', 'url', '', detailsObj.url)
            ]),
            buttonName: 'Update',
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

        var linksIn = []

        if (signers === '1' || signers === 1) {
            linksIn.unshift(new Link('See the other signer', ROUTES.SIGNERS))
        } else if (signers > 0) {
            linksIn.unshift(new Link(`See the other ${signers} signers`, ROUTES.SIGNERS))
        }

        super(PageType.SIGNED, {
            loggedIn: true,
            name: userName,
            signature: signedName,
            signaturePad: true,
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

exports.PetitonPage = PetitonPage
exports.Page = Page
exports.RegisterPage = RegisterPage
exports.LoginPage = LoginPage
exports.ProfilePage = ProfilePage
exports.SignedPage = SignedPage
exports.ROUTES = ROUTES
exports.SignersPage = SignersPage
exports.EditProfilePage = EditProfilePage
exports.LAYOUT = LAYOUT

