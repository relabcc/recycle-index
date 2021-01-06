import { format } from 'd3-format'
import React from 'react'

import Box from '../../components/Box'
import Flex from '../../components/Flex'
import Text from '../../components/Text'
import { responsive } from '../../components/ThemeProvider/theme'

const f = format('.1f')

const Progress = ({ value, total, ...props }) => {
  return (
    <Flex alignItems="center" my={responsive('2em', '1em')} {...props}>
      <Box flex="1">
        <Box
          mr="-4em"
          borderWidth={responsive('1px', '0.175em')}
          border="1px solid black"
          p={responsive('1em', '0.375em')}
          bg="white"
          rounded="full"
        >
          <Box
            width={`${value / total * 100}%`}
            borderWidth={responsive('1px', '0.175em')}
            border="1px solid black"
            bg="pink.300"
            height={responsive('3em', '1.5em')}
            borderRadius="2em"
          />
        </Box>
      </Box>
      <Flex
        position="relative"
        zIndex={1}
        rounded="full"
        px="2em"
        py="0.5em"
        borderWidth={responsive('1px', '0.175em')}
        border="1px solid black"
        bg="white"
        alignItems="flex-end"
      >
        <Text fontWeight="900" fontSize={responsive('5em', '2em')} color="pink.300">{f(value / 1000)}</Text>
        {/* <Text mb="0.5em" ml="0.5em" fontSize={responsive('2em', '1em')}>/{total}</Text> */}
      </Flex>
    </Flex>
  )
}

export default Progress
