import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AspectRatio } from '@chakra-ui/react';
import { interval } from 'd3-timer'
import { useHover } from 'react-use';
import { useIsVisible } from "react-is-visible"

import Box from '../../components/Box';
import Link from '../../components/Link';
import Text from '../../components/Text';
import Flex from '../../components/Flex';
import Image from '../../components/Image';

import Face from '../Face'
import useIsEn from '../useIsEn';
import { responsive } from '../../components/ThemeProvider/theme';
import useRespoinsive from '../../contexts/mediaQuery/useResponsive';

const colorsCfg = {
  A: 'green',
  B: 'orange',
  C: 'pink',
}

const enName = {
  '透明塑膠袋': 'Transparent Plastic Bag',
  '髒髒塑膠袋': 'Dirty Plastic Bag',
  '安全帽': 'Helmet',
  '塑膠飲料杯': 'Plastic Drink Cup',
  '紙飲料杯': 'Paper Drink Cup',
  '保麗龍飲料杯': 'Styrofoam Drink Cup',
  '紙便當盒': 'Bento Box',
  '電子發票': 'Paper Receipt',
  '袋裝洋芋片': 'Chips Bag',
  '橡皮筋': 'Rubber Ban',
  '罐裝洋芋片': 'Chips Can',
  '披薩盒': 'Pizza Box',
  '輕便雨衣': 'Rain Poncho',
  '瓷器': 'Porcelain',
  '手提紙袋': 'Paper Bag',
  '梳子': 'Comb',
  '沐浴乳瓶罐': 'Shampoo',
  '醫療口罩': 'Face Mask',
  '網購破壞袋': 'ECommerce Delivery Bag',
  '生廚餘': 'Compostable Food Waste',
  '熟廚餘': 'Non-Compostable Food Waste',
  '塑膠湯匙': 'Plastic Spoon',
  '透明雞蛋盒': 'Plastic Egg Tray',
  '原子筆': 'Pen',
  '絨毛玩偶': 'Stuffed Toys',
  '洗面乳': 'Facial Cleanser',
  '產品外包裝': 'Product Package',
  '洋蔥網袋': 'Onion Reticule',
  '充電線': 'Charging Cable',
  '盆栽': 'Potted Plant',
  '養樂多': 'Yakult',
  '廣告傳單': 'Flyer',
  '薄塑膠盒': 'Plastic Carton',
  '木製品': 'Wooden Chair',
  '塑膠餐盒': 'Plastic Bento Box',
  '奶油球': 'Creamer',
  '菸盒': 'Cigarette Box',
  '瑜珈墊': 'Yoga Mat',
  '馬桶刷': 'Toilet Brush',
  '紙尿布': 'Diaper',
  '水果網套': 'Fruit Cushion',
  '牛奶盒': 'Milk Carton',
  '免洗筷': 'Disposable Chopsticks',
  '濾水器濾芯': 'Filter Cartridge',
  '耳機': 'Earphones',
  '手機殼': 'Cellphone Case',
  '優格杯': 'Yogurt Cup',
  '鏡子': 'Mirror',
  '泡泡紙': 'Bubble Wrap',
  '枯枝落葉': 'Leaf',
  '口紅': 'Lipstick',
  '碎紙': 'Shredded Paper',
  '衣架': 'Hanger',
  '鉛筆': 'Pencil',
  '報紙': 'Newspaper',
  '熱咖啡杯': 'Hot Coffee Cup',
  '補充包': 'Refillpack',
  '小吃紙袋': 'Snack Paper Bag',
  '鋁箔紙': 'Aluminum Foil',
  '棉被枕頭': 'Quilt & Pillow',
  '塑膠吸管': 'Plastic Straw',
  '廢棄藥品': 'Expired Medicines',
  '泡麵碗': 'Instant Noodle Bowl',
  '玻璃瓶': 'Glass Bottle',
  '立可帶': 'Correction Tape',
  '玩具': 'Plastic Toy',
  '釘書針': 'Staple',
  '膠囊咖啡': 'Used Capsule Coffee',
  '棉花棒': 'Cotton Swab',
  '打火機': 'Lighter',
  '碎玻璃': 'Broken Glass',
  '衛生紙包裝': 'Tissue Paper Package',
  '奶粉罐': 'Milk Powder Can',
  '隱形眼鏡': 'Contact Lens',
  '網購紙箱': 'ECommerce cartons',
  '光碟': 'CD',
  '鋁箔包': 'Beverage Carton',
  '拖把': 'Mop',
  '不織布提袋': 'Non-Woven Bag',
  '旅行行李箱': 'Travel Suitcase',
  '牙膏': 'Toothpaste',
  '信用卡': 'Credit Card',
  '彩色筆': 'Color Pen',
  '滑鼠': 'Mouse',
  '夾腳拖': 'Flip Flops',
  '雨傘': 'Umbrella',
  '塑膠牙線棒': 'Plastic Floss Stick',
  '鋁罐': 'Aluminum Can',
  '保鮮膜': 'Food Wrap',
  '油漆桶': 'Paint Bucket',
  '生鮮托盤': 'Fresh Food Tray',
  '寶特瓶': 'PET Bottle',
  '帳單信封': 'Bill Envelope',
  '牙刷': 'Toothbrush',
  '保養品瓶罐': 'Skin Care Products',
  '高壓瓶': 'High Pressure Can',
  '餅乾禮盒': 'Biscuit Gift Box',
  '衣物': 'Clothes',
  '環保袋': 'Reusable Bag',
  '鞋': 'Shoes',
  '防撞乖乖粒': 'EPE Cushion',
}

const rate = 0.2
const PerTrash = ({ data }) => {
  const isEn = useIsEn()
  const { isMobile } = useRespoinsive()
  const nodeRef = useRef()
  const isVisible = useIsVisible(nodeRef)

  const [showFace, setShowFace] = useState(() => Math.random() < rate)
  const timer = useRef()
  const tick = useCallback(() => {
    setShowFace(Math.random() < rate)
  }, [])
  useEffect(() => {
    if (isVisible) {
      timer.current = interval(tick, 5000)
    }
    return () => {
      if (timer.current) {
        timer.current.stop()
      }
    }
  }, [isVisible])
  const scale = (data.transform.homeScale || 100) * 0.85 / 100
  const element = (hovered) =>
    <Link to={`/trash/${data.id}`} height="100%" width="100%">
      <Box
        width="100%"
        bg="white"
        // bg={`colors.${colorsCfg[data.recycleValue]}`}
        height="100%"
        textAlign="center"
        flexDirection="column"
        transition="all 0.25s"
        _hover={{
          boxShadow: !isMobile && '4px 4px 0px rgba(0,0,0,0.2)',
          transform: !isMobile && 'translate(-4px, -4px)',
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
          transform={`scale(${scale}) translate(${['homeX', 'homeY'].map((k, i) => `${-1 * ((i ? 0 : 50) - (data.transform[k] || 0)) / scale}%`).join()})`}
        >
          <Image src={data.img} />
          {(showFace || hovered) && (
            <Face id={data.transform.faceNo} transform={data.transform.face} />
          )}
        </Box.Absolute>
        <Box.Absolute width="100%" left="50%" top="0.75em" transform="translateX(-50%)">
          <Text
            // color="white"
            fontWeight="700"
            fontSize={isEn ? responsive('0.875em', '1.5em', '0.75em') : responsive('1em', '2em', '1em')}
            letterSpacing="0.125em"
          >{isEn ? enName[data.name] : data.name}</Text>
        </Box.Absolute>
      </Box>
    </Link>
  const [hoverable] = useHover(element);
  return (
    <AspectRatio ratio={1} ref={nodeRef}>
      <Box p={responsive('0.5em', '1em')}>
        {hoverable}
      </Box>
    </AspectRatio>
  )
}

export default PerTrash
