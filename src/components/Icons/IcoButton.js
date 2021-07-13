import React from 'react'
import { IconButton, Link } from '@chakra-ui/react'
import { responsive } from '../ThemeProvider/theme'

const IcoButton = ({ href, ...props }) => {
  return (
    <IconButton
      as={href ? Link : ''}
      href={href}
      minWidth="auto"
      width="1em"
      fontSize={responsive('2em', '4em')}
      height="auto"
      px="0"
      variant="ghost"
      overflow="hidden"
      {...props}
    />
  )
}

export default IcoButton
