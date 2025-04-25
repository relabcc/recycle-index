import React from "react";
import { IconButton } from "@chakra-ui/react";
import { MdRefresh } from "react-icons/md";

import Flex from "../../components/Flex";

const SliderWithReset = ({ onReset, ...props }) => (
  <Flex>
    <input type="range" {...props} />
    <IconButton
      ml="4"
      variant="ghost"
      size="xs"
      onClick={onReset}
      icon={<MdRefresh />}
    />
  </Flex>
);

export default SliderWithReset;
