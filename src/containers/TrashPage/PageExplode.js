import React, { useEffect, useRef, useState, useMemo, createRef, useContext } from 'react'
import { AspectRatio } from '@chakra-ui/react'
import gsap from 'gsap'
import innerHeight from 'ios-inner-height'

import Box from '../../components/Box'
import Text from '../../components/Text'
import Circle from '../../components/Circle'
import Container from '../../components/Container'
import BackgroundImage from '../../components/BackgroundImage'
import withData from './data/withData';
import animations from './data/animations'
import RateCircle from './RateCircle';
import Face from '../Face';

import containerWidthContext from '../../contexts/containerWidth/context'
import useResponsive from '../../contexts/mediaQuery/useResponsive';
import theme, { responsive } from '../../components/ThemeProvider/theme';
import useLoader from '../../utils/useLoader';
import imgSize from './data/imgSize'
import isIos from '../../components/utils/isIos'

// const pageCount = 5
const scrollingDuration = 1
const idealWidth = 200

let theTimeline

const TrashName = ({ children, ...props }) => (
  <Box.Absolute
    top={responsive('4.5em', '1.25em')}
    left={responsive('2em', '0.625em')}
    color="white"
    {...props}
  >
    <Text fontSize={responsive('4em', '1.5625em')} fontWeight="900" letterSpacing="0.1em">{children}</Text>
  </Box.Absolute>
)

const SectionTitle = ({ children, ...props }) => (
  <Box.Absolute left={responsive('2em', '0.625em')} top={responsive('10.5em', '3.4375em')} {...props}>
    <Text fontSize={responsive('2em', '0.9375em')}>{children}</Text>
  </Box.Absolute>
)

const TrashNote = ({ children, ...props }) => children && (
  <Box.Absolute top={responsive('4em', 'auto')} bottom={responsive('auto', '1.25em')} right={responsive('6%', '3.75em')} width={responsive('50%', '33%')}>
    <Text textAlign="right" fontSize={responsive('2.5em', '1em')} {...props}>
      *{children}
    </Text>
  </Box.Absolute>
)

const TrashNumber = ({ children, ...props }) => (
  <Box.Absolute
    bottom={responsive('auto', '1.25em')}
    top={responsive('0em', 'auto')}
    left={responsive('2em', '0.625em')}
    color="white"
    {...props}
  >
    <Text.Number fontSize={responsive('3.5em', '1.09375em')}>{children}</Text.Number>
  </Box.Absolute>
)

const colorsCfg = {
  A: 'green',
  B: 'orange',
  C: 'pink',
}

const TrashPage = ({ data, windowSize, page }) => {
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
  const trashWidth = (isMobile ? (isIos ? 140 : 160) : 75) * (data.transform.scale ? (isMobile && data.transform.mobileScale ? data.transform.mobileScale : data.transform.scale) / 100 : Math.min(1, idealWidth / (data.xRange[1] - data.xRange[0])))
  const explosionGap = (isMobile ? 10 : 5) * (100 + (data.transform.gap || 0)) / 100

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
                pointerEvents="all"
              >
                <Circle
                  bg={colorScheme}
                  width={responsive('20em', '7.5em')}
                  textAlign="center"
                  className="circle-1"
                  whiteSpace="pre-wrap"
                  opacity={0}
                >
                  <Text color="black" fontSize={responsive('3em', '0.9375em')} fontWeight="900">{partName}</Text>
                  <Text color="white" fontSize={responsive('2em', '0.78125em')}>{data.partsDetail[partName]}</Text>
                </Circle>
                <Box.FullAbs className="circle-2" transform="scale(0)">
                  <Circle border="2px solid" borderColor={colorScheme} bg="white" width="100%" textAlign="center" whiteSpace="pre-wrap">
                    <Text color="black" fontSize={responsive('3em', '0.9375em')} fontWeight="900">{data.belongsTo[partName]}</Text>
                    {data.recycleRate[data.belongsTo[partName]] && (
                      <Text color={colorScheme} fontSize={responsive('2em', '0.78125em')} fontWeight="900">回收率{data.recycleRate[data.belongsTo[partName]]}%</Text>
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
  }, [data])

  // const pageRevealRefs = useMemo(() => range(pageCount).map(() => createRef()), [])
  useEffect(() => {
    if (theTimeline) {
      theTimeline.kill()
    }
    // set trash size
    const defaultTrashCfg = { width: `${trashWidth}%`, left: `${(100 - trashWidth) / 2}%`, rotate: (isMobile && data.transform.mobileRotate ? data.transform.mobileRotate : data.transform.rotate) || 0 }
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
    // console.log(data)
    const newHeight = data.totalHeight + (data.partsCount - 1) * imgSize[1] * explosionGap / 100
    const yStart = newHeight - (newHeight - imgSize[1]) / 2
    const animation = animations[data.name]
    // set exploded trash size
    const explodeWidthFactor = Math.min(
      Math.floor(((innerHeight() - 60) / (newHeight * (isMobile ? 1.35 : 1.1)) * imgSize[0]) / containerWidth * 100),
      isMobile ? (data.transform.explosionScale || 100) : 50
    )

    theTimeline.to(faceRef.current, {
      opacity: 0,
      duration: scrollingDuration,
    })
    theTimeline.to(trashRef.current, {
      width: `${explodeWidthFactor}%`,
      left: `${(100 - explodeWidthFactor) / 2}%`,
      x: isMobile ? '25%' : '0',
      // y: isMobile ? '-50%' : 0,
      top: isMobile ? '50%' : '50%',
      duration: scrollingDuration,
    }, scrollingDuration)

    data.imgs.forEach((cfg) => {
      gsap.set(layerRefs[cfg.index].current, { y: '0%' })
      // calc parts y position
      theTimeline.to(layerRefs[cfg.index].current, {
        y: `${(yStart - cfg.y - data.positions[cfg.order] - imgSize[1] * explosionGap / 100 * cfg.order) / imgSize[1] * 100}%`,
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
      }
    })
    theTimeline.tweenTo(page, { duration: 1 })
  }, [data, windowSize.height, containerWidth])
  return (
    <Box
      height="100vh"
      width="100vw"
      onClick={() => window.open(`${process.env.PUBLIC_URL}${window.location.search}/#/trash/${data.id}`)}
      cursor="pointer"
      transformOrigin="0 0"
      transform="scale(0.5)"
      pt={theme.headerHeight}
      bg={colorScheme}
    >
      <Box.Relative height="100%" bg="white">
        <Box.Absolute
          top="0"
          left="0"
          right="0"
          height="100%"
          zIndex="docked"
          pointerEvents="none"
        >
          <Container height="100%">
            <Box.Relative height="100%">
            <Box.Absolute
              ref={trashRef}
              id="trash-container"
              top={responsive('45%', '50%')}
              transform="translate3d(0, -50%, 0)"
              width={`${trashWidth}%`}
              left={`${(100 - trashWidth) / 2}%`}
            >
              <div ref={trashXRef}>
                <AspectRatio ratio={imgSize[0] / imgSize[1]} overflow="visible">
                  <Box overflow="visible">
                    {parts}
                  </Box>
                </AspectRatio>
              </div>
            </Box.Absolute>
            <TrashName color={colorScheme}>{data.name}</TrashName>
            <SectionTitle>組成的材質是什麼？</SectionTitle>
            <TrashNumber color={colorScheme}>{n}</TrashNumber>
            <TrashNote color={colorScheme}>
              {data.partsNote}
            </TrashNote>
            </Box.Relative>
          </Container>
        </Box.Absolute>
      </Box.Relative>
    </Box>
  )
}

export default withData(TrashPage)
