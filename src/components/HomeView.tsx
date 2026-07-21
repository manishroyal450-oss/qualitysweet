import React from 'react';
import { motion } from 'motion/react';
import { ViewMode } from '../types';
import { Store, Utensils, Shield, Sparkles, Plus, AlertCircle, ArrowRight, MapPin, Clock, Phone, Compass, Map } from 'lucide-react';

interface HomeViewProps {
  onViewChange: (view: ViewMode) => void;
  sweetCount: number;
  restaurantCount: number;
}

export default function HomeView({ onViewChange, sweetCount, restaurantCount }: HomeViewProps) {
  const sweetMax = 500;
  const restaurantMax = 200;

  const sweetPercent = Math.min(100, Math.round((sweetCount / sweetMax) * 100));
  const restaurantPercent = Math.min(100, Math.round((restaurantCount / restaurantMax) * 100));

  return (
    <div className="space-y-12 pb-24" id="home-view-container">
      {/* Hero Welcome Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-500/10 via-green-500/5 to-transparent rounded-3xl p-8 sm:p-12 text-center" id="hero-section">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Traditional Heritage Meets Modern Dining
          </div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none font-sans"
            id="brand-header-animated"
          >
            Quality Sweets <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              & Restaurant
            </span>
          </motion.h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Experience premium curated Indian sweets with our specialized <strong className="text-emerald-700">500-item sweet shop arena</strong>, alongside an exquisite dining menu housed in our <strong className="text-teal-700">200-item fine restaurant menu</strong>.
          </p>
          <div className="flex justify-center items-center gap-2 text-sm text-slate-500 font-mono">
            <span>Pure Vegetarian</span>
            <span>•</span>
            <span>Est. 1996</span>
            <span>•</span>
            <span>Authentic Ingredients</span>
          </div>
        </div>
      </section>

      {/* Main Double Gateway Pages Selectors */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto px-4" id="gateway-sections">
        {/* Sweet Shop Gateway */}
        <div 
          id="gateway-sweet-card"
          className="group relative overflow-hidden bg-gradient-to-b from-emerald-50/50 to-white border border-emerald-100 rounded-3xl p-8 shadow-md hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20">
                <Store className="h-8 w-8" />
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">Capacity Status</span>
                <span className="text-2xl font-bold text-slate-800 font-mono">{sweetCount} / {sweetMax}</span>
                <span className="text-xs text-slate-500 block">Sweets Slots Filled</span>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-sans">Mithai Paradise</h2>
              <p className="text-slate-600">
                Dive into a spectacular collection of pure ghee laddoos, premium dry-fruit katlis, creamy rabdi rasmalai, sugar-free healthy bites, and authentic Bengali cottage-cheese sweets.
              </p>
            </div>

            {/* Capacity Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-emerald-700">
                <span>Visual Space Allocation</span>
                <span>{sweetPercent}% Space Used</span>
              </div>
              <div className="h-3 w-full bg-emerald-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-green-600 rounded-full transition-all duration-1000"
                  style={{ width: `${sweetPercent}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                Reservations locked for up to 500 catalog items.
              </p>
            </div>
          </div>

          <div className="pt-8">
            <button
              id="goto-sweet-shop-btn"
              onClick={() => onViewChange('sweet-shop')}
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-md shadow-emerald-600/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 group/btn"
            >
              Explore Sweet Shop
              <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Restaurant Gateway */}
        <div 
          id="gateway-restaurant-card"
          className="group relative overflow-hidden bg-gradient-to-b from-teal-50/50 to-white border border-teal-100 rounded-3xl p-8 shadow-md hover:shadow-xl hover:border-teal-200 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="p-4 bg-teal-600 text-white rounded-2xl shadow-lg shadow-teal-600/20">
                <Utensils className="h-8 w-8" />
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider block">Capacity Status</span>
                <span className="text-2xl font-bold text-slate-800 font-mono">{restaurantCount} / {restaurantMax}</span>
                <span className="text-xs text-slate-500 block">Menu Slots Filled</span>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-sans">Gourmet Dining</h2>
              <p className="text-slate-600">
                Enjoy a majestic journey through crisp tandoori flatbreads, aromatic slow-cooked biryanis, hot sizzling South Indian dosas, savory chats, and our legendary fresh summer mango lassi.
              </p>
            </div>

            {/* Capacity Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-teal-700">
                <span>Visual Space Allocation</span>
                <span>{restaurantPercent}% Space Used</span>
              </div>
              <div className="h-3 w-full bg-teal-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-400 to-emerald-600 rounded-full transition-all duration-1000"
                  style={{ width: `${restaurantPercent}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                Curated lock-in for up to 200 high-end restaurant slots.
              </p>
            </div>
          </div>

          <div className="pt-8">
            <button
              id="goto-restaurant-btn"
              onClick={() => onViewChange('restaurant')}
              className="w-full py-4 px-6 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold shadow-md shadow-teal-600/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 group/btn"
            >
              Explore Restaurant Menu
              <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Flagship Location & Contact Section */}
      <section className="max-w-6xl mx-auto px-4 space-y-8" id="location-contact-section">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest font-mono">Visit Our Store</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Flagship Store Location & Hours
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm">
            Conveniently situated opposite the landmark temple, our establishment houses both the Traditional Sweet Shop and Fine Dining Restaurant under certified hygienic isolation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Details column (left side) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* Address Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md space-y-4 flex-1 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex gap-3.5 items-start">
                <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Physical Address</span>
                  <h3 className="font-extrabold text-slate-900 text-base leading-tight">Quality Sweets & Restaurant</h3>
                  <p className="text-slate-600 text-xs leading-relaxed mt-1">
                    Opp. to Shri Balaji Temple Shiv Murti, Shankar Market, Chandpur, Uttar Pradesh - 246725
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=Opp.+to+Shri+Balaji+Temple+Shiv+Murti,+Shankar+Market,+Chandpur,+Uttar+Pradesh+246725"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
                >
                  <Compass className="h-4 w-4" />
                  View directions on Google Maps
                </a>
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md space-y-4 flex-1 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex gap-3.5 items-start">
                <div className="p-3 bg-rose-100 text-rose-700 rounded-2xl shrink-0">
                  <Phone className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Call & WhatsApp Support</span>
                  <h3 className="font-extrabold text-slate-900 text-base leading-tight">+91 63986 82424</h3>
                  <p className="text-slate-600 text-xs">
                    Order catering, bulk sweet boxes, or book fine dining tables directly over phone.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                <a
                  href="tel:+916398682424"
                  className="flex-1 min-w-[120px] bg-slate-900 hover:bg-slate-800 text-white text-center text-xs font-bold py-2.5 px-4 rounded-xl transition cursor-pointer"
                >
                  Call Store
                </a>
                <a
                  href="https://wa.me/916398682424"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[120px] bg-emerald-600 hover:bg-emerald-700 text-white text-center text-xs font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.628 1.97 14.161.944 11.54.944c-5.44 0-9.866 4.369-9.87 9.8.002 2.042.547 4.039 1.584 5.787L2.176 21.6l5.221-1.354z" />
                  </svg>
                  WhatsApp Now
                </a>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="bg-slate-900 text-slate-100 p-6 rounded-3xl shadow-lg space-y-4 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex gap-3.5 items-start">
                <div className="p-3 bg-white/10 text-amber-400 rounded-2xl shrink-0">
                  <Clock className="h-6 w-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Hours of Operation</span>
                  <div className="space-y-1 mt-1 text-sm font-extrabold text-white">
                    <p>Mon - Sun: 9:00 AM - 10:30 PM</p>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Fresh batches of Desi Ghee Jalebis, Samosas, and Sweets are prepared daily starting at 8:30 AM.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stylized Visual Mock Map preview (right side) */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden text-left min-h-[350px]">
            {/* Grid pattern background */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
            
            {/* Styled vector map elements representing local landmarks */}
            <div className="absolute inset-0 opacity-80 pointer-events-none select-none">
              {/* Roads drawing */}
              <div className="absolute top-1/2 left-0 right-0 h-10 bg-slate-800/40 border-y border-slate-700/30 transform -translate-y-1/2" />
              <div className="absolute left-1/3 top-0 bottom-0 w-10 bg-slate-800/40 border-x border-slate-700/30" />
              
              {/* Labels for roads */}
              <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[9px] font-mono font-bold text-slate-500 tracking-wider uppercase">Shankar Market Road</div>
              <div className="absolute left-1/3 top-10 -translate-x-1/2 transform -rotate-90 text-[9px] font-mono font-bold text-slate-500 tracking-wider uppercase">Chandpur Main Gali</div>

              {/* Balaji Temple box */}
              <div className="absolute top-12 right-12 bg-amber-950/40 border border-amber-500/20 rounded-2xl p-4 flex flex-col items-center justify-center shadow-lg">
                <span className="text-xl">🕌</span>
                <span className="text-[10px] font-black text-amber-400 tracking-wider mt-1 text-center font-sans">Shri Balaji Temple</span>
                <span className="text-[8px] text-amber-500/60 font-mono">Shiv Murti</span>
              </div>

              {/* Shankar Market Block */}
              <div className="absolute bottom-12 left-12 bg-slate-900/50 border border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center">
                <span className="text-base">🛍️</span>
                <span className="text-[9px] font-extrabold text-slate-400 mt-1">Shankar Market</span>
              </div>

              {/* Quality Sweets Pulsating Pin! */}
              <div className="absolute top-1/2 left-[48%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                {/* Ping rings */}
                <div className="absolute h-10 w-10 rounded-full bg-orange-500/20 animate-ping -mt-4" />
                <div className="absolute h-6 w-6 rounded-full bg-orange-500/40 animate-pulse -mt-2" />
                
                <div className="relative bg-gradient-to-tr from-amber-500 to-orange-600 text-white rounded-full p-2.5 shadow-xl border-2 border-white flex items-center justify-center z-10">
                  <Store className="h-5 w-5" />
                </div>
                <div className="bg-slate-900 border border-amber-500/40 rounded-xl px-2.5 py-1 text-[9px] font-black text-amber-300 tracking-wider uppercase mt-2 shadow-2xl">
                  Quality Sweets
                </div>
              </div>
            </div>

            {/* Live map helper card */}
            <div className="relative mt-auto bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 z-10">
              <div className="text-left">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest font-mono block">Simulated Navigation Gps</span>
                <h4 className="text-xs font-bold text-white mt-1">Opposite Shri Balaji Temple Shiv Murti</h4>
                <p className="text-[10px] text-slate-400">Easy parking & designated sweet counter pickup lane.</p>
              </div>
              <a
                href="https://maps.google.com/?q=Opp.+to+Shri+Balaji+Temple+Shiv+Murti,+Shankar+Market,+Chandpur,+Uttar+Pradesh+246725"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white text-center text-xs font-bold py-2 px-3.5 rounded-xl transition whitespace-nowrap cursor-pointer"
              >
                Launch GPS
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

