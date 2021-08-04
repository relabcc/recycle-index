import React, { useEffect } from 'react'
import { StaticImage, GatsbyImage } from "gatsby-plugin-image"

import Box from '../../components/Box'
import { Media, responsive } from '../../components/ThemeProvider/theme';
import isIos from '../../components/utils/isIos'

import Face from '../Face'
import LazyLoad from '../../components/LazyLoad';

const Trash = ({ data, noFace }) => {
  return (
    <LazyLoad>
      <GatsbyImage image={data.gatsbyImg.regular} alt={data.name} />
      {!noFace && <Face id={data.transform.faceNo} transform={data.transform.face} />}
    </LazyLoad>
  )
}

const OtherMountians = ({ data, isEn, isMobile, trashes, onLoad = () => {} }) => {
  useEffect(() => {
    onLoad()
  }, [])
  return (
    <>
      <Box.Absolute width="12%" left={responsive('32%', '28%', '31%')} top={responsive(isIos ? '35%' : '39%', '41%')}>
        <Box.Relative transform="rotate(30deg)">
          <Trash data={data[trashes[1]]} />
        </Box.Relative>
        <Box.Absolute
          top="17%"
          left={responsive('-27%', '-27%', '-52%')}
          width={responsive('60%', '60%', '80%')}
          opacity="0"
          transform="scale(0)"
          className="trash-bubble"
          as={LazyLoad}
          transformOrigin="100% 75%"
        >
          <StaticImage alt="對話框" src="bubble-2.svg" placeholder="blurred" />
          <Box.Absolute
            top={isEn ? '8.5%' : "30%"}
            left={isEn ? responsive('5%', '10%') : "10%"}
            right="10%"
            fontWeight="900"
            pointerEvents="all"
            fontSize={responsive('0.75em', '1.5em', '1em')}
          >
            {isEn ? 'I don\'t belong here as well!' : '我也被丟錯！'}
          </Box.Absolute>
        </Box.Absolute>
      </Box.Absolute>
      <Box.Absolute width="9%" left={responsive('40%', '36%', '40%')} top="40%">
        <Box.Relative transform={responsive('rotate(-40deg)', 'rotate(0deg)')}>
          <Trash data={data[trashes[2]]} noFace={isMobile} />
        </Box.Relative>
        <Box.Absolute
          top={isEn ? '-42.5%' : "-28%"}
          left={isEn ? '27.5%' : "48%"}
          width={isEn ? responsive('67%', '105%') : "67%"}
          opacity="0"
          transform="scale(0)"
          className="trash-bubble"
          as={LazyLoad}
          transformOrigin="0% 100%"
          display={responsive('none', 'block')}
        >
          <StaticImage alt="對話框" src="bubble-3.svg" placeholder="blurred" />
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
          <Trash data={data[trashes[3]]} />
        </Box.Relative>
        <Box.Absolute
          left={responsive('75%', '-30%')}
          top="-22%"
          width={responsive('78%', '70%')}
          opacity="0"
          transform="scale(0)"
          className="trash-bubble"
          as={LazyLoad}
          transformOrigin={responsive('10% 100%', '90% 100%')}
        >
          <Box transform={responsive('scale(-1, 1)', 'scale(1)')}>
          <StaticImage alt="對話框" src="bubble-5.svg" placeholder="blurred" />
          </Box>
          <Box.Absolute
            whiteSpace="pre-wrap"
            top={isEn ? '10%' : "18%"}
            left={isEn ? responsive('6.25%', '7.5%') : responsive('10%', '12%')}
            right="0"
            fontWeight="900"
            fontSize={isEn ? responsive('0.625em', '1.5em', '0.75em') : responsive('0.875em', '2em', '1em')}
            pointerEvents="all"
          >
            {isEn ? 'I should have been in the recycle bin!' : '走錯棚了啦！'}
          </Box.Absolute>
        </Box.Absolute>
      </Box.Absolute>
      <Media at="mobile">
        <Box.Absolute width="10%" left="42%" top="54%">
          <Box.Relative transform="rotate(-10deg)">
            <Trash data={data[18]} noFace />
          </Box.Relative>
        </Box.Absolute>
      </Media>
      <Box.Absolute width={responsive('8%', '10%')} left={responsive('35%', '32%', '33%')} top={responsive(isIos ? '58%' : '66%', '66%', '55%')}>
        <Box.Relative transform="rotate(-10deg)">
          <Trash data={data[trashes[4]]} />
        </Box.Relative>
        <Box.Absolute
          top={responsive('10%', '0')}
          left="-70%"
          width="100%"
          opacity="0"
          transform="scale(0)"
          className="trash-bubble"
          as={LazyLoad}
          transformOrigin="100% 25%"
        >
          <StaticImage alt="對話框" src="bubble-4.svg" placeholder="blurred" />
          <Box.Absolute whiteSpace="pre-wrap" top="16%" left="7%" right="12%" fontWeight="900" fontSize={responsive('0.75em', '2em', '1em')} pointerEvents="all">
            {isEn ? 'Why am\nI here?' : '人家明明\n可以被回收！'}
          </Box.Absolute>
        </Box.Absolute>
      </Box.Absolute>
    </>
  )
}

export default OtherMountians
