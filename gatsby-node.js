const path = require('path')

const trashes = require('./src/containers/TrashPage/data/data.json')

function createTrashPage({ actions }) {
  const { createPage, createRedirect } = actions
  const component = path.resolve('./src/templates/trash.js')
  return Promise.all(trashes.filter(d => d['最終序號']).map(async (d) => {
    if (d['最終序號'] < 10) {
      await createRedirect({ fromPath: `trash/0${d['最終序號']}`, toPath: `trash/${d['最終序號']}`, isPermanent: true })
    }
    await createPage({
      // will be the url for the page
      path: `trash/${d['最終序號']}`,
      // specify the component template of your choice
      component,
      // In the ^template's GraphQL query, 'id' will be available
      // as a GraphQL variable to query for this posts's data.
      context: {
        id: d['最終序號'],
        name: d['品項'],
      },
    })
    await createPage({
      // will be the url for the page
      path: `en/trash/${d['最終序號']}`,
      // specify the component template of your choice
      component,
      // In the ^template's GraphQL query, 'id' will be available
      // as a GraphQL variable to query for this posts's data.
      context: {
        id: d['最終序號'],
        name: d['品項'],
      },
    })
  }))
}

exports.createPages = async (gatsbyUtilities) => {
  // const posts = await getPosts(gatsbyUtilities)
  // await createIndividualBlogPostPages({ posts, gatsbyUtilities })
  // await createBlogPostArchive({ posts, gatsbyUtilities })
  await createTrashPage(gatsbyUtilities)
}
