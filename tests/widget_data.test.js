const Widgets = require('../view_data/widget_data.js')

test('Test Textfield: When passed to correct arguments it passes test', () => {
    expect(new Widgets.Textfield('Name', 'text', 'first', 'jan')).toEqual(new Widgets.Textfield('Name', 'text', 'first', 'jan'))
})

test('Test Textfield: When not all parameters are given an error is thrown', () => {
    function renderTest () {
        return new Widgets.Textfield('Name', 'text')
    }
    expect(renderTest).toThrow()
})

test('Test Textfield: label', () => {
    expect(new Widgets.Textfield('Name', 'text', 'first', 'jan').label).toEqual('Name')
})

test('Test Textfield: inputType', () => {
    expect(new Widgets.Textfield('Name', 'text', 'first', 'jan').inputType).toEqual('text')
})

test('Test Textfield: databaseId', () => {
    expect(new Widgets.Textfield('Name', 'text', 'first', 'jan').databaseId).toEqual('first')
})

test('Test Textfield: placeholder', () => {
    expect(new Widgets.Textfield('Name', 'text', 'first', 'jan').placeholder).toEqual('jan')
})

test('Test link: has default post value FALSE', () => {
    expect(new Widgets.Link('label', 'route').post).toEqual(false)
})

test('Test link: if has missing parameter throws', () => {
    function renderTest () {
        return new Widgets.Textfield('Name', 'text')
    }
    expect(renderTest).toThrow()
})

test('Test link: check if wrong type is input to throw', () => {
    function renderTestOne () {
        return new Widgets.Link('label', false)
    }
    expect(renderTestOne).toThrow()

    function renderTestTwo () {
        return new Widgets.Link(false, 'route')
    }
    expect(renderTestTwo).toThrow()
})

test
// label
// inputType
// databaseId
// placeholder

// test('The search case is sensative', () => {
//     expect(countries.find('Afghanistan')).toEqual(['Afghanistan']);
//     expect(countries.find('afghanistan')).toEqual(['Afghanistan']);
// });

// test('If there are no matching countries, an empty array is returned',() => {
//     expect(countries.find('asdljhvbajhkvbs')).toEqual([]);
// });
