import React, { useMemo } from 'react'
import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@chakra-ui/react"

import Box from '../../../components/Box'
import Text from '../../../components/Text'
import ArrowDown from '../../../components/ArrowDown'
import BackgroundImage from '../../../components/BackgroundImage'

import resultDetailShape from './result-detail-shape.svg'
import ResultList from './ResultList'

const InTheBox = ({
  title,
  items,
  opposite,
  countColor,
  wrongTag,
  bg,
  color,
  ...props
}) => {
  const count = useMemo(() => items.filter(d => !d.isCorrect).length, [items])
  return (
    <AccordionItem textAlign="center" {...props}>
      {({ isExpanded }) => (
        <Box>
          <Box pt="1em" color={color} bg={bg}>
            <Text fontSize="2.25em" fontWeight="700">{title}</Text>
            <Box width="20em" mx="auto">
              <BackgroundImage src={resultDetailShape} ratio={246.651 / 118.804}>
                <Text fontSize="1.5em" py="1.5em" color="black">
                  有
                  <Text.Inline
                    verticalAlign="sub"
                    mx="1rem"
                    fontSize="2em"
                    fontFamily="number"
                    color="colors.pink"
                    textStroke="0.075em black"
                  >{isExpanded ? count : '?'}</Text.Inline>
                  個{opposite}
                </Text>
              </BackgroundImage>
            </Box>
          </Box>
          <Box pb="2em" bg={isExpanded ? 'white' : bg}>
            <AccordionPanel pt="2em" pb="2em">
              <ResultList items={items} wrongTag={wrongTag} wrongProps={{ bg, color }} />
            </AccordionPanel>
            <AccordionButton
              color={isExpanded ? 'black' : 'white'}
              display="inline-flex"
              width="auto"
              fontSize="1em"
              border="0.125em solid"
              rounded="full"
              px="1em"
            >
              <Box mr="0.5em">
                {isExpanded ? '收合' : '打開瞧瞧'}
              </Box>
              <ArrowDown size="1em" transform={`rotate(${isExpanded ? 0 : 180}deg)`} />
            </AccordionButton>
          </Box>
        </Box>
      )}
    </AccordionItem>
  )
}

export default InTheBox
