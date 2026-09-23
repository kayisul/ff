import React, { useState } from 'react';
import { Package } from '../types';
import { X, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

interface NagadModalProps {
  pkg: Package;
  playerId: string;
  playerNickname: string;
  phone: string;
  onSuccess: (trxId: string, senderNumber: string) => void;
  onClose: () => void;
}

export const NagadModal: React.FC<NagadModalProps> = ({
  pkg,
  phone,
  onSuccess,
  onClose
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Number, 2: OTP, 3: PIN, 4: Processing
  const [accountNumber, setAccountNumber] = useState<string>(phone || '01812345678');
  const [otp, setOtp] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const orderRef = `NGD-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || accountNumber.length < 11) {
      setErrorMsg('১১ ডিজিটের সঠিক নগদ একাউন্ট নম্বর দিন');
      return;
    }
    setErrorMsg('');
    setStep(2);
    setOtp('654321');
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setErrorMsg('নগদ ভেরিফিকেশন ওটিপি দিন');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || pin.length < 4) {
      setErrorMsg('৪ ডিজিটের নগদ পিন দিন');
      return;
    }
    setErrorMsg('');
    setStep(4);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const randomTrx = 'NGD' + Math.random().toString(36).substring(2, 9).toUpperCase();
      onSuccess(randomTrx, accountNumber);
    }, 1500);
  };

  const handleQuickSandboxSuccess = () => {
    setStep(4);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const randomTrx = 'NGD' + Math.random().toString(36).substring(2, 9).toUpperCase();
      onSuccess(randomTrx, accountNumber);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#d83f12] rounded-2xl shadow-2xl overflow-hidden border border-orange-400/30 text-white relative">
        {/* Nagad Header */}
        <div className="p-4 bg-[#ba340c] flex items-center justify-between border-b border-orange-700/50">
          <div className="flex items-center gap-2">
            <div className="bg-white text-[#d83f12] font-black text-sm px-2.5 py-0.5 rounded shadow">
              নগদ
            </div>
            <span className="text-xs font-semibold tracking-wide uppercase opacity-90">
              Nagad Payment Gateway
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Info Bar */}
        <div className="bg-[#9c2b09] px-5 py-3 flex items-center justify-between text-xs">
          <div>
            <p className="text-orange-200">মার্চেন্ট: <strong className="text-white">FF TopUp BD</strong></p>
            <p className="text-orange-200 font-mono">Ref: {orderRef}</p>
          </div>
          <div className="text-right">
            <p className="text-orange-200">মোট টাকা:</p>
            <p className="text-lg font-black text-white font-mono">৳ {pkg.price}.00</p>
          </div>
        </div>

        {/* Sandbox Test Action */}
        <div className="bg-orange-950/70 px-4 py-1.5 flex items-center justify-between text-[11px] border-b border-orange-900">
          <span className="flex items-center gap-1 text-orange-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>RSA এনক্রিপ্টেড পেমেন্ট</span>
          </span>
          <button
            type="button"
            onClick={handleQuickSandboxSuccess}
            className="bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded text-[10px] font-bold"
          >
            ⚡ স্যান্ডবক্স অটো টেস্ট
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-[#d83f12]">
          {errorMsg && (
            <div className="mb-4 p-2.5 rounded-lg bg-orange-950/80 border border-orange-400 text-xs text-orange-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-orange-100 mb-1">
                  নগদ একাউন্ট নম্বর (Your Nagad Account Number)
                </label>
                <input
                  type="tel"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-white text-slate-900 font-mono text-base px-3.5 py-2.5 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-300"
                  maxLength={11}
                  required
                />
              </div>

              <div className="text-[11px] text-orange-100 flex items-start gap-1.5">
                <input
                  type="checkbox"
                  id="nagadTerms"
                  defaultChecked
                  className="mt-0.5 rounded text-orange-700 focus:ring-0"
                />
                <label htmlFor="nagadTerms">
                  আমি নগদ পেমেন্টের সকল টার্মস ও পলিসির সাথে একমত।
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 py-2.5 rounded-lg bg-orange-900/60 hover:bg-orange-900 text-xs font-bold text-white transition-colors"
                >
                  বাতিল (CANCEL)
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-lg bg-white hover:bg-orange-50 text-xs font-bold text-[#d83f12] shadow transition-colors"
                >
                  পরবর্তী (PROCEED)
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-4">
              <div className="text-center text-xs text-orange-100">
                <p>নগদ ভেরিফিকেশন ওটিপি পাঠানো হয়েছে:</p>
                <p className="font-bold text-white font-mono">{accountNumber}</p>
              </div>

              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="ওটিপি কোড (যেমন: 654321)"
                  className="w-full text-center tracking-widest bg-white text-slate-900 font-mono text-lg font-bold px-3.5 py-2.5 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-300"
                  maxLength={6}
                  required
                />
                <p className="text-[10px] text-orange-200 text-center mt-1">
                  টেস্ট ওটিপি: <strong>654321</strong>
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/2 py-2.5 rounded-lg bg-orange-900/60 hover:bg-orange-900 text-xs font-bold text-white transition-colors"
                >
                  পিছনে
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-lg bg-white hover:bg-orange-50 text-xs font-bold text-[#d83f12] shadow transition-colors"
                >
                  ওটিপি যাচাই
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleStep3} className="space-y-4">
              <div className="text-center text-xs text-orange-100">
                <p>আপনার নগদ ৪ ডিজিটের পিন নম্বর দিন</p>
                <p className="text-[10px] text-orange-200">নিরাপদ আরএসএ এনক্রিপশন প্রটোকল</p>
              </div>

              <div>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  className="w-full text-center tracking-widest bg-white text-slate-900 font-mono text-xl font-bold px-3.5 py-2.5 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-300"
                  maxLength={4}
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/2 py-2.5 rounded-lg bg-orange-900/60 hover:bg-orange-900 text-xs font-bold text-white transition-colors"
                >
                  পিছনে
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-lg bg-white hover:bg-orange-50 text-xs font-bold text-[#d83f12] shadow transition-colors"
                >
                  পেমেন্ট করুন (৳{pkg.price})
                </button>
              </div>
            </form>
          )}

          {step === 4 && (
            <div className="py-8 text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-white animate-spin mx-auto" />
              <div>
                <h4 className="font-bold text-base text-white">নগদ পেমেন্ট সম্পন্ন হচ্ছে...</h4>
                <p className="text-xs text-orange-200 mt-1">
                  নগদ গেটওয়ে সার্ভার থেকে পেমেন্ট ভেরিফাই করা হচ্ছে
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#ba340c] text-center text-[11px] text-orange-200 flex items-center justify-center gap-1">
          <span>📞 নগদ হেল্পলাইন: 16167</span>
          <span>|</span>
          <span>ডাক বিভাগের ডিজিটাল লেনদেন</span>
        </div>
      </div>
    </div>
  );
};
