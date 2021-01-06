import React from 'react'
import { Helmet } from 'react-helmet'

import Page from '../containers/HowPage'

const Render = () => {
  return (
    <>
      <Helmet>
        <title>必懂的回收知識</title>
      </Helmet>
      <Page />
    </>
  )
}

export default Render
