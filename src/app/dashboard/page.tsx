'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/storeContext';
import { initialProducts } from '@/lib/seedData';
import { ShoppingBag, Heart, MapPin, Wallet, Shield } from 'lucide-react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as any) || 'orders';

  const { currentUser, wishlist, toggleWishlist, addToCart, logout, loginAsDemoCustomer, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'wallet' | 'settings'>(initialTab);
  const [passCurrent, setPassCurrent] = useState('');
  const [passNew, setPassNew] = useState('');

  const wishlistedProducts = initialProducts.filter((p) => wishlist.includes(p._id));

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passNew) return;
    showToast("Password updated successfully!", "success");
    setPassCurrent('');
    setPassNew('');
  };

  if (!currentUser) {
    return (
      <div className="py-20 text-center space-y-5 max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-cream text-brand-darkGreen flex items-center justify-center mx-auto border border-brand-mint/40 shadow-soft">
          <Shield className="w-8 h-8 text-brand-green" />
        </div>
        <div className="space-y-2">
          <h2 className="font-heading font-extrabold text-2xl text-brand-darkGreen">Customer Account Required</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Please log in or click below to access your saved orders, delivery addresses, tea wallet, and wishlist.
          </p>
        </div>
        <button
          onClick={loginAsDemoCustomer}
          className="bg-brand-green hover:bg-brand-darkGreen text-white font-extrabold text-xs px-6 py-3.5 rounded-button transition-all shadow-soft w-full"
        >
          ⚡ Access Demo Customer Dashboard (Ananya Sharma)
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Profile Header */}
        <div className="bg-brand-darkGreen text-white p-6 sm:p-8 rounded-card mb-8 shadow-premium flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-gold text-brand-darkGreen flex items-center justify-center font-bold text-2xl border-2 border-white shadow-gold">
              {currentUser?.name.charAt(0) || 'A'}
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-2xl text-white">{currentUser?.name}</h1>
              <p className="text-xs text-brand-mint">{currentUser?.email} • Customer Account</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-3 rounded-card text-center border border-white/20">
              <span className="text-[10px] text-brand-gold uppercase tracking-wider block font-bold">Tea Wallet</span>
              <span className="font-bold text-sm text-white">₹{currentUser?.walletBalance || 250}</span>
            </div>
            {currentUser?.role === 'admin' && (
              <Link
                href="/admin"
                className="bg-brand-gold text-brand-darkGreen text-xs font-bold px-4 py-3 rounded-button shadow-gold hover:bg-white transition-colors"
              >
                Go to Admin Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Dashboard Tabs & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Navigation Sidebar */}
          <div className="bg-white p-4 rounded-card border border-brand-mint/30 shadow-card space-y-1 h-fit">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left text-xs font-bold px-4 py-3 rounded-button flex items-center gap-3 transition-colors ${
                activeTab === 'orders' ? 'bg-brand-green text-white shadow-soft' : 'text-brand-charcoal hover:bg-brand-beige'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Order History & Tracking
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full text-left text-xs font-bold px-4 py-3 rounded-button flex items-center gap-3 transition-colors ${
                activeTab === 'wishlist' ? 'bg-brand-green text-white shadow-soft' : 'text-brand-charcoal hover:bg-brand-beige'
              }`}
            >
              <Heart className="w-4 h-4" /> Saved Wishlist ({wishlist.length})
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left text-xs font-bold px-4 py-3 rounded-button flex items-center gap-3 transition-colors ${
                activeTab === 'addresses' ? 'bg-brand-green text-white shadow-soft' : 'text-brand-charcoal hover:bg-brand-beige'
              }`}
            >
              <MapPin className="w-4 h-4" /> Saved Delivery Addresses
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`w-full text-left text-xs font-bold px-4 py-3 rounded-button flex items-center gap-3 transition-colors ${
                activeTab === 'wallet' ? 'bg-brand-green text-white shadow-soft' : 'text-brand-charcoal hover:bg-brand-beige'
              }`}
            >
              <Wallet className="w-4 h-4" /> Wallet & Rewards
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left text-xs font-bold px-4 py-3 rounded-button flex items-center gap-3 transition-colors ${
                activeTab === 'settings' ? 'bg-brand-green text-white shadow-soft' : 'text-brand-charcoal hover:bg-brand-beige'
              }`}
            >
              <Shield className="w-4 h-4" /> Account & Password Settings
            </button>
            <button
              onClick={logout}
              className="w-full text-left text-xs font-bold px-4 py-3 rounded-button flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors pt-2 border-t border-gray-100 mt-2"
            >
              Logout Account
            </button>
          </div>

          {/* Right Tab Content */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="font-heading font-bold text-xl text-brand-darkGreen">Your Order History</h2>

                {/* Sample Order Tracking Card */}
                <div className="bg-white rounded-card border border-brand-mint/30 shadow-card p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-3 gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-badge">
                        Status: Shipped via Shiprocket
                      </span>
                      <h3 className="font-heading font-bold text-base text-brand-darkGreen mt-1">
                        Order #PBH-2026-9812
                      </h3>
                      <p className="text-xs text-gray-500">Placed on August 3, 2026 • Total: ₹470.40</p>
                    </div>
                    <Link
                      href="/track-order?orderNumber=PBH-2026-9812"
                      className="bg-brand-darkGreen text-white text-xs font-semibold px-4 py-2 rounded-button hover:bg-brand-green"
                    >
                      Track Shipment Live
                    </Link>
                  </div>

                  {/* Interactive Status Timeline */}
                  <div className="py-2">
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-500 mb-2">
                      <span className="text-emerald-700">Order Placed</span>
                      <span className="text-emerald-700">Processing</span>
                      <span className="text-emerald-700 font-bold">Shipped (In Transit)</span>
                      <span>Out for Delivery</span>
                      <span>Delivered</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden flex">
                      <div className="w-3/5 bg-brand-green h-full" />
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-14 h-14 rounded-card overflow-hidden relative bg-brand-beige">
                      <Image src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=200&q=80" alt="" fill className="object-cover" />
                    </div>
                    <div className="text-xs">
                      <h4 className="font-bold text-brand-darkGreen">Blue Tea</h4>
                      <p className="text-gray-500">Quantity: 2 x 30 Tea Bags</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <h2 className="font-heading font-bold text-xl text-brand-darkGreen">Your Saved Wishlist</h2>
                {wishlistedProducts.length === 0 ? (
                  <p className="text-xs text-gray-500">No items currently in your wishlist.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistedProducts.map((p) => (
                      <div key={p._id} className="bg-white p-4 rounded-card border border-brand-mint/30 shadow-card flex gap-3 items-center">
                        <div className="w-16 h-16 rounded bg-brand-beige relative overflow-hidden flex-shrink-0">
                          <Image src={p.images[0]} alt="" fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-brand-darkGreen truncate">{p.name}</h4>
                          <span className="font-bold text-xs text-brand-green">₹{p.price}</span>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => addToCart(p)}
                              className="bg-brand-green text-white text-[10px] font-bold px-2.5 py-1 rounded"
                            >
                              Add to Cart
                            </button>
                            <button
                              onClick={() => toggleWishlist(p._id)}
                              className="text-[10px] text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <h2 className="font-heading font-bold text-xl text-brand-darkGreen">Saved Delivery Addresses</h2>
                <div className="bg-white p-5 rounded-card border border-brand-mint/30 shadow-card text-xs space-y-2">
                  <span className="bg-brand-mint/30 text-brand-darkGreen font-bold px-2 py-0.5 rounded text-[10px]">
                    Default Address
                  </span>
                  <h4 className="font-bold text-brand-darkGreen">Ananya Sharma</h4>
                  <p className="text-gray-600">MG Road, Indiranagar, Bengaluru, Karnataka - 560038</p>
                  <p className="text-gray-500">Status: Verified Primary Shipping Address</p>
                </div>
              </div>
            )}

            {activeTab === 'wallet' && (
              <div className="space-y-6">
                <h2 className="font-heading font-bold text-xl text-brand-darkGreen">PrimeBrew Wallet & Rewards</h2>
                <div className="bg-white p-6 rounded-card border border-brand-mint/30 shadow-card text-xs space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <span>Available Store Cashback</span>
                    <span className="font-heading font-extrabold text-2xl text-brand-green">₹250.00</span>
                  </div>
                  <p className="text-gray-500">You earn 5% cashback on every tea order placed!</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="font-heading font-bold text-xl text-brand-darkGreen">Account & Security Settings</h2>
                <div className="bg-white p-6 rounded-card border border-brand-mint/30 shadow-card space-y-6 text-xs">
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-brand-darkGreen">Profile Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-500 font-semibold block mb-1">Full Name</label>
                        <input
                          type="text"
                          value={currentUser?.name || ''}
                          readOnly
                          className="w-full p-2.5 rounded-button bg-gray-50 border border-gray-200 text-brand-darkGreen font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-gray-500 font-semibold block mb-1">Email Address</label>
                        <input
                          type="email"
                          value={currentUser?.email || ''}
                          readOnly
                          className="w-full p-2.5 rounded-button bg-gray-50 border border-gray-200 text-brand-darkGreen font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <h3 className="font-bold text-sm text-brand-darkGreen">Change Password</h3>
                    <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md">
                      <div>
                        <label className="text-gray-500 font-semibold block mb-1">Current Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={passCurrent}
                          onChange={(e) => setPassCurrent(e.target.value)}
                          required
                          className="w-full p-2.5 rounded-button border border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="text-gray-500 font-semibold block mb-1">New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={passNew}
                          onChange={(e) => setPassNew(e.target.value)}
                          required
                          className="w-full p-2.5 rounded-button border border-gray-300"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-brand-green hover:bg-brand-darkGreen text-white font-bold px-5 py-2.5 rounded-button"
                      >
                        Update Security Password
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserDashboardPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-brand-darkGreen font-bold">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
