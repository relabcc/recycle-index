import React, { useEffect, useMemo, useState } from 'react';
import { CloseButton, Image, Link as ChakraLink, useMediaQuery } from '@chakra-ui/react';
import { useMedia } from 'react-use';

import Box from './Box';
import Flex from './Flex';
import Text from './Text';
import Button from './Button';
import Input from './Input';
import { responsive } from './ThemeProvider/theme';

const getApiEndpoint = () => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'https://recycle-index.pages.dev/api/popup';
  }
  return '/api/popup';
};

const formatTwoDigits = (num) => num.toString().padStart(2, '0');

const DEV_SAMPLE_POPUP = {
  key: 'dev-sample',
  title: 'TOPBAR（開發示意）',
  subtitle: '以 Google Sheet 管理的彈窗設定，正式環境會依照後台資料顯示。',
  description: '（此區為開發示意資料，僅在本機環境顯示）',
  ctaText: '按鈕按鈕按鈕',
  url: 'https://recycle.rethinktw.org',
  collectEmail: true,
  emailPlaceholder: '輸入 Email',
  emailButtonText: '送出',
  backgroundColor: '#4d3b00',
  textColor: '#ffffff',
  buttonColor: '#ff6695',
  buttonTextColor: '#000000',
  countdownTarget: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
};

const Countdown = ({ value }) => {
  if (!value) return null;

  const timeBlocks = [
    { label: '天', key: 'days', value: value.days },
    { label: '小時', key: 'hours', value: value.hours },
    { label: '分鐘', key: 'minutes', value: value.minutes },
    { label: '秒', key: 'seconds', value: value.seconds },
  ];

  return (
    <Flex
      align="center"
      bg="colors.orange"
      color="black"
      borderRadius={responsive('0.6em', '0.75em')}
      px={responsive('0.6em', '0.9em')}
      py={responsive('0.4em', '0.5em')}
      gap={responsive('0.65em', '0.8em')}
      boxShadow="0 2px 0 rgba(0,0,0,0.25)"
      minW={responsive('220px', '260px')}
      justify="space-between"
    >
      {timeBlocks.map((block) => (
        <Flex key={block.key} direction="column" align="center" minW="3.25em" gap="0.15em">
          <Text.Number fontSize={responsive('1.3em', '1.6em')} fontWeight="900">
            {formatTwoDigits(Math.max(block.value, 0))}
          </Text.Number>
          <Text fontSize="0.85em" fontWeight="800">
            {block.label}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};

const PopupAd = () => {
  const [popup, setPopup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState('');
  const [submitState, setSubmitState] = useState('idle'); // idle | submitting | success | error
  const [submitError, setSubmitError] = useState('');
  const [countdown, setCountdown] = useState(null);

  const [isClient, setIsClient] = useState(false);
  const isDesktop = useMedia('(min-width: 992px)', false);
  const [prefersReducedMotion] = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    setIsClient(typeof window !== 'undefined');
  }, []);

  useEffect(() => {
    if (!isClient) return undefined;

    let cancelled = false;
    const endpoint = getApiEndpoint();

    const fetchPopup = async () => {
      setLoading(true);
      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`Popup API error: ${response.status}`);
        }
        const data = await response.json();
        const popupConfig = data?.popup;

        if (!popupConfig) {
          if (!cancelled) {
            setPopup(null);
            setDismissed(false);
          }
          return;
        }

        const countdownTarget = popupConfig.countdownTarget
          ? new Date(popupConfig.countdownTarget)
          : null;
        const normalizedCountdown = countdownTarget && !Number.isNaN(countdownTarget.getTime())
          ? countdownTarget
          : null;

        if (!cancelled) {
          setPopup({
            ...popupConfig,
            countdownTarget: normalizedCountdown,
          });
          const storageKey = `popup-dismissed-${popupConfig.key || 'popup'}`;
          const stored = window.localStorage.getItem(storageKey);
          setDismissed(stored === '1');
        }
      } catch (err) {
        console.error('[popup] fetch error', err);
        if (!cancelled) {
          if (process.env.NODE_ENV === 'development') {
            setPopup(DEV_SAMPLE_POPUP);
            setDismissed(false);
          } else {
            setPopup(null);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPopup();
    return () => {
      cancelled = true;
    };
  }, [isClient]);

  useEffect(() => {
    if (!popup?.countdownTarget) {
      setCountdown(null);
      return undefined;
    }

    const target = popup.countdownTarget;
    const updateCountdown = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setCountdown(null);
        return;
      }
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [popup?.countdownTarget]);

  const storageKey = useMemo(
    () => (popup ? `popup-dismissed-${popup.key || 'popup'}` : null),
    [popup]
  );

  const handleDismiss = () => {
    setDismissed(true);
    if (storageKey && typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, '1');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!popup?.collectEmail) return;

    const trimmed = email.trim();
    if (!trimmed) {
      setSubmitError('請輸入 Email');
      setSubmitState('error');
      return;
    }

    setSubmitError('');
    setSubmitState('submitting');
    try {
      const endpoint = getApiEndpoint();
      const payload = {
        email: trimmed,
        popupKey: popup.key,
        source: typeof window !== 'undefined' ? window.location.pathname : '',
      };
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || '無法送出，請稍後再試');
      }

      setSubmitState('success');
      setEmail('');
    } catch (err) {
      console.error('[popup] email submit error', err);
      setSubmitState('error');
      setSubmitError(err.message || '送出失敗，請稍後再試');
    }
  };

  const shouldHide = useMemo(() => {
    if (loading) return true;
    if (!popup) return true;
    if (dismissed) return true;
    if (popup.desktopOnly && !isDesktop) return true;
    if (popup.countdownTarget && countdown === null) return true;
    const hasContent = popup.title || popup.subtitle || popup.description || popup.image || (popup.ctaText && popup.url) || popup.collectEmail;
    return !hasContent;
  }, [countdown, dismissed, isDesktop, loading, popup]);

  if (shouldHide) return null;

  const bg = popup.backgroundColor || 'rgba(73,58,9,0.96)';
  const textColor = popup.textColor || '#ffffff';
  const buttonBg = popup.buttonColor || '#ff6695';
  const buttonText = popup.buttonTextColor || '#000000';
  const closeColor = popup.closeButtonColor || '#ffffff';

  return (
    <Box.Fixed
      left="0"
      right="0"
      bottom={responsive('0.5em', '1.5em')}
      zIndex="popover"
      px={responsive('0.8em', '1.5em')}
      pointerEvents="none"
    >
      <Box maxW={responsive('100%', '1200px')} mx="auto" pointerEvents="auto">
        <Box
          position="relative"
          bg={bg}
          color={textColor}
          borderRadius={responsive('0.85em', '1em')}
          boxShadow="0 10px 24px rgba(0,0,0,0.25)"
          overflow="hidden"
        >
          <Flex
            align="center"
            gap={responsive('0.75em', '1em')}
            px={responsive('1em', '1.5em', '2em')}
            py={responsive('1em', '1.25em', '1.4em')}
            flexWrap={responsive('wrap', 'wrap', 'nowrap')}
          >
            {countdown && <Countdown value={countdown} />}

            {popup.image ? (
              <Box
                flexShrink={0}
                borderRadius={responsive('0.75em', '0.85em')}
                overflow="hidden"
                width={responsive('5.5em', '7em')}
                height={responsive('5.5em', '7em')}
                bg="rgba(255,255,255,0.08)"
              >
                <Image src={popup.image} alt={popup.title || 'popup'} width="100%" height="100%" objectFit="cover" />
              </Box>
            ) : null}

            <Flex direction="column" flex="1" gap="0.35em" minWidth={responsive('14em', '18em')}>
              {popup.title ? (
                <Text fontWeight="900" fontSize={responsive('1.1em', '1.25em')} lineHeight="1.4">
                  {popup.title}
                </Text>
              ) : null}
              {popup.subtitle ? (
                <Text fontWeight="700" fontSize={responsive('0.95em', '1.05em')} lineHeight="1.5">
                  {popup.subtitle}
                </Text>
              ) : null}
              {popup.description ? (
                <Text fontSize={responsive('0.9em', '0.95em')} opacity="0.9">
                  {popup.description}
                </Text>
              ) : null}

              {popup.collectEmail && (
                <Box
                  as="form"
                  onSubmit={handleSubmit}
                  display="flex"
                  gap="0.5em"
                  flexWrap={responsive('wrap', 'nowrap')}
                  alignItems="center"
                  mt="0.25em"
                >
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={popup.emailPlaceholder || '輸入 Email'}
                    bg="white"
                    color="black"
                    maxW={responsive('100%', '16em')}
                    borderWidth="2px"
                    _hover={{ borderColor: 'black' }}
                    _focus={{ borderColor: 'black', boxShadow: 'none' }}
                    rounded="0.75em"
                    height="2.75em"
                  />
                  <Button
                    type="submit"
                    bg={buttonBg}
                    color={buttonText}
                    height="2.75em"
                    px={responsive('1.25em', '1.8em')}
                    border="2px solid black"
                    rounded="0.75em"
                    letterSpacing="0.05em"
                    fontWeight="900"
                    isLoading={submitState === 'submitting'}
                    loadingText="送出中"
                    _hover={{ bg: buttonBg }}
                    _active={{ bg: buttonBg }}
                  >
                    {popup.emailButtonText || '送出'}
                  </Button>
                  {submitState === 'success' ? (
                    <Text fontWeight="800" color="green.200">
                      已送出，感謝支持！
                    </Text>
                  ) : null}
                  {submitState === 'error' && submitError ? (
                    <Text fontWeight="800" color="red.200">
                      {submitError}
                    </Text>
                  ) : null}
                </Box>
              )}
            </Flex>

            {popup.ctaText && popup.url ? (
              <Button
                as={ChakraLink}
                href={popup.url}
                isExternal
                bg={buttonBg}
                color={buttonText}
                height="auto"
                px={responsive('1.5em', '2.25em')}
                py={responsive('0.8em', '0.9em')}
                border="2px solid black"
                rounded="0.85em"
                fontWeight="900"
                letterSpacing="0.08em"
                whiteSpace="nowrap"
                _hover={{ bg: buttonBg, textDecoration: 'none' }}
                _active={{ bg: buttonBg }}
              >
                {popup.ctaText}
              </Button>
            ) : null}
          </Flex>

          <CloseButton
            position="absolute"
            top={responsive('0.5em', '0.8em')}
            right={responsive('0.5em', '0.8em')}
            size="lg"
            color={closeColor}
            bg="transparent"
            border="2px solid"
            borderColor={closeColor}
            borderRadius="full"
            onClick={handleDismiss}
            _hover={{ bg: 'rgba(255,255,255,0.12)' }}
            _active={{ bg: 'rgba(255,255,255,0.18)' }}
            transition={prefersReducedMotion ? 'none' : 'all 0.15s ease'}
            aria-label="關閉公告"
          />
        </Box>
      </Box>
    </Box.Fixed>
  );
};

export default PopupAd;
