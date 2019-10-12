module.exports = {
  siteMetadata: {
    title: `bjcant.dev`,
    author: `BJ Cantlupe`,
    description: `Web development blog of BJ Cantlupe`,
    siteUrl: `https://bjcantlupe.com`,
    social: {
      twitter: `https://twitter.com/BeejLuig`,
      github: `https://github.com/BeejLuig`,
      linkedin: `https://www.linkedin.com/in/bj-cantlupe/`
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          { 
            resolve: `gatsby-remark-prismjs`,
            options: {
              noInlineHighlight: true,
            }
          },
          `gatsby-remark-external-links`,
          {
            resolve: `gatsby-remark-default-html-attrs`,
            options: {
              blockquote: ['white60 marginhorizontal-none margintop-none paddingleft-medium border-left borderwidth-2 bordercolor-blue'],
              break: ['break'],
              inlineCode: ['backgroundcolor-white10 borderradius-2 paddinghorizontal-xsmall wordbreak-break-word f5 f4-l'],
              image: ['center'],
              a: ['link', 'hover-dim', 'textdecoration-underline'],
              h1: ['f1'],
              h2: ['f2'],
              h3: ['f3'],
              h4: ['f4'],
              h5: ['f5'],
              h6: ['f6'],
              paragraph: ['f5 f4-ns'],
              strong: ['strong'],
              em: ['em'],
              s: ['s'],
              table: {
                className: 'tablelayout-fixed collapse',
                cellspacing: 'center'
              },
              'thematic-break': ['hr'],
            }
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          `gatsby-remark-heading-slug`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-82487145-1`,
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `BJ Cantlupe Blog`,
        short_name: `bjcant.dev`,
        start_url: `/`,
        background_color: `#111`,
        theme_color: `#111`,
        display: `minimal-ui`,
        icon: `content/assets/favicon-32x32.png`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: 'gatsby-remark-external-links',
      options: {
        target: '_blank',
      },
    },
    {
      resolve: `gatsby-plugin-draft`,
      options: {
        timezone: 'America/New_York',
        publishDraft: process.env.NODE_ENV !== 'production'
      }
    }
  ]
}
