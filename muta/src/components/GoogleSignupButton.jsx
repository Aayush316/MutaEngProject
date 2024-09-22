// src/components/GoogleSignupButton.js
import React from 'react';
import { Button } from '@mui/material';
import { gapi } from 'gapi-script';

const GoogleSignupButton = ({ onLogin }) => {
  const handleGoogleSignup = async () => {
    const auth2 = gapi.auth2.getAuthInstance();

    try {
      const googleUser = await auth2.signIn({
        scope: 'profile email',
      });

      const idToken = googleUser.getAuthResponse().id_token;

      const response = await fetch('http://localhost:3000/api/auth/google-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }), 
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.user);
      } else {
        console.error('Signup error:', data.message);
      }
    } catch (error) {
      console.error('Google Sign-Up failed', error);
    }
  };

  return (
    <Button variant="outlined" color="primary" fullWidth onClick={handleGoogleSignup}>
      Sign Up with Google
    </Button>
  );
};

export default GoogleSignupButton;
