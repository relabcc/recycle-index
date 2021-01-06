import React, { useEffect, useRef, useState, useMemo, createRef, forwardRef, createElement, useContext } from 'react'
import { AspectRatio } from '@chakra-ui/react'
import { random, range, sampleSize } from 'lodash'
import gsap, { TimelineMax, TweenMax } from 'gsap'
import ScrollMagic from "scrollmagic";
import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap";
import { useWindowSize } from 'react-use';
import { SizeMe } from 'react-sizeme';

import FullpageHeight from '../../components/FullpageHeight'
import Box from '../../components/Box'
import Text from '../../components/Text'
import Flex from '../../components/Flex'
import Button from '../../components/Button'
import Circle from '../../components/Circle'
import Container from '../../components/Container'
import BackgroundImage from '../../components/BackgroundImage'
import withData from './data/withData';
import animations from './data/animations'
import ChevDown from './ChevDown';
import Hashtag from './Hashtag';
import RateCircle from './RateCircle';
import Face from '../Face';

import shareBg from './share-bg.svg'
import shareBgMobile from './share-bg-mobile.svg'
import Handling from './Handling';
import ScrollIndicator from './ScrollIndicator';
import containerWidthContext from '../../contexts/containerWidth/context'
import useResponsive from '../../contexts/mediaQuery/useResponsive';
import useShowHeader from '../../contexts/header/useShowHeader';
import theme, { responsive } from '../../components/ThemeProvider/theme';
import useLoader from '../../utils/useLoader';
import imgSize from './data/imgSize'

ScrollMagicPluginGsap(ScrollMagic, TweenMax, TimelineMax);

// const pageCount = 5
const trashSidePos = 20

// const getNameSize = name => {
//   if (!name) return null
//   const { length } = name
//   if (length > 5) return '10em'
//   if (length > 4) return '12em'
//   if (length > 3) return '18em'
//   if (length > 2) return '20em'
//   return '28em'
// }

let explodeTimeline
let partsTimeline
let endTimeline
let controller

const TrashName = ({ children, ...props }) => (
  <Box.Absolute
    top={responsive('6em', '2em')}
    left={responsive('2em', '1em')}
    color="white"
    {...props}
  >
    <Text fontSize={responsive('4em', '2.5em')} fontWeight="900" letterSpacing="0.1em">{children}</Text>
  </Box.Absolute>
)

const SectionTitle = ({ children, ...props }) => (
  <Box.Absolute left={responsive('2em', '1em')} top={responsive('12em', '5.5em')} {...props}>
    <Text fontSize={responsive('2em', '1.5em')}>{children}</Text>
  </Box.Absolute>
)

const TrashDescription = (props) => (
  <Box.Absolute bottom={responsive('8%', '10%')} right={responsive('6%', '6em')} width={responsive('88%', '33%')}>
    <Text textAlign="justify" fontSize={responsive('3em', '1.25em')} {...props} />
  </Box.Absolute>
)

const TrashNumber = ({ children, ...props }) => (
  <Box.Absolute
    bottom={responsive('auto', '2em')}
    top={responsive('2em', 'auto')}
    left={responsive('2em', '1em')}
    color="white"
    {...props}
  >
    <Text.Number fontSize={responsive('3.5em', '1.75em')}>{children}</Text.Number>
  </Box.Absolute>
)

const PageReveal = forwardRef(({ children }, ref) => (
  <Box.Absolute height="0" left="0" right="0" ref={ref} overflow="hidden">
    <Box height="100vh" position="absolute" left="0" right="0" bottom="0" pt={theme.headerHeight}>
      <Box.Relative height="100%">
        {children}
      </Box.Relative>
    </Box>
  </Box.Absolute>
))

const colorsCfg = {
  A: 'green',
  B: 'orange',
  C: 'pink',
}

const TrashPage = ({ data, allData }) => {
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

  const colorScheme = `colors.${colorsCfg[data.recycleValue]}`
  const trashWidth = isMobile ? 120 : 75
  const explosionGap = isMobile ? 10 : 5
  const faceId = useMemo(() => random(4) + 1, [data])
  const readeMore = useMemo(() => sampleSize(allData.filter(d => d.img && d.id !== data.id), 5), [data])

  useShowHeader('white')
  useLoader(data.img)

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
      }
      const top = `${centeroid[1] / imgSize[1] * 100}%`
      return (
        <Box.FullAbs ref={layerRefs[i]} key={i}>
          <BackgroundImage ref={animaRefs[i]} ratio={imgSize[0] / imgSize[1]} src={src} />
          {partName && (
            <Box ref={partsRefs[i]}>
              {/* <Box.Absolute
                top={top}
                left={`${left}%`}
                width="0.5em"
                height="0.5em"
                transform="translate(-50%, -50%)"
                bg="black"
              /> */}
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
              >
                <Circle
                  bg={colorScheme}
                  width={responsive('20em', '12em')}
                  textAlign="center"
                  className="circle-1"
                  opacity={0}
                >
                  <Text color="black" fontSize={responsive('3em', '1.5em')} fontWeight="900">{partName}</Text>
                  <Text color="white" fontSize={responsive('2em', '1.25em')}>{data.partsDetail[partName]}</Text>
                </Circle>
                <Box.FullAbs className="circle-2" transform="scale(0)">
                  <Circle border="2px solid" borderColor={colorScheme} bg="white" width="100%" textAlign="center">
                    <Text color="black" fontSize={responsive('3em', '1.5em')} fontWeight="900">{data.belongsTo[partName]}</Text>
                    {data.recycleRate[data.belongsTo[partName]] && (
                      <Text color={colorScheme} fontSize={responsive('2em', '1.25em')} fontWeight="900">回收率{data.recycleRate[data.belongsTo[partName]]}%</Text>
                    )}
                  </Circle>
                </Box.FullAbs>
                <Box.Absolute className="circle-rate" opacity="0" left="-8%" right="-8%" top="-8%" bottom="-8%">
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
  }, [data])

  const pages = [
    (
      <Box height="100%" pt={theme.headerHeight}>
        <Box.Relative height="100%">
          <Box.Absolute left="1em" top="1em">
            <Text.Number
              textStroke="0.25rem"
              textStrokeColor={`colors.${colorScheme}`}
              color="white"
              fontSize="10em"
            >{n}</Text.Number>
          </Box.Absolute>
          <Box.AbsCenter top={responsive('25%', '50%')} width="100%" textAlign="center" transform="rotate(-12deg)">
            <SizeMe>
              {({ size }) => (
                <Text as="h2" color={colorScheme} fontSize={size.width ? `${Math.floor(size.width / (data.name.length + 1))}px` : 0} fontWeight="900">
                  {data.name}
                </Text>
              )}
            </SizeMe>
          </Box.AbsCenter>
          <TrashDescription color={colorScheme} >
            {data.description}
          </TrashDescription>
          <ChevDown />
        </Box.Relative>
      </Box>
    ),
    (
      <>
        <TrashName>{data.name}</TrashName>
        <Box.Absolute top={responsive('25%', '10%')} width={responsive('100%', '50%')} left={0}>
          <Hashtag color={colorScheme}>{data.recycleValue}</Hashtag>
        </Box.Absolute>
        <TrashDescription color="white" >
          {data.description}
        </TrashDescription>
        <TrashNumber>{n}</TrashNumber>
        <ChevDown />
      </>
    ),
    (
      <>
        <TrashName color={colorScheme}>{data.name}</TrashName>
        <SectionTitle>組成的材質是什麼？</SectionTitle>
        <TrashNumber color={colorScheme}>{n}</TrashNumber>
      </>
    ),
    (
      <>
        <TrashName color={colorScheme}>{data.name}</TrashName>
        <SectionTitle>用完應該丟在哪裡？</SectionTitle>
        <TrashNumber color={colorScheme}>{n}</TrashNumber>
      </>
    ),
    <>
      <Box.Absolute width={responsive('100%', '80%')} left={responsive(0, '50%')} top={responsive(0, '50%')} transform={responsive('', 'translate(-50%,-50%)')}>
        <BackgroundImage src={isMobile ? shareBgMobile : shareBg} ratio={isMobile ? 750 / 574 : 1368 / 746} overflow="visible">
          <Box.Absolute left={responsive('2em', '45%')} top={responsive('8em', '40%')} transform={responsive('', 'trnsateY(-50%)')} width={responsive('100%', '40%')}>
            <Text letterSpacing="0.05em" fontSize={responsive('5em', '2.25em')} fontWeight="900">＃如果你不好好回收</Text>
            <Text fontSize={responsive('3.25em', '2.75em')} fontWeight="900" color={colorScheme}>你就會夢到吸管插在鼻孔裡！</Text>
          </Box.Absolute>
        </BackgroundImage>
      </Box.Absolute>
      {scrollProgress === 1 && (
        <Box.Absolute
          width={`${trashWidth}%`}
          left={`${(100 - trashWidth) / 2}%`}
          top={responsive('45%', '50%')}
          transform={`translate(-${isMobile ? 0 : trashSidePos}%, -50%)`}
        >
          <BackgroundImage ratio={imgSize[0] / imgSize[1]} src={data.img} />
          <Face id={faceId} />
        </Box.Absolute>
      )}
    </>,
  ]
  const pageCount = pages.length
  const pagesRefs = useMemo(() => range(pageCount).map(() => createRef()), [])
  const pageRevealRefs = useMemo(() => range(pageCount).map(() => createRef()), [])
  useEffect(() => {
    if (explodeTimeline) {
      explodeTimeline.kill()
      partsTimeline.kill()
      endTimeline.kill()
      controller.destroy()
    }
    controller = new ScrollMagic.Controller();
    // set trash size
    gsap.set(trashRef.current, { width: `${trashWidth}%`, left: `${(100 - trashWidth) / 2}%` })
    // pin trash
    new ScrollMagic.Scene({
      triggerElement: pagesRefs[0].current,
      duration: `${pageCount * 100 - 50}%`,
    }).addTo(controller)
      .on('progress', (e) => setProgress(e.progress));

    explodeTimeline = new TimelineMax()
    partsTimeline = new TimelineMax()
    endTimeline = new TimelineMax()
    // console.log(data)
    const newHeight = data.totalHeight + (data.partsCount - 1) * imgSize[1] * explosionGap / 100
    const yStart = newHeight - (newHeight - imgSize[1]) / 2
    const rateEles = []
    const animation = animations[data.name]
    // set exploded trash size
    const explodeWidthFactor = Math.min(
      Math.floor((windowSize.height / (newHeight * 1.1) * imgSize[0]) / containerWidth * 100),
      isMobile ? 100 : 50
    )
    explodeTimeline.to(trashRef.current, {
      width: `${explodeWidthFactor}%`,
      left: `${(100 - explodeWidthFactor) / 2}%`,
      x: isMobile ? '25%' : '0',
      duration: 1,
    })
    new ScrollMagic.Scene({ triggerElement: pagesRefs[1].current, duration: '50%' })
      .setTween(faceRef.current, 1, { opacity: 0 })
      .addTo(controller);

    data.imgs.forEach((cfg) => {
      gsap.set(layerRefs[cfg.index].current, { y: '0%' })
      // calc parts y position
      explodeTimeline.to(layerRefs[cfg.index].current, {
        y: `${(yStart - cfg.y - data.positions[cfg.order] - imgSize[1] * explosionGap / 100 * cfg.order) / imgSize[1] * 100}%`,
        duration: 1,
      }, 0)
      if (animation && animation[cfg.layerName]) {
        Object.entries(animation[cfg.layerName]).forEach(([d, ani]) => {
          explodeTimeline.to(animaRefs[cfg.index].current, {
            ...ani,
            duration: 1 * (d / 100),
          }, 0)
        })
      }
      if (cfg.partName) {
        explodeTimeline.to(partsRefs[cfg.index].current.querySelector('.circle-container'), {
          [cfg.side && !isMobile ? 'left' : 'right']: isMobile ? '80%' : '100%',
          duration: 1,
        }, 0)
        explodeTimeline.to(partsRefs[cfg.index].current.querySelector('.line'), {
          [cfg.side && !isMobile ? 'right' : 'left']: '-2%',
          opacity: 1,
          duration: 1,
        }, 0)
        explodeTimeline.to(partsRefs[cfg.index].current.querySelector('.circle-1'), {
          opacity: 1,
          duration: 1,
        }, 0)
        partsTimeline.to(partsRefs[cfg.index].current.querySelector('.circle-2'), {
          scale: 1,
          duration: 1,
        }, 0)
        partsTimeline.to(partsRefs[cfg.index].current.querySelector('.circle-rate'), {
          opacity: 1,
          duration: 1 / 2,
        }, 1 / 2)
        const rateEle = partsRefs[cfg.index].current.querySelector('.circle-rate-progress')
        if (rateEle) {
          rateEles.push(rateEle)
        }
      }
    })

    new ScrollMagic.Scene({ triggerElement: pagesRefs[2].current, duration: '50%' })
      .setTween(explodeTimeline)
      .addTo(controller);

    range(pageCount).forEach((i) => {
      if (i > 0) {
        new ScrollMagic.Scene({ triggerElement: pagesRefs[i].current, triggerHook: 'onEnter', duration: '100%' })
          .setPin(pagesRefs[i - 1].current, { pushFollowers: false })
          .on('progress', e => {
            if (pageRevealRefs[i].current) {
              pageRevealRefs[i].current.style.height = `${e.progress * 100}%`
            }
          })
          .addTo(controller);
      }
    })
    new ScrollMagic.Scene({ triggerElement: pagesRefs[3].current, duration: '50%' })
      .setTween(partsTimeline)
      .addTo(controller)
      .on("progress", (event) => {
        if (rateEles.length) {
          rateEles.forEach((ele) => {
            const e = new Event('progress')
            e.progress = event.progress
            ele.dispatchEvent(e)
          })
        }
      })
    endTimeline
      .to(trashXRef.current, { duration: 1, x: `-${isMobile ? 0 : trashSidePos}%` }, 0)
      .to(faceRef.current, { duration: 1, opacity: 1 })
    new ScrollMagic.Scene({ triggerElement: pagesRefs[4].current, duration: '33%' })
      .setTween(endTimeline)
      .addTo(controller)
      .on('progress', event => {
        explodeTimeline.seek(1 * (1 - event.progress))
        partsTimeline.seek(1 * (1 - event.progress))
      })
    return () => {
      if (controller) {
        controller.destroy()
      }
    }
  }, [data, windowSize.height, containerWidth])


  const pageBg = ['', colorScheme, 'white', 'white', colorScheme]
  return (
    <div>
      {pages.map((page, i) => (
        <Box
          height="100vh"
          bg={pageBg[i]}
          key={i}
          ref={pagesRefs[i]}
          overflow="hidden"
          position="relative"
          zIndex={1}
        >
          <Container position="relative" height="100%">
            {createElement(i ? PageReveal : Box, { ref: pageRevealRefs[i], height: '100%' }, page)}
          </Container>
        </Box>
      ))}
      <Box.Fixed
        top="0"
        left="0"
        right="0"
        display={scrollProgress === 1 ? 'none' : 'block'}
        height="100vh"
        zIndex="docked"
        pointerEvents="none"
      >
        <Container position="relative" height="100%">
          <Box.Absolute
            ref={trashRef}
            id="trash-container"
            width="80%"
            left="10%"
            top={responsive('45%', '50%')}
            transform="translate3d(0, -50%, 0)"
          >
            <div ref={trashXRef}>
              <AspectRatio ratio={imgSize[0] / imgSize[1]} overflow="visible">
                <Box overflow="visible">
                  {parts}
                  <Face ref={faceRef} id={faceId} />
                </Box>
              </AspectRatio>
            </div>
          </Box.Absolute>
        </Container>
      </Box.Fixed>
      <Box
        bg={colorScheme}
        py="2em"
        mt={`-${(windowSize.height - containerWidth * trashWidth / 100 * (imgSize[1] / imgSize[0])) / 2}px`}
        position="relative"
        zIndex={1}
      >
        <Container px="2em">
          <Text mt="0.5em" fontWeight="900" color="white" fontSize="1.5em" letterSpacing="0.1em">＃如果你想好好睡覺，你可以這麼做！</Text>
          <Handling steps={data.handling} />
        </Container>
      </Box>
      <Box bg="white" py="2em" position="relative" zIndex={1}>
        <Container my="2em">
          <Text fontSize="2em" fontWeight="900" letterSpacing="0.125em">猜你也丟過這些...</Text>
        </Container>
        <Box overflow={responsive('scroll', 'hidden')}>
          <Box as={isMobile ? 'div' : Container}>
            <Flex width={responsive('200vw', '100%')}>
              {readeMore.map(d => (
                <Box key={d.id} width="20%" px={responsive('2em')}>
                  <Button variant="outline" to={`/trash/${d.id}`} width="100%" height="auto" px="0" rounded="2em">
                    <BackgroundImage width="100%" src={d.img} ratio={1} />
                  </Button>
                </Box>
              ))}
            </Flex>
          </Box>
        </Box>
      </Box>
      <Box.Fixed top={responsive('2em', '5%')} bottom="5%" right="2em" width={responsive('9em', '3em')} zIndex="docked">
        <ScrollIndicator isMobile={isMobile} progress={scrollProgress} />
      </Box.Fixed>
    </div>
  )
}

export default withData(TrashPage)
