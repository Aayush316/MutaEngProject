import React, { useState, useContext } from "react";

const CartWishlistContext = React.createContext();

const CartWishlistProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart((prev) => [...prev, { ...product, quantity: 1 }]);
    }

    setWishlist((prev) => prev.filter((item) => item.id !== product.id));
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const updatedCart = prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      ).filter((item) => item.quantity > 0);
      return updatedCart;
    });
  };

  const addToWishlist = (product) => {
    if (!wishlist.find((item) => item.id === product.id)) {
      setWishlist((prev) => [...prev, product]);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartWishlistContext.Provider value={{ cart, addToCart, removeFromCart, wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </CartWishlistContext.Provider>
  );
};

const useCartWishlist = () => useContext(CartWishlistContext);

export { CartWishlistProvider, useCartWishlist };
