'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const CartContext = createContext();

// Cart actions
const CART_ACTIONS = {
  SET_CART: 'SET_CART',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SET_LOADING: 'SET_LOADING'
};

// Cart reducer
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.SET_CART:
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        loading: false
      };
    
    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        total: 0
      };
    
    default:
      return state;
  }
}

// Initial state
const initialState = {
  items: [],
  total: 0,
  loading: true
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { data: session, status } = useSession();

  // Fetch cart when user logs in
  useEffect(() => {
    if (status === 'loading') return;
    
    if (session) {
      fetchCart();
    } else {
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  }, [session, status]);

  const fetchCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const response = await fetch('/api/cart');
      if (response.ok) {
        const cartData = await response.json();
        dispatch({ type: CART_ACTIONS.SET_CART, payload: cartData });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!session) {
      alert('Please sign in to add items to cart');
      return false;
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.ok) {
        const updatedCart = await response.json();
        dispatch({ type: CART_ACTIONS.SET_CART, payload: updatedCart });
        return true;
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add item to cart');
        return false;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!session) return false;

    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.ok) {
        const updatedCart = await response.json();
        dispatch({ type: CART_ACTIONS.SET_CART, payload: updatedCart });
        return true;
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update cart');
        return false;
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      alert('Failed to update cart');
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    if (!session) return false;

    try {
      const response = await fetch(`/api/cart?productId=${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedCart = await response.json();
        dispatch({ type: CART_ACTIONS.SET_CART, payload: updatedCart });
        return true;
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Failed to remove item from cart');
      return false;
    }
  };

  const clearCart = async () => {
    if (!session) return false;

    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedCart = await response.json();
        dispatch({ type: CART_ACTIONS.SET_CART, payload: updatedCart });
        return true;
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart');
      return false;
    }
  };

  const getItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart: state,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getItemCount,
    refreshCart: fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}