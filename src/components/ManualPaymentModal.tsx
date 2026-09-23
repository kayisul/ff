import React, { useState } from 'react';
import { Package, PaymentMethodType } from '../types';
import { useApp } from '../context/AppContext';
import { X, Copy, Check, AlertCircle, ArrowRight, ShieldAlert } from 'lucide-react';

interface ManualPaymentModalProps {
  pkg: Package;
  playerId: string;
  playerNickname: string;
  phone: string;
  method: PaymentMethodType;
  onSubmitManual: (trxId: string, senderNumber: string) => void;
  onClose: () => void;
}

export const ManualPaymentModal: React.FC<ManualPaymentModalProps> = ({
  pkg,
  phone,
  method,
  onSubmitManual,
  onClose
}) => {
  const { gatewaySettings, language } = useApp();
  const [senderNumber, setSenderNumber] = useState<string>(phone || '');
  const [trxId, setTrxId] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const merchantNumber =
    method === 'rocket'
      ? gatewaySettings.rocket.merchantNumber
      : method === 'upay'
      ? (gatewaySettings.upay?.merchantNumber || '01988877766')
      : method === 'nagad'
      ? gatewaySettings.nagad.merchantNumber
      : gatewaySettings.bkash.merchantNumber;

  const handleCopy = () => {
    navigator.clipboard.writeText(merchantNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderNumber || senderNumber.length < 11) {
      setErrorMsg(language === 'bn' ? 'দয়া করে সঠিক প্রেরকের মোবাইল নম্বর দিন।' : 'Please enter valid sender number.');
      return;
    }
    if (!trxId || trxId.trim().length < 6) {
      setErrorMsg(language === 'bn' ? 'দয়া করে সঠিক ট্রানজ্যাকশন আইডি (TrxID) লিখুন।' : 'Please enter valid Transaction ID (TrxID).');
      return;
    }

    onSubmitManual(trxId.trim().toUpperCase(), senderNumber.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-purple-600/30 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-sm">
              M
            </span>
            <div>
              <h3 className="font-bold text-base text-white">
                {language === 'bn' ? 'ম্যানুয়াল পেমেন্ট ভেরিফিকেশন' : 'Manual Payment Verification'}
              </h3>
              <p className="text-[11px] text-slate-400 capitalize">Method: {method}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="p-5 space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {language === 'bn' ? 'প্রদেয় মোট টাকা:' : 'Amount to send:'}
              </span>
              <span className="text-xl font-black text-amber-400 font-mono">
                ৳ {pkg.price}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">
                  {language === 'bn' ? 'আমাদের মার্চেন্ট / সেন্ড মানি নম্বর:' : 'Merchant / Receiver Number:'}
                </p>
                <p className="text-base font-bold text-white font-mono">{merchantNumber}</p>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/30 text-xs text-purple-200 space-y-1">
            <p className="font-semibold text-purple-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              {language === 'bn' ? 'টাকা পাঠানোর নিয়ম:' : 'Payment Instructions:'}
            </p>
            <p>1. আপনার রকেট/উপায় অ্যাপে যান অথবা ডায়াল করুন।</p>
            <p>2. "Send Money" বা "Merchant Pay" অপশন দিয়ে উপরের নম্বরে ৳{pkg.price} পাঠান।</p>
            <p>3. টাকা পাঠানো শেষ হলে SMS এ আসা Transaction ID (TrxID) নিচে লিখে সাবমিট করুন।</p>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'bn' ? 'যে নম্বর থেকে টাকা পাঠিয়েছেন (Sender Number)' : 'Sender Mobile Number'}
              </label>
              <input
                type="tel"
                value={senderNumber}
                onChange={(e) => setSenderNumber(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono text-sm focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'bn' ? 'ট্রানজ্যাকশন আইডি (Transaction ID / TrxID)' : 'Transaction ID (TrxID)'}
              </label>
              <input
                type="text"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="e.g. 9J82KD81"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono uppercase text-sm focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 font-bold text-white text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5"
              >
                <span>{language === 'bn' ? 'অর্ডার সাবমিট করুন' : 'Submit Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
