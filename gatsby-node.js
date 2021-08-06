const path = require('path')
const { groupBy, reduce, sampleSize, pick, mapValues } = require('lodash')

const data = require('./src/containers/TrashPage/data/data.json')
const cfg = require('./src/containers/TrashPage/data/cfg.json')
const scale = require('./src/containers/TrashPage/data/scale.json')
const getFormatedTrashes = require('./src/containers/TrashPage/data/getFormatedTrashes')

async function createTrashPage({ actions, graphql }) {
  const { createPage, createRedirect } = actions
  const component = path.resolve('./src/templates/trash.js')
  const trashes = getFormatedTrashes(data, scale, cfg)
  const { data: { allFile } } = await graphql(
    `
      {
        allFile {
          edges {
            node {
              name
              relativeDirectory
              childImageSharp {
                large: gatsbyImageData(
                  placeholder: BLURRED
                  quality: 90
                  layout: FULL_WIDTH
                  breakpoints: [512, 1024, 1680]
                )
                regular: gatsbyImageData(
                  placeholder: BLURRED
                  quality: 90
                  layout: FULL_WIDTH
                  breakpoints: [256, 512]
                )
              }
            }
          }
        }
      }
    `
  )

  const grouped = groupBy(allFile.edges, 'node.relativeDirectory')
  const gatsbyImages = reduce(grouped, (f, files, group) => {
    if (group) {
      const name = group.replace(/(\d|\s)+/, '')
      f[name] = {}
      files.forEach(({ node }) => {
        const [pn, partName] = node.name.split('-')
        f[name][partName || pn] = node.childImageSharp
      })
    } else {
      files.forEach(({ node }) => {
        f[node.name] = { [node.name]: node.childImageSharp }
      })
    }
    return f
  }, {})

  return Promise.all(trashes.filter(d => d.id).map(async (d, _, allTrashes) => {
    if (d.id < 10) {
      await createRedirect({ fromPath: `trash/0${d.id}`, toPath: `trash/${d.id}`, isPermanent: true })
    }
    const readMore = sampleSize(allTrashes.filter(t => t.id !== d.id), 5).map(t => ({
      ...t,
      gatsbyImg: pick(gatsbyImages[t.name][t.name], ['regular']),
    }))
    const pickedImag = mapValues(gatsbyImages[d.name], imgs => pick(imgs, ['large']))
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
        gatsbyImg: JSON.stringify(pickedImag),
        readMore: JSON.stringify(readMore),
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
        gatsbyImg: JSON.stringify(pickedImag),
        readMore: JSON.stringify(readMore),
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
