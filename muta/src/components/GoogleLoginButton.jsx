import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from './UserContext';  

const GoogleLoginButton = ({ onLogin }) => {
  const navigate = useNavigate();
  const { setUser } = useUser(); 

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const credential = credentialResponse.profilrObj;
      console.log(credential)
      const userData = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${credential}`,
        },
      });
      const user = await userData.json();
      
      console.log(user)
      const userInfo = { email: user.email, name: user.name, token: credential };

      
      onLogin(userInfo);
      setUser(userInfo); 
      localStorage.setItem('token', credential); 
      
      toast.success('Successfully logged in with Google!');
      
      // Redirect to home page
      navigate('/home');
    } catch (error) {
      toast.error('Google login failed. Please try again.');
      console.error('Login Failed:', error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleLogin}
      onFailure={(error) => console.error('Google Login Failed:', error)}
      style={{ marginTop: '16px' }}
    />
  );
};

export default GoogleLoginButton;
