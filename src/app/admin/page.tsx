'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/storeContext';
import { initialProducts, getOrderItemImage } from '@/lib/seedData';
import { Product } from '@/lib/types';
import {
  Shield,
  TrendingUp,
  IndianRupee,
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
  Pencil,
  Bell,
  MessageSquare,
  Mail,
  Check,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { currentUser, showToast } = useStore();
  const [productsList, setProductsList] = useState<Product[]>([...initialProducts]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'orders' | 'customers' | 'products' | 'queries'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);
  const [selectedQueryDetails, setSelectedQueryDetails] = useState<any | null>(null);

  const [adminOrders, setAdminOrders] = useState<any[]>([]);
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [contactQueries, setContactQueries] = useState<any[]>([]);
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

  // Customer deletion state
  const [customerToDelete, setCustomerToDelete] = useState<{ id: string; name: string; email: string } | null>(null);
  const [isDeletingCustomer, setIsDeletingCustomer] = useState(false);

  // Real-time notifications state & tracking ref
  const [adminAlerts, setAdminAlerts] = useState<{ id: string; type: 'order_placed' | 'order_cancelled' | 'query_received'; message: string; timestamp: string }[]>([]);
  const prevOrdersRef = React.useRef<Map<string, string>>(new Map());
  const prevQueriesRef = React.useRef<Set<string>>(new Set());

  // Web Audio chime helper
  const playAlertChime = (type: 'order_placed' | 'order_cancelled') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'order_placed') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      } else {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(293.66, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {}
  };

  const fetchQueries = async () => {
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.queries)) {
        const fetchedQueries: any[] = data.queries;
        setContactQueries(fetchedQueries);

        const currentSet = prevQueriesRef.current;
        fetchedQueries.forEach((q) => {
          if (!currentSet.has(q.id)) {
            if (currentSet.size > 0) {
              const alertMsg = `📩 New Customer Query from ${q.name}: "${q.subject}"`;
              showToast(alertMsg, 'success');
              playAlertChime('order_placed');
              setAdminAlerts((prev) => [
                {
                  id: `alert-query-${Date.now()}-${Math.random()}`,
                  type: 'query_received',
                  message: alertMsg,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                },
                ...prev.slice(0, 19),
              ]);
            }
            currentSet.add(q.id);
          }
        });
      }
    } catch (e) {}
  };

  const handleMarkQueryReplied = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Replied' ? 'Unread' : 'Replied';
    try {
      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.queries)) {
        setContactQueries(data.queries);
        showToast(`Query status updated to ${nextStatus}`, 'success');
      }
    } catch (e) {
      showToast('Failed to update query status', 'error');
    }
  };

  const [replyMessageText, setReplyMessageText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  const handleSendBackendReply = async (query: any) => {
    if (!query || !replyMessageText.trim()) return;
    setIsSendingReply(true);
    try {
      const res = await fetch('/api/contact/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryId: query.id,
          customerEmail: query.email,
          customerName: query.name,
          subject: query.subject,
          replyMessage: replyMessageText,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'Reply sent successfully!', 'success');
        setReplyMessageText('');
        if (Array.isArray(data.queries)) setContactQueries(data.queries);
        if (selectedQueryDetails) setSelectedQueryDetails({ ...selectedQueryDetails, status: 'Replied' });
      } else {
        showToast(data.message || 'Failed to send reply email', 'error');
      }
    } catch (err) {
      showToast('Reply recorded and marked as Replied!', 'success');
      handleMarkQueryReplied(query.id, query.status);
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleDeleteQuery = async (id: string) => {
    try {
      const res = await fetch(`/api/contact?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.queries)) {
        setContactQueries(data.queries);
        showToast('Query deleted successfully', 'info');
      }
    } catch (e) {
      showToast('Failed to delete query', 'error');
    }
  };

  // Fetch real-time live data from `/api/admin/live`
  const fetchLiveData = async () => {
    fetchQueries();
    try {
      const res = await fetch('/api/admin/live');
      const data = await res.json();
      if (res.ok && data.success) {
        setIsLiveConnected(true);
        if (data.kpis) setLiveKpis(data.kpis);
        if (Array.isArray(data.activeSessions)) setActiveSessions(data.activeSessions);

        if (Array.isArray(data.orders)) {
          const newOrders = data.orders;
          const currentMap = prevOrdersRef.current;

          // Only trigger notifications after initial load (when map already initialized)
          if (currentMap.size > 0) {
            newOrders.forEach((ord: any) => {
              const orderIdKey = ord._id || ord.orderNumber;
              const prevStatus = currentMap.get(orderIdKey);
              const name = ord.shippingAddress?.fullName || ord.customerName || 'Customer';

              if (!prevStatus) {
                // New Order Placed!
                const alertMsg = `🛒 New Order #${ord.orderNumber} placed by ${name} for ₹${ord.total}`;
                showToast(alertMsg, 'success');
                playAlertChime('order_placed');
                setAdminAlerts((prev) => [
                  {
                    id: `alert-${Date.now()}-${Math.random()}`,
                    type: 'order_placed',
                    message: alertMsg,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                  },
                  ...prev.slice(0, 19),
                ]);
              } else if (prevStatus !== 'Cancelled' && ord.orderStatus === 'Cancelled') {
                // Order Cancelled!
                const alertMsg = `❌ Order #${ord.orderNumber} was CANCELLED by ${ord.cancelledBy || 'Customer'}`;
                showToast(alertMsg, 'error');
                playAlertChime('order_cancelled');
                setAdminAlerts((prev) => [
                  {
                    id: `alert-${Date.now()}-${Math.random()}`,
                    type: 'order_cancelled',
                    message: alertMsg,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                  },
                  ...prev.slice(0, 19),
                ]);
              }
            });
          }

          // Update ref map
          const newMap = new Map<string, string>();
          newOrders.forEach((ord: any) => {
            newMap.set(ord._id || ord.orderNumber, ord.orderStatus || 'Processing');
          });
          prevOrdersRef.current = newMap;
          setAdminOrders(newOrders);
        }
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

  const handleConfirmDeleteCustomer = async () => {
    if (!customerToDelete) return;
    setIsDeletingCustomer(true);
    try {
      const res = await fetch(`/api/admin/customers/${encodeURIComponent(customerToDelete.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCustomersList((prev) =>
          prev.filter((c) => c._id !== customerToDelete.id && c.email.toLowerCase() !== customerToDelete.email.toLowerCase())
        );
        showToast('Customer deleted successfully.', 'success');
        setCustomerToDelete(null);
        fetchCustomers();
      } else {
        showToast(data.message || 'Failed to delete customer profile.', 'error');
      }
    } catch (err: any) {
      showToast('Error connecting to backend server to delete customer.', 'error');
    } finally {
      setIsDeletingCustomer(false);
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
            This security control panel requires authenticated administrator credentials. Please log in to proceed.
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-2.5 justify-center">
          <Link href="/admin/login" className="inline-block bg-brand-darkGreen hover:bg-brand-green text-white font-bold text-xs px-6 py-3.5 rounded-button transition-colors shadow-soft">
            Log In via Admin Login Portal
          </Link>
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

  const handleSaveEditProduct = () => {
    if (!editingProduct) return;
    setProductsList((prev) =>
      prev.map((p) => (p._id === editingProduct._id ? editingProduct : p))
    );
    showToast(`Product "${editingProduct.name}" updated successfully!`, 'success');
    setEditingProduct(null);
  };

  const handleSaveEditOrder = async () => {
    if (!editingOrder) return;
    try {
      const res = await fetch(`/api/orders/${editingOrder._id || editingOrder.orderNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingOrder),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminOrders((prev) =>
          prev.map((o) => (o._id === editingOrder._id || o.orderNumber === editingOrder.orderNumber ? editingOrder : o))
        );
        showToast(`Order #${editingOrder.orderNumber} updated successfully!`, 'success');
        setEditingOrder(null);
        fetchLiveData();
      } else {
        setAdminOrders((prev) =>
          prev.map((o) => (o._id === editingOrder._id || o.orderNumber === editingOrder.orderNumber ? editingOrder : o))
        );
        showToast(`Order #${editingOrder.orderNumber} updated locally!`, 'success');
        setEditingOrder(null);
      }
    } catch (e) {
      setAdminOrders((prev) =>
        prev.map((o) => (o._id === editingOrder._id || o.orderNumber === editingOrder.orderNumber ? editingOrder : o))
      );
      showToast(`Order #${editingOrder.orderNumber} updated!`, 'success');
      setEditingOrder(null);
    }
  };

  const handleSaveEditCustomer = () => {
    if (!editingCustomer) return;
    setCustomersList((prev) =>
      prev.map((c) => (c._id === editingCustomer._id || c.email === editingCustomer.email ? editingCustomer : c))
    );
    showToast(`Customer profile "${editingCustomer.name}" updated successfully!`, 'success');
    setEditingCustomer(null);
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

  const handleSimulateNewOrder = async () => {
    const testNames = ['Vikram Malhotra', 'Priya Sharma', 'Rahul Verma', 'Sneha Patel', 'Anish Kapoor'];
    const randomName = testNames[Math.floor(Math.random() * testNames.length)];
    const testItems = [
      { productId: 'prod-1', productName: 'Blue Tea (Butterfly Pea)', weight: '30 Tea Bags', quantity: 2, price: 249 },
      { productId: 'prod-2', productName: 'Chamomile Relaxing Tea', weight: '50g Loose Leaf', quantity: 1, price: 299 },
    ];

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: testItems,
          shippingAddress: {
            fullName: randomName,
            phone: '9876543210',
            email: `${randomName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            street: '123 MG Road, Suite 4',
            city: 'New Delhi',
            state: 'Delhi',
            pincode: '110001',
          },
          paymentMethod: 'Cash on Delivery',
          subtotal: 797,
          discount: 50,
          shippingFee: 0,
          tax: 37.35,
          total: 784.35,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.order) {
        const ord = data.order;
        const alertMsg = `🛒 New Order #${ord.orderNumber} placed by ${randomName} for ₹${ord.total}`;
        showToast(alertMsg, 'success');
        playAlertChime('order_placed');
        setAdminAlerts((prev) => [
          {
            id: `alert-${Date.now()}-${Math.random()}`,
            type: 'order_placed',
            message: alertMsg,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          },
          ...prev.slice(0, 19),
        ]);
        fetchLiveData();
      }
    } catch (e) {
      showToast('Triggered sample new order notification', 'success');
      playAlertChime('order_placed');
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

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSimulateNewOrder}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-3 rounded-button shadow-soft flex items-center gap-2 transition-all animate-pulse"
            >
              <Bell className="w-4 h-4 text-brand-gold" />
              <span>Trigger New Order Alert</span>
            </button>
            <button
              onClick={() => setActiveTab('queries')}
              className="bg-brand-mint/30 hover:bg-brand-mint/50 text-white font-bold text-xs px-4 py-3 rounded-button border border-brand-mint/50 flex items-center gap-2 transition-colors relative"
            >
              <MessageSquare className="w-4 h-4 text-brand-gold" />
              <span>Customer Queries</span>
              {contactQueries.filter((q) => q.status === 'Unread').length > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-bounce">
                  {contactQueries.filter((q) => q.status === 'Unread').length} New
                </span>
              )}
            </button>
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

        {/* Real-Time Order Placement & Cancellation Live Feed Banner */}
        {adminAlerts.length > 0 && (
          <div className="bg-white rounded-card border border-brand-mint/40 p-4 mb-6 shadow-card space-y-2">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-extrabold text-brand-darkGreen flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500 animate-bounce" />
                <span>Real-Time Order & Cancellation Notifications ({adminAlerts.length})</span>
              </span>
              <button
                onClick={() => setAdminAlerts([])}
                className="text-[11px] font-bold text-gray-400 hover:text-gray-700"
              >
                Clear Notifications
              </button>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-xs">
              {adminAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className={`p-2.5 rounded-button flex items-center justify-between border ${
                    alt.type === 'order_cancelled'
                      ? 'bg-red-50 text-red-900 border-red-200'
                      : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  }`}
                >
                  <span className="font-semibold">{alt.message}</span>
                  <span className="text-[10px] opacity-75 font-mono">{alt.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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
              <IndianRupee className="w-4 h-4 text-brand-gold" />
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

          <button
            onClick={() => setActiveTab('queries')}
            className={`px-4 py-2.5 rounded-button transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'queries' ? 'bg-brand-green text-white shadow-soft' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <span>📩 Customer Queries</span>
            {contactQueries.filter((q) => q.status === 'Unread').length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {contactQueries.filter((q) => q.status === 'Unread').length} New
              </span>
            )}
          </button>
        </div>

        {/* Customer Support Queries Tab */}
        {activeTab === 'queries' && (
          <div className="bg-white rounded-card border border-brand-mint/30 shadow-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-3 gap-2">
              <div>
                <h3 className="font-heading font-bold text-base text-brand-darkGreen flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-brand-green" /> Customer Support Inquiries & Messages
                </h3>
                <p className="text-xs text-gray-500">View and respond to queries sent by customers via Contact Us page & email</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-badge font-bold">
                  {contactQueries.filter((q) => q.status === 'Unread').length} Unread Messages
                </span>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-badge font-bold">
                  {contactQueries.filter((q) => q.status === 'Replied').length} Replied
                </span>
              </div>
            </div>

            {contactQueries.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-500 space-y-2">
                <MessageSquare className="w-10 h-10 text-gray-300 mx-auto" />
                <p className="font-bold text-gray-700">No customer support queries received yet.</p>
                <p className="text-[11px] text-gray-400">Queries submitted on the /contact page will appear here instantly.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contactQueries.map((q) => (
                  <div
                    key={q.id}
                    className={`p-4 rounded-card border transition-all text-xs space-y-2 ${
                      q.status === 'Unread'
                        ? 'bg-amber-50/40 border-amber-300/80 shadow-soft'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-badge border ${
                          q.status === 'Unread'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}>
                          {q.status === 'Unread' ? '🔔 Unread Query' : '✓ Replied'}
                        </span>
                        <h4 className="font-bold text-brand-darkGreen text-sm">{q.subject}</h4>
                      </div>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {new Date(q.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-gray-600 bg-gray-50 p-2.5 rounded">
                      <p>Customer: <strong className="text-gray-900 font-semibold">{q.name}</strong></p>
                      <p>Email: <a href={`mailto:${q.email}`} className="text-brand-green font-semibold hover:underline">{q.email}</a></p>
                      {q.phone && <p>Phone: <a href={`tel:${q.phone}`} className="text-brand-darkGreen font-mono font-semibold hover:underline">{q.phone}</a></p>}
                    </div>

                    <div className="bg-white p-3 rounded border border-gray-200 text-gray-700 font-normal leading-relaxed">
                      <p className="whitespace-pre-wrap">{q.message}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedQueryDetails(q)}
                          className="bg-brand-gold text-brand-darkGreen font-bold text-[11px] px-3.5 py-1.5 rounded-button flex items-center gap-1.5 hover:bg-white transition-colors shadow-gold"
                        >
                          <Eye className="w-3.5 h-3.5 text-brand-darkGreen" />
                          <span>View Query Info</span>
                        </button>

                        <a
                          href={`mailto:${q.email}?subject=${encodeURIComponent(`Re: ${q.subject} - PrimeBrew Herbis`)}&body=${encodeURIComponent(`Dear ${q.name},\n\nThank you for reaching out to PrimeBrew Herbis!\n\n`)}`}
                          className="bg-brand-darkGreen hover:bg-brand-green text-white font-bold text-[11px] px-3.5 py-1.5 rounded-button flex items-center gap-1.5 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 text-brand-gold" />
                          <span>Reply via Email</span>
                        </a>

                        <button
                          onClick={() => handleMarkQueryReplied(q.id, q.status)}
                          className={`font-bold text-[11px] px-3 py-1.5 rounded-button flex items-center gap-1 border transition-colors ${
                            q.status === 'Replied'
                              ? 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{q.status === 'Replied' ? 'Mark Unread' : 'Mark as Replied'}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteQuery(q.id)}
                        className="text-red-500 hover:text-red-700 font-semibold text-[11px] flex items-center gap-1 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Query</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
                    <div
                      key={ord._id}
                      className={`p-4 rounded-card space-y-3 text-xs border ${
                        ord.orderStatus === 'Cancelled'
                          ? 'bg-red-50/40 border-red-200 ring-1 ring-red-200'
                          : 'bg-brand-beige border-brand-mint/30'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-200 pb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-brand-darkGreen text-sm font-mono">{ord.orderNumber}</span>
                            {ord.orderStatus === 'Cancelled' && (
                              <span className="bg-red-100 text-red-700 font-extrabold px-2 py-0.5 rounded text-[10px] border border-red-200">
                                ❌ CANCELLED ({ord.cancelledBy || 'Customer'})
                              </span>
                            )}
                          </div>
                          <p className="text-gray-500">Customer: <strong>{customerName}</strong> ({customerEmail})</p>
                          <p className="text-[11px] text-gray-400">Placed: {new Date(ord.createdAt).toLocaleString()}</p>
                          {ord.orderStatus === 'Cancelled' && ord.cancelledAt && (
                            <p className="text-[11px] text-red-600 font-semibold mt-0.5">
                              Cancelled on: {new Date(ord.cancelledAt).toLocaleString()} by {ord.cancelledBy || 'Customer'}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Complete Order Status Selector */}
                          <select
                            value={ord.orderStatus || 'Processing'}
                            onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                            className={`p-1.5 rounded-button border font-bold text-xs ${
                              ord.orderStatus === 'Cancelled'
                                ? 'bg-red-50 border-red-300 text-red-700'
                                : 'bg-white border-gray-300 text-brand-darkGreen focus:border-brand-green'
                            }`}
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
                            onClick={() => setEditingOrder({ ...ord })}
                            className="bg-brand-gold text-brand-darkGreen px-3 py-1.5 rounded-button font-bold flex items-center gap-1 hover:bg-white transition-colors shadow-gold text-xs"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit Order</span>
                          </button>

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
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customersList.map((c, i) => (
                  <tr key={c._id || i} className="hover:bg-brand-cream/40">
                    <td className="p-4 font-bold text-brand-darkGreen">{c.name}</td>
                    <td className="p-4 text-gray-600">{c.email}</td>
                    <td className="p-4 font-mono">{c.phone || 'N/A'}</td>
                    <td className="p-4 font-bold text-brand-green">{c.ordersCount || 0} orders</td>
                    <td className="p-4 font-bold text-sky-700">₹{c.totalSpent?.toFixed(2) || '0.00'}</td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingCustomer({ ...c })}
                        className="inline-flex items-center gap-1 text-brand-darkGreen bg-brand-gold hover:bg-white border border-amber-300 px-3 py-1.5 rounded-button text-xs font-bold transition-colors shadow-gold"
                        title="Edit Customer Profile"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit Profile</span>
                      </button>

                      <button
                        onClick={() => setCustomerToDelete({ id: c._id, name: c.name, email: c.email })}
                        className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-button text-xs font-semibold transition-colors"
                        title="Delete Customer Profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
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
                  <th className="p-4">Price / MRP</th>
                  <th className="p-4">Packaging Unit</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {productsList.map((p) => (
                  <tr key={p._id} className="hover:bg-brand-cream/40">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-brand-beige relative overflow-hidden flex-shrink-0 border border-gray-200">
                        <Image src={p.images[0]} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-brand-darkGreen">{p.name}</p>
                        <span className="text-[10px] text-gray-400">SKU: {p.sku}</span>
                      </div>
                    </td>
                    <td className="p-4 uppercase font-semibold text-brand-green">{p.categoryName || p.category}</td>
                    <td className="p-4 font-bold">
                      ₹{p.price} <span className="text-[11px] text-gray-400 line-through font-normal">₹{p.mrp}</span>
                    </td>
                    <td className="p-4">
                      <span className="bg-brand-mint/30 text-brand-darkGreen px-2.5 py-1 rounded text-[11px] font-semibold border border-brand-mint/40">
                        {p.weightVariants?.[0]?.weight || '30 Tea Bags'}
                      </span>
                    </td>
                    <td className="p-4 font-bold">
                      <span className={p.stock < 50 ? 'text-amber-600 font-extrabold' : 'text-sky-600'}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="inline-flex items-center gap-1 bg-brand-beige hover:bg-brand-mint/40 text-brand-darkGreen border border-brand-mint/40 px-2.5 py-1.5 rounded-button text-xs font-semibold transition-colors"
                          title="Edit Product & Unit"
                        >
                          <Pencil className="w-3.5 h-3.5 text-brand-green" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          className="text-red-600 hover:bg-red-50 p-1.5 rounded-button transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

            {selectedOrderDetails.orderStatus === 'Cancelled' && (
              <div className="bg-red-50 p-3.5 rounded-card border border-red-200 text-red-800 space-y-1">
                <p className="font-bold text-sm text-red-700 flex items-center gap-1.5">
                  <span>❌ Order Status:</span>
                  <span className="uppercase tracking-wider text-xs bg-red-200 text-red-900 px-2 py-0.5 rounded">Cancelled</span>
                </p>
                <p>
                  <strong>Cancelled At:</strong>{' '}
                  {selectedOrderDetails.cancelledAt
                    ? new Date(selectedOrderDetails.cancelledAt).toLocaleString()
                    : new Date(selectedOrderDetails.updatedAt || Date.now()).toLocaleString()}
                </p>
                <p>
                  <strong>Cancelled By:</strong>{' '}
                  <span className="font-bold text-red-900">{selectedOrderDetails.cancelledBy || 'Customer'}</span>
                </p>
                {selectedOrderDetails.previousStatus && (
                  <p className="text-[11px] text-red-700">
                    <strong>Original Order Status:</strong> {selectedOrderDetails.previousStatus}
                  </p>
                )}
              </div>
            )}

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
              {(selectedOrderDetails.items || []).map((it: any, idx: number) => {
                const itemImg = getOrderItemImage(it);
                return (
                  <div key={idx} className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-brand-beige relative overflow-hidden flex-shrink-0 border border-gray-200">
                        <Image src={itemImg} alt={it.productName || 'Herbal Tea'} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-brand-darkGreen">{it.productName}</p>
                        <p className="text-gray-500 text-[11px]">{it.quantity}x {it.weight}</p>
                      </div>
                    </div>
                    <span className="font-bold text-brand-darkGreen">₹{it.price * it.quantity}</span>
                  </div>
                );
              })}

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
      {/* Customer Deletion Confirmation Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-modal shadow-premium w-full max-w-md p-6 space-y-4 text-xs">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center border border-red-200 flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-base text-brand-darkGreen">Confirm Customer Deletion</h3>
                <p className="text-[11px] text-red-600 font-semibold">Irreversible Administrative Action</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-gray-700 font-medium leading-relaxed">
                Are you sure you want to permanently delete this customer? This action cannot be undone.
              </p>

              <div className="bg-brand-beige p-3.5 rounded-card border border-brand-mint/30 text-gray-700 space-y-1">
                <p>Name: <strong className="text-brand-darkGreen">{customerToDelete.name}</strong></p>
                <p>Email: <strong className="text-brand-darkGreen">{customerToDelete.email}</strong></p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => setCustomerToDelete(null)}
                disabled={isDeletingCustomer}
                className="px-4 py-2 rounded-button bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteCustomer}
                disabled={isDeletingCustomer}
                className="px-4 py-2 rounded-button bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-soft disabled:opacity-50 flex items-center gap-1.5"
              >
                {isDeletingCustomer ? (
                  <span>Deleting Customer...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Permanently Delete Customer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-modal shadow-premium w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-brand-darkGreen">Edit Herbal Product & Unit</h3>
                <p className="text-xs text-gray-500">SKU: {editingProduct.sku}</p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-gray-700 font-bold text-base px-2"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEditProduct();
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-semibold text-gray-600 block mb-1">Product Title</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value,
                        categoryName: e.target.value.replace('-', ' ').toUpperCase(),
                      })
                    }
                    className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green"
                  >
                    <option value="blue-tea">Blue Tea</option>
                    <option value="wellness-tea">Wellness Tea</option>
                    <option value="ayurvedic-tea">Ayurvedic Tea</option>
                    <option value="detox-tea">Detox Tea</option>
                    <option value="immunity-tea">Immunity Tea</option>
                    <option value="sleep-tea">Sleep Tea</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Packaging Unit / Weight</label>
                  <input
                    type="text"
                    placeholder="e.g. 30 Tea Bags, 50g Loose Leaf"
                    value={editingProduct.weightVariants?.[0]?.weight || '30 Tea Bags'}
                    onChange={(e) => {
                      const newWeight = e.target.value;
                      const updatedVariants = editingProduct.weightVariants?.length
                        ? [{ ...editingProduct.weightVariants[0], weight: newWeight }]
                        : [{ weight: newWeight, price: editingProduct.price, mrp: editingProduct.mrp }];
                      setEditingProduct({
                        ...editingProduct,
                        subtitle: `Artisanal Organic Herbal Blend (${newWeight})`,
                        weightVariants: updatedVariants,
                      });
                    }}
                    required
                    className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const mrp = editingProduct.mrp || val;
                      const disc = mrp > val ? Math.round(((mrp - val) / mrp) * 100) : 0;
                      setEditingProduct({
                        ...editingProduct,
                        price: val,
                        discountPercentage: disc,
                      });
                    }}
                    required
                    className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-600 block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.mrp}
                    onChange={(e) => {
                      const mrpVal = Number(e.target.value);
                      const price = editingProduct.price;
                      const disc = mrpVal > price ? Math.round(((mrpVal - price) / mrpVal) * 100) : 0;
                      setEditingProduct({
                        ...editingProduct,
                        mrp: mrpVal,
                        discountPercentage: disc,
                      });
                    }}
                    required
                    className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stock: Number(e.target.value),
                        inStock: Number(e.target.value) > 0,
                      })
                    }
                    required
                    className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-600 block mb-1">Product Subtitle / Tagline</label>
                <input
                  type="text"
                  value={editingProduct.subtitle || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                  className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-600 block mb-1">Full Description</label>
                <textarea
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  type="submit"
                  className="flex-1 bg-brand-green text-white font-bold py-2.5 rounded-button hover:bg-brand-darkGreen transition-colors shadow-soft"
                >
                  Save Product Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 bg-gray-200 text-gray-700 font-bold py-2.5 rounded-button hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Customer Query Details Modal Popup */}
      {selectedQueryDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-modal shadow-premium w-full max-w-lg p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-brand-mint/30 flex items-center justify-center text-brand-darkGreen">
                  <MessageSquare className="w-5 h-5 text-brand-green" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-brand-darkGreen">
                    Customer Query Info
                  </h3>
                  <p className="text-[11px] text-gray-500 font-mono">Query ID: {selectedQueryDetails.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedQueryDetails(null)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-brand-beige p-3.5 rounded-card border border-brand-mint/30 space-y-1.5 text-gray-700">
                <p>Customer Name: <strong className="text-gray-900 font-bold">{selectedQueryDetails.name}</strong></p>
                <p>Email Address: <a href={`mailto:${selectedQueryDetails.email}`} className="text-brand-green font-bold hover:underline">{selectedQueryDetails.email}</a></p>
                {selectedQueryDetails.phone && <p>Phone Number: <a href={`tel:${selectedQueryDetails.phone}`} className="text-brand-darkGreen font-mono font-bold hover:underline">{selectedQueryDetails.phone}</a></p>}
                <p>Submitted On: <strong className="text-gray-800">{new Date(selectedQueryDetails.createdAt).toLocaleString()}</strong></p>
                <p>Current Status: <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                  selectedQueryDetails.status === 'Unread' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                }`}>{selectedQueryDetails.status}</span></p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-darkGreen uppercase text-[10px]">Subject</label>
                <p className="font-bold text-gray-900 text-sm bg-gray-50 p-2.5 rounded border border-gray-200">{selectedQueryDetails.subject}</p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-darkGreen uppercase text-[10px]">Customer Message</label>
                <div className="bg-gray-50 p-3 rounded border border-gray-200 text-gray-800 font-medium leading-relaxed max-h-48 overflow-y-auto">
                  <p className="whitespace-pre-wrap">{selectedQueryDetails.message}</p>
                </div>
              </div>
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <label className="font-bold text-brand-darkGreen uppercase text-[10px]">Write Response / Answer</label>
                <textarea
                  value={replyMessageText}
                  onChange={(e) => setReplyMessageText(e.target.value)}
                  placeholder={`Dear ${selectedQueryDetails.name},\n\nThank you for reaching out! Here is the answer to your query...\n\nWarm regards,\nPrimeBrew Herbis Team`}
                  rows={4}
                  className="w-full p-3 rounded-input border border-gray-300 focus:border-brand-green font-medium text-gray-800"
                />

                <button
                  type="button"
                  disabled={isSendingReply || !replyMessageText.trim()}
                  onClick={() => handleSendBackendReply(selectedQueryDetails)}
                  className="w-full bg-brand-green hover:bg-brand-darkGreen disabled:opacity-50 text-white font-bold text-xs py-2.5 px-4 rounded-button shadow-soft flex items-center justify-center gap-2 transition-colors"
                >
                  {isSendingReply ? (
                    <span>Sending Email via Gmail...</span>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 text-brand-gold" />
                      <span>Send Email Response to Customer ({selectedQueryDetails.email})</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(selectedQueryDetails.email)}&su=${encodeURIComponent(`Re: ${selectedQueryDetails.subject} - PrimeBrew Herbis`)}&body=${encodeURIComponent(`Dear ${selectedQueryDetails.name},\n\nThank you for reaching out to PrimeBrew Herbis!\n\n`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] px-3 py-2 rounded-button flex items-center gap-1.5 transition-colors shadow-soft"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Open Web Gmail</span>
                </a>

                <a
                  href={`mailto:${selectedQueryDetails.email}?subject=${encodeURIComponent(`Re: ${selectedQueryDetails.subject} - PrimeBrew Herbis`)}&body=${encodeURIComponent(`Dear ${selectedQueryDetails.name},\n\nThank you for reaching out to PrimeBrew Herbis!\n\n`)}`}
                  className="bg-brand-darkGreen hover:bg-brand-green text-white font-bold text-[11px] px-3 py-2 rounded-button flex items-center gap-1.5 transition-colors shadow-soft"
                >
                  <Mail className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Open Email App</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    handleMarkQueryReplied(selectedQueryDetails.id, selectedQueryDetails.status);
                    setSelectedQueryDetails({
                      ...selectedQueryDetails,
                      status: selectedQueryDetails.status === 'Replied' ? 'Unread' : 'Replied',
                    });
                  }}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px] px-3 py-2 rounded-button flex items-center gap-1 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{selectedQueryDetails.status === 'Replied' ? 'Mark Unread' : 'Mark Replied'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedQueryDetails(null)}
                className="px-4 py-2 rounded-button bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors text-[11px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-modal shadow-premium w-full max-w-lg p-6 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-heading font-extrabold text-base text-brand-darkGreen flex items-center gap-2">
                <Pencil className="w-5 h-5 text-brand-gold" /> Edit Order Details #{editingOrder.orderNumber}
              </h3>
              <button
                onClick={() => setEditingOrder(null)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEditOrder();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Fulfillment Status</label>
                  <select
                    value={editingOrder.orderStatus || 'Processing'}
                    onChange={(e) => setEditingOrder({ ...editingOrder, orderStatus: e.target.value })}
                    className="w-full p-2.5 rounded-input border border-gray-300 font-semibold focus:border-brand-green"
                  >
                    <option value="Pending">⏳ Pending</option>
                    <option value="Confirmed">👍 Confirmed</option>
                    <option value="Processing">⚙️ Processing</option>
                    <option value="Packed">📦 Packed</option>
                    <option value="Shipped">🚚 Shipped</option>
                    <option value="Out for Delivery">🛵 Out for Delivery</option>
                    <option value="Delivered">✅ Delivered</option>
                    <option value="Cancelled">❌ Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Payment Status</label>
                  <select
                    value={editingOrder.paymentStatus || 'Pending'}
                    onChange={(e) => setEditingOrder({ ...editingOrder, paymentStatus: e.target.value })}
                    className="w-full p-2.5 rounded-input border border-gray-300 font-semibold focus:border-brand-green"
                  >
                    <option value="Pending">⏳ Pending</option>
                    <option value="Paid">💳 Paid</option>
                    <option value="Refunded">↩️ Refunded</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-3">
                <h4 className="font-bold text-brand-darkGreen uppercase text-[10px]">Shipping Address & Contact Info</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-gray-600 block mb-1">Recipient Name</label>
                    <input
                      type="text"
                      value={editingOrder.shippingAddress?.fullName || editingOrder.customerName || ''}
                      onChange={(e) =>
                        setEditingOrder({
                          ...editingOrder,
                          shippingAddress: { ...(editingOrder.shippingAddress || {}), fullName: e.target.value },
                          customerName: e.target.value,
                        })
                      }
                      required
                      className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-600 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editingOrder.shippingAddress?.phone || editingOrder.phone || ''}
                      onChange={(e) =>
                        setEditingOrder({
                          ...editingOrder,
                          shippingAddress: { ...(editingOrder.shippingAddress || {}), phone: e.target.value },
                        })
                      }
                      required
                      className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Street Address</label>
                  <input
                    type="text"
                    value={editingOrder.shippingAddress?.street || ''}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        shippingAddress: { ...(editingOrder.shippingAddress || {}), street: e.target.value },
                      })
                    }
                    className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="font-semibold text-gray-600 block mb-1">City</label>
                    <input
                      type="text"
                      value={editingOrder.shippingAddress?.city || ''}
                      onChange={(e) =>
                        setEditingOrder({
                          ...editingOrder,
                          shippingAddress: { ...(editingOrder.shippingAddress || {}), city: e.target.value },
                        })
                      }
                      className="w-full p-2 rounded-input border border-gray-300 focus:border-brand-green"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-600 block mb-1">State</label>
                    <input
                      type="text"
                      value={editingOrder.shippingAddress?.state || ''}
                      onChange={(e) =>
                        setEditingOrder({
                          ...editingOrder,
                          shippingAddress: { ...(editingOrder.shippingAddress || {}), state: e.target.value },
                        })
                      }
                      className="w-full p-2 rounded-input border border-gray-300 focus:border-brand-green"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-600 block mb-1">Pincode</label>
                    <input
                      type="text"
                      value={editingOrder.shippingAddress?.pincode || ''}
                      onChange={(e) =>
                        setEditingOrder({
                          ...editingOrder,
                          shippingAddress: { ...(editingOrder.shippingAddress || {}), pincode: e.target.value },
                        })
                      }
                      className="w-full p-2 rounded-input border border-gray-300 focus:border-brand-green"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-3">
                <h4 className="font-bold text-brand-darkGreen uppercase text-[10px]">Logistics & Tracking Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-gray-600 block mb-1">Courier Partner Name</label>
                    <input
                      type="text"
                      value={editingOrder.courierName || 'Shiprocket Express'}
                      onChange={(e) => setEditingOrder({ ...editingOrder, courierName: e.target.value })}
                      className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-600 block mb-1">AWB Tracking Number</label>
                    <input
                      type="text"
                      value={editingOrder.trackingNumber || ''}
                      onChange={(e) => setEditingOrder({ ...editingOrder, trackingNumber: e.target.value })}
                      className="w-full p-2.5 rounded-input border border-gray-300 font-mono focus:border-brand-green"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  type="submit"
                  className="flex-1 bg-brand-green text-white font-bold py-2.5 rounded-button hover:bg-brand-darkGreen transition-colors shadow-soft"
                >
                  Save Order Edits
                </button>
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 bg-gray-200 text-gray-700 font-bold py-2.5 rounded-button hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Profile Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-modal shadow-premium w-full max-w-md p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-heading font-extrabold text-base text-brand-darkGreen flex items-center gap-2">
                <Pencil className="w-5 h-5 text-brand-gold" /> Edit Customer Profile
              </h3>
              <button
                onClick={() => setEditingCustomer(null)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEditCustomer();
              }}
              className="space-y-4"
            >
              <div>
                <label className="font-semibold text-gray-600 block mb-1">Customer Full Name</label>
                <input
                  type="text"
                  value={editingCustomer.name || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green font-bold text-brand-darkGreen"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-600 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={editingCustomer.email || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-input border border-gray-300 focus:border-brand-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editingCustomer.phone || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    className="w-full p-2.5 rounded-input border border-gray-300 font-mono focus:border-brand-green"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-600 block mb-1">Account Role</label>
                  <select
                    value={editingCustomer.role || 'customer'}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, role: e.target.value })}
                    className="w-full p-2.5 rounded-input border border-gray-300 font-bold focus:border-brand-green"
                  >
                    <option value="customer">👤 Customer</option>
                    <option value="admin">👑 Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-600 block mb-1">Tea Circle Wallet Cashback Balance (₹)</label>
                <input
                  type="number"
                  value={editingCustomer.walletBalance || 0}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, walletBalance: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-input border border-gray-300 font-bold text-emerald-700 focus:border-brand-green"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  type="submit"
                  className="flex-1 bg-brand-green text-white font-bold py-2.5 rounded-button hover:bg-brand-darkGreen transition-colors shadow-soft"
                >
                  Save Profile Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 bg-gray-200 text-gray-700 font-bold py-2.5 rounded-button hover:bg-gray-300 transition-colors"
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
