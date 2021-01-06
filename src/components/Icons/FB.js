import React from 'react'

import fb from './fb.svg'
import IcoButton from './IcoButton'
import Image from '../Image'

const FB = (props) => {
  return (
    <IcoButton icon={<Image src={fb} />} {...props} />
  )
}

export default FB
