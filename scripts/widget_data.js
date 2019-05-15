/**
 * A constructor for the data for a TextField
 */
module.exports.Textfield = function (label, inputType, databaseId, placeholder) {
    this.label = label
    this.inputType = inputType
    this.databaseId = databaseId
    this.placeholder = placeholder
    if (!(label && inputType && databaseId && placeholder)) {
        throw new Error('Not all fields complete in Textfield init')
    }
}

/**
 * A constructor for the data for a Button
 */
module.exports.Button = function (route, label) {
    this.route = route
    this.label = label
    if (!(route && label)) {
        throw new Error('Not all fields complete in Button init')
    }
}
