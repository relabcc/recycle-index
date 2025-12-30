import React from "react";
import { Stack, SimpleGrid } from "@chakra-ui/react";

import Box from "../../components/Box";
import Link from "../../components/Link";
import { responsive } from "../../components/ThemeProvider/theme";
import { COURSE_APPLY_URL } from "../../constants/links";

const websiteLinks = [
  { label: "關於我們", href: "https://rethinktw.cc/a8fyy", isExternal: true },
  {
    label: "必懂的回收知識",
    href: "https://rethinktw.cc/ZL2W5",
    isExternal: true,
  },
  { label: "課程申請", href: COURSE_APPLY_URL, isExternal: true },
  { label: "企業合作", href: "https://rethinktw.cc/vweYW", isExternal: true },
  {
    label: "RE-THINK官網",
    href: "https://rethinktw.cc/BkzgJ",
    isExternal: true,
  },
  { label: "海廢圖鑑", href: "https://rethinktw.cc/kRoiM", isExternal: true },
];

const WebsiteLinks = () => {
  return (
    <Stack spacing="0.75em">
      <Box
        fontSize={responsive("1em", "1em")}
        color="#7e7e7e"
        fontWeight="normal"
      >
        網站連結
      </Box>
      <SimpleGrid columns={2} spacing="0.5em" pt="0.25em">
        {websiteLinks.map(({ label, href, isExternal }) => (
          <Link
            key={label}
            href={href}
            isExternal={isExternal}
            color="white"
            fontSize="0.875em"
            _hover={{ opacity: 0.8 }}
          >
            {label}
          </Link>
        ))}
      </SimpleGrid>
    </Stack>
  );
};

export default WebsiteLinks;
