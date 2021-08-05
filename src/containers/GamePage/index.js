import React from 'react'
import { StaticImage } from 'gatsby-plugin-image';

import FullpageVerticalCenter from '../../components/FullpageVerticalCenter';
import Container from '../../components/Container';
import Box from '../../components/Box';
import Flex from '../../components/Flex';
import Heading from '../../components/Heading';
import Button from '../../components/Button';

import useShowHeader from '../../contexts/header/useShowHeader';

// import bannerSvg from './banner.svg'
// import trashmobile from './trash-mobile.png'
// import trashmobile2 from './trash-mobile_2.png'

import { Media, responsive } from '../../components/ThemeProvider/theme';
// import withLoading from '../withLoading';

const GamePage = () => {
  useShowHeader('colors.yellow')
  return (
    <FullpageVerticalCenter bg="colors.yellow" mt="0" height="100vh" overflow="hidden">
      <Box widht="100%" mt="0">
        <Media at="mobile">
          <StaticImage layout="fullWidth" placeholder="blurred" alt="丟垃圾大考驗" src="trash-mobile.png" />
        </Media>
        <Media greaterThan="mobile">
          <StaticImage layout="fullWidth" placeholder="blurred" alt="丟垃圾大考驗" src="banner.svg" />
        </Media>
      </Box>
      <Container px={responsive('1em', '2em')} mb={responsive('2em', '2em')}>
        <Flex mt={responsive('-20%', '-4em')} alignItems="center" justifyContent="center" flexDirection={responsive('column-reverse', 'row')}>
          <Heading lineHeight="1.5" mr={responsive(0, '1em')} fontSize={responsive('1.125em', '1.75em')}>隨手丟垃圾很容易，但你真的懂丟嗎？<br />測看看30秒內，你可以丟對幾個垃圾！</Heading>
          <Button.Pink border="0.125em solid black" my="1em" to="/game/play/" fontSize={responsive('1.625em', '1.75em')} height="2em" px="1em">開始遊戲</Button.Pink>
        </Flex>
        <Media at="mobile">
          <StaticImage layout="fullWidth" placeholder="blurred" alt="更多垃圾" src="trash-mobile_2.png" />
        </Media>
      </Container>
    </FullpageVerticalCenter>
  )
}

export default GamePage
