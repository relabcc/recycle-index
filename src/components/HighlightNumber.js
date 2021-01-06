import React from 'react'

import Flex from './Flex'
import Box from './Box'

const HighlightNumber = ({
  number,
  numberProps,
  pre,
  children,
  ...props
}) => {
  return (
    <Flex alignItems="center" {...props}>
      {pre}
      <Box
        ml={pre && '0.125em'}
        mr="0.125em"
        style={{ WebkitTextStroke: '0.05em black' }}
        fontFamily="number"
        mb="0.25em"
        {...numberProps}
      >{number}</Box>
      <Box>{children}</Box>
    </Flex>
  )
}

export default HighlightNumber
