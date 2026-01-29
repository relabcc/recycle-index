import { useMemo } from 'react';
import useSWR from 'swr';
import { getApiEndpoint } from '../../../helpers/apiHelpers';

const TRASH_ARTICLES_RANGE = 'trash-articles!A1:C999';

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
};

/**
 * 根據垃圾名稱從 Google Sheet 載入對應的文章資料
 * @param {string} trashName - 垃圾名稱
 * @returns {object|null} - { text: string, url: string } 或 null
 */
const useTrashArticle = (trashName) => {
  const isClient = typeof window !== 'undefined';
  const { data: articlesData } = useSWR(
    isClient ? getApiEndpoint(TRASH_ARTICLES_RANGE) : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
      focusThrottleInterval: 300000,
    }
  );

  return useMemo(() => {
    if (!Array.isArray(articlesData) || !trashName) return null;
    const matched = articlesData.find((item) => item.垃圾 === trashName);
    return matched
      ? {
          text: matched.文案,
          url: matched.文章,
        }
      : null;
  }, [articlesData, trashName]);
};

export default useTrashArticle;
