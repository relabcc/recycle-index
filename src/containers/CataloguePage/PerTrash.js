import React, { useCallback, useMemo, useRef, useState } from 'react'
import { AspectRatio } from '@chakra-ui/react';
// import { useHover } from 'react-use';
// import { useIsVisible } from "react-is-visible"
import { useHarmonicIntervalFn, useHover } from 'react-use'
import { GatsbyImage } from 'gatsby-plugin-image';
import { navigate } from 'gatsby';

import Box from '../../components/Box';
// import Link from '../../components/Link';
import Text from '../../components/Text';
// import Image from '../../components/Image';
// import BackgroundImage from '../../components/BackgroundImage';

import Face from '../Face'
import useIsEn from '../useIsEn';
import { responsive } from '../../components/ThemeProvider/theme';

import trashEn from '../trashEn'

const colorsCfg = {
  A: 'green',
  B: 'orange',
  C: 'pink',
}

const rate = 0.2

const TheFace = ({ data }) => {
  const [showFace, setShowFace] = useState(() => Math.random() < rate)
  const [hoverable] = useHover((isHovering) => (
    <Box.FullAbs>
      {(showFace || isHovering) && (
        <Face id={data.transform.faceNo} transform={data.transform.face} />
      )}
    </Box.FullAbs>
  ))
  // const timer = useRef()
  const tick = useCallback(() => {
    setShowFace(Math.random() < rate)
  }, [])
  useHarmonicIntervalFn(tick, 5000)
  return hoverable
}

const PerTrash = ({ data }) => {
  const isEn = useIsEn()
  const nodeRef = useRef()

  // const isVisible = useIsVisible(nodeRef)
  const transform = useMemo(() => {
    const scale = (data.transform.homeScale || 100) * 0.85 / 100
    return `scale(${scale}) translate(${['homeX', 'homeY'].map((k, i) => `${-1 * ((i ? 0 : 50) - (data.transform[k] || 0)) / scale}%`).join()})`
  }, [data])
  // const [hoverable] = useHover(element);
  return (
    <AspectRatio ratio={1} ref={nodeRef}>
      <Box p={responsive('0.5em', '1em')}>
        <Box
          cursor="pointer"
          onClick={() => navigate(`${isEn ? '/en' : ''}/trash/${data.id}`)}
          width="100%"
          height="100%"
          bg="white"
          // bg={`colors.${colorsCfg[data.recycleValue]}`}
          textAlign="center"
          flexDirection="column"
          transition="all 0.25s"
          _hover={{
            boxShadow: responsive('none', '4px 4px 0px rgba(0,0,0,0.2)'),
            transform: responsive('none', 'translate(-4px, -4px)'),
            // borderWidth: '3px',
            borderColor: `colors.${colorsCfg[data.recycleValue]}`,
          }}
          border="1px solid black"
          borderWidth={responsive('1px', '2px')}
          rounded="1em"
          position="relative"
          overflow="hidden"
        >
          <Box.Absolute
            left="50%"
            bottom="0"
            width="100%"
            transform={transform}
          >
            <GatsbyImage image={data.gatsbyImg.regular} alt={data.name} />
            <TheFace data={data} />
          </Box.Absolute>
          <Box.Absolute width="100%" left="50%" top="0.75em" transform="translateX(-50%)">
            <Text
              // color="white"
              fontWeight="700"
              fontSize={isEn ? responsive('0.875em', '1.5em', '0.75em') : responsive('1em', '1.5em', '1em')}
              letterSpacing="0.125em"
            >{isEn ? trashEn[data.name] : data.name}</Text>
          </Box.Absolute>
        </Box>
      </Box>
    </AspectRatio>
  )
}

export default PerTrash
