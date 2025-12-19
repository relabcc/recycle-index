import React, { useState } from "react";
import { Flex, Stack, SimpleGrid, Icon, Input, Image } from "@chakra-ui/react";
import { FiFacebook, FiInstagram, FiYoutube } from "react-icons/fi";
import { SiThreads, SiLine } from "react-icons/si";

import Box from "../components/Box";
import Container from "../components/Container";
import Link from "../components/Link";
import Button from "../components/Button";
import Sponsor from "../components/Sponsor";
import { responsive } from "../components/ThemeProvider/theme";

const Footer = ({ isAbout, isTrash, noSep, noSponsor, ...props }) => {
  const [subscribeName, setSubscribeName] = useState("");
  const [subscribeEmail, setSubscribeEmail] = useState("");

  const socialLinks = [
    {
      icon: FiFacebook,
      label: "Facebook",
      href: "https://rethinktw.cc/ExwKe",
      bg: "#0765FE",
    },
    {
      icon: FiInstagram,
      label: "Instagram",
      href: "https://rethinktw.cc/UmAAR",
      bg: "#53beee",
    },
    {
      icon: SiThreads,
      label: "Threads",
      href: "https://rethinktw.cc/sgI0b",
      bg: "#2a2a2a",
    },
    {
      icon: FiYoutube,
      label: "Youtube",
      href: "https://rethinktw.cc/AxMUh",
      bg: "red",
    },
    {
      icon: SiLine,
      label: "Line",
      href: "https://rethinktw.cc/fNvVc",
      bg: "#00c300",
    },
  ];

  const websiteLinks = [
    { label: "關於我們", href: "https://rethinktw.cc/a8fyy", isExternal: true },
    {
      label: "必懂的回收知識",
      href: "https://rethinktw.cc/ZL2W5",
      isExternal: true,
    },
    { label: "課程申請", href: "https://rethinktw.cc/0PDKE", isExternal: true },
    { label: "企業合作", href: "https://rethinktw.cc/vweYW", isExternal: true },
    {
      label: "RE-THINK官網",
      href: "https://rethinktw.cc/BkzgJ",
      isExternal: true,
    },
    { label: "海廢圖鑑", href: "https://rethinktw.cc/kRoiM", isExternal: true },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    // 实现订阅逻辑
    console.log("Subscribe:", subscribeName, subscribeEmail);
  };

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

      {/* Footer Main */}
      <Box bg="black" color="white" pt={responsive("3.75em", "3.75em")}>
        <Container fontSize={responsive("0.875em", "1em")}>
          {/* Top Section: Logo + Office Info + Social Media */}
          <Stack
            spacing={responsive("1.25em", "1.25em")}
            align="center"
            textAlign="center"
            mb={responsive("2.5em", "2.5em")}
          >
            {/* RE-THINK Logo */}
            <Box>
              <Image
                src="https://recycle.rethinktw.org/test_blog/wp-content/uploads/2025/12/02_version_White-1024x162.png"
                alt="RE-THINK"
                width={responsive("160px", "160px")}
                display="inline-block"
              />
            </Box>

            {/* Office Info Title */}
            <Box
              fontSize={responsive("1em", "1em")}
              color="#7e7e7e"
              fontWeight="normal"
            >
              辦公室資訊
            </Box>

            {/* Contact Details */}
            <Stack
              spacing="0.35em"
              fontSize={responsive("0.875em", "0.875em")}
              lineHeight="1.6"
            >
              <Box>電話 : 02-27061837</Box>
              <Box>地址 : 100台北市中正區羅斯福路二段9號8樓之三</Box>
              <Box>信箱：service@rethinktw.org</Box>
            </Stack>

            {/* Social Media Icons */}
            <Flex gap="0.75em" pt="0.5em">
              {socialLinks.map(({ icon, label, href, bg }) => (
                <Link
                  key={label}
                  href={href}
                  isExternal
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  w="32px"
                  h="32px"
                  bg={bg}
                  borderRadius="6px"
                  _hover={{ opacity: 0.8 }}
                  transition="opacity 0.2s"
                >
                  <Icon as={icon} fontSize="18px" color="white" />
                </Link>
              ))}
            </Flex>
          </Stack>

          {/* Middle Section: Newsletter + Links + Donation Info */}
          <SimpleGrid
            columns={responsive(1, 1, 3)}
            spacing={responsive("2.5em", "2.5em")}
            pt={responsive("2.5em", "2.5em")}
            pb={responsive("2.5em", "2.5em")}
            alignItems="start"
          >
            {/* Newsletter */}
            <Stack spacing="0.75em">
              <Box
                fontSize={responsive("1em", "1em")}
                color="#7e7e7e"
                fontWeight="normal"
              >
                訂閱電子報
              </Box>
              <Box as="form" onSubmit={handleSubscribe}>
                <Stack spacing="0.625em">
                  <Input
                    type="text"
                    placeholder="輸入您的姓名"
                    value={subscribeName}
                    onChange={(e) => setSubscribeName(e.target.value)}
                    required
                    bg="white"
                    color="black"
                    borderColor="white"
                    _placeholder={{ color: "gray.500" }}
                    _hover={{ borderColor: "gray.300" }}
                    fontSize="0.875em"
                    height="2.5em"
                  />
                  <Input
                    type="email"
                    placeholder="輸入您的電子郵件"
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    required
                    bg="white"
                    color="black"
                    borderColor="white"
                    _placeholder={{ color: "gray.500" }}
                    _hover={{ borderColor: "gray.300" }}
                    fontSize="0.875em"
                    height="2.5em"
                  />
                  <Button
                    type="submit"
                    bg="yellow.400"
                    color="black"
                    _hover={{ bg: "yellow.300" }}
                    width="100%"
                    fontSize="0.875em"
                    height="2.5em"
                    fontWeight="700"
                  >
                    立即訂閱
                  </Button>
                </Stack>
              </Box>
            </Stack>

            {/* Website Links */}
            <Stack spacing="0.75em">
              <Box
                fontSize={responsive("1em", "1em")}
                color="#7e7e7e"
                fontWeight="normal"
              >
                網站連結
              </Box>
              <SimpleGrid columns={2} spacing="0.5em" pt="0.25em">
                {websiteLinks.map(({ label, href, isExternal }) => (
                  <Link
                    key={label}
                    href={href}
                    isExternal={isExternal}
                    color="white"
                    fontSize="0.875em"
                    _hover={{ opacity: 0.8 }}
                  >
                    {label}
                  </Link>
                ))}
              </SimpleGrid>
            </Stack>

            {/* Donation Info */}
            <Stack spacing="0.75em">
              <Box
                fontSize={responsive("1em", "1em")}
                color="#7e7e7e"
                fontWeight="normal"
              >
                立案捐款資訊
              </Box>
              <Stack spacing="0.5em" fontSize="0.875em" lineHeight="1.6">
                <Box>
                  立案字號 台內團字第1050089249號函
                  <br />
                  公益勸募字號 衛部救字第1141361743號
                </Box>
                <Box pt="0.5em">
                  銀行、帳戶匯款：
                  <br />
                  戶　　名：社團法人重新思考環境教育協會
                  <br />
                  銀行代號：013 國泰世華銀行
                  <br />
                  分　　行：南京東路分行
                  <br />
                  帳　　號：003-03-500953-1
                </Box>
              </Stack>
            </Stack>
          </SimpleGrid>

          {/* Bottom Section: Slogan + Logo */}
          <Box
            bg="#111"
            mx={responsive("-20px", "-20px")}
            px={responsive("20px", "20px")}
            py={responsive("1.25em", "1.25em")}
            mt={responsive("2.5em", "2.5em")}
          >
            <Flex
              direction={responsive("column", "row")}
              justify="space-between"
              align={responsive("center", "flex-end")}
              gap={responsive("1.25em", "0")}
            >
              <Box
                fontSize={responsive("1.5em", "1.5em")}
                fontWeight="700"
                lineHeight="1.4"
                color="yellow.400"
                textAlign={responsive("center", "left")}
              >
                讓環保行動
                <br />
                成為你我日常
              </Box>
              <Image
                src="https://recycle.rethinktw.org/test_blog/wp-content/uploads/2025/12/1ftp_EnvironmentalPartner_Horizontal_White-1-1024x429.png"
                alt="1% for the planet"
                width={responsive("120px", "160px")}
              />
            </Flex>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
