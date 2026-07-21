import React, { useState, useEffect } from 'react';
import { CartItem, OrderDetails, Order, UserProfile } from '../types';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ClipboardCheck, 
  MapPin, 
  User, 
  Phone, 
  Receipt, 
  ArrowLeft,
  CheckCircle2,
  Clock,
  Printer
} from 'lucide-react';

interface CartViewProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveFromCart: (id: string) => void;
  onClearCart: () => void;
  onBackToShopping: () => void;
  onOrderPlaced?: (order: Order) => void;
  activeUser: UserProfile | null;
}

export default function CartView({
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onBackToShopping,
  onOrderPlaced,
  activeUser
}: CartViewProps) {
  // Form details
  const [orderDetails, setOrderDetails] = useState<OrderDetails>(() => {
    try {
      const activeUserStr = localStorage.getItem('activeUser');
      if (activeUserStr) {
        const user = JSON.parse(activeUserStr);
        return {
          customerName: user.fullName || '',
          customerPhone: user.contactNumber || '',
          orderType: 'delivery',
          tableNumber: 'Table 5',
          address: user.address ? `${user.address} (PIN: ${user.pinCode || ''})` : ''
        };
      }
    } catch (e) {
      console.error('Error loading activeUser', e);
    }
    return {
      customerName: '',
      customerPhone: '',
      orderType: 'dine-in',
      tableNumber: 'Table 5',
      address: ''
    };
  });

  // Synchronize with activeUser changes
  useEffect(() => {
    if (activeUser) {
      setOrderDetails(prev => ({
        ...prev,
        customerName: activeUser.fullName,
        customerPhone: activeUser.contactNumber,
        address: activeUser.address ? `${activeUser.address} (PIN: ${activeUser.pinCode || ''})` : prev.address
      }));
    }
  }, [activeUser]);

  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [receiptId, setReceiptId] = useState('');
  const [placedOrderDetails, setPlacedOrderDetails] = useState<OrderDetails | null>(null);
  const [placedCart, setPlacedCart] = useState<CartItem[]>([]);

  // Split calculations
  const sweetSubtotal = cart
    .filter(item => item.item.type === 'sweet')
    .reduce((sum, item) => sum + item.item.price * item.quantity, 0);

  const restaurantSubtotal = cart
    .filter(item => item.item.type === 'restaurant')
    .reduce((sum, item) => sum + item.item.price * item.quantity, 0);

  const subtotal = sweetSubtotal + restaurantSubtotal;
  
  // Taxes: standard 5% GST for sweets and restaurant
  const gst = Math.round(subtotal * 0.05);
  const deliveryCharge = orderDetails.orderType === 'delivery' ? 40 : 0;
  const total = subtotal + gst + deliveryCharge;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Generate random invoice ID
    const randomInvoice = 'MM-' + Math.floor(100000 + Math.random() * 900000);
    
    // Call the callback to record this order
    if (onOrderPlaced) {
      onOrderPlaced({
        id: randomInvoice,
        items: [...cart],
        details: { ...orderDetails },
        total,
        timestamp: new Date().toLocaleString(),
        status: 'pending'
      });
    }

    setReceiptId(randomInvoice);
    setPlacedOrderDetails({ ...orderDetails });
    setPlacedCart([...cart]);
    setCheckoutComplete(true);
    onClearCart();
  };

  if (checkoutComplete && placedOrderDetails) {
    const pSweetSub = placedCart
      .filter(item => item.item.type === 'sweet')
      .reduce((sum, item) => sum + item.item.price * item.quantity, 0);
    const pRestSub = placedCart
      .filter(item => item.item.type === 'restaurant')
      .reduce((sum, item) => sum + item.item.price * item.quantity, 0);
    const pSub = pSweetSub + pRestSub;
    const pGst = Math.round(pSub * 0.05);
    const pDel = placedOrderDetails.orderType === 'delivery' ? 40 : 0;
    const pTotal = pSub + pGst + pDel;

    return (
      <div className="max-w-xl mx-auto space-y-8 pb-24" id="order-success-container">
        {/* Animated Confirmation header */}
        <div className="text-center space-y-3" id="success-heading">
          <div className="mx-auto h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-md animate-bounce">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Placed Successfully!</h1>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Your table or parcel booking is confirmed. Below is your official Quality digital tax receipt.
          </p>
        </div>

        {/* Beautiful POS Traditional Tax Invoice Receipt Card */}
        <div className="bg-amber-50/20 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl font-mono relative overflow-hidden" id="traditional-receipt-card">
          {/* Jagged border graphic to look like real receipt */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500"></div>

          {/* Traditional religious invocation */}
          <div className="text-center space-y-1 text-slate-600 border-b border-dashed border-slate-300 pb-4">
            <span className="text-xs font-bold block">॥ श्री गणेशाय नमः ॥</span>
            <span className="text-lg font-black tracking-widest text-orange-700">QUALITY SWEETS</span>
            <span className="text-[10px] block font-semibold uppercase -mt-1">Sweets, Savouries & Multi-Cuisine Restaurant</span>
            <span className="text-[9px] block">Sector 11, Main Market, New Delhi | Tel: +91-11-2489115</span>
          </div>

          {/* Receipt details */}
          <div className="grid grid-cols-2 gap-y-1 text-xs text-slate-700 py-4 border-b border-dashed border-slate-300">
            <div>
              <span className="text-slate-400">Invoice:</span> {receiptId}
            </div>
            <div className="text-right">
              <span className="text-slate-400">Date:</span> {new Date().toLocaleDateString()}
            </div>
            <div>
              <span className="text-slate-400">Guest:</span> {placedOrderDetails.customerName || 'Walk-in Guest'}
            </div>
            <div className="text-right">
              <span className="text-slate-400">Time:</span> {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div>
              <span className="text-slate-400">Contact:</span> {placedOrderDetails.customerPhone || 'N/A'}
            </div>
            <div className="text-right">
              <span className="text-slate-400">Service:</span> <span className="font-bold uppercase text-orange-700">{placedOrderDetails.orderType}</span>
            </div>
            {placedOrderDetails.orderType === 'dine-in' && (
              <div className="col-span-2">
                <span className="text-slate-400">Dining Spot:</span> <span className="font-bold">{placedOrderDetails.tableNumber}</span>
              </div>
            )}
            {placedOrderDetails.orderType === 'delivery' && (
              <div className="col-span-2 leading-tight">
                <span className="text-slate-400">Delivery Address:</span> <span className="text-[11px] block text-slate-800 font-semibold">{placedOrderDetails.address}</span>
              </div>
            )}
          </div>

          {/* Placed Items Table */}
          <div className="py-4 border-b border-dashed border-slate-300 text-xs text-slate-800 space-y-2">
            <div className="grid grid-cols-12 font-bold text-slate-500 border-b border-slate-200 pb-1.5 uppercase text-[10px]">
              <span className="col-span-6">Item Description</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-2 text-right">Rate</span>
              <span className="col-span-2 text-right">Amt</span>
            </div>

            {placedCart.map((item) => (
              <div key={item.item.id} className="grid grid-cols-12 items-start py-0.5" id={`receipt-row-${item.item.id}`}>
                <div className="col-span-6 flex flex-col">
                  <span className="font-bold leading-tight">{item.item.name}</span>
                  <span className="text-[9px] text-slate-400 italic">[{item.item.category}]</span>
                </div>
                <span className="col-span-2 text-center font-bold">{item.quantity}</span>
                <span className="col-span-2 text-right">₹{item.item.price}</span>
                <span className="col-span-2 text-right font-bold">₹{item.item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Pricing aggregates */}
          <div className="py-4 text-xs text-slate-800 space-y-1.5 border-b border-dashed border-slate-300">
            {pSweetSub > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-500">Sweets Section Total:</span>
                <span>₹{pSweetSub}</span>
              </div>
            )}
            {pRestSub > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-500">Dining Section Total:</span>
                <span>₹{pRestSub}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal:</span>
              <span>₹{pSub}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">CGST (2.5%) + SGST (2.5%):</span>
              <span>₹{pGst}</span>
            </div>
            {pDel > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-500">Doorstep Delivery Charge:</span>
                <span>₹{pDel}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>NET PAYABLE:</span>
              <span>₹{pTotal}</span>
            </div>
          </div>

          {/* Payment QR block & Thank you */}
          <div className="pt-6 text-center space-y-4">
            <div className="mx-auto w-32 h-32 bg-white border border-slate-200 p-2 rounded-xl flex items-center justify-center shadow-sm" id="qr-block">
              {/* Dynamic QR styling */}
              <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-850 to-slate-900 flex flex-col justify-center items-center text-[8px] text-white p-2 text-center rounded-lg">
                <span className="font-bold tracking-widest text-[9px] mb-1">SCAN & PAY</span>
                <span className="text-orange-400 font-bold block mb-1">UPI: quality@upi</span>
                <div className="border border-white/20 p-1 rounded bg-white text-slate-900 font-bold text-[7px] w-full uppercase">
                  ₹{pTotal} Instant Pay
                </div>
              </div>
            </div>

            <div className="text-slate-500 space-y-1">
              <span className="text-xs font-bold block uppercase tracking-wider text-orange-600">★ THANK YOU FOR VISITING ★</span>
              <span className="text-[10px] block">Fresh sweets catalog updated daily on our platform.</span>
              <span className="text-[9px] text-slate-400 block">Sweets Capacity: 500 Slots | Restaurant Dining Capacity: 200 Slots</span>
            </div>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex justify-center" id="success-back-controls">
          <button
            id="print-receipt-btn"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all mr-3"
          >
            <Printer className="h-4 w-4" />
            Print Receipt
          </button>
          <button
            id="back-home-btn"
            onClick={onBackToShopping}
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24" id="cart-view-main">
      {/* View Header */}
      <div className="flex items-center gap-3" id="cart-header">
        <button
          id="cart-back-btn"
          onClick={onBackToShopping}
          className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">Your Integrated Order Cart</h1>
          <p className="text-sm text-slate-500">Combine your sweet boxes and gourmet diner plates in a single unified invoice.</p>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200" id="empty-cart-state">
          <div className="mx-auto h-16 w-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="text-slate-800 font-bold text-xl">Your Cart is Empty</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
            Browse our sweet counter and hot restaurant dining pages to fill up slots and experience the unified billing flow.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              id="empty-cart-goto-sweets"
              onClick={onBackToShopping}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Go to Sweet Shop
            </button>
            <button
              id="empty-cart-goto-restaurant"
              onClick={onBackToShopping}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Go to Restaurant Menu
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="cart-content-grid">
          {/* Cart Products List */}
          <div className="lg:col-span-7 space-y-4" id="cart-items-list-box">
            <div className="flex justify-between items-center bg-slate-50 px-4 py-3 rounded-2xl border border-slate-150">
              <span className="text-xs font-bold text-slate-600 font-mono uppercase">
                Currently Selected ({cart.reduce((sum, item) => sum + item.quantity, 0)} Items)
              </span>
              <button
                id="clear-all-cart-btn"
                onClick={onClearCart}
                className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear All
              </button>
            </div>

            <div className="space-y-3" id="cart-items-rows">
              {cart.map((item) => (
                <div
                  key={item.item.id}
                  id={`cart-item-row-${item.item.id}`}
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 items-center justify-between shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
                >
                  {/* Photo & Metadata */}
                  <div className="flex items-center gap-3.5 flex-1 min-w-0" id={`cart-item-meta-${item.item.id}`}>
                    <img
                      src={item.item.image}
                      alt={item.item.name}
                      referrerPolicy="no-referrer"
                      className="h-14 w-14 object-cover rounded-xl border border-slate-100 bg-slate-50"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = item.item.type === 'sweet' 
                          ? 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&auto=format&fit=crop&q=60'
                          : 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200&auto=format&fit=crop&q=60';
                      }}
                    />
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          item.item.type === 'sweet' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-teal-50 text-teal-700 border border-teal-100'
                        }`}>
                          {item.item.type === 'sweet' ? 'Sweet' : 'Restaurant'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold font-mono">[{item.item.category}]</span>
                      </div>
                      <h4 className="font-bold text-slate-900 truncate leading-snug">{item.item.name}</h4>
                      <p className="text-xs font-semibold text-slate-500">₹{item.item.price} per plate/box</p>
                    </div>
                  </div>

                  {/* Quantity & Subtotal Adjustments */}
                  <div className="flex items-center gap-4 shrink-0" id={`cart-item-controls-${item.item.id}`}>
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1" id={`cart-quantity-box-${item.item.id}`}>
                      <button
                        id={`quantity-minus-${item.item.id}`}
                        onClick={() => onUpdateQuantity(item.item.id, item.quantity - 1)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-800 font-mono">
                        {item.quantity}
                      </span>
                      <button
                        id={`quantity-plus-${item.item.id}`}
                        onClick={() => onUpdateQuantity(item.item.id, item.quantity + 1)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="text-right w-20">
                      <span className="text-xs font-black text-slate-950 font-mono">₹{item.item.price * item.quantity}</span>
                    </div>

                    <button
                      id={`cart-remove-${item.item.id}`}
                      onClick={() => onRemoveFromCart(item.item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Details Form and Billing */}
          <form onSubmit={handlePlaceOrder} className="lg:col-span-5 space-y-6" id="checkout-form">
            {/* Service Selection details */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4" id="order-type-box">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider font-mono border-b border-slate-50 pb-2 flex items-center gap-1.5">
                <ClipboardCheck className="h-4.5 w-4.5 text-slate-500" />
                Select Order Type
              </h3>

              <div className="grid grid-cols-3 gap-2" id="order-type-tabs">
                <button
                  id="tab-dinein"
                  type="button"
                  onClick={() => setOrderDetails({ ...orderDetails, orderType: 'dine-in' })}
                  className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                    orderDetails.orderType === 'dine-in'
                      ? 'bg-teal-50 text-teal-700 border-teal-300 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Dine-In
                </button>
                <button
                  id="tab-takeaway"
                  type="button"
                  onClick={() => setOrderDetails({ ...orderDetails, orderType: 'takeaway' })}
                  className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                    orderDetails.orderType === 'takeaway'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Takeaway
                </button>
                <button
                  id="tab-delivery"
                  type="button"
                  onClick={() => setOrderDetails({ ...orderDetails, orderType: 'delivery' })}
                  className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                    orderDetails.orderType === 'delivery'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Home Delivery
                </button>
              </div>

              {/* Dynamic Sub-form Inputs */}
              <div className="space-y-3 pt-2" id="checkout-fields">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    Customer Name *
                  </label>
                  <input
                    id="checkout-name-input"
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={orderDetails.customerName}
                    onChange={(e) => setOrderDetails({ ...orderDetails, customerName: e.target.value })}
                    className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    Mobile Number *
                  </label>
                  <input
                    id="checkout-phone-input"
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    placeholder="10-digit mobile number"
                    value={orderDetails.customerPhone}
                    onChange={(e) => setOrderDetails({ ...orderDetails, customerPhone: e.target.value })}
                    className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 transition-all"
                  />
                </div>

                {orderDetails.orderType === 'dine-in' && (
                  <div className="space-y-1" id="checkout-dine-table">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      Table Selection *
                    </label>
                    <select
                      id="checkout-table-select"
                      value={orderDetails.tableNumber}
                      onChange={(e) => setOrderDetails({ ...orderDetails, tableNumber: e.target.value })}
                      className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 bg-white outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 transition-all"
                    >
                      <option value="Table 1">Table 1 (Family Box)</option>
                      <option value="Table 2">Table 2 (Couples Nest)</option>
                      <option value="Table 3">Table 3 (Diner Counter)</option>
                      <option value="Table 4">Table 4 (Lounge Corner)</option>
                      <option value="Table 5">Table 5 (Terrace View)</option>
                    </select>
                  </div>
                )}

                {orderDetails.orderType === 'delivery' && (
                  <div className="space-y-1" id="checkout-delivery-addr">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      Full Address *
                    </label>
                    <textarea
                      id="checkout-address-textarea"
                      required
                      rows={2}
                      placeholder="Flat, building, block, landmark, pincode"
                      value={orderDetails.address}
                      onChange={(e) => setOrderDetails({ ...orderDetails, address: e.target.value })}
                      className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 transition-all"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Bill Summary totals */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4" id="billing-summary-box">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider font-mono border-b border-slate-50 pb-2 flex items-center gap-1.5">
                <Receipt className="h-4.5 w-4.5 text-slate-500" />
                Price Summary Details
              </h3>

              <div className="space-y-2 text-xs text-slate-700" id="billing-subtotals">
                {sweetSubtotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sweets Section Total:</span>
                    <span className="font-bold font-mono">₹{sweetSubtotal}</span>
                  </div>
                )}
                {restaurantSubtotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Restaurant Dishes Total:</span>
                    <span className="font-bold font-mono">₹{restaurantSubtotal}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-50 pt-2 font-bold text-slate-900">
                  <span>Cart Subtotal:</span>
                  <span className="font-mono">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">GST (5% Combined):</span>
                  <span className="font-mono">₹{gst}</span>
                </div>
                {orderDetails.orderType === 'delivery' && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Doorstep Delivery Charge:</span>
                    <span className="font-mono">₹{deliveryCharge}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-3 mt-1">
                  <span>GRAND TOTAL:</span>
                  <span className="font-mono text-lg text-emerald-700">₹{total}</span>
                </div>
              </div>

              {/* Confirm Submit button */}
              <button
                id="submit-order-btn"
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Place Order & Book Slot
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
