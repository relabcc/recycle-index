import React from 'react'

import Flex from '../../../components/Flex'
import Box from '../../../components/Box'
import Image from '../../../components/Image'
import Button from '../../../components/Button'
import isIos from '../../../components/utils/isIos'

// import clock from './timer.svg'
import trash from './trash.svg'
import recycle from './recycle.svg'
import { responsive } from '../../../components/ThemeProvider/theme'

const CircleButton = props => (
  <Box
    width={responsive('20em', '8em')}
    height={responsive('20em', '8em')}
    transform={responsive('', 'translateY(-35vh)')}
  >
    <Button.Icon
      bg="white"
      rounded="full"
      width="100%"
      height="100%"
      _disabled={{
        opacity: 1,
      }}
      {...props}
    />
  </Box>
)

const Controls = ({ onAnswer, disabled }) => {
  return (
    <Flex position="absolute" left="0" right="0" bottom={responsive(isIos ? '12em' : '15em', '1em')} justifyContent="space-around" alignItems="center">
      <CircleButton border="0.125em solid black" isDisabled={disabled} onClick={() => onAnswer(-1)} icon={<Image src={recycle} />} />
      <Box width={responsive('12em', '5em')}>
        {/* <BackgroundImage ratio={1} src={clock}>
          <Box.AbsCenter top="58%" color="pink.300" fontSize={responsive('6em', '2em')} fontWeight="900">{time}</Box.AbsCenter>
        </BackgroundImage> */}
      </Box>
      <CircleButton border="0.125em solid black" isDisabled={disabled} onClick={() => onAnswer(1)} icon={<Image src={trash} />} />
    </Flex>
  )
}

export default Controls
