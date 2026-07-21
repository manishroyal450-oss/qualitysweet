import React, { useState } from 'react';
import { MenuItem, CartItem, ViewMode, Order, UserProfile } from './types';
import { 
  INITIAL_SWEETS, 
  INITIAL_RESTAURANT, 
  SWEET_CATEGORIES, 
  RESTAURANT_CATEGORIES 
} from './data';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import CatalogView from './components/CatalogView';
import DashboardView from './components/DashboardView';
import CartView from './components/CartView';
import AdminView from './components/AdminView';
import ProfileView from './components/ProfileView';
import { AlertCircle, Store, ChefHat, Instagram, Facebook, PhoneCall, MapPin, MessageSquare, X } from 'lucide-react';

export default function App() {
  // Active User State
  const [activeUser, setActiveUser] = useState<UserProfile | null>(() => {
    const activeUserStr = localStorage.getItem('activeUser');
    if (activeUserStr) {
      try {
        return JSON.parse(activeUserStr);
      } catch (e) {
        localStorage.removeItem('activeUser');
      }
    }
    return null;
  });

  // Navigation State
  const [view, setView] = useState<ViewMode>('home');
  const [showWhatsappPopup, setShowWhatsappPopup] = useState(true);

  // Items State
  const [sweets, setSweets] = useState<MenuItem[]>(INITIAL_SWEETS);
  const [restaurant, setRestaurant] = useState<MenuItem[]>(INITIAL_RESTAURANT);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);

  // Orders State (for Admin view)
  const [orders, setOrders] = useState<Order[]>([]);

  // Order Operations
  const handleOrderPlaced = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, status: 'pending' | 'completed' | 'cancelled') => {
    setOrders((prev) => 
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const handleClearOrders = () => {
    setOrders([]);
  };

  // Item Addition / Removal Managers
  const handleAddItem = (item: MenuItem) => {
    if (item.type === 'sweet') {
      if (sweets.length >= 500) return;
      setSweets((prev) => [item, ...prev]);
    } else {
      if (restaurant.length >= 200) return;
      setRestaurant((prev) => [item, ...prev]);
    }
  };

  const handleRemoveItem = (id: string) => {
    setSweets((prev) => prev.filter((it) => it.id !== id));
    setRestaurant((prev) => prev.filter((it) => it.id !== id));
  };

  // Bulk Mock Generator for Testing Space Constraints
  const handleAddBulkItems = (type: 'sweet' | 'restaurant', count: number) => {
    const isSweet = type === 'sweet';
    const currentList = isSweet ? sweets : restaurant;
    const limit = isSweet ? 500 : 200;
    
    if (currentList.length >= limit) return;

    const actualAddCount = Math.min(count, limit - currentList.length);
    const newItems: MenuItem[] = [];

    const mockSweetNames = [
      'Ghee Khoya Barfi', 'Dry Fruit Gujia', 'Shahi Malai Roll', 
      'Rose Coconut Ladoo', 'Flavored Mango Sandesh', 'Kesar Cham Cham',
      'Desi Shakarpara', 'Crunchy Dry Petha', 'Sugar-Free Gond Ladoo'
    ];

    const mockRestNames = [
      'Stuffed Tandoori Aloo', 'Paneer Lababdar', 'Malai Kofta Curry', 
      'Garlic Roti Platters', 'Sizzling Hakka Rice', 'Crunchy Spring Rolls',
      'Crispy Rava Onion Dosa', 'Spicy Pav Bhaji Mix', 'Rich Pistachio Shake'
    ];

    for (let i = 0; i < actualAddCount; i++) {
      const randomIdx = Math.floor(Math.random() * 9);
      const randomPrice = Math.floor(80 + Math.random() * 320);
      const isSugar = isSweet && Math.random() > 0.7;

      newItems.push({
        id: `mock-${type}-${Date.now()}-${i}`,
        name: isSweet 
          ? `${mockSweetNames[randomIdx]} #${currentList.length + i + 1}`
          : `${mockRestNames[randomIdx]} #${currentList.length + i + 1}`,
        description: `Visual simulation slot placeholder item #${currentList.length + i + 1}. Prepared in hygienic separate workspace.`,
        price: randomPrice,
        category: isSweet 
          ? SWEET_CATEGORIES[1 + Math.floor(Math.random() * (SWEET_CATEGORIES.length - 1))]
          : RESTAURANT_CATEGORIES[1 + Math.floor(Math.random() * (RESTAURANT_CATEGORIES.length - 1))],
        image: isSweet
          ? 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&auto=format&fit=crop&q=60'
          : 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&auto=format&fit=crop&q=60',
        type: type,
        isVeg: true,
        isSugarFree: isSweet ? isSugar : undefined,
        rating: parseFloat((4.0 + Math.random()).toFixed(1)),
        popular: Math.random() > 0.8
      });
    }

    if (isSweet) {
      setSweets((prev) => [...prev, ...newItems]);
    } else {
      setRestaurant((prev) => [...prev, ...newItems]);
    }
  };

  const handleClearBulkItems = (type: 'sweet' | 'restaurant') => {
    // Keeps only the initial pre-seeded items
    if (type === 'sweet') {
      setSweets(INITIAL_SWEETS);
    } else {
      setRestaurant(INITIAL_RESTAURANT);
    }
  };

  // Cart Operations
  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const exists = prev.find((it) => it.item.id === item.id);
      if (exists) {
        return prev.map((it) => 
          it.item.id === item.id ? { ...it, quantity: it.quantity + 1 } : it
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart((prev) => 
      prev.map((it) => (it.item.id === id ? { ...it, quantity } : it))
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((it) => it.item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Aggregate cart item count
  const cartBadgeCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans" id="app-root-container">
      {/* Top sticky navbar */}
      <Navbar 
        currentView={view} 
        onViewChange={(v) => setView(v)} 
        cartCount={cartBadgeCount} 
        activeUser={activeUser}
      />

      {/* Main Container Wrapper */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 md:pt-12 md:pb-32" id="main-content-wrapper">
        {view === 'home' && (
          <HomeView 
            onViewChange={(v) => setView(v)} 
            sweetCount={sweets.length} 
            restaurantCount={restaurant.length} 
          />
        )}

        {view === 'sweet-shop' && (
          <CatalogView 
            type="sweet"
            items={sweets}
            categories={SWEET_CATEGORIES}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onAddToCart={handleAddToCart}
            onAddBulkItems={handleAddBulkItems}
          />
        )}

        {view === 'restaurant' && (
          <CatalogView 
            type="restaurant"
            items={restaurant}
            categories={RESTAURANT_CATEGORIES}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onAddToCart={handleAddToCart}
            onAddBulkItems={handleAddBulkItems}
          />
        )}

        {view === 'dashboard' && (
          <DashboardView 
            sweets={sweets}
            restaurant={restaurant}
            onAddBulkItems={handleAddBulkItems}
            onClearBulkItems={handleClearBulkItems}
          />
        )}

        {view === 'cart' && (
          <CartView 
            cart={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onBackToShopping={() => setView('home')}
            onOrderPlaced={handleOrderPlaced}
            activeUser={activeUser}
          />
        )}

        {view === 'admin' && (
          <AdminView 
            sweets={sweets}
            restaurant={restaurant}
            orders={orders}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onClearOrders={handleClearOrders}
            onAddBulkItems={handleAddBulkItems}
            onClearBulkItems={handleClearBulkItems}
          />
        )}

        {view === 'profile' && (
          <ProfileView 
            onViewChange={(v) => setView(v)}
            orders={orders}
            activeUser={activeUser}
            onActiveUserChange={setActiveUser}
          />
        )}
      </main>

      {/* Beautiful Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 px-4 mt-auto" id="app-footer">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
          <div className="space-y-3 text-left" id="footer-brand-box">
            <div className="flex items-center gap-2">
              <div className="bg-orange-600 p-1.5 rounded-lg text-white">
                <Store className="h-4 w-4" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">Quality Sweets & Restaurant</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Serving traditional Indian heritage tastes cooked under separate hygienic kitchens. Providing an enormous 500 sweets warehouse along with 200 seating table recipe items.
            </p>
            <div className="flex items-start gap-1.5 text-xs text-slate-400 pt-1">
              <MapPin className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Opp. to Shri Balaji Temple Shiv Murti, Shankar Market, Chandpur, UP - 246725</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-left" id="footer-capacity-box">
            <span className="font-bold text-white uppercase tracking-widest text-[10px]">Operations & Storage</span>
            <div className="flex justify-between">
              <span>Sweets Slot Cap:</span>
              <span className="font-mono text-amber-500 font-bold">{sweets.length} / 500 slots</span>
            </div>
            <div className="flex justify-between">
              <span>Restaurant Menu Cap:</span>
              <span className="font-mono text-rose-500 font-bold">{restaurant.length} / 200 slots</span>
            </div>
            <p className="text-[10px] text-slate-500 italic mt-1">Limits enforced physically by master chefs and warehouse staff.</p>
          </div>

          <div className="space-y-3 text-left" id="footer-social-box">
            <span className="font-bold text-white uppercase tracking-widest text-[10px] block">Connect & Support</span>
            <div className="flex flex-col gap-2.5 text-slate-400 text-xs" id="social-links">
              <div className="flex gap-3">
                <a href="#instagram" className="hover:text-amber-500 transition-colors" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
                <a href="#facebook" className="hover:text-amber-500 transition-colors" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
              </div>
              <a href="tel:+916398682424" className="hover:text-amber-500 transition-colors flex items-center gap-1.5">
                <PhoneCall className="h-4 w-4 text-amber-500" /> Phone: +91 63986 82424
              </a>
              <a href="https://wa.me/916398682424" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-bold">
                <svg className="w-4 h-4 fill-emerald-500" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.628 1.97 14.161.944 11.54.944c-5.44 0-9.866 4.369-9.87 9.8.002 2.042.547 4.039 1.584 5.787L2.176 21.6l5.221-1.354z" />
                </svg>
                WhatsApp: +91 63986 82424
              </a>
            </div>
            <span className="text-[10px] block text-slate-500">Licensed under Food Safety and Standards Authority of India (FSSAI).</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500" id="footer-copyright-box">
          <span>&copy; {new Date().getFullYear()} Quality Sweets & Restaurant. All Rights Reserved.</span>
          <span className="mt-2 sm:mt-0">Crafted with Pure Ingredients and Desi Ghee</span>
        </div>
      </footer>

      {/* Persistent Floating WhatsApp Corner Popup & Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto" id="whatsapp-popup-corner">
        {showWhatsappPopup && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl p-4 max-w-sm w-72 animate-in fade-in slide-in-from-bottom-5 duration-300 relative text-left">
            {/* Close button */}
            <button
              onClick={() => setShowWhatsappPopup(false)}
              className="absolute top-2.5 right-2.5 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              aria-label="Close notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div className="flex gap-2.5 items-start">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl shrink-0 mt-0.5">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.628 1.97 14.161.944 11.54.944c-5.44 0-9.866 4.369-9.87 9.8.002 2.042.547 4.039 1.584 5.787L2.176 21.6l5.221-1.354z" />
                </svg>
              </div>
              <div className="space-y-1 pr-4">
                <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                  WhatsApp Support
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                </h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Need sweet boxes, table booking or fast catering? Chat with us instantly!
                </p>
                <div className="pt-1.5">
                  <a
                    href="https://wa.me/916398682424?text=Hello!%20I%20am%20interested%20in%20ordering%20sweets%20/%20food."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition shadow-md"
                  >
                    Chat +91 63986 82424
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Pulsating Button */}
        <div className="flex gap-2.5 items-center">
          {!showWhatsappPopup && (
            <button
              onClick={() => setShowWhatsappPopup(true)}
              className="bg-slate-900/90 hover:bg-slate-900 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg border border-slate-700/50 shadow-md backdrop-blur-sm transition"
            >
              Need help?
            </button>
          )}
          <a
            href="https://wa.me/916398682424?text=Hello!%20I%20am%20interested%20in%20ordering%20sweets%20/%20food."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group relative"
            id="whatsapp-fab"
            title="Chat on WhatsApp"
          >
            {/* Pulsating green ring overlay */}
            <span className="absolute inset-0 rounded-full bg-emerald-600/30 animate-ping pointer-events-none" />
            <svg className="w-6 h-6 fill-current relative z-10" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.628 1.97 14.161.944 11.54.944c-5.44 0-9.866 4.369-9.87 9.8.002 2.042.547 4.039 1.584 5.787L2.176 21.6l5.221-1.354z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
