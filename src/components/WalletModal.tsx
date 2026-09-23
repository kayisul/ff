import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethodType } from '../types';
import { 
  Wallet, 
  X, 
  Plus, 
  History, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Sparkles,
  CreditCard,
  Smartphone,
  Gem
} from 'lucide-react';

interface WalletModalProps {
  onClose: () => void;
  onOpenAuth?: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ onClose, onOpenAuth }) => {
  const { currentUser, language, walletTransactions, addWalletFunds, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'deposit' | 'history'>('deposit');
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [depositMethod, setDepositMethod] = useState<PaymentMethodType>('bkash');
  const [trxIdInput, setTrxIdInput] = useState<string>('');
  const [senderNumber, setSenderNumber] = useState<string>(currentUser?.phone || '');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [depositSuccess, setDepositSuccess] = useState<boolean>(false);

  // Preset amounts
  const presetAmounts = [100, 250, 500, 1000, 2000];

  const currentBalance = currentUser?.walletBalance ?? 0;

  const userTransactions = walletTransactions.filter(
    (tx) => tx.userId === currentUser?.id || (currentUser?.email && tx.userEmail === currentUser.email)
  );

  const handleSelectPreset = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    const num = parseInt(e.target.value);
    if (!isNaN(num) && num > 0) {
      setSelectedAmount(num);
    }
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      addToast(language === 'bn' ? 'দয়া করে প্রথমে লগইন করুন' : 'Please login first', 'error');
      if (onOpenAuth) onOpenAuth();
      return;
    }

    const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount;
    if (!finalAmount || finalAmount < 20) {
      addToast(language === 'bn' ? 'নূন্যতম ২০ টাকা রিচার্জ করতে হবে' : 'Minimum deposit is ৳20', 'error');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      let finalTrx = trxIdInput.trim();
      if (!finalTrx) {
        finalTrx = `${depositMethod.toUpperCase()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      }

      addWalletFunds(finalAmount, depositMethod, finalTrx);
      setIsProcessing(false);
      setDepositSuccess(true);
      setTrxIdInput('');

      setTimeout(() => {
        setDepositSuccess(false);
      }, 3000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                {language === 'bn' ? 'ফ্রি ফায়ার ওয়ালেট' : 'FF TopUp Wallet'}
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  Instant
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? '১-ক্লিকে দ্রুত ডায়মন্ড কেনার ডিজিটাল ব্যালেন্স' : 'Fast 1-click checkout digital balance'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Not Logged In Notice */}
        {!currentUser ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
              <Wallet className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-white">
                {language === 'bn' ? 'ওয়ালেট ব্যবহারে লগইন করুন' : 'Login to Use Wallet'}
              </h4>
              <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
                {language === 'bn'
                  ? 'আপনার ওয়ালেট ব্যালেন্স দেখতে বা টাকা রিচার্জ করতে আপনার অ্যাকাউন্টে সাইন ইন করুন।'
                  : 'Sign in to view your digital balance, deposit funds, and enjoy 1-click checkouts.'}
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                if (onOpenAuth) onOpenAuth();
              }}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
            >
              {language === 'bn' ? 'লগইন / রেজিস্ট্রেশন করুন' : 'Login / Register Now'}
            </button>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-5">
            {/* Wallet Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/30 p-5 shadow-xl">
              <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {language === 'bn' ? 'ব্যক্তিগত গেমিং ওয়ালেট' : 'Personal Gaming Balance'}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  ID: {currentUser.id.slice(-6)}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-xs font-semibold text-slate-400">৳</span>
                <span className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                  {currentBalance.toLocaleString('en-US')}
                </span>
                <span className="text-xs text-emerald-400 font-medium">BDT</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <div className="text-slate-300 font-medium">
                  {currentUser.name}
                  {currentUser.role === 'admin' && (
                    <span className="ml-2 text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-bold">
                      Admin
                    </span>
                  )}
                </div>
                <div className="text-slate-400 font-mono text-[11px]">
                  {currentUser.phone || currentUser.email}
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('deposit')}
                className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'deposit'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Plus className="w-4 h-4" />
                {language === 'bn' ? 'টাকা যোগ করুন (Add Money)' : 'Add Funds'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'history'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <History className="w-4 h-4" />
                {language === 'bn' ? 'লেনদেন ইতিহাস (History)' : 'Transactions'}
              </button>
            </div>

            {/* TAB 1: ADD MONEY (DEPOSIT) */}
            {activeTab === 'deposit' && (
              <form onSubmit={handleDepositSubmit} className="space-y-4">
                {depositSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>
                      {language === 'bn'
                        ? '🎉 টাকা ওয়ালেটে সফলভাবে যোগ করা হয়েছে!'
                        : '🎉 Money credited to your wallet successfully!'}
                    </span>
                  </div>
                )}

                {/* Amount presets */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    {language === 'bn' ? 'রিচার্জের পরিমাণ বেছে নিন (টাকা):' : 'Select Deposit Amount (BDT):'}
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {presetAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleSelectPreset(amt)}
                        className={`py-2.5 rounded-xl border text-xs font-bold font-mono transition-all ${
                          selectedAmount === amt && !customAmount
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/20'
                            : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        ৳{amt}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div className="mt-2.5">
                    <input
                      type="number"
                      min="20"
                      max="10000"
                      value={customAmount}
                      onChange={handleCustomChange}
                      placeholder={language === 'bn' ? 'অন্য পরিমাণ লিখুন (যেমনঃ ৩০০)' : 'Custom amount (e.g. 300)'}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Gateway selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    {language === 'bn' ? 'পেমেন্ট মাধ্যম সিলেক্ট করুন:' : 'Select Gateway:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {/* bKash */}
                    <div
                      onClick={() => setDepositMethod('bkash')}
                      className={`cursor-pointer rounded-xl p-2.5 border text-center transition-all ${
                        depositMethod === 'bkash'
                          ? 'bg-pink-950/40 border-pink-500 text-pink-300 ring-1 ring-pink-500/40'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-md bg-pink-600 text-white font-black text-[10px] flex items-center justify-center mx-auto mb-1">
                        bK
                      </div>
                      <span className="text-xs font-bold block">bKash</span>
                      <span className="text-[10px] text-emerald-400 font-medium">Auto</span>
                    </div>

                    {/* Nagad */}
                    <div
                      onClick={() => setDepositMethod('nagad')}
                      className={`cursor-pointer rounded-xl p-2.5 border text-center transition-all ${
                        depositMethod === 'nagad'
                          ? 'bg-orange-950/40 border-orange-500 text-orange-300 ring-1 ring-orange-500/40'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-md bg-orange-600 text-white font-black text-[10px] flex items-center justify-center mx-auto mb-1">
                        নগদ
                      </div>
                      <span className="text-xs font-bold block">Nagad</span>
                      <span className="text-[10px] text-emerald-400 font-medium">Auto</span>
                    </div>

                    {/* Rocket / Upay */}
                    <div
                      onClick={() => setDepositMethod('rocket')}
                      className={`cursor-pointer rounded-xl p-2.5 border text-center transition-all ${
                        depositMethod === 'rocket'
                          ? 'bg-purple-950/40 border-purple-500 text-purple-300 ring-1 ring-purple-500/40'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-md bg-purple-600 text-white font-black text-[10px] flex items-center justify-center mx-auto mb-1">
                        R
                      </div>
                      <span className="text-xs font-bold block">Rocket</span>
                      <span className="text-[10px] text-slate-400 font-medium">Manual</span>
                    </div>
                  </div>
                </div>

                {/* Manual Method info or Auto info */}
                {depositMethod === 'rocket' ? (
                  <div className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-2 text-xs">
                    <p className="text-purple-300 font-medium">
                      {language === 'bn' ? 'রকেট সেন্ড মানি করুনঃ 01977766655-8' : 'Rocket Send Money to: 01977766655-8'}
                    </p>
                    <input
                      type="text"
                      value={trxIdInput}
                      onChange={(e) => setTrxIdInput(e.target.value)}
                      placeholder={language === 'bn' ? 'লেনদেনের TrxID দিন' : 'Enter Rocket TrxID'}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                      required
                    />
                  </div>
                ) : (
                  <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                      <Zap className="w-3.5 h-3.5" />
                      {language === 'bn' ? 'ইনস্ট্যান্ট অটো-ভেরিফিকেশন' : 'Instant Automated Checkout'}
                    </span>
                    <span className="text-[11px] text-slate-500">০১ সেকেন্ডে ব্যালেন্স যুক্ত হবে</span>
                  </div>
                )}

                {/* Submit Deposit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg shadow-amber-500/20 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                >
                  {isProcessing ? (
                    <span>{language === 'bn' ? 'ভেরিফাই ও ব্যালেন্স যুক্ত হচ্ছে...' : 'Processing deposit...'}</span>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>
                        {language === 'bn'
                          ? `৳${customAmount ? customAmount : selectedAmount} ওয়ালেটে রিচার্জ করুন`
                          : `Recharge ৳${customAmount ? customAmount : selectedAmount} to Wallet`}
                      </span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: TRANSACTIONS HISTORY */}
            {activeTab === 'history' && (
              <div className="space-y-3">
                {userTransactions.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <History className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">
                      {language === 'bn' ? 'কোনো লেনদেন রেকর্ড পাওয়া যায়নি।' : 'No transaction history found yet.'}
                    </p>
                  </div>
                ) : (
                  userTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            tx.type === 'deposit'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : tx.type === 'purchase'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          }`}
                        >
                          {tx.type === 'deposit' ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : tx.type === 'purchase' ? (
                            <Gem className="w-4 h-4" />
                          ) : (
                            <CreditCard className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200">{tx.description}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            {tx.trxId && <span className="font-mono">Trx: {tx.trxId}</span>}
                            <span>•</span>
                            <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`font-bold font-mono text-sm block ${
                            tx.type === 'deposit'
                              ? 'text-emerald-400'
                              : tx.type === 'purchase'
                              ? 'text-rose-400'
                              : 'text-sky-400'
                          }`}
                        >
                          {tx.type === 'deposit' ? `+৳${tx.amount}` : `-৳${Math.abs(tx.amount)}`}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-medium">
                          {tx.status === 'completed' ? 'সফল' : tx.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
