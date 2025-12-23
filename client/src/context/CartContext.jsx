import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as cartApi from '../api/cart.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();
const CART_KEY = 'abdulzon_cart';

const loadCart = () => {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (_err) {
    return [];
  }
};

const persistCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

const summarize = (items) => ({
  subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  count: items.reduce((sum, item) => sum + item.quantity, 0)
});

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => loadCart());
  const [mode, setMode] = useState('guest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const mergedRef = useRef(false);

  useEffect(() => {
    const init = async () => {
      if (user) {
        setLoading(true);
        try {
          if (!mergedRef.current) {
            const guestCart = loadCart();
            for (const item of guestCart) {
              await cartApi.addCartItem({ productId: item.productId, quantity: item.quantity });
            }
            localStorage.removeItem(CART_KEY);
            mergedRef.current = true;
          }
          const cart = await cartApi.fetchCart();
          setCartItems(cart.items);
          setMode('server');
          setError('');
        } catch (err) {
          setError(err.message || 'Unable to load cart');
        } finally {
          setLoading(false);
        }
      } else {
        mergedRef.current = false;
        setMode('guest');
        const guestCart = loadCart();
        setCartItems(guestCart);
      }
    };

    init();
  }, [user]);

  const updateLocalCart = (updater) => {
    setCartItems((prev) => {
      const next = updater(prev);
      persistCart(next);
      return next;
    });
    setMode('guest');
  };

  const handleServerCart = async (action) => {
    if (!user) return null;
    setLoading(true);
    try {
      const cart = await action();
      setCartItems(cart.items);
      setMode('server');
      setError('');
      return cart;
    } catch (err) {
      setError(err.message || 'Cart update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      await handleServerCart(() => cartApi.addCartItem({ productId: product._id, quantity }));
      return;
    }
    updateLocalCart((items) => {
      const existing = items.find((item) => item.productId === product._id);
      if (existing) {
        return items.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...items,
        {
          productId: product._id,
          title: product.title,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity
        }
      ];
    });
  };

  const updateQuantity = async (productId, quantity) => {
    if (user) {
      await handleServerCart(() => cartApi.updateCartItem(productId, quantity));
      return;
    }
    updateLocalCart((items) =>
      items
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = async (productId) => {
    if (user) {
      await handleServerCart(() => cartApi.removeCartItem(productId));
      return;
    }
    updateLocalCart((items) => items.filter((item) => item.productId !== productId));
  };

  const clearCart = async () => {
    if (user) {
      setCartItems([]);
      setMode('server');
      return;
    }
    persistCart([]);
    setCartItems([]);
    setMode('guest');
  };

  const refreshCart = async () => {
    if (!user) return;
    await handleServerCart(() => cartApi.fetchCart());
  };

  const summary = useMemo(() => summarize(cartItems), [cartItems]);

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    subtotal: summary.subtotal,
    cartCount: summary.count,
    loading,
    error,
    mode
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
