module.exports = {
  siteMetadata: {
    siteUrl: "https://www.yourdomain.tld",
    title: "D2 Info",
  },
  pathPrefix: `/d2-info`,
  plugins: [
    `gatsby-transformer-json`,
    `gatsby-plugin-material-ui`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `./src/data/`,
      },
    },
  ],
};
