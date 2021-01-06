import React, { useContext, useMemo } from 'react'
import { get, range } from 'lodash'
import { useWindowSize } from 'react-use'

import containerContext from '../../../contexts/containerWidth/context'
import Box from '../../../components/Box'
import Card from './Card'
import { responsive } from '../../../components/ThemeProvider/theme'

const count = 3
const Cards = ({ no, disabled, onAnswer, answers, questions }) => {
  const windowSize = useWindowSize()
  const { containerWidth } = useContext(containerContext)
  return useMemo(() => (
    <Box.Absolute
      top={responsive('37%', '50%')}
      left={0}
      right={0}
      transform="translateY(-50%)"
      pt="100%"
    >
      <Box.FullAbs p={responsive((containerWidth - windowSize.height / 2) / 2, '33%')}>
        <Box position="relative" width="100%" height="100%">
          {range(no, no + count).map((n, i) => questions[n - 1] && (
            <Box
              position={i ? 'absolute' : 'relative'}
              key={n}
              transform={`scale(${1 - 0.05 * i}) translateY(${2 * i}%)`}
              transformOrigin="center bottom"
              zIndex={count - i + 1}
              width="100%"
              top="0"
              height="100%"
              left="0"
              right="0"
            >
              <Card
                no={n}
                disabled={disabled || i}
                onAnswer={onAnswer}
                answered={get(answers[n - 1], 'ans')}
                containerWidth={containerWidth}
                question={questions[n - 1]}
              />
            </Box>
          ))}
        </Box>
      </Box.FullAbs>
    </Box.Absolute>
  ), [no, disabled, questions, answers, containerWidth, windowSize.height, onAnswer])
}

export default Cards
