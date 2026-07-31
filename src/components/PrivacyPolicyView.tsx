import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Database, 
  Lock, 
  UserX, 
  PhoneCall, 
  FileText, 
  CheckCircle2, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { ViewMode, UserProfile } from '../types';

interface PrivacyPolicyViewProps {
  onViewChange: (view: ViewMode) => void;
  activeUser: UserProfile | null;
  onActiveUserChange: (user: UserProfile | null) => void;
}

export default function PrivacyPolicyView({ onViewChange, activeUser, onActiveUserChange }: PrivacyPolicyViewProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleDeleteLocalData = () => {
    // Delete local user data
    localStorage.removeItem('activeUser');
    localStorage.removeItem('registeredUsers');
    localStorage.removeItem('orders');
    onActiveUserChange(null);
    setShowDeleteModal(false);
    setDeleteSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 text-left font-sans" id="privacy-policy-container">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => onViewChange('home')}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl text-xs font-bold transition shadow-sm"
          id="btn-back-from-privacy"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <span className="text-[11px] font-mono font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
          Route: /privacy
        </span>
      </div>

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden mb-8 border border-emerald-600/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider backdrop-blur-md text-emerald-200">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Quality Sweets & Restaurant
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-emerald-100/80 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Your privacy and data transparency are paramount. This policy explains what information our application uses, how it is stored locally on your browser, and your rights over your data.
          </p>
          <div className="pt-2 text-[10px] text-emerald-200/70 font-mono">
            Last Updated: July 2026 • Applies to Quality Mithai & Dining Web Application
          </div>
        </div>
      </div>

      {/* Notification Toast for Data Deletion */}
      <AnimatePresence>
        {deleteSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between gap-3 shadow-sm"
            id="privacy-delete-alert"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <p className="text-xs font-semibold">
                Your local profile credentials, saved accounts, and local order history have been completely deleted from your browser storage.
              </p>
            </div>
            <button 
              onClick={() => setDeleteSuccess(false)}
              className="text-emerald-600 font-bold text-xs hover:underline shrink-0"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Cards Section */}
      <div className="space-y-6">
        
        {/* 1. Information We Collect */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <FileText className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              1. Information We Collect & Store
            </h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our application collects and processes only the information necessary for customer account registration, ordering food and sweets, and managing local customer sessions.
          </p>
          <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <li><strong className="text-slate-800">Account Credentials:</strong> Full Name, Contact Number (Phone), Delivery Address, PIN Code Area, and a 6-Digit Password PIN created during sign-up.</li>
            <li><strong className="text-slate-800">Order Information:</strong> Items selected from our Sweets or Restaurant menu, quantity, order total, timestamp, order type (dine-in, takeaway, or delivery), and delivery address or table number.</li>
          </ul>
        </div>

        {/* 2. Client-Side Browser Storage */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Database className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              2. Storage Methods (Browser LocalStorage)
            </h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            All user account records, profile details, cart selections, and order histories are stored directly on your personal device inside your web browser using standard <strong className="text-slate-800">Browser Local Storage (<code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-emerald-700">localStorage</code>)</strong>.
          </p>
          <div className="bg-amber-50/60 border border-amber-100 p-4 rounded-2xl text-xs text-amber-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-amber-800">
              <Info className="h-4 w-4 shrink-0 text-amber-600" />
              Local Storage Keys Utilized:
            </p>
            <p className="font-mono text-[11px] text-amber-800/90 leading-relaxed">
              <code className="bg-white/80 px-1 py-0.5 rounded border border-amber-200/60">activeUser</code>, <code className="bg-white/80 px-1 py-0.5 rounded border border-amber-200/60">registeredUsers</code>, <code className="bg-white/80 px-1 py-0.5 rounded border border-amber-200/60">orders</code>, <code className="bg-white/80 px-1 py-0.5 rounded border border-amber-200/60">cart</code>, <code className="bg-white/80 px-1 py-0.5 rounded border border-amber-200/60">custom_sweets</code>, <code className="bg-white/80 px-1 py-0.5 rounded border border-amber-200/60">custom_restaurant</code>.
            </p>
          </div>
        </div>

        {/* 3. How We Use Collected Data */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              3. How Collected Data Is Used
            </h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The data stored in your browser local storage is strictly used to fulfill app services:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-1">Account Management</h3>
              <p className="text-slate-500 text-[11px]">Allows you to sign in with your phone number and 6-digit PIN to access your profile.</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-1">Order Fulfillment</h3>
              <p className="text-slate-500 text-[11px]">Pre-fills delivery address and phone number when ordering food or booking table reservations.</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-1">Order History Tracking</h3>
              <p className="text-slate-500 text-[11px]">Maintains a readable list of your past orders for quick review and WhatsApp order sharing.</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-1">Customer Support</h3>
              <p className="text-slate-500 text-[11px]">Enables seamless assistance when contacting our restaurant team via phone or WhatsApp.</p>
            </div>
          </div>
        </div>

        {/* 4. Third-Party Sharing */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              4. Third-Party Data Sharing
            </h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-900">We do NOT sell, lease, rent, or share user personal data with third-party advertisers, data brokers, or marketing networks.</strong>
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Optional Communication: When you click to place an order or contact customer support via WhatsApp, the message content and contact number are passed to WhatsApp (Meta Inc.) to open your default chat application in accordance with Meta's Privacy Policy.
          </p>
        </div>

        {/* 5. Data Security & Retention */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              5. Data Security & Retention
            </h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Because profile data and credentials reside locally inside your web browser (<code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">localStorage</code>), your data is bounded by your device security and browser privacy isolation.
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your data persists in your browser until you clear your browser cache/cookies, log out, or explicitly trigger account deletion.
          </p>
        </div>

        {/* 6. User Rights & Delete Account Feature */}
        <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-lg space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-rose-100">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <UserX className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              6. User Rights & Delete Account Feature
            </h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            You have the absolute right to inspect, update, or completely purge your personal information from this application at any time.
          </p>

          <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-100 space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-xs font-extrabold text-rose-900">Delete Account & Local Data</h3>
                <p className="text-[11px] text-rose-800/80 leading-relaxed">
                  Clicking the button below will immediately delete your active profile session, registered user accounts, and saved order history stored in this browser.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md shadow-rose-600/15"
              id="btn-trigger-delete-account"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account & Clear Local Data
            </button>
          </div>
        </div>

        {/* 7. Contact Information */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <PhoneCall className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-extrabold text-white">
              7. Privacy Contact Information
            </h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            If you have questions, feedback, or data privacy inquiries regarding Quality Sweets & Restaurant, please contact us directly:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/50 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                <Phone className="h-3.5 w-3.5" />
                Phone / WhatsApp
              </div>
              <p className="text-xs font-mono font-semibold text-slate-200">+91 63986 82424</p>
            </div>

            <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/50 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                <Mail className="h-3.5 w-3.5" />
                Email Contact
              </div>
              <p className="text-xs font-mono font-semibold text-slate-200 truncate">manishroyal450@gmail.com</p>
            </div>

            <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/50 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                <MapPin className="h-3.5 w-3.5" />
                Restaurant Location
              </div>
              <p className="text-[11px] font-semibold text-slate-200 leading-snug">Quality Sweets & Restaurant, Main Market</p>
            </div>
          </div>
        </div>

      </div>

      {/* Confirmation Modal for Account Deletion */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100 text-left">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Confirm Data Deletion?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete your registered user profile, login password PIN, and local order history from this device browser?
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleDeleteLocalData}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                id="btn-confirm-delete-data"
              >
                <Trash2 className="h-3.5 w-3.5" /> Yes, Delete Data
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
