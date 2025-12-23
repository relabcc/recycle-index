import {
  getSheetData,
  appendSheetData,
  handleCORS,
  CORS_HEADERS,
} from '../services/google-sheets.js';

const POPUP_RANGE = 'popup!A1:Z100';
const DEFAULT_EMAIL_RANGE = 'popup_email!A:C';

const parseBool = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  return ['1', 'true', 'yes', 'y', 'on', '啟用', '是'].includes(normalized);
};

const mapRows = (responseData) => {
  if (!responseData?.values?.length) {
    throw new Error('No data returned from spreadsheet');
  }

  const [header, ...rows] = responseData.values;
  return rows.map((row) => header.reduce((acc, key, index) => {
    acc[key] = row[index];
    return acc;
  }, {}));
};

const normalizeConfig = (rows) => {
  const activeRow = rows.find((row) => parseBool(
    row['啟用'] ||
    row['enable'] ||
    row['enabled']
  ));

  if (!activeRow) return null;

  const countdown = activeRow['倒數截止時間'] || activeRow['截止時間'] || activeRow['countdown'];
  return {
    key: activeRow['ID'] || activeRow['id'] || activeRow['標題'] || 'popup',
    title: activeRow['標題'] || activeRow['title'] || '',
    subtitle: activeRow['小標'] || activeRow['副標'] || activeRow['subtitle'] || '',
    description: activeRow['說明'] || activeRow['描述'] || activeRow['description'] || '',
    image: activeRow['圖片'] || activeRow['image'] || '',
    ctaText: activeRow['CTA'] || activeRow['cta'] || activeRow['按鈕'] || '',
    url: activeRow['URL'] || activeRow['url'] || activeRow['連結'] || '',
    collectEmail: parseBool(activeRow['收集 E-mail'] || activeRow['收集Email'] || activeRow['email'] || activeRow['collectEmail']),
    emailRange: activeRow['EmailRange'] || activeRow['E-mail Range'] || activeRow['Email 工作表'] || DEFAULT_EMAIL_RANGE,
    emailPlaceholder: activeRow['Email提示'] || activeRow['Email Placeholder'] || '輸入 Email',
    emailButtonText: activeRow['Email按鈕文字'] || activeRow['Email 按鈕'] || '送出',
    backgroundColor: activeRow['背景色'] || activeRow['底色'] || '#4a3d0b',
    textColor: activeRow['文字色'] || '#ffffff',
    buttonColor: activeRow['按鈕色'] || '#ff6695',
    buttonTextColor: activeRow['按鈕文字色'] || '#000000',
    closeButtonColor: activeRow['關閉色'] || '#ffffff',
    countdownTarget: countdown || '',
    desktopOnly: parseBool(activeRow['僅桌機'] || activeRow['桌機'] || activeRow['desktopOnly']),
    variant: activeRow['樣式'] || activeRow['variant'] || 'bar',
  };
};

async function fetchPopup(context) {
  const result = await getSheetData(context, POPUP_RANGE, (responseData) => {
    const rows = mapRows(responseData);
    return normalizeConfig(rows);
  });

  return result;
}

const jsonResponse = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    'Content-Type': 'application/json',
    ...CORS_HEADERS,
  },
});

const invalidResponse = (message, status = 400) => jsonResponse({ error: message }, status);

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

export async function onRequest(context) {
  try {
    const corsResponse = handleCORS(context.request);
    if (corsResponse) return corsResponse;

    const method = context.request.method.toUpperCase();
    if (!['GET', 'POST'].includes(method)) {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    const popup = await fetchPopup(context);

    if (method === 'GET') {
      return jsonResponse({ popup });
    }

    if (!popup || !popup.collectEmail) {
      return invalidResponse('Email collection is not enabled for the current popup');
    }

    const body = await context.request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim() : '';

    if (!email) {
      return invalidResponse('Email is required');
    }
    if (!isValidEmail(email)) {
      return invalidResponse('Invalid email format');
    }

    const timestamp = new Date().toISOString();
    const row = [
      timestamp,
      email,
      body.popupKey || popup.key || '',
      body.source || '',
    ];

    await appendSheetData(context, popup.emailRange || DEFAULT_EMAIL_RANGE, [row]);

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('[popup] error:', error);
    return jsonResponse({
      error: 'Internal Server Error',
      message: error.message,
    }, 500);
  }
}
