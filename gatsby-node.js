const path = require('path')
const { slash } = require(`gatsby-core-utils`)

const trashes = require('./src/containers/TrashPage/data/data.json')

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions
  const component = path.resolve('./src/templates/trash.js')
  trashes.filter(d => d['最終序號']).forEach(d => {
    if (d['最終序號'] < 10) {
      createPage({
        // will be the url for the page
        path: `trash/0${d['最終序號']}`,
        // specify the component template of your choice
        component,
        // In the ^template's GraphQL query, 'id' will be available
        // as a GraphQL variable to query for this posts's data.
        context: {
          id: d['最終序號'],
        },
      })
    }
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
    createPage({
      // will be the url for the page
      path: `en/trash/${d['最終序號']}`,
      // specify the component template of your choice
      component,
      // In the ^template's GraphQL query, 'id' will be available
      // as a GraphQL variable to query for this posts's data.
      context: {
        id: d['最終序號'],
      },
    })
  })

  const {
    data: {
      allWpPost: { nodes: allPosts },
    },
  } = await graphql(`
    query {
      allWpPost {
        nodes {
          id
          uri
        }
      }
    }
  `)
  const postTemplate = path.resolve(`./src/templates/post.js`)
  allPosts.forEach(post => {
    createPage({
      // will be the url for the page
      path: `article${post.uri}`,
      // specify the component template of your choice
      component: slash(postTemplate),
      // In the ^template's GraphQL query, 'id' will be available
      // as a GraphQL variable to query for this post's data.
      context: {
        id: post.id,
      },
    })
  })

}
