import React from "react";
import { Stack, SimpleGrid } from "@chakra-ui/react";
import { StaticImage } from "gatsby-plugin-image";

import Box from "../components/Box";
import Container from "../components/Container";
import Sponsor from "../components/Sponsor";
import { responsive } from "../components/ThemeProvider/theme";

import SocialMediaLinks from "./Footer/SocialMediaLinks";
import OfficeInfo from "./Footer/OfficeInfo";
import Newsletter from "./Footer/Newsletter";
import WebsiteLinks from "./Footer/WebsiteLinks";
import DonationInfo from "./Footer/DonationInfo";
import FooterSlogan from "./Footer/FooterSlogan";

const Footer = ({ isAbout, isTrash, noSep, noSponsor, ...props }) => {
  return (
    <Box bg="white" {...props}>
      {!isAbout && !noSponsor && (
        <Container>
          <Sponsor
            isFooter
            textColor="black"
            px="0"
            fontSize={responsive("0.75em", "1.375em")}
            logoProps={{
              width: responsive(1 / 3, "10em"),
            }}
          />
        </Container>
      )}

      {/* Footer Main */}
      <Box bg="black" color="white" pt={responsive("3.75em", "3.75em")}>
        <Container fontSize={responsive("0.875em", "1em")}>
          {/* Top Section: Logo + Office Info + Social Media */}
          <Stack
            spacing={responsive("1.25em", "1.25em")}
            align="center"
            textAlign="center"
            mb={responsive("2.5em", "2.5em")}
          >
            {/* RE-THINK Logo */}
            <Box>
              <Box
                as="a"
                href="https://rethinktw.org/"
                target="_blank"
                rel="noopener noreferrer"
                width={responsive("160px", "160px")}
                display="inline-block"
              >
                <StaticImage
                  src="./logo.png"
                  alt="RE-THINK"
                  placeholder="none"
                  style={{ width: "100%", height: "auto" }}
                />
              </Box>
            </Box>

            {/* Office Info Title */}
            <OfficeInfo />

            {/* Social Media Icons */}
            <SocialMediaLinks />
          </Stack>

          {/* Middle Section: Newsletter + Links + Donation Info */}
          <SimpleGrid
            columns={responsive(1, 1, 3)}
            spacing={responsive("2.5em", "2.5em")}
            pt={responsive("2.5em", "2.5em")}
            pb={responsive("2.5em", "2.5em")}
            alignItems="start"
            px={responsive("0", "6em")}
          >
            {/* Newsletter */}
            <Newsletter />

            {/* Website Links */}
            <WebsiteLinks />

            {/* Donation Info */}
            <DonationInfo />
          </SimpleGrid>
        </Container>

        {/* Bottom Section: Slogan + Logo (full-bleed) */}
        <FooterSlogan />
      </Box>
    </Box>
  );
};

export default Footer;
