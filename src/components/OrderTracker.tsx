import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Gamepad2, 
  CreditCard, 
  Copy, 
  Check, 
  HelpCircle,
  Sparkles,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import { Order } from '../types';

interface OrderTrackerProps {
  initialSearch?: string;
  onGoToShop: () => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ initialSearch = '', onGoToShop }) => {
  const { orders, language, gatewaySettings } = useApp();
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(() => {
    if (initialSearch) {
      return orders.find(
        (o) =>
          o.orderNumber.toLowerCase() === initialSearch.toLowerCase() ||
          o.playerId === initialSearch
      ) || null;
    }
    return orders[0] || null;
  });
  const [hasSearched, setHasSearched] = useState<boolean>(!!initialSearch);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const term = searchTerm.trim().toLowerCase();
    const found = orders.find(
      (o) => o.orderNumber.toLowerCase() === term || o.playerId.toLowerCase() === term
    );
    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const handleCopyOrderNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine stage step (1 to 4)
  const getStepProgress = (status: Order['orderStatus']) => {
    switch (status) {
      case 'pending':
        return 2;
      case 'processing':
        return 3;
      case 'completed':
        return 4;
      case 'cancelled':
        return 1;
      default:
        return 2;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {language === 'bn' ? '🔍 ফ্রি ফায়ার অর্ডার ট্র্যাকিং' : '🔍 Track Your Free Fire Order'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          {language === 'bn'
            ? 'আপনার Order Number (যেমন: FF-98241) অথবা Player ID (UID) দিয়ে লাইভ ডেলিভারি স্ট্যাটাস দেখুন'
            : 'Enter your Order Number (e.g. FF-98241) or Player UID to check live delivery status'}
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'bn' ? 'অর্ডার নম্বর বা প্লেয়ার আইডি লিখুন...' : 'Enter Order Number or Player UID...'}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-slate-100 placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-md text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Search className="w-4 h-4" />
            <span>{language === 'bn' ? 'স্ট্যাটাস দেখুন' : 'Track Order'}</span>
          </button>
        </form>

        {/* Quick sample chips */}
        {orders.length > 0 && (
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 flex-wrap">
            <span>{language === 'bn' ? 'সাম্প্রতিক অর্ডারসমূহ:' : 'Recent Orders:'}</span>
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setSearchTerm(o.orderNumber);
                  setSearchedOrder(o);
                  setHasSearched(true);
                }}
                className="bg-slate-950 hover:bg-slate-800 text-amber-400 font-mono px-2.5 py-1 rounded-lg border border-slate-800 transition-colors"
              >
                {o.orderNumber}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Result Card */}
      {searchedOrder ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
          {/* Top Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Order ID:</span>
                <span className="font-mono font-black text-xl text-white">
                  {searchedOrder.orderNumber}
                </span>
                <button
                  onClick={() => handleCopyOrderNumber(searchedOrder.orderNumber)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                  title="Copy"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'bn' ? 'অর্ডারের সময়:' : 'Order Placed:'}{' '}
                <span className="font-mono text-slate-300">
                  {new Date(searchedOrder.createdAt).toLocaleString()}
                </span>
              </p>
            </div>

            {/* Status Pill */}
            <div>
              {searchedOrder.orderStatus === 'completed' && (
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'bn' ? 'ডেলিভারি সম্পন্ন হয়েছে (Delivered)' : 'Delivered Successfully'}</span>
                </div>
              )}
              {searchedOrder.orderStatus === 'processing' && (
                <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3.5 py-1.5 rounded-full text-xs font-bold animate-pulse">
                  <Clock className="w-4 h-4" />
                  <span>{language === 'bn' ? 'ডায়মন্ড পাঠানো হচ্ছে (Processing)' : 'Processing Diamond Delivery'}</span>
                </div>
              )}
              {searchedOrder.orderStatus === 'pending' && (
                <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 border border-blue-500/40 px-3.5 py-1.5 rounded-full text-xs font-bold">
                  <Clock className="w-4 h-4" />
                  <span>{language === 'bn' ? 'ভেরিফিকেশন অপেক্ষমান (Pending)' : 'Awaiting Review'}</span>
                </div>
              )}
              {searchedOrder.orderStatus === 'cancelled' && (
                <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-400 border border-rose-500/40 px-3.5 py-1.5 rounded-full text-xs font-bold">
                  <AlertCircle className="w-4 h-4" />
                  <span>{language === 'bn' ? 'অর্ডার বাতিল (Cancelled)' : 'Order Cancelled'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Timeline Visualizer */}
          <div className="py-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
              {language === 'bn' ? 'ডেলিভারি ট্র্যাকিং টাইমলাইন' : 'Delivery Tracking Timeline'}
            </h4>

            <div className="relative flex items-center justify-between">
              {/* Progress track line */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 -z-0" />
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-amber-500 to-emerald-500 -z-0 transition-all duration-500"
                style={{
                  width: `${((getStepProgress(searchedOrder.orderStatus) - 1) / 3) * 100}%`
                }}
              />

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg shadow-emerald-500/30">
                  ✓
                </div>
                <span className="text-[11px] font-semibold text-slate-200 mt-2 text-center">
                  {language === 'bn' ? 'অর্ডার সাবমিট' : 'Order Placed'}
                </span>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-colors ${
                  getStepProgress(searchedOrder.orderStatus) >= 2
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {getStepProgress(searchedOrder.orderStatus) >= 2 ? '✓' : '২'}
                </div>
                <span className="text-[11px] font-semibold text-slate-200 mt-2 text-center">
                  {language === 'bn' ? 'পেমেন্ট নিশ্চিত' : 'Payment Confirmed'}
                </span>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-colors ${
                  getStepProgress(searchedOrder.orderStatus) >= 3
                    ? 'bg-amber-500 text-slate-950 shadow-amber-500/30'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {getStepProgress(searchedOrder.orderStatus) >= 4 ? '✓' : '৩'}
                </div>
                <span className="text-[11px] font-semibold text-slate-200 mt-2 text-center">
                  {language === 'bn' ? 'ডায়মন্ড প্রসেসিং' : 'Delivering'}
                </span>
              </div>

              {/* Step 4 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-colors ${
                  getStepProgress(searchedOrder.orderStatus) >= 4
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {getStepProgress(searchedOrder.orderStatus) >= 4 ? '✓' : '৪'}
                </div>
                <span className="text-[11px] font-semibold text-slate-200 mt-2 text-center">
                  {language === 'bn' ? 'আইডিতে সফল ডেলিভারি' : 'Delivered'}
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">{language === 'bn' ? 'প্লেয়ার আইডি (UID):' : 'Player ID (UID):'}</span>
              <p className="font-mono text-base font-bold text-white flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4 text-amber-400" />
                {searchedOrder.playerId}
              </p>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">{language === 'bn' ? 'গেমের নাম:' : 'In-game Name:'}</span>
              <p className="font-bold text-emerald-400 text-sm truncate">
                {searchedOrder.playerNickname || 'Player'}
              </p>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">{language === 'bn' ? 'প্যাকেজ ও ডায়মন্ড:' : 'Package & Diamonds:'}</span>
              <p className="font-bold text-amber-400 text-sm">
                {searchedOrder.packageName} ({searchedOrder.diamonds} 💎)
              </p>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">{language === 'bn' ? 'পরিশোধিত মূল্য:' : 'Total Price:'}</span>
              <p className="font-mono font-bold text-white text-sm">
                ৳ {searchedOrder.price} BDT
              </p>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">{language === 'bn' ? 'পেমেন্ট মেথড:' : 'Payment Method:'}</span>
              <p className="font-bold capitalize text-pink-400 text-sm flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                {searchedOrder.paymentMethod}
              </p>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">{language === 'bn' ? 'ট্রানজ্যাকশন আইডি (TrxID):' : 'Transaction ID:'}</span>
              <p className="font-mono text-slate-300 text-xs">
                {searchedOrder.trxId || 'N/A'}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <a
              href={`https://wa.me/${gatewaySettings.whatsappSupport.replace('+', '')}?text=Hello,%20I%20need%20help%20with%20Order%20${searchedOrder.orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-xs text-slate-300 hover:text-emerald-400 flex items-center justify-center gap-2 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে সাহায্য নিন' : 'WhatsApp Support'}</span>
            </a>

            <button
              onClick={onGoToShop}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>{language === 'bn' ? 'নতুন টপ-আপ করুন' : 'Order More Diamonds'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 space-y-3">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">
            {language === 'bn' ? 'কোনো অর্ডার খুঁজে পাওয়া যায়নি' : 'No Order Found'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {language === 'bn'
              ? 'আপনার দেওয়া অর্ডার নম্বর বা প্লেয়ার আইডি সঠিক আছে কিনা তা পুনরায় চেক করুন।'
              : 'Please verify the Order Number or Player ID you entered and try again.'}
          </p>
        </div>
      ) : null}
    </div>
  );
};
