import React, { useState } from 'react';
import { Order } from '../types';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Printer, 
  ArrowRight, 
  X, 
  Sparkles, 
  Gamepad2,
  Clock,
  ExternalLink
} from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order;
  onClose: () => void;
  onTrackOrder: (orderNumber: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onTrackOrder
}) => {
  const { language } = useApp();
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 relative">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Success Header */}
        <div className="p-6 text-center bg-gradient-to-b from-emerald-950/60 to-slate-900 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            {language === 'bn' ? 'অর্ডার সফলভাবে গৃহীত হয়েছে!' : 'Order Placed Successfully!'}
          </h3>
          <p className="text-xs text-emerald-400 mt-1 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {order.paymentStatus === 'paid'
                ? (language === 'bn' ? 'পেমেন্ট ভেরিফাই হয়েছে, ডায়মন্ড পাঠানো হচ্ছে...' : 'Payment verified, delivering diamonds...')
                : (language === 'bn' ? 'অ্যাডমিন ভেরিফিকেশন সাপেক্ষে ডেলিভারি হবে' : 'Awaiting admin verification')}
            </span>
          </p>
        </div>

        {/* Invoice details */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs text-slate-400">
                  {language === 'bn' ? 'অর্ডার নম্বর:' : 'Order Number:'}
                </span>
                <p className="text-base font-black text-amber-400 font-mono flex items-center gap-2">
                  {order.orderNumber}
                  <button
                    onClick={handleCopy}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Copy Order Number"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">
                  {language === 'bn' ? 'তারিখ ও সময়:' : 'Date & Time:'}
                </span>
                <p className="text-xs text-slate-300 font-mono">
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400">{language === 'bn' ? 'প্লেয়ার আইডি (UID):' : 'Player UID:'}</span>
                <p className="font-mono font-bold text-white text-sm">{order.playerId}</p>
              </div>
              <div>
                <span className="text-slate-400">{language === 'bn' ? 'প্লেয়ার নাম:' : 'Nickname:'}</span>
                <p className="font-bold text-emerald-400 truncate">{order.playerNickname || 'Player'}</p>
              </div>
              <div>
                <span className="text-slate-400">{language === 'bn' ? 'প্যাকেজ:' : 'Package:'}</span>
                <p className="font-semibold text-white">{order.packageName}</p>
              </div>
              <div>
                <span className="text-slate-400">{language === 'bn' ? 'ডায়মন্ড:' : 'Diamonds:'}</span>
                <p className="font-bold text-amber-400 font-mono">{order.diamonds} 💎</p>
              </div>
              <div>
                <span className="text-slate-400">{language === 'bn' ? 'পেমেন্ট মাধ্যম:' : 'Payment Method:'}</span>
                <p className="font-semibold capitalize text-pink-400">{order.paymentMethod}</p>
              </div>
              <div>
                <span className="text-slate-400">{language === 'bn' ? 'ট্রানজ্যাকশন আইডি:' : 'TrxID:'}</span>
                <p className="font-mono text-slate-300 text-xs">{order.trxId}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-300">
                {language === 'bn' ? 'পরিশোধিত মূল্য:' : 'Amount Paid:'}
              </span>
              <span className="text-xl font-black text-amber-400 font-mono">
                ৳ {order.price}
              </span>
            </div>
          </div>

          {/* Delivery Note */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
            <Clock className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">
                {language === 'bn' ? 'ডেলিভারি সময়: ১-৩ মিনিট' : 'Delivery Time: 1-3 Minutes'}
              </p>
              <p className="text-[11px] text-amber-200/80">
                {language === 'bn'
                  ? 'গেমের ভেতর গিয়ে ভল্ট বা ডায়মন্ড ব্যালেন্স চেক করুন। কোনো সমস্যা হলে আমাদের হেল্পলাইনে জানান।'
                  : 'Check your in-game diamond balance. Contact support if you need assistance.'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'bn' ? 'রিসিপ্ট প্রিন্ট' : 'Print'}</span>
            </button>

            <button
              onClick={() => onTrackOrder(order.orderNumber)}
              className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
            >
              <span>{language === 'bn' ? 'লাইভ স্ট্যাটাস ট্র্যাক করুন' : 'Track Live Status'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
