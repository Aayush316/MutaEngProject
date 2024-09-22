import React from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';

const Home = () => {
  const advantages = [
    {
      title: 'Wide Product Range',
      description: 'We offer a diverse selection of products to meet all your needs, from electronics to fashion.',
      align: 'left',
    },
    {
      title: 'Unbeatable Prices',
      description: 'Shop with us to find the best deals and discounts, ensuring you get the best value for your money.',
      align: 'right',
    },
    {
      title: 'Fast Shipping',
      description: 'Enjoy fast and reliable shipping, so you can receive your orders in no time.',
      align: 'left',
    },
    {
      title: 'Customer Support',
      description: 'Our dedicated support team is available to assist you with any inquiries or issues.',
      align: 'right',
    },
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom align="center" fontWeight="bold">
        Welcome to Our E-Commerce Store!
      </Typography>
      <Typography variant="body1" gutterBottom align="center" color="text.secondary">
        Discover a wide range of products at unbeatable prices. 
        Join us today to start your shopping journey!
      </Typography>

      <Grid container spacing={4} sx={{ mt: 3 }}>
        {advantages.map((advantage, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                border: '1px solid #e0e0e0',
                backgroundColor: advantage.align === 'left' ? '#f9f9f9' : '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: advantage.align === 'left' ? 'flex-start' : 'flex-end',
              }}
            >
              <Typography variant="h5" fontWeight="500" gutterBottom>
                {advantage.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {advantage.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
