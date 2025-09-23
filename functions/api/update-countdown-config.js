/**
 * Cloudflare Pages Function for updating countdown configuration
 */

export async function onRequest(context) {
  const { request, env } = context;
  
  // Add CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    // Get authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const accessToken = authHeader.substring(7);
    
    // Verify Google OAuth token
    const userResponse = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`
    );
    
    if (!userResponse.ok) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const userInfo = await userResponse.json();
    
    // Check if user is authorized
    const authorizedEmails = (env.AUTHORIZED_EMAILS || '').split(',');
    if (!authorizedEmails.includes(userInfo.email)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: corsHeaders,
      });
    }

    // Get the configuration from request body
    const config = await request.json();
    
    // Update Google Sheets
    const spreadsheetId = env.SPREADSHEET_ID;
    const range = 'Countdown!A1:Z2';
    
    // Prepare data for Google Sheets
    const headers = Object.keys(config);
    const values = Object.values(config);
    
    const updateData = {
      range,
      majorDimension: 'ROWS',
      values: [headers, values]
    };

    const sheetsResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=RAW`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!sheetsResponse.ok) {
      throw new Error('Failed to update Google Sheets');
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error updating countdown config:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}