const pages = require('../view_data/page_data');

test('Test ThankyouPage constructor', () => {
    expect(new pages.ThankyouPage('Name', 32)).toEqual(new pages.ThankyouPage('Name', 32))
})

test('Test ThankyouPage constructor throw', () => {
    function renderTest () { return new pages.ThankyouPage('Name', 'text') }
    expect(renderTest).toThrow()
})