import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Button, Grid } from '@mui/material';
import { useCartWishlist } from './CartWishlistContext';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useCartWishlist();

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success('Item added to cart');
  };

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Card sx={{ padding: '20px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)', borderRadius: '12px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          My Wishlist
        </Typography>
        {wishlist.length > 0 ? (
          <Grid container spacing={2}>
            {wishlist.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ display: 'flex', flexDirection: 'column', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '12px' }}>
                  <CardMedia
                    component="img"
                    sx={{ height: 200, borderRadius: '12px 12px 0 0' }}
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{product.description}</Typography>
                    <Typography variant="h6" color="text.primary" sx={{ marginTop: 'auto' }}>{`₹${product.price.toFixed(2)} INR`}</Typography>
                  </CardContent>
                  <Box sx={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddToCart(product)}
                      sx={{ borderRadius: '20px', padding: '10px 15px' }}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeFromWishlist(product.id)}
                      sx={{ borderRadius: '20px', padding: '10px 15px' }}
                    >
                      Remove
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
            <Typography variant="h6" color="text.secondary">Your wishlist is empty</Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default Wishlist;
