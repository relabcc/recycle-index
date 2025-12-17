import React from "react";
import {
  Flex,
  Stack,
  SimpleGrid,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  FiFacebook,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiPhone,
  FiExternalLink,
} from "react-icons/fi";

import Box from "../components/Box";
import Container from "../components/Container";
import Link from "../components/Link";
import Button from "../components/Button";
import Sponsor from "../components/Sponsor";
import { responsive } from "../components/ThemeProvider/theme";

const Footer = ({ isAbout, isTrash, noSep, noSponsor, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const contactInfo = [
    {
      icon: FiMapPin,
      label: "100 台北市中正區羅斯福路二段9號8樓之三",
      href:
        "https://www.google.com/maps/place/100%E8%87%BA%E5%8C%97%E5%B8%82%E4%B8%AD%E6%AD%A3%E5%8D%80%E7%BE%85%E6%96%AF%E7%A6%8F%E8%B7%AF%E4%BA%8C%E6%AE%B59%E8%99%9F",
      isExternal: true,
    },
    { icon: FiPhone, label: "（02）2706-1837", href: "tel:+886227061837" },
    {
      icon: FiMail,
      label: "contact@rethinktw.org",
      href: "mailto:contact@rethinktw.org",
    },
  ];

  const supportLinks = [
    { label: "捐款支持", href: "/donate/" },
    { label: "加入志工", href: "https://rethinktw.cc/volunteer", isExternal: true },
    { label: "合作提案", href: "https://rethinktw.cc/5Y9hr", isExternal: true },
    { label: "常見問題", href: "https://rethinktw.cc/refaq", isExternal: true },
  ];

  const socialLinks = [
    {
      icon: FiFacebook,
      label: "Facebook",
      href: "https://www.facebook.com/rethink.tw",
    },
    {
      icon: FiInstagram,
      label: "Instagram",
      href: "https://www.instagram.com/rethink.tw/",
    },
    {
      icon: FiExternalLink,
      label: "RE:THINK 官網",
      href: "https://rethinktw.org/",
    },
  ];

  return (
    <Box bg="white" {...props}>
      {!isAbout && !noSponsor && (
        <Container>
          <Sponsor
            isFooter
            textColor="black"
            borderTop={!noSep && "1px solid"}
            px="0"
            fontSize={responsive("0.75em", "1.375em")}
            logoProps={{
              width: responsive(1 / 3, "10em"),
            }}
          />
        </Container>
      )}
      <Box bg="black" color="white" mt={noSponsor ? 0 : responsive("0.5em", "1em")}>
        <Container py={responsive("2em", "3.5em")} fontSize={responsive("0.875em", "1em")}>
          <Stack
            direction={responsive("column", "row")}
            spacing={responsive("2em", "3em")}
            align={responsive("flex-start", "flex-start")}
          >
            <Stack spacing={responsive("0.75em", "1em")} flex={responsive("unset", "1.25")}>
              <Box fontSize={responsive("1.25em", "1.5em")} fontWeight="900" letterSpacing="0.05em">
                回收大百科
              </Box>
              <Box lineHeight="1.8">
                最通用的回收指南，集結政府公告、回收專業與實際處理狀況，邀請你一起共創最完整的回收資訊。
              </Box>
              <Flex wrap="wrap" gap="0.75em">
                <Button
                  href="/donate/"
                  colorScheme="yellow"
                  bg="colors.yellow"
                  color="black"
                  _hover={{ bg: "yellow.400" }}
                  height={responsive("2.5em", "3em")}
                  fontSize={responsive("0.875em", "1em")}
                >
                  捐款支持
                </Button>
                <Button
                  href="https://rethinktw.cc/volunteer"
                  isExternal
                  variant="outline"
                  colorScheme="whiteAlpha"
                  borderColor="white"
                  color="white"
                  _hover={{ bg: "white", color: "black" }}
                  height={responsive("2.5em", "3em")}
                  fontSize={responsive("0.875em", "1em")}
                >
                  加入志工
                </Button>
              </Flex>
            </Stack>
            <SimpleGrid
              spacing={responsive("1.5em", "2em")}
              columns={responsive(1, 1, 3)}
              flex={responsive("unset", "1")}
              minW={responsive("100%", "24em")}
            >
              <Stack spacing="0.75em">
                <Box fontWeight="800" letterSpacing="0.05em" fontSize={responsive("1em", "1.125em")}>
                  聯絡資訊
                </Box>
                <Stack spacing="0.5em">
                  {contactInfo.map(({ icon, label, href, isExternal }) => (
                    <Link
                      key={label}
                      href={href}
                      isExternal={isExternal}
                      color="white"
                      _hover={{ color: "yellow.300" }}
                      display="inline-flex"
                      alignItems="center"
                      gap="0.5em"
                    >
                      <Icon as={icon} aria-hidden fontSize="1.1em" />
                      <Box as="span">{label}</Box>
                    </Link>
                  ))}
                </Stack>
              </Stack>
              <Stack spacing="0.75em">
                <Box fontWeight="800" letterSpacing="0.05em" fontSize={responsive("1em", "1.125em")}>
                  支持與服務
                </Box>
                <Stack spacing="0.5em">
                  {supportLinks.map(({ label, href, isExternal }) => {
                    const isInternal = href.startsWith("/");
                    return (
                    <Link
                      key={label}
                      href={isInternal ? undefined : href}
                      to={isInternal ? href : undefined}
                      isExternal={isExternal || !isInternal}
                      color="white"
                      _hover={{ color: "yellow.300" }}
                    >
                      {label}
                    </Link>
                    );
                  })}
                </Stack>
              </Stack>
              <Stack spacing="0.75em">
                <Box fontWeight="800" letterSpacing="0.05em" fontSize={responsive("1em", "1.125em")}>
                  關注我們
                </Box>
                <Stack spacing="0.5em">
                  {socialLinks.map(({ icon, label, href }) => (
                    <Link
                      key={label}
                      isExternal
                      href={href}
                      color="white"
                      _hover={{ color: "yellow.300" }}
                      display="inline-flex"
                      alignItems="center"
                      gap="0.5em"
                    >
                      <Icon as={icon} aria-hidden fontSize="1.1em" />
                      <Box as="span">{label}</Box>
                    </Link>
                  ))}
                </Stack>
              </Stack>
            </SimpleGrid>
          </Stack>
          <Stack
            direction={responsive("column", "row")}
            spacing={responsive("1em", "1.5em")}
            pt={responsive("2em", "2.5em")}
            mt={responsive("2em", "2.5em")}
            borderTop="1px solid"
            borderColor="whiteAlpha.400"
            fontSize={responsive("0.8em", "0.95em")}
            align={responsive("flex-start", "center")}
            justify={responsive("flex-start", "space-between")}
          >
            <Stack spacing="0.25em">
              <Box fontWeight="800">社團法人台灣重新思考環境教育協會</Box>
              <Box>公益勸募字號 衛部救字第1141363195號</Box>
            </Stack>
            <Stack
              direction={responsive("column", "row")}
              spacing={responsive("0.75em", "1.25em")}
              align={responsive("flex-start", "center")}
            >
              <Box>Design by 山葵組設計</Box>
              <Link onClick={() => setTimeout(onOpen)} as="button" color="yellow.300">
                製作說明
              </Link>
              <Box>Copyright © {new Date().getFullYear()} RE-THINK</Box>
            </Stack>
          </Stack>
        </Container>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="rgba(255,255,255,0.5)" />
        <ModalContent
          border="3px solid"
          fontSize="1em"
          rounded={responsive("1em", "1.5em")}
          maxWidth={responsive("90vw", "50em")}
        >
          <ModalHeader
            pt="2em"
            fontWeight="900"
            fontSize={responsive("1.125em", "1.25em")}
          >
            這是，最通用的回收指南。
            <br />
            也是，需要你一起共創完成的指標。
          </ModalHeader>
          <ModalCloseButton
            bg="black"
            color="white"
            width="2em"
            height="2em"
            top={responsive("1.25em", "0.75em")}
            right={responsive("1.25em", "0.75em")}
            rounded="full"
            fontSize="1em"
            _hover={{
              bg: "black",
              color: "white",
            }}
            _active={{
              bg: "black",
              color: "white",
            }}
          />
          <ModalBody lineHeight="1.75" pb="2em" textAlign="justify">
            因為台灣的回收規範，會與時俱進，也因為地區不同、後端處理設施不同，而尚未有全國統一的標準答案。所以你在《回收大百科》所看到的資訊，已經是彙整了政府公告資訊、回收顧問專業、實際處理狀況等最大的交集。雖然你還是在少數狀況，會碰到規範有差異之處（例如在社區、辦公大樓等），或者清潔隊員不收等狀況，歡迎你
            <Link.MdLink
              href="https://s.no8.io/link/channels/ysfjrgOKln"
              isExternal
            >
              回報給回收大百科團隊
            </Link.MdLink>
            ，讓我們可以持續更新內容、與政府及產業溝通和改變。邀請你參與，一起為台灣創造最完整的《回收大百科》！
            <br />
            （最終更新時間：2024 年 8 月）
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Footer;
