import React from "react";

import Container from "../../components/Container";
import Box from "../../components/Box";
import Heading from "../../components/Heading";
import Text from "../../components/Text";
import { responsive } from "../../components/ThemeProvider/theme";
import useResponsive from "../../contexts/mediaQuery/useResponsive";

const LastPage = ({ isEn }) => {
  const { isMobile } = useResponsive();
  return (
    <Container textAlign="center" color="black" height="100%">
      <Box.Relative height="100%">
        <Box.Absolute bottom={responsive("5em", "8em")} left="0" right="0">
          <Heading
            letterSpacing="0.125em"
            fontWeight="900"
            fontSize={
              isEn ? responsive("1em", "2em") : responsive("1.5em", "2.5em")
            }
            whiteSpace="pre-wrap"
            lineHeight="1.75"
          >
            {isEn
              ? `"Where there's a lost trash, ${
                  isMobile ? "\n" : ""
                }there's a mis-thrown guy"`
              : `「每個迷路的垃圾，${isMobile ? "\n" : ""}都有個丟錯的主人」`}
          </Heading>
          <Text
            lineHeight="2em"
            fontSize={
              isEn
                ? responsive("0.875em", "1.375em")
                : responsive("1em", "1.625em")
            }
            letterSpacing="0.125em"
          >
            {isEn
              ? "Introducing 101+ most commonly mis-thrown trashes in Taiwan"
              : "以下是台灣人最常丟錯的101+垃圾"}
          </Text>
        </Box.Absolute>
      </Box.Relative>
    </Container>
  );
};

export default LastPage;
