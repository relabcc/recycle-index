import React, { Fragment } from "react";
import {
  Input,
  useClipboard,
  Select,
  Stack,
} from "@chakra-ui/react";
import get from "lodash/get";
import range from "lodash/range";

import Box from "../../components/Box";
import Flex from "../../components/Flex";
import Button from "../../components/Button";
import SliderWithReset from "./SliderWithReset";

export const fields = [
  {
    name: "translate",
    label: "位移",
    children: ["x", "y"],
    unit: "%",
    min: -100,
    max: 100,
  },
  {
    name: "skew",
    label: "扭曲",
    children: ["x", "y"],
    unit: "deg",
    min: -90,
    max: 90,
  },
  { name: "rotate", label: "旋轉", unit: "deg", min: -180, max: 180 },
  { name: "scale", label: "縮放", unit: "", min: 0, max: 3, step: 0.1 },
];

const TheFaceEditor = ({
  handleChange,
  setFieldValue,
  values,
  defaultValues,
  transformString,
}) => {
  const { hasCopied, onCopy } = useClipboard(transformString);

  return (
    <Stack fontSize="16px" spacing="6">
      <Box>
        <Box>Face No.</Box>
        <Select
          fontSize="1em"
          height="2.5em"
          name="faceId"
          value={values.faceId}
          onChange={handleChange}
        >
          {range(5).map((n) => (
            <option key={n} value={n + 1}>
              {n + 1}
            </option>
          ))}
        </Select>
      </Box>
      <Box>
        <Box>把結果貼回Google Sheet</Box>
        <Flex>
          <Input
            px="1em"
            height="2.5em"
            fontSize="1em"
            readOnly
            value={transformString}
          />
          <Button onClick={onCopy} ml={2} fontSize="1.25em">
            {hasCopied ? "已複製" : "複製"}
          </Button>
        </Flex>
      </Box>
      {fields.map((field) => (
        <Box key={field.name}>
          <Box>{field.label}</Box>
          {field.children ? (
            field.children.map((c) => (
              <Fragment key={c}>
                <Box>{c}: </Box>
                <SliderWithReset
                  onReset={() =>
                    setFieldValue(
                      `${field.name}.${c}`,
                      get(defaultValues, `${field.name}.${c}`)
                    )
                  }
                  name={`${field.name}.${c}`}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={values[field.name][c]}
                  onChange={handleChange}
                />
              </Fragment>
            ))
          ) : (
            <SliderWithReset
              onReset={() =>
                setFieldValue(field.name, defaultValues[field.name])
              }
              name={field.name}
              min={field.min}
              max={field.max}
              step={field.step}
              value={values[field.name]}
              onChange={handleChange}
            />
          )}
        </Box>
      ))}
    </Stack>
  );
};

export default TheFaceEditor;
