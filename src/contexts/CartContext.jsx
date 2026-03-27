import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const localCart = localStorage.getItem('hastkala_cart');
      if (localCart) {
        const parsed = JSON.parse(localCart);
        // Ensure all items have a valid 24-character ObjectId to prevent order failures
        return parsed.filter(item => {
          const id = item._id || item.id;
          return id && typeof id === 'string' && id.length === 24;
        });
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('hastkala_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    // Normalize: always use _id if available, fallback to id
    const productId = product._id || product.id;
    const normalizedProduct = { ...product, id: productId };

    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === productId);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...normalizedProduct, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
