import React from 'react'

import Box from '../../components/Box';
import Text from '../../components/Text';
import Image from '../../components/Image';
import theme, { responsive } from '../../components/ThemeProvider/theme';
import Footer from '../Footer';
import useShowHeader from '../../contexts/header/useShowHeader';
import Container from '../../components/Container';
// import useResponsive from '../../contexts/mediaQuery/useResponsive'

import Factor from './Factor';
import Change from './Change';

import how1 from './how-1.png';
import how1Webp from './how-1.webp';
import how2 from './how-2.png';
import how2Webp from './how-2.webp';
import how3 from './how-3.png';
import how3Webp from './how-3.webp';
import how4 from './how_4.png';
// import how4Webp from './how-4.webp';
// import how5 from './how-5.png';
// import how5Webp from './how-5.webp';
import withLoading from '../withLoading'

// const temp = [require('./temp.webp'), require('./temp.png')]

const backgorundImg = [
  {
    src: [how1Webp, how1],
    bg: 'colors.yellow',
  },
  {
    title: '丟「可回收」之後發生的事',
    src: [how2Webp, how2],
  },
  {
    src: [how3Webp, how3],
  },
  {
    Comp: Factor,
    bg: 'colors.yellow',
  },
  {
    src: [how4, how4],
    bg: 'colors.yellow'
  },
  {
    Comp: Change,
  },

]

const HowPage = () => {
  useShowHeader('colors.yellow')
  return (
    <Box>
      <Box pt={responsive(theme.headerHeight, 0)} bg="colors.yellow" />
      {backgorundImg.map(({ src, bg, title, Comp }, i) => (
        <Box bg={bg} key={i}>
           <Container>
             {title && <Text pl={responsive('5%', '10%')} pt={responsive('1em', '5rem')} fontWeight="black" fontSize={responsive('1.5em', '2em')}>{title}</Text>}
             {Comp ? <Comp /> : <Image src={src} />}
          </Container>
        </Box>
      ))}
      <Footer />
    </Box>
  )
}

const toLoad = backgorundImg.map(d => d.src).filter(Boolean)

export default withLoading(toLoad)(HowPage)
