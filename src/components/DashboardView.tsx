import React from 'react';
import { MenuItem } from '../types';
import { 
  Database, 
  Layers, 
  Maximize2, 
  Trash2, 
  PlusSquare, 
  RefreshCw, 
  PieChart, 
  Info, 
  TrendingUp, 
  ShieldAlert
} from 'lucide-react';

interface DashboardViewProps {
  sweets: MenuItem[];
  restaurant: MenuItem[];
  onAddBulkItems: (type: 'sweet' | 'restaurant', count: number) => void;
  onClearBulkItems: (type: 'sweet' | 'restaurant') => void;
}

export default function DashboardView({
  sweets,
  restaurant,
  onAddBulkItems,
  onClearBulkItems
}: DashboardViewProps) {
  const sweetMax = 500;
  const restaurantMax = 200;

  const sweetCount = sweets.length;
  const restaurantCount = restaurant.length;

  const sweetPercent = Math.min(100, (sweetCount / sweetMax) * 100);
  const restaurantPercent = Math.min(100, (restaurantCount / restaurantMax) * 100);

  // Group Sweets by Category for a gorgeous visual breakdown
  const sweetsByCategory = sweets.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group Restaurant by Category
  const restaurantByCategory = restaurant.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-10 pb-24" id="dashboard-container">
      {/* Upper Status Title banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-850 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl" id="dashboard-header-panel">
        <div className="flex items-center gap-3 mb-4" id="dashboard-header-badge">
          <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-xl border border-emerald-500/30">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 font-mono">Operations Command Center</span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-sans">Menu & Inventory Capacity Dashboard</h1>
          </div>
        </div>
        <p className="text-slate-300 text-sm max-w-2xl">
          Quality Sweets manages unified food services by enforcing strict database slot reservations. We allocate <strong>500 persistent slots for sweets</strong> to support bulk holiday packaging, and <strong>200 slots for dining items</strong> to guarantee same-day kitchen ingredient freshness.
        </p>
      </div>

      {/* Main progress dial cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="dashboard-capacity-grid">
        {/* Sweet Shop Capacity details */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6" id="dashboard-sweet-card">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-sans">Sweet Shop Warehouse Slots</h2>
                <p className="text-xs text-slate-500">Dedicated storage for festive orders</p>
              </div>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 uppercase tracking-wider font-sans">
                500 slots limit
              </span>
            </div>

            {/* Circular Donut Indicator and Stats */}
            <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
              <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                {/* SVG circular track */}
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-slate-100 fill-none"
                    strokeWidth="12"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-amber-500 fill-none transition-all duration-1000"
                    strokeWidth="12"
                    strokeDasharray={376.9}
                    strokeDashoffset={376.9 - (376.9 * sweetPercent) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-slate-900 font-mono">{sweetCount}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Slots occupied</span>
                </div>
              </div>

              {/* Stats parameters */}
              <div className="space-y-4 flex-1 w-full">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Filled Capacity</span>
                    <span className="text-lg font-black text-slate-800 font-mono">{sweetPercent.toFixed(1)}%</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Remaining Slots</span>
                    <span className="text-lg font-black text-amber-700 font-mono">{Math.max(0, sweetMax - sweetCount)}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-slate-500 block">Warehouse Temperature Standard</span>
                  <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    <span>Controlled 18°C (Humidity Under 45%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick interactive controls for sweets */}
          <div className="pt-4 border-t border-slate-100 space-y-3" id="sweet-bulk-actions">
            <span className="text-xs font-bold text-slate-700 block">Interactive Slot Simulation</span>
            <div className="flex gap-2">
              <button
                id="btn-add-50-sweets"
                onClick={() => onAddBulkItems('sweet', 50)}
                disabled={sweetCount >= sweetMax}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1 ${
                  sweetCount >= sweetMax
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200 shadow-sm'
                }`}
              >
                <PlusSquare className="h-3.5 w-3.5" />
                Add +50 Sweets
              </button>

              <button
                id="btn-clear-sweets"
                onClick={() => onClearBulkItems('sweet')}
                className="py-2.5 px-4 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl transition-all flex items-center justify-center gap-1"
                title="Wipe custom items to free slots"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Reset Sweets
              </button>
            </div>
          </div>
        </div>

        {/* Restaurant Menu Capacity details */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6" id="dashboard-restaurant-card">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-sans">Restaurant Kitchen Slots</h2>
                <p className="text-xs text-slate-500">Curated gourmet dining limit</p>
              </div>
              <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full border border-rose-200 uppercase tracking-wider font-sans">
                200 slots limit
              </span>
            </div>

            {/* Circular Donut Indicator and Stats */}
            <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
              <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                {/* SVG circular track */}
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-slate-100 fill-none"
                    strokeWidth="12"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-rose-500 fill-none transition-all duration-1000"
                    strokeWidth="12"
                    strokeDasharray={376.9}
                    strokeDashoffset={376.9 - (376.9 * restaurantPercent) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-slate-900 font-mono">{restaurantCount}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Slots occupied</span>
                </div>
              </div>

              {/* Stats parameters */}
              <div className="space-y-4 flex-1 w-full">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Filled Capacity</span>
                    <span className="text-lg font-black text-slate-800 font-mono">{restaurantPercent.toFixed(1)}%</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Remaining Slots</span>
                    <span className="text-lg font-black text-rose-700 font-mono">{Math.max(0, restaurantMax - restaurantCount)}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-slate-500 block">Sourcing and Freshness Lock</span>
                  <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    <span>Daily Fresh Sourcing (Zero Leftovers)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick interactive controls for restaurant */}
          <div className="pt-4 border-t border-slate-100 space-y-3" id="restaurant-bulk-actions">
            <span className="text-xs font-bold text-slate-700 block">Interactive Slot Simulation</span>
            <div className="flex gap-2">
              <button
                id="btn-add-50-dining"
                onClick={() => onAddBulkItems('restaurant', 50)}
                disabled={restaurantCount >= restaurantMax}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1 ${
                  restaurantCount >= restaurantMax
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200 shadow-sm'
                }`}
              >
                <PlusSquare className="h-3.5 w-3.5" />
                Add +50 Dishes
              </button>

              <button
                id="btn-clear-restaurant"
                onClick={() => onClearBulkItems('restaurant')}
                className="py-2.5 px-4 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl transition-all flex items-center justify-center gap-1"
                title="Wipe custom items to free slots"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Reset Dishes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Inventory breakdown graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto" id="dashboard-categories-breakdown">
        {/* Sweet categories chart */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4" id="sweets-categories-box">
          <div className="flex gap-2 items-center pb-3 border-b border-slate-100">
            <PieChart className="h-5 w-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 font-sans">Sweet Categories Distribution</h3>
          </div>
          <div className="space-y-3" id="sweet-category-bars">
            {Object.entries(sweetsByCategory).length === 0 ? (
              <p className="text-xs text-slate-400 italic">No sweets items added yet.</p>
            ) : (
              Object.entries(sweetsByCategory).map(([cat, count]) => {
                const percent = Math.round((count / sweetCount) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{cat}</span>
                      <span className="font-mono">{count} ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Restaurant categories chart */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4" id="restaurant-categories-box">
          <div className="flex gap-2 items-center pb-3 border-b border-slate-100">
            <PieChart className="h-5 w-5 text-rose-600" />
            <h3 className="font-bold text-slate-900 font-sans">Restaurant Categories Distribution</h3>
          </div>
          <div className="space-y-3" id="restaurant-category-bars">
            {Object.entries(restaurantByCategory).length === 0 ? (
              <p className="text-xs text-slate-400 italic">No restaurant items added yet.</p>
            ) : (
              Object.entries(restaurantByCategory).map(([cat, count]) => {
                const percent = Math.round((count / restaurantCount) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{cat}</span>
                      <span className="font-mono">{count} ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
