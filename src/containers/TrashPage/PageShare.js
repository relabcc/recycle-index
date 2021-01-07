import React, { useEffect, useRef, useState, useMemo, createRef, forwardRef, useContext } from 'react'
import { AspectRatio } from '@chakra-ui/react'
import { get, random, range, sampleSize } from 'lodash'
import gsap from 'gsap'
import { useWindowSize } from 'react-use';
import { SizeMe } from 'react-sizeme';
import { timer } from 'd3-timer';

import FullpageHeight from '../../components/FullpageHeight'
import Box from '../../components/Box'
import Text from '../../components/Text'
import Image from '../../components/Image'
import Flex from '../../components/Flex'
import Circle from '../../components/Circle'
import Container from '../../components/Container'
import BackgroundImage from '../../components/BackgroundImage'
import withData from './data/withData';
import animations from './data/animations'
import ChevDown from './ChevDown';
import Hashtag from './Hashtag';
import RateCircle from './RateCircle';
import Face from '../Face';
import isIos from '../../components/utils/isIos'

import logo from '../logo.svg'
import shareBg from './share-bg.svg'
import shareBgMobile from './share-bg-mobile.svg'
import Handling from './Handling';
import containerWidthContext from '../../contexts/containerWidth/context'
import useResponsive from '../../contexts/mediaQuery/useResponsive';
import theme, { responsive } from '../../components/ThemeProvider/theme';
import useLoader from '../../utils/useLoader';
import imgSize from './data/imgSize'
import FB from '../../components/Icons/FB';
import Line from '../../components/Icons/Line';
import planb from './planb.svg'
import planbBubble from './planb-bubble.svg'

// const pageCount = 5
const idealWidth = 200

const colorsCfg = {
  A: 'green',
  B: 'orange',
  C: 'pink',
}

const TrashPage = ({ trashData: data }) => {
  const { isMobile } = useResponsive()
  const { containerWidth } = useContext(containerWidthContext)
  // setup refs
  const colorScheme = `colors.${colorsCfg[data.recycleValue]}`
  const trashWidth = (isMobile ? (isIos ? 140 : 160) : 75) * (data.transform.scale ? (isMobile && data.transform.mobileScale ? data.transform.mobileScale : data.transform.scale) / 100 : Math.min(1, idealWidth / (data.xRange[1] - data.xRange[0])))
  const faceId = useMemo(() => data.transform.faceNo || (random(4) + 1), [data])
  const endTransition = [
    [0 + (data.transform.mobileX || 0), -50 + (data.transform.mobileY || 0)],
    [-20 + (data.transform.x || 0), -20 + (data.transform.y || 0)],
  ]
  const endPos = [containerWidth * 1, containerWidth * 0.25]

  useLoader(data.img)

  return (
    <Box.Relative
      height="100vh"
      width="100vw"
      pt={theme.headerHeight}
      transformOrigin="0 0" transform="scale(0.5)"
      bg={colorScheme}
      onClick={() => window.open(`${process.env.PUBLIC_URL}${window.location.search}/#/trash/${data.id}`)}
      cursor="pointer"
    >
      <Box bg={colorScheme}>
        <Container px={responsive(0, '1.25em')}>
          <Box width={responsive('100%', '50%')} mx="auto" pt={responsive('0', '5vh')}>
            <BackgroundImage src={isMobile ? shareBgMobile : shareBg} ratio={isMobile ? 750 / 574 : 1368 / 746} overflow="visible">
              <SizeMe>
                {({ size }) => (
                  <Box.Absolute left={responsive('2em', '40%')} top={responsive('8em', '36%')} transform={responsive('', 'trnsateY(-50%)')} width={responsive('55%', '45%')}>
                    <Box fontSize={`${size.width * 2 / 25}px`}>
                      <Text letterSpacing="0.05em" fontSize={responsive('1.75em', '2.25em')} fontWeight="900">＃如果你不好好回收</Text>
                      <Text fontSize={responsive('3.25em', '3.5em')} fontWeight="900" color={colorScheme}>{data.share}</Text>
                    </Box>
                  </Box.Absolute>
                  )}
              </SizeMe>
            </BackgroundImage>
            <Flex fontSize={responsive('3em', '0.625em')} px="0.25em" justifyContent={responsive('', 'flex-end')} mt={responsive('-10%', '-4rem')} mr={responsive(0, '-2rem')}>
              <FB border="1px solid black" mx="0.125em" rounded="0.25em" />
              <Line border="1px solid black" mx="0.125em" rounded="0.25em" />
            </Flex>
          </Box>
        </Container>

        <Box
          bg={colorScheme}
          pb="1em"
          pt={responsive('6em', '2em')}
          position="relative"
        >
          <Container px="1.25em">
            <Flex pt="1em" flexDirection={responsive('column', 'row')}>
              <Box>
                <Box pr={responsive(0, '1.5em')}>
                  <Text fontWeight="700" color="white" fontSize={responsive('3.5em', '1.25em')} letterSpacing="0.1em">＃要給垃圾一個好歸宿，你該這麼做</Text>
                </Box>
                <Handling steps={data.handling} />
              </Box>
              {data.alternative && (
                <Box
                  flex="1"
                  color="white"
                  mt={responsive('2.5em', 0)}
                  pt={responsive('2.5em', 0)}
                  pl={responsive('0', '1.5em')}
                  borderTop={responsive('2px solid', 'none')}
                  borderLeft={responsive('none', '2px solid')}
                  alignItems={responsive('flex-start', 'center')}
                >
                  <Text fontWeight="700" fontSize={responsive('3.5em', '1.25em')} letterSpacing="0.1em">＃或者，你有替代方案：</Text>
                  <Flex width={responsive('66em', '24em')} mr={responsive('2em', '1em')} alignItems="flex-end" my={responsive('2em', '0.5em')}>
                    <Box width="22%" pb="5%">
                      <Image src={planb} />
                    </Box>
                    <Box flex="1" pl="2%">
                      <BackgroundImage src={planbBubble} ratio={486 / 176}>
                        <Box.Absolute top="50%" left="16%" right="5%" transform="translateY(-50%)">
                          <Text fontSize={responsive('2.75em', '1em')} letterSpacing="0.1em">{data.alternative}</Text>
                        </Box.Absolute>
                      </BackgroundImage>
                    </Box>
                  </Flex>
                </Box>
              )}
            </Flex>
          </Container>
        </Box>
      </Box>
      <Box.Absolute left="0" right="0" top={theme.headerHeight} height={`calc(100vh - ${theme.headerHeight})`} pointerEvents="none">
          <Container height="100%">
            <Box.Relative height="100%">
              <Box.Absolute
                width={`${trashWidth}%`}
                left={`${(100 - trashWidth) / 2}%`}
                top={responsive(`${endPos[0]}px`, `${endPos[1]}px`)}
                transform={`translate3d(${isMobile ? '10%' : 0}, -50%, 0) ${data.transform.rotate ? `rotate(${isMobile && data.transform.mobileRotate ? data.transform.mobileRotate : data.transform.rotate}deg)` : ''}`}
              >
                <Box transform={`translate(${endTransition[isMobile ? 0 : 1].map(d => `${d}%`).join(',')}) ${data.transform.shareScale ? `scale(${(isMobile && data.transform.mobileShareScale ? data.transform.mobileShareScale : data.transform.shareScale) / 100})` : ''}`}>
                  <BackgroundImage ratio={imgSize[0] / imgSize[1]} src={data.img} />
                  <Face transform={data.transform.face} id={faceId} />
                </Box>
              </Box.Absolute>
            </Box.Relative>
          </Container>
        </Box.Absolute>
      <Flex position="absolute" top="0" left="0" right="0" height={theme.headerHeight} bg={colorScheme} alignItems="center">
        <Box px={responsive('2em', '1em')}>
          <Image width="12em" src={logo} alt="回收大百科" />
        </Box>
      </Flex>
    </Box.Relative>
  )
}

export default withData(TrashPage)
