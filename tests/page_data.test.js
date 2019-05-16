const pages = require('../view_data/page_data');

test('Test ThankyouPage constructor', () => {
    expect(new pages.ThankyouPage('Name', 32).attributes.name).toBe('Name')
})

test('Test ThankyouPage constructor throw', () => {
    function renderTest () { return new pages.ThankyouPage() }
    expect(renderTest).toThrow()
})

test('Test SignersPage constructor for correct type of Array', () => {
    expect( new pages.SignersPage(['Name', 'bill']).attributes.signers[1]).toBe('bill')
})

test('Test SignersPage constructor throw', () => {
    function renderTest () { return new pages.SignersPage('Name') }
    expect(renderTest).toThrow()
})
