import React from 'react';
import { ViewMode, UserProfile } from '../types';
import { Store, Utensils, LayoutDashboard, ShoppingBag, Home, ShieldCheck, User, Sparkles, ArrowLeft } from 'lucide-react';
import quality3dLogo from '../assets/images/quality_3d_clean_logo_1785004219061.jpg';

interface NavbarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  cartCount: number;
  activeUser: UserProfile | null;
  onOpenAiAssistant?: () => void;
  onBack?: () => void;
}

export default function Navbar({ currentView, onViewChange, cartCount, activeUser, onOpenAiAssistant, onBack }: NavbarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50 text-emerald-700' },
    { id: 'sweet-shop', label: 'Sweets', icon: Store, colorClass: 'text-green-600', bgClass: 'bg-green-50 text-green-700' },
    { id: 'restaurant', label: 'Dine', icon: Utensils, colorClass: 'text-teal-600', bgClass: 'bg-teal-50 text-teal-700' },
    { id: 'dashboard', label: 'Spaces', icon: LayoutDashboard, colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50 text-emerald-700' },
    { id: 'profile', label: activeUser ? activeUser.fullName.split(' ')[0] : 'Profile', icon: User, colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50 text-emerald-700' },
  ];

  return (
    <>
      {/* Top Header: Branding & Cart */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm transition-all duration-300" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Back Button Group */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {currentView !== 'home' && (
                <button
                  id="header-back-button"
                  onClick={onBack || (() => onViewChange('home'))}
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all border border-slate-200 shadow-2xs cursor-pointer shrink-0"
                  aria-label="Back to Previous Page"
                >
                  <ArrowLeft className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span className="hidden xs:inline">Back</span>
                </button>
              )}

              <div 
                onClick={() => onViewChange('home')} 
                className="flex items-center space-x-2 cursor-pointer group"
                id="logo-container"
              >
                <div className="relative p-1 rounded-xl bg-gradient-to-tr from-amber-200 via-white to-amber-300 border border-amber-300/80 shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform overflow-hidden">
                  <img 
                    src={quality3dLogo} 
                    alt="Quality Logo" 
                    className="w-8 h-8 object-contain rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent font-sans">
                    Quality
                  </span>
                  <span className="text-xs block text-slate-500 font-medium -mt-1 font-sans">
                    Sweets & Restaurant
                  </span>
                </div>
              </div>
            </div>

            {/* Cart, Profile & Admin Controls */}
            <div className="flex items-center space-x-2 sm:space-x-2.5" id="nav-controls">
              {/* AI Search Assistant Button */}
              {onOpenAiAssistant && (
                <button
                  id="ai-assistant-trigger-btn"
                  onClick={onOpenAiAssistant}
                  className="flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 transition-all duration-200 border border-emerald-500/30 shadow-md shadow-emerald-600/20 font-bold text-xs cursor-pointer group"
                  aria-label="Open AI Assistant Search"
                >
                  <Sparkles className="h-4 w-4 text-emerald-200 animate-pulse group-hover:rotate-12 transition-transform" />
                  <span className="hidden sm:inline">AI Search</span>
                </button>
              )}

              {/* Profile Button */}
              <button
                id="profile-trigger-btn"
                onClick={() => onViewChange('profile')}
                className={`flex items-center gap-1.5 p-2.5 rounded-xl transition-all duration-200 border cursor-pointer ${
                  currentView === 'profile'
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20 font-bold'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 font-semibold'
                }`}
                aria-label="View Customer Profile"
              >
                <User className="h-5 w-5" />
                <span className="text-xs hidden sm:inline">
                  {activeUser ? activeUser.fullName.split(' ')[0] : 'Profile'}
                </span>
              </button>

              {/* Admin Button */}
              <button
                id="admin-trigger-btn"
                onClick={() => onViewChange('admin')}
                className={`flex items-center gap-1.5 p-2.5 rounded-xl transition-all duration-200 border cursor-pointer ${
                  currentView === 'admin'
                    ? 'bg-slate-900 border-slate-900 text-amber-400 shadow-lg shadow-slate-900/20 font-bold'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 font-semibold'
                }`}
                aria-label="View Admin Panel"
              >
                <ShieldCheck className="h-5 w-5" />
                <span className="text-xs hidden sm:inline">Admin</span>
              </button>

              {/* Cart Button */}
              <button
                id="cart-trigger-btn"
                onClick={() => onViewChange('cart')}
                className={`relative p-2.5 rounded-xl transition-all duration-200 border flex items-center justify-center cursor-pointer ${
                  currentView === 'cart'
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900'
                }`}
                aria-label="View Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Unified Bottom Navigation Bar (Works beautifully on Desktop and Mobile) */}
      <div 
        className="fixed bottom-0 md:bottom-6 left-0 md:left-1/2 md:-translate-x-1/2 right-0 md:right-auto bg-white/95 md:bg-white/90 backdrop-blur-md border-t md:border border-slate-200 md:border-emerald-100/50 px-1.5 sm:px-4 md:px-8 py-2 md:py-3 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:shadow-xl md:rounded-2xl flex justify-around md:justify-center md:gap-2 items-center w-full md:w-auto" 
        id="bottom-nav-bar"
      >
        {currentView !== 'home' && (
          <button
            id="bottom-nav-back-btn"
            onClick={onBack || (() => onViewChange('home'))}
            className="flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2 px-1 sm:px-2 md:px-4 py-1 md:py-2 rounded-xl text-[10px] md:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all min-w-[44px] sm:min-w-[54px] cursor-pointer"
            aria-label="Navigate Back"
          >
            <ArrowLeft className="h-5 w-5 md:h-4 md:w-4 text-emerald-700" />
            <span className="text-[9px] md:text-xs">Back</span>
          </button>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => onViewChange(item.id as ViewMode)}
              className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-1 sm:px-2 md:px-5 py-1 md:py-2 rounded-xl text-[10px] md:text-sm font-semibold transition-all duration-200 min-w-[50px] sm:min-w-[60px] md:min-w-[110px] cursor-pointer ${
                isActive
                  ? item.bgClass + ' scale-105 shadow-sm font-bold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="h-5 w-5 md:h-4 md:w-4" />
              <span className="text-[9px] md:text-xs tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
