import React from 'react'
import { Helmet } from 'react-helmet'

import Page from '../../containers/AboutPage'

const Render = () => {
  return (
    <>
      <Helmet>
        <title>About Us</title>
      </Helmet>
      <Page />
    </>
  )
}

export default Render
