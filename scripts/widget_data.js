module.exports.Textfield = function (label, inputType, databaseId, placeholder) {
    this.label = label
    this.inputType = inputType
    this.databaseId = databaseId
    this.placeholder = placeholder
}

module.exports.Button = function (route, label) {
    this.route = route
    this.label = label
}
