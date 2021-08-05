const path = require('path')

const data = require('./src/containers/TrashPage/data/data.json')
const cfg = require('./src/containers/TrashPage/data/cfg.json')
const scale = require('./src/containers/TrashPage/data/scale.json')
const getFormatedTrashes = require('./src/containers/TrashPage/data/getFormatedTrashes')

function createTrashPage({ actions }) {
  const { createPage, createRedirect } = actions
  const component = path.resolve('./src/templates/trash.js')
  const trashes = getFormatedTrashes(data, scale, cfg)
  return Promise.all(trashes.filter(d => d.id).map(async (d) => {
    if (d.id < 10) {
      await createRedirect({ fromPath: `trash/0${d.id}`, toPath: `trash/${d.id}`, isPermanent: true })
    }
    await createPage({
      // will be the url for the page
      path: `trash/${d.id}`,
      // specify the component template of your choice
      component,
      // In the ^template's GraphQL query, 'id' will be available
      // as a GraphQL variable to query for this posts's data.
      context: {
        id: d.id,
        name: d.name,
        rawData: JSON.stringify(d),
      },
    })
    await createPage({
      // will be the url for the page
      path: `en/trash/${d.id}`,
      // specify the component template of your choice
      component,
      // In the ^template's GraphQL query, 'id' will be available
      // as a GraphQL variable to query for this posts's data.
      context: {
        id: d.id,
        name: d.name,
        rawData: JSON.stringify(d),
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
