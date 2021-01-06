import React from 'react'

import line from './line.svg'
import IcoButton from './IcoButton'
import Image from '../Image'

const Line = (props) => {
  return (
    <IcoButton icon={<Image src={line} />} {...props} />
  )
}

export default Line
