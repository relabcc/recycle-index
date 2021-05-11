import { graphql } from 'gatsby'
import React from 'react'
import { Helmet } from 'react-helmet'

import Page from '../../../containers/GamePage/PlayGame'

const Game = ({ data }) => {
  return (
    <>
      <Helmet>
        <title>Recycle Challenge</title>
        <meta name="og:image" content={`${data.site.siteMetadata.url}/game/og.jpg`} />
      </Helmet>
      <Page data={data} />
    </>
  )
}

export default Game

export const pageQuery = graphql`
  query PlayPageEnQuery {
    site {
      siteMetadata {
        url
      }
    }
  }
`
