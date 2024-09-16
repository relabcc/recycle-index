import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { StaticImage } from "gatsby-plugin-image";
import React from "react";
import BackgroundImage from "../../components/BackgroundImage";
import Container from "../../components/Container";
import { responsive } from "../../components/ThemeProvider/theme";

const links = {
  Nespresso: "https://www.nespresso.com/tw/zh/home",
  foodpanda: "https://www.foodpanda.com.tw/",
  犀牛盾: "https://shop.rhinoshield.tw/sustainability/recycling",
};

const logos = {
  Nespresso: (
    <BackgroundImage
      src={require("./sponsors/Nespresso.svg").default}
      ratio={231 / 66}
    />
  ),
  foodpanda: (
    <BackgroundImage
      src={require("./sponsors/foodpanda.svg").default}
      ratio={400 / 120}
    />
  ),
  犀牛盾: (
    <BackgroundImage
      src={require("./sponsors/rhino.svg").default}
      ratio={1575 / 169}
    />
  ),
  百靈佳殷格翰: (
    <BackgroundImage
      src={require("./sponsors/Boehringer_Logo.jpg").default}
      ratio={1000 / 303}
    />
  ),
  雀巢: (
    <BackgroundImage
      src={require("./sponsors/nestle.png").default}
      ratio={1}
    />
  ),
};

const SponsorNote = ({ sponsor }) => {
  return (
    <>
      <Container py="2em" mb="1em">
        <Box borderBottom="1px solid black">
          <Flex mt={responsive("0.5em", "0.25em")}>
            <Box width="1.75em" mr="0.5em">
              <StaticImage alt="錢幣" src="coin.svg" />
            </Box>
            <Text
              fontSize={responsive("1.25em", "1.25em")}
              fontWeight="900"
              letterSpacing="0.125em"
            >
              贊助單位
            </Text>
          </Flex>
          <Flex
            flexDirection={responsive("column", "row")}
            justifyContent="space-between"
            alignItems={responsive("auto", "center")}
            py="0.5em"
            pl="2em"
          >
            <Text fontSize={responsive("1.25em", "1.5em")}>
              本回收品項頁面由 {sponsor} 贊助，支持 RE-THINK 推動回收教育
            </Text>
            <Box flex="1" px="4" py="2">
              <Link href={links[sponsor]} isExternal>
                <Box width="15em" ml="auto">
                  {logos[sponsor]}
                </Box>
              </Link>
            </Box>
          </Flex>
        </Box>
      </Container>
    </>
  );
};

export default SponsorNote;
