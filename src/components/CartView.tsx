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

// Owner Paytm / UPI Configuration
const OWNER_UPI_ID = "6398682424@ptyes";
const SHOP_NAME = "Shivam Agrawal";

export default function CartView({
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onBackToShopping,
  onOrderPlaced,
  activeUser
}: CartViewProps) {
  const [showPaytmQr, setShowPaytmQr] = useState(true);

  const [orderDetails, setOrderDetails] = useState<OrderDetails>(() => {
    try {
      const activeUserStr = localStorage.getItem('activeUser');
      if (activeUserStr) {
        const user = JSON.parse(activeUserStr);
        return {
          customerName: user.fullName || '',
          customerPhone: user.contactNumber || '',
          orderType: 'delivery',
          tableNumber: 'Table 1',
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
      tableNumber: 'Table 1',
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

  // Helper to open Paytm or trigger UPI link
  const openPaytm = (amount: number) => {
    if (amount <= 0) {
      alert("Kripya cart me items add karein!");
      return;
    }

    if (orderDetails.orderType === 'delivery') {
      if (!orderDetails.address.trim()) {
        alert("Kripya delivery address enter karein!");
        return;
      }
    }

    const encodedName = encodeURIComponent(SHOP_NAME);
    const note = encodeURIComponent("Quality Sweets Order");
    const upiUrl = `upi://pay?pa=${OWNER_UPI_ID}&pn=${encodedName}&am=${amount}&cu=INR&tn=${note}`;

    setShowPaytmQr(true);

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = upiUrl;
    }
  };

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
  
  // Delivery Charge: ₹50 for doorstep delivery, ₹0 for takeaway/dine-in
  const deliveryCharge = orderDetails.orderType === 'delivery' ? 50 : 0;
  const total = subtotal + deliveryCharge;

  // Function to create full detailed WhatsApp order message URL
  const createWhatsAppUrl = (
    invId: string,
    details: OrderDetails,
    items: CartItem[],
    subTot: number,
    delAmt: number,
    grandTotal: number,
    phoneNumber: string = '916398682424'
  ) => {
    const itemDetails = items
      .map(
        (ci, index) =>
          `${index + 1}. *${ci.item.name}* (${ci.item.type === 'sweet' ? 'Sweet Shop' : 'Restaurant'})\n   • Qty: ${ci.quantity} × ₹${ci.item.price} = *₹${ci.item.price * ci.quantity}*`
      )
      .join('\n');

    let serviceInfo = '';
    if (details.orderType === 'dine-in') {
      serviceInfo = `📍 *Dining Spot:* ${details.tableNumber || 'Table 1'}`;
    } else if (details.orderType === 'delivery') {
      serviceInfo = `🏠 *Delivery Address:* ${details.address || 'Address not specified'}`;
    } else {
      serviceInfo = `🛍️ *Order Type:* Takeaway Counter Pickup`;
    }

    const messageText = 
`*✨ QUALITY SWEETS & RESTAURANT - NEW ORDER ✨*
----------------------------------------
🧾 *Invoice ID:* #${invId}
📅 *Date & Time:* ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}

👤 *FULL CUSTOMER DETAILS:*
• *Customer Name:* ${details.customerName || 'Guest Customer'}
• *Mobile Number:* ${details.customerPhone || 'N/A'}
• *Order Mode:* ${details.orderType.toUpperCase()}
${serviceInfo}

🛒 *ORDERED ITEMS:*
${itemDetails}

----------------------------------------
💰 *BILL BREAKDOWN:*
• Items Total: ₹${subTot}
${delAmt > 0 ? `• Delivery Fee: ₹${delAmt}\n` : ''}
*🔥 GRAND TOTAL: ₹${grandTotal}*
----------------------------------------
Please confirm this order on WhatsApp. Thank you! 🙏`;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageText)}`;
  };

  const sendDirectOrder = (phoneNumber: string) => {
    if (cart.length === 0) {
      alert("Kripya cart me items add karein!");
      return;
    }

    // Delivery location check
    if (orderDetails.orderType === 'delivery') {
      if (!orderDetails.address.trim()) {
        alert("Kripya delivery address enter karein!");
        return;
      }
    }

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

    // Auto open WhatsApp with order details for selected owner phone
    const waUrl = createWhatsAppUrl(
      randomInvoice,
      orderDetails,
      cart,
      subtotal,
      deliveryCharge,
      total,
      phoneNumber
    );

    window.open(waUrl, '_blank');

    setReceiptId(randomInvoice);
    setPlacedOrderDetails({ ...orderDetails });
    setPlacedCart([...cart]);
    setCheckoutComplete(true);
    onClearCart();
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    sendDirectOrder('918171069007');
  };

  if (checkoutComplete && placedOrderDetails) {
    const pSweetSub = placedCart
      .filter(item => item.item.type === 'sweet')
      .reduce((sum, item) => sum + item.item.price * item.quantity, 0);
    const pRestSub = placedCart
      .filter(item => item.item.type === 'restaurant')
      .reduce((sum, item) => sum + item.item.price * item.quantity, 0);
    const pSub = pSweetSub + pRestSub;
    const pDel = placedOrderDetails.orderType === 'delivery' ? 50 : 0;
    const pTotal = pSub + pDel;

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
            <div className="mx-auto bg-white border border-slate-200 p-3 rounded-2xl flex flex-col items-center justify-center shadow-sm space-y-2 max-w-xs" id="qr-block">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Paytm / Direct UPI QR Code</span>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=${OWNER_UPI_ID}&pn=${encodeURIComponent(SHOP_NAME)}&am=${pTotal}&cu=INR&tn=${encodeURIComponent("Quality Sweets Order")}`)}`}
                alt="Paytm UPI QR Code"
                className="w-40 h-40 border border-slate-200 rounded-xl p-1 bg-white shadow-inner"
              />
              <p className="text-[10px] text-slate-500 font-mono">UPI ID: <strong className="text-slate-800">{OWNER_UPI_ID}</strong></p>
              
              <button
                type="button"
                onClick={() => openPaytm(pTotal)}
                className="w-full py-2.5 px-4 bg-[#002e6e] hover:bg-[#001f4d] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Pay ₹{pTotal} via Paytm</span>
              </button>
            </div>

            <div className="text-slate-500 space-y-1">
              <span className="text-xs font-bold block uppercase tracking-wider text-orange-600">★ THANK YOU FOR VISITING ★</span>
              <span className="text-[10px] block">Fresh sweets catalog updated daily on our platform.</span>
              <span className="text-[9px] text-slate-400 block">Sweets Capacity: 5000 Slots | Restaurant Dining Capacity: 4000 Slots</span>
            </div>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3" id="success-back-controls">
          <a
            id="send-whatsapp-receipt-owner1-btn"
            href={createWhatsAppUrl(receiptId, placedOrderDetails, placedCart, pSub, pDel, pTotal, '918171069007')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#1ebd59] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            📱 Send Order to Owner 1
          </a>
          <a
            id="send-whatsapp-receipt-owner2-btn"
            href={createWhatsAppUrl(receiptId, placedOrderDetails, placedCart, pSub, pDel, pTotal, '916398682424')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-[#128C7E] hover:bg-[#0e7065] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            📱 Send Order to Owner 2
          </a>
          <button
            id="print-receipt-btn"
            onClick={() => window.print()}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            Print Receipt
          </button>
          <button
            id="back-home-btn"
            onClick={onBackToShopping}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
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
                    {item.item.image && (
                      <img
                        src={item.item.image}
                        alt={item.item.name}
                        referrerPolicy="no-referrer"
                        className="h-14 w-14 object-cover rounded-xl border border-slate-100 bg-slate-50 shrink-0"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    )}
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
                      <option value="Table 1">Table 1</option>
                      <option value="Table 2">Table 2</option>
                      <option value="Table 3">Table 3</option>
                      <option value="Table 4">Table 4</option>
                      <option value="Table 5">Table 5</option>
                      <option value="Table 6">Table 6</option>
                      <option value="Table 7">Table 7</option>
                      <option value="Table 8">Table 8</option>
                      <option value="Table 9">Table 9</option>
                      <option value="Table 10">Table 10</option>
                      <option value="Table 11">Table 11</option>
                      <option value="Table 12">Table 12</option>
                    </select>
                  </div>
                )}

                {orderDetails.orderType === 'delivery' && (
                  <div className="space-y-1.5" id="checkout-delivery-addr">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      Delivery Address *
                    </label>
                    <textarea
                      id="checkout-address-textarea"
                      required
                      rows={2}
                      placeholder="Enter full delivery address (House/Flat No., Landmark, Locality, City)"
                      value={orderDetails.address}
                      onChange={(e) => setOrderDetails({ ...orderDetails, address: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all resize-none"
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

              {/* Instructions Notice Banner in Hindi & English */}
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 shadow-sm space-y-2 text-left" id="payment-whatsapp-instructions">
                <div className="flex items-start gap-2">
                  <span className="text-base leading-none">⚠️</span>
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-amber-900 leading-snug">
                      🇮🇳 <span className="underline decoration-amber-400">महत्वपूर्ण सूचना (Important Note):</span>
                    </p>
                    <p className="text-amber-800 font-medium leading-relaxed">
                      पहले नीचे दिए गए <strong>WhatsApp</strong> बटन से <strong>दोनों Owner को ऑर्डर की डिटेल भेजना जरूरी है</strong>, उसके बाद ही आप Payment कर सकते हैं।
                    </p>
                    <p className="text-amber-700 text-[11px] leading-relaxed pt-0.5 border-t border-amber-200/60">
                      It is mandatory to send your order details to BOTH Owner 1 and Owner 2 on WhatsApp using the buttons below, and then you can complete your payment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Order WhatsApp Direct Buttons */}
              <div className="space-y-2 pt-1" id="order-whatsapp-buttons-container">
                <span className="text-xs font-bold text-slate-800 block text-center">
                  👇 Step 1: Send Order Details on WhatsApp First:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="order-buttons">
                  <button
                    type="button"
                    id="order-btn-owner1"
                    onClick={() => sendDirectOrder('918171069007')}
                    className="wa-btn py-3.5 px-4 bg-[#25D366] hover:bg-[#1ebd59] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    📱 Send Order to Owner 1
                  </button>
                  <button
                    type="button"
                    id="order-btn-owner2"
                    onClick={() => sendDirectOrder('916398682424')}
                    className="wa-btn wa-btn-2 py-3.5 px-4 bg-[#128C7E] hover:bg-[#0e7065] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    📱 Send Order to Owner 2
                  </button>
                </div>
              </div>

              {/* Paytm Direct UPI Payment Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-3" id="paytm-checkout-box">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <div className="text-left">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Step 2: Pay via Paytm / UPI</h4>
                    <p className="text-[10px] text-slate-500 font-mono">Quality Sweets & Food</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    0% Extra Charge
                  </span>
                </div>

                <div className="flex items-center justify-between px-2">
                  <span className="text-xs text-slate-600 font-medium">Total Bill:</span>
                  <span className="text-lg font-black text-emerald-700 font-mono">₹<span id="order-amount">{total}</span></span>
                </div>

                <button
                  type="button"
                  id="paytm-btn"
                  onClick={() => openPaytm(total)}
                  className="w-full py-3 px-4 bg-[#002e6e] hover:bg-[#001f4d] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                  <span>Pay via Paytm / Show QR Code</span>
                </button>

                {/* QR Code display */}
                {showPaytmQr && (
                  <div id="qr-container" className="pt-3 border-t border-slate-200/60 space-y-2.5 bg-white p-3.5 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-800">Scan or Screenshot QR Code to Pay:</p>
                    <div className="flex justify-center">
                      <img
                        id="qr-image"
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`upi://pay?pa=${OWNER_UPI_ID}&pn=${encodeURIComponent(SHOP_NAME)}&am=${total}&cu=INR&tn=${encodeURIComponent("Quality Sweets Order")}`)}`}
                        alt="UPI QR Code"
                        className="w-44 h-44 border border-slate-300 rounded-xl p-1.5 bg-white shadow-sm"
                      />
                    </div>
                    <p className="text-[11px] text-slate-600 font-mono">
                      UPI ID: <strong className="text-slate-900">{OWNER_UPI_ID}</strong> ({SHOP_NAME})
                    </p>

                    {/* Screenshot Note in Hindi and English */}
                    <div className="bg-sky-50 border border-sky-200 rounded-xl p-2.5 text-center space-y-1">
                      <p className="text-xs font-bold text-sky-900">
                        📸 QR कोड का स्क्रीनशॉट लें और पेमेंट करें
                      </p>
                      <p className="text-[11px] font-bold text-sky-800">
                        Take a screenshot of QR code and pay payment
                      </p>
                      <p className="text-[10px] text-sky-600 italic">
                        (Paytm, PhonePe, Google Pay ya kisi bhi UPI App se scan karke pay karein)
                      </p>
                    </div>
                  </div>
                )}

                <p className="text-[10px] text-slate-500">🔒 Direct UPI Payment (0% Extra Charge)</p>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
