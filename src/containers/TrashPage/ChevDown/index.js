import React from 'react'

import Box from '../../../components/Box'
import Image from '../../../components/Image'
import { responsive } from '../../../components/ThemeProvider/theme'

import img from './chev-down.svg'

const ChevDown = ({ as, ...props }) => {
  return (
    <Box.Absolute left="50%" bottom={responsive('1em', '0.625em')} width={responsive('5em', '4em')} role="button" transform="translateX(-50%)" title="下一頁" {...props}>
      <Box as={as}>
        <Image alt="向下的箭頭" src={img} />
      </Box>
    </Box.Absolute>
  )
}

export default ChevDown
