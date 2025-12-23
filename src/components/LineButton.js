import { Box, Image, Link } from "@chakra-ui/react";
import { responsive } from "./ThemeProvider/theme";

const LineButton = () => {
  return (
    <Box pos="fixed" right={3} bottom={responsive(4, '9em')} zIndex={99}>
      <Link href="https://s.no8.io/link/channels/ysfjrgOKln" isExternal>
        <Image src="/line.svg" alt="LINE" w="4em" h="4em" />
      </Link>
    </Box>
  );
};

export default LineButton;
