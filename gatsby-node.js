const path = require("path");
const { sampleSize, pick, mapValues } = require("lodash");

const data = require("./static/data/data.json");
const cfg = require("./static/data/cfg.json");
const scale = require("./static/data/scale.json");
const oceanTrash = require("./static/data/ocean-trash.json");
const getFormatedTrashes = require("./src/containers/TrashPage/data/getFormatedTrashes");
const handleGatsbyImage = require("./src/utils/handleGatsbyImage");

const getTrashes = (ids) => {
  const trashes = getFormatedTrashes(data, scale, cfg);

  const validTrashes = trashes.filter((d) => d.id);
  return ids ? ids.map((i) => validTrashes[i]) : trashes;
};

async function createTrashPage({ actions, graphql }) {
  const { createPage, createRedirect } = actions;
  const component = path.resolve("./src/templates/trash.js");
  const faceEditor = path.resolve("./src/containers/FaceEditor/index.js");
  const {
    data: { allFile },
  } = await graphql(
    `
      {
        allFile {
          edges {
            node {
              name
              relativeDirectory
              sourceInstanceName
              childImageSharp {
                large: gatsbyImageData(
                  placeholder: TRACED_SVG
                  layout: FULL_WIDTH
                  breakpoints: [512, 1024, 1680]
                )
                regular: gatsbyImageData(
                  placeholder: TRACED_SVG
                  layout: FULL_WIDTH
                  breakpoints: [256, 512]
                )
              }
            }
          }
        }
      }
    `
  );
  const gatsbyImages = handleGatsbyImage(allFile);

  // Extract ocean-trash images separately by sourceInstanceName
  const oceanTrashImages = {};
  allFile.edges.forEach(({ node }) => {
    if (node.sourceInstanceName === 'ocean-trash-images' && node.childImageSharp) {
      const decodedName = decodeURIComponent(node.name);
      oceanTrashImages[decodedName] = node.childImageSharp;
    }
  });

  const trashes = getTrashes();
  return Promise.all(
    trashes
      .filter((d) => d.id)
      .map(async (d, _, allTrashes) => {
        if (d.id < 10) {
          await createRedirect({
            fromPath: `trash/0${d.id}`,
            toPath: `trash/${d.id}`,
            isPermanent: true,
          });
        }
        const readMore = sampleSize(
          allTrashes.filter((t) => t.id !== d.id),
          5
        ).map((t) => {
          const gatsbyImg = pick(gatsbyImages[t.name][t.name], ["regular"]);
          return {
            ...t,
            gatsbyImg,
          };
        });
        const pickedImag = mapValues(gatsbyImages[d.name], (imgs) =>
          pick(imgs, ["large"])
        );
        const matchedOceanTrash = oceanTrash.find(item => item.回百垃圾 === d.name);

        // Add gatsby image data to oceanTrash if found
        let oceanTrashWithImage = null;
        if (matchedOceanTrash) {
          const oceanTrashImageName = matchedOceanTrash.海廢map;
          // Look for the image in oceanTrashImages extracted from ocean-trash-images folder
          const oceanTrashImageSharp = oceanTrashImages[oceanTrashImageName];
          oceanTrashWithImage = {
            ...matchedOceanTrash,
            gatsbyImg: oceanTrashImageSharp ? pick(oceanTrashImageSharp, ["large"]) : null,
          };
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
            gatsbyImg: JSON.stringify(pickedImag),
            readMore: JSON.stringify(readMore),
            oceanTrash: JSON.stringify(oceanTrashWithImage || null),
          },
        });
        if (process.env.NODE_ENV === "development" || process.env.CF_PAGES) {
          await createPage({
            // will be the url for the page
            path: `trash/${d.id}/face`,
            // specify the component template of your choice
            component: faceEditor,
            // In the ^template's GraphQL query, 'id' will be available
            // as a GraphQL variable to query for this posts's data.
            context: {
              id: d.id,
              name: d.name,
              rawData: JSON.stringify(d),
              gatsbyImg: JSON.stringify(pickedImag),
              readMore: JSON.stringify(readMore),
              oceanTrash: JSON.stringify(oceanTrashWithImage || null),
            },
          });
        }
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
            oceanTrash: JSON.stringify(oceanTrashWithImage || null),
          },
        });
      })
  );
}

exports.createPages = async (gatsbyUtilities) => {
  // const posts = await getPosts(gatsbyUtilities)
  // await createIndividualBlogPostPages({ posts, gatsbyUtilities })
  // await createBlogPostArchive({ posts, gatsbyUtilities })
  await createTrashPage(gatsbyUtilities);
};

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage, deletePage } = actions;
  if (page.path === "/" || page.path === "/en/") {
    const trashes = getTrashes([3, 55, 19, 34, 27, 17]);

    deletePage(page);
    // You can access the variable "house" in your page queries now
    createPage({
      ...page,
      context: {
        ...page.context,
        trashes: JSON.stringify(trashes),
        nameSearch: `/${trashes.map((t) => t.name).join("|")}/`,
      },
    });
  }
};
