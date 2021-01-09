import React, { useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable';
import { interval } from 'd3-timer';

import Box from '../../../components/Box'
import Flex from '../../../components/Flex'
import Text from '../../../components/Text'
import Image from '../../../components/Image'

import recycleTag from './recycle_1.svg'
import trashTag from './trash_1.svg'
import { responsive } from '../../../components/ThemeProvider/theme';
import Trash from './Trash'

let animation
let answredAnimation
const thres = 0.15
const moveSpeed = 0.04

const Card = ({ disabled, onAnswer, answered, containerWidth, question }) => {
  const [xOffset, setXOffset] = useState(0)
  const isAnswered = useRef()
  const restorePosition = () => {
    animation = interval(() => {
      setXOffset(x => {
        const to = Math.max(Math.abs(x) - containerWidth * moveSpeed, 0) * Math.sign(x)
        if (to === 0) animation.stop()
        return to
      })
    })
  }
  const answeredPosition = () => {
    isAnswered.current = true
    answredAnimation = interval(() => {
      setXOffset(x => {
        const to = Math.min(Math.abs(x) + containerWidth * moveSpeed, containerWidth)
        if (to === containerWidth) answredAnimation.stop()
        return to * Math.sign(answered)
      })
    })
  }
  useEffect(() => {
    if (answered && !isAnswered.current) {
      answeredPosition()
    }
  }, [answered])
  const s = Math.sign(xOffset)
  const abs = Math.abs(xOffset)
  const t = containerWidth * thres
  return (
    <Draggable
      axis="x"
      position={{ x: xOffset, y: 0 }}
      onStart={() => {
        if (animation && typeof animation.stop === 'function') {
          animation.stop()
        }
      }}
      onDrag={(e, { x }) => {
        setXOffset(x)
      }}
      onStop={() => {
        if (abs < t) {
          restorePosition()
        } else if (!disabled) {
          onAnswer(s)
        }
      }}
      disabled={disabled}
    >
      <Box height="100%" width="100%">
        <Flex
          position="relative"
          flexDirection="column"
          borderRadius={responsive('2em', '4em')}
          border="0.125em solid"
          borderColor="gray.500"
          bg="white"
          transformOrigin="center bottom"
          height="100%"
          style={{ transform: `rotate(${xOffset / t * 15}deg)` }}
        >
          <Trash borderRadius={responsive('2em 2em 0 0', '4em 4em 0 0')} position="relative" flex="1" layers={question.layers} opacity={disabled ? 0.5 : 1} />
          <Text
            opacity={disabled ? 0.5 : 1}
            textAlign="center"
            fontSize={responsive('1.75em', '2em')}
            py="0.5em"
          >{question.partName && question.trash.name !== question.partName ? `${question.trash.name}的${question.partName}` : question.trash.name}</Text>
          <Box.Absolute
            top="-5em"
            style={{
              [xOffset < 0 ? 'left' : 'right']: '33%',
              opacity: Math.min(Math.abs(xOffset) / (containerWidth * thres), 1),
            }}
          >
            <Box width={responsive('12em', '20em')}>
              {xOffset < 0 ? <Image src={recycleTag} /> : <Image src={trashTag} />}
            </Box>
          </Box.Absolute>
        </Flex>
      </Box>
    </Draggable>
  )
}

export default Card
