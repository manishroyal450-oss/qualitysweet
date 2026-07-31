import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Lock, 
  MapPin, 
  Phone, 
  Hash, 
  LogOut, 
  UserPlus, 
  LogIn, 
  CheckCircle, 
  AlertCircle, 
  ShoppingBag, 
  Calendar, 
  Edit3, 
  Save, 
  X,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { ViewMode, Order, UserProfile } from '../types';

interface ProfileViewProps {
  onViewChange: (view: ViewMode) => void;
  orders: Order[];
  activeUser: UserProfile | null;
  onActiveUserChange: (user: UserProfile | null) => void;
}

export default function ProfileView({ onViewChange, orders, activeUser, onActiveUserChange }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  
  // Validation / Message states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Filter orders for the current user
  const userOrders = activeUser 
    ? orders.filter(o => o.details.customerPhone === activeUser.contactNumber)
    : [];

  // Register Handler
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!contactNumber.trim() || contactNumber.length < 10) {
      setError('Please enter a valid 10-digit contact number');
      return;
    }
    if (!address.trim()) {
      setError('Please enter your complete address');
      return;
    }
    if (!pinCode.trim() || pinCode.length !== 6 || isNaN(Number(pinCode))) {
      setError('Please enter a valid 6-digit PIN code');
      return;
    }
    if (password.length !== 6 || isNaN(Number(password))) {
      setError('Password must be exactly a 6-digit number');
      return;
    }

    // Retrieve existing users list
    const usersStr = localStorage.getItem('registeredUsers') || '[]';
    let usersList: UserProfile[] = [];
    try {
      usersList = JSON.parse(usersStr);
    } catch (e) {
      usersList = [];
    }

    // Check if user already exists with this contact number
    const userExists = usersList.some(u => u.contactNumber === contactNumber);
    if (userExists) {
      setError('A customer is already registered with this contact number');
      return;
    }

    const newUser: UserProfile = {
      fullName: fullName.trim(),
      contactNumber: contactNumber.trim(),
      address: address.trim(),
      pinCode: pinCode.trim(),
      password: password
    };

    usersList.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(usersList));
    localStorage.setItem('activeUser', JSON.stringify(newUser));
    window.dispatchEvent(new Event('registeredUsersUpdated'));
    onActiveUserChange(newUser);
    setSuccess('Registration successful! Welcome to Quality Sweets & Restaurant.');
    
    // Clear registration fields
    setFullName('');
    setContactNumber('');
    setAddress('');
    setPinCode('');
    setPassword('');
  };

  // Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!contactNumber.trim()) {
      setError('Please enter your contact number');
      return;
    }
    if (password.length !== 6 || isNaN(Number(password))) {
      setError('Password must be a 6-digit number');
      return;
    }

    const usersStr = localStorage.getItem('registeredUsers') || '[]';
    let usersList: UserProfile[] = [];
    try {
      usersList = JSON.parse(usersStr);
    } catch (e) {
      usersList = [];
    }

    const matchingUser = usersList.find(
      u => u.contactNumber === contactNumber && u.password === password
    );

    if (!matchingUser) {
      setError('Invalid contact number or 6-digit password!');
      return;
    }

    localStorage.setItem('activeUser', JSON.stringify(matchingUser));
    onActiveUserChange(matchingUser);
    setSuccess(`Welcome back, ${matchingUser.fullName}!`);
    setPassword('');
    setContactNumber('');
  };

  // Edit / Update details
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!activeUser) return;
    if (!fullName.trim()) {
      setError('Name cannot be empty');
      return;
    }
    if (!address.trim()) {
      setError('Address cannot be empty');
      return;
    }
    if (!pinCode.trim() || pinCode.length !== 6 || isNaN(Number(pinCode))) {
      setError('PIN code must be a 6-digit number');
      return;
    }

    const updatedUser: UserProfile = {
      ...activeUser,
      fullName: fullName.trim(),
      address: address.trim(),
      pinCode: pinCode.trim()
    };

    // Update in usersList
    const usersStr = localStorage.getItem('registeredUsers') || '[]';
    let usersList: UserProfile[] = [];
    try {
      usersList = JSON.parse(usersStr);
    } catch (e) {}

    const updatedList = usersList.map(u => 
      u.contactNumber === activeUser.contactNumber ? updatedUser : u
    );

    localStorage.setItem('registeredUsers', JSON.stringify(updatedList));
    localStorage.setItem('activeUser', JSON.stringify(updatedUser));
    window.dispatchEvent(new Event('registeredUsersUpdated'));
    onActiveUserChange(updatedUser);
    setIsEditing(false);
    setSuccess('Profile updated successfully!');
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('activeUser');
    onActiveUserChange(null);
    setSuccess('Logged out successfully.');
    setError(null);
    setIsEditing(false);
  };

  // Initialize editing state fields
  const startEditing = () => {
    if (!activeUser) return;
    setFullName(activeUser.fullName);
    setAddress(activeUser.address);
    setPinCode(activeUser.pinCode);
    setIsEditing(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4" id="profile-container">
      {/* Notifications */}
      <AnimatePresence mode="wait">
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-left shadow-sm"
            id="profile-success-alert"
          >
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
            <div className="text-sm font-medium flex-grow">{success}</div>
            <button onClick={() => setSuccess(null)} className="text-emerald-500 hover:text-emerald-700">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-3 text-left shadow-sm"
            id="profile-error-alert"
          >
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            <div className="text-sm font-medium flex-grow">{error}</div>
            <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!activeUser ? (
        /* Login / Signup Card */
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden"
          id="auth-box"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-700 p-8 text-white text-left relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm mb-3">
              <Sparkles className="h-3 w-3 text-emerald-300" />
              Quality Customer Space
            </div>
            <h2 className="text-3xl font-black tracking-tight font-sans">
              Welcome to Quality Mithai
            </h2>
            <p className="text-white/80 text-xs mt-1.5 max-w-md">
              Create an account or login to track your fine-dining table booking, request sweet boxes, and order 100% pure-veg meals.
            </p>
          </div>

          {/* Form Tabs */}
          <div className="flex border-b border-slate-100 bg-slate-50/50" id="auth-tabs">
            <button
              onClick={() => { setActiveTab('login'); setError(null); }}
              className={`flex-1 py-4 text-center text-sm font-bold transition-all flex items-center justify-center gap-2 border-b-2 ${
                activeTab === 'login'
                  ? 'border-emerald-600 text-emerald-700 bg-white font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
              id="tab-login"
            >
              <LogIn className="h-4 w-4" />
              Sign In (Login)
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setError(null); }}
              className={`flex-1 py-4 text-center text-sm font-bold transition-all flex items-center justify-center gap-2 border-b-2 ${
                activeTab === 'signup'
                  ? 'border-emerald-600 text-emerald-700 bg-white font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
              id="tab-signup"
            >
              <UserPlus className="h-4 w-4" />
              Sign Up (Register)
            </button>
          </div>

          {/* Tab Content forms */}
          <div className="p-6 sm:p-10 text-left">
            {activeTab === 'login' ? (
              /* LOGIN FORM */
              <form onSubmit={handleLogin} className="space-y-5" id="login-form">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Contact Number (Phone)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="e.g. 9876543210"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl text-sm font-medium text-slate-800 transition outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    6-Digit Password PIN
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="••••••"
                      maxLength={6}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl text-sm font-mono tracking-widest text-slate-800 transition outline-none"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Enter your 6-digit passcode.</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-md shadow-emerald-600/15 transition-all mt-4 flex items-center justify-center gap-2"
                  id="btn-submit-login"
                >
                  <LogIn className="h-5 w-5" />
                  Sign In to Customer Profile
                </button>
              </form>
            ) : (
              /* SIGNUP FORM */
              <form onSubmit={handleSignUp} className="space-y-5" id="signup-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Manish Royal"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl text-sm font-medium text-slate-800 transition outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Contact Number (Phone)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="tel"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="10-digit mobile number"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl text-sm font-medium text-slate-800 transition outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Delivery & Contact Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter house no, street, locality or landmark details"
                      rows={3}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl text-sm font-medium text-slate-800 transition outline-none resize-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      PIN Code (6 digits)
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="e.g. 246725"
                        maxLength={6}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl text-sm font-medium text-slate-800 transition outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Choose 6-Digit PIN Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="e.g. 123456"
                        maxLength={6}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl text-sm font-mono tracking-widest text-slate-800 transition outline-none"
                        required
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Must be exactly 6 numeric digits.</p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-md shadow-emerald-600/15 transition-all mt-4 flex items-center justify-center gap-2"
                  id="btn-submit-register"
                >
                  <UserPlus className="h-5 w-5" />
                  Create Customer Account
                </button>
              </form>
            )}

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">100% Secure & Private Local Storage</span>
              <button
                type="button"
                onClick={() => onViewChange('privacy')}
                className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
                id="link-auth-privacy-policy"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Privacy Policy
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        /* CUSTOMER LOGGED IN PROFILE DASHBOARD */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left" id="profile-dashboard">
          {/* User Bio Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 relative overflow-hidden" id="profile-details-card">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
              
              {/* Profile Avatar / Header */}
              <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                <div className="h-16 w-16 bg-gradient-to-tr from-emerald-500 to-green-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg shadow-emerald-500/20">
                  {activeUser.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight font-sans">
                    {activeUser.fullName}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase mt-1">
                    👑 Premium Member
                  </span>
                </div>
              </div>

              {/* Editing / Static fields */}
              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="py-4 space-y-4" id="edit-profile-form">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-xs font-semibold outline-none text-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Delivery Address</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-xs font-semibold outline-none text-slate-800 resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-xs font-semibold outline-none text-slate-800 font-mono"
                      maxLength={6}
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition"
                      id="btn-save-profile"
                    >
                      <Save className="h-3.5 w-3.5" /> Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-5 space-y-4 text-xs font-semibold text-slate-600" id="profile-static-details">
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Phone</span>
                      <span className="text-slate-800 font-bold">{activeUser.contactNumber}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivery Address</span>
                      <span className="text-slate-800 leading-relaxed block">{activeUser.address}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Hash className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">PIN Code Area</span>
                      <span className="text-slate-800 font-mono font-bold">{activeUser.pinCode}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-slate-100">
                    <button
                      onClick={startEditing}
                      className="flex-1 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition"
                      id="btn-edit-profile"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> Update Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition"
                      id="btn-logout-profile"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Sign Out
                    </button>
                  </div>

                  <button
                    onClick={() => onViewChange('privacy')}
                    className="w-full mt-2 py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border border-slate-200/60"
                    id="btn-profile-privacy-link"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Privacy Policy & Data Rights
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions helper card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-lg">
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/10 rounded-full" />
              <span className="text-[9px] font-bold tracking-widest uppercase text-emerald-400 font-mono">100% Pure Vegetarian</span>
              <h4 className="text-base font-bold mt-1 font-sans">Hungry or Sweets Crafting?</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                Order fresh Desi Ghee Sweets or book a high-end multi-cuisine meal on our menu sections instantly.
              </p>
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => onViewChange('sweet-shop')}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition"
                >
                  Buy Mithai
                </button>
                <button 
                  onClick={() => onViewChange('restaurant')}
                  className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/10 transition"
                >
                  Dine-In Menu
                </button>
              </div>
            </div>
          </motion.div>

          {/* User Orders / History panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 flex flex-col h-full" id="profile-history-card">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight font-sans">
                    Order History
                  </h3>
                  <p className="text-[11px] text-slate-400">Past & active orders placed on this phone line</p>
                </div>
                <span className="bg-slate-100 text-slate-700 font-mono text-xs font-bold px-2.5 py-1 rounded-lg">
                  {userOrders.length} Orders
                </span>
              </div>

              {userOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 flex-grow" id="profile-empty-orders">
                  <div className="bg-slate-50 p-4 rounded-2xl text-slate-300 mb-3">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">No Orders Placed Yet</h4>
                  <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                    You haven't ordered any sweets or diner items in this session. Add delicious treats to your cart to checkout!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1" id="profile-orders-list">
                  {userOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className="border border-slate-100 rounded-2xl p-4 hover:bg-slate-50/50 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-800 font-mono">{order.id}</span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                            order.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                          <Calendar className="h-3 w-3" />
                          <span>{order.timestamp}</span>
                          <span>•</span>
                          <span className="text-slate-500">{order.details.orderType.toUpperCase()}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 max-w-md truncate">
                          {order.items.map(it => `${it.item.name} (x${it.quantity})`).join(', ')}
                        </p>
                      </div>

                      <div className="text-right shrink-0 sm:self-center">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Grand Total</span>
                        <span className="text-sm font-black text-emerald-700 font-mono">₹{order.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
