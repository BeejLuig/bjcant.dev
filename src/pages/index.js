import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import "../styles/index.css";

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const { social, title: siteTitle } = data.site.siteMetadata
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle} social={social}>
        <SEO title="All posts" />
        <Bio />
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <article key={node.fields.slug} className="white80 marginbottom-large">
              <header className="marginbottom-medium">
                <h2 className="marginbottom-xsmall margintop-none f2-ns f3 lineheight-title">
                  <Link to={node.fields.slug} className="link hover-dim">
                    {title}
                  </Link>
                </h2>
                <small className="f5-ns f6">{node.frontmatter.date}</small>
              </header>
              <section>
                <p className="f4-ns f5 lineheight-copy margintop-small"
                  dangerouslySetInnerHTML={{
                    __html: node.frontmatter.description || node.excerpt,
                  }}
                />
              </section>
            </article>
          )
        })}
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        social {
          linkedin
          twitter
          github
        }
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
