import React from "react";
import Box from "../../components/Box";
import Container from "../../components/Container";
import { responsive } from "../../components/ThemeProvider/theme";
import DonationPanel from "./DonationPanel";
import DesktopText from "./DesktopText";
import MobileText from "./MobileText";
import desktopBg from "./donate-desktop.png";
import mobileBg from "./donate-mobile.png";
import { useTheme } from "@chakra-ui/react";

import { StaticImage } from "gatsby-plugin-image";

const HERO_BG = "#69d7e2";
const DESKTOP_BG_RATIO = "1920 / 936";

const HERO_CONTENT = {
  desktop: {
    title: ["每筆捐款都讓回收教育", "走進更多台灣人的生活"],
    description: [
      "您的捐款將支持 RE-THINK 重新思考投入製作",
      "更多生活化的回收教育，讓每次回收，",
      "都能真正發揮價值！",
    ],
  },
  mobile: {
    title: ["每筆捐款都讓", "回收教育走進", "更多台灣人的生活"],
    description: [
      "您的捐款將支持 RE-THINK",
      "重新思考投入製作更多生活化",
      "的回收教育，讓每次回收，",
      "都能真正發揮價值！",
    ],
  },
};

const MobileHero = () => {
  const theme = useTheme();
  const headerHeight = theme.headerHeight;

  return (
    <Box
      display={responsive("block", "none")}
      bg={HERO_BG}
      pt={headerHeight}
      position="relative"
      overflow="hidden"
    >
      <Box pb="1.5em">
        <MobileText
          title={HERO_CONTENT.mobile.title}
          description={HERO_CONTENT.mobile.description}
        />
        <Box
          position="absolute"
          right="5%"
          top="13%"
          width="20%"
          pointerEvents="none"
        >
          <StaticImage src="./cup-mobile.png" alt="" />
        </Box>
      </Box>
      <Container position="relative" zIndex="1">
        <DonationPanel layout="mobile" />
      </Container>
      <Box
        mt="-20%"
        as="img"
        src={mobileBg}
        alt=""
        aria-hidden="true"
        width="100%"
      />
    </Box>
  );
};

const DesktopHero = () => (
  <Box display={responsive("none", "block")} bg={HERO_BG} py="3.5em">
    <Container>
      <Box
        position="relative"
        overflow="hidden"
        backgroundImage={`url(${desktopBg})`}
        backgroundRepeat="no-repeat"
        backgroundSize="100% 100%"
        backgroundPosition="center"
        aspectRatio={DESKTOP_BG_RATIO}
        display="flex"
        alignItems="center"
        style={{
          aspectRatio: DESKTOP_BG_RATIO,
        }}
      >
        <Box left="0" top="10%" w="45%" position="absolute">
          <DesktopText
            title={HERO_CONTENT.desktop.title}
            description={HERO_CONTENT.desktop.description}
          />
        </Box>
        <Box
          position="absolute"
          left="37.5%"
          top="11.5%"
          width="7%"
          zIndex="2"
          pointerEvents="none"
        >
          <StaticImage src="./cup-desktop.png" alt="" />
        </Box>
        <Box position="absolute" top="12%" right="13%">
          <DonationPanel layout="desktop" />
        </Box>
      </Box>
    </Container>
  </Box>
);

const DonatePage = () => {
  return (
    <>
      <MobileHero />
      <DesktopHero />
    </>
  );
};

export default DonatePage;
