import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate(isAuthenticated ? '/home' : '/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#2c2c2c', boxShadow: 'none' }}>
      <Toolbar>
        <Typography
          variant="h6"
          onClick={handleLogoClick}
          sx={{ flexGrow: 1, cursor: 'pointer', '&:hover': { color: '#ffa726' } }}
        >
          E-Commerce Store
        </Typography>
        {!isAuthenticated ? (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/products">Products</Button>
            <Button color="inherit" component={Link} to="/cart">Cart</Button>
            <Button color="inherit" component={Link} to="/wishlist">Wishlist</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
