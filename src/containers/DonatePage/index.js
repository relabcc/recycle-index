import React, { useMemo, useState } from "react";
import Box from "../../components/Box";
import Container from "../../components/Container";
import Flex from "../../components/Flex";
import { responsive } from "../../components/ThemeProvider/theme";
import useShowHeader from "../../contexts/header/useShowHeader";
import Footer from "../Footer";
import DonationPanel, { donationModes, donationOptions } from "./DonationPanel";
import DesktopText from "./DesktopText";
import MobileText from "./MobileText";
import desktopBg from "./donate-desktop.png";
import mobileBg from "./donate-mobile.png";
import { useTheme } from "@chakra-ui/react";

const HERO_BG = "#69d7e2";
const DESKTOP_BG_RATIO = "1920 / 936";

const HERO_CONTENT = {
  desktop: {
    title: ["每筆捐款都讓臺灣成為", "對環境更友善的島嶼"],
    description: [
      "我們是 RE-THINK 重新思考，台灣最創新、社群",
      "力最強的環保團體，支持我們號召淨灘活動、推動",
      "生活化環境教育，讓環保行動成為你我日常！",
    ],
  },
  mobile: {
    title: ["每筆捐款都讓", "臺灣成為對環境", "更友善的島嶼"],
    description: [
      "我們是 RE-THINK 重新思考，台灣",
      "最創新、社群力最強的環保團體，支",
      "持我們號召淨灘活動、推動生活化環",
      "境教育，讓環保行動成為你我日常！",
    ],
  },
};

const MobileHero = ({ mode, setMode, options }) => {
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
      </Box>
      <Container position="relative" zIndex="1">
        <DonationPanel
          mode={mode}
          setMode={setMode}
          options={options}
          layout="mobile"
        />
      </Container>
      <Box mt="-20%" as="img" src={mobileBg} alt="" aria-hidden="true" width="100%" />
    </Box>
  );
};

const DesktopHero = ({ mode, setMode, options }) => (
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
        <Box position="absolute" top="12%" right="13%">
          <DonationPanel
            mode={mode}
            setMode={setMode}
            options={options}
            layout="desktop"
          />
        </Box>
      </Box>
    </Container>
  </Box>
);

const DonatePage = () => {
  useShowHeader("colors.yellow");
  const [mode, setMode] = useState(donationModes[0].id);
  const options = useMemo(() => donationOptions[mode], [mode]);

  return (
    <>
      <MobileHero mode={mode} setMode={setMode} options={options} />
      <DesktopHero mode={mode} setMode={setMode} options={options} />
      <Footer />
    </>
  );
};

export default DonatePage;
