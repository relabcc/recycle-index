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
  { name: '101件垃圾', to: '/catalogue' },
  { name: '丟垃圾大考驗', to: '/game' },
  { name: '必懂的回收知識', to: '/how' },
  { name: '關於我們', to: '/about' },
  { name: '贊助我們', href: 'https://rethinktw.neticrm.tw/civicrm/contribute/transact?reset=1&id=26', isSupport: true },
]

const Header = (props) => {
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
      <Box px={responsive('2em', '1em')}>
        <Link to="/">
          <Image width={responsive('20em', '12em', '7.5em')} src={logo} />
        </Link>
      </Box>
      <Box flex="1" />
      {isMobile ? (
        <>
          <IconButton mr="2em" color="white" variant="ghost" height="auto" ref={btnRef} onClick={onOpen} icon={<MdMenu size="6em" />} />
          <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            finalFocusRef={btnRef}
            size="lg"
            blockScrollOnMount={false}
          >
            <DrawerOverlay>
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerBody pt="10em" pl="3em">
                  {links.map(({ name, to, href, isSupport }, i) => (
                    <Box key={i} py="1em" fontSize="3em" fontFamily={theme.fonts.number}>
                      <Link onClick={onClose} href={href} width="100%" to={to}>{name}</Link>
                    </Box>
                  ))}
                </DrawerBody>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>
        </>
      ) : links.map(({ name, to, href, isSupport }, i) => (
        <Button
          variant="outline"
          colorScheme="black"
          bg={isSupport ? 'colors.pink' : 'white'}
          to={to}
          href={href}
          mx="0.5em"
          borderWidth="0.15em"
          fontSize="0.75em"
          key={i}
          fontFamily={theme.fonts.number}
        >
          {name}
        </Button>
      ))}
      {/* <Box.Absolute bottom="0" left="2em" right="2em" height="0.125em" bg="black" /> */}
    </Flex>
  )
}

export default Header