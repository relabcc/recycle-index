import React from 'react'
import { StaticImage } from 'gatsby-plugin-image'

import Box from '../../components/Box'
import Text from '../../components/Text'
import Flex from '../../components/Flex'
import Image from '../../components/Image'
import { Media, responsive } from '../../components/ThemeProvider/theme'

// import one from './one.png'
// import two from './two.png'
// import three from './three.png'
// import four from './four.png'
// import icon from './icon.png'

// const icons = [require('./icon.webp'), require('./icon.png')]

const data = [
  {
    title: '廢棄物量',
    example: '因為過去使用普及，有一定的廢棄物量',
    desc: '指能收集到的廢棄物總量',
    text: '量太少的話，可能沒有再利用的誘因跟影響力。嚴格來說，處理後的廢棄物量才能直接影響發生再利用的機會。',
    number: <StaticImage src="one.png" layout="fullWidth" placeholder="tracedSVG" alt="01" />,
  },
  {
    title: '材質價格',
    example: '材質是價格不高的PE或PP塑膠',
    desc: '指回收物中的材質再生後的市場價格',
    text: '如果價值夠高，即使難處理，還是可能會被大量回收再利用。例如電路板中的黃金。若再生料比新料的成本更低，也會驅動回收再利用發生，例如鋁罐中的鋁金屬。',
    number: <StaticImage src="two.png" layout="fullWidth" placeholder="tracedSVG" alt="02" />,
  },
  {
    title: '收集成本',
    example: '因為輕薄易飄散，收集成本極高',
    desc: '指收集回收物的成本',
    text: '例如回收物太輕、細小容易飛散、有髒汙或臭味、材積太大造成運費高，都是提高收集成本的因素。',
    number: <StaticImage src="three.png" layout="fullWidth" placeholder="tracedSVG" alt="03" />,
  },
  {
    title: '處理成本',
    example: '若已經收集好了（例如壓成吸管磚），則材質單純，其實是可以進行再利用的',
    desc: '指收集後處理成再生材料的成本',
    text: '很多材料在技術上都是可回收的，若真的要窮盡各種物化分離的方式，什麼都可以處理，但處理技術的價格可能非常高，使再利用不容易實際發生。因此這裡也包含了技術的可行性。',
    number: <StaticImage src="four.png" layout="fullWidth" placeholder="tracedSVG" alt="04" />,
  },
]

const Factor = () => {
  return (
    <Box pt={['1em', '5em']} px={responsive('5%', '10%')}>
      <Text fontWeight="black" fontSize={responsive('1.5em', '2em')}>
        什麼是「回收價值」?<br />主要由4個因素構成：
      </Text>
      <Flex py={responsive('1em', '5em')} flexDirection={responsive('column', 'row')} flexWrap="wrap">
        {data.map(({ title, desc, text, number }, i) => (
          <Box
            key={i}
            width={responsive('100%', '50%')}
            position="relative"
            borderRight={responsive('none', (i % 2) ? 'none' : '1px solid')}
            borderLeft={responsive('none', (i % 2) ? '1px solid' : 'none')}
            borderBottom={responsive('1px solid', (i < 2) ? '2px solid' : 'none')}
            px={responsive(0, '5.625em')}
            py={responsive('1.5em', '5.625em')}
          >
            <Box position="absolute" width={responsive('4em', 'auto')} top={responsive('1em', '2em')} right={responsive('1em', '2em')}>
              <Image src={number} />
            </Box>
            <Box position="relative">
              <Box.Inline
                pb="0.5rem"
                fontWeight="bold"
                borderBottom="1px solid"
                fontSize={responsive('1.25em', '2em')}
              >
                {title}
              </Box.Inline>
              <Text.Bold mt="1em" fontSize="1em">{desc}</Text.Bold>
              <Text fontSize="1em">{text}</Text>
            </Box>
          </Box>
        ))}
      </Flex>
      <Box p="2em" bg="white" border="5px solid" borderRadius="2em">
        <Flex alignItems="center" flexDirection={responsive('column', 'row')}>
          <Media at="mobile">
            <Text.Bold fontSize="1.5em">案例：塑膠吸管</Text.Bold>
          </Media>
          <Box pr={responsive(0, '2em')} py={responsive('1em', 0)} width={responsive('25%', '15%')}>
            <StaticImage src="icon.png" alt="塑膠吸管" layout="fullWidth" />
          </Box>
          <Box pt={responsive('2em', '0')}>
            <Media greaterThan="mobile">
              <Text.Bold pb="0.5em" fontSize="1.5em">案例：塑膠吸管</Text.Bold>
            </Media>
            {data.map(({ title, example }, k) => (
              <Text pb="0.5em" fontSize="1em" key={k}>
                <Text.Inline fontWeight="bold">0{k + 1}{title}：</Text.Inline>
                {example}
              </Text>
            ))}
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}

export default Factor
