import React from "react";
import {
  Flex,
  Stack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import Box from "../components/Box";
import Container from "../components/Container";
import Link from "../components/Link";
import Sponsor from "../components/Sponsor";
import { responsive } from "../components/ThemeProvider/theme";

const Footer = ({ isAbout, isTrash, noSep, noSponsor, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box bg="white" {...props}>
      {!isAbout && !noSponsor && (
        <Container>
          <Sponsor
            isFooter
            textColor="black"
            borderTop={!noSep && "1px solid"}
            px="0"
            fontSize={responsive("0.75em", "1.375em")}
            logoProps={{
              width: responsive(1 / 3, "10em"),
            }}
          />
        </Container>
      )}
      <Container py="1em" fontSize={responsive("0.75em", "0.625em")}>
        <Box textAlign="center" fontSize={responsive("1em", "1.5em")}>
          <Stack
            isInline
            spacing={responsive("0.5em", "1.5em")}
            justifyContent="center"
          >
            <Link isExternal href="https://www.facebook.com/rethink.tw">
              RE-THINK FB
            </Link>
            <Box borderLeft="1px solid black" />
            <Link isExternal href="https://rethinktw.org/">
              RE-THINK 官網
            </Link>
            <Box borderLeft="1px solid black" />
            <Link isExternal href="https://renato-lab.com/">
              REnato lab 官網
            </Link>
            <Box borderLeft="1px solid black" />
            <Link isExternal href="https://relab.cc/">
              RE:LAB 官網
            </Link>
          </Stack>
          <Flex justifyContent="center" py="1em">
            <Box fontWeight="300">
              Copyright © {new Date().getFullYear()} 回收大百科團隊
            </Box>
            <Box
              borderLeft="1px solid black"
              mx={responsive("0.5em", "0.75em")}
            />
            <Link onClick={() => setTimeout(onOpen)} as="button">
              製作說明
            </Link>
          </Flex>
        </Box>
      </Container>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="rgba(255,255,255,0.5)" />
        <ModalContent
          border="3px solid"
          fontSize="1em"
          rounded={responsive("1em", "1.5em")}
          maxWidth={responsive("90vw", "50em")}
        >
          <ModalHeader
            pt="2em"
            fontWeight="900"
            fontSize={responsive("1.125em", "1.25em")}
          >
            這是，最通用的回收指南。
            <br />
            也是，需要你一起共創完成的指標。
          </ModalHeader>
          <ModalCloseButton
            bg="black"
            color="white"
            width="2em"
            height="2em"
            top={responsive("1.25em", "0.75em")}
            right={responsive("1.25em", "0.75em")}
            rounded="full"
            fontSize="1em"
            _hover={{
              bg: "black",
              color: "white",
            }}
            _active={{
              bg: "black",
              color: "white",
            }}
          />
          <ModalBody lineHeight="1.75" pb="2em" textAlign="justify">
            因為台灣的回收規範，會與時俱進，也因為地區不同、後端處理設施不同，而尚未有全國統一的標準答案。所以你在《回收大百科》所看到的資訊，已經是彙整了政府公告資訊、回收顧問專業、實際處理狀況等最大的交集。雖然你還是在少數狀況，會碰到規範有差異之處（例如在社區、辦公大樓等），或者清潔隊員不收等狀況，歡迎你
            <Link.MdLink
              href="https://s.no8.io/link/channels/ysfjrgOKln"
              isExternal
            >
              回報給回收大百科團隊
            </Link.MdLink>
            ，讓我們可以持續更新內容、與政府及產業溝通和改變。邀請你參與，一起為台灣創造最完整的《回收大百科》！
            <br />
            （最終更新時間：2024 年 8 月）
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Footer;
