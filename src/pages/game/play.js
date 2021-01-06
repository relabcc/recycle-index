import { graphql } from 'gatsby'
import React from 'react'
import { Helmet } from 'react-helmet'

import Page from '../../containers/GamePage/PlayGame'

const Game = ({ data }) => {
  return (
    <>
      <Helmet>
        <title>丟垃圾大考驗</title>
        <meta name="og:image" content={`${data.site.siteMetadata.url}/game/og.jpg`} />
      </Helmet>
      <Page data={data} />
    </>
  )
}

export default Game

export const pageQuery = graphql`
  query PlayPageQuery {
    site {
      siteMetadata {
        url
      }
    }
  }
`
