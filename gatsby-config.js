require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    siteUrl: 'https://recycle.rethinktw.org',
    title: "回收大百科",
    titleEn: "Recycle Index",
  },
  flags: {
    PRESERVE_WEBPACK_CACHE: true,
  },
  plugins: [
    "gatsby-plugin-emotion",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: "GTM-TBZHKQZ",
      },
    },
    {
      resolve: 'gatsby-plugin-web-font-loader',
      options: {
        google: {
          families: ['Concert One', 'Nunito Sans:600,700,900', 'Noto Sans TC:500,700,900']
        }
      }
    },
    // {
    //   resolve: `gatsby-source-wordpress`,
    //   options: {
    //     url:
    //     // allows a fallback url if WPGRAPHQL_URL is not set in the env, this may be a local or remote WP instance.
    //       `${process.env.GATSBY_WORDPRESS_URL}/graphql`,
    //     schema: {
    //       //Prefixes all WP Types with "Wp" so "Post and allPost" become "WpPost and allWpPost".
    //       typePrefix: `Wp`,
    //       perPage: 20,
    //       requestConcurrency: 5,
    //       previewRequestConcurrency: 2,
    //     },
    //     develop: {
    //       //caches media files outside of Gatsby's default cache an thus allows them to persist through a cache reset.
    //       hardCacheMediaFiles: true,
    //     },
    //     type: {
    //       Post: {
    //         limit:
    //           process.env.NODE_ENV === `development`
    //             ? // Lets just pull 50 posts in development to make it easy on ourselves (aka. faster).
    //               50
    //             : // and we don't actually need more than 5000 in production for this particular site
    //               5000,
    //       },

    //     },
    //   },
    // },
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          placeholder: `blurred`,
          quality: 90,
        },
      },
    },
    `gatsby-plugin-image`,
  ],
};
