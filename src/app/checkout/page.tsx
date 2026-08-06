'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { useStore } from '@/lib/storeContext';
import { Address, Order } from '@/lib/types';
import { ShieldCheck, CreditCard, Truck, CheckCircle2, FileText, Download, Building, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, cartSubtotal, cartDiscount, cartShipping, cartTax, cartTotal, clearCart, currentUser, showToast } = useStore();

  const [address, setAddress] = useState<Address>({
    fullName: currentUser?.name || 'Ananya Sharma',
    phone: currentUser?.phone || '+91 9876543210',
    email: currentUser?.email || 'customer@example.com',
    street: '42 Tea Plantation Road, Green Valley',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    isDefault: true,
  });

  const [wantGstInvoice, setWantGstInvoice] = useState(false);
  const [gstDetails, setGstDetails] = useState({ companyName: '', gstin: '' });
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'Stripe' | 'Cash on Delivery'>('Razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

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
    }, 2000);
  };

  const handlePrintInvoice = () => {
    window.print();
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
                  <p className="text-[11px] text-gray-500">GSTIN: 29AAAAA0000A1Z5 | FSSAI: 10020042001234</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-extrabold text-3xl text-brand-darkGreen mb-8">
          Secure Checkout
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Checkout Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-card border border-brand-mint/30 shadow-card p-6 space-y-4">
              <div className="flex items-center gap-2 font-heading font-bold text-base text-brand-darkGreen border-b border-gray-100 pb-3">
                <Truck className="w-5 h-5 text-brand-green" /> 1. Delivery & Shipping Address
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-semibold text-gray-600 block mb-1">Street Address</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-600 block mb-1">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Pincode</label>
                  <input
                    type="text"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green"
                  />
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
                      required
                      className="w-full p-2.5 rounded-input border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-600 block mb-1">GSTIN Number</label>
                    <input
                      type="text"
                      placeholder="29AAAAA0000A1Z5"
                      value={gstDetails.gstin}
                      onChange={(e) => setGstDetails({ ...gstDetails, gstin: e.target.value })}
                      required
                      className="w-full p-2.5 rounded-input border border-gray-300"
                    />
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

          {/* Right Order Review & Place Order Button */}
          <div className="bg-white rounded-card border border-brand-mint/30 shadow-card p-6 h-fit space-y-4">
            <h3 className="font-heading font-bold text-base text-brand-darkGreen border-b border-gray-100 pb-3">
              Order Summary ({cart.length} items)
            </h3>

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
                <span className="font-medium text-sky-600 font-bold">FREE</span>
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
          </div>
        </form>
      </div>
    </div>
  );
}
