'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/storeContext';
import { initialProducts } from '@/lib/seedData';
import { Product } from '@/lib/types';
import { Shield, TrendingUp, DollarSign, ShoppingBag, Users, AlertTriangle, Plus, Edit, Trash2, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const { currentUser, loginAsDemoAdmin, showToast } = useStore();
  const [productsList, setProductsList] = useState<Product[]>([...initialProducts]);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'settings'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('blue-tea');
  const [newProdPrice, setNewProdPrice] = useState(299);
  const [newProdMrp, setNewProdMrp] = useState(399);
  const [newProdStock, setNewProdStock] = useState(50);
  const [newProdDesc, setNewProdDesc] = useState('');

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="py-20 text-center space-y-5 max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-soft">
          <Shield className="w-9 h-9" />
        </div>
        <div className="space-y-2">
          <h2 className="font-heading font-extrabold text-2xl text-brand-darkGreen">Admin Access Restricted</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            This security control panel requires administrator credentials (<code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">Contact.primebrew@gmail.com</code>). Please log in or use quick demo admin access.
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-2.5 justify-center">
          <Link href="/admin/login" className="inline-block bg-brand-darkGreen hover:bg-brand-green text-white font-bold text-xs px-6 py-3.5 rounded-button transition-colors shadow-soft">
            Log In via Admin Login Portal
          </Link>
          <button
            onClick={() => {
              loginAsDemoAdmin();
              showToast("Admin access granted via demo session!", "success");
            }}
            className="inline-block bg-brand-gold hover:bg-amber-400 text-brand-darkGreen font-extrabold text-xs px-6 py-3.5 rounded-button transition-all shadow-gold"
          >
            ⚡ Instant Demo Admin Access
          </button>
          <Link href="/" className="text-xs text-gray-500 hover:text-brand-green font-semibold pt-1">
            ← Return to Main Storefront
          </Link>
        </div>
      </div>
    );
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    const created: Product = {
      _id: `prod-${Date.now()}`,
      name: newProdName,
      slug: newProdName.toLowerCase().replace(/ /g, '-'),
      subtitle: 'Artisanal Organic Herbal Blend (30 Tea Bags)',
      description: newProdDesc || 'Farm-fresh botanical tea crafted with care.',
      category: newProdCategory,
      categoryName: newProdCategory.replace('-', ' ').toUpperCase(),
      price: newProdPrice,
      mrp: newProdMrp,
      discountPercentage: Math.round(((newProdMrp - newProdPrice) / newProdMrp) * 100),
      rating: 5.0,
      reviewCount: 0,
      stock: newProdStock,
      inStock: newProdStock > 0,
      images: ['https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80'],
      weightVariants: [{ weight: '30 Tea Bags', price: newProdPrice, mrp: newProdMrp }],
      ingredients: [{ name: 'Organic Botanicals', description: 'Hand-picked herbs' }],
      benefits: ['Promotes natural vitality', 'Rich in antioxidants'],
      caffeineLevel: 'Zero Caffeine',
      brewingGuide: { temp: '90°C', steepTime: '4 mins', waterAmount: '200ml', servingSuggestion: 'Enjoy warm.' },
      nutritionInfo: { calories: '0 kcal', carbs: '0g', protein: '0g', fat: '0g', antioxidants: 'High' },
      certifications: ['100% Organic'],
      sku: `PBH-${Math.floor(100 + Math.random() * 900)}`,
      origin: 'PrimeBrew Herbis Own Farms, Karnataka',
    };

    setProductsList([created, ...productsList]);
    setShowAddModal(false);
    showToast(`New product "${created.name}" created!`, 'success');
  };

  const handleDeleteProduct = (id: string) => {
    setProductsList(productsList.filter((p) => p._id !== id));
    showToast('Product removed from catalog', 'info');
  };

  return (
    <div className="py-12 bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="bg-brand-darkGreen text-white p-6 sm:p-8 rounded-card mb-8 shadow-premium flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-card bg-brand-gold text-brand-darkGreen flex items-center justify-center font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold bg-white/10 px-2.5 py-0.5 rounded">
                Admin Control Center
              </span>
              <h1 className="font-heading font-extrabold text-2xl text-white mt-0.5">
                PrimeBrew Management Console
              </h1>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-brand-gold text-brand-darkGreen font-bold text-xs px-5 py-3 rounded-button shadow-gold hover:bg-white flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New Herbal Product
          </button>
        </div>

        {/* Dashboard Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-200 pb-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-button ${activeTab === 'overview' ? 'bg-brand-green text-white' : 'bg-white text-gray-700'}`}
          >
            📊 Analytics & Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-button ${activeTab === 'products' ? 'bg-brand-green text-white' : 'bg-white text-gray-700'}`}
          >
            🌿 Product Catalog ({productsList.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-button ${activeTab === 'orders' ? 'bg-brand-green text-white' : 'bg-white text-gray-700'}`}
          >
            📦 Orders & Logistics
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-card border border-brand-mint/30 shadow-card">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Today&apos;s Sales</span>
                  <DollarSign className="w-4 h-4 text-brand-green" />
                </div>
                <span className="font-heading font-extrabold text-2xl text-brand-darkGreen">₹3,490</span>
                <span className="text-[10px] text-sky-600 font-bold block mt-1">+14% vs yesterday</span>
              </div>
              <div className="bg-white p-5 rounded-card border border-brand-mint/30 shadow-card">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Monthly Revenue</span>
                  <TrendingUp className="w-4 h-4 text-brand-green" />
                </div>
                <span className="font-heading font-extrabold text-2xl text-brand-darkGreen">₹54,200</span>
                <span className="text-[10px] text-sky-600 font-bold block mt-1">+28% growth</span>
              </div>
              <div className="bg-white p-5 rounded-card border border-brand-mint/30 shadow-card">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Active Orders</span>
                  <ShoppingBag className="w-4 h-4 text-brand-green" />
                </div>
                <span className="font-heading font-extrabold text-2xl text-brand-darkGreen">43</span>
                <span className="text-[10px] text-brand-gold font-bold block mt-1">3 pending dispatch</span>
              </div>
              <div className="bg-white p-5 rounded-card border border-brand-mint/30 shadow-card">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Low Stock Alerts</span>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <span className="font-heading font-extrabold text-2xl text-amber-600">2</span>
                <span className="text-[10px] text-amber-700 font-bold block mt-1">Needs reordering</span>
              </div>
            </div>

            {/* Sales Bar Graph Visual Simulation */}
            <div className="bg-white p-6 rounded-card border border-brand-mint/30 shadow-card space-y-4">
              <h3 className="font-heading font-bold text-base text-brand-darkGreen">Revenue Trend (2026)</h3>
              <div className="h-44 flex items-end gap-3 pt-6 px-4 border-b border-gray-200">
                {[
                  { month: 'Jan', val: 40 },
                  { month: 'Feb', val: 55 },
                  { month: 'Mar', val: 70 },
                  { month: 'Apr', val: 65 },
                  { month: 'May', val: 80 },
                  { month: 'Jun', val: 90 },
                  { month: 'Jul', val: 95 },
                  { month: 'Aug', val: 100 },
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div
                      className="w-full bg-brand-green group-hover:bg-brand-darkGreen rounded-t transition-all"
                      style={{ height: `${item.val}%` }}
                    />
                    <span className="text-[10px] text-gray-500">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products CRUD Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-card border border-brand-mint/30 shadow-card overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-brand-beige text-brand-darkGreen font-bold border-b border-brand-mint/20">
                <tr>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {productsList.map((p) => (
                  <tr key={p._id} className="hover:bg-brand-cream/40">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-brand-beige relative overflow-hidden flex-shrink-0">
                        <Image src={p.images[0]} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-brand-darkGreen">{p.name}</p>
                        <span className="text-[10px] text-gray-400">SKU: {p.sku}</span>
                      </div>
                    </td>
                    <td className="p-4 uppercase font-semibold text-brand-green">{p.categoryName}</td>
                    <td className="p-4 font-bold">₹{p.price}</td>
                    <td className="p-4 font-bold">
                      <span className={p.stock < 50 ? 'text-amber-600 font-extrabold' : 'text-sky-600'}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-button"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-card border border-brand-mint/30 shadow-card space-y-4">
            <h3 className="font-heading font-bold text-base text-brand-darkGreen">Recent Orders</h3>
            <div className="p-4 rounded-card bg-brand-beige border border-brand-mint/30 flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-brand-darkGreen">Order #PBH-2026-9812</p>
                <p className="text-gray-500">Customer: Ananya Sharma • Total: ₹942.90 (Razorpay Paid)</p>
              </div>
              <span className="bg-sky-100 text-sky-800 font-bold px-3 py-1 rounded-badge text-[11px]">
                Shipped via Shiprocket
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-modal shadow-premium w-full max-w-lg p-6 space-y-4">
            <h3 className="font-heading font-bold text-lg text-brand-darkGreen">Add New Herbal Tea Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-600 block mb-1">Product Title</label>
                <input
                  type="text"
                  placeholder="e.g. Organic Chamomile Passionfruit Blend"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-input border border-gray-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    required
                    className="w-full p-2.5 rounded-input border border-gray-300"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-600 block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={newProdMrp}
                    onChange={(e) => setNewProdMrp(Number(e.target.value))}
                    required
                    className="w-full p-2.5 rounded-input border border-gray-300"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-gray-600 block mb-1">Initial Stock Units</label>
                <input
                  type="number"
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(Number(e.target.value))}
                  required
                  className="w-full p-2.5 rounded-input border border-gray-300"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-brand-green text-white font-bold py-2.5 rounded-button hover:bg-brand-darkGreen"
                >
                  Save & Publish Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 bg-gray-200 text-gray-700 font-bold py-2.5 rounded-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
