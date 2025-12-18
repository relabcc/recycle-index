import React, { useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import { MdClose } from 'react-icons/md';

import Box from '../components/Box';
import Container from '../components/Container';
import Flex from '../components/Flex';
import Text from '../components/Text';
import Button from '../components/Button';
import { Media, breakpoints, responsive } from '../components/ThemeProvider/theme';

const TOPBAR_RANGE = 'topbar!A1:B10';

const getApiEndpoint = () => {
  const params = new URLSearchParams({ range: TOPBAR_RANGE });
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    params.set('mock', '1');
  }
  return `/api/topbar?${params.toString()}`;
};

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
};

const parseBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (value === null || value === undefined) return false;
  const normalized = String(value).trim().toLowerCase();
  return ['true', '1', 'yes', 'y', '是', 'checked'].includes(normalized);
};

const normalizeTopbar = (data) => {
  if (!data || typeof data !== 'object') return null;
  return {
    enabled: parseBoolean(data.enabled ?? data['啟用']),
    title: data.title ?? data['標題'] ?? '',
    cta: data.cta ?? data['CTA'] ?? '',
    url: data.url ?? data['URL'] ?? '',
    countdownEnabled: parseBoolean(data.countdownEnabled ?? data['啟用倒數']),
    targetDate: data.targetDate ?? data['目標日期'] ?? '',
    targetTime: data.targetTime ?? data['目標時間'] ?? '',
  };
};

const formatTwoDigits = (value) => value.toString().padStart(2, '0');

const createTargetDate = (dateStr, timeStr) => {
  if (!dateStr) return null;
  const trimmedDate = dateStr.trim();
  const trimmedTime = (timeStr || '').trim();
  // Expect yyyy/mm/dd and optional HH:mm:ss; replace '-' to support common input
  const combined = `${trimmedDate}${trimmedTime ? ` ${trimmedTime}` : ''}`;
  const target = new Date(combined.replace(/-/g, '/'));
  if (Number.isNaN(target.getTime())) return null;
  return target;
};

const Countdown = ({ countdown }) => {
  if (!countdown) return null;
  return (
    <Flex
      alignItems="center"
      fontFamily="number"
      fontWeight="800"
      color="orange.500"
      fontSize={responsive('0.95em', '1em', '1.05em')}
      mr={responsive('0.5em', '1em')}
      minWidth="11em"
      justifyContent="flex-start"
      gap="0.25em"
    >
      {countdown.days > 0 && (
        <Text.Inline>{`${countdown.days}天`}</Text.Inline>
      )}
      <Text.Inline>{`${formatTwoDigits(countdown.hours)}:${formatTwoDigits(countdown.minutes)}:${formatTwoDigits(countdown.seconds)}`}</Text.Inline>
    </Flex>
  );
};

const TopbarNotification = ({ onHeightChange }) => {
  const barRef = useRef(null);
  const [dismissed, setDismissed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { data, error } = useSWR(getApiEndpoint(), fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
  });

  const config = useMemo(() => normalizeTopbar(data), [data]);
  const targetDate = useMemo(() => createTargetDate(config?.targetDate, config?.targetTime), [config]);
  const [countdown, setCountdown] = useState(null);
  const isExternalLink = useMemo(
    () => Boolean(config?.url && /^https?:\/\//i.test(config.url)),
    [config?.url]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const threshold = breakpoints[3] || 1280;
    const handleResize = () => setIsDesktop(window.innerWidth >= threshold);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  const showTopbar = Boolean(config?.enabled && !dismissed && !error && config.title);
  const shouldRender = showTopbar && isDesktop;

  useEffect(() => {
    if (!onHeightChange) return undefined;

    if (!shouldRender || !barRef.current) {
      onHeightChange(0);
      return undefined;
    }

    const updateHeight = () => onHeightChange(barRef.current?.getBoundingClientRect().height || 0);
    updateHeight();

    if (typeof ResizeObserver !== 'undefined') {
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
    <Media greaterThan="tablet">
      <Box
        ref={barRef}
        position="fixed"
        top="0"
        left="0"
        right="0"
        bg="colors.cyan"
        color="black"
        zIndex="modal"
        boxShadow="0 2px 0 rgba(0,0,0,0.1)"
        borderBottom="2px solid black"
      >
        <Container display="flex" alignItems="center" py={responsive('0.85em', '1em')}>
          {config.countdownEnabled && countdown && (
            <Countdown countdown={countdown} />
          )}
          <Text
            flex="1"
            fontWeight="800"
            fontSize={responsive('1em', '1.05em', '1.1em')}
            pr="1em"
            lineHeight="1.4"
          >
            {config.title}
          </Text>
          {config.cta && config.url && (
            <Button.Pink
              href={config.url}
              isExternal={isExternalLink}
              height="auto"
              py="0.7em"
              px={responsive('1.25em', '1.75em')}
              fontSize={responsive('0.9em', '1em')}
              mr="0.5em"
            >
              {config.cta}
            </Button.Pink>
          )}
          <Button.Icon
            aria-label="關閉通知"
            variant="ghost"
            colorScheme="blackAlpha"
            color="black"
            onClick={() => setDismissed(true)}
            icon={<MdClose size="1.25em" />}
          />
        </Container>
      </Box>
    </Media>
  );
};

export default TopbarNotification;
