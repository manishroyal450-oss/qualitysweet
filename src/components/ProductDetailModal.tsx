import React, { useState, useMemo, useEffect } from 'react';
import { MenuItem } from '../types';
import { 
  X, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Star, 
  Flame, 
  Sparkles, 
  Check, 
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

interface ProductDetailModalProps {
  product: MenuItem | null;
  allItems: MenuItem[];
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity?: number) => void;
  onSelectProduct: (item: MenuItem) => void;
  type: 'sweet' | 'restaurant';
}

export default function ProductDetailModal({
  product,
  allItems,
  onClose,
  onAddToCart,
  onSelectProduct,
  type
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Reset quantity and scroll when selected product changes
  useEffect(() => {
    setQuantity(1);
    setAddedToast(false);
    const container = document.getElementById('product-detail-scroll-container');
    if (container) {
      container.scrollTop = 0;
    }
  }, [product?.id]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [product]);

  const isSweet = type === 'sweet';

  const theme = {
    primaryBg: isSweet ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-teal-600 hover:bg-teal-700',
    primaryText: isSweet ? 'text-emerald-600' : 'text-teal-600',
    badgeBg: isSweet ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-teal-50 text-teal-700 border-teal-200',
    accentGradient: isSweet ? 'from-emerald-600 to-green-600' : 'from-teal-600 to-emerald-600',
  };

  // Find similar products
  const similarProducts = useMemo(() => {
    if (!product) return [];

    // Filter out current product
    const otherItems = allItems.filter(item => item.id !== product.id);

    // Exact category matches
    const categoryMatches = otherItems.filter(
      item => item.category.toLowerCase().trim() === product.category.toLowerCase().trim()
    );

    // If we have enough category matches, return them
    if (categoryMatches.length >= 4) {
      return categoryMatches.slice(0, 10);
    }

    // Otherwise blend with other items in the same section (sweets or restaurant)
    const remaining = otherItems.filter(
      item => item.category.toLowerCase().trim() !== product.category.toLowerCase().trim()
    );

    return [...categoryMatches, ...remaining].slice(0, 10);
  }, [product, allItems]);

  if (!product) return null;

  const hasMainImage = Boolean(product.image && product.image.trim() !== '' && !failedImages[product.id]);

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
    }, 2000);
  };

  const handleSimilarAddToCart = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    onAddToCart(item, 1);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
    }, 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 md:p-6 overflow-hidden animate-fadeIn"
      id="product-detail-backdrop"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100"
        id="product-detail-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
            id="close-detail-modal-btn"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Menu</span>
          </button>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${theme.badgeBg}`}>
              {product.category}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div 
          className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-8 scrollbar-thin"
          id="product-detail-scroll-container"
        >
          {/* Main Product Card Panel */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Image Box */}
            <div className="md:col-span-5">
              {hasMainImage ? (
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={() => {
                      setFailedImages(prev => ({ ...prev, [product.id]: true }));
                    }}
                  />
                  {product.popular && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <Flame className="h-3 w-3 fill-white" />
                      Popular
                    </span>
                  )}
                </div>
              ) : (
                <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/80 flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <div className={`p-4 rounded-2xl bg-white shadow-sm border border-slate-100 ${theme.primaryText}`}>
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-700 max-w-[180px]">
                    {product.name}
                  </h4>
                </div>
              )}
            </div>

            {/* Product Details Info */}
            <div className="md:col-span-7 space-y-4">
              {/* Badges & Rating */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 border border-emerald-200 bg-emerald-50 px-2 py-0.5 rounded text-xs text-emerald-700 font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  100% Pure Veg
                </span>

                {product.isSugarFree && (
                  <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                    Sugar Free
                  </span>
                )}

                <span className="bg-amber-50 text-amber-800 text-xs font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-200/60">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  {product.rating?.toFixed(1) || '4.8'} Rating
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {product.name}
                </h2>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  {product.description || 'Prepared fresh daily using authentic recipes and supreme quality ingredients.'}
                </p>
              </div>

              {/* Price Display */}
              <div className="pt-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Price</span>
                <span className="text-2xl font-black text-slate-950">₹{product.price}</span>
              </div>

              {/* Quantity Selector & Add to Cart Action */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-4">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-slate-200 rounded-2xl p-1 bg-slate-50">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 transition-all shadow-xs"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-slate-900 text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 transition-all shadow-xs"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCartClick}
                    className={`flex-1 py-3 px-6 rounded-2xl font-bold text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${theme.primaryBg}`}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Add to Cart • ₹{product.price * quantity}</span>
                  </button>
                </div>

                {/* Added Toast Notification */}
                {addedToast && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 animate-fadeIn">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Added {quantity} x {product.name} to Cart!</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Similar Products Section */}
          {similarProducts.length > 0 && (
            <div className="pt-6 border-t border-slate-100 space-y-4" id="similar-products-section">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <Sparkles className={`h-5 w-5 ${theme.primaryText}`} />
                    Similar Products in {product.category}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Explore similar items you might like
                  </p>
                </div>
              </div>

              {/* Similar Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {similarProducts.map((similarItem) => {
                  const hasSimilarImage = Boolean(similarItem.image && similarItem.image.trim() !== '' && !failedImages[similarItem.id]);

                  return (
                    <div
                      key={similarItem.id}
                      onClick={() => onSelectProduct(similarItem)}
                      className="group bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-3.5 flex flex-col justify-between transition-all cursor-pointer shadow-xs hover:shadow-md"
                    >
                      <div>
                        {hasSimilarImage && (
                          <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-100 mb-2.5">
                            <img
                              src={similarItem.image}
                              alt={similarItem.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={() => {
                                setFailedImages(prev => ({ ...prev, [similarItem.id]: true }));
                              }}
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-[9px] font-extrabold uppercase ${theme.primaryText}`}>
                            {similarItem.category}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">
                            ★ {similarItem.rating?.toFixed(1) || '4.5'}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-xs group-hover:text-slate-700 transition-colors line-clamp-1">
                          {similarItem.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                          {similarItem.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-200/60">
                        <span className="font-black text-slate-900 text-sm">
                          ₹{similarItem.price}
                        </span>
                        <button
                          onClick={(e) => handleSimilarAddToCart(e, similarItem)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all shadow-xs flex items-center gap-1 ${theme.primaryBg}`}
                        >
                          <Plus className="h-3 w-3" />
                          <span>ADD</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
