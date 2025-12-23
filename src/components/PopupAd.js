import React, { useEffect, useMemo, useState, useCallback } from 'react';
import useSWR from 'swr';
import { CloseButton, Image, Link as ChakraLink, useMediaQuery, AspectRatio } from '@chakra-ui/react';
import { useMedia } from 'react-use';

import Box from './Box';
import Flex from './Flex';
import Text from './Text';
import Button from './Button';
import Input from './Input';
import { responsive } from './ThemeProvider/theme';
import { getApiEndpoint } from '../helpers/apiHelpers';

const POPUP_RANGE = "popup!A1:B10";
const DISMISS_DURATION_DAYS = 30;

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
};

const PopupAd = () => {
  const [popup, setPopup] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState('');
  const [submitState, setSubmitState] = useState('idle'); // idle | submitting | success | error
  const [submitError, setSubmitError] = useState('');

  const [isClient, setIsClient] = useState(false);
  const isDesktop = useMedia('(min-width: 992px)', false);
  const [prefersReducedMotion] = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    setIsClient(typeof window !== 'undefined');
  }, []);

  // SWR: fetch popup config from API when client-side
  const endpointKey = isClient ? getApiEndpoint(POPUP_RANGE) : null;
  const { data: popupData, error: popupError, isLoading } = useSWR(
    endpointKey,
    async (url) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Popup API error: ${response.status}`);
      }
      return response.json();
    },
    { revalidateOnFocus: false }
  );

  // Helpers to normalize sheet key-value rows (欄位/設定)
  const parseBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (value === null || value === undefined) return false;
    const normalized = String(value).trim().toLowerCase();
    return ['true', '1', 'yes', 'y', '是', 'checked'].includes(normalized);
  };

  const normalizePopup = useCallback((data) => {
    if (!data) return null;

    let source = data;
    if (Array.isArray(data)) {
      if (data.length === 0) return null;
      const first = data[0] || {};
      const keyCol = '欄位' in first ? '欄位' : Object.keys(first)[0];
      const valueCol = '設定' in first ? '設定' : Object.keys(first)[1];
      if (!keyCol || !valueCol) return null;

      source = data.reduce((acc, row) => {
        const key = row?.[keyCol];
        if (key === undefined || key === null || key === '') return acc;
        acc[String(key).trim()] = row?.[valueCol];
        return acc;
      }, {});
    }

    if (typeof source !== 'object' || Array.isArray(source)) return null;

    return {
      enabled: parseBoolean(source.enabled ?? source['啟用']),
      image: source.image ?? source['圖片'] ?? '',
      title: source.title ?? source['標題'] ?? '',
      subtitle: source.subtitle ?? source['小標'] ?? '',
      description: source.description ?? source['描述'] ?? '',
      collectEmail: parseBoolean(source.collectEmail ?? source['收集 E-mail']),
      ctaText: source.ctaText ?? source['CTA'] ?? '',
      url: source.url ?? source['URL'] ?? '',
      backgroundColor: source.backgroundColor ?? source['背景色'] ?? '#ffd000',
      textColor: source.textColor ?? source['文字色'] ?? '#000000',
      buttonColor: source.buttonColor ?? source['按鈕色'] ?? '#ff6695',
      buttonTextColor: source.buttonTextColor ?? source['按鈕文字色'] ?? '#000000',
      closeButtonColor: source.closeButtonColor ?? source['關閉鍵色'] ?? '#000000',
      desktopOnly: parseBoolean(source.desktopOnly ?? source['僅桌機']),
      key: source.key ?? source['Key'] ?? 'popup',
    };
  }, []);

  // Derive popup from SWR data with dev fallback
  const swrPopup = useMemo(() => normalizePopup(popupData), [popupData, normalizePopup]);

  const isSamePopup = (a, b) => {
    if (!a || !b) return false;
    const keys = [
      'key',
      'enabled',
      'image',
      'title',
      'subtitle',
      'description',
      'collectEmail',
      'ctaText',
      'url',
      'backgroundColor',
      'textColor',
      'buttonColor',
      'buttonTextColor',
      'closeButtonColor',
      'desktopOnly',
    ];
    return keys.every((k) => a[k] === b[k]);
  };

  useEffect(() => {
    if (popupError) {
      if (process.env.NODE_ENV === 'development') {
        setPopup(DEV_SAMPLE_POPUP);
      } else {
        setPopup(null);
      }
      return;
    }

    if (swrPopup) {
      setPopup((prev) => (prev && isSamePopup(prev, swrPopup) ? prev : swrPopup));
    } else {
      setPopup(null);
    }
  }, [swrPopup, popupError]);

  // Sync dismissed state when popup changes
  useEffect(() => {
    if (!isClient) return;
    if (!popup) {
      setDismissed(false);
      return;
    }
    const storageKeyLocal = `popup-dismissed-${popup.key || 'popup'}`;
    const stored = window.localStorage.getItem(storageKeyLocal);
    if (!stored) {
      setDismissed(false);
      return;
    }
    try {
      const timestamp = parseInt(stored, 10);
      const now = Date.now();
      const daysSinceDismissed = (now - timestamp) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < DISMISS_DURATION_DAYS) {
        setDismissed(true);
      } else {
        window.localStorage.removeItem(storageKeyLocal);
        setDismissed(false);
      }
    } catch {
      setDismissed(false);
    }
  }, [isClient, popup]);

  const storageKey = useMemo(
    () => (popup ? `popup-dismissed-${popup.key || 'popup'}` : null),
    [popup]
  );

  const handleDismiss = () => {
    setDismissed(true);
    if (storageKey && typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, Date.now().toString());
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
      const endpoint = getApiEndpoint('popup');
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
    if (isLoading) return true;
    if (!popup) return true;
    if (!popup.enabled) return true;
    if (dismissed) return true;
    if (popup.desktopOnly && !isDesktop) return true;
    const hasContent = popup.title || popup.subtitle || popup.description || popup.image || (popup.ctaText && popup.url) || popup.collectEmail;

    // Debug: log popup data
    if (process.env.NODE_ENV === 'development') {
      console.log('[PopupAd Debug]', {
        popup,
        ctaText: popup.ctaText,
        url: popup.url,
        hasCTA: Boolean(popup.ctaText && popup.url),
        shouldHide: !hasContent
      });
    }

    return !hasContent;
  }, [dismissed, isDesktop, isLoading, popup]);

  if (shouldHide) return null;

  const columnsBg = popup.backgroundColor || '#ffd000';
  const textColor = popup.textColor || '#000000';
  const buttonBg = popup.buttonColor || '#ff6695';
  const buttonText = popup.buttonTextColor || '#000000';
  const closeColor = popup.closeButtonColor || '#000000';

  return (
    <>
      <Box.Fixed
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(0,0,0,0.6)"
        zIndex="overlay"
        pointerEvents="auto"
        onClick={handleDismiss}
        aria-label="關閉公告覆蓋層"
      />
      <Box.Fixed
        left="0"
        right="0"
        top="50%"
        transform="translateY(-50%)"
        zIndex="popover"
        px={responsive('0.8em', '1.5em')}
        pointerEvents="auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Box maxW={responsive('100%', '1200px')} mx="auto" pointerEvents="auto">
          <Box
            position="relative"
            color={textColor}
            borderRadius={responsive('0.85em', '1em')}
            boxShadow="0 10px 24px rgba(0,0,0,0.25)"
            overflow="hidden"
            maxH={responsive('90vh', '80vh')}
          >
          <Flex
            align="stretch"
            gap="0"
            flexWrap={responsive('wrap', 'nowrap')}
            bg={columnsBg}
            overflowY="auto"
            maxH={responsive('90vh', '80vh')}
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {popup.image ? (
              <Box
                flexBasis={responsive('100%', '50%')}
                width={responsive('100%', '50%')}
                margin="0"
                padding="0"
              >
                {isDesktop ? (
                  <Image src={popup.image} alt={popup.title || 'popup'} width="100%" height="100%" objectFit="cover" display="block" />
                ) : (
                  <AspectRatio ratio={1} width="100%">
                    <Image src={popup.image} alt={popup.title || 'popup'} objectFit="cover" />
                  </AspectRatio>
                )}
              </Box>
            ) : null}

            <Flex
              flexBasis={responsive('100%', '50%')}
              width={responsive('100%', '50%')}
              direction="column"
              justify="center"
              align="center"
              textAlign="center"
              px={responsive('20px', '40px')}
              py={responsive('30px', '40px')}
              gap="10px"
              overflowY="auto"
              maxH="100%"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {popup.title ? (
                <Text
                  as="h2"
                  fontWeight="900"
                  fontSize={responsive('24px', '28px')}
                  lineHeight="1.3"
                  color="#000"
                  m="0"
                >
                  {popup.title}
                </Text>
              ) : null}
              {popup.subtitle ? (
                <Text
                  as="p"
                  fontSize="16px"
                  fontWeight="700"
                  color="#000"
                  mb="10px"
                >
                  {popup.subtitle}
                </Text>
              ) : null}

              {popup.collectEmail && (
                <Box
                  as="form"
                  onSubmit={handleSubmit}
                  display="flex"
                  flexDirection="row"
                  flexWrap="nowrap"
                  alignItems="flex-start"
                  gap="8px"
                  width="100%"
                >
                  <Box flex="1 1 auto">
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={popup.emailPlaceholder || '請輸入你的email'}
                      bg="#ffffff"
                      color="#000"
                      width="100%"
                      borderWidth="2px"
                      borderColor="#000"
                      _hover={{ borderColor: '#000' }}
                      _focus={{ borderColor: '#000', boxShadow: 'none' }}
                      rounded="5px"
                      height="48px"
                      fontSize="16px"
                      px="15px"
                      m="0"
                    />
                    {submitState === 'error' && submitError ? (
                      <Text fontSize="12px" color="#d32f2f" textAlign="left" mt="4px">
                        {submitError}
                      </Text>
                    ) : null}
                  </Box>
                  <Box flex="0 0 auto" position="relative">
                    <Button
                      type="submit"
                      bg={buttonBg}
                      color={buttonText}
                      height="48px"
                      px="20px"
                      border="2px solid black"
                      rounded="5px"
                      fontWeight="bold"
                      fontSize="16px"
                      isLoading={submitState === 'submitting'}
                      loadingText=""
                      _hover={{ bg: buttonBg }}
                      _active={{ bg: buttonBg }}
                    >
                      {popup.emailButtonText || '送出'}
                    </Button>
                  </Box>
                </Box>
              )}

              {popup.ctaText && popup.url ? (
                <Button
                  as={ChakraLink}
                  href={popup.url}
                  isExternal={/^https?:\/\//i.test(popup.url)}
                  bg={buttonBg}
                  color={buttonText}
                  height="auto"
                  px="40px"
                  py="10px"
                  border="3px solid #000"
                  rounded="10px"
                  fontWeight="900"
                  fontSize="20px"
                  boxShadow="3px 3px 0px #000"
                  _hover={{ transform: 'translate(1px, 1px)', boxShadow: '2px 2px 0px #000', textDecoration: 'none', bg: buttonBg }}
                  _active={{ transform: 'translate(1px, 1px)', boxShadow: '2px 2px 0px #000', bg: buttonBg }}
                  mt="10px"
                >
                  {popup.ctaText}
                </Button>
              ) : null}
            </Flex>
          </Flex>

            <CloseButton
              position="absolute"
              top={responsive('0.5em', '0.8em')}
              right={responsive('0.5em', '0.8em')}
              size="lg"
              color={closeColor}
              bg="transparent"
              border="none"
              borderRadius="0"
              onClick={handleDismiss}
              _hover={{ bg: 'rgba(255,255,255,0.12)' }}
              _active={{ bg: 'rgba(255,255,255,0.18)' }}
              transition={prefersReducedMotion ? 'none' : 'all 0.15s ease'}
              aria-label="關閉公告"
            />
          </Box>
        </Box>
      </Box.Fixed>
    </>
  );
};

export default PopupAd;
