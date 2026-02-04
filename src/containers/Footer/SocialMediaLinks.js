import React from "react";
import { Flex, Icon } from "@chakra-ui/react";
import { FiInstagram } from "react-icons/fi";
import { SiLine } from "react-icons/si";
import { FaThreads, FaFacebook, FaYoutube } from "react-icons/fa6";

import Link from "../../components/Link";

const socialLinks = [
  {
    icon: FaFacebook,
    label: "Facebook",
    href: "https://rethinktw.cc/ExwKe",
  },
  {
    icon: FiInstagram,
    label: "Instagram",
    href: "https://rethinktw.cc/UmAAR",
  },
  {
    icon: FaThreads,
    label: "Threads",
    href: "https://rethinktw.cc/sgI0b",
  },
  {
    icon: FaYoutube,
    label: "Youtube",
    href: "https://rethinktw.cc/AxMUh",
  },
  {
    icon: SiLine,
    label: "Line",
    href: "https://rethinktw.cc/fNvVc",
  },
];

const SocialMediaLinks = ({
  bg = "white",
  hoverBg = "yellow.400",
  iconColor = "black",
}) => {
  return (
    <Flex gap="0.75em" pt="0.5em">
      {socialLinks.map(({ icon, label, href }) => (
        <Link
          key={label}
          href={href}
          isExternal
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          w="32px"
          h="32px"
          bg={bg}
          borderRadius="6px"
          _hover={{ bg: hoverBg }}
          transition="background-color 0.2s"
        >
          <Icon as={icon} fontSize="24px" color={iconColor} />
        </Link>
      ))}
    </Flex>
  );
};

export default SocialMediaLinks;
