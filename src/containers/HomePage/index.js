import React, { createRef, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useWindowSize } from 'react-use'
import gsap from 'gsap'
import ReactFullpage from '@fullpage/react-fullpage'
import innerHeight from 'ios-inner-height'
import { navigate } from 'gatsby'
import { StaticImage, GatsbyImage } from "gatsby-plugin-image"
import loadable from '@loadable/component'
import styled from '@emotion/styled'

import Container from '../../components/Container'
import Box from '../../components/Box'
import Heading from '../../components/Heading'
import FullpageHeight from '../../components/FullpageHeight'
import Text from '../../components/Text'
// import Image from '../../components/Image'
// import BackgroundImage from '../../components/BackgroundImage'
import theme, { responsive } from '../../components/ThemeProvider/theme';

import useData from '../TrashPage/data/useData'
import useResponsive from '../../contexts/mediaQuery/useResponsive'
import useShowHeader from '../../contexts/header/useShowHeader';
import containerWidthContext from '../../contexts/containerWidth/context';

import Face from '../Face'
// import title from './title.svg'
// import titleOverlay from './title-overlay.svg'
// import bubble1 from './bubble-1.svg'
// import bubble2 from './bubble-2.svg'
// import bubble3 from './bubble-3.svg'
// import bubble4 from './bubble-4.svg'
// import bubble5 from './bubble-5.svg'
import isIos from '../../components/utils/isIos'
import PointingDown from '../../components/PointingDown'
// import FullpageLoading from '../../components/FullpageLoading'
import BackgroundImage from '../../components/BackgroundImage'

import ChevDown from '../TrashPage/ChevDown'
// import withLoading from '../withLoading'
import useIsEn from '../useIsEn'
const LastPage = loadable(() => import('./LastPage'))
const OtherTrashes = loadable(() => import('./OtherTrashes'))

// const mountTop = [
//   [require('./mount-top@0.5x.webp'), require('./mount-top@0.5x.png')],
//   [require('./mount-top.webp'), require('./mount-top.png')],
//   // [require('./mount-top@2x.webp'), require('./mount-top@2x.png')],
// ]
// const mountMiddle = [require('./mount-middle.webp'), require('./mount-middle.png')]
const mountBottom = [require('./mount-bottom.webp'), require('./mount-bottom.png')]

const Wrapper = styled(Box)`
#fullpage {
  height: 100vh;
  overflow: hidden;
}
.section {
  height: 100%;
}
`

const trashes = [
  4,
  56,
  20,
  35,
  28,
]

const mountRatio = 3424 / 1843
const titleRatio = 1920 / 430
const scrollingDuration = 1

let timeline
let timeline2
let fpApi
const HomePage = () => {
  useShowHeader()
  const isEn = useIsEn()
  const { isMobile, isTablet } = useResponsive()
  const heroTrashRef = useRef()
  const bubbleRef = useRef()
  const trashMountRef = useRef()
  const data = useData()
  const { containerWidth } = useContext(containerWidthContext)
  const windowSize = useWindowSize()
  // useReloadOnOrentation()
  const [inited, setInited] = useState(false)
  const [loaded, setLoaded] = useState()
  const [trashMx, trashMt, trashWidth] = useMemo(() => {
    const scaleRatio = Math.min(isMobile ? 4.25 : (isTablet ? 2.75 : 1.375), 3000 / windowSize.width)
    const titleClearance = containerWidth / titleRatio * (isMobile ? 1.7 : 1) + 60
    const mountTopHeight = containerWidth / mountRatio * scaleRatio * (220 / 1843)
    return [
      (1 - scaleRatio) * windowSize.width / 2,
      Math.max(titleClearance - mountTopHeight, 0),
      scaleRatio * windowSize.width,
    ]
  }, [windowSize, isMobile, containerWidth])

  const pages = useMemo(() => {
    const trash = data[trashes[0]]
    return [
      <Box pt={theme.headerHeight} height="100%">
        <Container pt={responsive('10%', '4%')} textAlign="center" height="100%" position="relative" px="0">
          <Box height="100%" mx={responsive('-7.5%', 0)}>
            <Box.Relative height="100%" mx={responsive(0, '10%')}>
              <Heading.H2
                fontWeight="900"
                letterSpacing="0.125em"
                textAlign="right"
                px="10.5%"
                fontSize={responsive('1em', '1.75em')}
                fontFamily={theme.fonts.number}
                fontStyle="italic"
              >
                秒懂101個台灣人必知的垃圾
              </Heading.H2>
              <Box.Relative>
                <StaticImage src="./title.svg" placeholder="blurred" />
                <Box.FullAbs zIndex={2}>
                  <StaticImage src="./title-overlay.svg" placeholder="blurred" />
                  <Text.H1 display="none">回收大百科</Text.H1>
                </Box.FullAbs>
              </Box.Relative>
              <Box.Absolute left="5%" top="1%" width="30%" transform="translate3d(0, -15%, 0)">
                <Box.Relative transform="rotate(7deg)">
                  <GatsbyImage image={trash.gatsbyImg} aspectRatio={850 / 624} />
                  <Box.FullAbs>
                    <Face id={trash.transform.faceNo} transform={trash.transform.face} />
                  </Box.FullAbs>
                </Box.Relative>
              </Box.Absolute>
              {/* <Box.Absolute bottom="4em" left="0" right="0" textAlign="center">
                <ScrollButton onClick={() => fpApi.moveSectionDown()}>往下滑走進垃圾堆 聽聽垃圾的心聲</ScrollButton>
              </Box.Absolute> */}
            </Box.Relative>
          </Box>
        </Container>
      </Box>,
      <>

      </>,
      <>

      </>,
      <LastPage isEn={isEn} isMobile={isMobile} />
      ,
      <>

      </>,
    ]
  }, [data, isEn])
  const pageRefs = useMemo(() => pages.map(() => createRef()), [pages])
  useEffect(() => {
    if (!inited) return
    if (timeline) {
      timeline.kill()
      timeline2.kill()
    }
    timeline = gsap.timeline({ defaults: { duration: scrollingDuration } })
    timeline2 = gsap.timeline()
    const windowHeight = innerHeight()
    gsap.set(heroTrashRef.current, {
      right: trashWidth * 0.50,
      width: trashWidth * 0.3,
      top: '-100%',
      opacity: 1,
    })
    gsap.set(heroTrashRef.current.querySelector('.trash'), {
      rotate: 7,
    })
    gsap.set(bubbleRef.current, {
      opacity: 0,
    })
    gsap.set(trashMountRef.current, {
      scale: 1,
      x: 0,
      y: 0,
    })
    gsap.set(trashMountRef.current.querySelector('.margin-adj'), {
      marginTop: trashMt,
    })
    gsap.set(trashMountRef.current.querySelectorAll('.trash-bubble'), {
      scale: 0,
      opacity: 0,
    })
    gsap.set(trashMountRef.current.querySelector('.trash-mount'), {
      opacity: 1,
    })
    gsap.set(document.querySelector('.home-bg'), {
      backgroundColor: theme.colors.colors.yellow,
    })
    timeline.to(heroTrashRef.current, {
      width: trashWidth * 0.25,
      right: trashWidth * (isMobile ? -0.08 : (isTablet ? -0.02 : 0.22)),
      top: windowHeight * (isMobile ? 0.3 : 0.23),
      duration: 0.8 * scrollingDuration,
    }, 0.2 * scrollingDuration)
    timeline.to(heroTrashRef.current.querySelector('.trash'), {
      rotate: isMobile ? 368 : 385,
      duration: 0.8 * scrollingDuration,
    }, 0.2 * scrollingDuration)
    timeline.to(bubbleRef.current, {
      opacity: 1,
      duration: 0.2 * scrollingDuration,
    }, 0.8 * scrollingDuration)
    timeline.to(trashMountRef.current, {
      scale: isMobile ? 1.75 : 1.5,
      x: trashWidth * (isMobile ? 0.28 : 0.23),
      y: windowHeight * (isMobile ? 0.4 : 0.25),
    }, 0)
    timeline.to(trashMountRef.current.querySelector('.margin-adj'), {
      marginTop: 0,
    }, 0)

    timeline.to(trashMountRef.current, {
      y: `-=${trashWidth * (isMobile ? (isIos ? 0.27 : 0.30) : 0.22)}`,
    }, scrollingDuration)
    timeline.to(heroTrashRef.current, {
      opacity: 0,
      top: `-=${trashWidth * (isMobile ? (isIos ? 0.27 : 0.30) : 0.22)}`,
    }, scrollingDuration)
    // timeline.to(heroTrashRef.current.querySelector('.face'), {
    //   opacity: 0,
    // }, scrollingDuration)
    timeline.to(trashMountRef.current.querySelector('.trash-mount'), {
      opacity: 0.3,
    }, scrollingDuration)
    timeline2.to(trashMountRef.current.querySelectorAll('.trash-bubble'), {
      stagger: 0.25,
      scale: 1,
      ease: 'back.out(1.7)',
      duration: scrollingDuration * 0.5,
    }, 0.5)
    timeline2.to(trashMountRef.current.querySelectorAll('.trash-bubble'), {
      opacity: 1,
      stagger: 0.25,
      duration: scrollingDuration * 0.5,
    }, 0.5)

    // timeline.to(trashMountRef.current, {
    //   y: `-=${windowHeight * 1.25}`,
    // }, scrollingDuration * 2)
    timeline.to(heroTrashRef.current, {
      top: `-=${windowHeight * 1.5}`,
    }, scrollingDuration * 2)
    timeline.to(trashMountRef.current.querySelector('.trash-mount'), {
      opacity: 1,
    }, scrollingDuration * 2)

    timeline.to(document.querySelector('.home-bg'), {
      backgroundColor: 'white',
    }, scrollingDuration * 2)

    timeline.to(trashMountRef.current, {
      scale: isMobile ? 1.25 : 1.75,
      x: isMobile ? `-=${trashWidth * 0.05}` : '+=0',
      y: isMobile ? '-88%' : (isTablet ? '-110%' : '-130%'),
    }, scrollingDuration * 2)

    timeline.to(trashMountRef.current, {
      y: isMobile ? '-150%' : (isTablet ? '-160%' : '-180%'),
    }, scrollingDuration * 3)

    timeline.to(document.querySelector('.home-bg'), {
      backgroundColor: theme.colors.colors.yellow,
    }, scrollingDuration * 3)

    pages.forEach((p, i) => {
      if (i) {
        timeline.to(pageRefs[i - 1].current.querySelector('.scroll-btn'), {
          opacity: 0,
          duration: 0.25 * scrollingDuration,
        }, (i - 0.25) * scrollingDuration)
      }
    })
    timeline.pause()
    timeline2.pause()

  }, [windowSize, containerWidth, inited, loaded])

  return (
    <Wrapper className="home-bg" bg="colors.yellow">
      <ReactFullpage
        licenseKey={process.env.FULLPAGE_JS_KEY}
        scrollingSpeed={scrollingDuration * 1000}
        // afterRender={setHeight}
        // afterResize={setHeight}
        verticalCentered={false}
        onLeave={(origin, destination) => {
          if (destination.isLast) {
            setTimeout(() => navigate(`${isEn ? '/en' : ''}/catalogue`), scrollingDuration * 500)
          }
          timeline.tweenTo(destination.index * scrollingDuration, { duration: (destination.index === 3 ? 2 : 1) * scrollingDuration })
          if (destination.index === 2) {
            timeline2.play()
          } else {
            timeline2.reverse()
          }
        }}
        afterRender={() => {
          setInited(true)
          setTimeout(() => {
            document.body.style.height = `${windowSize.height}px`
          })
        }}
        afterResize={() => {
          setTimeout(() => {
            document.body.style.height = `${windowSize.height}px`
            fpApi.silentMoveTo(1)
            // timeline.seek(0)
            // timeline2.seek(0)
          })
        }}
        render={({ fullpageApi }) => {
          fpApi = fullpageApi
          return (
            <ReactFullpage.Wrapper>
              {pages.map((page, i) => (
                <div className="section" key={i} ref={pageRefs[i]}>
                  {(inited || i === 0) && page}
                </div>
              ))}
            </ReactFullpage.Wrapper>
          )
        }}
      />
      <Box.Fixed left="0" top="0" right="0" ref={trashMountRef} transformOrigin="50% 25%" pointerEvents="none">
        <Box ml={`${trashMx - windowSize.width * 0.04}px`} mr={`${trashMx + windowSize.width * 0.04}px`} mt={`${trashMt}px`} className="margin-adj">
          <Box.Relative>
            <StaticImage
              src="./mount-top.png"
              placeholder="blurred"
              className="trash-mount"
              quality={90}
              breakpoints={[1366, 1920, 2560]}
              outputPixelDensities={[1, 2, 3]}
              layout="fullWidth"
              alt="垃圾山"
              style={{ opacity: +inited }}
            />
            {inited && (
              <OtherTrashes
                isEn={isEn}
                isMobile={isMobile}
                data={data}
                trashes={trashes}
                onLoad={() => setLoaded(true)}
              />
            )}
          </Box.Relative>
          {inited && (
            <>
              <Box mt={`${trashWidth * -0.05}px`}>
                <StaticImage
                  src="./mount-middle.png"
                  placeholder="blurred"
                  quality={90}
                  breakpoints={[1366, 1920]}
                  layout="fullWidth"
                  alt="垃圾山"
                />
              </Box>
              <Box mt={`${trashWidth * -0.07}px`}>
                <BackgroundImage
                  src={mountBottom}
                  ratio={3424 / 1286}
                />
              </Box>
            </>
          )}
        </Box>
      </Box.Fixed>
      <FullpageHeight position="fixed" top="0" left="0" right="0" pointerEvents="none">
        {inited && (
          <Box.Absolute right={trashWidth * 0.5} top="-100%" width={trashWidth * 0.3} ref={heroTrashRef} id="hero-trash">
            <Box.Relative transform="rotate(7deg)" className="trash">
              <GatsbyImage image={data[trashes[0]].gatsbyImg} />
              <Box.FullAbs>
                <Face className="face" id={data[trashes[0]].transform.faceNo} transform={data[trashes[0]].transform.face} />
              </Box.FullAbs>
            </Box.Relative>
            <Box.Absolute
              width={responsive('68%', '70%', '90%')}
              left={responsive('-20%', '-20%', '-50%')}
              top={responsive('-23%', '-20%')}
              ref={bubbleRef}
              opacity="0"
            >
              <StaticImage alt="對話框" src="bubble-1.svg" placeholder="blurred" />
              <Box.Absolute
                top={responsive(isEn ? '10%' : '22%', isEn ? '12%' : '24%')}
                left={responsive('9%', '12%')}
                right="7%"
                fontWeight="900"
                fontSize={responsive('1.75em', '3.25em', '2.25em')}
                pointerEvents="all"
              >
                {isEn ? 'Emm...I don\'t belong here' : '啊..我被丟錯了'}
              </Box.Absolute>
            </Box.Absolute>
          </Box.Absolute>
        )}

        {/* <Box.Relative>
          <Box.Absolute top="2em" left="0" right="0">
            <BackgroundImage src={titleOverlay} ratio={titleRatio} />
          </Box.Absolute>
        </Box.Relative> */}
        {/* <Box.Absolute left="50%" bottom="1em" transform="translateX(-50%)" fontSize={responsive('5em', '2em')} color="black" pointerEvents="all">

        </Box.Absolute> */}
        <Box.Absolute bottom="1em" left="0" right="0" pointerEvents="all">
          <ChevDown as={PointingDown} onClick={() => fpApi.moveSectionDown()} />
        </Box.Absolute>
      </FullpageHeight>
      {/* {!inited && <FullpageLoading />} */}
    </Wrapper>
  )
}

export default HomePage
