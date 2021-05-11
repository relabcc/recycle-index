import React from 'react'
import { Helmet } from 'react-helmet'

import Page from '../../containers/CataloguePage'

const Render = () => {
  return (
    <>
      <Helmet>
        <title>101 Must-Know Trashes</title>
      </Helmet>
      <Page />
    </>
  )
}

export default Render
