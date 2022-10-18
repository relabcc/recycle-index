import React, { Fragment, useMemo } from "react";
import {
  AspectRatio,
  Input,
  useClipboard,
  Select,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import { get, random, range } from "lodash";
import { SizeMe } from "react-sizeme";
import ReactSelect from "react-select";
import { useFormik } from "formik";
import { MdRefresh } from "react-icons/md";
import { navigate } from "gatsby";
import { css } from '@emotion/react';
import { GatsbyImage } from "gatsby-plugin-image";

import Box from "../../components/Box";
import Text from "../../components/Text";
import Flex from "../../components/Flex";
import Button from "../../components/Button";
import Container from "../../components/Container";
import Face from "../Face";

import theme, { responsive } from "../../components/ThemeProvider/theme";
import imgSize from "../TrashPage/data/imgSize";
import useAllTrashes from "../TrashPage/data/useAllTrashes";
import useTrashData from "../TrashPage/data/useTrashData";

const idealWidth = 200;

const colorsCfg = {
  A: "green",
  B: "orange",
  C: "pink",
};

const fields = [
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

const defaultValues = {
  translate: { x: 0, y: 0 },
  rotate: 0,
  scale: 1,
  skew: { x: 0, y: 0 },
};
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

const FaceEditor = ({ data, allData }) => {
  const lastConfig = useMemo(() => {
    if (!data.transform.face) return {};
    const pttn = /(\w+)\(([^)]+)\)/g;
    const getNumber = /-?\d+(\.\d)*/g;
    const obj = {};
    let pair;
    while ((pair = pttn.exec(data.transform.face))) {
      const [, name, cfg] = pair;
      const cfgs = [];
      let res;
      while ((res = getNumber.exec(cfg))) {
        cfgs.push(res);
      }
      if (cfgs.length > 1) {
        obj[name] = {
          x: cfgs[0][0],
          y: cfgs[1][0],
        };
      } else {
        obj[name] = cfgs[0][0];
      }
    }
    return obj;
  }, [data.transform.face]);
  const { values, handleChange, setFieldValue } = useFormik({
    initialValues: {
      faceId: data.transform.faceNo || random(4) + 1,
      ...Object.assign({}, defaultValues, lastConfig),
    },
  });
  const transformString = useMemo(
    () =>
      fields.reduce(
        (str, f) =>
          `${str} ${f.name}(${
            f.children
              ? ["x", "y"].map((d) => `${values[f.name][d]}${f.unit}`).join()
              : `${values[f.name]}${f.unit}`
          })`,
        ""
      ),
    [values]
  );
  const colorScheme = `colors.${colorsCfg[data.recycleValue]}`;
  const trashWidth =
    75 *
    (data.transform.scale
      ? data.transform.scale / 100
      : Math.min(1, idealWidth / (data.xRange[1] - data.xRange[0])));
  const { hasCopied, onCopy } = useClipboard(transformString);

  // useLoader(data.gatsbyImg);

  const n = `#${String(data.id).padStart(3, "0")}`;
  // const bgColor = get(theme, `colors.${colorScheme}`)
  // const parts = useMemo(() => {
  //   if (!data) return null;
  //   return data.imgs.map(({ gatsbySrc }, i) => (
  //     <Box.FullAbs key={i}>
  //       <AspectRatio ratio={imgSize[0] / imgSize[1]}>
  //         <GatsbyImage image={gatsbySrc} />
  //       </AspectRatio>
  //     </Box.FullAbs>
  //   ));
  // }, [data]);
  const options = useMemo(
    () =>
      allData
        ?.filter((d) => d.gatsbyImg)
        .map((d) => ({ label: d.name, value: d.id })),
    [allData]
  );
  return (
    <Box width="100%" height="100vh" pt={theme.headerHeight}>
      <Box.Relative height="100%" overflow="hidden">
        <Container height="100%">
          <Box.Absolute left="0.625em" top="0em">
            <Text.Number
              textStroke="0.15625rem"
              textStrokeColor={`colors.${colorScheme}`}
              color="white"
              fontSize="6.25em"
            >
              {n}
            </Text.Number>
          </Box.Absolute>
          <Box.AbsCenter
            top={responsive("25%", "40%")}
            width="100%"
            textAlign="center"
            transform="rotate(-12deg)"
          >
            <SizeMe>
              {({ size }) => (
                <Text
                  as="h2"
                  color={colorScheme}
                  fontSize={
                    size.width
                      ? `${Math.min(
                          Math.floor(size.width / (data.name.length + 1)),
                          size.width / 3.5
                        )}px`
                      : 0
                  }
                  fontWeight="900"
                >
                  {data.name}
                </Text>
              )}
            </SizeMe>
          </Box.AbsCenter>
        </Container>
        <Box.Absolute
          right="0"
          top="0"
          bottom="0"
          width="20em"
          borderLeft="2px solid black"
          bg="rgba(255,255,255,0.8)"
          p="1em"
          overflow="auto"
        >
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
        </Box.Absolute>
        <Box.Absolute
          top="0"
          left="0"
          right="0"
          height="100%"
          zIndex="docked"
          pointerEvents="none"
        >
          <Container position="relative" height="100%">
            <Box.Absolute
              id="trash-container"
              width={responsive(`${trashWidth * 2}%`, `${trashWidth}%`)}
              left={responsive(
                `${(100 - trashWidth * 2) / 2}%`,
                `${(100 - trashWidth) / 2}%`
              )}
              top={responsive("45%", "50%")}
              transform="translate3d(0, -50%, 0)"
            >
              <div>
                <AspectRatio ratio={imgSize[0] / imgSize[1]} overflow="visible">
                  <Box overflow="visible">
                  <GatsbyImage image={data.gatsbyImg.large} alt={data.name} css={css`width:100%`} />
                    <Face
                      key={values.faceId}
                      id={values.faceId}
                      transform={transformString}
                    />
                  </Box>
                </AspectRatio>
              </div>
            </Box.Absolute>
          </Container>
        </Box.Absolute>
      </Box.Relative>
      <Box.Absolute top="0.75em" left="1em" right="1em">
        {options && (
          <ReactSelect
            onChange={(selected) => navigate(`/trash/${selected.value}/face`)}
            options={options}
          />
        )}
      </Box.Absolute>
    </Box>
  );
};

const FaceEditorWithData = (props) => {
  const {
    pageContext: { id, gatsbyImg },
  } = props;
  const gatsbyImages = useMemo(() => JSON.parse(gatsbyImg), [gatsbyImg]);
  const allData = useAllTrashes();
  const srcData = useMemo(() => allData?.find(d => d.id === id), [allData, id]);
  const data = useTrashData(srcData, gatsbyImages);
  return data ? <FaceEditor data={data} allData={allData} /> : null
}

export default FaceEditorWithData;
