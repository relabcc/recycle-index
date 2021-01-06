import { graphql } from 'gatsby'
import React from 'react'
import { Helmet } from 'react-helmet'

import Page from '../../containers/GamePage'

const Game = ({ data }) => {
  return (
    <>
      <Helmet>
        <title>丟垃圾大考驗</title>
        <meta name="og:image" content={`${data.site.siteMetadata.url}/game/og.jpg`} />
      </Helmet>
      <Page />
    </>
  )
}

export default Game

export const pageQuery = graphql`
  query GamePageQuery {
    site {
      siteMetadata {
        url
      }
    }
  }
`
