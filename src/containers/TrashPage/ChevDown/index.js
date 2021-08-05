import { StaticImage } from 'gatsby-plugin-image'
import React from 'react'

import Box from '../../../components/Box'
import { responsive } from '../../../components/ThemeProvider/theme'

const ChevDown = ({ as, ...props }) => {
  return (
    <Box.Absolute left="50%" bottom={responsive('1em', '0.625em')} width={responsive('5em', '4em')} role="button" transform="translateX(-50%)" title="下一頁" {...props}>
      <Box as={as}>
        <StaticImage alt="向下的箭頭" src="./chev-down.svg" placeholder="tracedSVG" />
      </Box>
    </Box.Absolute>
  )
}

export default ChevDown
