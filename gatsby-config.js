module.exports = {
  siteMetadata: {
    title: `bjcant.dev`,
    author: `BJ Cantlupe`,
    description: `Web development blog of BJ Cantlupe`,
    siteUrl: `https://bjcant.dev`,
    social: {
      twitter: `https://twitter.com/BeejLuig`,
      github: `https://github.com/BeejLuig`,
      linkedin: `https://www.linkedin.com/in/bj-cantlupe/`
    },
  },
  flags: {
    PARALLEL_QUERY_RUNNING: true
  },
  plugins: [
    "gatsby-plugin-netlify",
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
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.nodes.map(node => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + node.fields.slug,
                  guid: site.siteMetadata.siteUrl + node.fields.slug,
                  custom_elements: [{ "content:encoded": node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  nodes {
                    excerpt
                    html
                    fields { 
                      slug 
                    }
                    frontmatter {
                      title
                      date
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "bjcant.dev RSS Feed",
            // optional configuration to insert feed reference in pages:
            // if `string` is used, it will be used to create RegExp and then test if pathname of
            // current page satisfied this regular expression;
            // if not provided or `undefined`, all pages will have feed reference inserted
            // match: "^/blog/",
            // optional configuration to specify external rss feed, such as feedburner
            // link: "https://feeds.feedburner.com/gatsby/blog",
          },
        ],
      },
    },
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
