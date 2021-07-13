import React from 'react'
import { StaticImage } from 'gatsby-plugin-image'

import IcoButton from './IcoButton'

const FB = (props) => {
  return (
    <IcoButton icon={<StaticImage src="fb.svg" alt="Facebook" />} {...props} />
  )
}

export default FB
