'use strict'
const InputTypes = Object.freeze({
    TEXT: 'text',
    PASSWORD: 'email',
    EMAIL: 'password'
})

class Widget {
    constructor () {
        this.type = 'WIDGET'
    }
}

class Textfield extends Widget {
    /**
    * @constructor
    * @param {string} label - The label of the textfield
    * @param {string} inputType - A string representation of an input type.
    * @param {string} databaseId - The database Id asscociated with this
    * @param {string} placeholder - placeholder text.
    * @param {string} value - An optional value that fills the textfield
    */
    constructor (label, inputType, databaseId, placeholder, value, required) {
        super()
        this.label = label
        this.inputType = inputType
        this.databaseId = databaseId
        this.placeholder = placeholder
        this.value = value
        this.required = required
        if (!(label && inputType && databaseId)) {
            throw new Error('Not all neccessary fields complete in Textfield init.')
        }
    }
}

class Button extends Widget {
    constructor (route, label) {
        super()
        this.route = route
        this.label = label
        if (!(route && label)) {
            throw new Error('Not all fields complete in Button init')
        }
    }
}

class FormField extends Widget {
    constructor (textfields) {
        super()
        this.textfields = textfields
        if (!textfields) {
            throw new Error('No fields Value')
        }
        if (!Array.isArray(textfields)) {
            throw new Error('Fields is not an array')
        }
        for (let index = 0; index < textfields.length; index++) {
            if (!(textfields[index] instanceof Textfield)) {
                throw new Error('Not all fields are of type TextField')
            }
        }
    }
}

class Footer extends Widget {
    constructor (text, link, linkText) {
        super()
        this.text = text
        this.link = link
        this.linkText = linkText
        if (!(text && link && linkText)) {
            throw new Error('Not all fields complete in Textfield init')
        }
    }
}

class Link extends Widget {
    /**
    * @constructor
    * @param {string} label - The label for the link
    * @param {string} route - the route for the link.
    * @param {boolean=} [post=false] - An option parameter to use post request for the link.
    */
    constructor (label, route, post = false) {
        super()
        this.label = label
        this.route = route
        this.post = post
        if (!label || !route) {
            throw new Error('Not all fields complete in Textfield init')
        }
        if (typeof label !== 'string' || typeof route !== 'string') {
            throw new Error('Incorrect type assigned to label or route parameter')
        }
    }
}

class Form extends Widget {
/**
* @constructor
* @param {FormField} formField
* @param {string} submitLabel - A string param.
* @param {boolean} [signature=false] - An optional param with a default value
*/
    constructor (formField, submitLabel, signature = false) {
        super()
        this.formField = formField
        this.submitLabel = submitLabel
        this.signature = signature
        if (!(formField && submitLabel)) {
            throw new Error('Not all fields complete in Form init')
        }
        if (!(formField instanceof FormField)) {
            throw new Error('Not all fields are of type field')
        }
        if (!(typeof submitLabel !== 'string')) {
            throw new Error('The label is not a string')
        }
    }
}

module.exports.Widget = Widget
module.exports.Textfield = Textfield
module.exports.Button = Button
module.exports.FormField = FormField
module.exports.Form = Form
module.exports.Footer = Footer
module.exports.Link = Link

/**
 * A constructor for the data for a Button
 */

//* ** OLD WAY ***///

// module.exports.Button = function (route, label) {
//     this.route = route
//     this.label = label
//     if (!(route && label)) {
//         throw new Error('Not all fields complete in Button init')
//     }
// }

// module.exports.Form = function (fields, submitLabel) {
//     this.route = route
//     this.label = label
//     if (!(route && label)) {

//     }
//     if (!Array.isArray(fields)) {
//         throw new Error('Not all fields complete in Button init')
//     }
//     for (let index = 0; index < fields.length; index++) {
//         if (!(fields[index] instanceof SomeObject)) {
//             throw new Error('Not all fields are of type field')
//         }
//     }
// }
