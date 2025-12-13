import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import { Flex as ChakraFlex, useToken } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

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

const carouselBreakpoints = {
  0: { slidesPerView: 2, spaceBetween: 12 },
  480: { slidesPerView: 3, spaceBetween: 16 },
  768: { slidesPerView: 4, spaceBetween: 20 },
  1024: { slidesPerView: 5, spaceBetween: 24 },
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
    src="../../containers/TrashPage/sponsors/familyMart.png"
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
  const [primaryColor] = useToken("colors", ["colors.yellow"]);
  const shouldLoop = isFooter && sponsor.length > 5;
  const renderLogo = (logo) => (
    <Box display="inline-block" minW="5em" {...logoProps}>
      {logo}
    </Box>
  );

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
        <Box
          flex="1"
          px={responsive("1em", "1.25em")}
          overflow="hidden"
          maxWidth="100%"
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            breakpoints={carouselBreakpoints}
            slidesPerView={2}
            spaceBetween={12}
            loop={shouldLoop}
            rewind={!shouldLoop}
            pagination={{ clickable: true, dynamicBullets: true }}
            style={{
              paddingBottom: "2.5em",
              width: "100%",
              "--swiper-theme-color": primaryColor,
              "--swiper-pagination-color": primaryColor,
            }}
          >
            {sponsor.map((logo, k) => (
              <SwiperSlide key={k}>
                <ChakraFlex
                  justifyContent="center"
                  alignItems="center"
                  h="100%"
                  minH={responsive("3.5rem", "5.5rem")}
                >
                  {renderLogo(logo)}
                </ChakraFlex>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Flex>
    </Box>
  );
};

export default Sponsor;
