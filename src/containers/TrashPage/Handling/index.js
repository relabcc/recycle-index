import React from 'react'

import Flex from '../../../components/Flex'
import Circle from '../../../components/Circle'
import Text from '../../../components/Text'
import Image from '../../../components/Image'
import Box from '../../../components/Box'

import next from './next.svg'
import crush from './crush.svg'
import peal from './peal.svg'
import seperate from './seperate.svg'
import teal from './teal.svg'
import bin from './bin.svg'
import wash from './wash.svg'
import dry from './dry.svg'
import wrap from './wrap.svg'
import clean from './clean.svg'
import flatten from './flatten.svg'
import { responsive } from '../../../components/ThemeProvider/theme'

const icons = {
  沖洗: wash,
  清理: clean,
  撕除封膜: teal,
  正確分類: bin,
  分解零件: seperate,
  壓扁瓶身: crush,
  撕除膠帶: peal,
  排空內容物: dry,
  包好: wrap,
  攤平: flatten,
}

const Handling = ({ steps, ...props }) => {
  return (
    <Flex alignItems="center" my={responsive('1em', '0.625em')} {...props}>
      {steps.reduce((all, step, i) => {
        const s = (
          <Flex width={responsive('6em', '12em')} key={`icon-${i}`} alignItems="center" justifyContent="center" flexDirection={responsive('column', 'row')}>
            <Box width={responsive('80%', '40%')}>
              <Circle width="100%" bg="white">
                <Box px="5%">
                  <Image src={icons[step]} />
                </Box>
              </Circle>
            </Box>
            <Box color="white" px="0.625em" mt={responsive('0.25em', 0)}>
              <Text fontSize="1em" fontWeight="500" letterSpacing="0.1em">{step}</Text>
            </Box>
          </Flex>
        )
        return [...all, i > 0 && <Box key={`step-${i}`} width={responsive('3em', '3em')}><Image src={next} /></Box>, s]
      }, [])}
    </Flex>
  )
}

export default Handling
