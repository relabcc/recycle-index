import React, { useState, useEffect } from "react";
import useSWR from "swr";
import Box from "../../components/Box";
import Button from "../../components/Button";
import Flex from "../../components/Flex";
import { responsive } from "../../components/ThemeProvider/theme";
import { Stack } from "@chakra-ui/react";
import { getApiEndpoint } from "../../helpers/apiHelpers";

const DONATION_URL =
  "https://rethinktw.neticrm.tw/civicrm/contribute/transact?reset=1&id=26";

/**
 * Parse donation data from API response and group by category
 * Expected format from Sheet: [{ 分類: string, 金額文字: string, URL: string }]
 */
const parseDonationData = (apiData) => {
  if (!Array.isArray(apiData)) {
    return { categories: [], grouped: {} };
  }

  const grouped = {};
  const categoriesSet = new Set();

  apiData.forEach((row) => {
    const category = row.分類;
    const label = row.金額文字;
    const url = row.URL;

    if (category && label && url) {
      categoriesSet.add(category);
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push({ label, url });
    }
  });

  return {
    categories: Array.from(categoriesSet),
    grouped,
  };
};

/**
 * Fetch donation options from API
 */
const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
};

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

const OptionButton = ({ href, url, children }) => {
  const finalHref = url || href;
  return (
    <Button
      href={finalHref}
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
};

const DonationPanel = ({ layout }) => {
  const [activeCategory, setActiveCategory] = useState(null);

  // Fetch donation data using SWR with caching
  const { data: rawData, error, isLoading } = useSWR(
    getApiEndpoint("donate!A1:C"),
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
      focusThrottleInterval: 300000, // 5 minutes
    }
  );

  // Parse and group data
  const parsedData = rawData ? parseDonationData(rawData) : null;
  const categories = parsedData?.categories || [];
  const donationData = parsedData?.grouped || {};

  // Set the first category as active on first load
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const displayOptions = (donationData && activeCategory && donationData[activeCategory]) || [];

  return (
    <Box flex={layout === "desktop" ? "0 0 24em" : "unset"} width="100%">
      <Flex>
        {categories.map((category, index) => (
          <TabButton
            key={category}
            active={activeCategory === category}
            onClick={() => setActiveCategory(category)}
            isFirst={index === 0}
            isLast={index === categories.length - 1}
            disabled={isLoading || error}
          >
            {category}
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
        minHeight="120px"
        display="flex"
        justifyContent="center"
      >
        {isLoading && (
          <Box textAlign="center" py="1em" fontWeight="700" fontSize="1.1em">
            正在載入捐款選項...
          </Box>
        )}
        {!isLoading && error && (
          <Box textAlign="center" width="100%">
            <Box mb="1em" fontWeight="700" fontSize="1em">
              無法載入捐款選項
            </Box>
            <OptionButton href={DONATION_URL}>
              前往贊助
            </OptionButton>
          </Box>
        )}
        {!isLoading &&
          !error &&
          displayOptions.map((item, index) => {
            return (
              <OptionButton key={`${activeCategory}-${index}`} url={item.url}>
                {item.label}
              </OptionButton>
            );
          })}
      </Stack>
    </Box>
  );
};

export default DonationPanel;
