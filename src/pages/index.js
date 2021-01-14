import React from 'react'
import { Helmet } from 'react-helmet'

import Page from '../containers/HomePage'

const Render = () => {
  return (
    <>
      <Helmet>
        <title>秒懂101個台灣人必知的垃圾</title>
      </Helmet>
      <Page />
    </>
  )
}

export default Render
