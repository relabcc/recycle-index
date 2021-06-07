import React from 'react'

import rc from './rc.svg'
import citi from './citi.svg'
import foodpanda from './foodpanda.svg'
import Box from '../Box'
import Flex from '../Flex'
import Image from '../Image'
import { responsive } from '../ThemeProvider/theme'

const sponsor = [
  ['RC文化基金會', rc],
  ['Foodpanda', foodpanda],
  ['花旗銀行', citi],
]

const Sponsor = ({ bg, textColor, bgColor, px, logoProps, fontSize, isFooter, ...props }) => {
  return (
    <Box position="relative" py={responsive('1em', '3.125em')} bg={bg} {...props}>
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg={bgColor}
        opacity="0.2"
      />
      <Flex
        flexDirection={isFooter ? 'row' : 'column'}
        position="relative"
        justifyContent="center"
        alignItems={isFooter && 'center'}
      >
        <Box
          fontSize={fontSize || '2em'}
          color={textColor || 'colors.yellow'}
          px={px || responsive('0.5em', '4.6875rem')}
          fontWeight="900"
          letterSpacing="0.125em"
          borderRight={isFooter && '2px solid'}
          pr={isFooter && responsive('0.5em', '1em')}
        >
          贊助單位
        </Box>
        <Flex justifyContent="center" flex={responsive('1', 'none')}>
          {sponsor.map(([name, logo], k) => (
            <Box px={responsive('1em', '1.25em')} key={k} width={1 / 3} {...logoProps}>
              <Image alt={name} src={logo} />
            </Box>
          ))}
        </Flex>
      </Flex>
    </Box>
  )
}

export default Sponsor
