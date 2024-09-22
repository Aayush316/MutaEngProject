import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Button, Divider } from '@mui/material';
import { useCartWishlist } from './CartWishlistContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useUser } from './UserContext';  

const Cart = () => {
  const { cart, removeFromCart } = useCartWishlist();
  const { user } = useUser(); 

  const calculateTotalAmount = () => {
    return cart.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  const handleRemoveFromCart = (id) => {
    removeFromCart(id);
    toast.info('Item removed from cart');
  };

  const checkoutHandler = async () => {
    try {
      const amount = calculateTotalAmount() * 100;
      const token = localStorage.getItem('token');
  
      if (!token || !user) {
        toast.error("User not logged in. Please log in to proceed.");
        return;
      }
  
      const userEmail = user.email;
      const { data: { key } } = await axios.get("http://localhost:3000/api/getkey");
      const { data: { order } } = await axios.post("http://localhost:3000/api/checkout", {
        amount,
        userEmail,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
  
      const options = {
        key, 
        amount: order.amount, 
        currency: "INR",
        name: "E-Commerce Store", 
        description: "Test Transaction",
        image: "https://example.com/your_logo", 
        order_id: order.id, 
        callback_url: "http://localhost:3000/api/paymentverification", 
        prefill: {
          name: user.name || "Customer Name", 
          email: userEmail,
          contact: user.contact || "9000090000", 
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
        handler: async function (response) {
          const { data } = await axios.post("http://localhost:3000/api/paymentverification", response, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (data.success) {
            toast.success("Payment successful!");
            window.location.href = data.redirectUrl;
          } else {
            toast.error("Payment failed. Please try again.");
            window.location.href = data.redirectUrl;
          }
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment was not completed. Please try again.");
          }
        }
      };
  
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Error during checkout. Please try again.");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ maxWidth: '800px', mx: 'auto', backgroundColor: '#f5f5f5', borderRadius: 2, boxShadow: 3, p: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
          Shopping Cart
        </Typography>
        {cart.length > 0 ? (
          <Box>
            {cart.map((product) => (
              <Card key={product.id} sx={{ display: 'flex', alignItems: 'center', mb: 2, boxShadow: 1 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 120, borderRadius: '8px' }}
                  image={product.image}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight="500">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>{product.description}</Typography>
                  <Typography variant="body1" fontWeight="bold" color="primary">
                    ₹{product.price.toFixed(2)} INR
                  </Typography>
                  <Typography variant="body2" color="text.disabled">Quantity: {product.quantity}</Typography>
                </CardContent>
                <Box p={2}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemoveFromCart(product.id)}
                    sx={{ fontWeight: 'bold' }}
                  >
                    Remove
                  </Button>
                </Box>
              </Card>
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" fontWeight="bold" align="center">
              Total Amount: ₹{calculateTotalAmount().toFixed(2)} INR
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={checkoutHandler}
              fullWidth
              sx={{ mt: 2, py: 1.5, fontWeight: 'bold', borderRadius: '10px' }}
            >
              Checkout with Razorpay
            </Button>
          </Box>
        ) : (
          <Typography variant="h6" align="center" color="text.secondary">
            Your cart is empty
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Cart;
