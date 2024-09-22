import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // Track the step of the process

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (step === 1) {
      try {
        const response = await fetch('http://localhost:3000/api/auth/request-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        console.log(data)

        if (response.ok) {
          setMessage("OTP sent to your email. Please enter it below.");
          setStep(2); 
        } else {
          setError(data.message || "Failed to send OTP. Please try again.");
        }
      } catch (err) {
        setError("Failed to send OTP. Please try again later.");
      }
    } else {
      try {
        const response = await fetch('http://localhost:3000/api/auth/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, otp }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage("OTP verified. You can now set a new password.");
          setStep(3);
        } else {
          setError(data.message || "Invalid OTP. Please try again.");
        }
      } catch (err) {
        setError("Failed to verify OTP. Please try again later.");
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Reset Password</Typography>
      {message && <Typography color="success.main">{message}</Typography>}
      {error && <Typography color="error.main">{error}</Typography>}
      <Box component="form" onSubmit={handleSubmit} sx={{ marginBottom: 4 }}>
        <TextField 
          label="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          fullWidth 
          required 
          style={{ marginBottom: '16px' }}
          disabled={step > 1}
        />
        {step > 1 && (
          <TextField 
            label="OTP" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
            fullWidth 
            required 
            style={{ marginBottom: '16px' }}
          />
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {step === 1 ? 'Send OTP' : 'Verify OTP'}
        </Button>
      </Box>
      {step === 3 && (
        <>
          <Typography variant="h5" gutterBottom style={{ marginTop: '32px' }}>
            Set New Password
          </Typography>
          <PasswordResetForm email={email} />
        </>
      )}
    </Container>
  );
};

const PasswordResetForm = ({ email }) => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navi = useNavigate();
  
    const handleReset = async (e) => {
      e.preventDefault();
      setMessage('');
      setError('');
  
      try {
        const response = await fetch('http://localhost:3000/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setMessage("Password has been reset successfully.");
          navi('/login');
        } else {
          setError(data.message || "Failed to reset password.");
        }
      } catch (err) {
        setError("Failed to reset password. Please try again later.");
      }
    };
  
    return (
      <Box component="form" onSubmit={handleReset}>
        <TextField 
          label="New Password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          fullWidth 
          required 
          style={{ marginBottom: '16px' }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Reset Password
        </Button>
      </Box>
    );
  };
  

export default ResetPassword;
