import { useState, useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json()).catch(() => null);

export const useGlobalConfig = () => {
  const { data, error, mutate } = useSWR('/api/global-config', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true,
    fallbackData: {
      popup: {
        enabled: false,
        title: '',
        content: '',
        image: '',
        imageAlt: '',
        buttonText: '',
        buttonLink: '',
        buttonExternal: true,
        closeText: '關閉',
        size: 'md',
        delay: 3000,
      },
      countdown: {
        enabled: false,
        title: '限時倒數',
        endDate: '',
        backgroundColor: '#e53e3e',
        textColor: '#ffffff',
        buttonText: '',
        buttonLink: '',
        buttonExternal: true,
        buttonBg: '#ffffff',
        buttonColor: '#e53e3e',
        buttonHoverBg: '#f7fafc',
        closeable: true,
      },
    },
  });

  return {
    config: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export const usePopupConfig = () => {
  const { config } = useGlobalConfig();
  return config?.popup || null;
};

export const useCountdownConfig = () => {
  const { config } = useGlobalConfig();
  return config?.countdown || null;
};