import { graphql, navigate } from 'gatsby'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'

const Game = ({ data }) => {
  useEffect(() => {
    navigate('/game')
  }, [])
  return (
    <>
      <Helmet>
        <title>丟垃圾大考驗</title>
        <meta name="og:image" content={`${data.site.siteMetadata.url}/game/1.jpg`} />
      </Helmet>
    </>
  )
}

export default Game

export const pageQuery = graphql`
  query GameShare1Query {
    site {
      siteMetadata {
        url
      }
    }
  }
`
