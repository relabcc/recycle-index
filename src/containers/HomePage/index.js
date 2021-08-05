import React, { createRef, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useWindowSize } from 'react-use'
import gsap from 'gsap'
import ReactFullpage from '@fullpage/react-fullpage'
import innerHeight from 'ios-inner-height'
import { navigate } from 'gatsby'
import { StaticImage, GatsbyImage, getImage } from "gatsby-plugin-image"
// import loadable from '@loadable/component'
import styled from '@emotion/styled'
// import { css } from '@emotion/react'
import { graphql, useStaticQuery } from 'gatsby';
import { BgImage } from 'gbimage-bridge';
import { AspectRatio } from '@chakra-ui/react'

import Container from '../../components/Container'
import Box from '../../components/Box'
import Heading from '../../components/Heading'
import FullpageHeight from '../../components/FullpageHeight'
import Text from '../../components/Text'
// import Image from '../../components/Image'
// import BackgroundImage from '../../components/BackgroundImage'
import theme, { responsive, Media } from '../../components/ThemeProvider/theme';

import useAllTrashes from '../TrashPage/data/useAllTrashes'
import useResponsive from '../../contexts/mediaQuery/useResponsive'
import useShowHeader from '../../contexts/header/useShowHeader';
import containerWidthContext from '../../contexts/containerWidth/context';

import Face from '../Face'
import OtherTrashes from './OtherTrashes'
import LastPage from './LastPage'
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
// import BackgroundImage from '../../components/BackgroundImage'

import ChevDown from '../TrashPage/ChevDown'
// import withLoading from '../withLoading'
import useIsEn from '../useIsEn'
// const GSAP = loadable.lib(() => import('gsap'))
// const ReactFullpage = loadable(() => import('@fullpage/react-fullpage'))
// const LastPage = loadable(() => import('./LastPage'))
// const OtherTrashes = loadable(() => import('./OtherTrashes'))

// const mountTop = [require('./mount-top.webp'), require('./mount-top.png')]
// const mountMiddle = [require('./mount-middle.webp'), require('./mount-middle.png')]
// const mountBottom = [require('./mount-bottom.webp'), require('./mount-bottom.png')]

// (min-width: 3400px) 3400px, 100vw
// const mountBreakpoinsSmall = [1024, 1920, 2560]
// const mountBreakpoins = [1920, 2560, 3400]
// const mountWidth = breakpoints
//   .filter(d => d > 0)
//   .map((d, i) => mountBreakpoins[i] && `(min-width: ${d}px) ${mountBreakpoins[i]}px`)
//   .filter(Boolean).join(',') + ',100vw'

// console.log(mountWidth)

const Wrapper = styled(Box)`
#fullpage {
  height: 100%;
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

const mountRatio = 3424 / 1844
const titleRatio = 1920 / 430
const scrollingDuration = 1

let timeline
let timeline2
let fpApi

// const MountTop = () => {
//   const [mountTopLoaded, setMountTopLoaded] = useState()
//   const [hiResloaded, setHiresLoaded] = useState()
//   return (
//     <Box.Relative width="100%">

//     </Box.Relative>
//   )
// }

const MountBottom = ({
  images: {
    mountBottomMd,
    mountBottomLg,
  },
}) => {

  const mountBottomMdImage = getImage(mountBottomMd);
  const mountBottomLgImage = getImage(mountBottomLg);
  return (
    <AspectRatio ratio={3424 / 1286}>
      <div>
        <Box.FullAbs as={Media} at="mobile">
          <BgImage image={mountBottomMdImage} style={{ width: '100%', height: '100%' }} />
        </Box.FullAbs>
        <Box.FullAbs as={Media} greaterThan="mobile">
          <BgImage image={mountBottomLgImage} style={{ width: '100%', height: '100%' }} />
        </Box.FullAbs>
      </div>
    </AspectRatio>
  )
}

const HomePage = () => {
  useShowHeader()
  const {
    mountTopMd,
    mountTopLg,
    mountBottomMd,
    mountBottomLg,
  } = useStaticQuery(graphql`
    query {
      mountTopMd: file(relativePath: { eq: "mount-top@2x.png" }) {
        childImageSharp {
          gatsbyImageData(
            width: 2560
            placeholder: NONE
            layout: FIXED
          )
        }
      }
      mountTopLg: file(relativePath: { eq: "mount-top@2x.png" }) {
        childImageSharp {
          gatsbyImageData(
            width: 3400
            placeholder: NONE
            layout: FIXED
          )
        }
      }
      mountBottomMd: file(relativePath: { eq: "mount-bottom.png" }) {
        childImageSharp {
          gatsbyImageData(
            width: 2560
            placeholder: NONE
            layout: FIXED
          )
        }
      }
      mountBottomLg: file(relativePath: { eq: "mount-bottom.png" }) {
        childImageSharp {
          gatsbyImageData(
            width: 3400
            placeholder: NONE
            layout: FIXED
          )
        }
      }
    }
    `);
  const mountTopMdImage = getImage(mountTopMd);
  const mountTopLgImage = getImage(mountTopLg);

  const isEn = useIsEn()
  const { isMobile, isTablet } = useResponsive()
  const heroTrashRef = useRef()
  const bubbleRef = useRef()
  const trashMountRef = useRef()
  // const gsapRef = useRef()
  const { containerWidth } = useContext(containerWidthContext)
  const windowSize = useWindowSize()
  const data = useAllTrashes()
  // useReloadOnOrentation()
  const [inited, setInited] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(0)
  // const [mountTopLoaded, setMountTopLoaded] = useState()
  // const [hiResloaded, setHiresLoaded] = useState()
  const [trashMx, trashMt, trashWidth] = useMemo(() => {
    const scaleRatio = Math.min(isMobile ? 4.25 : (isTablet ? 2.75 : 1.375), 3000 / windowSize.width)
    const titleClearance = containerWidth / titleRatio * (isMobile ? 1.7 : 1) + 60
    const mountTopHeight = containerWidth / mountRatio * scaleRatio * (220 / 1843)
    return [
      (1 - scaleRatio) * windowSize.width / 2,
      Math.max(titleClearance - mountTopHeight, 0),
      scaleRatio * windowSize.width,
    ]
  }, [windowSize, isMobile, isTablet, containerWidth])

  const pages = useMemo(() => {
    const trash = data?.[trashes[0]]
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
                ensureFont="Concert One"
              >
                秒懂101個台灣人必知的垃圾
              </Heading.H2>
              <Box.Relative>
                <StaticImage src="./title.svg" placeholder="blurred" alt="回收大百科" />
                <Box.FullAbs zIndex={2}>
                  <StaticImage src="./title-overlay.svg" placeholder="blurred" alt="回收大百科" />
                  <Text.H1 display="none">回收大百科</Text.H1>
                </Box.FullAbs>
              </Box.Relative>
              {trash && (
                <Box.Absolute left="5%" top="1%" width="30%" transform="translate3d(0, -15%, 0)">
                  <Box.Relative transform="rotate(7deg)">
                    <GatsbyImage image={trash.gatsbyImg.regular} alt={trash.name} />
                    <Box.FullAbs>
                      <Face id={trash.transform.faceNo} transform={trash.transform.face} />
                    </Box.FullAbs>
                  </Box.Relative>
                </Box.Absolute>
              )}
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
      <LastPage isEn={isEn} />
      ,
      <>

      </>,
    ]
  }, [data, isEn])
  const pageRefs = useMemo(() => pages.map(() => createRef()), [pages])
  const init = () => {
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
      if (i && pageRefs[i - 1].current) {
        timeline.to(pageRefs[i - 1].current.querySelector('.scroll-btn'), {
          opacity: 0,
          duration: 0.25 * scrollingDuration,
        }, (i - 0.25) * scrollingDuration)
      }
    })
    timeline.pause()
    timeline2.pause()
  }
  useEffect(() => {
    init()
  }, [windowSize, containerWidth, inited])
  return (
    <Wrapper className="home-bg" bg="colors.yellow" height="100%">
      {useMemo(() => (
        <ReactFullpage
          licenseKey={process.env.FULLPAGE_JS_KEY}
          scrollingSpeed={scrollingDuration * 1000}
          // afterRender={setHeight}
          // afterResize={setHeight}
          verticalCentered={false}
          onLeave={(origin, destination) => {
            setPageLoaded((p) => Math.max(p, destination.index))
            if (destination.isLast) {
              setTimeout(() => navigate(`${isEn ? '/en' : ''}/catalogue`), scrollingDuration * 500)
            }
            if (timeline) {
              timeline.tweenTo(destination.index * scrollingDuration, { duration: (destination.index === 3 ? 2 : 1) * scrollingDuration })
            }
            if (timeline2) {
              if (destination.index === 2) {
                timeline2.play()
              } else {
                timeline2.reverse()
              }
            }
          }}
          afterRender={() => {
            setTimeout(() => {
              setInited(true)
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
      ), [isEn, pageRefs, pages, windowSize.height])}
      <Box.Fixed left="0" top="0" right="0" ref={trashMountRef} transformOrigin="50% 25%" pointerEvents="none">
        <Box ml={`${trashMx - windowSize.width * 0.04}px`} mr={`${trashMx + windowSize.width * 0.04}px`} mt={`${trashMt}px`} className="margin-adj">
          <Box.Relative opacity={+inited}>
            <StaticImage
              src="./mount-top@2x.png"
              layout="fullWidth"
              alt="垃圾山"
              // onLoad={() => setTimeout(() => setMountTopLoaded(true))}
            />
            <Box.FullAbs as={Media} at="mobile">
              {pageLoaded > 0 && (
                <BgImage image={mountTopMdImage} style={{ width: '100%', height: '100%' }} />
              )}
            </Box.FullAbs>
            <Box.FullAbs as={Media} greaterThan="mobile">
              {pageLoaded > 0 && (
                <BgImage image={mountTopLgImage} style={{ width: '100%', height: '100%' }} />
              )}
            </Box.FullAbs>
            {/*
            <BackgroundImage
              src={mountTop}
              ratio={mountRatio}
              style={{ opacity: +inited }}
            /> */}
            <OtherTrashes
              isEn={isEn}
              isMobile={isMobile}
              data={data}
              trashes={trashes}
            />
          </Box.Relative>
          <Box mt={`${trashWidth * -0.05}px`}>
            {pageLoaded > 1 ? (
              <StaticImage
                src="./mount-middle.png"
                layout="fullWidth"
                alt="垃圾山"
              />
            ) : <Box pt={`${728 / 3424 * 100}%`} />}
          </Box>
          <Box mt={`${trashWidth * -0.07}px`}>
            {pageLoaded > 1 ? (
              <MountBottom
                images={{
                  mountBottomMd,
                  mountBottomLg,
                }}
              />
            ) : <Box pt={`${1286 / 3424 * 100}%`} />}
          </Box>
        </Box>
      </Box.Fixed>
      <FullpageHeight position="fixed" top="0" left="0" right="0" pointerEvents="none" style={{ opacity: +inited }}>
        <Box.Absolute right={trashWidth * 0.5} top="-100%" width={trashWidth * 0.3} ref={heroTrashRef} id="hero-trash">
          <Box.Relative transform="rotate(7deg)" className="trash">
            {data && (
              <>
                <GatsbyImage image={data[trashes[0]].gatsbyImg.regular} alt={data[trashes[0]].name} />
                <Box.FullAbs>
                  <Face className="face" id={data[trashes[0]].transform.faceNo} transform={data[trashes[0]].transform.face} />
                </Box.FullAbs>
              </>
            )}
          </Box.Relative>

          <Box.Absolute
            width={responsive('68%', '70%', '90%')}
            left={responsive('-20%', '-20%', '-50%')}
            top={responsive('-23%', '-20%')}
            ref={bubbleRef}
            opacity="0"
          >
            {pageLoaded > 0 && <StaticImage alt="對話框" src="bubble-1.svg" placeholder="blurred" />}
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
      {/* {!inited && <FullpageLoading />} */}
    </Wrapper>
  )
}

export default HomePage
