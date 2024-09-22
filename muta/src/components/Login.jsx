import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Divider, Card, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-toastify';
import { useUser } from './UserContext';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState('');
    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!recaptchaToken) {
            setError("Please complete the reCAPTCHA.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, recaptchaToken }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                onLogin(data.user);
                setUser(data.user);
                toast.success('JWT Token created!');
                navigate('/home');
            } else {
                setError(data.message);
                toast.error(data.message);
            }
        } catch (err) {
            setError('Login failed. Please try again.');
            toast.error('Login failed. Please try again.');
        }
    };

    const handleRecaptcha = (token) => {
        setRecaptchaToken(token);
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '4rem' }}>
            <Card
                sx={{
                    padding: '2rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                }}
            >
                <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                    sx={{ fontWeight: 600, color: '#333' }}
                >
                    Welcome Back
                </Typography>
                <Typography
                    variant="body1"
                    align="center"
                    gutterBottom
                    sx={{ marginBottom: '1.5rem', color: '#666' }}
                >
                    Please log in to your account.
                </Typography>

                {error && (
                    <Typography color="error" align="center" gutterBottom>
                        {error}
                    </Typography>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                        sx={{ marginBottom: '1.5rem' }}
                        InputProps={{
                            style: { borderRadius: '8px' },
                        }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                        sx={{ marginBottom: '1.5rem' }}
                        InputProps={{
                            style: { borderRadius: '8px' },
                        }}
                    />
                    <Grid container justifyContent="center" sx={{ marginBottom: '1rem' }}>
                        <ReCAPTCHA
                            sitekey='secret key'
                            onChange={handleRecaptcha}
                        />
                    </Grid>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            padding: '12px',
                            fontSize: '16px',
                            fontWeight: 600,
                            backgroundColor: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#115293',
                            },
                            borderRadius: '8px',
                        }}
                    >
                        Login
                    </Button>

                    <Divider sx={{ margin: '2rem 0' }} />

                    <Typography align="center" variant="body1" gutterBottom>
                        Or
                    </Typography>

                    <GoogleLoginButton onLogin={onLogin} />

                    <Typography
                        variant="body2"
                        align="center"
                        sx={{ marginTop: '1.5rem', color: '#1976d2' }}
                    >
                        <a href="/reset-password" style={{ textDecoration: 'none', color: '#1976d2' }}>
                            Forgot Password?
                        </a>
                    </Typography>
                </form>
            </Card>
        </Container>
    );
};

export default Login;
