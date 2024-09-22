import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import Home from './components/Home';
import ResetPassword from './components/ResetPassword';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setIsAuthenticated(false); 
    localStorage.removeItem('token');
  }, []);

  const handleLogin = (user) => {
    setUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('token', user.token);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token'); 
  };

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const addToWishlist = (product) => {
    setWishlist((prevWishlist) => [...prevWishlist, product]);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prevWishlist) => prevWishlist.filter(item => item.id !== productId));
  };

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
        <Route path="/products" element={<ProductCard addToCart={addToCart} addToWishlist={addToWishlist} />} />
        <Route 
          path="/cart" 
          element={
              <Cart />
          } 
        />
        <Route 
          path="/wishlist" 
          element={
              <Wishlist />
          } 
        />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
};

export default App;
