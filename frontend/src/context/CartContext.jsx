import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const CART_KEY = "cart";
  const [cart, cartSetter] = useState(
    localStorage.getItem(CART_KEY)
      ? JSON.parse(localStorage.getItem(CART_KEY))
      : []);

  const setCart = (cartData) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartData));
    cartSetter(cartData);
  };

  const addToCart = (product) => {
    const newCart = [...cart, product];
    setCart(newCart);
  }

  const clearCart = () => {
    localStorage.removeItem(CART_KEY);
    cartSetter([]);
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

