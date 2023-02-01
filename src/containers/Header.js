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
import { MdMenu } from 'react-icons/md';
import { StaticImage } from 'gatsby-plugin-image';

import Box from '../components/Box';
import Button from '../components/Button';
import Flex from '../components/Flex';
import Link from '../components/Link';
import theme, { Media, responsive } from '../components/ThemeProvider/theme';

const links = [
  { name: '101+垃圾', en: '101+ Must-Know Trashes', to: '/catalogue/' },
  { name: '丟垃圾大考驗', en: 'Recycle Challenge', to: '/game/' },
  { name: '必懂的回收知識', en: 'What Happened After Recycling', to: '/how/' },
  { name: '關於我們', en: 'About Us', to: '/about/' },
  { name: '文章專區', en: 'Articles', href: '/blog/' },
  { name: '課程申請', href: 'https://rethinktw.cc/5Y9hr', hideEn: true, isExternal: true },
  { name: '贊助我們', href: 'https://rethinktw.neticrm.tw/civicrm/contribute/transact?reset=1&id=26', isSupport: true, hideEn: true, isExternal: true },
]

const Header = ({ isEn, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  return (
    <Flex
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      alignItems="center"
      zIndex="docked"
      fontSize={responsive(null, '16px', '18px')}
      {...props}
    >
      <Box px="1em">
        <Link to="/" aria-label="回首頁">
          <Box width={responsive('8em', '12em', '7.5em')}>
            <StaticImage src="./logo.svg" alt="回收大百科" placeholder="tracedSVG" />
          </Box>
        </Link>
      </Box>
      <Box flex="1" />
      <Media greaterThan="mobile">
        {links.map(({ name, en, to, href, isSupport, hideEn, isExternal }, i) => (!isEn || !hideEn) && (
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
            isExternal={isExternal}
          >
            {isEn ? en : name}
          </Button>
        ))}
      </Media>
      <Media at="mobile">
        <>
          <IconButton
            mr={responsive('1em', '2em')}
            color="white"
            variant="ghost"
            height="auto"
            ref={btnRef}
            onClick={onOpen}
            aria-label="選單"
            icon={<MdMenu size="2em" />}
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
                  {links.map(({ name, en, hideEn, to, href, isExternal }, i) => (!isEn || !hideEn) && (
                    <Box key={i} py="1em" fontSize="1.125em" fontFamily={theme.fonts.number}>
                      <Link
                        onClick={onClose}
                        to={to && `${isEn ? '/en' : ''}${to}`}
                        width="100%"
                        href={href}
                        isExternal={isExternal}
                      >{isEn ? en : name}</Link>
                    </Box>
                  ))}
                </DrawerBody>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>
        </>
      </Media>
      {/* <Box.Absolute bottom="0" left="2em" right="2em" height="0.125em" bg="black" /> */}
    </Flex>
  )
}

export default Header
