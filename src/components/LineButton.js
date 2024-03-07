import React from "react";
import { Box, Image, Link } from "@chakra-ui/react";

const LineButton = () => {
  return (
    <Box pos="fixed" right={4} bottom={4}>
      <Link href="https://s.no8.io/link/channels/ysfjrgOKln" isExternal>
        <Image src="/line.png" alt="LINE" w="45px" h="45px" />
      </Link>
    </Box>
  );
};

export default LineButton;
