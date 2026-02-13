const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function handleCORS(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: CORS_HEADERS,
    });
  }
}

function isValidEmail(value) {
  if (!value) return false;
  const normalized = String(value).trim();
  if (!normalized) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

export async function onRequest(context) {
  try {
    const corsResponse = handleCORS(context.request);
    if (corsResponse) return corsResponse;

    if (context.request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      });
    }

    const wordpressUrl = context.env.WORDPRESS_URL;
    const formId = context.env.WORDPRESS_CF7_FORM_ID || '353';
    const defaultSubject = context.env.WORDPRESS_CF7_SUBJECT || '新電子報訂閱';
    const defaultName = context.env.WORDPRESS_CF7_NAME || '訂閱會員';

    if (!wordpressUrl) {
      return new Response(JSON.stringify({ error: 'WordPress URL not configured' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      });
    }

    const body = await context.request.json().catch(() => null);
    const email = body?.email?.trim();
    const subject = body?.subject?.trim() || defaultSubject;
    const name = body?.name?.trim() || defaultName;
    const unitTag = body?.unitTag?.trim() || `wpcf7-f${formId}-p0-o1`;
    const containerPost = body?.containerPost ?? '0';

    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      });
    }

    const formData = new FormData();
    formData.set('_wpcf7', String(formId));
    formData.set('_wpcf7_container_post', String(containerPost));
    formData.set('_wpcf7_unit_tag', unitTag);
    formData.set('your-email', email);
    formData.set('your-subject', subject);
    formData.set('your-name', name);

    const endpoint = `${wordpressUrl}/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`;
    const wpResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });

    const responseText = await wpResponse.text();
    let responseData = null;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }

    return new Response(JSON.stringify({
      ok: wpResponse.ok,
      status: wpResponse.status,
      data: responseData,
    }), {
      status: wpResponse.ok ? 200 : wpResponse.status,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
      },
    });
  } catch (error) {
    console.error('Popup submit error:', error);
    return new Response(JSON.stringify({
      error: error.message,
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
      },
    });
  }
}
