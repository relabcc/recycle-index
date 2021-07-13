import React from 'react'
import { StaticImage } from 'gatsby-plugin-image'

import IcoButton from './IcoButton'

const Line = (props) => {
  return (
    <IcoButton icon={<StaticImage src="line.svg" alt="Line" />} {...props} />
  )
}

export default Line
