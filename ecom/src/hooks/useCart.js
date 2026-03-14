

import { useState, useEffect } from 'react';

export function useCart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(stored);
  }, []);

  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
    window.dispatchEvent(new Event('storage'));
  };

  const getItemQuantity = (variantId) => {
    const item = cartItems.find(i => i.variant_id === variantId);
    return item ? item.quantity : 0;
  };

  const addToCart = (product, variant, selectedQty = 1) => {
    if (!variant || !product) return;
    
    const exists = cartItems.find(i => i.variant_id === variant.id);
    
    if (exists) {
      const updated = cartItems.map(i =>
        i.variant_id === variant.id 
          ? { ...i, quantity: Math.min(i.quantity + selectedQty, i.stock) } 
          : i
      );
      saveCart(updated);
    } else {
      const discountPrice = product.discount_percent > 0 
        ? product.price * (1 - product.discount_percent / 100) 
        : product.price;

      saveCart([
        ...cartItems,
        {
          variant_id: variant.id,
          product_id: product.id,
          title: product.title,
          image: variant.image || product.images?.[0],
          price: Number(discountPrice), 
          variantName: variant.name,
          color: variant.color,
          stock: Number(variant.stock) || 0,
          quantity: Number(selectedQty) 
        }
      ]);
    }
  };

  const updateQuantity = (variantId, newQty) => {
    const updated = cartItems.map(item => {
      if (item.variant_id === variantId) {
        const validQty = Math.max(1, Math.min(newQty, item.stock));
        return { ...item, quantity: validQty };
      }
      return item;
    });
    saveCart(updated);
  };

  const removeFromCart = (variantId) => {
    const updated = cartItems.filter(i => i.variant_id !== variantId);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const total = cartItems.reduce((acc, i) => acc + (Number(i.price) * i.quantity), 0);

  return { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    total, 
    getItemQuantity, 
    clearCart 
  };
}