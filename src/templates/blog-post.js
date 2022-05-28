import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import "../styles/index.css";
const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark;
  const { title: siteTitle, social } = data.site.siteMetadata
  const { previous, next } = pageContext

  return (
    <Layout location={location} title={siteTitle} social={social}>
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article>
        { post.frontmatter.draft && (
          <div className="border bordercolor-washedred borderradius-2 paddingleft-medium backgroundcolor-orange">
            <h2 className="black">This is a draft. Don't forget.</h2>
          </div>
        )}
        <header>
          <h1 className="f1 washedblue marginbottom-xsmall">
            {post.frontmatter.title}
          </h1>
          <small className="white80 margintop-none f6">
            {post.frontmatter.date} • {post.timeToRead}min read
          </small>
        </header>
        <section 
          className="white80 marginbottom-large nested-copy-line-height 
          nested-copy-headline-line-height nested-copy-indent 
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
      timeToRead
      html
      frontmatter {
        draft
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`
