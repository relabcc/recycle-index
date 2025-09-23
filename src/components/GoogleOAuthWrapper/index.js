import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GoogleOAuthWrapper = ({ children, clientId }) => {
  // The client ID should be set as an environment variable
  const googleClientId = clientId || process.env.GATSBY_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
  
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
};

export default GoogleOAuthWrapper;