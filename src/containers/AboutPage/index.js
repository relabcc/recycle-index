import React from 'react'
import ReactMarkdown from 'react-markdown'
import { StaticImage } from 'gatsby-plugin-image';

import Box from '../../components/Box';
// import Image from '../../components/Image';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Link from '../../components/Link';
import useShowHeader from '../../contexts/header/useShowHeader';

// import rethink from './rethink.svg'
// import relab from './relab.svg'
// import renato from './renato.svg'
// import about from './about.svg'
// import picture from './picture.svg'
import { responsive } from '../../components/ThemeProvider/theme';
import Footer from '../Footer';

const data = [
  {
    team: '發起團隊',
    name: 'RE-THINK\n社團法人台灣重新思考環境教育協會',
    intro: 'RE-THINK的目標就是解決台灣爆量的垃圾問題，身為本土最具社群號召力的環保團體，我們從2013年開始，RE-THINK帶領超過3萬群眾在全台灣淨灘。\n在全台海灘撿越久的垃圾，才發現牽連到的問題越多。所以，我們製作[《海廢圖鑑》](https://oceantrash.rethinktw.org/)，用最ㄎㄧㄤ的方式把全台灣的海洋廢棄物搜集成網站，讓大家重新認識海洋廢棄物。但光了解海廢還不夠，我們生活中每天都製造了源源不絕的垃圾，其中更有不少垃圾沒有妥善被處理。於是讓大家懂分、懂丟的《回收大百科》就這麼誕生了！',
    logo: <StaticImage placeholder="blurred" src="rethink.svg" alt="RE-THINK" />,
    url: 'https://rethinktw.org/',
  },
  {
    team: '製作團隊',
    name: 'Re-lab',
    intro: '「臺灣的資源垃圾回收率高達60%，但丟完之後呢？」\n這是促使Re-lab投入《回收大百科》的第1個問題。但真正進入這個專案後，我們發現還有100個很重要但現在沒有被好好解答的問題。對於多數人來說，一個物品的生命在丟棄的當下就結束了。但我們認為丟棄之後，故事才剛開始。\n身為一個致力於將資訊轉譯成有趣故事和體驗的團隊，Re-lab決定攜手這個領域最強的兩個夥伴，邀請你一起來重新思考這些看似微小但重要的問題。',
    logo: <StaticImage placeholder="blurred" src="relab.svg" alt="Re-lab" />,
    url: 'https://relab.cc/',
  },
  {
    team: '回收顧問',
    name: 'REnato lab',
    intro: '2014年成立，REnato lab運用系統性觀點和與各行各業合作，令每日生活成為邁向永續的一部分。為了回應過度消費引起的自然資源耗竭議題，REnato lab以循環經濟、科技、知識分享作為主軸，尋找為地球和人類創造更好明天的可能路徑。\n此次REnato lab合作回收大百科專案，希望引導讀者從消費開始思考資源利用，將資源進入正確回收處理管道、提升再利用價值一事重新詮釋，邀請更多人加入行列，讓地球獲得喘息空間。',
    logo: <StaticImage placeholder="blurred" src="renato.svg" alt="REnato lab" />,
    url: 'https://renato-lab.com/',
  },
]

const About = () => {
  useShowHeader('colors.yellow')

  return (
    <Box pt={responsive('3.5em', '3.5em')} bg="colors.yellow">
      <Box
        bg="colors.yellow"
        pt="2em"
        pb="8.125em"
        px={responsive('1.5em', '10em')}
      >
        <StaticImage placeholder="blurred" src="about.svg" alt="About" />
        <Flex alignItems={responsive('auto', 'stretch')} flexDirection={responsive('column', 'row')}>
          <Box mr={responsive(0, '-1.25em')} width="50%">
            <StaticImage placeholder="blurred" src="picture.svg" alt="Us" />
          </Box>
          <Flex
            flex={1}
            pt="1em"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Box fontSize="1em" pb="0.625em" letterSpacing="0.125em">
              <Text textAlign="justify">台灣是個海島國家，在面對龐大的垃圾污染時，首當其衝的是我們的海洋。但比較少見的，是我們將垃圾丟入垃圾桶後，後頭看不見的焚化、掩埋、垃圾無處安放的問題。</Text>
              <Text textAlign="justify" mt="1em">在全台超過3萬民眾的調查中，我們發現了大家有不少關於垃圾的迷思和困惑：回收有用嗎？這算是資源回收嗎？PLA是什麼？寶特瓶怎麼丟？反正就丟回收就可能被回收嘛？塑膠袋到底可不可回收？</Text>
              <Text textAlign="justify" mt="1em">在台灣，回收體系極度複雜，不見得有永遠的標準答案。我們盡可能透過最專業的夥伴、彙整最可行資訊、找到最大的交集，逐步帶給大家最可靠的回收知識和規範。我們歡迎個人、教育單位、企業品牌，一起跟我們合作，為台灣的回收找到更好的解方。</Text>
            </Box>
            <Flex pt={responsive('1em', 0)} justifyContent="flex-end" alignItems="flex-end">
              <Text lineHeight="1" fontSize="1em">RE-THINK創辦人</Text>
              <Text.Inline lineHeight="1" pl="0.3125em" fontSize="1.75em">
                黃之揚
              </Text.Inline>
            </Flex>
          </Flex>
        </Flex>
      </Box>
      <Box bg="white" pt="5em">
        <Text letterSpacing="0.125em" fontWeight="900" px={responsive('1rem', '4.6875rem')} fontSize={responsive('1.5em', '2em')} color="yellow.500">核心團隊</Text>
        {data.map(({ team, name, intro, logo, url }, i) => (
          <Flex
            flexDirection={responsive('column', 'row')}
            position="relative"
            py={responsive('1.5em', '4.6875em')}
            px={responsive('2em', '10em')}
            alignItems="center"
            justifyContent="space-between"
            key={i}
          >
            <Box position="relative" width={responsive('35%', '9.375em')}>
              <Link href={url} isExternal aria-label={name}>
                {logo}
              </Link>
            </Box>
            <Box position="relative" pl={responsive(0, '6.875em')} pt={responsive('1em', 0)} flex={1}>
              <Text.Bold fontSize={responsive('1em', '1.25em')}>{team}</Text.Bold>
              <Text.Bold
                whiteSpace="pre-wrap"
                my="0.15625em"
                fontSize={responsive('1.5em', '1.75em')}
              >
                <Link href={url} isExternal>
                  {name}
                </Link>
              </Text.Bold>
              <Text
                lineHeight="1.75"
                whiteSpace="pre-wrap"
                letterSpacing="0.125em"
                fontSize="0.875em"
                textAlign="justify"
              >
                <ReactMarkdown renderers={{ link: Link.MdLink }}>
                  {intro}
                </ReactMarkdown>
              </Text>
            </Box>
          </Flex>
        ))}
      </Box>
      {/* <Sponsor textColor="white" bgColor="colors.yellow" /> */}
      <Footer />
    </Box>
  )
}

export default About
