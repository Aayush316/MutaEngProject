import React, { useState } from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, Button, Box, Pagination } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useCartWishlist } from './CartWishlistContext'; 

const products = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `Product ${index + 1}`,
  price: (index + 1) * 10,
  description: `This is a short description of product ${index + 1}.`,
  image: 'https://via.placeholder.com/150',
}));

const itemsPerPage = 9;

const ProductCard = () => {
  const [page, setPage] = useState(1);
  const { addToCart, addToWishlist } = useCartWishlist(); 
  const currentProducts = products.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} sx={{ width: "100%", padding: "20px", backgroundColor: '#f5f5f5' }}>
      <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" sx={{ width: "75%" }}>
        {currentProducts.map((product) => (
          <Card key={product.id} sx={{ width: '300px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}>
            <CardMedia
              component="img"
              height="140"
              image={product.image}
              alt={product.name}
              sx={{ borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.description}
              </Typography>
              <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'bold' }}>
                {`₹${product.price.toFixed(2)} INR`}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between' }}>
              <Button 
                size="small" 
                variant='contained' 
                color="primary" 
                startIcon={<AddShoppingCartIcon />} 
                onClick={() => addToCart(product)} 
                sx={{ flexGrow: 1, marginRight: '5px' }}
              >
                Add to Cart
              </Button>
              <Button 
                size="small" 
                variant='outlined' 
                color="secondary" 
                startIcon={<FavoriteIcon />} 
                onClick={() => addToWishlist(product)}
                sx={{ flexGrow: 1 }}
              >
                Wishlist
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={Math.ceil(products.length / itemsPerPage)}
          page={page}
          onChange={handleChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default ProductCard;
