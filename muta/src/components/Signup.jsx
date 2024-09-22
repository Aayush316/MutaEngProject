import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Divider, Box } from '@mui/material';
import GoogleLoginButton from './GoogleLoginButton';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom'; 

const Signup = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, recaptchaToken }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Account Created Successfully'); 
        navigate('/login'); 
      } else {
        setError(data.message);
        toast.error(data.message); 
      }
    } catch (err) {
      setError("Failed to sign up. Please try again later.");
      toast.error('Failed to sign up. Please try again later.'); 
    }
  };

  const handleRecaptcha = (token) => {
    setRecaptchaToken(token);
  };

  const handleGoogleLoginSuccess = (userData) => {
    onLogin(userData); 
    navigate('/products'); 
  };

  return (
    <Container maxWidth="sm" sx={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', padding: '20px', marginTop: '40px' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>Sign Up</Typography>
      {error && <Typography color="error" align="center">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField 
          label="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          fullWidth 
          required 
          variant="outlined"
          margin="normal"
        />
        <TextField 
          label="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          fullWidth 
          required 
          variant="outlined"
          margin="normal"
        />
        <TextField 
          label="Password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          fullWidth 
          required 
          variant="outlined"
          margin="normal"
        />
        <TextField 
          label="Confirm Password" 
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          fullWidth 
          required 
          variant="outlined"
          margin="normal"
        />
        <Box sx={{ my: 2 }}>
          <ReCAPTCHA
            sitekey='site key'
            onChange={handleRecaptcha}
          />
        </Box>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ borderRadius: '20px', padding: '10px' }}>
          Sign Up
        </Button>
        <Divider sx={{ my: 2 }} />
        <Typography align="center">Or</Typography>
        <GoogleLoginButton onLogin={handleGoogleLoginSuccess} />
      </form>
    </Container>
  );
};

export default Signup;
