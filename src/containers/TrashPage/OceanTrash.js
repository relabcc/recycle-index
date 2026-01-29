import React, { useState } from "react";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { AspectRatio, useMediaQuery } from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";
import Box from "../../components/Box";
import Text from "../../components/Text";
import oceanBaseSvg from "./ocean-base.svg";
import { responsive } from "../../components/ThemeProvider/theme";

const swing = keyframes`
  20% {
    transform: rotate(15deg);
  }
  40% {
    transform: rotate(-10deg);
  }
  60% {
    transform: rotate(5deg);
  }
  80% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(0deg);
  }
`;

const OceanTrash = ({ data, color }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile] = useMediaQuery("(max-width: 767px)");

  if (!data) {
    return null;
  }

  const image = data.gatsbyImg?.large ? getImage(data.gatsbyImg.large) : null;

  if (!image) {
    return null;
  }

  const handleClick = () => {
    if (data.url) {
      window.open(data.url, "_blank");
    }
  };

  return (
    <Box
      as="button"
      onClick={handleClick}
      cursor={data.url ? "pointer" : "default"}
      border="none"
      bg="transparent"
      p={0}
      width="100%"
      textAlign="right"
      position="relative"
      color={color}
      transform={responsive(null, "translateY(-50%)")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AspectRatio ratio={320 / 116} width={responsive("15em", "21em")}>
        <Box
          backgroundImage={`url(${oceanBaseSvg})`}
          backgroundSize="contain"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          display="flex"
          alignItems="center"
          position="relative"
          pr={responsive("1.75em", "2.5em")}
          pl={responsive("5em", "6.5em")}
        >
          {image && (
            <Box
              position="absolute"
              left={responsive("2.5em", "3.5em")}
              top="50%"
              width={responsive("7em", "9em")}
              height={responsive("7em", "9em")}
              overflow="visible"
              transform="translate(-50%, -50%)"
            >
              <Box
                width="100%"
                height="100%"
                overflow="hidden"
                css={
                  (isMobile || isHovered) &&
                  css`
                    animation: ${swing} 0.6s ease-in-out infinite;
                    transform-origin: center;
                  `
                }
              >
                <GatsbyImage
                  image={image}
                  alt={data.name}
                  style={{ width: "100%", height: "100%" }}
                />
              </Box>
            </Box>
          )}
          <Text
            fontWeight="400"
            lineHeight="1.2"
            letterSpacing="0.1em"
            fontSize={responsive("1.125em", "1.625em")}
            mt="-0.2em"
          >
            了解丟錯垃圾的入海之路
          </Text>
          <Box
            as="svg"
            xmlns="http://www.w3.org/2000/svg"
            width={responsive("9.5em", "13em")}
            viewBox="0 0 178.53 13.73"
            position="absolute"
            right={responsive("0.5em", "1em")}
            bottom={responsive("1.25em", "1.75em")}
            display="block"
            color="inherit"
          >
            <polyline
              points="163.21 0.73 176 12.73 0 12.73"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </Box>
        </Box>
      </AspectRatio>
    </Box>
  );
};

export default OceanTrash;
