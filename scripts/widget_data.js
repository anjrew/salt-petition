'use strict'
class Widget {
    constructor () {
        this.type = 'WIDGET'
    }
}

class Textfield extends Widget {
    constructor (label, inputType, databaseId, placeholder) {
        super()
        this.label = label
        this.inputType = inputType
        this.databaseId = databaseId
        this.placeholder = placeholder
        if (!(label && inputType && databaseId)) {
            throw new Error('Not all fields complete in Textfield init')
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

class Form extends Widget {
    constructor (formField, submitLabel) {
        super()
        this.formField = formField
        this.submitLabel = submitLabel
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
