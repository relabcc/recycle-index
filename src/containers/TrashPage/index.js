import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  createRef,
  useContext,
  createElement,
} from "react";
import { AspectRatio } from "@chakra-ui/react";
import { get, random, range } from "lodash";
import gsap from "gsap";
import { useWindowSize } from "react-use";
import ReactFullpage from "@fullpage/react-fullpage";
import { timer } from "d3-timer";
import { GatsbyImage } from "gatsby-plugin-image";
import styled from "@emotion/styled";
import loadable from "@loadable/component";
import { css } from "@emotion/react";

import Box from "../../components/Box";
import Text from "../../components/Text";
import Circle from "../../components/Circle";
import Container from "../../components/Container";
import withData from "./data/withData";
import animations from "./data/animations";
// import ChevDown from './ChevDown';
// import Hashtag from './Hashtag';
import RateCircle from "./RateCircle";
import Face from "../Face";
import isIos from "../../components/utils/isIos";

// import trash from './trash-bag.svg'
// import planb from './planb.svg'
// import planbBubble from './planb-bubble.svg'
// import ScrollIndicator from './ScrollIndicator';
import containerWidthContext from "../../contexts/containerWidth/context";
import useResponsive from "../../contexts/mediaQuery/useResponsive";
import useShowHeader from "../../contexts/header/useShowHeader";
import theme, { Media, responsive } from "../../components/ThemeProvider/theme";
// import FullpageLoading from '../../components/FullpageLoading';
// import useLoader from '../../utils/useLoader';
import imgSize from "./data/imgSize";
import useIsEn from "../useIsEn";
import trashEn from "../trashEn";
import LastPage from "./LastPage";
import TrashTitle from "./TrashTitle";
import ReLink from "../../components/Link";
import useTrashData from "./data/useTrashData";
import useAllTrashes from "./data/useAllTrashes";
// const GSAP = loadable.lib(() => import('gsap'))
const Hashtag = loadable(() => import("./Hashtag"));
const ScrollIndicator = loadable(() => import("./ScrollIndicator"));
const ChevDown = loadable(() => import("./ChevDown"));
// const LastPage = loadable(() => import('./LastPage'))

// import useReloadOnOrentation from '../../utils/useReloadOnOrentation';

let fpApi;
// const pageCount = 5
const trashSidePos = 20;
const scrollingDuration = 1;
const idealWidth = 200;

let theTimeline;
let endTimeline;
let progressTimer;

const Wrapper = styled.div`
  height: 100%;
  #fullpage {
    height: 100%;
  }
  .section {
    height: 100%;
    & > div {
      height: 100%;
    }
  }
  .fp-is-overflow > .fp-overflow {
    overflow-x: hidden;
  }
`;

const TrashName = ({ children, ...props }) => (
  <Box.Absolute
    as="span"
    top={responsive("1.75em", "1.25em")}
    left={responsive("1em", "1.5em")}
    color="white"
    {...props}
  >
    <Text
      as="span"
      fontSize={responsive("1em", "1.5625em")}
      fontWeight="900"
      letterSpacing="0.1em"
    >
      {children}
    </Text>
  </Box.Absolute>
);

const SectionTitle = ({ children, ...props }) => (
  <Box.Absolute
    as="span"
    left={responsive("1em", "1.5em")}
    top={responsive("3.25em", "3.4375em")}
    {...props}
  >
    <Text as="span" fontSize={responsive("0.875em", "0.9375em")}>
      {children}
    </Text>
  </Box.Absolute>
);

const TrashDescription = (props) => (
  <Box.Absolute
    bottom={responsive("9%", "10%")}
    right={responsive("5%", "6em")}
    width={responsive("90%", "30%")}
  >
    <Text
      lineHeight="1.625"
      letterSpacing="0.075em"
      textAlign="justify"
      fontSize={responsive("0.75em", "1em")}
      {...props}
    />
  </Box.Absolute>
);

const TrashAdditional = ({ data, bg }) => {
  const [text, url] = useMemo(() => {
    const pttn = /([^[]+)\[([^\]]+)]/.exec(data);
    return pttn ? [pttn[1], pttn[2]] : [];
  }, [data]);
  return text ? (
    <Box mt="2" bg="white" p="1" ml="-1" mr="-1">
      <ReLink color={bg} href={url} isExternal>
        {text}
      </ReLink>
    </Box>
  ) : null;
};

const TrashValue = ({ additional, bg, ...props }) => (
  <Box.Absolute
    bottom={responsive("12%", "10%")}
    right={responsive("10%", "8em")}
    width={responsive("80%", "25%")}
  >
    <Text
      lineHeight="1.75"
      letterSpacing="0.075em"
      textAlign="justify"
      fontSize={responsive("1em", "1em")}
      fontWeight="700"
      {...props}
    />
    {additional ? <TrashAdditional bg={bg} data={additional} /> : null}
  </Box.Absolute>
);

const TrashNote = ({ children, ...props }) => {
  const lined = useMemo(() => {
    return children && children.replace(/\|/g, "\n");
  }, [children]);
  return (
    children && (
      <Box.Absolute
        top={responsive("1em", "auto")}
        bottom={responsive("auto", "1.25em")}
        right={responsive("6%", "4.75em")}
        width={responsive("50%", "20%")}
      >
        <Text
          fontSize={responsive("0.875em", "0.875em")}
          whiteSpace="pre-wrap"
          {...props}
        >
          *{lined}
        </Text>
      </Box.Absolute>
    )
  );
};

const TrashNumber = ({ children, ...props }) => (
  <Box.Absolute
    bottom={responsive("auto", "1.25em")}
    top={responsive("0em", "auto")}
    left={responsive("1em", "1.5em")}
    color="white"
    {...props}
  >
    <Text.Number fontSize={responsive("1.25em", "1em")}>{children}</Text.Number>
  </Box.Absolute>
);

const getPoses = (data, newHeight, explosionGap) => {
  const posByPartName = {};
  const posByOrder = [];
  const yStart = newHeight - (newHeight - imgSize[1]) / 2;

  return [
    data.imgs.map((cfg) => {
      // calc parts y position
      const y =
        ((yStart -
          cfg.y -
          data.positions[cfg.order] -
          ((imgSize[1] * explosionGap) / 100) * cfg.order) /
          imgSize[1]) *
        100;
      posByOrder[cfg.order] = y;
      const yPos = `${y}%`;
      if (cfg.partName) {
        posByPartName[cfg.partName] = yPos;
      }
      return yPos;
    }),
    posByPartName,
    posByOrder,
  ];
};

const getHeightConfig = (data, explosionGap) => {
  const newHeight =
    data.totalHeight +
    ((data.partsCount - 1) * imgSize[1] * explosionGap) / 100;
  return newHeight;
};

const colorsCfg = {
  A: "green",
  B: "orange",
  C: "pink",
};

let cfgPoses = {};

const TrashPage = ({
  trashData: data,
  moreTrashes,
  data: {
    site: { siteMetadata },
  },
}) => {
  const isEn = useIsEn();
  const [scrollProgress, setProgress] = useState();
  const windowSize = useWindowSize();
  const { isMobile } = useResponsive();
  const { containerWidth } = useContext(containerWidthContext);
  // setup refs
  // const gsapRef = useRef()
  const faceRef = useRef();
  const trashRef = useRef();
  const trashXRef = useRef();
  const endTrashRef = useRef();
  const layerRefs = useMemo(() => data.imgs.map(() => createRef()), [data]);
  const animaRefs = useMemo(() => data.imgs.map(() => createRef()), [data]);
  const partsRefs = useMemo(() => data.imgs.map(() => createRef()), [data]);
  const [inited, setInited] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(0);
  const gradeData = useMemo(() => {
    return {
      A: isEn
        ? "This kind of trash has a plain composition that can be easily processed. If it is placed in the right trash bin, it has a high chance to recycle and be reused!"
        : "因為材質單純、處理成本相對低，此類垃圾回收價值高。只要你不分錯，它們就有很高的機會被再利用。",
      B: isEn
        ? "This kind of trash has certain recycle value. However, reasons including low in quantity, or no enough processors make it a bit difficult to recycle the trash."
        : "這類的垃圾有回收價值，但因為某些原因造成結果浮動，像是垃圾的量不夠、怎麼回收或製造。我們可以試著好好回收，創造它的回收價值喔！",
      C: isEn
        ? "This kind of trash is either difficult to process (because of its composition or usage), or lowly-priced. We can choose to reuse or reduce the use of this kind of trash."
        : "因為回收價格低、太難處理或太髒等，造成它沒有回收價值。我們可以選擇重複使用，或者少用點。",
    };
  }, [isEn]);
  // useReloadOnOrentation()

  const colorScheme = useMemo(
    () => `colors.${colorsCfg[data.recycleValue]}`,
    [data.recycleValue]
  );
  const trashWidth = useMemo(
    () =>
      (isMobile ? (isIos ? 135 : 160) : 75) *
      (data.transform.scale
        ? (isMobile && data.transform.mobileScale
            ? data.transform.mobileScale
            : data.transform.scale) / 100
        : Math.min(1, idealWidth / (data.xRange[1] - data.xRange[0]))),
    [data.transform.mobileScale, data.transform.scale, data.xRange, isMobile]
  );
  const explosionGap = useMemo(
    () => ((isMobile ? 10 : 5) * (100 + (data.transform.gap || 0))) / 100,
    [data.transform.gap, isMobile]
  );
  const faceId = useMemo(() => data.transform.faceNo || random(4) + 1, [data]);
  const endTransition = useMemo(
    () => [
      [0 + (data.transform.mobileX || 0), -50 + (data.transform.mobileY || 0)],
      [-trashSidePos + (data.transform.x || 0), -20 + (data.transform.y || 0)],
    ],
    [
      data.transform.mobileX,
      data.transform.mobileY,
      data.transform.x,
      data.transform.y,
    ]
  );
  const endPos = useMemo(
    () => [containerWidth * 1, containerWidth * 0.25],
    [containerWidth]
  );
  useShowHeader(colorScheme);
  // useLoader(data.img)
  const pageUrl = `${siteMetadata.siteUrl}/trash/${data.id}`;

  const n = useMemo(() => `#${String(data.id).padStart(3, "0")}`, [data.id]);
  const parts = useMemo(() => {
    if (!data) return null;
    return data.imgs.map(
      ({ gatsbySrc, centeroid, x, width, partName, side }, i) => {
        let pos;
        let linePos;
        const theSide = isMobile ? 0 : side;

        if (partName) {
          pos = theSide
            ? ((x * 1 + width * 1) / imgSize[0]) * 100 + 3
            : (1 - x / imgSize[0]) * 100 + 3;
          linePos = theSide
            ? {
                left: `${pos}%`,
                right: `${100 - pos}%`,
              }
            : {
                right: `${pos}%`,
                left: `${100 - pos}%`,
              };

          cfgPoses[partName] = {
            pos,
            linePos,
          };
        }
        const top = `${(centeroid[1] / imgSize[1]) * 100}%`;
        return (
          <Box.FullAbs ref={layerRefs[i]} key={i}>
            <div ref={animaRefs[i]}>
              {pageLoaded > 0 && (
                <GatsbyImage image={gatsbySrc} alt={partName} />
              )}
            </div>
            {partName && (
              <Box ref={partsRefs[i]}>
                {inited && (
                  <>
                    <Box.Absolute
                      top={top}
                      style={linePos}
                      height="2px"
                      bg={colorScheme}
                      className="line"
                    />
                    <Box.Absolute
                      top={top}
                      style={{ [theSide ? "left" : "right"]: `${pos}%` }}
                      transform="translateY(-50%)"
                      whiteSpace="nowrap"
                      className="circle-container"
                      pointerEvents="all"
                    >
                      <Circle
                        bg={colorScheme}
                        width={responsive("7em", "7.5em")}
                        textAlign="center"
                        className="circle-1"
                        whiteSpace="pre-wrap"
                        opacity={0}
                      >
                        <Text
                          color="black"
                          fontSize={responsive("1.125em", "0.9375em")}
                          fontWeight="900"
                          px={responsive("0.5em", "0")}
                        >
                          {partName.replace(/([A-Z]+)/, (match, p1, offset) =>
                            offset > 0 ? `\n${p1}` : p1
                          )}
                        </Text>
                        <Text
                          color="white"
                          fontSize={responsive("0.625em", "0.78125em")}
                        >
                          {data.partsDetail[partName]}
                        </Text>
                      </Circle>
                      <Box.FullAbs className="circle-2" transform="scale(0)">
                        <Circle
                          border="2px solid"
                          borderColor={colorScheme}
                          bg="white"
                          width="100%"
                          textAlign="center"
                          whiteSpace="pre-wrap"
                        >
                          <Text
                            color="black"
                            fontSize={responsive("1.125em", "0.9375em")}
                            fontWeight="900"
                          >
                            {data.belongsTo[partName]}
                          </Text>
                          {get(data.recycleRate, [
                            data.belongsTo[partName],
                          ]) && (
                            <Text
                              color={colorScheme}
                              fontSize={responsive("0.625em", "0.78125em")}
                              fontWeight="900"
                            >
                              回收率{data.recycleRate[data.belongsTo[partName]]}
                              %
                            </Text>
                          )}
                        </Circle>
                      </Box.FullAbs>
                      <Box.Absolute
                        className="circle-rate"
                        opacity="0"
                        left="-8%"
                        right="-8%"
                        top="-8%"
                        bottom="-8%"
                        pointerEvents="none"
                      >
                        {get(data.recycleRate, [data.belongsTo[partName]]) && (
                          <RateCircle
                            className="circle-rate-progress"
                            value={data.recycleRate[data.belongsTo[partName]]}
                            color={colorScheme}
                          />
                        )}
                      </Box.Absolute>
                    </Box.Absolute>
                  </>
                )}
              </Box>
            )}
          </Box.FullAbs>
        );
      }
    );
  }, [data, inited, isMobile, pageLoaded]);
  const pages = [
    <Container height="100%">
      <Box.Absolute left={responsive("1em", "1.5em")} top="0em">
        <Text.Number
          textStroke="0.15625rem"
          textStrokeColor={`colors.${colorScheme}`}
          color="white"
          fontSize={responsive("2.5em", "6.25em")}
        >
          {n}
        </Text.Number>
      </Box.Absolute>
      <Box.AbsCenter
        top={responsive("17%", "40%")}
        width="100%"
        textAlign="center"
        transform="rotate(-12deg)"
      >
        <TrashTitle color={colorScheme} data={data} />
      </Box.AbsCenter>
      <TrashDescription color={colorScheme}>
        {data.description}
      </TrashDescription>
      <ChevDown onClick={() => fpApi.moveSectionDown()} />
    </Container>,
    <Container height="100%">
      <TrashName>{isEn ? trashEn[data.name] : data.name}</TrashName>
      <Box.Absolute
        top={responsive("5%", "10%")}
        width={responsive("86%", "50%")}
        left={responsive("7%", 0)}
      >
        <Hashtag color={colorScheme}>{data.recycleValue}</Hashtag>
      </Box.Absolute>
      <TrashValue color="white" bg={colorScheme} additional={data.additional}>
        {gradeData[data.recycleValue]}
      </TrashValue>
      <TrashNumber>{n}</TrashNumber>
      <ChevDown onClick={() => fpApi.moveSectionDown()} />
    </Container>,
    <Container height="100%">
      <h2>
        <TrashName color={colorScheme}>
          {isEn ? trashEn[data.name] : data.name}
        </TrashName>
        <SectionTitle>
          {isEn ? "What is the composition?" : "組成的材質是什麼？"}
        </SectionTitle>
      </h2>
      <TrashNumber color={colorScheme}>{n}</TrashNumber>
      {data.partsNote && (
        <TrashNote color={colorScheme}>{data.partsNote}</TrashNote>
      )}
      <ChevDown onClick={() => fpApi.moveSectionDown()} />
    </Container>,
    <Container height="100%">
      <h2>
        <TrashName color={colorScheme}>
          {isEn ? trashEn[data.name] : data.name}
        </TrashName>
        <SectionTitle>
          {isEn ? "Which category should it be thrown?" : "用完應該丟在哪裡？"}
        </SectionTitle>
      </h2>
      <TrashNumber color={colorScheme}>{n}</TrashNumber>
      {data.recycleNote && (
        <TrashNote color={colorScheme}>{data.recycleNote}</TrashNote>
      )}
      <ChevDown onClick={() => fpApi.moveSectionDown()} />
    </Container>,
    createElement(LastPage, {
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
    }),
  ];
  const pageCount = pages.length;
  const pagesRefs = useMemo(() => range(pageCount).map(() => createRef()), []);
  // const pageRevealRefs = useMemo(() => range(pageCount).map(() => createRef()), [])
  const init = () => {
    if (!inited) return;
    if (theTimeline) {
      theTimeline.kill();
    }
    const windowHeight = windowSize.height - 60;
    // set trash size
    const defaultTrashCfg = {
      width: `${trashWidth}%`,
      left: `${(100 - trashWidth) / 2}%`,
      rotate:
        (isMobile && data.transform.mobileRotate
          ? data.transform.mobileRotate
          : data.transform.rotate) || 0,
      y: "-50%",
      x: 0,
    };
    if (isIos) {
      defaultTrashCfg.top = isMobile
        ? ((45 + (data.transform.mobileFirstY || 0)) / 100) * windowHeight
        : ((50 + (data.transform.firstY || 0)) / 100) * windowHeight;
    }
    gsap.set(trashRef.current, defaultTrashCfg);
    gsap.set(trashXRef.current, {
      x: 0,
      y: 0,
      scale: 1,
    });
    gsap.set(faceRef.current, { opacity: 1 });
    const rateEles = [];

    theTimeline = gsap.timeline({
      onUpdate: () => {
        if (rateEles.length) {
          rateEles.forEach((ele) => {
            const e = new Event("progress");
            e.progress = Math.min(1, Math.max(0, theTimeline.time() - 2));
            ele.dispatchEvent(e);
          });
        }
      },
    });
    endTimeline = gsap.timeline();
    // console.log(data)
    const newHeight = getHeightConfig(data, explosionGap);
    // set exploded trash size
    const explodeWidthFactor = Math.min(
      Math.floor(
        ((((windowSize.height - 60) / (newHeight * (isMobile ? 1.35 : 1.2))) *
          imgSize[0]) /
          containerWidth) *
          100
      ),
      isMobile
        ? data.transform.explosionScale || 100
        : data.transform.deskExplosionScale || 50
    );

    const animation = animations[data.name];

    theTimeline.to(faceRef.current, {
      opacity: 0,
      duration: scrollingDuration,
    });
    theTimeline.to(
      trashRef.current,
      {
        rotate: 0,
        duration: scrollingDuration,
      },
      0
    );
    const trashTop = isIos
      ? isMobile
        ? ((50 + (data.transform.mobileExplosionY || 0)) / 100) * windowHeight
        : 0.5 * windowHeight
      : isMobile
      ? `${(50 + (data.transform.mobileExplosionY || 0)) / 100}%`
      : "50%";
    theTimeline.to(
      trashRef.current,
      {
        width: `${explodeWidthFactor}%`,
        left: `${(100 - explodeWidthFactor) / 2}%`,
        top: trashTop,
        x: isMobile ? "25%" : "0",
        // y: isMobile ? '45%' : '50%',
        duration: scrollingDuration,
      },
      scrollingDuration
    );
    const [poses, posByPartName] = getPoses(data, newHeight, explosionGap);
    const combineParts = [];

    data.imgs.forEach((cfg, i) => {
      gsap.set(layerRefs[cfg.index].current, { y: "0%" });
      // calc parts y position
      theTimeline.to(
        layerRefs[cfg.index].current,
        {
          y: poses[i],
          duration: scrollingDuration,
        },
        scrollingDuration
      );
      if (animation && animation[cfg.layerName]) {
        Object.entries(animation[cfg.layerName]).forEach(([d, ani]) => {
          theTimeline.to(
            animaRefs[cfg.index].current,
            {
              ...ani,
              duration: scrollingDuration * (d / 100),
            },
            scrollingDuration
          );
        });
      }
      if (cfg.partName) {
        gsap.set(
          partsRefs[cfg.index].current.querySelector(".circle-container"),
          {
            [cfg.side && !isMobile ? "left" : "right"]: `${
              cfgPoses[cfg.partName].pos
            }%`,
          }
        );
        gsap.set(partsRefs[cfg.index].current.querySelector(".line"), {
          opacity: 0,
        });
        gsap.set(partsRefs[cfg.index].current.querySelector(".circle-1"), {
          opacity: 0,
        });
        theTimeline.to(
          partsRefs[cfg.index].current.querySelector(".circle-container"),
          {
            [cfg.side && !isMobile ? "left" : "right"]: isMobile
              ? "92%"
              : "100%",
            duration: scrollingDuration,
          },
          scrollingDuration
        );
        theTimeline.to(
          partsRefs[cfg.index].current.querySelector(".line"),
          {
            [cfg.side && !isMobile ? "right" : "left"]: "-2%",
            opacity: 1,
            duration: scrollingDuration,
          },
          scrollingDuration
        );
        theTimeline.to(
          partsRefs[cfg.index].current.querySelector(".circle-1"),
          {
            opacity: 1,
            duration: scrollingDuration,
          },
          scrollingDuration
        );

        if (/^@/.test(data.belongsTo[cfg.partName])) {
          const attachName = data.belongsTo[cfg.partName].substring(1);
          if (posByPartName[attachName]) {
            const offset =
              posByPartName[attachName].replace("%", "") -
              poses[i].replace("%", "");
            combineParts[cfg.order] = [attachName, offset];
          }
        }
      }
      theTimeline.to(
        layerRefs[cfg.index].current,
        {
          y: 0,
          duration: scrollingDuration,
        },
        scrollingDuration * 3
      );
    });

    const offsetSign = combineParts.length
      ? combineParts.reduce((s, o) => {
          if (s === 0) return 0;
          const sign = o ? Math.sign(o[1]) : null;
          return typeof s === "number" ? (s === sign ? s : 0) : sign;
        }, null)
      : 0;
    const totalOffset = combineParts.length
      ? combineParts.reduce((s, o) => {
          return s + (o ? o[1] : 0);
        }, 0)
      : 0;
    // console.log(combineParts, offsetSign, totalOffset)
    if (totalOffset) {
      theTimeline.to(
        trashXRef.current,
        {
          y: `${-totalOffset / (combineParts.filter(Boolean).length + 1)}%`,
          duration: scrollingDuration,
        },
        2 * scrollingDuration
      );
    }

    data.imgs.forEach((cfg, i) => {
      if (combineParts[cfg.order]) {
        theTimeline.to(
          layerRefs[cfg.index].current,
          {
            y: posByPartName[combineParts[cfg.order][0]],
            duration: scrollingDuration,
          },
          2 * scrollingDuration
        );
        if (cfg.partName) {
          theTimeline.to(
            partsRefs[cfg.index].current.querySelector(".circle-container"),
            {
              opacity: 0,
              [cfg.side && !isMobile ? "left" : "right"]: `${
                cfgPoses[cfg.partName].pos
              }%`,
              duration: scrollingDuration,
            },
            scrollingDuration * 2
          );
          theTimeline.to(
            partsRefs[cfg.index].current.querySelector(".line"),
            {
              opacity: 0,
              ...cfgPoses[cfg.partName].linePos,
              duration: scrollingDuration,
            },
            scrollingDuration * 2
          );
          theTimeline.to(
            partsRefs[cfg.index].current.querySelector(".circle-1"),
            {
              opacity: 0,
              duration: scrollingDuration,
            },
            scrollingDuration * 2
          );
        }
      } else {
        if (offsetSign < 0) {
          if (cfg.order < combineParts.length && !combineParts[cfg.order]) {
            const nextPart = combineParts.slice(cfg.order).find(Boolean);
            theTimeline.to(
              layerRefs[cfg.index].current,
              {
                y: `${poses[i].replace("%", "") * 1 + nextPart[1]}%`,
                duration: scrollingDuration,
              },
              2 * scrollingDuration
            );
          }
        }

        if (cfg.partName) {
          gsap.set(partsRefs[cfg.index].current.querySelector(".circle-2"), {
            scale: 0,
          });
          gsap.set(partsRefs[cfg.index].current.querySelector(".circle-rate"), {
            opacity: 0,
          });
          theTimeline.to(
            partsRefs[cfg.index].current.querySelector(".circle-2"),
            {
              scale: 1,
              duration: scrollingDuration,
            },
            2 * scrollingDuration
          );
          theTimeline.to(
            partsRefs[cfg.index].current.querySelector(".circle-rate"),
            {
              opacity: 1,
              duration: scrollingDuration / 2,
            },
            2.5 * scrollingDuration
          );
          const rateEle = partsRefs[cfg.index].current.querySelector(
            ".circle-rate-progress"
          );
          if (rateEle) {
            rateEles.push(rateEle);
          }
          theTimeline.to(
            partsRefs[cfg.index].current.querySelector(".circle-container"),
            {
              opacity: 0,
              [cfg.side && !isMobile ? "left" : "right"]: `${
                cfgPoses[cfg.partName].pos
              }%`,
              duration: scrollingDuration,
            },
            scrollingDuration * 3
          );
          theTimeline.to(
            partsRefs[cfg.index].current.querySelector(".line"),
            {
              opacity: 0,
              ...cfgPoses[cfg.partName].linePos,
              duration: scrollingDuration,
            },
            scrollingDuration * 3
          );
          theTimeline.to(
            partsRefs[cfg.index].current.querySelector(".circle-1"),
            {
              opacity: 0,
              duration: scrollingDuration * 0.1,
            },
            scrollingDuration * 3
          );
          theTimeline.to(
            partsRefs[cfg.index].current.querySelector(".circle-2"),
            {
              opacity: 0,
              duration: scrollingDuration,
            },
            3 * scrollingDuration
          );
          theTimeline.to(
            partsRefs[cfg.index].current.querySelector(".circle-rate"),
            {
              opacity: 0,
              duration: scrollingDuration,
            },
            3 * scrollingDuration
          );
        }

        if (animation && animation[cfg.layerName]) {
          theTimeline.to(
            animaRefs[cfg.index].current,
            {
              ...animation[cfg.layerName][0],
              duration: scrollingDuration,
            },
            3 * scrollingDuration
          );
        }
      }
    });
    // const { top, ...rest } = defaultTrashCfg;
    theTimeline.to(
      trashRef.current,
      {
        ...defaultTrashCfg,
        duration: scrollingDuration,
      },
      scrollingDuration * 3
    );
    const scale =
      (isMobile && data.transform.mobileShareScale
        ? data.transform.mobileShareScale
        : data.transform.shareScale) / 100;

    endTimeline
      .to(
        trashXRef.current,
        {
          duration: scrollingDuration,
          x: `${endTransition[isMobile ? 0 : 1][0]}%`,
          y: `${endTransition[isMobile ? 0 : 1][1]}%`,
          scale: scale || 1,
        },
        0
      )
      .to(
        trashRef.current,
        {
          x: isMobile ? "10%" : 0,
          duration: scrollingDuration,
          top: endPos[isMobile ? 0 : 1],
        },
        0
      )
      .to(faceRef.current, { duration: scrollingDuration, opacity: 1 });

    endTimeline.pause();
    theTimeline.pause();
  };
  useEffect(() => {
    init();
    // if (fpApi) {
    //   fpApi.silentMoveTo(1)
    //   setTimeout(() => {
    //     if (progressTimer) {
    //       progressTimer.stop();
    //       setProgress(0)
    //     }
    //   })
    // }
  }, [data, windowSize.height, containerWidth, isMobile, inited]);
  const bgColor = useMemo(
    () => get(theme, `colors.${colorScheme}`),
    [colorScheme]
  );
  return (
    <Wrapper height="100%">
      {useMemo(
        () => (
          <ReactFullpage
            key={data.id}
            sectionsColor={["", bgColor, "white", "white", bgColor]}
            licenseKey={process.env.FULLPAGE_JS_KEY}
            scrollingSpeed={scrollingDuration * 1000}
            verticalCentered={false}
            onLeave={(origin, destination) => {
              setPageLoaded((p) => Math.max(p, destination.index));
              theTimeline.tweenTo(destination.index * scrollingDuration, {
                duration: scrollingDuration,
              });
              endTimeline.tweenTo(
                Math.max(destination.index - 3, 0) * scrollingDuration
              );
              if (progressTimer) {
                progressTimer.stop();
              }
              const incre = destination.index - origin.index;
              progressTimer = timer((elapsed) => {
                const p =
                  (origin.index +
                    incre * Math.min(elapsed / (scrollingDuration * 1000), 1)) /
                  (pageCount - 1);
                setProgress(p);
                if (endTrashRef.current)
                  endTrashRef.current.style.opacity = +(p >= 1);
                if (elapsed > scrollingDuration * 1000) progressTimer.stop();
              });
            }}
            scrollOverflow
            normalScrollElements={
              isMobile ? ".overflow-scroll, .footer-nav" : ".footer-nav"
            }
            afterRender={() => {
              setTimeout(() => {
                setInited(true);
                document.body.style.height = `${windowSize.height}px`;
              });
            }}
            afterResize={() => {
              setTimeout(() => {
                document.body.style.height = `${windowSize.height}px`;
                if (fpApi.getActiveSection().index < 4) fpApi.silentMoveTo(1);
              });
            }}
            render={({ fullpageApi }) => {
              fpApi = fullpageApi;
              return (
                <ReactFullpage.Wrapper>
                  {pages.map((page, i) => (
                    <Box
                      height="100%"
                      pt={theme.headerHeight}
                      className={`section ${i === 4 ? "" : "fp-noscroll"}`}
                      key={i}
                      ref={pagesRefs[i]}
                    >
                      <Box.Relative height="100%">{page}</Box.Relative>
                    </Box>
                  ))}
                </ReactFullpage.Wrapper>
              );
            }}
          />
        ),
        [bgColor, inited, isMobile]
      )}
      <Box.Fixed
        top="0"
        left="0"
        right="0"
        height="100%"
        display={!inited || scrollProgress >= 1 ? "none" : "block"}
        zIndex="docked"
        pointerEvents="none"
        pt={theme.headerHeight}
      >
        <Container position="relative" height="100%">
          <Box.Absolute
            ref={trashRef}
            id="trash-container"
            top={responsive(
              `${45 + (data.transform.mobileFirstY || 0)}%`,
              `${50 + (data.transform.firstY || 0)}%`
            )}
            width={`${trashWidth}%`}
            left={`${(100 - trashWidth) / 2}%`}
          >
            <AspectRatio ratio={imgSize[0] / imgSize[1]} overflow="visible">
              <div
                style={{ overflow: "visible", width: "100%" }}
                ref={trashXRef}
              >
                {parts}
                {(!inited || pageLoaded < 2) && (
                  <GatsbyImage
                    image={data.gatsbyImg.large}
                    alt={data.name}
                    css={css`
                      width: 100%;
                    `}
                  />
                )}
                <Face
                  transform={data.transform.face}
                  ref={faceRef}
                  id={faceId}
                />
              </div>
            </AspectRatio>
          </Box.Absolute>
        </Container>
      </Box.Fixed>
      <Media greaterThan="mobile">
        <Box.Fixed
          top="5%"
          bottom="5%"
          right="1.25em"
          width="1.875em"
          zIndex="docked"
          pt={theme.headerHeight}
        >
          <ScrollIndicator
            onClick={() => fpApi.moveTo(5)}
            progress={scrollProgress}
          />
        </Box.Fixed>
      </Media>
      {/* {!inited && <FullpageLoading />} */}
    </Wrapper>
  );
};

const TashPageWithDevData = (props) => {
  const {
    pageContext: { id, gatsbyImg },
  } = props;
  const gatsbyImages = useMemo(() => JSON.parse(gatsbyImg), [gatsbyImg]);
  const allData = useAllTrashes();
  const srcData = useMemo(
    () => allData?.find((d) => d.id == id),
    [allData, id]
  );
  const data = useTrashData(srcData, gatsbyImages);
  return data ? <TrashPage {...props} trashData={data} /> : null;
};

export default process.env.NODE_ENV === "development"
  ? withData(TashPageWithDevData)
  : withData(TrashPage);
