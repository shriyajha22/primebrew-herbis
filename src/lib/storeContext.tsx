'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Coupon, User } from './types';
import { initialCoupons } from './seedData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  cart: CartItem[];
  addToCart: (product: Product, selectedWeight?: string, quantity?: number) => void;
  removeFromCart: (productId: string, weight: string) => void;
  updateQuantity: (productId: string, weight: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTax: number;
  cartTotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  giftWrap: boolean;
  setGiftWrap: (val: boolean) => void;
  
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Auth
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  loginAsDemoCustomer: () => void;
  loginAsDemoAdmin: () => void;
  logout: () => void;

  // UI Drawers & Toasts
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [giftWrap, setGiftWrap] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>(["prod-2"]);
  const [currentUser, setCurrentUser] = useState<User | null>({
    _id: "usr-customer",
    name: "Ananya Sharma",
    email: "customer@example.com",
    role: "customer",
    addresses: [
      {
        fullName: "Ananya Sharma",
        phone: "+91 9876543210",
        email: "customer@example.com",
        street: "42 Tea Plantation Road, Green Valley",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560001",
        isDefault: true
      }
    ],
    wishlist: ["prod-2"],
    walletBalance: 250
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Local storage persistence
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('pbh_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('pbh_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('pbh_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('pbh_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product: Product, selectedWeight?: string, quantity = 1) => {
    const weight = selectedWeight || (product.weightVariants?.[0]?.weight || "Standard");
    const weightVariant = product.weightVariants?.find((v) => v.weight === weight);
    const unitPrice = weightVariant ? weightVariant.price : product.price;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product._id === product._id && item.selectedWeight === weight
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, selectedWeight: weight, unitPrice, quantity }];
      }
    });

    showToast(`Added ${quantity}x "${product.name}" to cart!`, 'success');
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, weight: string) => {
    setCart((prev) => prev.filter((item) => !(item.product._id === productId && item.selectedWeight === weight)));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, weight: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, weight);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product._id === productId && item.selectedWeight === weight
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      cartDiscount = (cartSubtotal * appliedCoupon.discountValue) / 100;
      if (appliedCoupon.maxDiscount && cartDiscount > appliedCoupon.maxDiscount) {
        cartDiscount = appliedCoupon.maxDiscount;
      }
    } else {
      cartDiscount = appliedCoupon.discountValue;
    }
  }

  const cartShipping = cartSubtotal > 799 || cart.length === 0 ? 0 : 70;
  const cartTax = Math.round((cartSubtotal - cartDiscount) * 0.05 * 100) / 100; // 5% GST on tea
  const cartTotal = Math.max(0, Math.round((cartSubtotal - cartDiscount + cartShipping + cartTax + (giftWrap ? 49 : 0)) * 100) / 100);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = initialCoupons.find((c) => c.code === cleanCode);
    if (!found) {
      return { success: false, message: 'Invalid coupon code. Try "HERBAL15" or "FARM2CUP"' };
    }
    if (cartSubtotal < found.minOrderAmount) {
      return { success: false, message: `Minimum order amount for ${found.code} is ₹${found.minOrderAmount}` };
    }

    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied!`, 'success');
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to Wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const loginAsDemoCustomer = () => {
    setCurrentUser({
      _id: "usr-customer",
      name: "Ananya Sharma",
      email: "customer@example.com",
      role: "customer",
      addresses: [
        {
          fullName: "Ananya Sharma",
          phone: "+91 9876543210",
          email: "customer@example.com",
          street: "42 Tea Plantation Road, Green Valley",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560001",
          isDefault: true
        }
      ],
      wishlist,
      walletBalance: 250
    });
    showToast("Logged in as Customer (Ananya Sharma)", "success");
  };

  const loginAsDemoAdmin = () => {
    setCurrentUser({
      _id: "usr-admin",
      name: "PrimeBrew Admin",
      email: "admin@primebrewherbis.com",
      role: "admin",
      addresses: [],
      wishlist: [],
      walletBalance: 1000
    });
    showToast("Logged in as Admin (PrimeBrew Admin)", "success");
  };

  const logout = () => {
    setCurrentUser(null);
    showToast("Logged out successfully", "info");
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTax,
        cartTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        giftWrap,
        setGiftWrap,
        wishlist,
        toggleWishlist,
        isInWishlist,
        currentUser,
        setCurrentUser,
        loginAsDemoCustomer,
        loginAsDemoAdmin,
        logout,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
