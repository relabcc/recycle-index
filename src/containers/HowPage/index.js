import React from "react";
import { StaticImage } from "gatsby-plugin-image";

import Box from "../../components/Box";
import Text from "../../components/Text";
import theme, { responsive } from "../../components/ThemeProvider/theme";
import Footer from "../Footer";
import useShowHeader from "../../contexts/header/useShowHeader";
import Container from "../../components/Container";

import Factor from "./Factor";
import Change from "./Change";

const backgorundImg = [
  {
    img: (
      <StaticImage
        src="how-1.png"
        placeholder="blurred"
        alt="垃圾分類之後發生的事"
      />
    ),
    bg: "colors.yellow",
  },
  {
    title: "丟「可回收」之後發生的事",
    img: (
      <StaticImage src="how-2.png" placeholder="blurred" alt="回收處理流程" />
    ),
  },
  {
    img: (
      <StaticImage
        src="how-3.png"
        placeholder="blurred"
        alt="具有「回收價值」，才是再利用可以真實發生的關鍵"
      />
    ),
  },
  {
    Comp: Factor,
    bg: "colors.yellow",
  },
  {
    img: (
      <StaticImage src="how_4.png" placeholder="blurred" alt="回收價值定義" />
    ),
    bg: "colors.yellow",
  },
  {
    Comp: Change,
  },
];

const HowPage = () => {
  useShowHeader("colors.yellow");
  return (
    <>
      <Box>
        <Box pt={responsive(theme.headerHeight, 0)} bg="colors.yellow" />
        {backgorundImg.map(({ img, bg, title, Comp }, i) => (
          <Box bg={bg} key={i}>
            <Container>
              {title && (
                <Text
                  pl={responsive("5%", "10%")}
                  pt={responsive("1em", "5rem")}
                  fontWeight="black"
                  fontSize={responsive("1.5em", "2em")}
                >
                  {title}
                </Text>
              )}
              {Comp ? <Comp /> : img}
            </Container>
          </Box>
        ))}
      </Box>
      <Footer />
    </>
  );
};

export default HowPage;
