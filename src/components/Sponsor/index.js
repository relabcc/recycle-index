import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import { Grid, GridItem } from "@chakra-ui/react";

import Box from "../Box";
import Flex from "../Flex";
import { responsive } from "../ThemeProvider/theme";

const ratio = 363 / 210;

const logoProps = {
  placeholder: "tracedSVG",
  objectFit: "contain",
  transformOptions: { fit: "contain" },
  backgroundColor: "transparent",
};

const sponsor = [
  <StaticImage src="rc.svg" alt="RC文化基金會" placeholder="tracedSVG" />,
  <StaticImage src="foodpanda.svg" alt="Foodpanda" placeholder="tracedSVG" />,
  <StaticImage src="citi.svg" alt="花旗銀行" placeholder="tracedSVG" />,
  <StaticImage
    alt="Nespresso"
    src="../../containers/TrashPage/sponsors/Nespresso.svg"
    aspectRatio={ratio}
    {...logoProps}
  />,
  <StaticImage
    alt="犀牛盾"
    src="../../containers/TrashPage/sponsors/rhino.svg"
    aspectRatio={ratio}
    {...logoProps}
  />,
  <StaticImage
    alt="雀巢"
    src="../../containers/TrashPage/sponsors/nestle.png"
    aspectRatio={1}
    {...logoProps}
  />,
  <StaticImage
    alt="Boehringer"
    src="../../containers/TrashPage/sponsors/Boehringer.png"
    aspectRatio={1}
    {...logoProps}
  />,
  <StaticImage
    alt="eneloop"
    src="../../containers/TrashPage/sponsors/eneloop.jpg"
    aspectRatio={1}
    {...logoProps}
  />,
  <StaticImage
    alt="Family Mart"
    src="familymart.svg"
    aspectRatio={ratio}
    {...logoProps}
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
          whiteSpace="nowrap"
          flexShrink="0"
        >
          贊助單位
        </Box>
        <Grid
          flex="1"
          px={responsive("1em", "1.25em")}
          alignItems="center"
          gap={responsive("1em", "1.25em")}
          templateColumns={{
            base: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            lg: "repeat(5, 1fr)",
          }}
        >
          {sponsor.map((logo, k) => (
            <GridItem key={k} textAlign="center">
              <Box display="inline-block" minW="5em" {...logoProps}>
                {logo}
              </Box>
            </GridItem>
          ))}
        </Grid>
      </Flex>
    </Box>
  );
};

export default Sponsor;
