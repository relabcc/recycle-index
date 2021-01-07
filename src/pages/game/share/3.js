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
        <meta name="og:image" content={`${data.site.siteMetadata.url}/game/3.jpg`} />
        <meta
          name="description"
          content="30秒檢測你有多少垃圾分類的迷思？誰該去回收？誰該去一般，快速檢測報你知！"
        />
      </Helmet>
    </>
  )
}

export default Game

export const pageQuery = graphql`
  query GameShare3Query {
    site {
      siteMetadata {
        url
      }
    }
  }
`
