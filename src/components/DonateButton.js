import { Box, Image, Link } from "@chakra-ui/react";
import { responsive } from "./ThemeProvider/theme";
import { DONATE_URL } from "../constants/links";

const DonateButton = () => {
  return (
    <Box display={responsive('none', 'block')} pos="fixed" right="0" bottom="24px" zIndex={99}>
      <Link href={DONATE_URL} isExternal>
        <Image src="/donate.svg" alt="捐款支持" w="92px" />
      </Link>
    </Box>
  );
};

export default DonateButton;
