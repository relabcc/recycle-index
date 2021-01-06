import React, { useMemo } from 'react'
import { AspectRatio } from '@chakra-ui/react'
import { random } from 'lodash'
import { SizeMe } from 'react-sizeme';

import Box from '../../components/Box'
import Text from '../../components/Text'
import Container from '../../components/Container'
import BackgroundImage from '../../components/BackgroundImage'
import withData from './data/withData';
import Face from '../Face';

import useResponsive from '../../contexts/mediaQuery/useResponsive';
import theme, { responsive } from '../../components/ThemeProvider/theme';
import useLoader from '../../utils/useLoader';
import imgSize from './data/imgSize'
import isIos from '../../components/utils/isIos'

const idealWidth = 200

const TrashDescription = (props) => (
  <Box.Absolute bottom={responsive('9%', '10%')} right={responsive('10%', '6em')} width={responsive('80%', '30%')}>
    <Text lineHeight="1.625" letterSpacing="0.075em" textAlign="justify" fontSize={responsive('2.5em', '1em')} {...props} />
  </Box.Absolute>
)

const colorsCfg = {
  A: 'green',
  B: 'orange',
  C: 'pink',
}

const TrashPage = ({ data }) => {
  const { isMobile } = useResponsive()
  const colorScheme = `colors.${colorsCfg[data.recycleValue]}`
  const trashWidth = (isMobile ? (isIos ? 140 : 160) : 75) * (data.transform.scale ? (isMobile && data.transform.mobileScale ? data.transform.mobileScale : data.transform.scale) / 100 : Math.min(1, idealWidth / (data.xRange[1] - data.xRange[0])))

  const faceId = useMemo(() => data.transform.faceNo || (random(4) + 1), [data])
  useLoader(data.img)

  const n = `#${String(data.id).padStart(3, '0')}`
  // const bgColor = get(theme, `colors.${colorScheme}`)
  const parts = useMemo(() => {
    if (!data) return null
    return data.imgs.map(({ src }, i) => (
      <Box.FullAbs key={i}>
        <BackgroundImage ratio={imgSize[0] / imgSize[1]} src={src} />
      </Box.FullAbs>
  ))
  }, [data])
  return (
    <Box
      position="relative"
      width="100vw"
      height="100vh"
      pt={theme.headerHeight}
      onClick={() => window.open(`${process.env.PUBLIC_URL}${window.location.search}/#/trash/${data.id}`)}
      cursor="pointer"
      transformOrigin="0 0"
      transform="scale(0.33)"
    >
      <Container position="relative" height="100%">
        <Box.Absolute left="0.625em" top="0em">
          <Text.Number
            textStroke="0.15625rem"
            textStrokeColor={`colors.${colorScheme}`}
            color="white"
            fontSize="6.25em"
          >{n}</Text.Number>
        </Box.Absolute>
        <Box.AbsCenter top={responsive('15%', '40%')} width="100%" textAlign="center" transform="rotate(-12deg)">
          <SizeMe>
            {({ size }) => (
              <Text
                as="h2"
                color={colorScheme}
                fontSize={size.width ? `${Math.min(Math.floor(size.width / (data.name.length + 1)), size.width / 4) * 3}px` : 0}
                fontWeight="900"
              >
                {data.name}
              </Text>
            )}
          </SizeMe>
        </Box.AbsCenter>
        <TrashDescription color={colorScheme}>
          {data.description}
        </TrashDescription>
      </Container>
      <Box.Absolute
        top="0"
        left="0"
        right="0"
        height="100%"
        zIndex="docked"
        pointerEvents="none"
      >
        <Container position="relative" height="100%">
        <Box.Relative height="100%">
            <Box.Absolute
              id="trash-container"
              top={responsive(`${45 + (data.transform.mobileFirstY || 0)}%`, '50%')}
              transform="translate3d(0, -50%, 0)"
              width={`${trashWidth}%`}
              left={`${(100 - trashWidth) / 2}%`}
            >
              <div>
                <AspectRatio ratio={imgSize[0] / imgSize[1]} overflow="visible">
                  <Box overflow="visible">
                    {parts}
                    <Face transform={data.transform.face} id={faceId} />
                  </Box>
                </AspectRatio>
              </div>
            </Box.Absolute>
          </Box.Relative>
        </Container>
      </Box.Absolute>
    </Box>
  )
}

export default withData(TrashPage)
