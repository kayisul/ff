import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import { 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Gamepad2, 
  ChevronRight, 
  Search, 
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

interface UserOrdersProps {
  onSelectOrderToTrack: (orderNumber: string) => void;
  onGoToShop: () => void;
}

export const UserOrders: React.FC<UserOrdersProps> = ({ onSelectOrderToTrack, onGoToShop }) => {
  const { orders, language, currentUser } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter orders: If logged in, show user orders or all recent device orders
  const displayOrders = orders.filter((o) => {
    const matchesUser = currentUser
      ? o.userEmail?.toLowerCase() === currentUser.email.toLowerCase() ||
        o.userPhone === currentUser.phone ||
        currentUser.role === 'admin'
      : true;

    if (!matchesUser) return false;

    if (filterStatus === 'all') return true;
    return o.orderStatus === filterStatus;
  });

  const handleCopy = (orderNum: string) => {
    navigator.clipboard.writeText(orderNum);
    setCopiedId(orderNum);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-amber-400" />
            <span>{language === 'bn' ? 'সর্বশেষ অর্ডার' : 'Latest Orders'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {language === 'bn'
              ? 'আপনার সকল সাম্প্রতিক ও সর্বশেষ ফ্রি ফায়ার টপ-আপ অর্ডারের তালিকা ও রিয়েলটাইম ডেলিভারি স্ট্যাটাস'
              : 'List of all your latest Free Fire top-up orders and real-time delivery status'}
          </p>
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto text-xs">
          {[
            { id: 'all', labelBn: 'সকল (All)' },
            { id: 'completed', labelBn: 'ডেলিভার্ড' },
            { id: 'processing', labelBn: 'প্রসেসিং' },
            { id: 'pending', labelBn: 'অপেক্ষমান' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterStatus === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.labelBn}
            </button>
          ))}
        </div>
      </div>

      {displayOrders.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-4">
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">
            {language === 'bn' ? 'এখনো কোনো অর্ডার পাওয়া যায়নি' : 'No orders found'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {language === 'bn'
              ? 'আপনার পছন্দের ডায়মন্ড প্যাকেজ সিলেক্ট করে দ্রুত বিকাশ বা নগদ দিয়ে অর্ডার করুন।'
              : 'Select your preferred diamond package and place an instant order with bKash or Nagad.'}
          </p>
          <button
            onClick={onGoToShop}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-colors"
          >
            {language === 'bn' ? 'টপ-আপ শুরু করুন' : 'Shop Diamonds Now'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayOrders.map((order) => {
            return (
              <div
                key={order.id}
                className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 transition-all shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left details */}
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shrink-0">
                    💎
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm sm:text-base text-white">
                        {order.packageName}
                      </span>
                      <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-mono font-semibold">
                        {order.diamonds} 💎
                      </span>
                      <span className="text-[11px] text-slate-400 capitalize">
                        via {order.paymentMethod}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Gamepad2 className="w-3.5 h-3.5 text-slate-500" />
                        <strong className="text-slate-300 font-mono">{order.playerId}</strong>
                        {order.playerNickname && (
                          <span className="text-emerald-400">({order.playerNickname})</span>
                        )}
                      </span>

                      <span>•</span>

                      <span className="font-mono text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>

                      <span>•</span>

                      <span className="font-mono font-bold text-amber-400">
                        ৳{order.price}
                      </span>
                    </div>

                    {order.trxId && (
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        TrxID: {order.trxId}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right status & action */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                  <div className="text-left sm:text-right">
                    {order.orderStatus === 'completed' && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>ডেলিভার্ড</span>
                      </span>
                    )}
                    {order.orderStatus === 'processing' && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        <span>প্রসেসিং</span>
                      </span>
                    )}
                    {order.orderStatus === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-blue-400 bg-blue-950/60 border border-blue-500/30 px-2.5 py-1 rounded-full font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>অপেক্ষমান</span>
                      </span>
                    )}
                    {order.orderStatus === 'cancelled' && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/60 border border-rose-500/30 px-2.5 py-1 rounded-full font-bold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>বাতিল</span>
                      </span>
                    )}
                    <p className="text-[10px] text-slate-500 font-mono mt-1">
                      {order.orderNumber}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectOrderToTrack(order.orderNumber)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-400 transition-colors"
                    title="Track Order"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
