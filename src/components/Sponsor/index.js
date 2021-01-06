import React from 'react'

import rc from './rc.svg'
import citi from './citi.svg'
import foodpanda from './foodpanda.svg'
import Box from '../Box'
import Flex from '../Flex'
import Image from '../Image'
import { responsive } from '../ThemeProvider/theme'

const sponsor = [
  rc,
  foodpanda,
  citi,
]

const Sponsor = ({ bg, textColor, bgColor, px, logoProps, fontSize, isFooter, ...props }) => {
  return (
    <Box position="relative" py="3.125em" bg={bg} {...props}>
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
        mt={responsive('2em', '0')}
      >
        <Box
          fontSize={fontSize || responsive("3em", '2em')}
          color={textColor || 'colors.yellow'}
          px={px || responsive('4.5rem', '4.6875rem')}
          fontWeight="900"
          letterSpacing="0.125em"
          borderRight={isFooter && '2px solid'}
          pr={isFooter && '1em'}
        >
          贊助單位
        </Box>
        <Flex justifyContent="center">
          {sponsor.map((logo, k) => (
            <Box px="1.25em" key={k} width={responsive(1 / 4, 1 / 3)} {...logoProps}>
              <Image src={logo} />
            </Box>
          ))}
        </Flex>
      </Flex>
    </Box>
  )
}

export default Sponsor
