/**
 * Google Sheets API service for Cloudflare Workers
 * Handles authentication and data fetching from Google Sheets
 */

/**
 * Create and sign a JWT token for Google API authentication
 * @param {string} clientEmail - Google service account email
 * @param {string} privateKey - Google service account private key
 * @returns {string} Signed JWT token
 */
async function createJWT(clientEmail, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const jwtHeader = {
    alg: 'RS256',
    typ: 'JWT'
  };
  const jwtClaim = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  // Encode JWT parts
  const encodedHeader = btoa(JSON.stringify(jwtHeader));
  const encodedClaim = btoa(JSON.stringify(jwtClaim));
  const signatureInput = `${encodedHeader}.${encodedClaim}`;

  // Convert PEM to ArrayBuffer
  const pemHeader = '-----BEGIN PRIVATE KEY-----';
  const pemFooter = '-----END PRIVATE KEY-----';
  const pemContents = privateKey
    .replace(pemHeader, '')
    .replace(pemFooter, '')
    .replace(/\s/g, '');
  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  // Sign the JWT
  const encoder = new TextEncoder();
  const messageData = encoder.encode(signatureInput);
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    messageData
  );
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));

  return `${signatureInput}.${encodedSignature}`;
}

/**
 * Get Google OAuth access token using JWT
 * @param {string} jwt - Signed JWT token
 * @returns {string} Access token
 */
async function getAccessToken(jwt) {
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const { access_token } = await tokenResponse.json();
  return access_token;
}

/**
 * Fetch data from Google Sheets
 * @param {string} accessToken - Google API access token
 * @param {string} spreadsheetId - Google Sheets spreadsheet ID
 * @param {string} range - Sheet range to fetch
 * @returns {Object} Raw spreadsheet response data
 */
async function fetchSheetData(accessToken, spreadsheetId, range) {
  const sheetsResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  return await sheetsResponse.json();
}

/**
 * Main service function to fetch and process Google Sheets data
 * @param {Object} context - Cloudflare Workers context (contains env variables)
 * @param {string} range - Sheet range to fetch
 * @param {Function} processor - Function to process the raw sheet data
 * @returns {Object} Processed data
 */
export async function getSheetData(context, range, processor) {
  // Get environment variables from Cloudflare
  const clientEmail = context.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = context.env.GOOGLE_PRIVATE_KEY;

  // Validate environment variables exist
  if (!clientEmail) {
    throw new Error('Missing environment variable: GOOGLE_CLIENT_EMAIL');
  }
  if (!privateKey) {
    throw new Error('Missing environment variable: GOOGLE_PRIVATE_KEY');
  }

  const spreadsheetId = context.env.SHEET_ID;
  if (!spreadsheetId) {
    throw new Error('Missing environment variable: SHEET_ID');
  }

  // Handle different private key formats
  if (typeof privateKey === 'string') {
    // Replace escaped newlines with actual newlines
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  // Create JWT and get access token
  const jwt = await createJWT(clientEmail, privateKey);
  const accessToken = await getAccessToken(jwt);

  // Fetch spreadsheet data
  const responseData = await fetchSheetData(accessToken, spreadsheetId, range);

  // Process the data using the provided processor function
  return processor(responseData);
}

/**
 * Standard CORS headers for API responses
 */
export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '600',
};

/**
 * Handle CORS preflight requests
 * @param {Request} request - Incoming request
 * @returns {Response|null} CORS response or null if not OPTIONS
 */
export function handleCORS(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
        ...CORS_HEADERS,
      },
    });
  }
  return null;
}
