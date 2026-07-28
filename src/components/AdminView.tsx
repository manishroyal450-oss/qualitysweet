import React, { useState, useEffect, useMemo } from 'react';
import { MenuItem, Order, CartItem, ViewMode, UserProfile } from '../types';
import DashboardView from './DashboardView';
import { 
  Lock, 
  Unlock, 
  Trash2, 
  Plus, 
  Search, 
  ShoppingBag, 
  DollarSign, 
  Layers, 
  LogOut, 
  Check, 
  X, 
  RefreshCw, 
  PlusCircle, 
  CheckCircle,
  Eye,
  EyeOff,
  Users,
  UserCheck,
  Phone,
  MapPin,
  Hash,
  Flame,
  Clock,
  PieChart,
  ShieldCheck,
  Sparkles,
  Thermometer,
  Activity,
  ShieldAlert,
  Sliders,
  TrendingUp,
  Award,
  User,
  ArrowRight,
  ExternalLink,
  LayoutDashboard
} from 'lucide-react';
import { motion } from 'motion/react';
import { SWEET_CATEGORIES, RESTAURANT_CATEGORIES } from '../data';

interface AdminViewProps {
  sweets: MenuItem[];
  restaurant: MenuItem[];
  orders: Order[];
  onAddItem: (item: MenuItem) => void;
  onRemoveItem: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: 'pending' | 'completed' | 'cancelled') => void;
  onClearOrders: () => void;
  onAddBulkItems: (type: 'sweet' | 'restaurant', count: number) => void;
  onClearBulkItems: (type: 'sweet' | 'restaurant') => void;
}

export default function AdminView({
  sweets,
  restaurant,
  orders,
  onAddItem,
  onRemoveItem,
  onUpdateOrderStatus,
  onClearOrders,
  onAddBulkItems,
  onClearBulkItems
}: AdminViewProps) {
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('admin_logged_in') === 'true';
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'spaces' | 'capacity' | 'standards'>('orders');
  const [invType, setInvType] = useState<'sweet' | 'restaurant'>('sweet');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Unified Operational Standards Interactivity
  const [standardsSweetsTemp, setStandardsSweetsTemp] = useState(3.5); // 2 to 4 deg C
  const [standardsKitchenTemp, setStandardsKitchenTemp] = useState(180); // 160 to 200 deg C
  const [standardsIsolateKitchens, setStandardsIsolateKitchens] = useState(true);
  const [standardsHumidity, setStandardsHumidity] = useState(48); // 40% - 60% relative humidity
  const [standardsHygieneChecklist, setStandardsHygieneChecklist] = useState({
    utensilSanitization: true,
    desiGheePurityTest: true,
    silverLeafVerification: true,
    staffHealthLogs: true
  });

  // Add Item Form State & Delete Modal State
  const [showAddForm, setShowAddForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isVeg: true,
    isSugarFree: false,
    image: ''
  });

  // Bulk generator inputs
  const [bulkCount, setBulkCount] = useState(50);

  // Credentials requested by user
  const ADMIN_EMAIL = 'manishroyal450@gmail.com';
  const ADMIN_PASSWORD = 'Ashu@#12';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      localStorage.setItem('admin_logged_in', 'true');
      setError('');
    } else {
      setError('Invalid email address or secure password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('admin_logged_in');
    setEmail('');
    setPassword('');
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!newItem.name || !newItem.price || !newItem.category) {
      setFormError('Please fill out the item name, price, and category.');
      return;
    }

    const priceNum = parseFloat(newItem.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Please enter a valid price.');
      return;
    }

    // Default high contrast beautiful images if not specified
    const defaultImage = invType === 'sweet' 
      ? 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=60'
      : 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=60';

    const itemToAdd: MenuItem = {
      id: `custom-${invType}-${Date.now()}`,
      name: newItem.name,
      description: newItem.description || 'Delectable traditional offering cooked to order.',
      price: priceNum,
      category: newItem.category,
      image: newItem.image || defaultImage,
      type: invType,
      isVeg: newItem.isVeg,
      isSugarFree: invType === 'sweet' ? newItem.isSugarFree : undefined,
      rating: 5.0,
      popular: true
    };

    onAddItem(itemToAdd);
    setShowAddForm(false);
    setNewItem({
      name: '',
      description: '',
      price: '',
      category: '',
      isVeg: true,
      isSugarFree: false,
      image: ''
    });
  };

  // Calculations for KPI dashboard cards
  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  const sweetCapacityPct = (sweets.length / 5000) * 100;
  const restCapacityPct = (restaurant.length / 4000) * 100;

  // Filter products lists
  const currentInvList = invType === 'sweet' ? sweets : restaurant;
  const filteredInv = currentInvList.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If not logged in, render beautiful login interface
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12" id="admin-login-view">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-center text-white relative">
            <div className="absolute top-4 right-4 bg-amber-500/10 text-amber-500 p-1.5 rounded-full border border-amber-500/20">
              <Lock className="h-4 w-4" />
            </div>
            <span className="text-xs tracking-widest text-amber-400 font-bold block uppercase mb-1">
              PROPRIETARY INTERFACE
            </span>
            <h2 className="text-2xl font-black tracking-tight font-sans text-white">
              Quality Admin Portal
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
              Log in to manage database slots, inspect table reservations, and view transactions.
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 text-xs p-3.5 rounded-xl border border-red-100 flex items-start gap-2.5 animate-pulse">
                <X className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                Authorized Email Address
              </label>
              <input
                type="email"
                required
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider flex justify-between">
                <span>Secure Password</span>
                <span className="text-[10px] text-slate-400 font-normal normal-case">Case Sensitive</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-orange-600/15 text-sm transition-all duration-200 hover:-translate-y-0.5 flex justify-center items-center gap-2"
            >
              <Unlock className="h-4 w-4" />
              Unlock Workspace
            </button>

            <div className="text-center pt-2">
              <span className="text-[10px] text-slate-400 block font-mono">
                Session Token: SECURE_MD5_AES_SHARED
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Admin Workspace UI
  return (
    <div className="space-y-8 pb-24" id="admin-workspace-container">
      {/* Top Admin Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-900 font-bold text-[10px] tracking-widest px-2.5 py-0.5 rounded-full uppercase">
              ACTIVE SESSION
            </span>
            <span className="text-slate-400 font-mono text-[11px]">{ADMIN_EMAIL}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1 text-white">
            Quality Sweets Control Center
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Admin console for database slot configuration & real-time dining floor metrics.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-xs font-bold text-amber-400 border border-slate-700 transition cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Terminate Session
        </button>
      </div>

      {/* 3D Unified Operational Standard Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 rounded-3xl p-6 md:p-8 text-white border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-center gap-8" id="operational-standard-banner">
        {/* Abstract background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        {/* Left: Text Description & Real-time indices */}
        <div className="flex-1 space-y-4 text-left z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping shrink-0" />
              Unified Operational Standard (QSUOS v4.2)
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" />
              ONLINE & COMPLIANT
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
            Unified Operational Standard Dashboard
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
            Our unified standard enforces strict synchronous segregation. We allocate exactly <strong className="text-amber-400">5,000 persistent bulk slots</strong> for sweets to ensure optimal preparation under separate desi ghee operations, and <strong className="text-orange-400">4,000 table recipe slots</strong> to verify same-day kitchen ingredient freshness.
          </p>

          {/* Mini sliders / real-time readings in banner for user feedback */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col justify-between">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[9px] font-bold uppercase tracking-wider">Cold Storage</span>
                <Thermometer className="h-3.5 w-3.5 text-amber-400" />
              </div>
              <span className="text-sm font-extrabold text-amber-300 mt-1">{standardsSweetsTemp.toFixed(1)}°C</span>
              <span className="text-[8px] text-slate-400 mt-0.5">Optimal (2°C - 4°C)</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col justify-between">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[9px] font-bold uppercase tracking-wider">Kitchen Temp</span>
                <Flame className="h-3.5 w-3.5 text-orange-400" />
              </div>
              <span className="text-sm font-extrabold text-orange-400 mt-1">{standardsKitchenTemp}°C</span>
              <span className="text-[8px] text-slate-400 mt-0.5">Fryers calibrated</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col justify-between">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[9px] font-bold uppercase tracking-wider">Isolation Gate</span>
                <Activity className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <span className="text-sm font-extrabold text-emerald-400 mt-1">{standardsIsolateKitchens ? '100% SECURE' : 'OFFLINE'}</span>
              <span className="text-[8px] text-slate-400 mt-0.5">Sweets & Dining</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col justify-between">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[9px] font-bold uppercase tracking-wider">Live Humidity</span>
                <TrendingUp className="h-3.5 w-3.5 text-sky-400" />
              </div>
              <span className="text-sm font-extrabold text-sky-300 mt-1">{standardsHumidity}% RH</span>
              <span className="text-[8px] text-slate-400 mt-0.5">Dry room control</span>
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setActiveTab('standards')}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-orange-600/10 flex items-center gap-1.5 border border-amber-500/30 cursor-pointer"
            >
              <Sliders className="h-3.5 w-3.5" />
              Configure Operational Thresholds
            </button>
          </div>
        </div>

        {/* Right: Highly interactive 3D rotating shield emblem using framer motion */}
        <div className="relative w-48 h-48 md:w-56 md:h-56 shrink-0 flex items-center justify-center z-10" style={{ perspective: 1000 }}>
          <motion.div
            className="relative w-40 h-40 md:w-44 md:h-44 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{
              rotateY: [0, 360],
              rotateX: [12, -12, 12],
              y: [0, -8, 0]
            }}
            transition={{
              rotateY: { duration: 12, ease: "linear", repeat: Infinity },
              rotateX: { duration: 6, ease: "easeInOut", repeat: Infinity },
              y: { duration: 4, ease: "easeInOut", repeat: Infinity }
            }}
            whileHover={{ scale: 1.1, rotateZ: 5 }}
          >
            {/* Ambient glow backing */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 opacity-25 blur-xl animate-pulse" />
            
            {/* Layer 1: Bottom 3D Ring with perspective border */}
            <div 
              className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-950 border-4 border-amber-500/50 shadow-2xl flex items-center justify-center"
              style={{ transform: 'translateZ(-15px)', transformStyle: 'preserve-3d' }}
            >
              {/* Star spikes inside for a royal 3D look */}
              <div className="absolute inset-2 rounded-full border border-dashed border-amber-500/30 animate-[spin_30s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-orange-500/20" />
            </div>

            {/* Layer 2: Elevated 3D Glassmorphic Octagonal Medallion */}
            <div 
              className="absolute w-5/6 h-5/6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center"
              style={{ 
                transform: 'translateZ(10px) rotate(45deg)',
                transformStyle: 'preserve-3d' 
              }}
            >
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ transform: 'rotate(-45deg) translateZ(15px)' }}
              >
                {/* Central shining icon */}
                <Award className="w-14 h-14 text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)] animate-pulse" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-bounce" />
              </div>
            </div>

            {/* Layer 3: Top Text and Ring, hovering high in 3D */}
            <div 
              className="absolute text-center flex flex-col justify-center items-center pointer-events-none"
              style={{ transform: 'translateZ(35px)' }}
            >
              <div className="bg-slate-950/80 backdrop-blur-sm border border-amber-500/40 rounded-full px-3 py-1 font-mono text-[9px] font-black text-amber-400 tracking-wider flex items-center gap-1 shadow-md">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                Q-GOLD
              </div>
            </div>

            {/* Floating 3D Sparkles and Orbs at various Z depths */}
            <div 
              className="absolute w-3.5 h-3.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.9)]"
              style={{ transform: 'translate3d(60px, -60px, 45px)' }}
            />
            <div 
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.9)]"
              style={{ transform: 'translate3d(-65px, 50px, 30px)' }}
            />
            <div 
              className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
              style={{ transform: 'translate3d(20px, 65px, 55px)' }}
            />
          </motion.div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-orange-50 text-orange-600">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Total Orders</span>
            <span className="text-2xl font-black text-slate-900">{orders.length}</span>
            <span className="text-[10px] text-amber-600 block font-medium mt-0.5">
              {pendingOrdersCount} Pending Actions
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Paid Revenue</span>
            <span className="text-2xl font-black text-slate-900">₹{totalRevenue}</span>
            <span className="text-[10px] text-emerald-600 block font-medium mt-0.5">
              From completed receipts
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Sweets Slots</span>
              <span className="text-2xl font-black text-slate-900">{sweets.length} <span className="text-xs text-slate-400 font-normal">/ 5,000</span></span>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sweetCapacityPct > 90 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'}`}>
              {sweetCapacityPct.toFixed(0)}% Used
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${sweetCapacityPct > 90 ? 'bg-red-500' : 'bg-amber-500'}`}
              style={{ width: `${Math.min(100, sweetCapacityPct)}%` }}
            />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Dining Items</span>
              <span className="text-2xl font-black text-slate-900">{restaurant.length} <span className="text-xs text-slate-400 font-normal">/ 4,000</span></span>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${restCapacityPct > 90 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'}`}>
              {restCapacityPct.toFixed(0)}% Used
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${restCapacityPct > 90 ? 'bg-red-500' : 'bg-orange-500'}`}
              style={{ width: `${Math.min(100, restCapacityPct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-bold border-b-2 transition uppercase tracking-wider whitespace-nowrap ${activeTab === 'orders' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
        >
          Orders & Transactions ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 text-sm font-bold border-b-2 transition uppercase tracking-wider whitespace-nowrap ${activeTab === 'inventory' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
        >
          Menu Inventory & Slots
        </button>
        <button
          onClick={() => setActiveTab('spaces')}
          className={`pb-3 text-sm font-bold border-b-2 transition uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'spaces' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
        >
          <LayoutDashboard className="h-4 w-4 text-emerald-600" />
          <span>Spaces Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('capacity')}
          className={`pb-3 text-sm font-bold border-b-2 transition uppercase tracking-wider whitespace-nowrap ${activeTab === 'capacity' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
        >
          Simulation Tools
        </button>
        <button
          onClick={() => setActiveTab('standards')}
          className={`pb-3 text-sm font-bold border-b-2 transition uppercase tracking-wider whitespace-nowrap ${activeTab === 'standards' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
        >
          Operational Standards
        </button>
      </div>

      {/* TAB CONTENT: ORDERS */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Live Orders Queue</h3>
              {orders.length > 0 && (
                <button
                  onClick={onClearOrders}
                  className="text-xs font-bold text-red-600 hover:text-red-700"
                >
                  Clear All History
                </button>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm text-slate-400 space-y-2">
                <ShoppingBag className="h-10 w-10 mx-auto opacity-40 text-slate-300" />
                <p className="text-sm font-bold">No orders placed in this session.</p>
                <p className="text-xs">Add products to your cart and place a test order to see it instantly populate here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div 
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`bg-white p-5 rounded-2xl border transition cursor-pointer shadow-sm hover:border-amber-300 ${selectedOrder?.id === order.id ? 'ring-2 ring-amber-500 border-amber-400' : 'border-slate-100'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-sm">{order.id}</span>
                          <span className={`text-[10px] px-2 py-0.5 font-bold rounded-full uppercase ${
                            order.status === 'pending' ? 'bg-amber-50 text-amber-600' : 
                            order.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                            'bg-red-50 text-red-600'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-1">{order.timestamp}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-slate-900 block">₹{order.total}</span>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
                          {order.details.orderType}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center text-xs">
                      <div className="text-slate-600 font-medium">
                        Customer: <strong className="text-slate-900">{order.details.customerName}</strong>
                      </div>
                      <span className="text-amber-600 font-bold hover:underline">View Receipt Details &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Order Detail Sidebar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 h-fit">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-3">
              Receipt Inspection Window
            </h3>

            {selectedOrder ? (
              <div className="space-y-6">
                {/* Status controllers */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Update Order Status</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => onUpdateOrderStatus(selectedOrder.id, 'pending')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition ${
                        selectedOrder.status === 'pending' ? 'bg-amber-50 border-amber-300 text-amber-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => onUpdateOrderStatus(selectedOrder.id, 'completed')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition ${
                        selectedOrder.status === 'completed' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => onUpdateOrderStatus(selectedOrder.id, 'cancelled')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition ${
                        selectedOrder.status === 'cancelled' ? 'bg-red-50 border-red-300 text-red-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Details list */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wider">Customer Name</span>
                    <span className="font-bold text-slate-900">{selectedOrder.details.customerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wider">Contact Number</span>
                    <span className="font-bold text-slate-900">{selectedOrder.details.customerPhone}</span>
                  </div>
                  {selectedOrder.details.orderType === 'dine-in' ? (
                    <div>
                      <span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wider">Table Allocation</span>
                      <span className="font-bold text-orange-700">{selectedOrder.details.tableNumber || 'Unassigned'}</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wider">Delivery/Takeaway Address</span>
                      <span className="font-bold text-slate-900">{selectedOrder.details.address || 'Parcel Pickup'}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wider">Timestamp</span>
                    <span className="font-bold text-slate-900">{selectedOrder.timestamp}</span>
                  </div>
                </div>

                {/* Items ordered */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Ordered Items</span>
                  <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                    {selectedOrder.items.map((it) => (
                      <div key={it.item.id} className="py-2.5 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-slate-800">{it.item.name}</span>
                          <span className="text-slate-400 block">Qty: {it.quantity} &times; ₹{it.item.price}</span>
                        </div>
                        <span className="font-bold text-slate-900">₹{it.item.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center font-black text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-lg">₹{selectedOrder.total}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-12">
                Click on any order card in the queue to inspect details & complete fulfillment workflow.
              </p>
            )}
          </div>
        </div>
      )}


      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Header controllers */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            {/* Inventory selector */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setInvType('sweet')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition uppercase ${invType === 'sweet' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Sweets ({sweets.length} / 5,000)
              </button>
              <button
                onClick={() => setInvType('restaurant')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition uppercase ${invType === 'restaurant' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Restaurant Dining ({restaurant.length} / 4,000)
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search inventory items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 w-full sm:w-48 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0"
              >
                <PlusCircle className="h-4 w-4" />
                {showAddForm ? 'Close Editor' : 'Create Item'}
              </button>
            </div>
          </div>

          {/* ADD ITEM EDITOR */}
          {showAddForm && (
            <form onSubmit={handleAddNewItem} className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add New Custom {invType === 'sweet' ? 'Sweet' : 'Restaurant Dining'} Item
                </h3>
                <p className="text-[11px] text-slate-400">
                  Ensure you don't exceed strict storage limits ({invType === 'sweet' ? '5,000' : '4,000'} limit).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 block uppercase tracking-wider">Item Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Shahi Kesar Kulfi"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 block uppercase tracking-wider">Item Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="E.g. 150"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 block uppercase tracking-wider">Category</label>
                  <select
                    required
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- Choose Category --</option>
                    {(invType === 'sweet' ? SWEET_CATEGORIES : RESTAURANT_CATEGORIES)
                      .filter(cat => cat !== 'All')
                      .map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))
                    }
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 block uppercase tracking-wider">Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="Paste Unsplash image URL or leave blank for dynamic placeholder"
                    value={newItem.image}
                    onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 block uppercase tracking-wider">Short Description</label>
                  <input
                    type="text"
                    placeholder="Brief savory notes describing sensory taste..."
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItem.isVeg}
                    onChange={(e) => setNewItem({ ...newItem, isVeg: e.target.checked })}
                    className="rounded text-amber-600 bg-slate-800 border-slate-700 h-4 w-4"
                  />
                  <span className="text-xs font-bold text-slate-300">Pure Veg Product</span>
                </label>

                {invType === 'sweet' && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newItem.isSugarFree}
                      onChange={(e) => setNewItem({ ...newItem, isSugarFree: e.target.checked })}
                      className="rounded text-amber-600 bg-slate-800 border-slate-700 h-4 w-4"
                    />
                    <span className="text-xs font-bold text-slate-300">Sugar-Free Offering</span>
                  </label>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold px-5 py-2 rounded-lg transition"
                >
                  Confirm Item Addition
                </button>
              </div>
            </form>
          )}

          {/* INVENTORY TABLE */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Item</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Rating/Popularity</th>
                    <th className="py-4 px-6 text-right">Delete Slot</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredInv.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                        No products found matching "{searchQuery}"
                      </td>
                    </tr>
                  ) : (
                    filteredInv.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6 flex items-center gap-3">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 object-cover rounded-lg border border-slate-100 shrink-0"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                          )}
                          <div>
                            <span className="font-bold text-slate-900 block">{item.name}</span>
                            <span className="text-[10px] text-slate-400 block max-w-xs truncate">{item.description}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="bg-slate-100 text-slate-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900">
                          ₹{item.price}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800">★ {item.rating || '5.0'}</span>
                            {item.popular && (
                              <span className="bg-amber-100 text-amber-800 font-bold text-[9px] px-1.5 py-0.5 rounded">
                                POPULAR
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-xl font-bold text-xs transition border border-red-200 inline-flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete Slot</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Delete Product Confirmation Modal Overlay */}
          {deleteTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 text-left">
                <div className="flex items-center gap-3 text-red-600">
                  <div className="p-3 bg-red-100 rounded-2xl shrink-0">
                    <Trash2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Delete Product from Menu</h3>
                    <p className="text-xs text-slate-500 font-medium">इन्वेंटरी से प्रोडक्ट हटाएं</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center gap-3">
                  <img 
                    src={deleteTarget.image} 
                    alt={deleteTarget.name}
                    className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0" 
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{deleteTarget.name}</h4>
                    <span className="text-xs font-semibold text-slate-500">
                      Category: {deleteTarget.category} • ₹{deleteTarget.price}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  क्या आप वाकई <strong>{deleteTarget.name}</strong> को इन्वेंटरी सूची से हमेशा के लिए डिलीट करना चाहते हैं?
                </p>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                  >
                    Cancel (कैंसल)
                  </button>
                  <button
                    onClick={() => {
                      onRemoveItem(deleteTarget.id);
                      setDeleteTarget(null);
                    }}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Yes, Delete (डिलीट करें)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: SPACES DASHBOARD */}
      {activeTab === 'spaces' && (
        <div className="animate-fadeIn">
          <DashboardView 
            sweets={sweets}
            restaurant={restaurant}
            onAddBulkItems={onAddBulkItems}
            onClearBulkItems={onClearBulkItems}
          />
        </div>
      )}

      {/* TAB CONTENT: SIMULATION TOOLS */}
      {activeTab === 'capacity' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Layers className="h-5 w-5 text-amber-600" />
              Sweets Space Simulator (5,000 Limit)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generate dozens of mock sweet dishes instantly to stress test the UI, check slot capacity warnings, or examine high-load grid layouts.
            </p>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block uppercase">Number of Sweet Slots to Fill</label>
                <div className="flex gap-4">
                  <input
                    type="range"
                    min="1"
                    max="500"
                    value={bulkCount}
                    onChange={(e) => setBulkCount(parseInt(e.target.value))}
                    className="flex-grow accent-amber-600"
                  />
                  <span className="text-sm font-bold text-slate-900 w-12 text-right">{bulkCount}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => onAddBulkItems('sweet', bulkCount)}
                  disabled={sweets.length >= 5000}
                  className="flex-grow bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition"
                >
                  Generate Sweets
                </button>
                <button
                  onClick={() => onClearBulkItems('sweet')}
                  className="bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2.5 px-4 rounded-xl text-xs transition border border-red-100"
                >
                  Reset To Initial Sweets
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Layers className="h-5 w-5 text-orange-600" />
              Dining Space Simulator (4,000 Limit)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Simulate full restaurant seating dishes, evaluate fast kitchen operations, and inspect capacity limits of the dining inventory database.
            </p>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block uppercase">Number of Restaurant Slots to Fill</label>
                <div className="flex gap-4">
                  <input
                    type="range"
                    min="1"
                    max="500"
                    value={bulkCount}
                    onChange={(e) => setBulkCount(parseInt(e.target.value))}
                    className="flex-grow accent-orange-600"
                  />
                  <span className="text-sm font-bold text-slate-900 w-12 text-right">{bulkCount}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => onAddBulkItems('restaurant', bulkCount)}
                  disabled={restaurant.length >= 4000}
                  className="flex-grow bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition"
                >
                  Generate Restaurant Items
                </button>
                <button
                  onClick={() => onClearBulkItems('restaurant')}
                  className="bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2.5 px-4 rounded-xl text-xs transition border border-red-100"
                >
                  Reset To Initial Seating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: OPERATIONAL STANDARDS */}
      {activeTab === 'standards' && (
        <div className="space-y-8" id="standards-tab-content">
          {/* Quick Alert Warning based on real capacity */}
          {(sweets.length >= 4500 || restaurant.length >= 3600) && (
            <div className="bg-red-50 border border-red-200 text-red-900 rounded-2xl p-5 flex items-start gap-3.5 animate-pulse text-left">
              <ShieldAlert className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-sm uppercase tracking-wider">Operational Slot Capacity Warning!</h4>
                <p className="text-xs text-red-700 mt-1">
                  Current database allocation exceeds optimal unified standards. 
                  {sweets.length >= 4500 && ` Sweets count (${sweets.length}/5,000) is in critical threshold.`}
                  {restaurant.length >= 3600 && ` Dining seating items (${restaurant.length}/4,000) is near exhaustion.`}
                  Please use Simulation Tools to release slots and restore compliant parameters.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Interactive Control Console */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <div className="text-left">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <Sliders className="h-5 w-5 text-amber-600" />
                      Live Environmental Controls
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">Tweak variables to calibrate the simulated facility's parameters in real-time.</p>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase shrink-0">
                    CALIBRATION MODE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sweet Cold Storage Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700 uppercase flex items-center gap-1.5">
                        <Thermometer className="h-4 w-4 text-amber-500" />
                        Sweets Cold Storage Temp
                      </span>
                      <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                        standardsSweetsTemp >= 2 && standardsSweetsTemp <= 4 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-red-50 text-red-700 animate-pulse'
                      }`}>
                        {standardsSweetsTemp.toFixed(1)} °C
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={standardsSweetsTemp}
                      onChange={(e) => setStandardsSweetsTemp(parseFloat(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>0°C (Freezing)</span>
                      <span className="font-bold text-amber-600">Standard range: 2.0°C - 4.0°C</span>
                      <span>10°C (Warm)</span>
                    </div>
                  </div>

                  {/* Dining Kitchen Fryer Temp */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700 uppercase flex items-center gap-1.5">
                        <Flame className="h-4 w-4 text-orange-500" />
                        Deep Fryer Temperature
                      </span>
                      <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                        standardsKitchenTemp >= 170 && standardsKitchenTemp <= 190 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-red-50 text-red-700 animate-pulse'
                      }`}>
                        {standardsKitchenTemp} °C
                      </span>
                    </div>
                    <input
                      type="range"
                      min="140"
                      max="220"
                      step="1"
                      value={standardsKitchenTemp}
                      onChange={(e) => setStandardsKitchenTemp(parseInt(e.target.value))}
                      className="w-full accent-orange-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>140°C</span>
                      <span className="font-bold text-orange-600">Standard range: 170°C - 190°C</span>
                      <span>220°C (Smoke)</span>
                    </div>
                  </div>

                  {/* Humidity Control Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700 uppercase flex items-center gap-1.5">
                        <TrendingUp className="h-4 w-4 text-sky-500" />
                        Ambient Dryness (Humidity)
                      </span>
                      <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                        standardsHumidity >= 40 && standardsHumidity <= 55 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {standardsHumidity}% RH
                      </span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="70"
                      step="1"
                      value={standardsHumidity}
                      onChange={(e) => setStandardsHumidity(parseInt(e.target.value))}
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>30% RH (Arid)</span>
                      <span className="font-bold text-sky-600">Standard range: 40% - 55% RH</span>
                      <span>70% RH (Damp)</span>
                    </div>
                  </div>

                  {/* Kitchen Isolation Switch */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div className="space-y-0.5 text-left">
                      <span className="text-xs font-bold text-slate-800 block uppercase">Dual Kitchen Isolation Gate</span>
                      <p className="text-[10px] text-slate-400 max-w-[200px]">Strict physical and utensil isolation between Sweets and Dining.</p>
                    </div>
                    <button
                      onClick={() => setStandardsIsolateKitchens(!standardsIsolateKitchens)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        standardsIsolateKitchens ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          standardsIsolateKitchens ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Checklist & Hygiene Score */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <div className="text-left">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-600" />
                      Critical Hygiene Verification Logs
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium font-sans">Confirm mandatory safety controls are physically verified today.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Checklist item 1 */}
                  <label className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 transition cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={standardsHygieneChecklist.utensilSanitization}
                      onChange={(e) => setStandardsHygieneChecklist({
                        ...standardsHygieneChecklist,
                        utensilSanitization: e.target.checked
                      })}
                      className="h-4.5 w-4.5 rounded text-amber-600 border-slate-300 focus:ring-amber-500 accent-amber-600"
                    />
                    <div className="text-left">
                      <span className="text-xs font-bold text-slate-800 block">Double Utensil Sterilization</span>
                      <span className="text-[10px] text-slate-400 block">Autoclave sanitation at 82°C.</span>
                    </div>
                  </label>

                  {/* Checklist item 2 */}
                  <label className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 transition cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={standardsHygieneChecklist.desiGheePurityTest}
                      onChange={(e) => setStandardsHygieneChecklist({
                        ...standardsHygieneChecklist,
                        desiGheePurityTest: e.target.checked
                      })}
                      className="h-4.5 w-4.5 rounded text-amber-600 border-slate-300 focus:ring-amber-500 accent-amber-600"
                    />
                    <div className="text-left">
                      <span className="text-xs font-bold text-slate-800 block">Desi Ghee Refractometer Test</span>
                      <span className="text-[10px] text-slate-400 block">Purity checking for traditional sweets.</span>
                    </div>
                  </label>

                  {/* Checklist item 3 */}
                  <label className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 transition cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={standardsHygieneChecklist.silverLeafVerification}
                      onChange={(e) => setStandardsHygieneChecklist({
                        ...standardsHygieneChecklist,
                        silverLeafVerification: e.target.checked
                      })}
                      className="h-4.5 w-4.5 rounded text-amber-600 border-slate-300 focus:ring-amber-500 accent-amber-600"
                    />
                    <div className="text-left">
                      <span className="text-xs font-bold text-slate-800 block">Silver Leaf (Chandi-Vark) Purity</span>
                      <span className="text-[10px] text-slate-400 block">Certified 100% vegetarian non-toxic vark.</span>
                    </div>
                  </label>

                  {/* Checklist item 4 */}
                  <label className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 transition cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={standardsHygieneChecklist.staffHealthLogs}
                      onChange={(e) => setStandardsHygieneChecklist({
                        ...standardsHygieneChecklist,
                        staffHealthLogs: e.target.checked
                      })}
                      className="h-4.5 w-4.5 rounded text-amber-600 border-slate-300 focus:ring-amber-500 accent-amber-600"
                    />
                    <div className="text-left">
                      <span className="text-xs font-bold text-slate-800 block">Daily Staff Screening Logs</span>
                      <span className="text-[10px] text-slate-400 block">Pre-shift temperature & hygiene review.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Compliance Sidebar summary */}
            <div className="space-y-6">
              {/* Score meter card */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6 relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-12 -mt-12" />
                
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-amber-400 animate-pulse" />
                    Overall Health Score
                  </h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-5xl font-black text-white">
                      {Math.round(
                        (standardsSweetsTemp >= 2 && standardsSweetsTemp <= 4 ? 25 : 10) +
                        (standardsKitchenTemp >= 170 && standardsKitchenTemp <= 190 ? 25 : 10) +
                        (standardsIsolateKitchens ? 25 : 0) +
                        (Object.values(standardsHygieneChecklist).filter(Boolean).length * 6.25)
                      )}
                    </span>
                    <span className="text-xl font-bold text-slate-400">/ 100</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Calculated in real-time from active sensor data and checked logs.</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Active Directives</div>
                  
                  <div className="flex items-start gap-2 text-xs">
                    <div className={`p-1 rounded-full mt-0.5 ${standardsSweetsTemp >= 2 && standardsSweetsTemp <= 4 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      <Check className="h-3 w-3" />
                    </div>
                    <div>
                      <span className="font-semibold block text-slate-200">Sweets Chilling Compliance</span>
                      <span className="text-[10px] text-slate-400">Current temperature calibrator reading is {standardsSweetsTemp.toFixed(1)}°C (ideal: 2-4°C).</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs">
                    <div className={`p-1 rounded-full mt-0.5 ${standardsKitchenTemp >= 170 && standardsKitchenTemp <= 190 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      <Check className="h-3 w-3" />
                    </div>
                    <div>
                      <span className="font-semibold block text-slate-200">Fryer Heat Calibrations</span>
                      <span className="text-[10px] text-slate-400">Deep fryer registers at {standardsKitchenTemp}°C (ideal: 170-190°C).</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs">
                    <div className={`p-1 rounded-full mt-0.5 ${standardsIsolateKitchens ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      <Check className="h-3 w-3" />
                    </div>
                    <div>
                      <span className="font-semibold block text-slate-200">Sweets Isolation Gate</span>
                      <span className="text-[10px] text-slate-400">{standardsIsolateKitchens ? 'Independent preparation zone secure.' : 'Utensil isolation breach detected!'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">Unified SLA standards</span>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Hot Dining Served</span>
                    <span className="font-extrabold text-orange-400">&lt; 15 Mins</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Sweets Packaging Delivery</span>
                    <span className="font-extrabold text-amber-400">&lt; 45 Mins</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
