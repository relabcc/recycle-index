import React from "react";
import { Stack } from "@chakra-ui/react";

import Box from "../../components/Box";
import { responsive } from "../../components/ThemeProvider/theme";

const Newsletter = () => {
  return (
    <Stack spacing="0.75em">
      <Box
        fontSize={responsive("1em", "1em")}
        color="#7e7e7e"
        fontWeight="normal"
      >
        訂閱電子報
      </Box>
      <Box
        as="form"
        action="https://api-backend.app.newsleopard.com/api/contacts/subscribe/4028a4cd948d5b650194d517b3da1a2e/verify"
        method="POST"
        target="popupwindow"
        onSubmit={() => {
          if (
            typeof window !== "undefined" &&
            window.nl_1554802646254
          ) {
            return window.nl_1554802646254.subscribe();
          }
          return true;
        }}
        id="sub-form"
        display="flex"
        flexDirection="column"
        width="100%"
      >
        <Stack spacing="0.625em">
          <Box
            as="input"
            type="text"
            id="sub-name"
            name="name"
            placeholder="輸入您的姓名"
            required
            padding="10px"
            fontSize="14px"
            border="1px solid"
            borderColor="#cccccc"
            borderRadius="10px"
            fontWeight="500"
            width="100%"
            bg="#FFFFFF"
            color="#666666"
            transition="border-color 0.3s"
            _placeholder={{ color: "#999999" }}
            _focus={{ borderColor: "#FFD000", outline: "none" }}
          />
          <Box
            as="input"
            type="email"
            id="sub-mail"
            name="email"
            placeholder="輸入您的電子郵件"
            required
            padding="10px"
            fontSize="14px"
            border="1px solid"
            borderColor="#cccccc"
            borderRadius="10px"
            fontWeight="500"
            width="100%"
            bg="#FFFFFF"
            color="#666666"
            transition="border-color 0.3s"
            _placeholder={{ color: "#999999" }}
            _focus={{ borderColor: "#FFD000", outline: "none" }}
          />
          <Box
            as="button"
            id="sub-submit"
            type="submit"
            padding="10px"
            fontSize="14px"
            color="#000000"
            bg="#FFD000"
            border="none"
            borderRadius="10px"
            cursor="pointer"
            fontWeight="700"
            width="100%"
            transition="all 0.3s"
            _hover={{ bg: "#FFCC00", color: "#FFFFFF" }}
          >
            立即訂閱
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};

export default Newsletter;
