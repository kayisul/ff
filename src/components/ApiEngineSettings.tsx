import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopUpApiProvider } from '../types';
import { 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Settings, 
  ShieldCheck, 
  Activity, 
  RefreshCw, 
  Play, 
  Send, 
  Copy, 
  Check, 
  ToggleLeft, 
  ToggleRight, 
  Eye, 
  EyeOff, 
  Smartphone, 
  Plus, 
  Search, 
  ArrowUpRight, 
  Terminal,
  Layers,
  Sparkles,
  Sliders,
  DollarSign
} from 'lucide-react';

export const ApiEngineSettings: React.FC = () => {
  const {
    gatewaySettings,
    setActiveTopUpApi,
    updateAutoShellConfig,
    updateUniPinConfig,
    toggleLatestOrdersButton,
    apiDispatchLogs,
    dispatchAutoTopUp,
    testApiConnection,
    orders,
    language,
    addToast
  } = useApp();

  const [testUid, setTestUid] = useState<string>('1948204918');
  const [testProvider, setTestProvider] = useState<'auto_shell' | 'unipin'>('auto_shell');
  const [testingApi, setTestingApi] = useState<boolean>(false);
  const [apiTestResult, setApiTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs: number;
    nickname?: string;
  } | null>(null);

  // Secret visibility
  const [showShellKey, setShowShellKey] = useState<boolean>(false);
  const [showUniPinSecret, setShowUniPinSecret] = useState<boolean>(false);

  // Shell recharge modal
  const [shellRechargeAmount, setShellRechargeAmount] = useState<number>(1000);
  const [showShellRecharge, setShowShellRecharge] = useState<boolean>(false);

  // UniPin recharge modal
  const [uniPinRechargeAmount, setUniPinRechargeAmount] = useState<number>(5000);
  const [showUniPinRecharge, setShowUniPinRecharge] = useState<boolean>(false);

  // Re-dispatching state
  const [redispatchingId, setRedispatchingId] = useState<string | null>(null);

  const activeApi = gatewaySettings.activeTopUpApi || 'auto_shell';
  const showOrdersBtn = gatewaySettings.showLatestOrdersButton ?? true;

  const handleRunTest = async () => {
    if (!testUid.trim()) {
      addToast(language === 'bn' ? 'দয়া করে একটি প্লেয়ার UID লিখুন' : 'Please enter a player UID', 'error');
      return;
    }
    setTestingApi(true);
    setApiTestResult(null);
    try {
      const res = await testApiConnection(testProvider, testUid.trim());
      setApiTestResult(res);
      if (res.success) {
        addToast(
          language === 'bn' 
            ? `✅ ${testProvider === 'auto_shell' ? 'Auto Shell' : 'UniPin'} এপিআই পিং সফল! প্লেয়ার: ${res.nickname}`
            : `✅ API ping successful! Player: ${res.nickname}`,
          'success'
        );
      } else {
        addToast(res.message, 'error');
      }
    } finally {
      setTestingApi(false);
    }
  };

  const handleAddShells = (amount: number) => {
    const cur = gatewaySettings.autoShell?.currentShellBalance || 0;
    const newBal = cur + amount;
    updateAutoShellConfig({ currentShellBalance: newBal });
    setShowShellRecharge(false);
    addToast(
      language === 'bn'
        ? `✅ +${amount.toLocaleString()} গ্যারিনা শেল রিচার্জ সম্পন্ন! নতুন ব্যালেন্স: ${newBal.toLocaleString()} Shells`
        : `✅ +${amount.toLocaleString()} Garena Shells added! New balance: ${newBal.toLocaleString()} Shells`,
      'success'
    );
  };

  const handleAddUniPinBalance = (amount: number) => {
    const cur = gatewaySettings.unipin?.currentBalance || 0;
    const newBal = cur + amount;
    updateUniPinConfig({ currentBalance: newBal });
    setShowUniPinRecharge(false);
    addToast(
      language === 'bn'
        ? `✅ +৳${amount.toLocaleString()} ইউনিপিন ক্রেডিট যোগ হয়েছে! নতুন ব্যালেন্স: ৳${newBal.toLocaleString()}`
        : `✅ +৳${amount.toLocaleString()} UniPin credit added! New balance: ৳${newBal.toLocaleString()}`,
      'success'
    );
  };

  const handleRedispatch = async (orderId?: string, orderNumber?: string) => {
    let targetId = orderId;
    if (!targetId && orderNumber) {
      const match = orders.find((o) => o.orderNumber === orderNumber);
      if (match) targetId = match.id;
    }
    if (!targetId) {
      addToast(language === 'bn' ? 'অর্ডার পাওয়া যায়নি' : 'Order not found', 'error');
      return;
    }
    setRedispatchingId(targetId);
    try {
      await dispatchAutoTopUp(targetId);
    } finally {
      setRedispatchingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Highlight Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-emerald-500/10 border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                AUTO TOP-UP DISPATCH ENGINE
              </span>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {activeApi === 'auto_shell' ? 'Garena Auto Shell সক্রিয়' : activeApi === 'unipin' ? 'UniPin Direct API সক্রিয়' : 'ম্যানুয়াল মোড সক্রিয়'}
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {language === 'bn' 
                ? '⚡ অটো শেল ও ইউনিপিন এপিআই কন্ট্রোলার' 
                : '⚡ Auto Shell & UniPin API Engine Controller'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {language === 'bn'
                ? 'অ্যাডমিন থেকে যেকোনো সময় আপনি Auto Shell অথবা UniPin বেছে নিতে পারেন। গ্রাহক অর্ডার পেমেন্ট করার সাথে সাথেই সক্রিয় এপিআই দিয়ে প্লেয়ার UID-তে স্বয়ংক্রিয়ভাবে ডায়মন্ড ইনজেক্ট হয়ে যাবে।'
                : 'Select between Auto Shell or UniPin anytime. Paid customer orders will be automatically injected with diamonds into their Free Fire Player UID.'}
            </p>
          </div>

          {/* Quick Engine Selector Pill */}
          <div className="bg-slate-950/90 border border-slate-800 p-2 rounded-2xl flex flex-col sm:flex-row items-center gap-2 shrink-0 shadow-lg">
            <span className="text-[11px] text-slate-400 font-semibold px-2">সক্রিয় করুন:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTopUpApi('auto_shell')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeApi === 'auto_shell'
                    ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Auto Shell</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTopUpApi('unipin')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeApi === 'unipin'
                    ? 'bg-emerald-500 text-slate-950 shadow-md scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>UniPin</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTopUpApi('manual')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeApi === 'manual'
                    ? 'bg-slate-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>ম্যানুয়াল</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: LATEST ORDERS BUTTON CONTROLLER (USER EXPLICIT REQUEST) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Sliders className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {language === 'bn' 
                  ? '🌐 নেভবার বাটন কন্ট্রোল: "সর্বশেষ অর্ডার"' 
                  : '🌐 Navbar Button Control: "Latest Orders"'}
              </h3>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                showOrdersBtn 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
              }`}>
                {showOrdersBtn ? (language === 'bn' ? 'চালু (সবার জন্য দৃশ্যমান)' : 'Active (Visible)') : (language === 'bn' ? 'বন্ধ (লুকানো)' : 'Inactive (Hidden)')}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'bn'
                ? 'আপনার রিকুয়েস্ট অনুযায়ী, ওয়েবসাইটের হেডারে যে "সর্বশেষ অর্ডার" বাটনটি রয়েছে তা আপনি যেকোনো সময় এখান থেকে চালু বা বন্ধ করে রাখতে পারেন। অফ করে দিলে সাধারণ গ্রাহকরা মেনুতে এই বাটনটি দেখতে পাবে না।'
                : 'As requested, you can toggle the "Latest Orders" button in the public header on or off anytime. When turned off, regular visitors will not see the button in the navigation bar.'}
            </p>

            {/* Visual simulation preview of customer navbar */}
            <div className="mt-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3">
              <span className="text-[11px] text-slate-400 font-semibold shrink-0">গ্রাহক প্রিভিউ:</span>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 border border-slate-800">প্যাকেজসমূহ</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 border border-slate-800">অর্ডার ট্র্যাক</span>
                {showOrdersBtn ? (
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1.5 animate-pulse">
                    <span>🛍️ সর্বশেষ অর্ডার</span>
                    <span className="text-[9px] bg-emerald-500 text-slate-950 px-1 py-0.2 rounded font-black">ON</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-red-950/40 text-red-400 border border-red-800/40 line-through text-[11px] italic">
                    [সর্বশেষ অর্ডার লুকানো]
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Toggle Action Button */}
          <div className="flex flex-col items-center sm:items-end gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => toggleLatestOrdersButton(!showOrdersBtn)}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-lg ${
                showOrdersBtn
                  ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40'
                  : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
              }`}
            >
              {showOrdersBtn ? (
                <>
                  <ToggleRight className="w-6 h-6 text-rose-400" />
                  <span>{language === 'bn' ? 'বাটনটি বন্ধ করুন (Hide Button)' : 'Turn OFF Button'}</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-6 h-6 text-slate-950" />
                  <span>{language === 'bn' ? 'বাটনটি চালু করুন (Show Button)' : 'Turn ON Button'}</span>
                </>
              )}
            </button>
            <span className="text-[11px] text-slate-400 text-center sm:text-right">
              {showOrdersBtn ? 'গ্রাহকরা এখন হেডার মেনুতে বাটনটি দেখতে পাচ্ছেন' : 'গ্রাহক মেনুতে বাটনটি এখন দেখা যাচ্ছে না'}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: DUAL API PROVIDER CARDS (AUTO SHELL & UNIPIN) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 1: GARENA AUTO SHELL */}
        <div className={`rounded-3xl p-6 transition-all border ${
          activeApi === 'auto_shell'
            ? 'bg-gradient-to-b from-amber-950/30 via-slate-900 to-slate-900 border-amber-500/50 shadow-2xl ring-1 ring-amber-500/30'
            : 'bg-slate-900/80 border-slate-800'
        }`}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                <Zap className="w-6 h-6 fill-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">Garena Auto Shell API</h3>
                  {activeApi === 'auto_shell' && (
                    <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                      সক্রিয় এপিআই
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">অটোমেটিক গ্যারিনা শেল রিডিম ও UID ইনজেকশন</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTopUpApi('auto_shell')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeApi === 'auto_shell'
                  ? 'bg-amber-500 text-slate-950 cursor-default'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {activeApi === 'auto_shell' ? '✓ রানিং' : 'সক্রিয় করুন'}
            </button>
          </div>

          {/* Shell Balance Display */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 mb-5 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">মজুদ গ্যারিনা শেল (Shell Balance):</span>
              <span className="text-2xl font-mono font-black text-amber-400 flex items-center gap-1.5 mt-0.5">
                {(gatewaySettings.autoShell?.currentShellBalance || 0).toLocaleString()}
                <span className="text-xs text-slate-400 font-normal">Shells</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleAddShells(500)}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 transition-colors"
                title="+500 শেল যোগ করুন"
              >
                +500
              </button>
              <button
                type="button"
                onClick={() => handleAddShells(1000)}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 transition-colors"
                title="+1000 শেল যোগ করুন"
              >
                +1,000
              </button>
              <button
                type="button"
                onClick={() => setShowShellRecharge(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>রিচার্জ</span>
              </button>
            </div>
          </div>

          {/* Configuration Inputs */}
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">রিসেলার ইউজারনেম:</label>
                <input
                  type="text"
                  value={gatewaySettings.autoShell?.username || ''}
                  onChange={(e) => updateAutoShellConfig({ username: e.target.value })}
                  placeholder="BD_SHELL_PARTNER_01"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">অঞ্চল (Region):</label>
                <select
                  value={gatewaySettings.autoShell?.region || 'BD'}
                  onChange={(e) => updateAutoShellConfig({ region: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold focus:border-amber-500 outline-none"
                >
                  <option value="BD">BD (Bangladesh)</option>
                  <option value="MY">MY (Malaysia)</option>
                  <option value="SG">SG (Singapore)</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-400 font-semibold">Garena Secret API Key / Token:</label>
                <button
                  type="button"
                  onClick={() => setShowShellKey(!showShellKey)}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  {showShellKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showShellKey ? 'হাইড' : 'দেখান'}</span>
                </button>
              </div>
              <input
                type={showShellKey ? 'text' : 'password'}
                value={gatewaySettings.autoShell?.apiKey || ''}
                onChange={(e) => updateAutoShellConfig({ apiKey: e.target.value })}
                placeholder="GAR_SHL_SEC_98174..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 outline-none"
              />
            </div>

            {/* Conversion quick info */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300 block">📊 শেল কনভার্সন রুলস (Auto Conversion):</span>
              <div className="grid grid-cols-2 gap-x-2 text-[10px]">
                <span>• 25 💎 = 13 Shells</span>
                <span>• 115 💎 = 50 Shells</span>
                <span>• 240 💎 = 100 Shells</span>
                <span>• 610 💎 = 260 Shells</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: UNIPIN DIRECT API */}
        <div className={`rounded-3xl p-6 transition-all border ${
          activeApi === 'unipin'
            ? 'bg-gradient-to-b from-emerald-950/30 via-slate-900 to-slate-900 border-emerald-500/50 shadow-2xl ring-1 ring-emerald-500/30'
            : 'bg-slate-900/80 border-slate-800'
        }`}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                <Sparkles className="w-6 h-6 fill-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">UniPin Direct Top-Up API</h3>
                  {activeApi === 'unipin' && (
                    <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                      সক্রিয় এপিআই
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">ইউনিপিন এক্সপ্রেস পার্টনার গেটওয়ে ডিরেক্ট UID ডেলিভারি</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTopUpApi('unipin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeApi === 'unipin'
                  ? 'bg-emerald-500 text-slate-950 cursor-default'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {activeApi === 'unipin' ? '✓ রানিং' : 'সক্রিয় করুন'}
            </button>
          </div>

          {/* UniPin Balance Display */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 mb-5 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">ইউনিপিন পার্টনার ব্যালেন্স (BDT Balance):</span>
              <span className="text-2xl font-mono font-black text-emerald-400 flex items-center gap-1.5 mt-0.5">
                ৳{(gatewaySettings.unipin?.currentBalance || 0).toLocaleString()}
                <span className="text-xs text-slate-400 font-normal">BDT</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleAddUniPinBalance(1000)}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition-colors"
                title="+৳1,000 যোগ করুন"
              >
                +1K
              </button>
              <button
                type="button"
                onClick={() => handleAddUniPinBalance(5000)}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/40 transition-colors"
                title="+৳5,000 যোগ করুন"
              >
                +5K
              </button>
              <button
                type="button"
                onClick={() => setShowUniPinRecharge(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>রিচার্জ</span>
              </button>
            </div>
          </div>

          {/* Configuration Inputs */}
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">পার্টনার মার্চেন্ট আইডি:</label>
                <input
                  type="text"
                  value={gatewaySettings.unipin?.partnerId || ''}
                  onChange={(e) => updateUniPinConfig({ partnerId: e.target.value })}
                  placeholder="UNIPIN_BD_EXPRESS_99"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">মুদ্রা (Currency):</label>
                <input
                  type="text"
                  value={gatewaySettings.unipin?.currency || 'BDT'}
                  disabled
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 font-semibold outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-400 font-semibold">UniPin Secret Key (Signature):</label>
                <button
                  type="button"
                  onClick={() => setShowUniPinSecret(!showUniPinSecret)}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  {showUniPinSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showUniPinSecret ? 'হাইড' : 'দেখান'}</span>
                </button>
              </div>
              <input
                type={showUniPinSecret ? 'text' : 'password'}
                value={gatewaySettings.unipin?.secretKey || ''}
                onChange={(e) => updateUniPinConfig({ secretKey: e.target.value })}
                placeholder="UP_SEC_928174981..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-500 outline-none"
              />
            </div>

            {/* Direct Express info */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300 block">⚡ ইউনিপিন এক্সপ্রেস সুবিধা:</span>
              <div className="text-[10px] space-y-0.5">
                <p>• প্লেয়ার আইডি দিলে সরাসরি গেমে ডায়মন্ড ও মেম্বারশিপ টপ-আপ ইনজেক্ট হয়।</p>
                <p>• প্রতিটি সফল লেনদেনে পার্টনার ব্যালেন্স থেকে পাইকারি রেটে টাকা কাটা হয়।</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: INTERACTIVE UID TEST BENCH */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-500/20 text-amber-400">
                <Activity className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {language === 'bn' ? '🧪 লাইভ প্লেয়ার UID ও এপিআই টেস্ট টুল' : '🧪 Live Player UID & API Test Bench'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              যেকোনো ফ্রি ফায়ার প্লেয়ার UID দিয়ে এপিআই রেসপন্স, সার্ভার লেটেন্সি এবং নিকনেম ভ্যালিডেশন টেস্ট করুন।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTestProvider('auto_shell')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                testProvider === 'auto_shell'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Test with Auto Shell
            </button>
            <button
              type="button"
              onClick={() => setTestProvider('unipin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                testProvider === 'unipin'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Test with UniPin
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={testUid}
              onChange={(e) => setTestUid(e.target.value)}
              placeholder="যেমনঃ 1948204918"
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleRunTest}
            disabled={testingApi}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {testingApi ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>টেস্ট কল চলছে...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>টেস্ট এপিআই কল পাঠান</span>
              </>
            )}
          </button>
        </div>

        {/* Test Result Card */}
        {apiTestResult && (
          <div className={`p-4 rounded-2xl border transition-all ${
            apiTestResult.success
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                {apiTestResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-sm font-bold flex items-center gap-2">
                    <span>{apiTestResult.message}</span>
                    <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                      {apiTestResult.latencyMs}ms
                    </span>
                  </div>
                  {apiTestResult.nickname && (
                    <div className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                      <span>ভেরিফায়েড প্লেয়ার নিকনেম:</span>
                      <span className="font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {apiTestResult.nickname}
                      </span>
                    </div>
                  )}
                  <div className="text-[11px] text-slate-400 font-mono mt-2">
                    HTTP 200 OK • Provider: {testProvider === 'auto_shell' ? 'Garena Auto Shell' : 'UniPin Express'} • Handshake Verified
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: REALTIME AUTO-DISPATCH LOGS TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-blue-500/20 text-blue-400">
                <Terminal className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {language === 'bn' ? '📋 অটো টপ-আপ ডিসপ্যাচ হিস্ট্রি ও লগ্স' : '📋 Auto Top-Up Dispatch History & Logs'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              সক্রিয় এপিআই দিয়ে প্লেয়ার UID-তে স্বয়ংক্রিয়ভাবে পাঠানো সমস্ত ডায়মন্ড অর্ডারের রিয়েলটাইম রেকর্ড।
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400">
            মোট সফল ডিসপ্যাচ: <span className="text-emerald-400 font-bold">{apiDispatchLogs.filter(l => l.status === 'success').length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <th className="p-3.5 font-semibold">অর্ডার নং</th>
                <th className="p-3.5 font-semibold">প্লেয়ার UID</th>
                <th className="p-3.5 font-semibold">ডায়মন্ড</th>
                <th className="p-3.5 font-semibold">এপিআই প্রোভাইডার</th>
                <th className="p-3.5 font-semibold">খরচ</th>
                <th className="p-3.5 font-semibold">রেফারেন্স ID</th>
                <th className="p-3.5 font-semibold">স্ট্যাটাস</th>
                <th className="p-3.5 font-semibold">সময়</th>
                <th className="p-3.5 font-semibold text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {apiDispatchLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    এখনও কোনো অটো টপ-আপ ডিসপ্যাচ লগ রেকর্ড নেই। নতুন পেইড অর্ডার আসলে স্বয়ংক্রিয়ভাবে এখানে যুক্ত হবে।
                  </td>
                </tr>
              ) : (
                apiDispatchLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-amber-400">
                      {log.orderNumber}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-white">
                      {log.playerId}
                    </td>
                    <td className="p-3.5 font-bold text-amber-400">
                      {log.diamonds} 💎
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        log.provider === 'auto_shell'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {log.provider === 'auto_shell' ? 'Auto Shell' : 'UniPin'}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-300">
                      {log.costInShells ? `${log.costInShells} Shells` : `৳${log.costInBdt || 0}`}
                    </td>
                    <td className="p-3.5 font-mono text-slate-400 text-[11px]">
                      {log.apiTransactionId}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        log.status === 'success'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      }`}>
                        {log.status === 'success' ? 'সফল (Success)' : 'ব্যর্থ'}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleRedispatch(log.orderId, log.orderNumber)}
                        disabled={Boolean(redispatchingId && (redispatchingId === log.orderId || redispatchingId === log.id))}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors disabled:opacity-50"
                        title="পুনরায় এপিআই কল পাঠান"
                      >
                        {redispatchingId === log.orderId ? 'পাঠানো হচ্ছে...' : 'পুনরায় পাঠান'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECHARGE SHELL MODAL */}
      {showShellRecharge && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>গ্যারিনা শেল অ্যাকাউন্ট রিচার্জ</span>
            </h3>
            <p className="text-xs text-slate-300">
              আপনার রিসেলার শেল ব্যালেন্সে নতুন শেল যুক্ত করুন যাতে ডায়মন্ড ডেলিভারিতে কোনো ঘাটতি না হয়।
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">শেলের সংখ্যা (Shell Amount):</label>
              <input
                type="number"
                min="50"
                step="50"
                value={shellRechargeAmount}
                onChange={(e) => setShellRechargeAmount(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none"
              />
            </div>

            <div className="flex gap-2">
              {[500, 1000, 2500, 5000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setShellRechargeAmount(amt)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    shellRechargeAmount === amt
                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  +{amt}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowShellRecharge(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => handleAddShells(shellRechargeAmount)}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
              >
                রিচার্জ নিশ্চিত করুন (+{shellRechargeAmount})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECHARGE UNIPIN MODAL */}
      {showUniPinRecharge && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400 fill-emerald-400" />
              <span>ইউনিপিন পার্টনার ক্রেডিট রিচার্জ</span>
            </h3>
            <p className="text-xs text-slate-300">
              আপনার UniPin Express মার্চেন্ট ব্যালেন্সে ফান্ড যোগ করুন।
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">টাকার পরিমাণ (BDT Amount):</label>
              <input
                type="number"
                min="100"
                step="100"
                value={uniPinRechargeAmount}
                onChange={(e) => setUniPinRechargeAmount(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none"
              />
            </div>

            <div className="flex gap-2">
              {[1000, 3000, 5000, 10000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setUniPinRechargeAmount(amt)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    uniPinRechargeAmount === amt
                      ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  +৳{amt >= 1000 ? `${amt / 1000}k` : amt}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowUniPinRecharge(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => handleAddUniPinBalance(uniPinRechargeAmount)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
              >
                রিচার্জ নিশ্চিত করুন (+৳{uniPinRechargeAmount})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
