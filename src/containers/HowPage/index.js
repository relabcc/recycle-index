import React from 'react'
import { StaticImage } from 'gatsby-plugin-image';

import Box from '../../components/Box';
import Text from '../../components/Text';
// import Image from '../../components/Image';
import theme, { responsive } from '../../components/ThemeProvider/theme';
import Footer from '../Footer';
import useShowHeader from '../../contexts/header/useShowHeader';
import Container from '../../components/Container';

import Factor from './Factor';
import Change from './Change';

// import how1 from './how-1.png';
// import how1Webp from './how-1.webp';
// import how2 from './how-2.png';
// import how2Webp from './how-2.webp';
// import how3 from './how-3.png';
// import how3Webp from './how-3.webp';
// import how4 from './how_4.png';
// import how4Webp from './how-4.webp';
// import how5 from './how-5.png';
// import how5Webp from './how-5.webp';
// import withLoading from '../withLoading'

// const temp = [require('./temp.webp'), require('./temp.png')]

const backgorundImg = [
  {
    img: <StaticImage src="how-1.png" placeholder="blurred" alt="垃圾分類之後發生的事" />,
    bg: 'colors.yellow',
  },
  {
    title: '丟「可回收」之後發生的事',
    img: <StaticImage src="how-2.png" placeholder="blurred" alt="回收處理流程" />,
  },
  {
    img: <StaticImage src="how-3.png" placeholder="blurred" alt="具有「回收價值」，才是再利用可以真實發生的關鍵" />,
  },
  {
    Comp: Factor,
    bg: 'colors.yellow',
  },
  {
    img: <StaticImage src="how_4.png" placeholder="blurred" alt="回收價值定義" />,
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
      {backgorundImg.map(({ img, bg, title, Comp }, i) => (
        <Box bg={bg} key={i}>
          <Container>
            {title && <Text pl={responsive('5%', '10%')} pt={responsive('1em', '5rem')} fontWeight="black" fontSize={responsive('1.5em', '2em')}>{title}</Text>}
            {Comp ? <Comp /> : img}
          </Container>
        </Box>
      ))}
      <Footer />
    </Box>
  )
}

export default (HowPage)
