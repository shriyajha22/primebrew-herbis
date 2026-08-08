'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { useStore } from '@/lib/storeContext';
import { Address, Order, User } from '@/lib/types';
import { ShieldCheck, CreditCard, Truck, CheckCircle2, FileText, Download, Building, Lock, UserCheck, LogIn, UserPlus, AlertCircle, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, cartSubtotal, cartDiscount, cartShipping, cartTax, cartTotal, clearCart, currentUser, setCurrentUser, logout, showToast } = useStore();

  // Mode: 'guest' | 'login' | 'register'
  const [authMode, setAuthMode] = useState<'guest' | 'login' | 'register'>('guest');

  // Delivery Address State (Completely blank by default for a clean guest checkout)
  const [address, setAddress] = useState<Address>({
    fullName: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: true,
  });

  // Pre-fill if currentUser logs in
  useEffect(() => {
    if (currentUser) {
      setAddress((prev) => ({
        fullName: prev.fullName || currentUser.name || '',
        phone: prev.phone || currentUser.phone || '',
        email: prev.email || currentUser.email || '',
        street: prev.street || currentUser.addresses?.[0]?.street || '',
        city: prev.city || currentUser.addresses?.[0]?.city || '',
        state: prev.state || currentUser.addresses?.[0]?.state || '',
        pincode: prev.pincode || currentUser.addresses?.[0]?.pincode || '',
        isDefault: true,
      }));
    }
  }, [currentUser]);

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Inline Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Inline Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');

  // GST & Payment states
  const [wantGstInvoice, setWantGstInvoice] = useState(false);
  const [gstDetails, setGstDetails] = useState({ companyName: '', gstin: '' });
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'Stripe' | 'Cash on Delivery'>('Razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Form Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!address.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    const cleanPhone = address.phone.trim().replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Phone number is required.';
    } else if (cleanPhone.length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!address.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(address.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!address.street.trim()) {
      newErrors.street = 'Street / House address is required.';
    }

    if (!address.city.trim()) {
      newErrors.city = 'City is required.';
    }

    if (!address.state.trim()) {
      newErrors.state = 'State is required.';
    }

    const cleanPincode = address.pincode.trim();
    if (!cleanPincode) {
      newErrors.pincode = 'Pincode is required.';
    } else if (!/^\d{6}$/.test(cleanPincode)) {
      newErrors.pincode = 'Pincode must be exactly 6 digits.';
    }

    if (wantGstInvoice) {
      if (!gstDetails.companyName.trim()) {
        newErrors.companyName = 'Company name is required for GST invoice.';
      }
      if (!gstDetails.gstin.trim()) {
        newErrors.gstin = 'GSTIN number is required.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Inline Login Handler
  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter both email and password.');
      return;
    }

    try {
      const storedUsersRaw = localStorage.getItem('pbh_users');
      const users: User[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      const match = users.find((u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase());

      const userToLogin: User = match || {
        _id: `usr-${Date.now()}`,
        name: loginEmail.split('@')[0],
        email: loginEmail.trim(),
        role: 'customer',
        addresses: [],
        wishlist: [],
        walletBalance: 100,
      };

      setCurrentUser(userToLogin);
      showToast(`Welcome back, ${userToLogin.name}!`, 'success');
      setAuthMode('guest');

      // Pre-fill delivery details intelligently
      setAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || userToLogin.name,
        email: userToLogin.email,
        phone: prev.phone || userToLogin.phone || '',
        street: prev.street || userToLogin.addresses?.[0]?.street || '',
        city: prev.city || userToLogin.addresses?.[0]?.city || '',
        state: prev.state || userToLogin.addresses?.[0]?.state || '',
        pincode: prev.pincode || userToLogin.addresses?.[0]?.pincode || '',
      }));
    } catch (e) {
      console.error(e);
      setLoginError('Unable to log in. Please try again.');
    }
  };

  // Inline Register Handler
  const handleInlineRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setRegError('All fields marked with * are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      setRegError('Please enter a valid email address.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Password and Confirm Password do not match.');
      return;
    }

    try {
      const storedUsersRaw = localStorage.getItem('pbh_users');
      const users: User[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      const duplicate = users.find((u) => u.email.toLowerCase() === regEmail.trim().toLowerCase());
      if (duplicate) {
        setRegError('An account with this email already exists. Please log in instead.');
        return;
      }

      const newUser: User = {
        _id: `usr-${Date.now()}`,
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        role: 'customer',
        addresses: [],
        wishlist: [],
        walletBalance: 250,
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem('pbh_users', JSON.stringify(updatedUsers));
      setCurrentUser(newUser);

      showToast(`Account created! Welcome to PrimeBrew Herbis, ${newUser.name}.`, 'success');
      setAuthMode('guest');

      setAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || newUser.name,
        email: newUser.email,
        phone: prev.phone || newUser.phone || '',
      }));
    } catch (e) {
      console.error(e);
      setRegError('Registration failed. Please try again.');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!validateForm()) {
      showToast('Please fix the errors in the delivery form before proceeding.', 'error');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      const order: Order = {
        _id: `ord-${Date.now()}`,
        orderNumber: `PBH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        items: cart.map((c) => ({
          productId: c.product._id,
          productName: c.product.name,
          image: c.product.images[0],
          weight: c.selectedWeight,
          quantity: c.quantity,
          price: c.unitPrice,
        })),
        shippingAddress: address,
        gstInvoice: wantGstInvoice ? gstDetails : undefined,
        paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
        orderStatus: 'Processing',
        trackingNumber: `SR-${Math.floor(100000000 + Math.random() * 900000000)}`,
        courierName: 'Shiprocket Express',
        subtotal: cartSubtotal,
        discount: cartDiscount,
        shippingFee: cartShipping,
        tax: cartTax,
        total: cartTotal,
        estimatedDelivery: 'August 8, 2026',
      };

      setCompletedOrder(order);
      clearCart();
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      showToast('Order Placed Successfully! Your invoice has been generated.', 'success');
    }, 1800);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const useSavedUserAddress = () => {
    if (currentUser && currentUser.addresses?.[0]) {
      const saved = currentUser.addresses[0];
      setAddress({
        fullName: saved.fullName || currentUser.name,
        phone: saved.phone || currentUser.phone || '',
        email: saved.email || currentUser.email,
        street: saved.street || '',
        city: saved.city || '',
        state: saved.state || '',
        pincode: saved.pincode || '',
        isDefault: true,
      });
      showToast('Saved address loaded!', 'info');
    }
  };

  if (completedOrder) {
    return (
      <div className="py-12 bg-brand-cream min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-card border border-brand-mint/30 shadow-premium p-8 space-y-6">
            <div className="text-center space-y-2 border-b border-gray-100 pb-6">
              <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-sky-700 bg-sky-50 px-3 py-1 rounded-badge">
                Payment & Order Confirmed
              </span>
              <h1 className="font-heading font-extrabold text-2xl text-brand-darkGreen">
                Thank You for Your Order!
              </h1>
              <p className="text-xs text-gray-500">
                Order Number: <strong className="text-brand-darkGreen font-mono">{completedOrder.orderNumber}</strong>
              </p>
            </div>

            {/* Order Details Invoice View */}
            <div className="bg-brand-beige p-5 rounded-card border border-brand-mint/30 text-xs space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <div>
                  <h3 className="font-bold text-brand-darkGreen">PrimeBrew Herbis Invoice</h3>
                  <p className="text-[11px] text-gray-500">Official Tax Invoice</p>
                </div>
                <button
                  onClick={handlePrintInvoice}
                  className="bg-brand-darkGreen text-white text-xs font-semibold px-3 py-1.5 rounded-button flex items-center gap-1 hover:bg-brand-green"
                >
                  <Download className="w-3.5 h-3.5" /> Print / Save Invoice
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-gray-600">
                <div>
                  <p className="font-bold text-brand-darkGreen">Shipping Address:</p>
                  <p>{completedOrder.shippingAddress.fullName}</p>
                  <p>{completedOrder.shippingAddress.street}</p>
                  <p>{completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state} - {completedOrder.shippingAddress.pincode}</p>
                  <p>Phone: {completedOrder.shippingAddress.phone}</p>
                  <p>Email: {completedOrder.shippingAddress.email}</p>
                </div>
                <div>
                  <p className="font-bold text-brand-darkGreen">Shipment Tracking:</p>
                  <p>Courier: <strong>{completedOrder.courierName}</strong></p>
                  <p>AWB Number: <strong className="font-mono text-brand-green">{completedOrder.trackingNumber}</strong></p>
                  <p>Est. Delivery: <strong>{completedOrder.estimatedDelivery}</strong></p>
                </div>
              </div>

              {completedOrder.gstInvoice && (
                <div className="bg-sky-50 p-2.5 rounded border border-sky-200 text-sky-900">
                  <p className="font-bold">GST B2B Tax Invoice Issued:</p>
                  <p>Company: {completedOrder.gstInvoice.companyName} | GSTIN: {completedOrder.gstInvoice.gstin}</p>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-2 pt-2 border-t border-gray-200">
                {completedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span>{item.quantity}x {item.productName} ({item.weight})</span>
                    <span className="font-bold text-brand-darkGreen">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-brand-darkGreen">
                  <span>Grand Total Paid ({completedOrder.paymentMethod})</span>
                  <span className="text-brand-green text-sm">₹{completedOrder.total}</span>
                </div>
              </div>
            </div>

            {!currentUser && (
              <div className="bg-brand-mint/20 border border-brand-mint/40 p-4 rounded-card text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-brand-darkGreen">Want to save your details for faster future orders?</p>
                  <p className="text-gray-600 text-[11px]">Create an account using {completedOrder.shippingAddress.email} to track future shipments easily.</p>
                </div>
                <Link
                  href="/register"
                  className="bg-brand-green hover:bg-brand-darkGreen text-white font-bold px-4 py-2 rounded-button transition-colors text-center whitespace-nowrap"
                >
                  Create Account
                </Link>
              </div>
            )}

            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="flex-1 bg-brand-green hover:bg-brand-darkGreen text-white font-bold text-xs py-3.5 rounded-button text-center transition-colors"
              >
                Track Shipment in Dashboard
              </Link>
              <Link
                href="/shop"
                className="bg-brand-beige text-brand-darkGreen font-semibold text-xs py-3.5 px-6 rounded-button hover:bg-brand-mint/30 text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="font-heading font-extrabold text-3xl text-brand-darkGreen">
          Secure Checkout
        </h1>

        {/* Auth Mode Toggle Banner */}
        {currentUser ? (
          <div className="bg-brand-mint/20 border border-brand-mint/40 rounded-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-brand-darkGreen font-semibold">
              <UserCheck className="w-5 h-5 text-brand-green flex-shrink-0" />
              <span>Logged in as <strong>{currentUser.name}</strong> ({currentUser.email})</span>
            </div>
            <div className="flex items-center gap-2">
              {currentUser.addresses?.[0] && (
                <button
                  type="button"
                  onClick={useSavedUserAddress}
                  className="bg-white border border-brand-mint/40 px-3 py-1.5 rounded-button text-brand-darkGreen font-bold hover:bg-brand-beige transition-colors"
                >
                  Use Saved Address
                </button>
              )}
              <button
                type="button"
                onClick={() => logout()}
                className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-button font-bold hover:bg-red-100 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-card border border-brand-mint/30 shadow-card p-4 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-brand-darkGreen border-b border-gray-100 pb-2">
              <span>Checkout Options</span>
              <span className="text-gray-400 font-normal text-[11px]">No account required for guest checkout</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setAuthMode('guest')}
                className={`p-3 rounded-button border text-center font-bold flex items-center justify-center gap-2 transition-all ${
                  authMode === 'guest'
                    ? 'bg-brand-green text-white border-brand-green shadow-soft'
                    : 'bg-brand-beige text-brand-darkGreen border-brand-mint/30 hover:bg-brand-mint/20'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Continue as Guest</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`p-3 rounded-button border text-center font-bold flex items-center justify-center gap-2 transition-all ${
                  authMode === 'login'
                    ? 'bg-brand-green text-white border-brand-green shadow-soft'
                    : 'bg-brand-beige text-brand-darkGreen border-brand-mint/30 hover:bg-brand-mint/20'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Already Have Account? Log In</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`p-3 rounded-button border text-center font-bold flex items-center justify-center gap-2 transition-all ${
                  authMode === 'register'
                    ? 'bg-brand-green text-white border-brand-green shadow-soft'
                    : 'bg-brand-beige text-brand-darkGreen border-brand-mint/30 hover:bg-brand-mint/20'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>New? Create Account</span>
              </button>
            </div>

            {/* Inline Login */}
            {authMode === 'login' && (
              <form onSubmit={handleInlineLogin} className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {loginError && (
                  <div className="sm:col-span-2 bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-button text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-gray-700">Password *</label>
                    <Link href="/forgot-password" className="text-brand-green font-semibold hover:underline text-[11px]">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-2.5 pr-10 rounded-input border border-gray-300 focus:border-brand-green"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setAuthMode('guest')}
                    className="px-4 py-2 rounded-button bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-button bg-brand-darkGreen text-white font-bold hover:bg-brand-green shadow-soft"
                  >
                    Log In & Continue Checkout
                  </button>
                </div>
              </form>
            )}

            {/* Inline Register */}
            {authMode === 'register' && (
              <form onSubmit={handleInlineRegister} className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {regError && (
                  <div className="sm:col-span-2 bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-button text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Password * (Min 6 chars)</label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-2.5 pr-10 rounded-input border border-gray-300 focus:border-brand-green"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green"
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setAuthMode('guest')}
                    className="px-4 py-2 rounded-button bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-button bg-brand-green text-white font-bold hover:bg-brand-darkGreen shadow-soft"
                  >
                    Create Account & Continue Checkout
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery & Shipping Address */}
            <div className="bg-white rounded-card border border-brand-mint/30 shadow-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 font-heading font-bold text-base text-brand-darkGreen">
                  <Truck className="w-5 h-5 text-brand-green" /> 1. Delivery & Shipping Address
                </div>
                <span className="text-[11px] text-gray-400 font-medium">* Required fields</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* 1. Full Name */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => {
                      setAddress({ ...address, fullName: e.target.value });
                      if (errors.fullName) setErrors({ ...errors, fullName: '' });
                    }}
                    placeholder="Enter your full name"
                    required
                    className={`w-full p-2.5 rounded-input border ${
                      errors.fullName ? 'border-red-500 bg-red-50/50' : 'border-gray-300 focus:border-brand-green'
                    }`}
                  />
                  {errors.fullName && <p className="text-red-500 text-[11px] mt-1">{errors.fullName}</p>}
                </div>

                {/* 2. Phone Number */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={address.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setAddress({ ...address, phone: val });
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                    }}
                    placeholder="Enter 10-digit mobile number"
                    required
                    className={`w-full p-2.5 rounded-input border ${
                      errors.phone ? 'border-red-500 bg-red-50/50' : 'border-gray-300 focus:border-brand-green'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone}</p>}
                </div>

                {/* 3. Email Address */}
                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={address.email}
                    onChange={(e) => {
                      setAddress({ ...address, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    placeholder="Enter email address for order confirmation & tracking"
                    required
                    className={`w-full p-2.5 rounded-input border ${
                      errors.email ? 'border-red-500 bg-red-50/50' : 'border-gray-300 focus:border-brand-green'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
                </div>

                {/* 4. Street Address */}
                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">
                    Street / House Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => {
                      setAddress({ ...address, street: e.target.value });
                      if (errors.street) setErrors({ ...errors, street: '' });
                    }}
                    placeholder="Enter house no., street name, area"
                    required
                    className={`w-full p-2.5 rounded-input border ${
                      errors.street ? 'border-red-500 bg-red-50/50' : 'border-gray-300 focus:border-brand-green'
                    }`}
                  />
                  {errors.street && <p className="text-red-500 text-[11px] mt-1">{errors.street}</p>}
                </div>

                {/* 5. City */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => {
                      setAddress({ ...address, city: e.target.value });
                      if (errors.city) setErrors({ ...errors, city: '' });
                    }}
                    placeholder="Enter city"
                    required
                    className={`w-full p-2.5 rounded-input border ${
                      errors.city ? 'border-red-500 bg-red-50/50' : 'border-gray-300 focus:border-brand-green'
                    }`}
                  />
                  {errors.city && <p className="text-red-500 text-[11px] mt-1">{errors.city}</p>}
                </div>

                {/* 6. State */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => {
                      setAddress({ ...address, state: e.target.value });
                      if (errors.state) setErrors({ ...errors, state: '' });
                    }}
                    placeholder="Enter state (e.g. Karnataka)"
                    required
                    className={`w-full p-2.5 rounded-input border ${
                      errors.state ? 'border-red-500 bg-red-50/50' : 'border-gray-300 focus:border-brand-green'
                    }`}
                  />
                  {errors.state && <p className="text-red-500 text-[11px] mt-1">{errors.state}</p>}
                </div>

                {/* 7. Pincode */}
                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={address.pincode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setAddress({ ...address, pincode: val });
                      if (errors.pincode) setErrors({ ...errors, pincode: '' });
                    }}
                    placeholder="Enter 6-digit pincode"
                    required
                    className={`w-full p-2.5 rounded-input border ${
                      errors.pincode ? 'border-red-500 bg-red-50/50' : 'border-gray-300 focus:border-brand-green'
                    }`}
                  />
                  {errors.pincode && <p className="text-red-500 text-[11px] mt-1">{errors.pincode}</p>}
                </div>
              </div>
            </div>

            {/* GST Invoice Option */}
            <div className="bg-white rounded-card border border-brand-mint/30 shadow-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-heading font-bold text-sm text-brand-darkGreen">
                  <Building className="w-4 h-4 text-brand-green" /> GST Business Invoice (Optional)
                </div>
                <input
                  type="checkbox"
                  checked={wantGstInvoice}
                  onChange={(e) => setWantGstInvoice(e.target.checked)}
                  className="w-4 h-4 accent-brand-green cursor-pointer"
                />
              </div>

              {wantGstInvoice && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-gray-100">
                  <div>
                    <label className="font-semibold text-gray-600 block mb-1">Registered Company Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Organic Foods Pvt Ltd"
                      value={gstDetails.companyName}
                      onChange={(e) => setGstDetails({ ...gstDetails, companyName: e.target.value })}
                      required={wantGstInvoice}
                      className="w-full p-2.5 rounded-input border border-gray-300"
                    />
                    {errors.companyName && <p className="text-red-500 text-[11px] mt-1">{errors.companyName}</p>}
                  </div>
                  <div>
                    <label className="font-semibold text-gray-600 block mb-1">GSTIN Number</label>
                    <input
                      type="text"
                      placeholder="29AAAAA0000A1Z5"
                      value={gstDetails.gstin}
                      onChange={(e) => setGstDetails({ ...gstDetails, gstin: e.target.value })}
                      required={wantGstInvoice}
                      className="w-full p-2.5 rounded-input border border-gray-300"
                    />
                    {errors.gstin && <p className="text-red-500 text-[11px] mt-1">{errors.gstin}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Gateway Method */}
            <div className="bg-white rounded-card border border-brand-mint/30 shadow-card p-6 space-y-4">
              <div className="flex items-center gap-2 font-heading font-bold text-base text-brand-darkGreen border-b border-gray-100 pb-3">
                <CreditCard className="w-5 h-5 text-brand-green" /> 2. Payment Gateway Method
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Razorpay')}
                  className={`p-4 rounded-card border text-left text-xs space-y-1 transition-all ${
                    paymentMethod === 'Razorpay'
                      ? 'border-brand-green bg-brand-green/10 text-brand-darkGreen font-bold shadow-soft'
                      : 'border-gray-200 bg-brand-beige text-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">Razorpay</span>
                    <span className="text-[10px] bg-brand-green text-white px-1.5 py-0.5 rounded">UPI / Cards</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-light">GPay, PhonePe, Cards & NetBanking</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Stripe')}
                  className={`p-4 rounded-card border text-left text-xs space-y-1 transition-all ${
                    paymentMethod === 'Stripe'
                      ? 'border-brand-green bg-brand-green/10 text-brand-darkGreen font-bold shadow-soft'
                      : 'border-gray-200 bg-brand-beige text-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">Stripe</span>
                    <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded">Global</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-light">Visa, Mastercard, Amex</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`p-4 rounded-card border text-left text-xs space-y-1 transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-brand-green bg-brand-green/10 text-brand-darkGreen font-bold shadow-soft'
                      : 'border-gray-200 bg-brand-beige text-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">Cash on Delivery</span>
                    <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.5 rounded">COD</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-light">Pay cash upon delivery</p>
                </button>
              </div>
            </div>
          </div>

          {/* Right Order Summary & Pay Button */}
          <div className="bg-white rounded-card border border-brand-mint/30 shadow-card p-6 h-fit space-y-4">
            <h3 className="font-heading font-bold text-base text-brand-darkGreen border-b border-gray-100 pb-3">
              Order Summary ({cart.length} items)
            </h3>

            {cart.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <p className="text-xs text-gray-500">Your cart is currently empty.</p>
                <Link
                  href="/shop"
                  className="inline-block bg-brand-green text-white text-xs font-bold px-4 py-2 rounded-button"
                >
                  Explore Herbal Teas
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1 text-xs divide-y divide-gray-100">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center pt-2 first:pt-0">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded overflow-hidden relative bg-brand-beige flex-shrink-0">
                          <Image src={item.product.images[0]} alt="" fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-brand-darkGreen line-clamp-1">{item.product.name}</p>
                          <span className="text-[10px] text-gray-400">{item.quantity}x {item.selectedWeight}</span>
                        </div>
                      </div>
                      <span className="font-bold text-brand-green">₹{item.unitPrice * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-xs text-gray-600 pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-brand-darkGreen">₹{cartSubtotal}</span>
                  </div>
                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-sky-700 font-semibold">
                      <span>Discount</span>
                      <span className="font-medium">-₹{cartDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>GST Tax (5%)</span>
                    <span className="font-medium text-brand-darkGreen">₹{cartTax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium text-sky-600 font-bold">
                      {cartShipping === 0 ? 'FREE' : `₹${cartShipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-brand-darkGreen pt-2 border-t border-gray-200">
                    <span>Total Amount</span>
                    <span className="text-brand-green">₹{cartTotal}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || cart.length === 0}
                  className="w-full btn-primary-gradient text-sm py-4 rounded-button shadow-soft flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span className="animate-pulse">Processing Payment...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-brand-gold" />
                      <span>Pay ₹{cartTotal} & Place Order</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-gray-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-green" /> Guaranteed Safe & Secure Checkout
                </p>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
