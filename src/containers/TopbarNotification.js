import React, { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { MdClose } from "react-icons/md";

import Box from "../components/Box";
import Container from "../components/Container";
import Flex from "../components/Flex";
import Text from "../components/Text";
import Button from "../components/Button";
import {
  Media,
  breakpoints,
  responsive,
} from "../components/ThemeProvider/theme";
import { getApiEndpoint } from "../helpers/apiHelpers";

const TOPBAR_RANGE = "topbar!A1:B10";

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
};

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (value === null || value === undefined) return false;
  const normalized = String(value).trim().toLowerCase();
  return ["true", "1", "yes", "y", "是", "checked"].includes(normalized);
};

const normalizeTopbar = (data) => {
  if (!data) return null;

  // Allow Google Sheet key-value rows (e.g., column A = key, column B = value)
  // Example rows: [{ 啟用: '標題', TRUE: '內容' }, ...]
  let source = data;
  let enabledFromHeader;

  if (Array.isArray(data)) {
    if (data.length === 0) return null;
    const columnKeys = Object.keys(data[0] || {});
    const [keyCol, valueCol] = columnKeys;
    if (!keyCol || !valueCol) return null;

    // If the sheet uses the value column header (e.g., TRUE) to toggle enable, capture it.
    enabledFromHeader = parseBoolean(valueCol);

    source = data.reduce((acc, row) => {
      const key = row?.[keyCol];
      if (key === undefined || key === null || key === "") return acc;
      acc[String(key).trim()] = row?.[valueCol];
      return acc;
    }, {});
  }

  if (typeof source !== "object" || Array.isArray(source)) return null;

  return {
    enabled: parseBoolean(
      source.enabled ?? source["啟用"] ?? enabledFromHeader
    ),
    title: source.title ?? source["標題"] ?? "",
    cta: source.cta ?? source["CTA"] ?? "",
    url: source.url ?? source["URL"] ?? "",
    countdownEnabled: parseBoolean(
      source.countdownEnabled ?? source["啟用倒數"]
    ),
    targetDate: source.targetDate ?? source["目標日期"] ?? "",
    targetTime: source.targetTime ?? source["目標時間"] ?? "",
  };
};

const formatTwoDigits = (value) => value.toString().padStart(2, "0");

const createTargetDate = (dateStr, timeStr) => {
  if (!dateStr) return null;
  const trimmedDate = dateStr.trim();
  const trimmedTime = (timeStr || "").trim();
  // Expect yyyy/mm/dd (or yyyy-mm-dd) and optional HH:mm:ss; replace '-' to support common input
  const combined = `${trimmedDate}${trimmedTime ? ` ${trimmedTime}` : ""}`;
  const target = new Date(combined.replace(/-/g, "/"));
  if (Number.isNaN(target.getTime())) return null;
  return target;
};

const Countdown = ({ countdown }) => {
  if (!countdown) return null;

  const segments = [
    { label: "天", value: countdown.days },
    { label: "小時", value: countdown.hours },
    { label: "分鐘", value: countdown.minutes },
    { label: "秒", value: countdown.seconds },
  ];

  return (
    <Flex
      overflow="hidden"
      borderRadius="10px"
      flexShrink={0}
    >
      {segments.map(({ label, value }) => (
        <Flex
          key={label}
          direction="column"
          alignItems="center"
          justifyContent="center"
          bg="orange.500"
          px={responsive("0.65em", "0.75em")}
          py={responsive("0.4em", "0.5em")}
          minWidth={responsive("3.2em", "3.6em")}
        >
          <Text
            fontFamily="number"
            fontWeight="400"
            fontSize={responsive("1.05em", "1.1em")}
            color="black"
            lineHeight="1.1"
          >
            {formatTwoDigits(value)}
          </Text>
          <Text
            fontSize={responsive("0.7em", "0.75em")}
            fontWeight="400"
            color="black"
            lineHeight="1.2"
          >
            {label}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};

const TopbarNotification = ({ onHeightChange }) => {
  const barRef = useRef(null);
  const [dismissed, setDismissed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { data, error } = useSWR(getApiEndpoint(TOPBAR_RANGE), fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
  });

  const config = useMemo(() => normalizeTopbar(data), [data]);
  const targetDate = useMemo(
    () => createTargetDate(config?.targetDate, config?.targetTime),
    [config]
  );
  const [countdown, setCountdown] = useState(null);
  const isExternalLink = useMemo(
    () => Boolean(config?.url && /^https?:\/\//i.test(config.url)),
    [config?.url]
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const threshold = breakpoints[3] || 1280;
    let ticking = false;
    const handleResize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsDesktop(window.innerWidth >= threshold);
        ticking = false;
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!config?.countdownEnabled || !targetDate) {
      setCountdown(null);
      return undefined;
    }

    const updateCountdown = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [config?.countdownEnabled, targetDate]);

  const showTopbar = Boolean(
    config?.enabled && !dismissed && !error && config.title
  );
  const shouldRender = showTopbar && isDesktop;

  useEffect(() => {
    if (!onHeightChange) return undefined;

    if (!shouldRender || !barRef.current) {
      onHeightChange(0);
      return undefined;
    }

    const updateHeight = () =>
      onHeightChange(barRef.current?.getBoundingClientRect().height || 0);
    updateHeight();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(updateHeight);
      observer.observe(barRef.current);
      return () => {
        observer.disconnect();
        onHeightChange(0);
      };
    }

    return () => onHeightChange(0);
  }, [shouldRender, countdown, config?.title, onHeightChange]);

  if (!shouldRender) return null;

  return (
    <Box
      ref={barRef}
      position="fixed"
      top="0"
      left="0"
      right="0"
      bg="#4e4108"
      color="white"
      zIndex="modal"
      boxShadow="0 2px 0 rgba(0,0,0,0.1)"
    >
      <Container
        display="flex"
        alignItems="stretch"
        py={responsive("0.85em", "1em")}
      >
        <Flex
          flex="1"
          alignItems="center"
          gap={responsive("0.8em", "1.1em")}
        >
          {config.countdownEnabled && countdown && (
            <Countdown countdown={countdown} />
          )}

          <Flex
            alignItems="center"
            justifyContent="center"
            gap={responsive("0.7em", "0.95em")}
            flex="1"
            minWidth="0"
          >
            <Text
              fontWeight="normal"
              fontSize={responsive("0.95rem", "1.05rem", "1.1rem")}
              lineHeight="1.35"
            >
              {config.title}
            </Text>

            {config.cta && config.url && (
              <Button.Pink
                className="wp-block-button__link"
                href={config.url}
                isExternal={isExternalLink}
                height="auto"
                py="0.6em"
                px={responsive("1.1em", "1.4em")}
                fontSize={responsive("0.9em", "0.95em")}
                fontWeight="700"
                letterSpacing="normal"
                border="2px solid black"
                rounded="10px"
              >
                {config.cta}
              </Button.Pink>
            )}
          </Flex>
        </Flex>

        <Button.Icon
          aria-label="關閉通知"
          variant="ghost"
          colorScheme="blackAlpha"
          color="white"
          onClick={() => setDismissed(true)}
          icon={<MdClose size="1.25em" />}
          alignSelf="center"
          ml={responsive("0.25em", "0.5em")}
        />
      </Container>
    </Box>
  );
};

export default TopbarNotification;
