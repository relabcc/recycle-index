import React, { useRef } from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react"
import { MdMenu } from 'react-icons/md';
import { StaticImage } from 'gatsby-plugin-image';

import Box from '../components/Box';
import Button from '../components/Button';
import Flex from '../components/Flex';
import Link from '../components/Link';
import theme, { Media, responsive } from '../components/ThemeProvider/theme';
import { DONATE_URL, COURSE_APPLY_URL } from '../constants/links';

const links = [
  { name: '101+垃圾', en: '101+ Must-Know Trashes', to: '/catalogue/' },
  { name: '丟垃圾大考驗', en: 'Recycle Challenge', to: '/game/' },
  { name: '必懂的回收知識', en: 'What Happened After Recycling', to: '/how/' },
  { name: '關於我們', en: 'About Us', to: '/about/' },
  { name: '文章專區', en: 'Articles', href: '/blog/' },
  { name: '課程申請', href: COURSE_APPLY_URL, hideEn: true, isExternal: true },
  { name: '友站連結', isDropdown: true, subLinks: [
    { name: 'RE-THINK 官網', href: 'https://rethinktw.cc/BkzgJ', isExternal: true },
    { name: '海廢圖鑑', href: 'https://rethinktw.cc/kRoiM', isExternal: true },
  ]},
  { name: '捐款支持', href: DONATE_URL, isSupport: true, hideEn: true, isExternal: true },
]

// Buttons displayed next to the mobile hamburger menu
const mobileButtons = [
  {
    name: '贊助',
    en: 'Donate',
    href: DONATE_URL,
    isExternal: true,
    hideEn: true,
    isSupport: true,
    bg: 'colors.neonGreen',
  },
]

const Header = ({ isEn, topOffset = 0, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  return (
    <Flex
      as="header"
      position="fixed"
      top={topOffset}
      left={0}
      right={0}
      alignItems="center"
      zIndex="docked"
      fontSize={responsive(null, '16px', '18px')}
      {...props}
    >
      <Box px="1em">
        <Link to="/" aria-label="回首頁">
          <Box width={responsive('12em', '16em', '18em')} lineHeight={0}>
            <StaticImage src="./logo_all.png" alt="RE-THINK" placeholder="tracedSVG" />
          </Box>
        </Link>
      </Box>
      <Box flex="1" />
      <Media greaterThan="mobile">
        {links.map(({ name, en, to, href, isSupport, hideEn, isExternal, isDropdown, subLinks }, i) => {
          if (isEn && hideEn) return null

          if (isDropdown && subLinks) {
            return (
              <Menu key={i} placement="bottom-start" isLazy>
                <MenuButton
                  as={Button}
                  variant="outline"
                  colorScheme="black"
                  bg={isSupport ? 'colors.neonGreen' : 'white'}
                  mx="0.5em"
                  borderWidth="0.15em"
                  fontSize="0.75em"
                  fontFamily={theme.fonts.number}
                >
                  {isEn ? en : name}
                </MenuButton>
                <MenuList px="0.25em" py="0.5em">
                  {subLinks.map(({ name: subName, to: subTo, href: subHref, isExternal: subIsExternal }, j) => (
                    <MenuItem
                      key={j}
                      as={Link}
                      to={subTo && `${isEn ? '/en' : ''}${subTo}`}
                      href={subHref}
                      isExternal={subIsExternal}
                      fontFamily={theme.fonts.number}
                    >
                      {subName}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            )
          }

          return (!isEn || !hideEn) && (
            <Button
              variant="outline"
              colorScheme="black"
              bg={isSupport ? 'colors.neonGreen' : 'white'}
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
          )
        })}
      </Media>
      <Media at="mobile">
        <>
          {mobileButtons.filter(({ hideEn }) => (!isEn || !hideEn)).map(({ name, en, href, isExternal, isSupport, bg }, i) => (
            <Button
              key={i}
              variant="outline"
              colorScheme="black"
              bg={isSupport ? 'colors.neonGreen' : bg}
              href={href}
              isExternal={isExternal}
              mx="0.5em"
              borderWidth="0.15em"
              fontSize="0.75em"
              fontFamily={theme.fonts.number}
            >
              {isEn ? en : name}
            </Button>
          ))}
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
              <DrawerContent bg="gray.900" color="white">
                <DrawerCloseButton color="white" />
                <DrawerBody pt="3em" pl="2em">
                  {links.map(({ name, en, hideEn, to, href, isExternal, isDropdown, subLinks }, i) => (!isEn || !hideEn) && (
                    <Box key={i} py="0.5em" fontSize="1.125em" fontFamily={theme.fonts.number}>
                      <Link
                        onClick={onClose}
                        to={to && `${isEn ? '/en' : ''}${to}`}
                        width="100%"
                        href={href}
                        isExternal={isExternal}
                        color="white"
                        _hover={{ color: 'gray.200' }}
                      >{isEn ? en : name}</Link>
                      {isDropdown && subLinks && (
                        <Box pl="1em" pt="0.5em">
                          {subLinks.map(({ name: subName, href: subHref, isExternal: subIsExternal }, j) => (
                            <Box key={j} py="0.25em">
                              <Link
                                onClick={onClose}
                                to={subHref && `${isEn ? '/en' : ''}${subHref}`}
                                width="100%"
                                href={subHref}
                                isExternal={subIsExternal}
                                color="white"
                                _hover={{ color: 'gray.200' }}
                              >
                                {subName}
                              </Link>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  ))}
                </DrawerBody>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>
        </>
      </Media>
    </Flex>
  )
}

export default Header
