import React from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"

import Box from '../../components/Box'
import Flex from '../../components/Flex'
import Text from '../../components/Text'
import { responsive } from '../../components/ThemeProvider/theme'

import Star from './Star'
import { isArray, range } from 'lodash'
import useRespoinsive from '../../contexts/mediaQuery/useResponsive'

const data = [
  {
    color: 'colors.green',
    title: '高回收價值',
    value: '中高',
    content: [
      ['大', '高', '低', '低'],
      '丟回收桶就可以回收的，不要再分錯了',
      '直接丟回收桶，交給台灣的回收體系！',
      '報紙、手提紙袋、透明塑膠袋、紙容器'
    ],
  },
  {
    color: 'colors.orange',
    title: '中回收價值',
    value: '不足',
    content: [
      ['積少成多', '不一定', '中高，常常是散落的小傢伙', '低'],
      '材質本身有價值，若收集足夠的量體，有機會被回收再利用\n材質價值不高，所以除了收集，更重要的是再設計',
      '收集很多交給回收商或設計出好產品、新的好用途',
      '釘書針、衣架、塑膠花盆、五金零件'
    ],
  },
  {
    color: 'colors.pink',
    title: '低回收價值',
    value: '不足',
    content: [
      ['不一定', '中低', '高 就很慘', '高 常是複合材料'],
      '材質價格低、難收集、難處理、特殊情況等等，不管是公告可回收或不可回收，就盡量不要用吧',
      '只能丟到一般垃圾，可以的話，請從這種類型的垃圾開始少用、或尋找替代方案吧！',
      '膠囊咖啡包裝(複合材質)、電子發票、不透明塑膠袋, 養樂多鋁膜、橡皮筋'
    ],
  },
]

const profiles = ['廢棄物量', '材質價格', '收集成本', '處理成本']
const titles = ['回收價值', '說明', '我們可以怎麼做', '案例']

const Module = ({ data, isMobile }) => data.map(({ color, title, value, content}, i) => (
  <Flex flexDirection="column" borderLeft={i && '2px solid black'} border={responsive('2px solid', 'auto')} flex={1} width={responsive('100%', 1 / 3)} key={i}>
   {!isMobile &&
      <Box
        color="white"
        textAlign="center"
        bg={color}
        p="1rem"
        fontWeight="black"
        letterSpacing="0.125em"
        fontSize="1.75em"
        borderBottom="1px solid black"
      >
        {title}
      </Box>
    }
    <Box py="2em" px={responsive('12.5%', '4.5em')}>
      {titles.map((title, k) => (
        <Box key={k} pt="1em">
          <Box fontSize={responsive('1em', '1.25em')} position="relative" pb={responsive('0.25em', '0.25rem')}>
            <Box position="absolute" color={color} top="-15%" right="100%" transform="translateX(-0.25em)">
              <Star />
            </Box>
            <Text.Bold as="span">{title}　</Text.Bold><Text.Bold as="span" color={color}>{!k && value}</Text.Bold>
          </Box>
          <Box>
            {isArray(content[k]) ? (
              <Box>
                {/* <Text fontSize={responsive('2.5em', '1em')}>Profile example</Text> */}
                <Box pl="1.75em" fontSize={responsive('0.75em', '1em')} as="ol" listStyleType="decimal-leading-zero">
                  {content[k].map((text, key) => (
                    <Box as="li" key={key}>
                      {profiles[key]}: <Text.Inline color={text.length > 4 && color}>{text}</Text.Inline>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : (
              <Box fontSize={responsive('0.75em', '1em')} whiteSpace="pre-wrap">
                {content[k]}
              </Box>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  </Flex>
))

const Change = () => {
  const { isMobile } = useRespoinsive()
  return (
    <Box py={responsive('1em', '5rem')} px={responsive('5%', '10%')}>
      <Text fontWeight="black" fontSize={responsive('1.5em', '2em')}>
        你有機會改變的「回收物命運」
      </Text>
      <Text fontSize={responsive('1em', '1.5em')}>
        你有發現回收大百科中101個垃圾，有不同的回收價值嗎？這些價值都是參考實際的回收市場而定。當我們碰到不同回收價值的東西時，該怎麼做呢？
      </Text>
      {/* <Flex pt="1em" alignItems="center">
        <Text.Bold fontSize={responsive('2.5em', '1em')}>回收價值高</Text.Bold>
        <Box flex={1} mx="2em" position="relative">
          <Box height={responsive('2px', "3px")} bg="black" />
          <Box fontWeight="bold" fontSize={responsive('2.75em', '1em')} position="absolute" top="50%" right="100%" transform="translate(0.75em, -45%)">＜</Box>
          <Box fontWeight="bold" fontSize={responsive('2.75em', '1em')} position="absolute" top="50%" left="100%" transform="translate(-0.75em, -45%)">＞</Box>
        </Box>
        <Text.Bold fontSize={responsive('2.5em', '1em')}>回收價值低</Text.Bold>
      </Flex> */}
      {isMobile ? (
        <Tabs mt="2em" isFitted variant="enclosed">
          <TabList>
            {data.map(({ title, color }, i) => (
              <Tab
                letterSpacing="0.5rem"
                fontSize={responsive('0.875em', '1em')}
                borderColor="black"
                _focus={{ outline: 'none' }}
                _selected={{ bg: color, color: 'white', borderColor: 'black' }}
                key={i}>
                {title}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {range(data.length).map((key) => (
              <TabPanel p="0">
                <Module isMobile={isMobile} data={data.slice(key, key + 1)} />
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      ) : (
        <Flex mt="1em" border="2px solid" alignItems="stretch">
          <Module data={data} />
        </Flex>
      )}
    </Box>
  )
}

export default Change
