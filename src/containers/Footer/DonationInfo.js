import React from "react";
import { Stack } from "@chakra-ui/react";

import Box from "../../components/Box";
import { responsive } from "../../components/ThemeProvider/theme";

const DonationInfo = () => {
  return (
    <Stack spacing="0.75em">
      <Box
        fontSize={responsive("1em", "1em")}
        color="#7e7e7e"
        fontWeight="normal"
      >
        立案捐款資訊
      </Box>
      <Stack spacing="0.5em" fontSize="0.875em" lineHeight="1.6">
        <Box>
          立案字號 台內團字第1050089249號函
          <br />
          公益勸募字號 衛部救字第1141361743號
        </Box>
        <Box pt="0.5em">
          銀行、帳戶匯款：
          <br />
          戶　　名：社團法人重新思考環境教育協會
          <br />
          銀行代號：013 國泰世華銀行
          <br />
          分　　行：南京東路分行
          <br />
          帳　　號：003-03-500953-1
        </Box>
      </Stack>
    </Stack>
  );
};

export default DonationInfo;
