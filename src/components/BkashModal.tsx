import React, { useState } from 'react';
import { Package } from '../types';
import { X, ShieldCheck, ArrowRight, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface BkashModalProps {
  pkg: Package;
  playerId: string;
  playerNickname: string;
  phone: string;
  onSuccess: (trxId: string, senderNumber: string) => void;
  onClose: () => void;
}

export const BkashModal: React.FC<BkashModalProps> = ({
  pkg,
  playerId,
  phone,
  onSuccess,
  onClose
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Number, 2: OTP, 3: PIN, 4: Processing
  const [accountNumber, setAccountNumber] = useState<string>(phone || '01712345678');
  const [otp, setOtp] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const invoiceNumber = `INV-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || accountNumber.length < 11) {
      setErrorMsg('সঠিক ১১ ডিজিটের বিকাশ একাউন্ট নম্বর দিন');
      return;
    }
    setErrorMsg('');
    setStep(2);
    setOtp('123456'); // Pre-fill test sandbox OTP for developer convenience
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setErrorMsg('সঠিক ওটিপি কোড দিন (যেমন: 123456)');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || pin.length < 4) {
      setErrorMsg('সঠিক বিকাশ পিন দিন');
      return;
    }
    setErrorMsg('');
    setStep(4);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const randomTrx = 'BKH' + Math.random().toString(36).substring(2, 9).toUpperCase();
      onSuccess(randomTrx, accountNumber);
    }, 1500);
  };

  const handleQuickSandboxSuccess = () => {
    setStep(4);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const randomTrx = 'BKH' + Math.random().toString(36).substring(2, 9).toUpperCase();
      onSuccess(randomTrx, accountNumber);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#e2136e] rounded-2xl shadow-2xl overflow-hidden border border-pink-400/30 text-white relative">
        {/* Header with bKash branding */}
        <div className="p-4 bg-[#c40f5f] flex items-center justify-between border-b border-pink-700/50">
          <div className="flex items-center gap-2">
            <div className="bg-white text-[#e2136e] font-black text-sm px-2 py-0.5 rounded shadow">
              bKash
            </div>
            <span className="text-xs font-semibold tracking-wide uppercase opacity-90">
              Payment Gateway
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Info bar */}
        <div className="bg-[#a80b51] px-5 py-3 flex items-center justify-between text-xs">
          <div>
            <p className="text-pink-200">মার্চেন্ট: <strong className="text-white">FF TopUp BD</strong></p>
            <p className="text-pink-200 font-mono">Invoice: {invoiceNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-pink-200">পরিমাণ (Amount):</p>
            <p className="text-lg font-black text-white font-mono">৳ {pkg.price}.00</p>
          </div>
        </div>

        {/* Sandbox Indicator & 1-Click test */}
        <div className="bg-pink-900/60 px-4 py-1.5 flex items-center justify-between text-[11px] border-b border-pink-800">
          <span className="flex items-center gap-1 text-pink-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>টোকেনাইজড পেমেন্ট (Tokenized API)</span>
          </span>
          <button
            type="button"
            onClick={handleQuickSandboxSuccess}
            className="bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded text-[10px] font-bold"
          >
            ⚡ স্যান্ডবক্স অটো টেস্ট
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 bg-[#e2136e]">
          {errorMsg && (
            <div className="mb-4 p-2.5 rounded-lg bg-pink-950/80 border border-pink-400 text-xs text-pink-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-pink-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-pink-100 mb-1">
                  আপনার বিকাশ একাউন্ট নম্বর (Your bKash Account Number)
                </label>
                <input
                  type="tel"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-white text-slate-900 font-mono text-base px-3.5 py-2.5 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-300"
                  maxLength={11}
                  required
                />
              </div>

              <div className="text-[11px] text-pink-100 flex items-start gap-1.5">
                <input
                  type="checkbox"
                  id="bkashTerms"
                  defaultChecked
                  className="mt-0.5 rounded text-pink-700 focus:ring-0"
                />
                <label htmlFor="bkashTerms">
                  আমি বিকাশ পেমেন্টের শর্তাবলী এবং পলিসি মেনে নিচ্ছি।
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 py-2.5 rounded-lg bg-pink-900/60 hover:bg-pink-900 text-xs font-bold text-white transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-lg bg-white hover:bg-pink-50 text-xs font-bold text-[#e2136e] shadow transition-colors"
                >
                  PROCEED
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-4">
              <div className="text-center text-xs text-pink-100">
                <p>বিকাশ ভেরিফিকেশন কোড (OTP) পাঠানো হয়েছে:</p>
                <p className="font-bold text-white font-mono">{accountNumber}</p>
              </div>

              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="৬ ডিজিটের কোড (e.g. 123456)"
                  className="w-full text-center tracking-widest bg-white text-slate-900 font-mono text-lg font-bold px-3.5 py-2.5 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-300"
                  maxLength={6}
                  required
                />
                <p className="text-[10px] text-pink-200 text-center mt-1">
                  স্যান্ডবক্স টেস্ট কোড: <strong>123456</strong>
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/2 py-2.5 rounded-lg bg-pink-900/60 hover:bg-pink-900 text-xs font-bold text-white transition-colors"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-lg bg-white hover:bg-pink-50 text-xs font-bold text-[#e2136e] shadow transition-colors"
                >
                  CONFIRM OTP
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleStep3} className="space-y-4">
              <div className="text-center text-xs text-pink-100">
                <p>আপনার বিকাশ পিন নম্বর দিন</p>
                <p className="text-[10px] text-pink-200">নিরাপদ ও এনক্রিপ্টেড পেমেন্ট</p>
              </div>

              <div>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="•••••"
                  className="w-full text-center tracking-widest bg-white text-slate-900 font-mono text-xl font-bold px-3.5 py-2.5 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-300"
                  maxLength={5}
                  required
                />
                <p className="text-[10px] text-pink-200 text-center mt-1">
                  স্যান্ডবক্স টেস্টে যেকোনো ৫ ডিজিটের পিন (যেমন: 12345) দিন
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/2 py-2.5 rounded-lg bg-pink-900/60 hover:bg-pink-900 text-xs font-bold text-white transition-colors"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-lg bg-white hover:bg-pink-50 text-xs font-bold text-[#e2136e] shadow transition-colors"
                >
                  PAY ৳{pkg.price}
                </button>
              </div>
            </form>
          )}

          {step === 4 && (
            <div className="py-8 text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-white animate-spin mx-auto" />
              <div>
                <h4 className="font-bold text-base text-white">পেমেন্ট প্রসেসিং হচ্ছে...</h4>
                <p className="text-xs text-pink-200 mt-1">
                  bKash Tokenized Checkout API দ্বারা ট্রানজ্যাকশন নিশ্চিত করা হচ্ছে
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Helpline */}
        <div className="p-3 bg-[#a80b51] text-center text-[11px] text-pink-200 flex items-center justify-center gap-1">
          <span>📞 হেল্পলাইন: 16247</span>
          <span>|</span>
          <span>24/7 Secure Payment</span>
        </div>
      </div>
    </div>
  );
};
