import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Category, PaymentMethodType } from '../types';
import { 
  Gamepad2, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  ChevronRight,
  Info,
  Clock,
  ArrowRight,
  UserCheck,
  Wallet,
  ShieldAlert
} from 'lucide-react';

interface TopUpStoreProps {
  onInitiatePayment: (pkg: Package, playerId: string, playerNickname: string, phone: string, method: PaymentMethodType) => void;
  onOpenWallet?: () => void;
  onOpenAuth?: () => void;
}

export const TopUpStore: React.FC<TopUpStoreProps> = ({ onInitiatePayment, onOpenWallet, onOpenAuth }) => {
  const { packages, language, currentUser, savePlayerId, gatewaySettings, addToast, logout } = useApp();

  const [playerId, setPlayerId] = useState<string>('2849182391');
  const [playerNickname, setPlayerNickname] = useState<string>('★BD_SNIPER★');
  const [isVerifyingUid, setIsVerifyingUid] = useState<boolean>(false);
  const [uidVerified, setUidVerified] = useState<boolean>(true);
  const [showUidHelp, setShowUidHelp] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(packages[2] || packages[0]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('bkash');
  const [phoneNumber, setPhoneNumber] = useState<string>(currentUser?.phone || '01712345678');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);

  // Mock list of realistic nicknames for simulation
  const mockNicknames = [
    '★BD_SNIPER★',
    'TIGER_FORCE_07',
    'SHADOW_K1LLER',
    'VILLAIN_BD',
    'PRO_PLAYER_FF',
    'OP_HEADSHOT_99'
  ];

  const handleVerifyUid = () => {
    if (!playerId.trim()) return;
    setIsVerifyingUid(true);
    setUidVerified(false);

    setTimeout(() => {
      setIsVerifyingUid(false);
      setUidVerified(true);
      // Pick simulated nickname based on UID digits
      const index = Math.abs(parseInt(playerId.slice(-2)) || 0) % mockNicknames.length;
      const detectedName = mockNicknames[index];
      setPlayerNickname(detectedName);
      if (currentUser) {
        savePlayerId(playerId);
      }
    }, 600);
  };

  const filteredPackages = packages.filter((pkg) => {
    if (selectedCategory === 'all') return true;
    return pkg.category === selectedCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.role === 'admin') {
      addToast(
        language === 'bn'
          ? '❌ অ্যাডমিন অ্যাকাউন্ট থেকে ডায়মন্ড অর্ডার করা নিষিদ্ধ! দয়া করে সাধারণ গ্রাহক একাউন্ট দিয়ে চেষ্টা করুন।'
          : '❌ Admin accounts cannot place diamond orders! Please use a regular customer account.',
        'error'
      );
      return;
    }

    if (!selectedPackage) return;
    if (!playerId.trim()) {
      alert(language === 'bn' ? 'দয়া করে Free Fire Player ID (UID) দিন!' : 'Please enter Free Fire Player ID (UID)!');
      return;
    }
    if (!phoneNumber.trim()) {
      alert(language === 'bn' ? 'দয়া করে আপনার মোবাইল নাম্বার দিন!' : 'Please enter contact phone number!');
      return;
    }

    if (selectedMethod === 'wallet') {
      if (!currentUser) {
        addToast(
          language === 'bn' ? 'ওয়ালেট দিয়ে পেমেন্ট করতে অনুগ্রহ করে লগইন করুন' : 'Please login to pay with wallet',
          'error'
        );
        if (onOpenAuth) onOpenAuth();
        return;
      }
      const balance = currentUser.walletBalance ?? 0;
      if (balance < selectedPackage.price) {
        addToast(
          language === 'bn'
            ? `❌ ওয়ালেটে অপর্যাপ্ত ব্যালেন্স! আপনার ব্যালেন্স ৳${balance}, প্রয়োজন ৳${selectedPackage.price}`
            : `❌ Insufficient wallet balance! You have ৳${balance}, need ৳${selectedPackage.price}`,
          'error'
        );
        if (onOpenWallet) onOpenWallet();
        return;
      }
    }

    onInitiatePayment(
      selectedPackage,
      playerId,
      playerNickname || 'Player',
      phoneNumber,
      selectedMethod
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Admin Restriction Banner */}
      {currentUser?.role === 'admin' && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-rose-200">
                {language === 'bn' ? '⚠️ অ্যাডমিন একাউন্ট রেস্ট্রিকশন সক্রিয়' : '⚠️ Admin Order Restriction Active'}
              </h4>
              <p className="text-xs text-rose-300/80">
                {language === 'bn'
                  ? 'অ্যাডমিন অ্যাকাউন্ট থেকে কোনো ডায়মন্ড অর্ডার গ্রহণ করা নিষিদ্ধ। ডায়মন্ড কিনতে সাধারণ গ্রাহক হিসেবে লগইন করুন।'
                  : 'Admin accounts are restricted from ordering diamonds. Please switch to a customer account to purchase.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold transition-colors shrink-0 text-center border border-rose-500/30"
          >
            {language === 'bn' ? 'লগআউট / কাস্টমার সুইচ' : 'Switch / Logout'}
          </button>
        </div>
      )}

      {/* Hero Notice Banner */}
      {gatewaySettings.notice && (
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/20 flex items-start gap-3 text-amber-200">
          <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold text-amber-300">
              {language === 'bn' ? 'জরুরি নোটিশ: ' : 'Notice: '}
            </span>
            {gatewaySettings.notice}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* STEP 1: PLAYER ID (UID) */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow">
                ১
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-amber-400" />
                {language === 'bn' ? 'প্লেয়ার আইডি (UID) প্রবেশ করান' : 'Enter Free Fire Player ID (UID)'}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowUidHelp(!showUidHelp)}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'আইডি কোথায় পাবেন?' : 'Where is UID?'}</span>
            </button>
          </div>

          {showUidHelp && (
            <div className="mb-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5 animate-fadeIn">
              <p className="font-semibold text-amber-400">
                {language === 'bn' ? '📌 Free Fire থেকে Player ID কপি করার নিয়ম:' : '📌 How to copy Player ID:'}
              </p>
              <p>1. ফ্রি ফায়ার গেম ওপেন করুন।</p>
              <p>2. স্ক্রিনের উপরে বামে আপনার গেম প্রোফাইলে ক্লিক করুন।</p>
              <p>3. আপনার অবতারে নামের ঠিক নিচে থাকা ৮-১০ ডিজিটের আইডি নম্বরের পাশে থাকা কপি আইকনে ট্যাপ করুন।</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-8 relative">
              <input
                type="text"
                value={playerId}
                onChange={(e) => {
                  setPlayerId(e.target.value.replace(/\D/g, ''));
                  setUidVerified(false);
                }}
                placeholder={language === 'bn' ? 'যেমন: 2849182391' : 'e.g. 2849182391'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 font-mono text-base focus:outline-none focus:border-amber-500 transition-colors"
                maxLength={12}
                required
              />
              {uidVerified && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="font-medium">{playerNickname}</span>
                </div>
              )}
            </div>

            <div className="sm:col-span-4 flex items-center gap-2">
              <button
                type="button"
                onClick={handleVerifyUid}
                disabled={isVerifyingUid || !playerId.trim()}
                className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2"
              >
                {isVerifyingUid ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-amber-400 border-t-transparent" />
                ) : (
                  <UserCheck className="w-4 h-4 text-amber-400" />
                )}
                <span>{language === 'bn' ? 'আইডি চেক করুন' : 'Verify UID'}</span>
              </button>
            </div>
          </div>

          {/* Quick select saved IDs */}
          {currentUser?.savedPlayerIds && currentUser.savedPlayerIds.length > 0 && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-slate-400">
                {language === 'bn' ? 'সেভ করা আইডি:' : 'Saved IDs:'}
              </span>
              {currentUser.savedPlayerIds.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setPlayerId(id);
                    setUidVerified(true);
                  }}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
                >
                  {id}
                </button>
              ))}
            </div>
          )}

          {uidVerified && (
            <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>
                  {language === 'bn' ? 'প্লেয়ার নাম:' : 'Player Name:'}{' '}
                  <strong className="text-white font-mono">{playerNickname}</strong>
                </span>
                <span className="text-slate-400">|</span>
                <span>সার্ভার: <strong className="text-white">BD Server</strong></span>
              </div>
              <span className="text-emerald-400 font-semibold text-[11px]">আইডি নিশ্চিত হয়েছে ✓</span>
            </div>
          )}
        </section>

        {/* STEP 2: SELECT RECHARGE PACKAGE */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow">
                ২
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {language === 'bn' ? 'রিচার্জ প্যাকেজ নির্বাচন করুন' : 'Select Recharge Package'}
                </h2>
                <p className="text-xs text-slate-400">
                  {language === 'bn' ? 'নিচের প্যাকেজ থেকে যেকোনো একটি বেছে নিন' : 'Choose one of the packages below'}
                </p>
              </div>
            </div>

            {/* Category filter tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
              {[
                { id: 'all', labelBn: 'সবগুলো', labelEn: 'All' },
                { id: 'diamonds', labelBn: 'ডায়মন্ড', labelEn: 'Diamonds' },
                { id: 'membership', labelBn: 'মেম্বারশিপ', labelEn: 'Membership' },
                { id: 'evo_gun', labelBn: 'ইভো গান', labelEn: 'EVO Gun' },
                { id: 'special_airdrop', labelBn: 'এয়ারড্রপ', labelEn: 'Airdrop' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id as Category | 'all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === tab.id
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {language === 'bn' ? tab.labelBn : tab.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Package Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredPackages.map((pkg) => {
              const isSelected = selectedPackage?.id === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`relative cursor-pointer rounded-2xl p-4 transition-all duration-200 border text-left flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-amber-500/15 to-slate-900 border-amber-500 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/30'
                      : 'bg-slate-950/70 hover:bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Badge */}
                  {pkg.badge && (
                    <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
                      {pkg.badge}
                    </div>
                  )}

                  <div>
                    {/* Diamond visual icon */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400">
                        {pkg.category === 'membership' ? (
                          <Sparkles className="w-5 h-5 text-rose-400" />
                        ) : (
                          <span className="text-xl">💎</span>
                        )}
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-amber-400" />
                      )}
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-400 transition-colors">
                      {language === 'bn' ? pkg.nameBn : pkg.name}
                    </h3>

                    {pkg.bonusDiamonds ? (
                      <p className="text-[11px] font-medium text-emerald-400 mt-0.5">
                        +{pkg.bonusDiamonds} Bonus 💎
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {pkg.description || 'Instant BD delivery'}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-baseline justify-between">
                    <div>
                      <span className="text-base sm:text-lg font-black text-amber-400 font-mono">
                        ৳{pkg.price}
                      </span>
                      {pkg.originalPrice && (
                        <span className="text-xs text-slate-500 line-through ml-1.5 font-mono">
                          ৳{pkg.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">BDT</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* STEP 3: PAYMENT METHOD */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow">
              ৩
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                {language === 'bn' ? 'পেমেন্ট মেথড সিলেক্ট করুন' : 'Select Payment Gateway'}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? 'যেকোনো অটোমেটেড বা ম্যানুয়াল মাধ্যমে পেমেন্ট করতে পারেন' : 'Pay via Tokenized Checkout or Manual Gateway'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* FF Wallet Gateway */}
            <div
              onClick={() => setSelectedMethod('wallet')}
              className={`cursor-pointer rounded-2xl p-4 border transition-all relative ${
                selectedMethod === 'wallet'
                  ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-xs shadow">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-400">FF Wallet</h4>
                    <span className="text-[10px] text-amber-400 font-medium">● 1-Click Fast</span>
                  </div>
                </div>
                {selectedMethod === 'wallet' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                )}
              </div>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? 'ওয়ালেট ব্যালেন্স থেকে ১-ক্লিকে তাৎক্ষণিক পেমেন্ট' : 'Fast 1-click digital wallet checkout'}
              </p>
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{language === 'bn' ? 'ব্যালেন্স:' : 'Balance:'}</span>
                <span className="text-xs font-mono font-bold text-emerald-300">
                  ৳{currentUser?.walletBalance ?? 0}
                </span>
              </div>
              <div className="mt-2">
                {currentUser ? (
                  (currentUser.walletBalance ?? 0) >= (selectedPackage?.price || 0) ? (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded font-semibold inline-block">
                      {language === 'bn' ? '✓ পর্যাপ্ত ব্যালেন্স আছে' : '✓ Sufficient Balance'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenWallet) onOpenWallet();
                      }}
                      className="text-[10px] bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-2 py-0.5 rounded font-semibold transition-colors"
                    >
                      {language === 'bn' ? '+ টাকা রিচার্জ করুন' : '+ Top Up Balance'}
                    </button>
                  )
                ) : (
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                    {language === 'bn' ? 'লগইন প্রয়োজন' : 'Login needed'}
                  </span>
                )}
              </div>
            </div>

            {/* bKash Gateway */}
            <div
              onClick={() => setSelectedMethod('bkash')}
              className={`cursor-pointer rounded-2xl p-4 border transition-all relative ${
                selectedMethod === 'bkash'
                  ? 'bg-gradient-to-br from-pink-950/40 via-slate-900 to-slate-950 border-pink-500 ring-2 ring-pink-500/30 shadow-lg shadow-pink-500/10'
                  : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-pink-600 flex items-center justify-center text-white font-black text-xs">
                    bK
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-pink-400">bKash</h4>
                    <span className="text-[10px] text-emerald-400 font-medium">● Tokenized Auto</span>
                  </div>
                </div>
                {selectedMethod === 'bkash' && (
                  <CheckCircle2 className="w-5 h-5 text-pink-400" />
                )}
              </div>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? 'বিকাশ অটোমেটিক পেমেন্ট (১ মিনিটে ডেলিভারি)' : 'Automated Tokenized Checkout'}
              </p>
              <div className="mt-2 text-[10px] bg-pink-500/10 text-pink-300 px-2 py-0.5 rounded inline-block">
                {gatewaySettings.bkash.isSandbox ? 'Sandbox / Live Ready' : 'Instant Checkout'}
              </div>
            </div>

            {/* Nagad Gateway */}
            <div
              onClick={() => setSelectedMethod('nagad')}
              className={`cursor-pointer rounded-2xl p-4 border transition-all relative ${
                selectedMethod === 'nagad'
                  ? 'bg-gradient-to-br from-orange-950/40 via-slate-900 to-slate-950 border-orange-500 ring-2 ring-orange-500/30 shadow-lg shadow-orange-500/10'
                  : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-xs">
                    নগদ
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-orange-400">Nagad</h4>
                    <span className="text-[10px] text-emerald-400 font-medium">● Gateway Auto</span>
                  </div>
                </div>
                {selectedMethod === 'nagad' && (
                  <CheckCircle2 className="w-5 h-5 text-orange-400" />
                )}
              </div>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? 'নগদ অটো পেমেন্ট ও ভেরিফিকেশন' : 'Direct Nagad Gateway'}
              </p>
              <div className="mt-2 text-[10px] bg-orange-500/10 text-orange-300 px-2 py-0.5 rounded inline-block">
                Fast & Secure
              </div>
            </div>

            {/* Rocket / Manual Gateway */}
            <div
              onClick={() => setSelectedMethod('rocket')}
              className={`cursor-pointer rounded-2xl p-4 border transition-all relative ${
                selectedMethod === 'rocket'
                  ? 'bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-950 border-purple-500 ring-2 ring-purple-500/30 shadow-lg shadow-purple-500/10'
                  : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-black text-xs">
                    R
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-purple-400">Rocket / Upay</h4>
                    <span className="text-[10px] text-amber-400 font-medium">● Manual TrxID</span>
                  </div>
                </div>
                {selectedMethod === 'rocket' && (
                  <CheckCircle2 className="w-5 h-5 text-purple-400" />
                )}
              </div>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? 'ম্যানুয়াল সেন্ড মানি ও TrxID প্রদান' : 'Send Money & provide TrxID'}
              </p>
              <div className="mt-2 text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded inline-block">
                Manual Verification
              </div>
            </div>
          </div>
        </section>

        {/* STEP 4: CONTACT & CHECKOUT SUMMARY */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow">
              ৪
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {language === 'bn' ? 'যোগাযোগ ও চূড়ান্ত টপ-আপ' : 'Contact & Confirmation'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Phone input */}
            <div className="md:col-span-6 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {language === 'bn' ? 'আপনার মোবাইল / WhatsApp নম্বর (SMS আপডেটের জন্য)' : 'Phone / WhatsApp Number'}
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 font-mono text-base focus:outline-none focus:border-amber-500 transition-colors"
                  required
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-950 border-slate-700"
                />
                <label htmlFor="terms" className="cursor-pointer">
                  {language === 'bn'
                    ? 'আমি নিশ্চিত যে ফ্রি ফায়ার প্লেয়ার আইডি (UID) সঠিকভাবে দিয়েছি।'
                    : 'I confirm that the Player UID entered is completely accurate.'}
                </label>
              </div>
            </div>

            {/* Total breakdown card */}
            <div className="md:col-span-6 bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>{language === 'bn' ? 'আইডি (UID):' : 'Player ID:'}</span>
                <span className="font-mono text-slate-200">{playerId || '---'}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>{language === 'bn' ? 'প্লেয়ার নাম:' : 'Nickname:'}</span>
                <span className="text-emerald-400 font-semibold">{playerNickname}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>{language === 'bn' ? 'নির্বাচিত প্যাকেজ:' : 'Selected Package:'}</span>
                <span className="text-white font-medium">
                  {selectedPackage ? (language === 'bn' ? selectedPackage.nameBn : selectedPackage.name) : '---'}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>{language === 'bn' ? 'পেমেন্ট মাধ্যম:' : 'Payment Method:'}</span>
                <span className="capitalize font-semibold text-amber-400">
                  {selectedMethod === 'wallet' ? 'FF Wallet' : selectedMethod}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-sm font-bold text-white">
                  {language === 'bn' ? 'সর্বমোট প্রদেয় বিল:' : 'Total Payable:'}
                </span>
                <span className="text-2xl font-black text-amber-400 font-mono">
                  ৳{selectedPackage ? selectedPackage.price : 0}
                </span>
              </div>

              <button
                type="submit"
                disabled={currentUser?.role === 'admin' || !selectedPackage || !agreeTerms}
                className="w-full mt-3 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 disabled:opacity-50 text-slate-950 font-black py-3.5 px-6 rounded-xl shadow-lg shadow-amber-500/20 text-sm sm:text-base flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:cursor-not-allowed"
              >
                {currentUser?.role === 'admin' ? (
                  <span className="text-rose-950 font-black">
                    {language === 'bn'
                      ? '🚫 অ্যাডমিন অ্যাকাউন্ট দিয়ে অর্ডার নিষিদ্ধ'
                      : '🚫 Admin Order Restricted'}
                  </span>
                ) : (
                  <>
                    <span>
                      {selectedMethod === 'wallet'
                        ? (language === 'bn' ? `ওয়ালেট থেকে পে করুন (৳${selectedPackage?.price || 0})` : `Pay via Wallet (৳${selectedPackage?.price || 0})`)
                        : (language === 'bn' ? `টপ-আপ করুন (Pay ৳${selectedPackage?.price || 0})` : `Proceed to Pay (৳${selectedPackage?.price || 0})`)}
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
};
