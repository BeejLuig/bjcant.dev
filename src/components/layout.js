import React from "react"
import { Link } from "gatsby"

class Layout extends React.Component {
  render() {
    const { location, title, social, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

    if (location.pathname === rootPath) {
      header = (
        <h1
          className="washedblue marginvertical-none f1-ns f2 code"
        >
          <Link
            className="link"
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h1>
      )
    } else {
      header = (
        <h3
          className="display-inline marginvertical-none lightblue f3 code"
        >
          <Link
            className="link hover-dim "
            to={`/`}
          >
            {title}
          </Link>
        </h3>
      )
    }
    return (
      <div
        className="maxwidth-xxxxxlarge center paddingvertical-large paddinghorizontal-large-ns paddinghorizontal-medium"
      >
        <header className="marginvertical-medium">{header}</header>
        <main>{children}</main>
        <footer className="nearwhite clearfix paddingtop-xlarge">
          <ul className="list margin-none padding-none float-left">
          {
            Object.keys(social)
              .sort()
              .map((key, idx, arr) => (
                <li className="paddingright-xsmall display-inlineblock" key={key}>
                  { idx > 0 && idx < arr.length && '/  '}
                  <a className="link lightblue hover-dim" href={social[key]} rel="nofollow noopener">{key}</a>
                </li>
              ))
          }
          </ul>
          <div className="float-right">
            <span className="green">© {new Date().getFullYear()}</span> Built with 💙
          </div>
        </footer>
      </div>
    )
  }
}

export default Layout
