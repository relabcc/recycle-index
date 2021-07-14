import React from 'react'
import { SizeMe } from 'react-sizeme'

import BackgroundImage from '../../../components/BackgroundImage'
import Text from '../../../components/Text'
import Box from '../../../components/Box'

import bg from './hashtag-shape.svg'

const label = {
  A: '高',
  B: '中',
  C: '低',
}

const Hashtag = ({ children, color }) => {
  return (
    <BackgroundImage ratio={1332 / 615} src={bg}>
      <Box.Absolute left="17%" top="38%" transform="translateY(-50%) rotate(-12deg)" width="100%">
        <SizeMe>
          {({ size }) => (
            <Text fontSize={size.width ? `${Math.floor(size.width / 5)}px` : 0} fontWeight="900" color={color} letterSpacing="0.025em">
              {label[children]}
              <Text.Inline fontSize="0.625em">回收價值</Text.Inline>
            </Text>
          )}
        </SizeMe>
      </Box.Absolute>
    </BackgroundImage>
  )
}

export default Hashtag
