import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import "../styles/index.css";

class NotFoundPage extends React.Component {
  render() {
    const { data } = this.props
    const { title: siteTitle, social } = data.site.siteMetadata

    return (
      <Layout location={this.props.location} title={siteTitle} social={social}>
        <SEO title="404: Not Found" />
        <h1 className="f1 nearwhite">Not Found</h1>
        <p className="nearwhite">You just hit a route that doesn&#39;t exist... the sadness.</p>
      </Layout>
    )
  }
}

export default NotFoundPage

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
  }
`
