import React, { useRef, useState } from 'react'
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
  Portal,
} from "@chakra-ui/react"
import { MdMenu, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { StaticImage } from 'gatsby-plugin-image';
import { useLocation } from '@reach/router';

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
  { name: '資源連結', isDropdown: true, subLinks: [
    { name: 'RE-THINK 官網', href: 'https://rethinktw.cc/BkzgJ', isExternal: true },
    { name: '海廢圖鑑', href: 'https://rethinktw.cc/kRoiM', isExternal: true },
  ]},
  { name: '捐款支持', href: DONATE_URL, isSupport: true, hideEn: true, isExternal: true },
]

// Buttons displayed next to the mobile hamburger menu
const mobileButtons = [
  {
    name: '捐款',
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
  const [expandedIndex, setExpandedIndex] = useState(null)
  const location = useLocation()
  const handleClose = () => {
    setExpandedIndex(null)
    onClose()
  }
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
              <Menu
                key={i}
                placement="bottom-start"
                isLazy
              >
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
                  <Flex alignItems="center" justifyContent="space-between" gap="0.35em">
                    <Box as="span">{isEn ? en : name}</Box>
                    <MdExpandMore size="1em" />
                  </Flex>
                </MenuButton>
                <Portal>
                  <MenuList px="0.25em" py="0.5em" zIndex="dropdown" fontSize={responsive(null, '12px', '13.5px')}>
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
                </Portal>
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
            _hover={{ bg: 'black', color: 'white' }}
            _focus={{ bg: 'black', color: 'white' }}
          />
          <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={handleClose}
            finalFocusRef={btnRef}
            blockScrollOnMount={false}
          >
            <DrawerOverlay>
              <DrawerContent bg="gray.900" color="white">
                <DrawerCloseButton color="white" />
                <DrawerBody pt="3em" pl="2em">
                  {links.map(({ name, en, hideEn, to, href, isExternal, isDropdown, subLinks }, i) => (!isEn || !hideEn) && (
                    <Box key={i} py="0.5em" fontSize="1.125em" fontFamily={theme.fonts.number}>
                      {isDropdown && subLinks ? (
                        <>
                          <Flex
                            as="button"
                            onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                            width="100%"
                            color={subLinks.some(sub => sub.href === location.pathname || sub.to === location.pathname) ? 'yellow.400' : 'white'}
                            _hover={{ color: 'yellow.400' }}
                            _focus={{ color: 'yellow.400' }}
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Box as="span">{isEn ? en : name}</Box>
                            {expandedIndex === i ? <MdExpandLess size="1.25em" /> : <MdExpandMore size="1.25em" />}
                          </Flex>
                          {expandedIndex === i && (
                            <Box pl="1em" pt="0.5em">
                              {subLinks.map(({ name: subName, href: subHref, isExternal: subIsExternal }, j) => (
                                <Box key={j} py="0.25em">
                                  <Link
                                    onClick={handleClose}
                                    to={subHref && `${isEn ? '/en' : ''}${subHref}`}
                                    width="100%"
                                    href={subHref}
                                    isExternal={subIsExternal}
                                    color={subHref === location.pathname ? 'yellow.400' : 'white'}
                                    _hover={{ color: 'yellow.400' }}
                                    _focus={{ color: 'yellow.400' }}
                                  >
                                    {subName}
                                  </Link>
                                </Box>
                              ))}
                            </Box>
                          )}
                        </>
                      ) : (
                        <Link
                          onClick={handleClose}
                          to={to && `${isEn ? '/en' : ''}${to}`}
                          width="100%"
                          href={href}
                          isExternal={isExternal}
                          color={(to && location.pathname.startsWith(to)) || (href && location.pathname === href) ? 'yellow.400' : 'white'}
                          _hover={{ color: 'yellow.400' }}
                          _focus={{ color: 'yellow.400' }}
                        >{isEn ? en : name}</Link>
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
