import React from "react";
import { Flex, Image } from "@chakra-ui/react";

import Box from "../../components/Box";
import { responsive } from "../../components/ThemeProvider/theme";

const FooterSlogan = () => {
  return (
    <Box
      bg="#111"
      mx={responsive("-20px", "-20px")}
      px={responsive("20px", "20px")}
      py={responsive("1.25em", "1.25em")}
      mt={responsive("2.5em", "2.5em")}
    >
      <Flex
        direction={responsive("column", "row")}
        justify="space-between"
        align={responsive("center", "flex-end")}
        gap={responsive("1.25em", "0")}
      >
        <Box
          fontSize={responsive("1.5em", "1.5em")}
          fontWeight="700"
          lineHeight="1.4"
          color="yellow.400"
          textAlign={responsive("center", "left")}
        >
          讓環保行動
          <br />
          成為你我日常
        </Box>
        <Image
          src="https://recycle.rethinktw.org/test_blog/wp-content/uploads/2025/12/1ftp_EnvironmentalPartner_Horizontal_White-1-1024x429.png"
          alt="1% for the planet"
          width={responsive("120px", "160px")}
        />
      </Flex>
    </Box>
  );
};

export default FooterSlogan;
