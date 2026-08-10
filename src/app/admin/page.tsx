'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/storeContext';
import { initialProducts } from '@/lib/seedData';
import { Product } from '@/lib/types';
import {
  Shield,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  RefreshCw,
  Activity,
  Truck,
  Package,
  AlertTriangle,
  XCircle,
  Eye,
  Radio,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { currentUser, loginAsDemoAdmin, showToast } = useStore();
  const [productsList, setProductsList] = useState<Product[]>([...initialProducts]);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'orders' | 'customers' | 'products'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);

  const [adminOrders, setAdminOrders] = useState<any[]>([]);
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [liveKpis, setLiveKpis] = useState<any>({
    currentlyOnline: 0,
    todaysOrders: 0,
    pendingOrders: 0,
    ordersInDelivery: 0,
    completedOrders: 0,
    todaysRevenue: 0,
    totalRevenue: 0,
  });
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Fetch real-time live data from `/api/admin/live`
  const fetchLiveData = async () => {
    try {
      const res = await fetch('/api/admin/live');
      const data = await res.json();
      if (res.ok && data.success) {
        setIsLiveConnected(true);
        if (data.kpis) setLiveKpis(data.kpis);
        if (Array.isArray(data.activeSessions)) setActiveSessions(data.activeSessions);
        if (Array.isArray(data.orders)) setAdminOrders(data.orders);
      }
    } catch (e) {
      setIsLiveConnected(false);
      console.error('Error connecting to live admin stream:', e);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customers');
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.customers)) {
        setCustomersList(data.customers);
      }
    } catch (e) {
      console.error('Failed to fetch customers:', e);
    }
  };

  // Setup periodic 2.5s real-time live streaming loop when admin is logged in
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchLiveData();
      fetchCustomers();

      const liveInterval = setInterval(() => {
        fetchLiveData();
      }, 2500);

      return () => clearInterval(liveInterval);
    }
  }, [currentUser]);

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
              showToast('Admin access granted via demo session!', 'success');
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

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminOrders((prev) =>
          prev.map((o) => (o._id === orderId || o.orderNumber === orderId ? { ...o, orderStatus: newStatus } : o))
        );
        showToast(`Order status updated to ${newStatus}`, 'success');
        fetchLiveData();
      } else {
        showToast(data.message || 'Failed to update order status', 'error');
      }
    } catch (err) {
      showToast('Error connecting to backend server', 'error');
    }
  };

  return (
    <div className="py-12 bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="bg-brand-darkGreen text-white p-6 sm:p-8 rounded-card mb-8 shadow-premium flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2.5 rounded-card shadow-soft max-w-[150px]">
              <Image
                src="/images/logo.png"
                alt="PrimeBrew Herbis Logo"
                width={140}
                height={40}
                className="w-full h-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold bg-white/10 px-2.5 py-0.5 rounded">
                  Admin Control Center
                </span>
                {isLiveConnected && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-0.5 rounded text-[10px] font-extrabold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    <span>● LIVE</span>
                  </span>
                )}
              </div>
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-white mt-0.5">
                PrimeBrew Real-Time Console
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchLiveData();
                fetchCustomers();
                showToast('Refreshed real-time admin stream', 'info');
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-4 py-3 rounded-button border border-white/20 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Refresh Data
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-brand-gold text-brand-darkGreen font-bold text-xs px-5 py-3 rounded-button shadow-gold hover:bg-white flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add New Herbal Product
            </button>
          </div>
        </div>

        {/* 6 Real-Time Dashboard KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {/* Card 1: Currently Online */}
          <div className="bg-white p-4 rounded-card border border-emerald-200 shadow-card">
            <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
              <span>Currently Online</span>
              <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            </div>
            <span className="font-heading font-extrabold text-2xl text-emerald-700">
              {liveKpis.currentlyOnline || 0}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Live Active Users</span>
          </div>

          {/* Card 2: Today's Orders */}
          <div className="bg-white p-4 rounded-card border border-brand-mint/30 shadow-card">
            <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
              <span>Today&apos;s Orders</span>
              <ShoppingBag className="w-4 h-4 text-brand-green" />
            </div>
            <span className="font-heading font-extrabold text-2xl text-brand-darkGreen">
              {liveKpis.todaysOrders || 0}
            </span>
            <span className="text-[10px] text-brand-green font-bold block mt-0.5">Placed Today</span>
          </div>

          {/* Card 3: Pending Orders */}
          <div className="bg-white p-4 rounded-card border border-brand-mint/30 shadow-card">
            <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
              <span>Pending Orders</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <span className="font-heading font-extrabold text-2xl text-amber-600">
              {liveKpis.pendingOrders || 0}
            </span>
            <span className="text-[10px] text-amber-600 font-bold block mt-0.5">Awaiting Processing</span>
          </div>

          {/* Card 4: Orders in Delivery */}
          <div className="bg-white p-4 rounded-card border border-brand-mint/30 shadow-card">
            <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
              <span>In Delivery</span>
              <Truck className="w-4 h-4 text-sky-600" />
            </div>
            <span className="font-heading font-extrabold text-2xl text-sky-700">
              {liveKpis.ordersInDelivery || 0}
            </span>
            <span className="text-[10px] text-sky-600 font-bold block mt-0.5">Shipped / In Transit</span>
          </div>

          {/* Card 5: Completed Orders */}
          <div className="bg-white p-4 rounded-card border border-brand-mint/30 shadow-card">
            <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
              <span>Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="font-heading font-extrabold text-2xl text-emerald-700">
              {liveKpis.completedOrders || 0}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Delivered Orders</span>
          </div>

          {/* Card 6: Today's Revenue */}
          <div className="bg-white p-4 rounded-card border border-brand-mint/30 shadow-card">
            <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
              <span>Today&apos;s Revenue</span>
              <DollarSign className="w-4 h-4 text-brand-gold" />
            </div>
            <span className="font-heading font-extrabold text-xl text-brand-darkGreen">
              ₹{liveKpis.todaysRevenue?.toLocaleString('en-IN') || 0}
            </span>
            <span className="text-[10px] text-brand-gold font-bold block mt-0.5">Paid Today</span>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200 pb-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-button transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'bg-brand-green text-white shadow-soft' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            📊 Reports & Sales Graph
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2.5 rounded-button transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'activity' ? 'bg-brand-green text-white shadow-soft' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>🟢 Live Customer Activity ({activeSessions.filter((s) => s.isOnline).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-button transition-colors whitespace-nowrap ${activeTab === 'orders' ? 'bg-brand-green text-white shadow-soft' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            📦 Track Orders & Logistics ({adminOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2.5 rounded-button transition-colors whitespace-nowrap ${activeTab === 'customers' ? 'bg-brand-green text-white shadow-soft' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            👥 Registered Customers ({customersList.length})
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-button transition-colors whitespace-nowrap ${activeTab === 'products' ? 'bg-brand-green text-white shadow-soft' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            🍵 Product Catalog ({productsList.length})
          </button>
        </div>

        {/* Live Customer Activity Tab */}
        {activeTab === 'activity' && (
          <div className="bg-white rounded-card border border-brand-mint/30 shadow-card overflow-hidden space-y-4 p-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-heading font-bold text-base text-brand-darkGreen flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-500" /> Live Customer Session Monitoring
                </h3>
                <p className="text-xs text-gray-500">Real-time status updates without refreshing</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-badge border border-emerald-200">
                {activeSessions.filter((s) => s.isOnline).length} Active Online
              </span>
            </div>

            {activeSessions.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-500 space-y-2">
                <Users className="w-8 h-8 text-gray-400 mx-auto" />
                <p>No active customer sessions recorded yet.</p>
                <p className="text-[11px] text-gray-400">Log in as a customer in another tab or window to test live monitoring.</p>
              </div>
            ) : (
              <table className="w-full text-xs text-left">
                <thead className="bg-brand-beige text-brand-darkGreen font-bold border-b border-brand-mint/20">
                  <tr>
                    <th className="p-3.5">Customer Name</th>
                    <th className="p-3.5">Email Address</th>
                    <th className="p-3.5">Current Location / Page</th>
                    <th className="p-3.5">Login Time</th>
                    <th className="p-3.5">Last Active</th>
                    <th className="p-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeSessions.map((s, idx) => (
                    <tr key={idx} className="hover:bg-brand-cream/40 transition-colors">
                      <td className="p-3.5 font-bold text-brand-darkGreen">{s.name}</td>
                      <td className="p-3.5 text-gray-600">{s.email}</td>
                      <td className="p-3.5">
                        <span className="font-mono bg-brand-mint/30 text-brand-darkGreen px-2 py-0.5 rounded text-[11px] font-bold">
                          {s.currentPage}
                        </span>
                      </td>
                      <td className="p-3.5 text-gray-500">
                        {new Date(s.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-3.5 text-gray-500">
                        {new Date(s.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="p-3.5 text-right">
                        {s.isOnline ? (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-extrabold px-2.5 py-0.5 rounded-badge border border-emerald-200">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 font-bold px-2.5 py-0.5 rounded-badge border border-gray-200">
                            <span className="w-2 h-2 rounded-full bg-gray-400" />
                            Offline
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Sales Bar Graph Visual */}
            <div className="bg-white p-6 rounded-card border border-brand-mint/30 shadow-card space-y-4">
              <h3 className="font-heading font-bold text-base text-brand-darkGreen">Revenue & Order Growth Report</h3>
              <div className="h-44 flex items-end gap-3 pt-6 px-4 border-b border-gray-200">
                {[
                  { month: 'Jan', sales: 18500 },
                  { month: 'Feb', sales: 22400 },
                  { month: 'Mar', sales: 28900 },
                  { month: 'Apr', sales: 31200 },
                  { month: 'May', sales: 36800 },
                  { month: 'Jun', sales: 42100 },
                  { month: 'Jul', sales: 49500 },
                  { month: 'Aug', sales: liveKpis.totalRevenue || 54200 },
                ].map((item: any, i: number) => {
                  const maxSales = 60000;
                  const heightPercent = Math.min(100, Math.max(20, Math.round((item.sales / maxSales) * 100)));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div
                        className="w-full bg-brand-green group-hover:bg-brand-darkGreen rounded-t transition-all"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[10px] text-gray-500">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Orders & Logistics Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-card border border-brand-mint/30 shadow-card overflow-hidden space-y-4 p-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-heading font-bold text-base text-brand-darkGreen">Orders Management & Real-Time Logistics</h3>
              <span className="text-xs text-gray-500">{adminOrders.length} Orders Recorded</span>
            </div>

            {adminOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-500 space-y-2">
                <Clock className="w-8 h-8 text-gray-400 mx-auto" />
                <p>No orders placed yet. Place a test order on `/checkout` to see it appear live here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {adminOrders.map((ord) => {
                  const customerName = ord.shippingAddress?.fullName || ord.customerName || 'Customer';
                  const customerEmail = ord.shippingAddress?.email || ord.email || '';
                  const fullAddress = ord.shippingAddress
                    ? `${ord.shippingAddress.street}, ${ord.shippingAddress.city}, ${ord.shippingAddress.state} - ${ord.shippingAddress.pincode}`
                    : ord.address || '';

                  return (
                    <div key={ord._id} className="p-4 rounded-card bg-brand-beige border border-brand-mint/30 space-y-3 text-xs">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-200 pb-2">
                        <div>
                          <span className="font-bold text-brand-darkGreen text-sm font-mono">{ord.orderNumber}</span>
                          <p className="text-gray-500">Customer: <strong>{customerName}</strong> ({customerEmail})</p>
                          <p className="text-[11px] text-gray-400">Placed: {new Date(ord.createdAt).toLocaleString()}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Complete Order Status Selector */}
                          <select
                            value={ord.orderStatus || 'Processing'}
                            onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                            className="p-1.5 rounded-button border border-gray-300 font-bold bg-white text-brand-darkGreen focus:border-brand-green text-xs"
                          >
                            <option value="Pending">⏳ Pending</option>
                            <option value="Confirmed">👍 Confirmed</option>
                            <option value="Processing">⚙️ Processing</option>
                            <option value="Packed">📦 Packed</option>
                            <option value="Shipped">🚚 Shipped</option>
                            <option value="Out for Delivery">🛵 Out for Delivery</option>
                            <option value="Delivered">✅ Delivered</option>
                            <option value="Cancelled">❌ Cancelled</option>
                            <option value="Failed">⚠️ Failed</option>
                          </select>

                          <button
                            onClick={() => setSelectedOrderDetails(ord)}
                            className="bg-brand-darkGreen text-white px-3 py-1.5 rounded-button font-semibold hover:bg-brand-green transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-gray-600">
                        <div>
                          <p>Payment: <strong className="text-brand-darkGreen">{ord.paymentMethod} ({ord.paymentStatus})</strong></p>
                          <p>Total: <strong className="text-brand-green font-bold">₹{ord.total}</strong></p>
                        </div>
                        <div>
                          <p>Courier: <strong>{ord.courierName || 'Shiprocket Express'}</strong></p>
                          <p>AWB Tracking: <strong className="font-mono text-brand-green">{ord.trackingNumber || 'SR-884920194'}</strong></p>
                        </div>
                        <div>
                          <p>Delivery Address:</p>
                          <p className="truncate text-gray-500">{fullAddress}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Customer Management Tab */}
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
                  <th className="p-4">Orders Placed</th>
                  <th className="p-4">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customersList.map((c, i) => (
                  <tr key={i} className="hover:bg-brand-cream/40">
                    <td className="p-4 font-bold text-brand-darkGreen">{c.name}</td>
                    <td className="p-4 text-gray-600">{c.email}</td>
                    <td className="p-4 font-mono">{c.phone || 'N/A'}</td>
                    <td className="p-4 font-bold text-brand-green">{c.ordersCount || 0} orders</td>
                    <td className="p-4 font-bold text-sky-700">₹{c.totalSpent?.toFixed(2) || '0.00'}</td>
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
                <h3 className="font-bold text-base text-brand-darkGreen">
                  Order Details ({selectedOrderDetails.orderNumber})
                </h3>
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
              <p>Customer: <strong>{selectedOrderDetails.shippingAddress?.fullName || selectedOrderDetails.customerName}</strong></p>
              <p>Email: <strong>{selectedOrderDetails.shippingAddress?.email || selectedOrderDetails.email}</strong></p>
              <p>Phone: <strong>{selectedOrderDetails.shippingAddress?.phone || selectedOrderDetails.phone}</strong></p>
              <p>
                Shipping Address:{' '}
                {selectedOrderDetails.shippingAddress
                  ? `${selectedOrderDetails.shippingAddress.street}, ${selectedOrderDetails.shippingAddress.city}, ${selectedOrderDetails.shippingAddress.state} - ${selectedOrderDetails.shippingAddress.pincode}`
                  : selectedOrderDetails.address}
              </p>
              <p>
                Payment Method: <strong className="text-brand-darkGreen">{selectedOrderDetails.paymentMethod} ({selectedOrderDetails.paymentStatus})</strong>
              </p>
              <p>
                Courier: <strong>{selectedOrderDetails.courierName || 'Shiprocket Express'}</strong> (AWB:{' '}
                <span className="font-mono text-brand-green">{selectedOrderDetails.trackingNumber || 'SR-884920194'}</span>)
              </p>
            </div>

            <div className="space-y-2 border-t border-gray-100 pt-2">
              <p className="font-bold text-brand-darkGreen">Purchased Items:</p>
              {(selectedOrderDetails.items || []).map((it: any, idx: number) => (
                <div key={idx} className="flex justify-between border-b border-gray-100 pb-1">
                  <span>{it.quantity}x {it.productName} ({it.weight})</span>
                  <span className="font-bold text-brand-darkGreen">₹{it.price * it.quantity}</span>
                </div>
              ))}

              <div className="space-y-1 text-gray-500 border-t border-gray-100 pt-2 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{selectedOrderDetails.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST / Tax</span>
                  <span>₹{selectedOrderDetails.tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>₹{selectedOrderDetails.shippingFee}</span>
                </div>
                {selectedOrderDetails.discount > 0 && (
                  <div className="flex justify-between text-brand-green">
                    <span>Discount</span>
                    <span>-₹{selectedOrderDetails.discount}</span>
                  </div>
                )}
              </div>

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
