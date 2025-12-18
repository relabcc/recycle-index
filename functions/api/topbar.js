import { getSheetData, handleCORS, CORS_HEADERS } from '../services/google-sheets.js';

const DEFAULT_RANGE = 'topbar!A1:B10';

const parseBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (value === null || value === undefined) return false;
  const normalized = String(value).trim().toLowerCase();
  return ['true', '1', 'yes', 'y', '是', 'checked'].includes(normalized);
};

const normalizeTopbarData = (values = {}) => ({
  enabled: parseBoolean(values['啟用']),
  title: values['標題'] || '',
  cta: values['CTA'] || '',
  url: values['URL'] || '',
  countdownEnabled: parseBoolean(values['啟用倒數']),
  targetDate: values['目標日期'] || '',
  targetTime: values['目標時間'] || '',
});

const processSheetData = (responseData) => {
  if (!responseData.values) {
    throw new Error('No data returned from spreadsheet');
  }

  const keyValue = responseData.values.reduce((acc, row) => {
    const [key, value] = row;
    if (key) {
      acc[key.trim()] = value;
    }
    return acc;
  }, {});

  return normalizeTopbarData(keyValue);
};

const mockTopbar = normalizeTopbarData({
  啟用: true,
  標題: '欸迤欸迤欸迤欸迤欸迤欸迤欸迤欸迤欸迤欸迤欸迤欸迤欸迤欸迤欸迤欸迤',
  CTA: '按鈕按鈕',
  URL: 'https://rethinktw.org',
  啟用倒數: true,
  目標日期: '2025/12/31',
  目標時間: '23:59:59',
});

export async function onRequest(context) {
  try {
    const corsResponse = handleCORS(context.request);
    if (corsResponse) return corsResponse;

    const url = new URL(context.request.url);
    const range = url.searchParams.get('range') || DEFAULT_RANGE;
    const useMock = url.searchParams.get('mock');

    if (useMock) {
      return new Response(JSON.stringify(mockTopbar), {
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      });
    }

    const result = await getSheetData(context, range, processSheetData);

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
      },
    });
  } catch (error) {
    console.error('Topbar error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      details: error.stack,
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
      },
    });
  }
}
