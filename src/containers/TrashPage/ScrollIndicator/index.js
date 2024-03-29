import React from 'react'
import { MdArrowDropDown } from 'react-icons/md'
import styled from '@emotion/styled'
import { StaticImage } from 'gatsby-plugin-image'

import Flex from '../../../components/Flex'
import Box from '../../../components/Box'

// import bin from './bin.svg'
// import trash from './trash.svg'

const RightDash = styled(Box)`
  background: linear-gradient(black 50%, rgba(255, 255, 255, 0) 0%);
  background-position: right;
  background-repeat: repeat-y;
  background-size: 1px 16px;
`

const ScrollIndicator = ({ progress, onClick }) => {
  return (
    <Flex direction="column" height="100%" mt="1.25em" pb="4em">
      {/* <Button.Icon
        height="auto"
        px="0.25em"
        py="0.25em"
        border="2px solid black"
        colorScheme="yellow"
        fontSize={responsive('3em', '1em')}
        to="/catalogue"
        icon={<MdClose size="2em" />}
        rounded="0.5em"
      /> */}
      <Box flex="1">
        <Box.Relative height="100%">
          <Box.Absolute top="2.5%" left="50%" transform="translateX(-50%)">
            <MdArrowDropDown size="1.25em" />
          </Box.Absolute>
          <RightDash position="absolute" top="10%" bottom="0" width="1px" right="50%" />
          <Box.Absolute width="100%" style={{ top: `${progress * 100}%` }} transform="translateY(-50%)">
            <StaticImage alt="紙屑" src="trash.svg" placeholder="blurred" />
          </Box.Absolute>
        </Box.Relative>
      </Box>
      <Box.Relative width="100%" onClick={onClick}>
        <StaticImage alt="垃圾桶" src="bin.svg" placeholder="blurred" />
      </Box.Relative>
    </Flex>
  )
}

export default ScrollIndicator
