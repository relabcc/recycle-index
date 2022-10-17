import { Box, Flex, Text } from "@chakra-ui/react";
import { StaticImage } from "gatsby-plugin-image";
import React from "react";
import BackgroundImage from "../../components/BackgroundImage";
import Container from "../../components/Container";
import { responsive } from "../../components/ThemeProvider/theme";

const logos = {
  Nespresso: require("./sponsors/Nespresso.svg").default,
  foodpanda: require("./sponsors/foodpanda.svg").default,
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
              <BackgroundImage
                width="15em"
                src={logos[sponsor]}
                ratio={400 / 120}
                ml="auto"
              />
            </Box>
          </Flex>
        </Box>
      </Container>
    </>
  );
};

export default SponsorNote;
