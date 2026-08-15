'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { useStore } from '@/lib/storeContext';
import { Address, Order, User } from '@/lib/types';
import { ShieldCheck, CreditCard, Truck, CheckCircle2, FileText, Download, Building, Lock, UserCheck, AlertCircle, Sparkles, MapPin } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, cartDiscount, cartShipping, cartTax, cartTotal, clearCart, currentUser, setCurrentUser, updateUserAddresses, logout, showToast } = useStore();

  // Delivery Address State
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

  // Save Address Option
  const [saveAddressToAccount, setSaveAddressToAccount] = useState(false);
  const [selectedSavedAddressIdx, setSelectedSavedAddressIdx] = useState<number | null>(null);

  // Pre-fill if currentUser logs in
  useEffect(() => {
    if (currentUser) {
      const defaultAddr = currentUser.addresses?.find((a) => a.isDefault) || currentUser.addresses?.[0];
      setAddress((prev) => ({
        fullName: prev.fullName || defaultAddr?.fullName || currentUser.name || '',
        phone: prev.phone || defaultAddr?.phone || currentUser.phone || '',
        email: prev.email || defaultAddr?.email || currentUser.email || '',
        street: prev.street || defaultAddr?.street || '',
        city: prev.city || defaultAddr?.city || '',
        state: prev.state || defaultAddr?.state || '',
        pincode: prev.pincode || defaultAddr?.pincode || '',
        isDefault: Boolean(defaultAddr?.isDefault),
      }));
    }
  }, [currentUser]);

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // GST & Payment states
  const [wantGstInvoice, setWantGstInvoice] = useState(false);
  const [gstDetails, setGstDetails] = useState({ companyName: '', gstin: '' });
  const paymentMethod = 'Cash on Delivery';
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

  const handlePlaceOrder = async () => {
    if (isProcessing) return;

    if (!validateForm()) {
      showToast('Please fix the errors in the delivery form before proceeding.', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const payload = {
        items: cart.map((c) => ({
          productId: c.product._id,
          productName: c.product.name,
          productImage: c.product.images[0],
          image: c.product.images[0],
          weight: c.selectedWeight,
          quantity: c.quantity,
          price: c.unitPrice,
        })),
        shippingAddress: address,
        gstInvoice: wantGstInvoice ? gstDetails : undefined,
        paymentMethod,
        subtotal: cartSubtotal,
        discount: cartDiscount,
        shippingFee: cartShipping,
        tax: cartTax,
        total: cartTotal,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success && data.order) {
        setCompletedOrder(data.order);
        clearCart();

        // Save order to localStorage as local fallback
        try {
          const stored = localStorage.getItem('pbh_orders');
          const ordersArr = stored ? JSON.parse(stored) : [];
          localStorage.setItem('pbh_orders', JSON.stringify([data.order, ...ordersArr]));
        } catch (e) {}

        try {
          confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}

        // Optionally save address to customer profile if checkbox checked
        if (currentUser && saveAddressToAccount && address.street.trim()) {
          try {
            const addrRes = await fetch('/api/user/addresses', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: currentUser.email,
                action: 'add',
                address: {
                  ...address,
                  fullName: address.fullName || currentUser.name,
                  phone: address.phone || currentUser.phone || '',
                  email: address.email || currentUser.email,
                },
              }),
            });
            const addrData = await addrRes.json();
            if (addrRes.ok && addrData.success && Array.isArray(addrData.addresses)) {
              updateUserAddresses(addrData.addresses);
            }
          } catch (aErr) {}
        }

        showToast(`Order ${data.order.orderNumber} Placed Successfully!`, 'success');
      } else {
        showToast(data.message || 'Failed to place order. Please try again.', 'error');
      }
    } catch (err) {
      showToast('Server connection error. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
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

  // Check authentication status and redirect if unauthenticated
  useEffect(() => {
    if (!currentUser && typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        if (!currentUser) {
          router.push('/login?redirect=/checkout&message=Please login or create an account to place your order.');
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentUser, router]);

  if (!currentUser && !completedOrder) {
    return (
      <div className="py-16 bg-brand-cream min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-card border border-brand-mint/40 shadow-premium p-8 max-w-lg w-full text-center space-y-6">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase px-3 py-1 rounded-badge">
              Authentication Required
            </span>
            <h2 className="font-heading font-extrabold text-2xl text-brand-darkGreen">
              Please login or create an account to place your order.
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              PrimeBrew Herbis requires a verified customer account to ensure secure order processing, live shipment tracking, and instant cashback rewards.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/login?redirect=/checkout&message=Please login or create an account to place your order."
              className="flex-1 bg-brand-darkGreen hover:bg-brand-green text-white font-extrabold text-xs px-6 py-3.5 rounded-button shadow-soft transition-all text-center"
            >
              Log In to Account
            </Link>
            <Link
              href="/register?redirect=/checkout&message=Please login or create an account to place your order."
              className="flex-1 bg-brand-green hover:bg-brand-darkGreen text-white font-extrabold text-xs px-6 py-3.5 rounded-button shadow-soft transition-all text-center"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (completedOrder) {
    return (
      <div className="py-12 bg-brand-cream min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-card border border-brand-mint/30 shadow-premium p-8 space-y-6">
            <div className="text-center space-y-2 border-b border-gray-100 pb-6">
              <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-badge">
                Order Confirmed (Cash on Delivery)
              </span>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-darkGreen">
                Your order has been placed successfully!
              </h1>
              <p className="text-xs text-gray-500">
                Order Number: <strong className="text-brand-darkGreen font-mono">{completedOrder.orderNumber}</strong> • Date: <strong className="text-brand-darkGreen">{new Date(completedOrder.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
              </p>
            </div>

            {/* Order Details Invoice View */}
            <div className="bg-brand-beige p-5 rounded-card border border-brand-mint/30 text-xs space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/logo.png"
                    alt="PrimeBrew Herbis Logo"
                    width={140}
                    height={40}
                    className="h-9 w-auto object-contain"
                  />
                  <div>
                    <h3 className="font-bold text-brand-darkGreen">Official Tax Invoice</h3>
                    <p className="text-[11px] text-gray-500">Farm to Cup. Nature in Every Sip.</p>
                  </div>
                </div>
                <button
                  onClick={handlePrintInvoice}
                  className="bg-brand-darkGreen text-white text-xs font-semibold px-3.5 py-2 rounded-button flex items-center gap-1.5 hover:bg-brand-green transition-colors"
                >
                  <Download className="w-4 h-4" /> Print / Save Invoice
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
                <div>
                  <p className="font-bold text-brand-darkGreen">Customer & Delivery Details:</p>
                  <p className="font-semibold text-gray-800">{completedOrder.shippingAddress.fullName}</p>
                  <p>{completedOrder.shippingAddress.street}</p>
                  <p>{completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state} - {completedOrder.shippingAddress.pincode}</p>
                  <p>Phone: <span className="font-mono text-gray-800">{completedOrder.shippingAddress.phone}</span></p>
                  <p>Email: <span className="text-gray-800">{completedOrder.shippingAddress.email}</span></p>
                </div>
                <div>
                  <p className="font-bold text-brand-darkGreen">Shipment & Payment Info:</p>
                  <p>Order Status: <strong className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded text-[11px] font-bold">{completedOrder.orderStatus}</strong></p>
                  <p>Payment Method: <strong className="text-amber-800 font-bold">Cash on Delivery (COD)</strong></p>
                  <p>Payment Status: <strong className="text-amber-700 font-bold">Pending Collection on Delivery</strong></p>
                  <p>Courier Partner: <strong>{completedOrder.courierName}</strong></p>
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
              <div className="space-y-3 pt-3 border-t border-gray-200">
                <p className="font-bold text-brand-darkGreen">Ordered Products ({completedOrder.items.length}):</p>
                {completedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs bg-white p-2.5 rounded border border-gray-100">
                    <div className="flex items-center gap-3">
                      {item.productImage && (
                        <div className="w-10 h-10 relative rounded overflow-hidden bg-gray-50 flex-shrink-0">
                          <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-brand-darkGreen">{item.productName}</p>
                        <p className="text-gray-500 text-[11px]">Variant: {item.weight} • Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-brand-darkGreen font-mono">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-brand-darkGreen">
                  <span>Total Amount Payable (Cash on Delivery)</span>
                  <span className="text-brand-green text-base">₹{completedOrder.total}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard?tab=orders"
                className="flex-1 bg-brand-darkGreen hover:bg-brand-green text-white font-bold text-xs py-3.5 rounded-button text-center transition-colors shadow-soft"
              >
                View My Order
              </Link>
              <Link
                href="/shop"
                className="flex-1 bg-brand-beige text-brand-darkGreen font-semibold text-xs py-3.5 rounded-button hover:bg-brand-mint/30 text-center border border-brand-mint/30"
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

        {/* Authenticated Customer Banner */}
        <div className="bg-brand-mint/20 border border-brand-mint/40 rounded-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-brand-darkGreen font-semibold">
            <UserCheck className="w-5 h-5 text-brand-green flex-shrink-0" />
            <span>Logged in as <strong>{currentUser?.name}</strong> ({currentUser?.email})</span>
          </div>
          <div className="flex items-center gap-2">
            {currentUser?.addresses?.[0] && (
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

              {/* Saved Delivery Addresses Selection Cards */}
              {currentUser && currentUser.addresses && currentUser.addresses.length > 0 && (
                <div className="bg-brand-bgBeige p-4 rounded-card border border-brand-mint/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-darkGreen flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-brand-green" />
                      <span>Select Saved Delivery Address:</span>
                    </span>
                    <span className="text-[11px] text-brand-green font-semibold">
                      {currentUser.addresses.length} Saved Address{currentUser.addresses.length > 1 ? 'es' : ''}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {currentUser.addresses.map((addr, idx) => {
                      const isSelected =
                        address.street === addr.street &&
                        address.pincode === addr.pincode &&
                        address.fullName === addr.fullName;
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setAddress({
                              fullName: addr.fullName || currentUser.name,
                              phone: addr.phone || currentUser.phone || '',
                              email: addr.email || currentUser.email,
                              street: addr.street || '',
                              city: addr.city || '',
                              state: addr.state || '',
                              pincode: addr.pincode || '',
                              isDefault: Boolean(addr.isDefault),
                            });
                            setSelectedSavedAddressIdx(idx);
                            showToast(`Selected saved address for ${addr.fullName}`, 'info');
                          }}
                          className={`p-3 rounded-card border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-white border-brand-green ring-2 ring-brand-green/30 shadow-soft'
                              : 'bg-white/80 border-gray-200 hover:border-brand-green/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-brand-darkGreen truncate">{addr.fullName}</span>
                            {addr.isDefault && (
                              <span className="bg-brand-mint/30 text-brand-darkGreen text-[9px] font-bold px-1.5 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-600 line-clamp-2">
                            {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

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
                    placeholder="Enter your email address"
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
                    placeholder="Enter your complete address"
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
                    placeholder="Enter your city"
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
                    placeholder="Enter your state"
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

                {/* Save Address Option for Logged-In Customers */}
                {currentUser && (
                  <div className="sm:col-span-2 pt-2 border-t border-gray-100 flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      id="chkSaveCheckoutAddress"
                      checked={saveAddressToAccount}
                      onChange={(e) => setSaveAddressToAccount(e.target.checked)}
                      className="rounded border-gray-300 text-brand-green focus:ring-brand-green h-4 w-4 cursor-pointer"
                    />
                    <label htmlFor="chkSaveCheckoutAddress" className="text-brand-darkGreen font-semibold cursor-pointer select-none">
                      Save this delivery address to my account for future 1-click orders
                    </label>
                  </div>
                )}
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

            {/* Payment Method - COD Only */}
            <div className="bg-white rounded-card border border-brand-mint/30 shadow-card p-6 space-y-4">
              <div className="flex items-center gap-2 font-heading font-bold text-base text-brand-darkGreen border-b border-gray-100 pb-3">
                <Truck className="w-5 h-5 text-brand-green" /> 2. Payment Method
              </div>

              <div className="p-4 rounded-card border border-brand-green bg-brand-green/10 text-brand-darkGreen space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">Cash on Delivery (COD)</span>
                    <span className="text-[10px] bg-amber-600 text-white font-bold px-2 py-0.5 rounded-badge">Only Payment Method</span>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-brand-green" />
                </div>
                <p className="text-xs text-brand-mediumGrey font-light leading-relaxed">
                  PrimeBrew Herbis accepts Cash on Delivery (COD) only. Pay cash directly to the courier agent upon doorstep package delivery. No advance online payment required!
                </p>
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
                    <span>Total Amount (COD)</span>
                    <span className="text-brand-green">₹{cartTotal}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || cart.length === 0}
                  className="w-full btn-primary-gradient text-sm py-4 rounded-button shadow-soft flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span className="animate-pulse">Placing Order...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Place Order (Cash on Delivery - ₹{cartTotal})</span>
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
