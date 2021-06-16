import React, { createRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useWindowSize } from 'react-use'
import { get } from 'lodash'
import gsap from 'gsap'
import ReactFullpage from '@fullpage/react-fullpage'
import innerHeight from 'ios-inner-height'
import { navigate } from 'gatsby'

import Container from '../../components/Container'
import Box from '../../components/Box'
import Heading from '../../components/Heading'
import FullpageHeight from '../../components/FullpageHeight'
import Text from '../../components/Text'
import Image from '../../components/Image'
import BackgroundImage from '../../components/BackgroundImage'
import theme, { responsive } from '../../components/ThemeProvider/theme';

import useResponsive from '../../contexts/mediaQuery/useResponsive'

import useData from '../TrashPage/data/useData'
import useShowHeader from '../../contexts/header/useShowHeader';
import containerWidthContext from '../../contexts/containerWidth/context';

import Face from '../Face'
import title from './title.svg'
import titleOverlay from './title-overlay.svg'
import bubble1 from './bubble-1.svg'
import bubble2 from './bubble-2.svg'
import bubble3 from './bubble-3.svg'
import bubble4 from './bubble-4.svg'
import bubble5 from './bubble-5.svg'
import isIos from '../../components/utils/isIos'
import PointingDown from '../../components/PointingDown'

import ChevDown from '../TrashPage/ChevDown'
import withLoading from '../withLoading'
import useIsEn from '../useIsEn'

const mountTop = [
  [require('./mount-top@0.5x.webp'), require('./mount-top@0.5x.png')],
  [require('./mount-top.webp'), require('./mount-top.png')],
  // [require('./mount-top@2x.webp'), require('./mount-top@2x.png')],
]
const mountMiddle = [require('./mount-middle.webp'), require('./mount-middle.png')]
const mountBottom = [require('./mount-bottom.webp'), require('./mount-bottom.png')]

// const TriangleDown = props => <IoTriangle style={{ transform: 'rotate(180deg)' }} {...props} />

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

const Trash = ({ data, noFace }) => {
  if (!data) return null
  return (
    <>
      <Image src={data.img} />
      {!noFace && <Face id={data.transform.faceNo} transform={data.transform.face} />}
    </>
  )
}

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
  // const [currentPage, setCurrentPage] = useState(0)
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
    const trash = get(data, trashes[0])
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
              <BackgroundImage src={title} ratio={titleRatio}>
                <Box.FullAbs zIndex={2}>
                  <BackgroundImage src={titleOverlay} ratio={titleRatio} />
                  <Text.H1 display="none">回收大百科</Text.H1>
                </Box.FullAbs>
              </BackgroundImage>
              <Box.Absolute left="5%" top="1%" width="30%" transform="translate3d(0, -15%, 0)">
                {trash && (
                  <BackgroundImage src={trash.img} ratio={850 / 624} transform="rotate(7deg)">
                    <Face id={trash.transform.faceNo} transform={trash.transform.face} />
                  </BackgroundImage>
                )}

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
      <Container textAlign="center" color="black" height="100%">
        <Box.Relative height="100%">
          <Box.Absolute bottom={responsive('5em', '8em')} left="0" right="0">
            <Heading
              letterSpacing="0.125em"
              fontWeight="900"
              fontSize={isEn ? responsive('1em', '2em') : responsive('1.5em', '2.5em')}
              whiteSpace="pre-wrap"
              lineHeight="1.75"
            >
              {isEn ? `"Where there\'s a lost trash, ${isMobile ? '\n' : ''}there\'s a mis-thrown guy"` : `「每個迷路的垃圾，${isMobile ? '\n' : ''}都有個丟錯的主人」`}
            </Heading>
            <Text lineHeight="2em" fontSize={isEn ? responsive('0.875em', '1.375em') : responsive('1em', '1.625em')} letterSpacing="0.125em">{isEn ? 'Introducing 101 most commonly mis-thrown trashes in Taiwan' : '以下是台灣人最常丟錯的101件垃圾'}</Text>
          </Box.Absolute>
        </Box.Relative>
      </Container>
      ,
      <>

      </>,
    ]
  }, [data, isEn])
  const pageRefs = useMemo(() => pages.map(() => createRef()), [pages])
  useEffect(() => {
    if (timeline) {
      timeline.kill()
      timeline2.kill()
    }
    timeline = gsap.timeline({ defaults: { duration: scrollingDuration } })
    timeline2 = gsap.timeline()
    const windowHeight =  innerHeight()
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

  }, [windowSize, containerWidth])

  return (
    <Box className="home-bg" bg="colors.yellow">
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
                  {page}
                </div>
              ))}
            </ReactFullpage.Wrapper>
          )
        }}
      />
      <Box.Fixed left="0" top="0" right="0" ref={trashMountRef} transformOrigin="50% 25%" pointerEvents="none">
        <Box ml={`${trashMx - windowSize.width * 0.04}px`} mr={`${trashMx + windowSize.width * 0.04}px`} mt={`${trashMt}px`} className="margin-adj">
          <Box.Relative>
            <BackgroundImage src={mountTop} ratio={mountRatio} className="trash-mount" progressive />
            <Box.Absolute width="12%" left={responsive('32%', '28%', '31%')} top={responsive(isIos ? '35%' : '39%', '41%')}>
              <Box.Relative transform="rotate(30deg)">
                <Trash data={data && data[trashes[1]]} />
              </Box.Relative>
              <Box.Absolute
                top="17%"
                left={responsive('-27%', '-27%', '-52%')}
                width={responsive('60%', '60%', '80%')}
                opacity="0"
                transform="scale(0)"
                className="trash-bubble"
                transformOrigin="100% 75%"
              >
                <Image src={bubble2} />
                <Box.Absolute top={isEn ? '8.5%' : "30%"} left={isEn ? responsive('5%', '10%') : "10%"} right="10%" fontWeight="900" pointerEvents="all" fontSize={responsive('0.75em', '1.5em', '1em')}>
                  {isEn ? 'I don\'t belong here as well!' : '我也被丟錯！'}
                </Box.Absolute>
              </Box.Absolute>
            </Box.Absolute>
            <Box.Absolute width="9%" left={responsive('40%', '36%', '40%')} top="40%">
              <Box.Relative transform={responsive('rotate(-40deg)', 'rotate(0deg)')}>
                <Trash data={data && data[trashes[2]]} noFace={isMobile} />
              </Box.Relative>
              <Box.Absolute
                top={isEn ? '-42.5%' : "-28%"}
                left={isEn ? '27.5%' : "48%"}
                width={isEn ? responsive('67%', '105%') : "67%"}
                opacity="0"
                transform="scale(0)"
                className="trash-bubble"
                transformOrigin="0% 100%"
                display={responsive('none', 'block')}
              >
                <Image src={bubble3} />
                <Box.Absolute
                  top={isEn ? '8%' : "15%"}
                  left={isEn ? '5%' : "8%"}
                  right="0"
                  fontWeight="900"
                  fontSize={responsive("1em", "1.5em", isEn ? '0.75em' : "0.5em")}
                  pointerEvents="all"
                >
                  {isEn ? 'Please...don\'t...let...me end up in fire' : '要被燒掉了嗚嗚'}
                </Box.Absolute>
              </Box.Absolute>
            </Box.Absolute>
            <Box.Absolute width={responsive('8%', '10%')} left={responsive('27%', '38%', '43%')} top={responsive(isIos ? '51%' : '57%', '56%')}>
              <Box.Relative transform="rotate(-10deg)">
                <Trash data={data && data[trashes[3]]} />
              </Box.Relative>
              <Box.Absolute
                left={responsive('75%', '-30%')}
                top="-22%"
                width={responsive('78%', '70%')}
                opacity="0"
                transform="scale(0)"
                className="trash-bubble"
                transformOrigin={responsive('10% 100%', '90% 100%')}
              >
                <Box transform={responsive('scale(-1, 1)', 'scale(1)')}>
                  <Image src={bubble5} />
                </Box>
                <Box.Absolute whiteSpace="pre-wrap" top={isEn ? '10%' : "18%"} left={isEn ? responsive('6.25%', '7.5%') : responsive('10%', '12%')} right="0" fontWeight="900" fontSize={isEn ? responsive('0.625em', '1.5em', '0.75em') : responsive('0.875em', '2em', '1em')} pointerEvents="all">
                  {isEn ? 'I should have been in the recycle bin!' : '走錯棚了啦！'}
                </Box.Absolute>
              </Box.Absolute>
            </Box.Absolute>
            {isMobile && (
              <Box.Absolute width="10%" left="42%" top="54%">
                <Box.Relative transform="rotate(-10deg)">
                  <Trash data={data && data[18]} noFace />
                </Box.Relative>
              </Box.Absolute>
            )}
            <Box.Absolute width={responsive('8%', '10%')} left={responsive('35%', '32%', '33%')} top={responsive(isIos ? '58%' : '66%', '66%', '55%')}>
              <Box.Relative transform="rotate(-10deg)">
                <Trash data={data && data[trashes[4]]} />
              </Box.Relative>
              <Box.Absolute
                top={responsive('10%', '0')}
                left="-70%"
                width="100%"
                opacity="0"
                transform="scale(0)"
                className="trash-bubble"
                transformOrigin="100% 25%"
              >
                <Image src={bubble4} />
                <Box.Absolute whiteSpace="pre-wrap" top="16%" left="7%" right="12%" fontWeight="900" fontSize={responsive('0.75em', '2em', '1em')} pointerEvents="all">
                  {isEn ? 'Why am\nI here?' : '人家明明\n可以被回收！'}
                </Box.Absolute>
              </Box.Absolute>
            </Box.Absolute>
          </Box.Relative>
          <Box mt={`${trashWidth * -0.05}px`}><Image src={mountMiddle} /></Box>
          <Box mt={`${trashWidth * -0.07}px`}><Image src={mountBottom} /></Box>
        </Box>
      </Box.Fixed>
      <FullpageHeight position="fixed" top="0" left="0" right="0" pointerEvents="none">
        <Box.Absolute right={trashWidth * 0.5} top="-100%" width={trashWidth * 0.3} ref={heroTrashRef} id="hero-trash">
          <BackgroundImage src={get(data, [trashes[0], 'img'])} ratio={850 / 624} transform="rotate(7deg)" className="trash">
            {get(data, [trashes[0], 'transform', 'faceNo']) && (
              <Face className="face" id={get(data, [trashes[0], 'transform', 'faceNo'])} transform={get(data, [trashes[0], 'transform', 'face'])} />
            )}
          </BackgroundImage>
          <Box.Absolute
            width={responsive('68%', '70%', '90%')}
            left={responsive('-20%', '-20%', '-50%')}
            top={responsive('-23%', '-20%')}
            ref={bubbleRef}
            opacity="0"
          >
            <Image src={bubble1} />
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
    </Box>
  )
}

export default withLoading([
  mountTop[0],
  title,
  titleOverlay,
])(HomePage)
