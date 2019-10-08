/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useEffect, useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.png/" }) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author
          social {
            twitter
          }
        }
      }
    }
  `)
  
  const colors = [
    'lightblue',
    'lightpurple',
    'red',
    'lightred',
    'lightpink',
    'hotpink',
    'pink',
    'lightgreen',
    'green',
    'gold',
    'yellow',
    'lightyellow',
  ]
  const rootPath = `${__PATH_PREFIX__}/`
  const [color, setColor] = useState('');
  let index = 0;
  useEffect(() => {
    if (window.location.pathname === rootPath) {
      let interval
      let timeout = setTimeout(() => {
        interval = setInterval(() => {
          setColor(colors[index]);
          index = index === colors.length ? 0 : index + 1
        }, 700);
      }, 6e4)
      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      }
    }
  },[]);

  const { author } = data.site.siteMetadata
  return (
    <div
      className="display-flex marginbottom-large white80 alignitems-center"
    >
      <Image
        fixed={data.avatar.childImageSharp.fixed}
        alt={author}
        className="marginright-small marginbottom-none borderradius-100p"
        style={{
          minWidth: 50,
        }}
        imgStyle={{
          borderRadius: `50%`,
        }}
      />
      <div className="flex flexdirection-column f5">
        <p className="margin-none">
          A blog about <span className={`color-cycle ${color}`}>web development</span>
        </p>
        <p className="margin-none">
          by <a target="_blank" className="link dim-hover" href="https://www.linkedin.com/in/bj-cantlupe/" rel="nofollow noopener noreferrer">BJ Cantlupe</a>
        </p>
      </div>
    </div>
  )
}

export default Bio
