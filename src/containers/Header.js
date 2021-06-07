import React, { useRef } from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react"

import Box from '../components/Box';
import Button from '../components/Button';
import Flex from '../components/Flex';
import Image from '../components/Image';
import Link from '../components/Link';
import theme, { responsive } from '../components/ThemeProvider/theme';

import logo from './logo.svg'
import useResponsive from '../contexts/mediaQuery/useResponsive';
import { MdMenu } from 'react-icons/md';

const links = [
  { name: '101件垃圾', en: '101 Must-Know Trashes', to: '/catalogue' },
  { name: '丟垃圾大考驗', en: 'Recycle Challenge', to: '/game' },
  { name: '必懂的回收知識', en: 'What Happened After Recycling', to: '/how' },
  { name: '關於我們', en: 'About Us', to: '/about' },
  { name: '課程申請', href: 'https://docs.google.com/forms/d/e/1FAIpQLSePuqu6i9Q0e2IoOih6RNOsBFwRrxo3lwrXI7MGikkdKsFYZg/viewform', hideEn: true },
  { name: '贊助我們', href: 'https://rethinktw.neticrm.tw/civicrm/contribute/transact?reset=1&id=26', isSupport: true, hideEn: true },
]

const Header = ({ isEn, ...props }) => {
  const { isMobile } = useResponsive()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  return (
    <Flex
      position="fixed"
      top={0}
      left={0}
      right={0}
      alignItems="center"
      zIndex="docked"
      {...props}
    >
      <Box px="1em">
        <Link to="/">
          <Image width={responsive('8em', '12em', '7.5em')} src={logo} alt="回收大百科" />
        </Link>
      </Box>
      <Box flex="1" />
      {isMobile ? (
        <>
          <IconButton
            mr={responsive('1em', '2em')}
            color="white"
            variant="ghost"
            height="auto"
            ref={btnRef}
            onClick={onOpen}
            icon={<MdMenu size={isMobile ? '2em' : '6em'} />}
          />
          <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            finalFocusRef={btnRef}
            blockScrollOnMount={false}
          >
            <DrawerOverlay>
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerBody pt="3em" pl="2em">
                  {links.map(({ name, en, hideEn, to, href }, i) => (!isEn || !hideEn) && (
                    <Box key={i} py="1em" fontSize="1.125em" fontFamily={theme.fonts.number}>
                      <Link onClick={onClose} to={to && `${isEn ? '/en' : ''}${to}`} width="100%" href={href}>{isEn ? en : name}</Link>
                    </Box>
                  ))}
                </DrawerBody>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>
        </>
      ) : links.map(({ name, en, to, href, isSupport, hideEn }, i) => (!isEn || !hideEn) && (
        <Button
          variant="outline"
          colorScheme="black"
          bg={isSupport ? 'colors.pink' : 'white'}
          href={href}
          to={to && `${isEn ? '/en' : ''}${to}`}
          mx="0.5em"
          borderWidth="0.15em"
          fontSize="0.75em"
          key={i}
          fontFamily={theme.fonts.number}
        >
          {isEn ? en : name}
        </Button>
      ))}
      {/* <Box.Absolute bottom="0" left="2em" right="2em" height="0.125em" bg="black" /> */}
    </Flex>
  )
}

export default Header
