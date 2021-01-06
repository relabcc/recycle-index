import React, { useCallback, useEffect, useState } from 'react'
import { timeout, interval } from 'd3-timer'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react';

import Fullpage from '../../components/FullpageHeight';
import Container from '../../components/Container';
import Box from '../../components/Box';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Button from '../../components/Button';
import Image from '../../components/Image';
import HighlightNumber from '../../components/HighlightNumber';

import useShowHeader from '../../contexts/header/useShowHeader';

import Progress from './Progress';
import Cards from './Cards';
import Controls from './Controls';

import hand from './hand.svg'
import { responsive } from '../../components/ThemeProvider/theme';
import useQuestions from '../TrashPage/data/useQuestions';
import Result from './Result';

let ticker
let ansTime
const sec = 30 * 1000
const GamePage = () => {
  useShowHeader('colors.yellow')
  const [run, setRun] = useState(0)
  const questions = useQuestions(run)
  const [tutorial, setTutorial] = useState(true)
  const [no, setNo] = useState(1)
  const [finish, setFinish] = useState()
  const [canAnswer, setCanAnswer] = useState(true)
  const [answers, setAnswers] = useState([])
  const [time, setTime] = useState(sec)
  const onReset = useCallback(() => {
    setTutorial(true)
    setNo(1)
    setFinish(false)
    setCanAnswer(true)
    setAnswers([])
    setTime(sec)
    setRun(r => r + 1)
  }, [])
  const onAnswer = useCallback((i) => {
    setCanAnswer(false)
    setAnswers(ans => {
      const newAns = [...ans]
      newAns[no - 1] = { ans: i, duration: new Date() - ansTime }
      return newAns
    })
    timeout(() => {
      if (time > 0 && no < questions.length) {
        ansTime = new Date()
        setNo(no + 1)
      } else {
        setFinish(1)
      }
      setCanAnswer(true)
    }, 100)
  }, [no, questions])
  const timeUp = () => {
    if (ticker) {
      ticker.stop()
    }
    setFinish(1)
  }
  const tick = useCallback((elapsed) => {
    setTime(() => {
      if (sec > elapsed) {
        return sec - elapsed
      } else {
        timeUp()
        return 0
      }
    })
  }, [])
  useEffect(() => {
    if (!tutorial && questions.length) {
      ansTime = new Date()
      ticker = interval(tick)
    }
  }, [tutorial, questions])
  useEffect(() => {
    console.log('mount')
    return () => console.log('unmount')
  }, [])
  return (
    <Fullpage bg="colors.yellow" overflowX="hidden" overflowY="auto" mt="0">
      {finish ? (
        <Result answers={answers} questions={questions} onReset={onReset} />
      ) : (
        <Container px="2em" height="100%">
          <Box.Relative height="100%">
            <Progress value={time} total={sec} />
            {questions.length ? (
              <Cards
                no={no}
                answers={answers}
                onAnswer={onAnswer}
                disabled={!canAnswer}
                questions={questions}
              />
            ) : null}
            <Controls onAnswer={onAnswer} disabled={!canAnswer} />
          </Box.Relative>
        </Container>
      )}
      <Modal isOpen={tutorial} closeOnOverlayClick={false} isCentered>
        <ModalOverlay />
        <ModalContent
          maxWidth={responsive('90vw', '30em')}
          rounded={responsive('4em', '2em')}
          overflow="hidden"
          border="0.25em solid black"
          textAlign="center"
        >
          <ModalHeader
            bg="gray.200"
            textAlign="center"
            lineHeight={responsive('3em', '2em')}
            fontSize={responsive('4em', '1.75em')}
            fontWeight="500"
            letterSpacing="0.125em"
          >遊戲操作教學</ModalHeader>
          <ModalBody bg="gray.200" px="4em">
            <Box px="25%">
              <Image src={hand} />
            </Box>
            <Text
              lineHeight={responsive('4em', '2.5em')}
              fontWeight="900"
              fontSize={responsive('4em', '1.75em')}
              letterSpacing="0.125em"
            >左右滑動把垃圾丟對</Text>
          </ModalBody>
          <ModalFooter display="block" p={responsive('3em', '1em')}>
            <Flex justifyContent="center" fontSize={responsive('4em', '1.5em')}>
              <HighlightNumber numberProps={{ fontSize: '2em', color: 'colors.yellow' }} number={30}>秒快問快答</HighlightNumber>
            </Flex>
            <Button.Pink fontSize={responsive('4em', '2em')} width="full" onClick={() => setTutorial(false)}>開始挑戰</Button.Pink>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fullpage>
  )
}

export default GamePage
