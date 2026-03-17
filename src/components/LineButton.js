import { Box, Image, Link } from "@chakra-ui/react";
import { responsive } from "./ThemeProvider/theme";

const LineButton = () => {
  const size = responsive("3em", "4em");
  return (
    <Box pos="fixed" right={3} bottom={responsive(4, '8em')} zIndex={99}>
      <Link href="https://s.no8.io/link/channels/ysfjrgOKln" isExternal>
        <Image src="/line.svg" alt="LINE" w={size} h={size} />
      </Link>
    </Box>
  );
};

export default LineButton;
