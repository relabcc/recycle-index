import React from "react";
import { StaticImage } from "gatsby-plugin-image";

import Box from "../Box";
import Flex from "../Flex";
import { responsive } from "../ThemeProvider/theme";
import LazyLoad from "../LazyLoad";

const ratio = 363 / 210;

const sponsor = [
  <StaticImage src="rc.svg" alt="RC文化基金會" placeholder="tracedSVG" />,
  <StaticImage src="foodpanda.svg" alt="Foodpanda" placeholder="tracedSVG" />,
  <StaticImage src="citi.svg" alt="花旗銀行" placeholder="tracedSVG" />,
  <StaticImage
    placeholder="tracedSVG"
    alt="Nespresso"
    src="../../containers/TrashPage/sponsors/Nespresso.svg"
    aspectRatio={ratio}
    objectFit="contain"
    transformOptions={{ fit: "contain" }}
    backgroundColor="transparent"
  />,
  <StaticImage
    placeholder="tracedSVG"
    alt="Nespresso"
    src="../../containers/TrashPage/sponsors/rhino.svg"
    aspectRatio={ratio}
    objectFit="contain"
    transformOptions={{ fit: "contain" }}
    backgroundColor="transparent"
  />,
];

const Sponsor = ({
  bg,
  textColor,
  bgColor,
  px,
  logoProps,
  fontSize,
  isFooter,
  ...props
}) => {
  return (
    <Box
      position="relative"
      py={responsive("1em", "3.125em")}
      bg={bg}
      {...props}
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg={bgColor}
        opacity="0.2"
      />
      <Flex
        flexDirection={isFooter ? "row" : "column"}
        position="relative"
        justifyContent="center"
        alignItems={isFooter && "center"}
      >
        <Box
          fontSize={fontSize || "2em"}
          color={textColor || "colors.yellow"}
          px={px || responsive("0.5em", "4.6875rem")}
          fontWeight="900"
          letterSpacing="0.125em"
          borderRight={isFooter && "2px solid"}
          pr={isFooter && responsive("0.5em", "1em")}
        >
          贊助單位
        </Box>
        <Flex
          alignItems="center"
          flex={responsive("1", "none")}
          flexWrap={isFooter && "wrap"}
        >
          {sponsor.map((logo, k) => (
            <Box
              px={responsive("1em", "1.25em")}
              key={k}
              width={1 / sponsor.length}
              minW="6em"
              {...logoProps}
            >
              {logo}
            </Box>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Sponsor;
