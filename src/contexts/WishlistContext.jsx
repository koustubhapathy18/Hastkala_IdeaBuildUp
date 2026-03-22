import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('hastkala_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('hastkala_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const isWishlisted = (productId) =>
    wishlist.some((item) => item.id === productId || item._id === productId);

  const addToWishlist = (product) => {
    const productId = product._id || product.id;
    const normalized = { ...product, id: productId };
    setWishlist((prev) => {
      if (prev.some((item) => item.id === productId)) return prev;
      return [...prev, normalized];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) =>
      prev.filter((item) => item.id !== productId && item._id !== productId)
    );
  };

  const toggleWishlist = (product) => {
    const productId = product._id || product.id;
    if (isWishlisted(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isWishlisted, toggleWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
