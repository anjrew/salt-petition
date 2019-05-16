const { Textfield, Button } = require('../view_data/widget_data.js')

test('Test Textfield: When passed to correct arguments it passes test', () => {
    expect(new Textfield('Name', 'text', 'first', 'jan')).toEqual(new Textfield('Name', 'text', 'first', 'jan'))
})

test('Test Textfield:When not all parameters are given an error is thrown', () => {
    expect(new Textfield('Name', 'text', 'first')).toEqual(new Error('Not all fields complete in Textfield init'))
})

test('Test Textfield: label', () => {
    expect(new Textfield('Name', 'text', 'first', 'jan').label).toEqual('Name')
})

test('Test Textfield: inputType', () => {
    expect(new Textfield('Name', 'text', 'first', 'jan').inputType).toEqual('text')
})

test('Test Textfield: databaseId', () => {
    expect(new Textfield('Name', 'text', 'first', 'jan').databaseId).toEqual('first')
})

test('Test Textfield: placeholder', () => {5
    expect(new Textfield('Name', 'text', 'first', 'jan').placeholder).toEqual('jan')
})

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
