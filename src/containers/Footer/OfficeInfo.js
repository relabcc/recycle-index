import React from "react";
import { Stack } from "@chakra-ui/react";

import Box from "../../components/Box";
import { responsive } from "../../components/ThemeProvider/theme";

const OfficeInfo = () => {
  return (
    <>
      {/* Office Info Title */}
      <Box
        fontSize={responsive("1em", "1em")}
        color="#7e7e7e"
        fontWeight="normal"
      >
        辦公室資訊
      </Box>

      {/* Contact Details */}
      <Stack
        spacing="0.35em"
        fontSize={responsive("0.875em", "0.875em")}
        lineHeight="1.6"
      >
        <Box>電話 : 02-27061837</Box>
        <Box>地址 : 100台北市中正區羅斯福路二段9號8樓之三</Box>
        <Box>信箱：service@rethinktw.org</Box>
      </Stack>
    </>
  );
};

export default OfficeInfo;
