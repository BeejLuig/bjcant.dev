import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import "../styles/index.css";

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const { title: siteTitle, social } = this.props.data.site.siteMetadata
    const { previous, next } = this.props.pageContext

    return (
      <Layout location={this.props.location} title={siteTitle} social={social}>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />
        <article>
          <header>
            <h1 className="f1 washedblue marginbottom-xsmall">
              {post.frontmatter.title}
            </h1>
            <small className="white80 margintop-none f6">
              {post.frontmatter.date}
            </small>
          </header>
          <section 
            className="white80 marginbottom-large nested-copy-line-height 
            nested-copy-headline-line-height nested-list-reset nested-copy-indent 
            nested-copy-separator nested-img nested-links nested-list nested-table nested-hr nested-video"
            dangerouslySetInnerHTML={{ __html: post.html }} />
          <hr
            style={{
              marginBottom: '1em',
            }}
          />
          <footer>
            <Bio />
          </footer>
        </article>

        <nav>
          <ul
            style={{
              display: `flex`,
              flexWrap: `wrap`,
              justifyContent: `space-between`,
              listStyle: `none`,
              padding: 0,
            }}
          >
            <li>
              {previous && (
                <Link className="link hover-dim" to={previous.fields.slug} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link className="link hover-dim" to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        social {
          linkedin
          twitter
          github
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`
