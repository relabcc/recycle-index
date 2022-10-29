import React, { useEffect } from "react";
import { SizeMe } from "react-sizeme";
import { GatsbyImage, StaticImage } from "gatsby-plugin-image";
// import loadable from '@loadable/component'

import Box from "../../components/Box";
import Text from "../../components/Text";
import Flex from "../../components/Flex";
import Container from "../../components/Container";
import FB from "../../components/Icons/FB";
import Line from "../../components/Icons/Line";
import BackgroundImage from "../../components/BackgroundImage";
import Face from "../Face";
import Footer from "../Footer";

import shareBg from "./share-bg.svg";
import shareBgMobile from "./share-bg-mobile.svg";
import theme, { responsive } from "../../components/ThemeProvider/theme";
import Handling from "./Handling";
// import MoreTrashes from './MoreTrashes';
import PerTrash from "../CataloguePage/PerTrash";
import SponsorNote from "./SponsorNote";

// const paddingBox = <Box width="20%"><Box pt="100%" /></Box>
// const Handling = loadable(() => import('./Handling'))

const FinalTrash = ({
  windowSize,
  trashWidth,
  data,
  isMobile,
  colorScheme,
  pageUrl,
  endTrashRef,
  endPos,
  endTransition,
  faceId,
  moreTrashes,
}) => {
  const [loaded, setLoaded] = React.useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);
  return (
    <>
      <Box
        as={isMobile ? "div" : Container}
        px={responsive(0, "1.25em")}
        key={String(loaded)}
      >
        <Box
          width={responsive("100%", "50%")}
          mx="auto"
          pt={responsive("0", "5vh")}
        >
          <BackgroundImage
            src={isMobile ? shareBgMobile : shareBg}
            ratio={isMobile ? 750 / 574 : 1368 / 746}
            overflow="visible"
          >
            <SizeMe>
              {({ size }) => (
                <Box.Absolute
                  left={responsive("2em", "40%")}
                  top={responsive("3em", "36%")}
                  transform={responsive("", "trnsateY(-50%)")}
                  width={responsive("55%", "45%")}
                >
                  <Box fontSize={`${size.width / 25}px`}>
                    <Text
                      letterSpacing="0.05em"
                      fontSize={responsive("1.75em", "2.25em")}
                      fontWeight="900"
                    >
                      ＃如果你不好好丟垃圾
                    </Text>
                    <Text
                      fontSize={responsive("3.25em", "3.5em")}
                      fontWeight="900"
                      color={colorScheme}
                    >
                      {data.share}
                    </Text>
                  </Box>
                </Box.Absolute>
              )}
            </SizeMe>
          </BackgroundImage>
          <Flex
            fontSize={responsive("1em", "0.625em")}
            px="0.25em"
            justifyContent={responsive("", "flex-end")}
            mt={responsive("-10%", "-4rem")}
            mr={responsive(0, "-2rem")}
          >
            <FB
              aria-label="分享到FB"
              border="1px solid black"
              mx="0.125em"
              rounded="0.25em"
              isExternal
              href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`}
            />
            <Line
              aria-label="分享到Line"
              border="1px solid black"
              mx="0.125em"
              rounded="0.25em"
              isExternal
              href={`https://social-plugins.line.me/lineit/share?url=${pageUrl}`}
            />
          </Flex>
        </Box>
      </Box>
      <Box bg={colorScheme} pb="1em" pt="2em" position="relative">
        <Container px="1.25em">
          <Flex pt="1em" flexDirection={responsive("column", "row")}>
            <Box>
              <Box pr={responsive(0, "1.5em")}>
                <Text
                  fontWeight="700"
                  color="white"
                  fontSize={responsive("1.125em", "1.25em")}
                  letterSpacing="0.1em"
                >
                  ＃要給垃圾一個好歸宿，你該這麼做
                </Text>
              </Box>
              <Handling steps={data.handling} />
            </Box>
            {data.alternative && (
              <Box
                flex="1"
                color="white"
                mt={responsive("1em", 0)}
                pt={responsive("1em", 0)}
                pl={responsive("0", "1.5em")}
                borderTop={responsive("2px solid", "none")}
                borderLeft={responsive("none", "2px solid")}
                alignItems={responsive("flex-start", "center")}
              >
                <Text
                  fontWeight="700"
                  fontSize={responsive("1.125em", "1.25em")}
                  letterSpacing="0.1em"
                >
                  ＃或者，你有替代方案：
                </Text>
                <Flex
                  width={responsive("20em", "24em")}
                  mr={responsive("0", "1em")}
                  alignItems="flex-end"
                  my={responsive("1em", "0.5em")}
                >
                  <Box width="22%" pb="5%">
                    <StaticImage alt="替代方案" src="planb.svg" />
                  </Box>
                  <Box flex="1" pl="2%">
                    <Box.Relative>
                      <StaticImage alt="替代方案內容" src="planb-bubble.svg" />
                      <Box.Absolute
                        top="50%"
                        left="16%"
                        right="5%"
                        transform="translateY(-50%)"
                      >
                        <Text
                          fontSize={responsive("1.125em", "1em")}
                          letterSpacing="0.1em"
                        >
                          {data.alternative}
                        </Text>
                      </Box.Absolute>
                    </Box.Relative>
                  </Box>
                </Flex>
              </Box>
            )}
          </Flex>
        </Container>
      </Box>
      <Box bg="white" py="1.25em" position="relative" zIndex={1}>
        {data.sponsor && <SponsorNote sponsor={data.sponsor} />}
        <Container>
          <Flex mt={responsive("0.5em", "0.25em")}>
            <Box width="1.75em" mr="0.5em">
              <StaticImage alt="垃圾袋" src="trash-bag.svg" />
            </Box>
            <Text
              fontSize={responsive("1.25em", "1.25em")}
              fontWeight="900"
              letterSpacing="0.125em"
            >
              猜你也丟過這些...
            </Text>
          </Flex>
        </Container>
        <Box
          overflow={responsive("scroll", "hidden")}
          mr={responsive(0, "1.25em")}
          className="overflow-scroll"
          py="1em"
        >
          <Box as={isMobile ? "div" : Container}>
            <Flex width={responsive("200vw", "100%")}>
              {moreTrashes.map((d) => (
                <Box key={d.id} width="20%">
                  <Box p="2%">
                    <PerTrash data={d} />
                  </Box>
                </Box>
              ))}
            </Flex>
          </Box>
        </Box>
        <Container px={responsive("0", "2em")}>
          <Footer pt="2em" />
        </Container>
      </Box>
      <Box.Absolute
        left="0"
        right="0"
        top="0"
        style={{
          height: `calc(${windowSize.height}px - ${theme.headerHeight})`,
        }}
        pointerEvents="none"
        ref={endTrashRef}
        opacity="0"
      >
        <Container height="100%">
          <Box.Relative height="100%">
            <Box.Absolute
              width={`${trashWidth}%`}
              left={`${(100 - trashWidth) / 2}%`}
              top={responsive(`${endPos[0]}px`, `${endPos[1]}px`)}
              transform={responsive([
                `translate3d(10%, -50%, 0) ${
                  data.transform.mobileRotate
                    ? `rotate(${data.transform.mobileRotate}deg)`
                    : data.transform.rotate
                    ? `rotate(${data.transform.rotate}deg)`
                    : ""
                }`,
                `translate3d(0, -50%, 0) ${
                  data.transform.rotate
                    ? `rotate(${data.transform.rotate}deg)`
                    : ""
                }`,
              ])}
            >
              <Box
                transform={responsive([
                  `translate(${endTransition[0]
                    .map((d) => `${d}%`)
                    .join(",")}) ${
                    data.transform.mobileShareScale
                      ? `scale(${data.transform.mobileShareScale / 100})`
                      : data.transform.shareScale
                      ? `scale(${data.transform.shareScale / 100})`
                      : ""
                  }`,
                  `translate(${endTransition[1]
                    .map((d) => `${d}%`)
                    .join(",")}) ${
                    data.transform.shareScale
                      ? `scale(${data.transform.shareScale / 100})`
                      : ""
                  }`,
                ])}
              >
                <GatsbyImage alt={data.name} image={data.gatsbyImg.large} />
                <Face transform={data.transform.face} id={faceId} />
              </Box>
            </Box.Absolute>
          </Box.Relative>
        </Container>
      </Box.Absolute>
    </>
  );
};

export default FinalTrash;
