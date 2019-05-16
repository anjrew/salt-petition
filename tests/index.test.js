const pages = require('../view_data/page_data.js')
jest.mock('../index.js')
const indexJs = require('../index.js')


test('Takes a page as an argument and does not throw error', () => {

    function renderTest () {
        return indexJs.renderPage({}, {}, new pages.Page())
    }
    expect(renderTest).toThrowError(`Page argument is not of type "Page"`)
})
