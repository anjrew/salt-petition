/* global test */
/* global expect */
const pages = require('../view_data/page_data')

test('Test SignedPage constructor', () => {
    expect(new pages.SignedPage('Name', 'advadv', 32).attributes.name).toBe('Name')
})

test('Test SignedPage constructor throw', () => {
    function renderTest () { return new pages.SignedPage() }
    expect(renderTest).toThrow()
})

test('Test SignersPage constructor for correct type of Array', () => {
    expect(new pages.SignersPage(['Name', 'bill']).attributes.signers[1]).toBe('bill')
})

test('Test SignersPage constructor throw', () => {
    function renderTest () { return new pages.SignersPage('Name') }
    expect(renderTest).toThrow()
})

test('Test SignedPage constructor throw on singers not being a number', () => {
    function renderTest () { return new pages.SignedPage('userName', 'signedName', 'Singers') }
    expect(renderTest).toThrow()
})

test('Test SignedPage : if signers 0 then links length should be 2', () => {
    expect(new pages.SignedPage('userName', 'signedName', 0).attributes.links.length).toBe(0)
})

test('Test SignedPage : if signers greater than 0 then links should be 3', () => {
    expect(new pages.SignedPage('userName', 'signedName', 1).attributes.links.length).toBe(1)
})
