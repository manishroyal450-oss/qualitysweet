import React, { useState, useMemo } from 'react';
import { MenuItem } from '../types';
import ProductDetailModal from './ProductDetailModal';
import { 
  Plus, 
  Search, 
  ChevronDown, 
  SlidersHorizontal, 
  Sparkles, 
  Star, 
  Flame, 
  Check, 
  Trash2, 
  X,
  AlertTriangle
} from 'lucide-react';

const CATEGORY_BANNERS: Record<string, { title: string; image: string }> = {
  // Restaurant Categories
  'Pizza': {
    title: 'PIZZA',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80'
  },
  'Soup': {
    title: 'SOUP',
    image: 'https://images.unsplash.com/photo-1547592165-e1d17fed6006?w=800&auto=format&fit=crop&q=80'
  },
  'Pasta': {
    title: 'PASTA',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80'
  },
  'Sandwich': {
    title: 'GRILLED SANDWICH',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80'
  },
  'Fast Food': {
    title: 'FAST FOOD',
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&auto=format&fit=crop&q=80'
  },
  'Snacks': {
    title: 'INDIAN SNACKS & BITES',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80'
  },
  'Noodles': {
    title: 'NOODLES',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80'
  },
  'Momos': {
    title: 'MOMOS',
    image: 'https://images.unsplash.com/photo-1625220194771-7ebedd0b70b9?w=800&auto=format&fit=crop&q=80'
  },
  'Burger': {
    title: 'BURGER',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80'
  },
  'Golgappe': {
    title: 'GOLGAPPE',
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=800&auto=format&fit=crop&q=80'
  },
  'Chaat': {
    title: 'CHAAT KA CHASKA',
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=800&auto=format&fit=crop&q=80'
  },
  'South Indian': {
    title: 'SOUTH INDIAN EXPRESS',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80'
  },
  'Dessert': {
    title: 'DESSERT',
    image: 'https://images.unsplash.com/photo-1527751171053-6ac5ec50000b?w=800&auto=format&fit=crop&q=80'
  },
  'Pastry': {
    title: 'PASTRY',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80'
  },
  'Chinese Starter': {
    title: 'CHINESE STARTER',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop&q=80'
  },
  'Kathi Roll': {
    title: 'KATHI ROLL',
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&auto=format&fit=crop&q=80'
  },
  'Rice & Maggie': {
    title: "RICE 'N' MAGGIE",
    image: 'https://images.unsplash.com/photo-1603133872878-696a548e763f?w=800&auto=format&fit=crop&q=80'
  },
  'Beverages': {
    title: 'BEVERAGES',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80'
  },

  // Sweets Categories
  'Desi Ghee Sweets': {
    title: 'DESI GHEE SWEETS',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80'
  },
  'Milk Sweets': {
    title: 'MILK SWEETS',
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&auto=format&fit=crop&q=80'
  },
  'Bengali Sweets': {
    title: 'BENGALI SWEETS',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80'
  },
  'Dry Fruit Sweets': {
    title: 'DRY FRUIT SWEETS',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80'
  },
  'Sugar Free': {
    title: 'SUGAR FREE BITES',
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&auto=format&fit=crop&q=80'
  }
};

interface CatalogViewProps {
  type: 'sweet' | 'restaurant';
  items: MenuItem[];
  categories: string[];
  onAddItem: (item: MenuItem) => void;
  onRemoveItem: (id: string) => void;
  onAddToCart: (item: MenuItem) => void;
  onAddBulkItems: (type: 'sweet' | 'restaurant', count: number) => void;
}

type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'rating';

export default function CatalogView({
  type,
  items,
  categories,
  onAddItem,
  onRemoveItem,
  onAddToCart,
  onAddBulkItems
}: CatalogViewProps) {
  const isSweet = type === 'sweet';
  const limit = isSweet ? 500 : 200;
  
  // Color configuration
  const theme = {
    primaryBg: isSweet ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-teal-600 hover:bg-teal-700',
    primaryBorder: isSweet ? 'border-emerald-100' : 'border-teal-100',
    primaryBorderFocus: isSweet ? 'focus:border-emerald-500 focus:ring-emerald-500/20' : 'focus:border-teal-500 focus:ring-teal-500/20',
    primaryText: isSweet ? 'text-emerald-800' : 'text-teal-800',
    primaryHeading: isSweet ? 'from-emerald-600 to-green-600' : 'from-teal-600 to-emerald-600',
    primaryLightBg: isSweet ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-teal-50 text-teal-700 border-teal-200',
    badgeBg: isSweet ? 'bg-emerald-100 text-emerald-800' : 'bg-teal-100 text-teal-800',
    glow: isSweet ? 'shadow-emerald-500/10' : 'shadow-teal-500/10',
    accentText: isSweet ? 'text-emerald-600' : 'text-teal-600'
  };

  // States
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterVegOnly, setFilterVegOnly] = useState(false);
  const [filterSugarFreeOnly, setFilterSugarFreeOnly] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  // Form States
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemCategory, setNewItemCategory] = useState(categories[1] || 'General');
  const [newItemIsSugarFree, setNewItemIsSugarFree] = useState(false);
  const [newItemImage, setNewItemImage] = useState('');
  const [formError, setFormError] = useState('');

  // Dynamic Categories list
  const displayCategories = useMemo(() => {
    const itemCats = Array.from(new Set(items.map(i => i.category).filter(Boolean)));
    const combined = Array.from(new Set(['All', ...categories.filter(c => c !== 'All'), ...itemCats]));
    return combined;
  }, [categories, items]);

  // Filtering & Sorting
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                              item.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesVeg = !filterVegOnly || item.isVeg;
        const matchesSugarFree = !filterSugarFreeOnly || item.isSugarFree;
        return matchesSearch && matchesCategory && matchesVeg && matchesSugarFree;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
        }
        if (sortBy === 'price-asc') {
          return a.price - b.price;
        }
        if (sortBy === 'price-desc') {
          return b.price - a.price;
        }
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        return 0;
      });
  }, [items, search, selectedCategory, sortBy, filterVegOnly, filterSugarFreeOnly]);

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (items.length >= limit) {
      setFormError(`Maximum storage capacity of ${limit} items reached! Cannot add more slots.`);
      return;
    }

    if (!newItemName.trim()) {
      setFormError('Please enter an item name.');
      return;
    }

    const priceNum = parseFloat(newItemPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Please enter a valid positive price.');
      return;
    }

    const defaultImg = isSweet 
      ? 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60'
      : 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60';

    const newItem: MenuItem = {
      id: `${type}-${Date.now()}`,
      name: newItemName,
      description: newItemDesc || `Premium customized specialty in our ${selectedCategory} selection.`,
      price: priceNum,
      category: newItemCategory,
      image: newItemImage.trim() || defaultImg,
      type: type,
      isVeg: true,
      isSugarFree: isSweet ? newItemIsSugarFree : undefined,
      rating: 4.5 + Math.random() * 0.5,
      popular: false
    };

    onAddItem(newItem);
    
    // Reset Form
    setNewItemName('');
    setNewItemPrice('');
    setNewItemDesc('');
    setNewItemIsSugarFree(false);
    setNewItemImage('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-8 pb-16" id={`catalog-view-${type}`}>
      {/* Upper Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100" id="catalog-title-card">
        <div className="space-y-1 text-left">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono">Arena Showcase</span>
          <h1 className={`text-3xl font-extrabold bg-gradient-to-r ${theme.primaryHeading} bg-clip-text text-transparent font-sans`}>
            {isSweet ? 'Traditional Sweet Shop' : 'Gourmet Fine Dining'}
          </h1>
          <p className="text-sm text-slate-500">
            {isSweet 
              ? 'Premium Indian sweet creations, catering to authentic traditional festivals and premium gifts.' 
              : 'Gourmet plates curated with fresh organic local ingredients by our master chefs.'}
          </p>
        </div>
      </div>

      {/* Filtering and Search Controls bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center" id="filter-controls-bar">
        {/* Search */}
        <div className="relative flex-1 max-w-md" id="search-input-box">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="filter-search-input"
            type="text"
            placeholder={`Search from ${items.length} active catalog items...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all"
          />
        </div>

        {/* Filters/Sort options group */}
        <div className="flex flex-wrap items-center gap-3" id="filters-sorting-group">
          {/* Sorter */}
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-3 py-1.5 text-sm" id="sorter-box">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-slate-700 outline-none cursor-pointer text-xs font-semibold"
            >
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Diet filters */}
          <div className="flex items-center gap-2 text-xs font-bold" id="diet-filters">
            <button
              id="veg-filter-btn"
              onClick={() => setFilterVegOnly(!filterVegOnly)}
              className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1 ${
                filterVegOnly
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Veg Only
            </button>

            {isSweet && (
              <button
                id="sugarfree-filter-btn"
                onClick={() => setFilterSugarFreeOnly(!filterSugarFreeOnly)}
                className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1 ${
                  filterSugarFreeOnly
                    ? 'bg-amber-50 text-amber-700 border-amber-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Sugar Free
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills horizontal bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none" id="category-pills-bar">
        {displayCategories.map((category) => (
          <button
            key={category}
            id={`cat-pill-${category.replace(/\s+/g, '-').toLowerCase()}`}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border ${
              selectedCategory === category
                ? theme.primaryLightBg
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Category Hero Banner */}
      {selectedCategory !== 'All' && CATEGORY_BANNERS[selectedCategory] && (
        <div 
          className="relative w-full h-36 sm:h-44 rounded-3xl overflow-hidden shadow-sm flex items-center p-6 sm:p-8 text-left bg-cover bg-center transition-all duration-300"
          style={{ backgroundImage: `url(${CATEGORY_BANNERS[selectedCategory].image})` }}
          id="category-hero-banner"
        >
          {/* Dark gradient overlay for extreme contrast and legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
          
          <div className="relative z-10 space-y-1.5 sm:space-y-2">
            <span className="inline-flex items-center gap-1 bg-amber-500/90 text-white font-extrabold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm">
              <span className="text-xs">🍴</span> {isSweet ? 'Quality Sweets' : 'Quality Restaurant'}
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-wide uppercase font-sans drop-shadow-sm">
              {CATEGORY_BANNERS[selectedCategory].title}
            </h2>
            <p className="text-white/85 text-xs font-medium max-w-md hidden sm:block leading-relaxed">
              Premium preparations cooked fresh daily using organic, high-quality, and 100% vegetarian ingredients.
            </p>
          </div>
        </div>
      )}

      {/* Catalog Grid Cards Display */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200" id="empty-catalog-fallback">
          <SlidersHorizontal className="mx-auto h-10 w-10 text-slate-300 mb-3" />
          <h3 className="text-slate-800 font-bold text-lg">No Items Match Your Filters</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
            Try adjusting your category selection, search terms, or dietary filter toggles to display products.
          </p>
          <button
            id="clear-filters-btn"
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setFilterVegOnly(false);
              setFilterSugarFreeOnly(false);
            }}
            className="mt-4 px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-300 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="catalog-products-grid">
          {filteredItems.map((item) => {
            const hasValidImage = Boolean(item.image && item.image.trim() !== '' && !failedImages[item.id]);

            return (
              <div
                key={item.id}
                id={`product-card-${item.id}`}
                onClick={() => setSelectedProduct(item)}
                className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all flex flex-col justify-between group cursor-pointer"
              >
                {/* Product Image Panel - Rendered ONLY if a valid Image URL is present */}
                {hasValidImage && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100" id={`product-img-box-${item.id}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      onError={() => {
                        setFailedImages(prev => ({ ...prev, [item.id]: true }));
                      }}
                    />
                    
                    {/* Badges Overlay */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5" id={`product-badges-${item.id}`}>
                      {item.popular && (
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-0.5">
                          <Flame className="h-3 w-3 fill-white" />
                          Popular
                        </span>
                      )}
                      {item.isSugarFree && (
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                          Sugar Free
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3" id={`product-rating-${item.id}`}>
                      <span className="bg-white/95 backdrop-blur-md text-slate-800 text-xs font-extrabold px-2 py-1 rounded-lg shadow-sm flex items-center gap-0.5 border border-slate-100">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        {item.rating?.toFixed(1) || '4.5'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Product Info Block */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4" id={`product-info-box-${item.id}`}>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-extrabold uppercase tracking-widest ${theme.accentText}`}>
                          {item.category}
                        </span>
                        <span className="inline-flex items-center gap-1 border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] text-emerald-700 font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          Veg
                        </span>
                        {!hasValidImage && item.popular && (
                          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                            <Flame className="h-2.5 w-2.5 fill-white" />
                            Popular
                          </span>
                        )}
                        {!hasValidImage && item.isSugarFree && (
                          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            Sugar Free
                          </span>
                        )}
                      </div>

                      {!hasValidImage && (
                        <span className="bg-slate-50 text-slate-800 text-[11px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-0.5 border border-slate-100 shrink-0">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          {item.rating?.toFixed(1) || '4.5'}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-950 group-hover:text-slate-800 transition-colors leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Pricing & Add Trigger */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100" id={`product-actions-${item.id}`}>
                    <div className="flex flex-col">
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Price</span>
                      <span className="text-lg font-black text-slate-900">₹{item.price}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        id={`add-to-cart-${item.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(item);
                        }}
                        className={`px-4 py-2 text-xs font-bold text-white rounded-xl transition-all shadow-sm flex items-center gap-1 hover:scale-105 active:scale-95 cursor-pointer ${theme.primaryBg}`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        ADD
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        allItems={items}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(item, qty) => {
          for (let i = 0; i < (qty || 1); i++) {
            onAddToCart(item);
          }
        }}
        onSelectProduct={(item) => setSelectedProduct(item)}
        type={type}
      />
    </div>
  );
}
