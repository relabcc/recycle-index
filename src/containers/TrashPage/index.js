import React, { useEffect, useRef, useState, useMemo, createRef, useContext } from 'react'
import { AspectRatio } from '@chakra-ui/react'
import { get, random, range, sampleSize, size } from 'lodash'
import gsap from 'gsap'
import { useWindowSize } from 'react-use';
import { SizeMe } from 'react-sizeme';
import ReactFullpage from '@fullpage/react-fullpage'
import { timer } from 'd3-timer';
import { Helmet } from 'react-helmet';

import Box from '../../components/Box'
import Text from '../../components/Text'
import Flex from '../../components/Flex'
import Image from '../../components/Image'
import Circle from '../../components/Circle'
import Container from '../../components/Container'
import FB from '../../components/Icons/FB'
import Line from '../../components/Icons/Line'
import BackgroundImage from '../../components/BackgroundImage'
import withData from './data/withData';
import animations from './data/animations'
import ChevDown from './ChevDown';
import Hashtag from './Hashtag';
import RateCircle from './RateCircle';
import Face from '../Face';
import Footer from '../Footer';
import isIos from '../../components/utils/isIos'

import trash from './trash-bag.svg'
import shareBg from './share-bg.svg'
import planb from './planb.svg'
import planbBubble from './planb-bubble.svg'
import shareBgMobile from './share-bg-mobile.svg'
import Handling from './Handling';
import ScrollIndicator from './ScrollIndicator';
import containerWidthContext from '../../contexts/containerWidth/context'
import useResponsive from '../../contexts/mediaQuery/useResponsive';
import useShowHeader from '../../contexts/header/useShowHeader';
import theme, { responsive } from '../../components/ThemeProvider/theme';
import useLoader from '../../utils/useLoader';
import imgSize from './data/imgSize'
import PerTrash from '../CataloguePage/PerTrash';
import useReloadOnOrentation from '../../utils/useReloadOnOrentation';

if (typeof window !== 'undefined') {
  require('fullpage.js/vendors/scrolloverflow')
}

let fpApi
// const pageCount = 5
const trashSidePos = 20
const scrollingDuration = 1
const idealWidth = 200

let theTimeline
let endTimeline
let progressTimer

const TrashName = ({ children, ...props }) => (
  <Box.Absolute
    top={responsive('1.75em', '1.25em')}
    left={responsive('1em', '1.5em')}
    color="white"
    {...props}
  >
    <Text fontSize={responsive('1em', '1.5625em')} fontWeight="900" letterSpacing="0.1em">{children}</Text>
  </Box.Absolute>
)

const SectionTitle = ({ children, ...props }) => (
  <Box.Absolute left={responsive('1em', '1.5em')} top={responsive('3.25em', '3.4375em')} {...props}>
    <Text fontSize={responsive('0.875em', '0.9375em')}>{children}</Text>
  </Box.Absolute>
)

const TrashDescription = (props) => (
  <Box.Absolute bottom={responsive('9%', '10%')} right={responsive('5%', '6em')} width={responsive('90%', '30%')}>
    <Text lineHeight="1.625" letterSpacing="0.075em" textAlign="justify" fontSize={responsive('0.75em', '1em')} {...props} />
  </Box.Absolute>
)

const TrashValue = (props) => (
  <Box.Absolute bottom={responsive('12%', '10%')} right={responsive('10%', '8em')} width={responsive('80%', '25%')}>
    <Text lineHeight="1.75" letterSpacing="0.075em" textAlign="justify" fontSize={responsive('1em', '1em')} fontWeight="700" {...props} />
  </Box.Absolute>
)

const TrashNote = ({ children, ...props }) => {
  const lined = useMemo(() => {
    return children && children.replace(/\|/g, '\n')
  }, [children])
  return children && (
    <Box.Absolute top={responsive('1em', 'auto')} bottom={responsive('auto', '1.25em')} right={responsive('6%', '4.75em')} width={responsive('50%', '20%')}>
      <Text textAlign="right" fontSize={responsive('0.875em', '1em')} whiteSpace="pre-wrap" {...props}>
        *{lined}
      </Text>
    </Box.Absolute>
  )
}

const TrashNumber = ({ children, ...props }) => (
  <Box.Absolute
    bottom={responsive('auto', '1.25em')}
    top={responsive('0em', 'auto')}
    left={responsive('1em', '1.5em')}
    color="white"
    {...props}
  >
    <Text.Number fontSize={responsive('1.25em', '1em')}>{children}</Text.Number>
  </Box.Absolute>
)

const getPoses = (data, newHeight, explosionGap) => {
  const posByPartName = {}
  const posByOrder = []
  const yStart = newHeight - (newHeight - imgSize[1]) / 2

  return [
    data.imgs.map((cfg) => {
      // calc parts y position
      const y = (yStart - cfg.y - data.positions[cfg.order] - imgSize[1] * explosionGap / 100 * cfg.order) / imgSize[1] * 100
      posByOrder[cfg.order] = y
      const yPos = `${y}%`
      if (cfg.partName) {
        posByPartName[cfg.partName] = yPos
      }
      return yPos
    }),
    posByPartName,
    posByOrder,
  ]
}

const getHeightConfig = (data, explosionGap) => {
  const newHeight = data.totalHeight + (data.partsCount - 1) * imgSize[1] * explosionGap / 100
  return newHeight
}

const colorsCfg = {
  A: 'green',
  B: 'orange',
  C: 'pink',
}

const gradeData = {
  A: '因為材質單純、處理成本相對低，此類垃圾回收價值高。只要你不分錯，它們就有很高的機會被再利用。',
  B: '這類的垃圾有回收價值，但因為某些原因造成結果浮動，像是垃圾的量不夠、怎麼回收或製造。我們可以試著好好回收，創造它的回收價值喔！',
  C: '因為回收價格低、太難處理或太髒等，造成它沒有回收價值。我們可以選擇重複使用，或者少用點。',
}

let cfgPoses = {}

const TrashPage = ({ trashData: data, allData, data: { site: { siteMetadata } } }) => {
  const [scrollProgress, setProgress] = useState()
  const windowSize = useWindowSize()
  const { isMobile } = useResponsive()
  const { containerWidth } = useContext(containerWidthContext)
  // setup refs
  const faceRef = useRef()
  const trashRef = useRef()
  const trashXRef = useRef()
  const layerRefs = useMemo(() => data.imgs.map(() => createRef()), [data])
  const animaRefs = useMemo(() => data.imgs.map(() => createRef()), [data])
  const partsRefs = useMemo(() => data.imgs.map(() => createRef()), [data])
  useReloadOnOrentation()

  const colorScheme = `colors.${colorsCfg[data.recycleValue]}`
  const trashWidth = (isMobile ? (isIos ? 135 : 160) : 75) * (data.transform.scale ? (isMobile && data.transform.mobileScale ? data.transform.mobileScale : data.transform.scale) / 100 : Math.min(1, idealWidth / (data.xRange[1] - data.xRange[0])))
  const explosionGap = (isMobile ? 10 : 5) * (100 + (data.transform.gap || 0)) / 100
  const faceId = useMemo(() => data.transform.faceNo || (random(4) + 1), [data])
  const readeMore = useMemo(() => sampleSize(allData.filter(d => d.img && d.id !== data.id), 5), [data, allData])
  const endTransition = [
    [0 + (data.transform.mobileX || 0), -50 + (data.transform.mobileY || 0)],
    [-trashSidePos + (data.transform.x || 0), -20 + (data.transform.y || 0)],
  ]
  const endPos = [containerWidth * 1, containerWidth * 0.25]
  useShowHeader(colorScheme)
  useLoader(data.img)
  const pageUrl = `${siteMetadata.url}/trash/${data.id}`

  const n = `#${String(data.id).padStart(3, '0')}`
  const parts = useMemo(() => {
    if (!data) return null
    return data.imgs.map(({ src, centeroid, x, width, partName, side }, i) => {
      let pos
      let linePos
      const theSide = isMobile ? 0 : side

      if (partName) {

        pos = theSide ? (x * 1 + width * 1) / imgSize[0] * 100 + 3 : (1 - x / imgSize[0]) * 100 + 3
        linePos = theSide ? {
          left: `${pos}%`,
          right: `${100 - pos}%`
        } : {
          right: `${pos}%`,
          left: `${100 - pos}%`
        }

        cfgPoses[partName] = {
          pos,
          linePos,
        }
      }
      const top = `${centeroid[1] / imgSize[1] * 100}%`
      return (
        <Box.FullAbs ref={layerRefs[i]} key={i}>
          <BackgroundImage ref={animaRefs[i]} ratio={imgSize[0] / imgSize[1]} src={src} />
          {partName && (
            <Box ref={partsRefs[i]}>
              <Box.Absolute
                top={top}
                style={linePos}
                height="2px"
                bg={colorScheme}
                className="line"
              />
              <Box.Absolute
                top={top}
                style={{ [theSide ? 'left' : 'right'] : `${pos}%` }}
                transform="translateY(-50%)"
                whiteSpace="nowrap"
                className="circle-container"
                pointerEvents="all"
              >
                <Circle
                  bg={colorScheme}
                  width={responsive('7em', '7.5em')}
                  textAlign="center"
                  className="circle-1"
                  whiteSpace="pre-wrap"
                  opacity={0}
                >
                  <Text color="black" fontSize={responsive('1.125em', '0.9375em')} fontWeight="900">{partName}</Text>
                  <Text color="white" fontSize={responsive('0.625em', '0.78125em')}>{data.partsDetail[partName]}</Text>
                </Circle>
                <Box.FullAbs className="circle-2" transform="scale(0)">
                  <Circle border="2px solid" borderColor={colorScheme} bg="white" width="100%" textAlign="center" whiteSpace="pre-wrap">
                    <Text color="black" fontSize={responsive('1.125em', '0.9375em')} fontWeight="900">{data.belongsTo[partName]}</Text>
                    {data.recycleRate[data.belongsTo[partName]] && (
                      <Text color={colorScheme} fontSize={responsive('0.625em', '0.78125em')} fontWeight="900">回收率{data.recycleRate[data.belongsTo[partName]]}%</Text>
                    )}
                  </Circle>
                </Box.FullAbs>
                <Box.Absolute className="circle-rate" opacity="0" left="-8%" right="-8%" top="-8%" bottom="-8%" pointerEvents="none">
                  {data.recycleRate[data.belongsTo[partName]] && (
                    <RateCircle className="circle-rate-progress" value={data.recycleRate[data.belongsTo[partName]]} color={colorScheme} />
                  )}
                </Box.Absolute>
              </Box.Absolute>
            </Box>
          )}
        </Box.FullAbs>
      )
    })
  }, [data, isMobile])
  const pages = [
    (
      <Container height="100%">
        <Box.Absolute left={responsive('1em', '1.5em')} top="0em">
          <Text.Number
            textStroke="0.15625rem"
            textStrokeColor={`colors.${colorScheme}`}
            color="white"
            fontSize={responsive('2.5em', '6.25em')}
          >{n}</Text.Number>
        </Box.Absolute>
        <Box.AbsCenter top={responsive('17%', '40%')} width="100%" textAlign="center" transform="rotate(-12deg)">
          <SizeMe>
            {({ size }) => (
              <Text
                as="h2"
                color={colorScheme}
                fontSize={size.width ? `${Math.min(Math.floor(size.width / (data.name.length + 1)), size.width / 4.5)}px` : 0}
                fontWeight="900"
                letterSpacing={data.name.length < 3 && '0.5em'}
                ml={data.name.length < 3 && '0.25em'}
              >
                {data.name}
              </Text>
            )}
          </SizeMe>
        </Box.AbsCenter>
        <TrashDescription color={colorScheme}>
          {data.description}
        </TrashDescription>
        <ChevDown onClick={() => fpApi.moveSectionDown()} />
      </Container>
    ),
    (
      <Container height="100%">
        <TrashName>{data.name}</TrashName>
        <Box.Absolute top={responsive('5%', '10%')} width={responsive('86%', '50%')} left={responsive('7%', 0)}>
          <Hashtag color={colorScheme}>{data.recycleValue}</Hashtag>
        </Box.Absolute>
        <TrashValue color="white">
          {gradeData[data.recycleValue]}
        </TrashValue>
        <TrashNumber>{n}</TrashNumber>
        <ChevDown onClick={() => fpApi.moveSectionDown()} />
      </Container>
    ),
    (
      <Container height="100%">
        <TrashName color={colorScheme}>{data.name}</TrashName>
        <SectionTitle>組成的材質是什麼？</SectionTitle>
        <TrashNumber color={colorScheme}>{n}</TrashNumber>
        <TrashNote color={colorScheme}>
          {data.partsNote}
        </TrashNote>
        <ChevDown onClick={() => fpApi.moveSectionDown()} />

      </Container>
    ),
    (
      <Container height="100%">
        <TrashName color={colorScheme}>{data.name}</TrashName>
        <SectionTitle>用完應該丟在哪裡？</SectionTitle>
        <TrashNumber color={colorScheme}>{n}</TrashNumber>
        <TrashNote color={colorScheme}>
          {data.recycleNote}
        </TrashNote>
        <ChevDown onClick={() => fpApi.moveSectionDown()} />

      </Container>
    ),
    <>
      <Box as={isMobile ? 'div' : Container} px={responsive(0, '1.25em')}>
        <Box width={responsive('100%', '50%')} mx="auto" pt={responsive('0', '5vh')}>
          <BackgroundImage src={isMobile ? shareBgMobile : shareBg} ratio={isMobile ? 750 / 574 : 1368 / 746} overflow="visible">
            <SizeMe>
              {({ size }) => (
                <Box.Absolute left={responsive('2em', '40%')} top={responsive('3em', '36%')} transform={responsive('', 'trnsateY(-50%)')} width={responsive('55%', '45%')}>
                  <Box fontSize={`${size.width / 25}px`}>
                    <Text letterSpacing="0.05em" fontSize={responsive('1.75em', '2.25em')} fontWeight="900">＃如果你不好好丟垃圾</Text>
                    <Text fontSize={responsive('3.25em', '3.5em')} fontWeight="900" color={colorScheme}>{data.share}</Text>
                  </Box>
                </Box.Absolute>
                )}
            </SizeMe>
          </BackgroundImage>
          <Flex fontSize={responsive('1em', '0.625em')} px="0.25em" justifyContent={responsive('', 'flex-end')} mt={responsive('-10%', '-4rem')} mr={responsive(0, '-2rem')}>
            <FB border="1px solid black" mx="0.125em" rounded="0.25em" href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`} />
            <Line border="1px solid black" mx="0.125em" rounded="0.25em" href={`https://line.naver.jp/R/msg/text/?${pageUrl}`} />
          </Flex>
        </Box>
      </Box>
      <Box
        bg={colorScheme}
        pb="1em"
        pt="2em"
        position="relative"
      >
        <Container px="1.25em">
          <Flex pt="1em" flexDirection={responsive('column', 'row')}>
            <Box>
              <Box pr={responsive(0, '1.5em')}>
                <Text fontWeight="700" color="white" fontSize={responsive('1.125em', '1.25em')} letterSpacing="0.1em">＃要給垃圾一個好歸宿，你該這麼做</Text>
              </Box>
              <Handling steps={data.handling} />
            </Box>
            {data.alternative && (
              <Box
                flex="1"
                color="white"
                mt={responsive('1em', 0)}
                pt={responsive('1em', 0)}
                pl={responsive('0', '1.5em')}
                borderTop={responsive('2px solid', 'none')}
                borderLeft={responsive('none', '2px solid')}
                alignItems={responsive('flex-start', 'center')}
              >
                <Text fontWeight="700" fontSize={responsive('1.125em', '1.25em')} letterSpacing="0.1em">＃或者，你有替代方案：</Text>
                <Flex width={responsive('20em', '24em')} mr={responsive('0', '1em')} alignItems="flex-end" my={responsive('1em', '0.5em')}>
                  <Box width="22%" pb="5%">
                    <Image src={planb} />
                  </Box>
                  <Box flex="1" pl="2%">
                    <BackgroundImage src={planbBubble} ratio={486 / 176}>
                      <Box.Absolute top="50%" left="16%" right="5%" transform="translateY(-50%)">
                        <Text fontSize={responsive('1.125em', '1em')} letterSpacing="0.1em">{data.alternative}</Text>
                      </Box.Absolute>
                    </BackgroundImage>
                  </Box>
                </Flex>
              </Box>
            )}
          </Flex>
        </Container>
      </Box>
      <Box bg="white" py="1.25em" position="relative" zIndex={1}>
        <Container>
          <Flex mt={responsive('0.5em', '0.25em')}>
            <Box width="1.75em" mr="0.5em">
              <Image src={trash} />
            </Box>
            <Text fontSize={responsive('1.25em', '1.25em')} fontWeight="900" letterSpacing="0.125em">猜你也丟過這些...</Text>
          </Flex>
        </Container>
        <Box overflow={responsive('scroll', 'hidden')} mr={responsive(0, '1.25em')} className="overflow-scroll" py="1em">
          <Box as={isMobile ? 'div' : Container}>
            <Flex width={responsive('200vw', '100%')}>
              {readeMore.map(d => (
                <Box key={d.id} width="20%">
                  <Box p="2%">
                    <PerTrash data={d} />
                  </Box>
                </Box>
              ))}
            </Flex>
          </Box>
        </Box>
        <Container px={responsive('0', '2em')}>
          <Footer pt="2em" />
        </Container>
      </Box>
      <Box.Absolute
        left="0"
        right="0"
        top="0"
        height={`${windowSize.height - theme.headerHeight}px)`}
        pointerEvents="none"
        opacity={(scrollProgress >= 1) * 1}
      >
        <Container height="100%">
          <Box.Relative height="100%">
            <Box.Absolute
              width={`${trashWidth}%`}
              left={`${(100 - trashWidth) / 2}%`}
              top={responsive(`${endPos[0]}px`, `${endPos[1]}px`)}
              transform={`translate3d(${isMobile ? '10%' : 0}, -50%, 0) ${data.transform.rotate ? `rotate(${isMobile && data.transform.mobileRotate ? data.transform.mobileRotate : data.transform.rotate}deg)` : ''}`}
            >
              <Box transform={`translate(${endTransition[isMobile ? 0 : 1].map(d => `${d}%`).join(',')}) ${data.transform.shareScale ? `scale(${(isMobile && data.transform.mobileShareScale ? data.transform.mobileShareScale : data.transform.shareScale) / 100})` : ''}`}>
                <Image src={data.img} />
                <Face transform={data.transform.face} id={faceId} />
              </Box>
            </Box.Absolute>
          </Box.Relative>
        </Container>
      </Box.Absolute>
    </>,
  ]
  const pageCount = pages.length
  const pagesRefs = useMemo(() => range(pageCount).map(() => createRef()), [])
  // const pageRevealRefs = useMemo(() => range(pageCount).map(() => createRef()), [])
  useEffect(() => {
    if (theTimeline) {
      theTimeline.kill()
    }
    // set trash size
    const defaultTrashCfg = {
      width: `${trashWidth}%`,
      left: `${(100 - trashWidth) / 2}%`,
      rotate: (isMobile && data.transform.mobileRotate ? data.transform.mobileRotate : data.transform.rotate) || 0,
      y: '-50%',
    }
    gsap.set(trashRef.current, defaultTrashCfg)
    const rateEles = []

    theTimeline = gsap.timeline({
      onUpdate: () => {
        if (rateEles.length) {
          rateEles.forEach((ele) => {
            const e = new Event('progress')
            e.progress = Math.min(1, Math.max(0, theTimeline.time() - 2))
            ele.dispatchEvent(e)
          })
        }
      },
    })
    endTimeline = gsap.timeline()
    // console.log(data)
    const newHeight = getHeightConfig(data, explosionGap)
    // set exploded trash size
    const explodeWidthFactor = Math.min(
      Math.floor(((windowSize.height - 60) / (newHeight * (isMobile ? 1.35 : 1.2)) * imgSize[0]) / containerWidth * 100),
      isMobile ? (data.transform.explosionScale || 100) : 50
    )

    const animation = animations[data.name]

    theTimeline.to(faceRef.current, {
      opacity: 0,
      duration: scrollingDuration,
    })
    theTimeline.to(trashRef.current, {
      rotate: 0,
      duration: scrollingDuration,
    }, 0)
    theTimeline.to(trashRef.current, {
      width: `${explodeWidthFactor}%`,
      left: `${(100 - explodeWidthFactor) / 2}%`,
      top: isMobile ? `${50 + (data.transform.mobileExplosionY || 0)}%` : '50%',
      x: isMobile ? '25%' : '0',
      // y: isMobile ? '45%' : '50%',
      duration: scrollingDuration,
    }, scrollingDuration)
    const [poses, posByPartName, posByOrder] = getPoses(data, newHeight, explosionGap)
    // const heightByOrder = posByOrder.reduce((all, p, i) => [...all, i < posByOrder.length - 1 ? (p - posByOrder[i + 1]) : 0], [])
    const combineParts = []

    data.imgs.forEach((cfg, i) => {
      gsap.set(layerRefs[cfg.index].current, { y: '0%' })
      // calc parts y position
      theTimeline.to(layerRefs[cfg.index].current, {
        y: poses[i],
        duration: scrollingDuration,
      }, scrollingDuration)
      if (animation && animation[cfg.layerName]) {
        Object.entries(animation[cfg.layerName]).forEach(([d, ani]) => {
          theTimeline.to(animaRefs[cfg.index].current, {
            ...ani,
            duration: scrollingDuration * (d / 100),
          }, scrollingDuration)
        })
      }
      if (cfg.partName) {
        theTimeline.to(partsRefs[cfg.index].current.querySelector('.circle-container'), {
          [cfg.side && !isMobile ? 'left' : 'right']: isMobile ? '92%' : '100%',
          duration: scrollingDuration,
        }, scrollingDuration)
        theTimeline.to(partsRefs[cfg.index].current.querySelector('.line'), {
          [cfg.side && !isMobile ? 'right' : 'left']: '-2%',
          opacity: 1,
          duration: scrollingDuration,
        }, scrollingDuration)
        theTimeline.to(partsRefs[cfg.index].current.querySelector('.circle-1'), {
          opacity: 1,
          duration: scrollingDuration,
        }, scrollingDuration)

        if (/^@/.test(data.belongsTo[cfg.partName])) {
          const attachName = data.belongsTo[cfg.partName].substring(1)
          const offset = posByPartName[attachName].replace('%', '') - poses[i].replace('%', '')
          combineParts[cfg.order] = [attachName, offset]
        }
      }
      theTimeline.to(layerRefs[cfg.index].current, {
        y: 0,
        duration: scrollingDuration,
      }, scrollingDuration * 3)
    })

    const offsetSign = combineParts.length ? combineParts.reduce((s, o) => {
      if (s === 0) return 0
      const sign = o ? Math.sign(o[1]) : null
      return typeof s === 'number' ? (s === sign ? s : 0) : sign
    }, null) : 0
    const totalOffset = combineParts.length ? combineParts.reduce((s, o) => {
      return s + (o ? o[1] : 0)
    }, 0) : 0
    // console.log(combineParts, offsetSign, totalOffset)
    if (totalOffset) {
      theTimeline.to(trashXRef.current, {
        y: `${-totalOffset / (combineParts.filter(Boolean).length + 1)}%`,
        duration: scrollingDuration,
      }, 2 * scrollingDuration)
    }

    data.imgs.forEach((cfg, i) => {
      if (combineParts[cfg.order]) {
        theTimeline.to(layerRefs[cfg.index].current, {
          y: posByPartName[combineParts[cfg.order][0]],
          duration: scrollingDuration,
        }, 2 * scrollingDuration)
        if (cfg.partName) {
          theTimeline.to(partsRefs[cfg.index].current.querySelector('.circle-container'), {
            opacity: 0,
            [cfg.side && !isMobile ? 'left' : 'right']: `${cfgPoses[cfg.partName].pos}%`,
            duration: scrollingDuration,
          }, scrollingDuration * 2)
          theTimeline.to(partsRefs[cfg.index].current.querySelector('.line'), {
            opacity: 0,
            ...cfgPoses[cfg.partName].linePos,
            duration: scrollingDuration,
          }, scrollingDuration * 2)
          theTimeline.to(partsRefs[cfg.index].current.querySelector('.circle-1'), {
            opacity: 0,
            duration: scrollingDuration,
          }, scrollingDuration * 2)
        }
      } else  {

        if (offsetSign < 0) {
          if (cfg.order < combineParts.length && !combineParts[cfg.order]) {
            const nextPart = combineParts.slice(cfg.order).find(Boolean)
            theTimeline.to(layerRefs[cfg.index].current, {
              y: `${poses[i].replace('%', '') * 1 + nextPart[1]}%`,
              duration: scrollingDuration,
            }, 2 * scrollingDuration)
          }
        }

        if (cfg.partName) {
          theTimeline.to(partsRefs[cfg.index].current.querySelector('.circle-2'), {
            scale: 1,
            duration: scrollingDuration,
          }, 2 * scrollingDuration)
          theTimeline.to(partsRefs[cfg.index].current.querySelector('.circle-rate'), {
            opacity: 1,
            duration: scrollingDuration / 2,
          }, 2.5 * scrollingDuration)
          const rateEle = partsRefs[cfg.index].current.querySelector('.circle-rate-progress')
          if (rateEle) {
            rateEles.push(rateEle)
          }
          theTimeline.to(partsRefs[cfg.index].current.querySelector('.circle-container'), {
            opacity: 0,
            [cfg.side && !isMobile ? 'left' : 'right']: `${cfgPoses[cfg.partName].pos}%`,
            duration: scrollingDuration,
          }, scrollingDuration * 3)
          theTimeline.to(partsRefs[cfg.index].current.querySelector('.line'), {
            opacity: 0,
            ...cfgPoses[cfg.partName].linePos,
            duration: scrollingDuration,
          }, scrollingDuration * 3)
          theTimeline.to(partsRefs[cfg.index].current.querySelector('.circle-1'), {
            opacity: 0,
            duration: scrollingDuration * 0.1,
          }, scrollingDuration * 3)
          theTimeline.to(partsRefs[cfg.index].current.querySelector('.circle-2'), {
            opacity: 0,
            duration: scrollingDuration,
          }, 3 * scrollingDuration)
          theTimeline.to(partsRefs[cfg.index].current.querySelector('.circle-rate'), {
            opacity: 0,
            duration: scrollingDuration,
          }, 3 * scrollingDuration)
        }

        if (animation && animation[cfg.layerName]) {
          theTimeline.to(animaRefs[cfg.index].current, {
            ...animation[cfg.layerName][0],
            duration: scrollingDuration,
          }, 3 * scrollingDuration)
        }
      }
    })
    theTimeline.to(trashRef.current, {
      ...defaultTrashCfg,
      duration: scrollingDuration,
    }, scrollingDuration * 3)
    endTimeline
      .to(trashXRef.current, {
        duration: scrollingDuration,
        x: `${endTransition[isMobile ? 0 : 1][0]}%`,
        y: `${endTransition[isMobile ? 0 : 1][1]}%`,
        scale: data.transform.shareScale ? (isMobile && data.transform.mobileShareScale ? data.transform.mobileShareScale : data.transform.shareScale) / 100 : 1,
      }, 0)
      .to(trashRef.current, {
        x: isMobile ? '10%' : 0,
        duration: scrollingDuration,
        top: `${endPos[isMobile ? 0 : 1]}px`,
      }, 0)
      .to(faceRef.current, { duration: scrollingDuration, opacity: 1 })

    endTimeline.pause()
    theTimeline.pause()
  }, [data, windowSize.height, containerWidth, isMobile])
  const bgColor = get(theme, `colors.${colorScheme}`)
  // console.log(data)
  return (
    <div>
      <ReactFullpage
        sectionsColor={['', bgColor, 'white', 'white', bgColor]}
        licenseKey={process.env.FULLPAGE_JS_KEY}
        scrollingSpeed={scrollingDuration * 1000}
        verticalCentered={false}
        onLeave={(origin, destination) => {
          theTimeline.tweenTo(destination.index * scrollingDuration, { duration: scrollingDuration })
          endTimeline.tweenTo(Math.max(destination.index - 3, 0) * scrollingDuration)
          if (progressTimer) {
            progressTimer.stop()
          }
          const incre = destination.index - origin.index
          progressTimer = timer((elapsed) => {
            setProgress((origin.index + incre * Math.min(elapsed / (scrollingDuration * 1000), 1)) / (pageCount - 1))
            if (elapsed > scrollingDuration * 1000) progressTimer.stop();
          });
        }}
        scrollOverflow
        normalScrollElements={isMobile ? '.overflow-scroll, .footer-nav' : '.footer-nav'}
        afterRender={() => {
          setTimeout(() => {
            document.body.style.height = `${windowSize.height}px`
          })
        }}
        afterResize={() => {
          setTimeout(() => {
            document.body.style.height = `${windowSize.height}px`
          })
        }}
        render={({ fullpageApi }) => {
          fpApi = fullpageApi
          return (
            <ReactFullpage.Wrapper>
              {pages.map((page, i) => (
                <div className={`section ${i === 4 ? '' : 'fp-noscroll'}`} key={i} ref={pagesRefs[i]}>
                  <Box height="100%" pt={theme.headerHeight}>
                    {/* {createElement(i ? PageReveal : 'div', { ref: pageRevealRefs[i] }, page)} */}
                    <Box.Relative height="100%">
                      {page}
                    </Box.Relative>
                  </Box>
                </div>
              ))}
            </ReactFullpage.Wrapper>
          )
        }}
      />
      <Box.Fixed
        top="0"
        left="0"
        right="0"
        display={scrollProgress >= 1 ? 'none' : 'block'}
        height={`${windowSize.height}px`}
        zIndex="docked"
        pointerEvents="none"
        pt={theme.headerHeight}
      >
        <Container height="100%">
          <Box.Relative height="100%">
            <Box.Absolute
              ref={trashRef}
              id="trash-container"
              top={responsive(`${45 + (data.transform.mobileFirstY || 0)}%`, `${50 + (data.transform.firstY || 0)}%`)}
              width={`${trashWidth}%`}
              left={`${(100 - trashWidth) / 2}%`}
            >
              <div ref={trashXRef}>
                <AspectRatio ratio={imgSize[0] / imgSize[1]} overflow="visible">
                  <Box overflow="visible">
                    {parts}
                    <Face transform={data.transform.face} ref={faceRef} id={faceId} />
                  </Box>
                </AspectRatio>
              </div>
            </Box.Absolute>
          </Box.Relative>
        </Container>
      </Box.Fixed>
      {!isMobile && (
        <Box.Fixed top={responsive('2em', '5%')} bottom="5%" right="1.25em" width={responsive('9em', '1.875em')} zIndex="docked" pt={theme.headerHeight}>
          <ScrollIndicator onClick={() => fpApi.moveTo(5)} isMobile={isMobile} progress={scrollProgress} />
        </Box.Fixed>
      )}
    </div>
  )
}

export default withData(TrashPage)
