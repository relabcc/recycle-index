import React, { createElement, useMemo } from 'react'

import FullpageVerticalCenter from '../../components/FullpageVerticalCenter';
import Container from '../../components/Container';
import Box from '../../components/Box';
import Flex from '../../components/Flex';
import Heading from '../../components/Heading';
import Image from '../../components/Image';
import Button from '../../components/Button';

import useShowHeader from '../../contexts/header/useShowHeader';

import bannerSvg from './banner.svg'
import trashmobile from './trash-mobile.png'
import trashmobile2 from './trash-mobile_2.png'

import theme, { responsive } from '../../components/ThemeProvider/theme';
import useRespoinsive from '../../contexts/mediaQuery/useResponsive';
import withLoading from '../withLoading';

const GamePage = ({ isMobile }) => {
  useShowHeader('colors.yellow')
  return (
    <FullpageVerticalCenter bg="colors.yellow" mt="0" height="100vh" overflow="hidden">
      <Box widht="100%" mt="0">
        <Image src={isMobile ? trashmobile : bannerSvg} />
      </Box>
      <Container px={responsive('1em', '2em')} mb={responsive('2em', '2em')}>
        <Flex mt={responsive('-20%', '-4em')} alignItems="center" justifyContent="center" flexDirection={responsive('column-reverse', 'row')}>
          <Heading lineHeight="1.5" mr={responsive(0, '1em')} fontSize={responsive('1.125em', '1.75em')}>隨手丟垃圾很容易，但你真的懂丟嗎？<br />測看看30秒內，你可以丟對幾個垃圾！</Heading>
          <Button.Pink border="0.125em solid black" my="1em" to="/game/play/" fontSize={responsive('1.625em', '1.75em')} height="2em" px="1em">開始遊戲</Button.Pink>
        </Flex>
        {isMobile && (
          <Box px="0.25em" pt="0.5em">
            <Image src={trashmobile2} />
          </Box>
        )}
      </Container>
    </FullpageVerticalCenter>
  )
}

export default () => {
  const { isMobile } = useRespoinsive()
  const toLoad = useMemo(() => isMobile ? [trashmobile, trashmobile2] : [bannerSvg], isMobile)
  return createElement(withLoading(toLoad)(GamePage), { isMobile })
}
