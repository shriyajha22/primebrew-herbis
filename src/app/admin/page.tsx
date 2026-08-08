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
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);

  // Registered customers list
  const [customersList, setCustomersList] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pbh_users');
      if (stored) {
        try { return JSON.parse(stored); } catch (e) {}
      }
    }
    return [
      {
        _id: 'usr-customer-1',
        name: 'Ananya Sharma',
        email: 'ananya@example.com',
        phone: '+91 9876543210',
        role: 'customer',
        walletBalance: 250,
        createdAt: 'August 1, 2026',
        ordersCount: 3,
      },
      {
        _id: 'usr-customer-2',
        name: 'Rahul Verma',
        email: 'rahul.verma@example.com',
        phone: '+91 9812345678',
        role: 'customer',
        walletBalance: 100,
        createdAt: 'August 5, 2026',
        ordersCount: 1,
      },
    ];
  });

  // Admin orders list
  const [adminOrders, setAdminOrders] = useState<any[]>([
    {
      _id: 'ord-101',
      orderNumber: 'PBH-2026-9812',
      customerName: 'Ananya Sharma',
      email: 'ananya@example.com',
      phone: '+91 9876543210',
      createdAt: '2026-08-08T10:15:00Z',
      total: 942.90,
      paymentMethod: 'Razorpay (Paid)',
      orderStatus: 'Shipped',
      trackingNumber: 'SR-884920194',
      courierName: 'Shiprocket Express',
      address: '42 Tea Plantation Road, Green Valley, Bengaluru, Karnataka - 560001',
      items: [
        { productName: 'Blue Tea (Butterfly Pea Flower)', quantity: 2, weight: '30 Tea Bags', price: 299 },
        { productName: 'Blue Tea with Elaichi', quantity: 1, weight: '30 Tea Bags', price: 349 },
      ],
    },
    {
      _id: 'ord-102',
      orderNumber: 'PBH-2026-9844',
      customerName: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      phone: '+91 9812345678',
      createdAt: '2026-08-08T11:20:00Z',
      total: 679.00,
      paymentMethod: 'Cash on Delivery',
      orderStatus: 'Processing',
      trackingNumber: 'SR-991204812',
      courierName: 'Shiprocket Express',
      address: '15 MG Road, Indiranagar, Bengaluru, Karnataka - 560038',
      items: [
        { productName: 'Guava + Jamun + Neem Herbal Blend', quantity: 2, weight: '30 Tea Bags', price: 329 },
      ],
    },
  ]);

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

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setAdminOrders(adminOrders.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o)));
    showToast(`Order status updated to ${newStatus}`, 'success');
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
            className={`px-4 py-2.5 rounded-button transition-colors ${activeTab === 'overview' ? 'bg-brand-green text-white shadow-soft' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            📊 Dashboard Reports & Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-button transition-colors ${activeTab === 'orders' ? 'bg-brand-green text-white shadow-soft' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            📦 Track Orders & Logistics ({adminOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2.5 rounded-button transition-colors ${activeTab === 'customers' ? 'bg-brand-green text-white shadow-soft' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            👥 Customer Logins & Accounts ({customersList.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-button transition-colors ${activeTab === 'products' ? 'bg-brand-green text-white shadow-soft' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            🌿 Product Catalog ({productsList.length})
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
                <span className="font-heading font-extrabold text-2xl text-brand-darkGreen">{adminOrders.length}</span>
                <span className="text-[10px] text-brand-gold font-bold block mt-1">Ready for dispatch</span>
              </div>
              <div className="bg-white p-5 rounded-card border border-brand-mint/30 shadow-card">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Registered Customers</span>
                  <Users className="w-4 h-4 text-sky-600" />
                </div>
                <span className="font-heading font-extrabold text-2xl text-sky-700">{customersList.length}</span>
                <span className="text-[10px] text-sky-600 font-bold block mt-1">Active customer logins</span>
              </div>
            </div>

            {/* Sales Bar Graph Visual Simulation */}
            <div className="bg-white p-6 rounded-card border border-brand-mint/30 shadow-card space-y-4">
              <h3 className="font-heading font-bold text-base text-brand-darkGreen">Revenue & Order Growth Report (2026)</h3>
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

        {/* Orders & Logistics Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-card border border-brand-mint/30 shadow-card overflow-hidden space-y-4 p-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-heading font-bold text-base text-brand-darkGreen">Orders Management & Logistics Status</h3>
              <span className="text-xs text-gray-500">{adminOrders.length} Orders Recorded</span>
            </div>

            <div className="space-y-3">
              {adminOrders.map((ord) => (
                <div key={ord._id} className="p-4 rounded-card bg-brand-beige border border-brand-mint/30 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-200 pb-2">
                    <div>
                      <span className="font-bold text-brand-darkGreen text-sm font-mono">{ord.orderNumber}</span>
                      <p className="text-gray-500">Customer: <strong>{ord.customerName}</strong> ({ord.email})</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                        className="p-1.5 rounded-button border border-gray-300 font-bold bg-white text-brand-darkGreen"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => setSelectedOrderDetails(ord)}
                        className="bg-brand-darkGreen text-white px-3 py-1.5 rounded-button font-semibold hover:bg-brand-green"
                      >
                        View Full Details
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-gray-600">
                    <div>
                      <p>Payment: <strong className="text-brand-darkGreen">{ord.paymentMethod}</strong></p>
                      <p>Total: <strong className="text-brand-green font-bold">₹{ord.total}</strong></p>
                    </div>
                    <div>
                      <p>Courier: <strong>{ord.courierName}</strong></p>
                      <p>AWB Tracking: <strong className="font-mono text-brand-green">{ord.trackingNumber}</strong></p>
                    </div>
                    <div>
                      <p>Delivery Address:</p>
                      <p className="truncate text-gray-500">{ord.address}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Logins Tab */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-card border border-brand-mint/30 shadow-card overflow-hidden">
            <div className="p-4 border-b border-brand-mint/20 flex justify-between items-center">
              <h3 className="font-heading font-bold text-base text-brand-darkGreen">Registered Customer Accounts</h3>
              <span className="text-xs text-gray-500 font-semibold">{customersList.length} Customer Profiles</span>
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-brand-beige text-brand-darkGreen font-bold border-b border-brand-mint/20">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Wallet Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customersList.map((c, i) => (
                  <tr key={i} className="hover:bg-brand-cream/40">
                    <td className="p-4 font-bold text-brand-darkGreen">{c.name}</td>
                    <td className="p-4 text-gray-600">{c.email}</td>
                    <td className="p-4 font-mono">{c.phone || '+91 9876543210'}</td>
                    <td className="p-4 uppercase font-bold text-brand-green">{c.role || 'customer'}</td>
                    <td className="p-4 font-bold text-sky-700">₹{c.walletBalance || 250}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
      </div>

      {/* Full Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-modal shadow-premium w-full max-w-lg p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-brand-darkGreen">Order Details ({selectedOrderDetails.orderNumber})</h3>
                <p className="text-[11px] text-gray-500">Logistics & Customer Order Record</p>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-gray-400 hover:text-gray-700 font-bold text-base px-2"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-gray-700 bg-brand-beige p-3.5 rounded-card border border-brand-mint/30">
              <p>Customer: <strong>{selectedOrderDetails.customerName}</strong></p>
              <p>Email: <strong>{selectedOrderDetails.email}</strong></p>
              <p>Phone: <strong>{selectedOrderDetails.phone}</strong></p>
              <p>Shipping Address: {selectedOrderDetails.address}</p>
              <p>Payment Method: <strong className="text-brand-darkGreen">{selectedOrderDetails.paymentMethod}</strong></p>
              <p>Courier: <strong>{selectedOrderDetails.courierName}</strong> (AWB: <span className="font-mono text-brand-green">{selectedOrderDetails.trackingNumber}</span>)</p>
            </div>

            <div className="space-y-2 border-t border-gray-100 pt-2">
              <p className="font-bold text-brand-darkGreen">Purchased Items:</p>
              {selectedOrderDetails.items.map((it: any, idx: number) => (
                <div key={idx} className="flex justify-between border-b border-gray-100 pb-1">
                  <span>{it.quantity}x {it.productName} ({it.weight})</span>
                  <span className="font-bold text-brand-darkGreen">₹{it.price * it.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-sm text-brand-darkGreen pt-1">
                <span>Grand Total</span>
                <span className="text-brand-green">₹{selectedOrderDetails.total}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="w-full bg-brand-darkGreen text-white font-bold py-2.5 rounded-button hover:bg-brand-green"
              >
                Close Order Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-modal shadow-premium w-full max-w-lg p-6 space-y-4">
            <h3 className="font-heading font-extrabold text-lg text-brand-darkGreen">Add New Herbal Tea Product</h3>
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
