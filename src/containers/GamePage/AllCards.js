import React from 'react'

import Flex from '../../components/Flex'
import Container from '../../components/Container'
import Box from '../../components/Box'
import useQuestions from '../TrashPage/data/useQuestions';
import Card from './Cards/Card'
import { AspectRatio } from '@chakra-ui/react';

const AllCards = () => {
  const questions = useQuestions()
  return (
    <Container>
      <Flex flexWrap="wrap">
        {questions.map((q, i) => (
          <Box width={1 / 3} key={i}>
            <AspectRatio ratio={1}>
              <Box p="5%">
                <Card
                  disabled
                  containerWidth={1920}
                  question={q}
                />
                <Box.AbsCenter fontSize="2em" fontWeight="900">{q.recyclable && '可回收'}</Box.AbsCenter>
              </Box>
            </AspectRatio>
          </Box>
        ))}
      </Flex>
    </Container>
  )
}

export default AllCards
