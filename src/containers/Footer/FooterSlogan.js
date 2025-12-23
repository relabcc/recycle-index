import React from "react";
import { Flex } from "@chakra-ui/react";
import { StaticImage } from "gatsby-plugin-image";

import Box from "../../components/Box";
import Container from "../../components/Container";
import { responsive } from "../../components/ThemeProvider/theme";

const FooterSlogan = () => {
  return (
    <Box bg="#111" py={responsive("1.25em", "1.25em")} mt={responsive("2.5em", "2.5em")}>
      <Container>
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
          <Box width={responsive("120px", "160px")} display="inline-block">
            <StaticImage
              src="../1_for_the_planet.png"
              alt="1% for the planet"
              placeholder="none"
              style={{ width: "100%", height: "auto" }}
            />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default FooterSlogan;
