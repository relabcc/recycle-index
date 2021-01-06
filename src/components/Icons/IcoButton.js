import React from 'react'
import { IconButton } from '@chakra-ui/react'
import { responsive } from '../ThemeProvider/theme'

const IcoButton = (props) => {
  return (
    <IconButton minWidth="auto" width="1em" fontSize={responsive('2em', '4em')} height="auto" px="0" variant="ghost" {...props} />
  )
}

export default IcoButton
