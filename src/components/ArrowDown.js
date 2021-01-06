import React from 'react'
import { IoTriangle } from 'react-icons/io5'

import Box from './Box'

const ArrowDown = ({ size, ...props }) => {
  return (
    <Box.Inline transform="rotate(180deg)" {...props}>
      <IoTriangle size={size} />
    </Box.Inline>
  )
}

export default ArrowDown
