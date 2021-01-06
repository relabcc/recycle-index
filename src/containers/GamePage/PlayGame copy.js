import React, { useCallback, useEffect, useState } from 'react'
import { timeout } from 'd3-timer'
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

let ticker
let ansTime
const total = 15
const sec = 5
const GamePage = () => {
  useShowHeader()
  const [tutorial, setTutorial] = useState(true)
  const [no, setNo] = useState(1)
  const [finish, setFinish] = useState()
  const [canAnswer, setCanAnswer] = useState(true)
  const [answers, setAnswers] = useState([])
  const [time, setTime] = useState(sec)
  const onAnswer = useCallback((i) => {
    setCanAnswer(false)
    setAnswers(ans => {
      const newAns = [...ans]
      newAns[no - 1] = { ans: i, duration: new Date() - ansTime }
      return newAns
    })
    if (ticker) {
      ticker.stop()
    }
    timeout(() => {
      if (no < total) {
        setTime(sec)
        setNo(no + 1)
      } else {
        setFinish(1)
      }
      setCanAnswer(true)
    }, 500)
  }, [no])
  const timeUp = () => {
    onAnswer(0)
  }
  const tick = () => {
    setTime((t) => {
      if (t - 1) {
        ticker = timeout(tick, 1000)
        return t - 1
      } else {
        timeUp()
        return 0
      }
    })
  }
  useEffect(() => {
    if (!tutorial && no <= total) {
      ansTime = new Date()
      ticker = timeout(tick, 1000)
    }
  }, [no, total, tutorial])
  return (
    <Fullpage bg="primary" overflow="hidden" mt="0">
      <Container px="2em" height="100%">
        {finish ? (
          <Box textAlign="center" my="2em" fontSize="6em">
            <Box>Finish!</Box>
            <Box>總耗時：{Math.round(answers.reduce((allT, a) => allT + a.duration / 1000, 0))}秒</Box>
          </Box>
        ) : (
          <Box.Relative height="100%">
            <Progress no={no} total={total} />
            <Cards
              no={no}
              total={total}
              answers={answers}
              onAnswer={onAnswer}
              disabled={!canAnswer}
            />
            <Controls onAnswer={onAnswer} disabled={!canAnswer} time={time} />
          </Box.Relative>
        )}
      </Container>
      <Modal isOpen={tutorial} closeOnOverlayClick={false} isCentered>
        <ModalOverlay />
        <ModalContent
          maxWidth={responsive('90vw', '30em')}
          rounded={responsive('4em', '2em')}
          overflow="hidden"
          border="0.125em solid"
          borderColor="gray.300"
          textAlign="center"
        >
          <ModalHeader
            bg="gray.200"
            textAlign="center"
            lineHeight={responsive('3em', '2em')}
            fontSize={responsive('4em', '2em')}
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
              fontSize={responsive('4em', '2em')}
              letterSpacing="0.125em"
            >左右滑動把垃圾丟對</Text>
          </ModalBody>
          <ModalFooter display="block" p={responsive('3em', '1.5em')}>
            <Flex justifyContent="cetner" fontSize={responsive('4em', '1.75em')}>
              <HighlightNumber flex="1" numberProps={{ fontSize: '2em', color: 'colors.green' }} number={15}>個垃圾</HighlightNumber>
              <HighlightNumber flex="1" numberProps={{ fontSize: '2em', color: 'colors.yellow' }} number={5}>秒快問快答</HighlightNumber>
            </Flex>
            <Button fontSize={responsive('4em', '2em')} width="full" onClick={() => setTutorial(false)}>開始挑戰</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fullpage>
  )
}

export default GamePage
