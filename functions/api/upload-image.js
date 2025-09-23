/**
 * Cloudflare Pages Function for image upload to R2
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

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: 'Invalid file type' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ error: 'File too large' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `admin-uploads/${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`;

    // Upload to Cloudflare R2
    const bucket = env.R2_BUCKET; // This should be bound to your R2 bucket
    await bucket.put(filename, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // Generate public URL
    const publicUrl = `https://${env.R2_PUBLIC_DOMAIN}/${filename}`;

    return new Response(JSON.stringify({ 
      success: true, 
      url: publicUrl,
      filename: filename 
    }), {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}