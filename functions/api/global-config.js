/**
 * Cloudflare Pages Function for Global Config API
 * Handles fetching configuration from Google Sheets
 */

const GOOGLE_SHEETS_API_KEY = 'YOUR_GOOGLE_SHEETS_API_KEY';
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';

// Google Sheets ranges for different configurations
const RANGES = {
  popup: 'Popup!A:Z',
  countdown: 'Countdown!A:Z',
};

async function fetchGoogleSheet(range) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${GOOGLE_SHEETS_API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Google Sheet:', error);
    return null;
  }
}

function parseSheetData(data, type) {
  if (!data || !data.values || data.values.length < 2) {
    return null;
  }

  const [headers, ...rows] = data.values;
  const config = {};

  // Convert the first row of data to configuration object
  if (rows.length > 0) {
    const row = rows[0];
    headers.forEach((header, index) => {
      const value = row[index];
      if (value !== undefined && value !== '') {
        // Handle boolean values
        if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
          config[header] = value.toLowerCase() === 'true';
        }
        // Handle numbers
        else if (!isNaN(value) && !isNaN(parseFloat(value))) {
          config[header] = parseFloat(value);
        }
        // Handle strings
        else {
          config[header] = value;
        }
      }
    });
  }

  return config;
}

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
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

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    // Fetch both popup and countdown configurations
    const [popupData, countdownData] = await Promise.all([
      fetchGoogleSheet(RANGES.popup),
      fetchGoogleSheet(RANGES.countdown),
    ]);

    const config = {
      popup: parseSheetData(popupData, 'popup'),
      countdown: parseSheetData(countdownData, 'countdown'),
    };

    return new Response(JSON.stringify(config), {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error in global-config API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}