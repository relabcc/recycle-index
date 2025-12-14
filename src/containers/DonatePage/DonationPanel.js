import React from "react";
import Box from "../../components/Box";
import Button from "../../components/Button";
import Flex from "../../components/Flex";
import { responsive } from "../../components/ThemeProvider/theme";
import { Stack } from "@chakra-ui/react";

const DONATION_URL =
  "https://rethinktw.neticrm.tw/civicrm/contribute/transact?reset=1&id=26";

export const donationModes = [
  { id: "monthly", label: "每月定額", prefix: "每月贊助" },
  { id: "once", label: "單筆捐款", prefix: "單筆贊助" },
];

export const donationOptions = {
  monthly: [666, 1000, 3000, null],
  once: [666, 1000, 3000, null],
};

const donationModeMap = donationModes.reduce((acc, mode) => {
  acc[mode.id] = mode;
  return acc;
}, {});

const getDonationLabel = (mode, amount) => {
  if (!amount) return "其他金額贊助";
  const prefix = donationModeMap[mode]?.prefix || "";
  return `${prefix} ${amount.toLocaleString()} 元`;
};

const getDonationLink = (amount) =>
  `${DONATION_URL}${amount ? `&amount=${amount}` : ""}`;

const TabButton = ({ active, isFirst, isLast, children, ...props }) => (
  <Box
    as="button"
    type="button"
    cursor="pointer"
    flex="1"
    bg={active ? "colors.yellow" : "white"}
    color="black"
    border="2px solid black"
    borderRight={isLast ? "2px solid black" : "0"}
    fontWeight="700"
    letterSpacing="0.15em"
    fontSize="1em"
    px={responsive("0.75em", "1.5em")}
    py="0.65em"
    textAlign="center"
    transition="all 0.2s ease"
    borderLeftRadius={isFirst ? "0.5em" : "0"}
    borderRightRadius={isLast ? "0.5em" : "0"}
    aria-pressed={active}
    _hover={{ bg: active ? "colors.yellow" : "yellow.50" }}
    {...props}
  >
    {children}
  </Box>
);

const OptionButton = ({ href, children }) => (
  <Button
    href={href}
    isExternal
    bg="white"
    color="black"
    height="auto"
    rounded="1em"
    border="2px solid transparent"
    fontWeight="700"
    letterSpacing="0.08em"
    fontSize="1em"
    py="0.75em"
    px={responsive("2em", "2.5em")}
    width="100%"
    justifyContent="center"
    boxShadow="0 0 0 #000"
    transition="all 0.2s ease"
    _hover={{
      borderColor: "black",
      textDecoration: "none",
      boxShadow: "0 2px 0 #000",
    }}
  >
    {children}
  </Button>
);

const DonationPanel = ({ mode, setMode, options, layout }) => (
  <Box flex={layout === "desktop" ? "0 0 24em" : "unset"} width="100%">
    <Flex>
      {donationModes.map(({ id, label }, index) => (
        <TabButton
          key={id}
          active={mode === id}
          onClick={() => setMode(id)}
          isFirst={index === 0}
          isLast={index === donationModes.length - 1}
        >
          {label}
        </TabButton>
      ))}
    </Flex>
    <Stack
      mt="1em"
      p="1.5em"
      bg="colors.yellow"
      spacing="0.5em"
      border="2px solid black"
      borderRadius="1em"
    >
      {options.map((amount, index) => (
        <OptionButton
          key={`${mode}-${amount ?? index}`}
          href={getDonationLink(amount)}
        >
          {getDonationLabel(mode, amount)}
        </OptionButton>
      ))}
    </Stack>
  </Box>
);

export default DonationPanel;
