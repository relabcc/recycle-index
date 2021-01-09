import React, { useMemo } from 'react'
import {
  Accordion,
  Tabs,
  TabList,
  TabPanels,
  Tab,
} from "@chakra-ui/react"
import { SizeMe } from 'react-sizeme'

import BackgroundImage from '../../../components/BackgroundImage'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import Image from '../../../components/Image'
import Button from '../../../components/Button'
import Container from '../../../components/Container'
import Flex from '../../../components/Flex'
import HighlightNumber from '../../../components/HighlightNumber'
import ArrowDown from '../../../components/ArrowDown'
import Line from '../../../components/Icons/Line'
import FB from '../../../components/Icons/FB'

import titleShape from './result-shape.svg'
import glow from './glow.svg'
import star from './star.svg'
import { responsive } from '../../../components/ThemeProvider/theme'
import InTheBox from './InTheBox'
import complete from './complete.svg'
import titleShapeDesktop from './title-shape-desktop.svg'
import useResponsive from '../../../contexts/mediaQuery/useResponsive'
import TabBin from './TabBin'

import tierData from './tier'
import Footer from '../../Footer'
// const InArrowText = props => (
//   <Text
//     color="white"
//     fontSize={responsive('3.5em')}
//     textAlign="center"
//     py="6.25rem"
//     {...props}
//   />
// )

const ResultNumber = ({ text, unit, number, ...props }) => (
  <Flex
    flexDirection={responsive('column', 'row')}
    width={responsive('42%', 'auto')}
    // flex={responsive('auto', '1')}
    letterSpacing="0.135em"
    textAlign="center"
  {...props}>
    <Text mr="0.375em" fontSize={responsive('1.375em', '1.625em')} fontWeight="700">{text}</Text>
    <HighlightNumber
      mt={responsive('-0.75em', '-1.5em')}
      justifyContent="center"
      number={number}
      fontWeight="700"
      fontSize={responsive('1.375em', '1.625em')}
      numberProps={{ fontSize: '2.5em', color: 'colors.pink', fontWeight: '500' }}
    >
      {unit}
    </HighlightNumber>
  </Flex>
)

const StyledTab = (props) => (
  <Tab
    fontSize="1.75em"
    borderWidth="0.075em"
    borderColor="black"
    fontWeight="700"
    borderRadius="1em 1em 0 0"
    letterSpacing="0.125em"
    {...props}
    _selected={Object.assign({
      borderTopColor: 'none',
      bg: 'black',
      color: 'white',
    }, props._selected)}
  />
)

const Action = (props) => (
  <Button.Orange
    rounded="full"
    px="1em"
    height="2em"
    fontSize={responsive('1.5em', '1.75em')}
    mx="0.5em"
    {...props}
  />
)

const Result = ({ answers, questions, onReset, data: { site: { siteMetadata } } }) => {
  const [recycleBin, trashBin, correctCount] = useMemo(() => answers.reduce((bins, a, i) => {
    const q = questions[i]
    const isCorrect = q.recyclable ? a.ans < 0 : a.ans > 0
    bins[a.ans < 0 ? 0 : 1].push({
      ...q,
      isCorrect,
    })
    if (isCorrect) bins[2] += 1
    return bins
  }, [[], [], 0]), [answers, questions])
  const { isMobile } = useResponsive()
  const tierId = useMemo(() => {
    const rate = correctCount / answers.length
    if (rate > 0.8) return 0
    if (rate > 0.6) return 1
    return 2
  }, [correctCount, answers])
  const tier = tierData[tierId]
  const pageUrl = `${siteMetadata.url}/game`
  return (
    <>
      <Container position="relative">
        <Box.Relative mx={responsive('-5em', '8em')}>
          {tier.glow && (
            <Box.Absolute
              top={responsive('33%', '65%')}
              left={responsive('-75%', '-50%')}
              right={responsive('-75%', '-50%')}
              transform="translateY(-50%)"
            >
              <Image src={glow} />
            </Box.Absolute>
          )}
          {isMobile ? (
            <BackgroundImage src={titleShape} ratio={464.023 / 223.735} mt="2em" overflow="visible">
              <Box.Absolute left="18%" right="15%" top={responsive('22%', '25%', '22%')}>
                <Text fontSize="1.5em">{tier.text}</Text>
                <Text fontSize={responsive('3.5em', '4.5em', '9em')}color="colors.pink" textStroke="0.02em black" fontWeight="900" letterSpacing="0.075em">{tier.title}</Text>
              </Box.Absolute>
              <Box.Absolute left="50%" top={responsive('-3%', '-17.5%', '-3%')} width="8em" transform="translateX(-50%)">
                <BackgroundImage ratio={336 / 150} src={complete} textAlign="center">
                  <Box fontSize="1.5em" color="white" fontWeight="700" lineHeight="3em" letterSpacing="0.075em">
                    任務完成
                  </Box>
                </BackgroundImage>
              </Box.Absolute>
            </BackgroundImage>
          ) : (
            <Box mr="15%" mt="5em">
              <SizeMe>
                {({ size }) => (
                  <Box fontSize={`${size.width / 80}px`}>
                    <BackgroundImage src={titleShapeDesktop} ratio={1112.86 / 367.33} overflow="visible">
                      <Box.Absolute left="18%" right="12%" top="30%">
                        <Text fontSize="2.5em" fontWeight="900" letterSpacing="0.075em">{tier.text}</Text>
                        <Text mt="-0.125em" fontSize="8em" color="colors.pink" textStroke="0.02em black" fontWeight="900" letterSpacing="0.075em">{tier.title}</Text>
                      </Box.Absolute>
                      <Box.Absolute left="3%" top="3%" width="11em" transform="rotate(13deg)">
                        <BackgroundImage ratio={(336 / 2) / 150} src={complete} textAlign="center">
                          <Box fontSize="3em" color="white" fontWeight="700" lineHeight="1.25" letterSpacing="0.075em" py="0.5em">
                            任務<br />完成
                          </Box>
                        </BackgroundImage>
                      </Box.Absolute>
                      {tier.star && (
                        <>
                          <Box.Absolute left="43%" top="-4%" width="8%"><Image src={star} /></Box.Absolute>
                          <Box.Absolute left="3%" bottom="10%" width="7%" transform="rotate(-10deg)"><Image src={star} /></Box.Absolute>
                        </>
                      )}
                    </BackgroundImage>
                  </Box>
                )}
              </SizeMe>
            </Box>
          )}
        </Box.Relative>
        {isMobile ? (
          <Box px={responsive('20%', '22.5%', 'auto')} mt={responsive('-7em', '-12em', 'auto')} >
            <BackgroundImage ratio={642.67 / 807.96} src={tier.img} overflow="visible">
              {tier.star && (
                <>
                  <Box.Absolute left="-10%" top="50%" width="25%" transform="scale(-1,1)"><Image src={star} /></Box.Absolute>
                  <Box.Absolute right="0" top="5%" width="25%"><Image src={star} /></Box.Absolute>
                  <Box.Absolute right="3%" bottom="10%" width="30%"><Image src={star} /></Box.Absolute>
                </>
              )}
            </BackgroundImage>
          </Box>
        ) : (
          <Box.Absolute width="25%" top="-4em" right="10%" transform="rotate(7deg)">
            <BackgroundImage ratio={642.67 / 807.96} src={tier.img} />
            {tier.star && (
              <Box.Absolute right="13%" top="30%" width="20%" transform="rotate(-10deg)"><Image src={star} /></Box.Absolute>
            )}
          </Box.Absolute>
        )}
        <Flex
          pos="relative"
          mt={responsive('-1em', '3em')}
          ml={responsive('auto', '15%')}
          mr={responsive('auto', '28%')}
          justifyContent="center"
        >
          <ResultNumber
            number={answers.length}
            text="丟掉垃圾總量"
            unit="個"
          />
          <Box width={responsive('20%', '3em')} />
          <ResultNumber
            number={answers.length && Math.round(correctCount / answers.length * 100)}
            text="正確分類比率"
            unit="％"
          />
        </Flex>
        <Flex position="relative" textAlign="center" mt={responsive('0.5em', '-1em')} justifyContent="center">
          <Action href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}/share/${tierId + 1}`}>分享結果</Action>
          <Action onClick={onReset}>再玩一次</Action>
        </Flex>
        <Box.Relative textAlign="center">
          <Text my="1.5em" fontSize={responsive('1.25em', '1.25em')} fontWeight="700" letterSpacing="0.075em">往下滑看你丟對了哪些垃圾<ArrowDown ml="0.5em" size="1em" /></Text>
        </Box.Relative>
      </Container>
      {isMobile ? (
        <Box.Relative>
          <Accordion allowToggle>
            <InTheBox
              bg="colors.orange"
              title="一般垃圾桶裡..."
              opposite="資源回收"
              items={trashBin}
              wrongTag="回收"
            />
            <InTheBox
              bg="black"
              color="white"
              title="資源回收桶裡..."
              opposite="一般垃圾"
              items={recycleBin}
              wrongTag="一般"
            />

          </Accordion>
        </Box.Relative>
      ) : (
        <Tabs pos="relative" isFitted variant="enclosed-colored">
          <TabList>
            <StyledTab>一般垃圾桶裡...</StyledTab>
            <StyledTab _selected={{ bg: 'colors.orange', color: 'black' }}>資源回收桶裡...</StyledTab>
          </TabList>
          <TabPanels bg="white">
            <TabBin
              bg="colors.orange"
              bin="一般垃圾"
              opposite="資源回收"
              items={trashBin}
              wrongTag="回收"
            />
            <TabBin
              bg="black"
              bin="資源回收"
              color="white"
              opposite="一般垃圾"
              items={recycleBin}
              wrongTag="一般"
            />
          </TabPanels>
        </Tabs>
      )}
      <Box.Relative bg="colors.yellow">
        <Container py="3em" textAlign="center">
          <Flex flexDirection={responsive('column', 'row')} justifyContent="center" alignItems="center">
            <Text fontSize="1.5em" fontWeight="700" letterSpacing="0.125em">想更深入認識每個垃圾嗎？</Text>
            <Button.Orange
              to="/catalogue"
              my="1em"
              fontSize="1.5em"
              mx="1em"
              rightIcon={<ArrowDown ml="0.25em" transform="rotate(90deg)" size="0.75em" />}
            >前往探索垃圾堆</Button.Orange>
            <Flex>
              <FB fontSize={responsive('2.5em', '2em')} mx="0.25em" href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`} />
              <Line fontSize={responsive('2.5em', '2em')} mx="0.25em" href={`https://line.naver.jp/R/msg/text/?${pageUrl}`} />
            </Flex>
          </Flex>
        </Container>
      </Box.Relative>
      <Footer noSep />
    </>
  )
}

export default Result
