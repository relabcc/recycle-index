module.exports = {
  siteMetadata: {
    url: 'https://recycle.rethinktw.org',
    title: "回收大百科",
    titleEn: "Recycle Index",
  },
  plugins: [
    "gatsby-plugin-emotion",
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: "GTM-TBZHKQZ",

        // Include GTM in development.
        //
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: false,
      },
    },
    {
      resolve: 'gatsby-plugin-web-font-loader',
      options: {
        google: {
          families: ['Concert One', 'Nunito Sans:600,700,900', 'Noto Sans TC:500,700,900']
        }
      }
    }
  ],
};
