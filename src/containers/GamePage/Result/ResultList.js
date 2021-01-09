import React from 'react'
import { AspectRatio } from "@chakra-ui/react"

import Box from '../../../components/Box'
import Flex from '../../../components/Flex'
import Text from '../../../components/Text'
import Circle from '../../../components/Circle'
import Link from '../../../components/Link'
import { responsive } from '../../../components/ThemeProvider/theme'

import Trash from '../Cards/Trash'

const ResultList = ({ items, wrongTag, wrongProps, ...props }) => {
  return (
    <Flex flexWrap="wrap" {...props}>
      {items.map((item, i) => (
        <Box width={responsive('33.33%', 1 / 7)} key={i} textAlign="center">
          <Link href={`/trash/${item.trash.id}`} target="_blank">
            <Box.Relative p="10%">
              <AspectRatio ratio={1} border="0.125em solid black" rounded="15%" overflow="hidden">
                <Trash layers={item.layers} />
              </AspectRatio>
              {!item.isCorrect && (
                <Box.Absolute width="33%" right="-5%" top="-5%">
                  <Circle
                    border="0.125em solid black"
                    // borderWidth={responsive('0.5em', '0.125em')}
                    fontWeight="bold"
                    fontSize="1em"
                    {...wrongProps}
                  >
                    {wrongTag}
                  </Circle>
                </Box.Absolute>
              )}
            </Box.Relative>
            <Box fontSize="1em">
              <Text>{item.trash.name}</Text>
              {item.partName && item.trash.name !== item.partName && (<Text>的{item.partName}</Text>)}
            </Box>
          </Link>
        </Box>
      ))}
    </Flex>
  )
}

export default ResultList
