import { graphql } from 'gatsby'
import React from 'react'
import { Helmet } from 'react-helmet'

import Page from '../../containers/GamePage'

const Game = ({ data }) => {
  return (
    <>
      <Helmet>
        <title>丟垃圾大考驗</title>
        <meta name="og:image" content={`${data.site.siteMetadata.siteUrl}/game/og.jpg`} />
        <meta
          name="description"
          content="30秒檢測你有多少垃圾分類的迷思？誰該去回收？誰該去一般，快速檢測報你知！"
        />
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
        siteUrl
      }
    }
  }
`
