import { getSheetData, handleCORS, CORS_HEADERS } from '../services/google-sheets.js';

/**
 * Process events sheet data - expects tabular data with headers
 */
function processEventsData(responseData) {
  if (!responseData.values) {
    throw new Error('No data returned from spreadsheet');
  }

  const header = responseData.values[0];
  const data = responseData.values.slice(1);
  const result = data.map(row => {
    return row.reduce((acc, value, index) => {
      acc[header[index]] = value;
      return acc;
    }, {});
  });

  return result;
}

export async function onRequest(context) {
  try {
    // Handle CORS preflight requests
    const corsResponse = handleCORS(context.request);
    if (corsResponse) {
      return corsResponse;
    }

    // Get the range from query parameters
    const url = new URL(context.request.url);
    const range = url.searchParams.get('range');

    if (!range) {
      return new Response(JSON.stringify({
        error: 'Missing required parameter: range',
        example: '?range=Sheet1!A1:Z100'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      });
    }

    // Fetch and process the sheet data
    const result = await getSheetData(context, range, processEventsData);

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      details: error.stack
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
      },
    });
  }
}
