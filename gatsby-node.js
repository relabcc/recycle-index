const path = require('path')
const tashes = require('./src/containers/TrashPage/data/data.json')

exports.createPages = async ({ actions }) => {
  const { createPage } = actions
  const component = path.resolve('./src/templates/trash.js')
  tashes.filter(d => d['最終序號']).forEach(d => {
    createPage({
      // will be the url for the page
      path: `trash/${d['最終序號']}`,
      // specify the component template of your choice
      component,
      // In the ^template's GraphQL query, 'id' will be available
      // as a GraphQL variable to query for this posts's data.
      context: {
        id: d['最終序號'],
      },
    })
  })
}
