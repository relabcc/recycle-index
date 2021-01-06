import React, { useMemo } from 'react'
import { TabPanel, Tag } from "@chakra-ui/react"


import Box from '../../../components/Box'
import Text from '../../../components/Text'
import ResultList from './ResultList'

const TabBin = ({
  bg,
  color,
  bin,
  opposite,
  items,
  wrongTag,
  ...props
}) => {
  const count = useMemo(() => items.filter(d => !d.isCorrect).length, [items])
  return (
    <TabPanel {...props}>
      <Box mx="10%">
        <Text fontSize="1.75em" color="black">
          有
          <Text.Inline
            verticalAlign="sub"
            mx="1rem"
            fontSize="2em"
            fontFamily="number"
            color="colors.pink"
            textStroke="0.05em black"
          >{count}</Text.Inline>
          個應該是
          <Tag
            border="0.075em solid"
            borderRadius="0.375em"
            fontSize="1em"
            lineHeight="1.75"
            px="0.5em"
            verticalAlign="auto"
            mx="0.25em"
            bg={bg}
            color={color}
            fontWeight="700"
          >{opposite}</Tag>
          ，卻被你誤丟到{bin}
        </Text>
        <ResultList mt="2em" items={items} wrongTag={wrongTag} wrongProps={{ bg, color }} />
      </Box>
    </TabPanel>
  )
}

export default TabBin
