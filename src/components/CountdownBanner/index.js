import React, { useState, useEffect } from 'react';
import { Box, Text, Link, Button } from '@chakra-ui/react';
import { responsive } from '../ThemeProvider/theme';

const CountdownBanner = ({ config }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!config || !config.enabled || !config.endDate) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(config.endDate).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        };
      } else {
        return {};
      }
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [config]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!config || !config.enabled || !isVisible || Object.keys(timeLeft).length === 0) {
    return null;
  }

  return (
    <Box
      bg={config.backgroundColor || 'red.500'}
      color={config.textColor || 'white'}
      py={responsive('0.5em', '0.75em')}
      px={responsive('1em', '2em')}
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="banner"
      fontSize={responsive('0.75em', '0.875em')}
      textAlign="center"
    >
      <Box position="relative">
        {config.closeable && (
          <Button
            position="absolute"
            right="0"
            top="50%"
            transform="translateY(-50%)"
            size="sm"
            variant="ghost"
            color={config.textColor || 'white'}
            onClick={handleClose}
            fontSize="1.2em"
            minW="auto"
            px="0.5em"
          >
            ×
          </Button>
        )}
        
        <Text as="span" fontWeight="bold" mr={2}>
          {config.title || '限時倒數'}
        </Text>
        
        <Text as="span" mr={2}>
          {timeLeft.days > 0 && `${timeLeft.days}天 `}
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </Text>

        {config.buttonText && config.buttonLink && (
          <Button
            as={Link}
            href={config.buttonLink}
            size="sm"
            ml={2}
            bg={config.buttonBg || 'white'}
            color={config.buttonColor || config.backgroundColor || 'red.500'}
            _hover={{
              bg: config.buttonHoverBg || 'gray.100',
            }}
            isExternal={config.buttonExternal}
          >
            {config.buttonText}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CountdownBanner;