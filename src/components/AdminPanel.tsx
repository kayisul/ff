import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Order, Category, GatewaySettings, User, TopUpApiProvider } from '../types';
import { INITIAL_GATEWAY_SETTINGS } from '../data/initialData';
import { 
  ShieldCheck, 
  Package as PackageIcon, 
  ShoppingBag, 
  Settings, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Check, 
  Copy, 
  Terminal,
  Search,
  Eye,
  EyeOff,
  RotateCcw,
  Download,
  Key,
  Smartphone,
  CheckCheck,
  Wallet,
  ShieldAlert,
  ArrowDownLeft,
  ArrowUpRight,
  User as UserIcon,
  Zap,
  ToggleLeft,
  ToggleRight,
  Cpu,
  Activity,
  RefreshCw,
  Play,
  Send,
  Sliders,
  Sparkles
} from 'lucide-react';
import { ApiEngineSettings } from './ApiEngineSettings';

export const AdminPanel: React.FC = () => {
  const { 
    packages, 
    orders, 
    users,
    walletTransactions,
    adjustUserWallet,
    updateOrderStatus, 
    deleteOrder, 
    addPackage, 
    updatePackage, 
    deletePackage, 
    gatewaySettings, 
    updateGatewaySettings,
    toggleLatestOrdersButton,
    apiDispatchLogs,
    setActiveTopUpApi,
    updateAutoShellConfig,
    updateUniPinConfig,
    dispatchAutoTopUp,
    testApiConnection,
    language,
    currentUser,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'packages' | 'gateways' | 'apiEngine' | 'wallets' | 'apiDocs'>('apiEngine');

  // Auto Top-Up API Engine state
  const [testUid, setTestUid] = useState<string>('1948204918');
  const [testingApi, setTestingApi] = useState<boolean>(false);
  const [apiTestResult, setApiTestResult] = useState<{ success: boolean; message: string; latencyMs: number; nickname?: string } | null>(null);
  const [testProvider, setTestProvider] = useState<'auto_shell' | 'unipin'>('auto_shell');
  const [dispatchingOrderId, setDispatchingOrderId] = useState<string | null>(null);

  // Shell & UniPin quick recharge state
  const [showShellModal, setShowShellModal] = useState<boolean>(false);
  const [shellAmountToAdd, setShellAmountToAdd] = useState<number>(500);
  const [showUniPinModal, setShowUniPinModal] = useState<boolean>(false);
  const [uniPinAmountToAdd, setUniPinAmountToAdd] = useState<number>(1000);

  // Wallet management state
  const [walletSearch, setWalletSearch] = useState<string>('');
  const [adjustingUser, setAdjustingUser] = useState<User | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(100);
  const [adjustType, setAdjustType] = useState<'credit' | 'debit'>('credit');
  const [adjustReason, setAdjustReason] = useState<string>('Admin Manual Top-up');

  // Order filters
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Package editing state
  const [showAddPackageModal, setShowAddPackageModal] = useState<boolean>(false);
  const [newPackage, setNewPackage] = useState<Omit<Package, 'id'>>({
    name: '150 Diamonds',
    nameBn: '১৫০ ডায়মন্ড',
    diamonds: 150,
    bonusDiamonds: 20,
    price: 110,
    originalPrice: 125,
    category: 'diamonds',
    badge: 'New',
    popular: false,
    inStock: true,
    description: 'Instant delivery in 1-3 mins'
  });

  // Gateway form state
  const [gatewayForm, setGatewayForm] = useState<GatewaySettings>(gatewaySettings);
  const [copiedEnv, setCopiedEnv] = useState<boolean>(false);
  const [showBkashSecret, setShowBkashSecret] = useState<boolean>(false);
  const [showBkashPassword, setShowBkashPassword] = useState<boolean>(false);

  // Connection test states
  const [testingBkash, setTestingBkash] = useState<boolean>(false);
  const [bkashTestResult, setBkashTestResult] = useState<string | null>(null);
  const [testingNagad, setTestingNagad] = useState<boolean>(false);
  const [nagadTestResult, setNagadTestResult] = useState<string | null>(null);

  // Custom Env Variable input state
  const [newEnvKey, setNewEnvKey] = useState<string>('');
  const [newEnvVal, setNewEnvVal] = useState<string>('');
  const [newEnvDesc, setNewEnvDesc] = useState<string>('');

  // Keep gatewayForm in sync if context updates
  useEffect(() => {
    setGatewayForm(gatewaySettings);
  }, [gatewaySettings]);

  // Statistics calculation
  const totalRevenue = orders
    .filter((o) => o.orderStatus === 'completed' || o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.price, 0);

  const totalDiamonds = orders
    .filter((o) => o.orderStatus === 'completed')
    .reduce((sum, o) => sum + o.diamonds, 0);

  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'processing').length;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.playerId.includes(orderSearch) ||
      (order.trxId && order.trxId.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (order.playerNickname && order.playerNickname.toLowerCase().includes(orderSearch.toLowerCase()));

    if (!matchesSearch) return false;
    if (orderStatusFilter === 'all') return true;
    return order.orderStatus === orderStatusFilter;
  });

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    addPackage(newPackage);
    setShowAddPackageModal(false);
  };

  const handleSaveGateways = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateGatewaySettings(gatewayForm);
    addToast(
      language === 'bn' 
        ? '✅ বিকাশ, নগদ ও সমস্ত এনভায়রনমেন্ট ভেরিয়েবল সফলভাবে সেভ ও আপডেট হয়েছে!' 
        : '✅ bKash, Nagad & Environment Variables saved successfully!',
      'success'
    );
  };

  const handleResetToDefaults = () => {
    if (window.confirm(language === 'bn' ? 'আপনি কি সব এনভায়রনমেন্ট ভেরিয়েবল ডিফল্ট অবস্থায় রিস্টোর করতে চান?' : 'Restore default environment variables?')) {
      setGatewayForm(INITIAL_GATEWAY_SETTINGS);
      updateGatewaySettings(INITIAL_GATEWAY_SETTINGS);
      addToast(
        language === 'bn' ? '🔄 ডিফল্ট এনভায়রনমেন্ট ভেরিয়েবল রিস্টোর করা হয়েছে!' : '🔄 Environment variables restored to defaults!',
        'info'
      );
    }
  };

  // 1-Click Preset appliers
  const setBkashPreset = (mode: 'sandbox' | 'live') => {
    if (mode === 'sandbox') {
      setGatewayForm({
        ...gatewayForm,
        bkash: {
          ...gatewayForm.bkash,
          isSandbox: true,
          baseUrl: 'https://tokenized.sandbox.bka.sh/v1.2.0-beta',
          username: gatewayForm.bkash.username || 'sandboxTokenizedUser02',
          password: gatewayForm.bkash.password || 'sandboxTokenizedPassword02@'
        }
      });
      addToast('🧪 bKash Sandbox URL কনফিগার করা হয়েছে', 'info');
    } else {
      setGatewayForm({
        ...gatewayForm,
        bkash: {
          ...gatewayForm.bkash,
          isSandbox: false,
          baseUrl: 'https://tokenized.pay.bka.sh/v1.2.0-beta'
        }
      });
      addToast('🚀 bKash Live Production URL কনফিগার করা হয়েছে', 'info');
    }
  };

  const setNagadPreset = (mode: 'sandbox' | 'live') => {
    if (mode === 'sandbox') {
      setGatewayForm({
        ...gatewayForm,
        nagad: {
          ...gatewayForm.nagad,
          isSandbox: true,
          baseUrl: 'http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0'
        }
      });
      addToast('🧪 Nagad Sandbox URL কনফিগার করা হয়েছে', 'info');
    } else {
      setGatewayForm({
        ...gatewayForm,
        nagad: {
          ...gatewayForm.nagad,
          isSandbox: false,
          baseUrl: 'http://api.mynagad.com:10080/remote-payment-gateway-1.0'
        }
      });
      addToast('🚀 Nagad Live Production URL কনফিগার করা হয়েছে', 'info');
    }
  };

  // Test simulation routines
  const handleTestBkashConnection = () => {
    setTestingBkash(true);
    setBkashTestResult(null);
    setTimeout(() => {
      setTestingBkash(false);
      if (!gatewayForm.bkash.appKey || !gatewayForm.bkash.appSecret) {
        setBkashTestResult('❌ App Key অথবা App Secret ফাঁকা রয়েছে!');
      } else {
        setBkashTestResult(`✅ কানেকশন সফল! Token Granted (Mode: ${gatewayForm.bkash.isSandbox ? 'Sandbox' : 'Live'})`);
      }
    }, 1200);
  };

  const handleTestNagadConnection = () => {
    setTestingNagad(true);
    setNagadTestResult(null);
    setTimeout(() => {
      setTestingNagad(false);
      if (!gatewayForm.nagad.merchantId) {
        setNagadTestResult('❌ Merchant ID ফাঁকা রয়েছে!');
      } else {
        setNagadTestResult(`✅ নগদ গেটওয়ে রেডি! RSA কী-পেয়ার ভ্যালিড (Mode: ${gatewayForm.nagad.isSandbox ? 'Sandbox' : 'Live'})`);
      }
    }, 1200);
  };

  // Custom Env Variable handlers
  const handleAddCustomEnv = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnvKey.trim()) return;
    const cleanKey = newEnvKey.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    const existing = gatewayForm.customEnvVars || [];
    const updated = [...existing.filter(v => v.key !== cleanKey), {
      key: cleanKey,
      value: newEnvVal.trim(),
      description: newEnvDesc.trim() || undefined
    }];

    const nextForm = { ...gatewayForm, customEnvVars: updated };
    setGatewayForm(nextForm);
    updateGatewaySettings(nextForm);
    setNewEnvKey('');
    setNewEnvVal('');
    setNewEnvDesc('');
    addToast(`✅ ভেরিয়েবল ${cleanKey} যুক্ত করা হয়েছে!`, 'success');
  };

  const handleDeleteCustomEnv = (keyToDelete: string) => {
    const existing = gatewayForm.customEnvVars || [];
    const updated = existing.filter(v => v.key !== keyToDelete);
    const nextForm = { ...gatewayForm, customEnvVars: updated };
    setGatewayForm(nextForm);
    updateGatewaySettings(nextForm);
    addToast(`🗑️ ভেরিয়েবল ${keyToDelete} ডিলিট করা হয়েছে!`, 'info');
  };

  // Generate dynamic live .env string
  const customEnvText = (gatewayForm.customEnvVars || [])
    .map(v => `${v.description ? `# ${v.description}\n` : ''}${v.key}="${v.value}"`)
    .join('\n\n');

  const envString = `# =================================================================
# FREE FIRE TOP-UP BD - LIVE ENVIRONMENT CONFIGURATION
# Generated dynamically from Admin Control Panel
# =================================================================

# APP & STORE GENERAL
APP_URL="${gatewayForm.appUrl || 'https://fftopupbd.com'}"
WHATSAPP_SUPPORT="${gatewayForm.whatsappSupport}"
HOMEPAGE_NOTICE="${gatewayForm.notice}"

# -----------------------------------------------------------------
# bKash Tokenized Checkout (Sandbox / Live)
# -----------------------------------------------------------------
BKASH_ACTIVE=${gatewayForm.bkash.active ? 'true' : 'false'}
BKASH_IS_SANDBOX=${gatewayForm.bkash.isSandbox ? 'true' : 'false'}
BKASH_BASE_URL="${gatewayForm.bkash.baseUrl}"
BKASH_APP_KEY="${gatewayForm.bkash.appKey}"
BKASH_APP_SECRET="${gatewayForm.bkash.appSecret}"
BKASH_USERNAME="${gatewayForm.bkash.username}"
BKASH_PASSWORD="${gatewayForm.bkash.password || ''}"
BKASH_MERCHANT_NUMBER="${gatewayForm.bkash.merchantNumber}"

# -----------------------------------------------------------------
# Nagad Payment Gateway (Sandbox / Live)
# -----------------------------------------------------------------
NAGAD_ACTIVE=${gatewayForm.nagad.active ? 'true' : 'false'}
NAGAD_IS_SANDBOX=${gatewayForm.nagad.isSandbox ? 'true' : 'false'}
NAGAD_BASE_URL="${gatewayForm.nagad.baseUrl}"
NAGAD_MERCHANT_ID="${gatewayForm.nagad.merchantId}"
NAGAD_MERCHANT_NUMBER="${gatewayForm.nagad.merchantNumber}"
NAGAD_PG_PUBLIC_KEY_PATH="${gatewayForm.nagad.pgPublicKeyPath || '/storage/nagad/nagad_pg_public_key.pem'}"
NAGAD_MERCHANT_PRIVATE_KEY_PATH="${gatewayForm.nagad.merchantPrivateKeyPath || '/storage/nagad/merchant_private_key.pem'}"

# -----------------------------------------------------------------
# Manual Payment Numbers (Rocket & Upay)
# -----------------------------------------------------------------
ROCKET_ACTIVE=${gatewayForm.rocket.active ? 'true' : 'false'}
ROCKET_MERCHANT_NUMBER="${gatewayForm.rocket.merchantNumber}"

UPAY_ACTIVE=${gatewayForm.upay?.active ? 'true' : 'false'}
UPAY_MERCHANT_NUMBER="${gatewayForm.upay?.merchantNumber || '01988877766'}"

# -----------------------------------------------------------------
# Auto Top-Up API Engine (Auto Shell & UniPin Direct UID Dispatch)
# -----------------------------------------------------------------
ACTIVE_TOPUP_API="${gatewaySettings.activeTopUpApi || 'auto_shell'}"
SHOW_LATEST_ORDERS_NAV_BUTTON=${gatewaySettings.showLatestOrdersButton ? 'true' : 'false'}

GARENA_AUTO_SHELL_ACTIVE=${gatewaySettings.autoShell?.enabled ? 'true' : 'false'}
GARENA_AUTO_SHELL_REGION="${gatewaySettings.autoShell?.region || 'BD'}"
GARENA_AUTO_SHELL_USERNAME="${gatewaySettings.autoShell?.username || ''}"
GARENA_AUTO_SHELL_API_KEY="${gatewaySettings.autoShell?.apiKey || ''}"
GARENA_AUTO_SHELL_BALANCE=${gatewaySettings.autoShell?.currentShellBalance || 5420}

UNIPIN_DIRECT_ACTIVE=${gatewaySettings.unipin?.enabled ? 'true' : 'false'}
UNIPIN_PARTNER_ID="${gatewaySettings.unipin?.partnerId || ''}"
UNIPIN_SECRET_KEY="${gatewaySettings.unipin?.secretKey || ''}"
UNIPIN_BALANCE_BDT=${gatewaySettings.unipin?.currentBalance || 28450}

${customEnvText ? `# -----------------------------------------------------------------\n# Custom Environment Variables\n# -----------------------------------------------------------------\n${customEnvText}\n` : ''}`;

  const copyEnvToClipboard = () => {
    navigator.clipboard.writeText(envString);
    setCopiedEnv(true);
    addToast('📋 .env ফাইল ক্লিপবোর্ডে কপি হয়েছে!', 'success');
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const handleDownloadEnv = () => {
    const blob = new Blob([envString], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '.env';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('📥 .env ফাইল ডাউনলোড সম্পন্ন হয়েছে!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Admin Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold px-2 py-0.5 rounded">
              ADMIN CONTROL PANEL
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Logged in: {currentUser?.email || 'admin@fftopup.com'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {language === 'bn' ? '🛠️ ফ্রি ফায়ার টপ-আপ ম্যানেজমেন্ট' : '🛠️ Free Fire Store Administration'}
          </h1>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('apiEngine')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap relative ${
              activeTab === 'apiEngine'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow'
                : 'text-amber-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 fill-amber-400" />
            <span>অটো এপিআই ইঞ্জিন</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveTab('gateways')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'gateways'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>এনভায়রনমেন্ট ও গেটওয়ে</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>ড্যাশবোর্ড</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap relative ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>অর্ডার তালিকা</span>
            {pendingOrdersCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'packages'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PackageIcon className="w-4 h-4" />
            <span>প্যাকেজ CRUD</span>
          </button>

          <button
            onClick={() => setActiveTab('wallets')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'wallets'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>ইউজার ওয়ালেট</span>
          </button>

          <button
            onClick={() => setActiveTab('apiDocs')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'apiDocs'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>লাইভ .env ও API</span>
          </button>
        </div>
      </div>

      {/* EXECUTIVE FAST CONTROL BAR (Always Accessible Across All Admin Tabs) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Latest Orders Button Control */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Sliders className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-white block">
                  {language === 'bn' ? 'নেভবার বাটন: "সর্বশেষ অর্ডার"' : 'Navbar Button: "Latest Orders"'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {gatewaySettings.showLatestOrdersButton ? 'গ্রাহকদের জন্য হেডার মেনুতে দৃশ্যমান আছে' : 'গ্রাহকদের জন্য মেনুতে বর্তমানে বন্ধ আছে'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleLatestOrdersButton(!gatewaySettings.showLatestOrdersButton)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border self-start sm:self-auto ${
                gatewaySettings.showLatestOrdersButton
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30'
                  : 'bg-emerald-500 text-slate-950 border-emerald-500 hover:bg-emerald-400 shadow-md'
              }`}
            >
              {gatewaySettings.showLatestOrdersButton ? (
                <>
                  <ToggleRight className="w-4 h-4 text-rose-400" />
                  <span>বাটনটি অফ করুন</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4 text-slate-950" />
                  <span>বাটনটি চালু করুন</span>
                </>
              )}
            </button>
          </div>

          <div className="h-px lg:h-8 w-full lg:w-px bg-slate-800" />

          {/* Active Auto Top-up API Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Zap className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-white block">
                  {language === 'bn' ? 'সক্রিয় টপ-আপ এপিআই' : 'Active Top-Up API'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {gatewaySettings.activeTopUpApi === 'auto_shell' ? 'Garena Auto Shell (শেল রিডিম)' : gatewaySettings.activeTopUpApi === 'unipin' ? 'UniPin Direct Express (টাকা)' : 'ম্যানুয়াল মোড'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTopUpApi('auto_shell')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  gatewaySettings.activeTopUpApi === 'auto_shell'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Auto Shell</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTopUpApi('unipin')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  gatewaySettings.activeTopUpApi === 'unipin'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>UniPin</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('apiEngine')}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-amber-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
              >
                কন্ট্রোল প্যানেল &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TAB: AUTO TOP-UP API ENGINE */}
      {activeTab === 'apiEngine' && (
        <ApiEngineSettings />
      )}

      {/* TAB: GATEWAYS & ENVIRONMENT VARIABLES (PRIMARY FOCUS) */}
      {activeTab === 'gateways' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Instruction Banner & Global Actions Bar */}
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-pink-500/10 border border-amber-500/30 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500 text-slate-950 font-black text-xs">
                  ENV
                </span>
                <h2 className="text-base font-bold text-white">
                  {language === 'bn'
                    ? 'এনভায়রনমেন্ট ভেরিয়েবল ও পেমেন্ট গেটওয়ে কন্ট্রোল'
                    : 'Environment Variables & Payment Gateway Control'}
                </h2>
              </div>
              <p className="text-xs text-slate-300">
                {language === 'bn'
                  ? 'বিকাশ, নগদ, রকেট এবং ব্যাকএন্ড এপিআই ভেরিয়েবলগুলো যেকোনো সময় এডিট ও সেভ করতে পারেন। সেভ বাটনে চাপলে তা সাথে সাথে কার্যকরী হবে।'
                  : 'Update bKash, Nagad, Rocket, and API environment variables anytime. Changes apply immediately upon saving.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleResetToDefaults}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
                title="ডিফল্ট ভ্যালু রিস্টোর করুন"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>রিস্টোর</span>
              </button>

              <button
                type="button"
                onClick={copyEnvToClipboard}
                className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>.env কপি</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveGateways()}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>সব পরিবর্তন সেভ করুন</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveGateways} className="space-y-6">
            {/* 1. bKash Configuration */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-pink-600 text-white font-black text-sm flex items-center justify-center shadow-lg">
                    bK
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      <span>bKash Tokenized Checkout</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                        gatewayForm.bkash.isSandbox 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {gatewayForm.bkash.isSandbox ? 'SANDBOX TEST' : 'LIVE PRODUCTION'}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">BKASH_BASE_URL, APP_KEY, SECRET, USER, PASS</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Preset Buttons */}
                  <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setBkashPreset('sandbox')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                        gatewayForm.bkash.isSandbox
                          ? 'bg-pink-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Sandbox
                    </button>
                    <button
                      type="button"
                      onClick={() => setBkashPreset('live')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                        !gatewayForm.bkash.isSandbox
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Live Mode
                    </button>
                  </div>

                  {/* Active Toggle */}
                  <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                    <input
                      type="checkbox"
                      checked={gatewayForm.bkash.active}
                      onChange={(e) =>
                        setGatewayForm({
                          ...gatewayForm,
                          bkash: { ...gatewayForm.bkash, active: e.target.checked }
                        })
                      }
                      className="rounded text-pink-600 focus:ring-0 w-3.5 h-3.5"
                    />
                    <span className="font-semibold">{gatewayForm.bkash.active ? 'Active' : 'Disabled'}</span>
                  </label>
                </div>
              </div>

              {/* bKash Input Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="md:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>BKASH_BASE_URL</span>
                    <span className="text-[10px] text-slate-400 font-normal">Tokenized Checkout Endpoint</span>
                  </label>
                  <input
                    type="text"
                    value={gatewayForm.bkash.baseUrl}
                    onChange={(e) =>
                      setGatewayForm({
                        ...gatewayForm,
                        bkash: { ...gatewayForm.bkash, baseUrl: e.target.value }
                      })
                    }
                    placeholder="https://tokenized.sandbox.bka.sh/v1.2.0-beta"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-pink-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">BKASH_APP_KEY</label>
                  <input
                    type="text"
                    value={gatewayForm.bkash.appKey}
                    onChange={(e) =>
                      setGatewayForm({
                        ...gatewayForm,
                        bkash: { ...gatewayForm.bkash, appKey: e.target.value }
                      })
                    }
                    placeholder="bKash App Key"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-pink-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>BKASH_APP_SECRET</span>
                    <button
                      type="button"
                      onClick={() => setShowBkashSecret(!showBkashSecret)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px]"
                    >
                      {showBkashSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showBkashSecret ? 'Hide' : 'Show'}</span>
                    </button>
                  </label>
                  <input
                    type={showBkashSecret ? 'text' : 'password'}
                    value={gatewayForm.bkash.appSecret}
                    onChange={(e) =>
                      setGatewayForm({
                        ...gatewayForm,
                        bkash: { ...gatewayForm.bkash, appSecret: e.target.value }
                      })
                    }
                    placeholder="bKash App Secret"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-pink-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">BKASH_USERNAME</label>
                  <input
                    type="text"
                    value={gatewayForm.bkash.username}
                    onChange={(e) =>
                      setGatewayForm({
                        ...gatewayForm,
                        bkash: { ...gatewayForm.bkash, username: e.target.value }
                      })
                    }
                    placeholder="sandboxTokenizedUser02"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-pink-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>BKASH_PASSWORD</span>
                    <button
                      type="button"
                      onClick={() => setShowBkashPassword(!showBkashPassword)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px]"
                    >
                      {showBkashPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showBkashPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </label>
                  <input
                    type={showBkashPassword ? 'text' : 'password'}
                    value={gatewayForm.bkash.password || ''}
                    onChange={(e) =>
                      setGatewayForm({
                        ...gatewayForm,
                        bkash: { ...gatewayForm.bkash, password: e.target.value }
                      })
                    }
                    placeholder="bKash Password"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">BKASH_MERCHANT_NUMBER</label>
                  <input
                    type="text"
                    value={gatewayForm.bkash.merchantNumber}
                    onChange={(e) =>
                      setGatewayForm({
                        ...gatewayForm,
                        bkash: { ...gatewayForm.bkash, merchantNumber: e.target.value }
                      })
                    }
                    placeholder="018XXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-pink-500"
                    required
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleTestBkashConnection}
                    disabled={testingBkash}
                    className="w-full bg-pink-950/70 hover:bg-pink-900 border border-pink-500/40 text-pink-300 hover:text-white py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {testingBkash ? (
                      <span className="animate-spin">🌀</span>
                    ) : (
                      <Key className="w-3.5 h-3.5" />
                    )}
                    <span>{testingBkash ? 'API যাচাই করা হচ্ছে...' : '🧪 টেস্ট বিকাশ কানেকশন (Token Grant)'}</span>
                  </button>
                </div>
              </div>

              {bkashTestResult && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                  bkashTestResult.startsWith('✅')
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}>
                  <CheckCheck className="w-4 h-4 shrink-0" />
                  <span>{bkashTestResult}</span>
                </div>
              )}
            </div>

            {/* 2. Nagad Configuration */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-600 text-white font-black text-sm flex items-center justify-center shadow-lg">
                    নগদ
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      <span>Nagad Payment Gateway</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                        gatewayForm.nagad.isSandbox 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {gatewayForm.nagad.isSandbox ? 'SANDBOX TEST' : 'LIVE PRODUCTION'}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">NAGAD_BASE_URL, MERCHANT_ID, NUMBER, RSA KEYS</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Preset Buttons */}
                  <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setNagadPreset('sandbox')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                        gatewayForm.nagad.isSandbox
                          ? 'bg-orange-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Sandbox
                    </button>
                    <button
                      type="button"
                      onClick={() => setNagadPreset('live')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                        !gatewayForm.nagad.isSandbox
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Live Mode
                    </button>
                  </div>

                  {/* Active Toggle */}
                  <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                    <input
                      type="checkbox"
                      checked={gatewayForm.nagad.active}
                      onChange={(e) =>
                        setGatewayForm({
                          ...gatewayForm,
                          nagad: { ...gatewayForm.nagad, active: e.target.checked }
                        })
                      }
                      className="rounded text-orange-600 focus:ring-0 w-3.5 h-3.5"
                    />
                    <span className="font-semibold">{gatewayForm.nagad.active ? 'Active' : 'Disabled'}</span>
                  </label>
                </div>
              </div>

              {/* Nagad Input Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="md:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>NAGAD_BASE_URL</span>
                    <span className="text-[10px] text-slate-400 font-normal">Remote Payment Gateway URL</span>
                  </label>
                  <input
                    type="text"
                    value={gatewayForm.nagad.baseUrl}
                    onChange={(e) =>
                      setGatewayForm({
                        ...gatewayForm,
                        nagad: { ...gatewayForm.nagad, baseUrl: e.target.value }
                      })
                    }
                    placeholder="http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">NAGAD_MERCHANT_ID</label>
                  <input
                    type="text"
                    value={gatewayForm.nagad.merchantId}
                    onChange={(e) =>
                      setGatewayForm({
                        ...gatewayForm,
                        nagad: { ...gatewayForm.nagad, merchantId: e.target.value }
                      })
                    }
                    placeholder="e.g. 6831102919381"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">NAGAD_MERCHANT_NUMBER</label>
                  <input
                    type="text"
                    value={gatewayForm.nagad.merchantNumber}
                    onChange={(e) =>
                      setGatewayForm({
                        ...gatewayForm,
                        nagad: { ...gatewayForm.nagad, merchantNumber: e.target.value }
                      })
                    }
                    placeholder="017XXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">NAGAD_PG_PUBLIC_KEY_PATH</label>
                  <input
                    type="text"
                    value={gatewayForm.nagad.pgPublicKeyPath || ''}
                    onChange={(e) =>
                      setGatewayForm({
                        ...gatewayForm,
                        nagad: { ...gatewayForm.nagad, pgPublicKeyPath: e.target.value }
                      })
                    }
                    placeholder="/storage/nagad/nagad_pg_public_key.pem"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">NAGAD_MERCHANT_PRIVATE_KEY_PATH</label>
                  <input
                    type="text"
                    value={gatewayForm.nagad.merchantPrivateKeyPath || ''}
                    onChange={(e) =>
                      setGatewayForm({
                        ...gatewayForm,
                        nagad: { ...gatewayForm.nagad, merchantPrivateKeyPath: e.target.value }
                      })
                    }
                    placeholder="/storage/nagad/merchant_private_key.pem"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={handleTestNagadConnection}
                    disabled={testingNagad}
                    className="w-full bg-orange-950/70 hover:bg-orange-900 border border-orange-500/40 text-orange-300 hover:text-white py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {testingNagad ? (
                      <span className="animate-spin">🌀</span>
                    ) : (
                      <Key className="w-3.5 h-3.5" />
                    )}
                    <span>{testingNagad ? 'RSA কি যাচাই করা হচ্ছে...' : '🧪 টেস্ট নগদ কানেকশন ও RSA কি-পেয়ার ভ্যালিডেশন'}</span>
                  </button>
                </div>
              </div>

              {nagadTestResult && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                  nagadTestResult.startsWith('✅')
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}>
                  <CheckCheck className="w-4 h-4 shrink-0" />
                  <span>{nagadTestResult}</span>
                </div>
              )}
            </div>

            {/* 3. Manual Gateways (Rocket & Upay) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rocket */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center">
                      R
                    </span>
                    <h3 className="font-bold text-sm text-purple-400">Rocket (DBBL) Settings</h3>
                  </div>
                  <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={gatewayForm.rocket.active}
                      onChange={(e) =>
                        setGatewayForm({
                          ...gatewayForm,
                          rocket: { ...gatewayForm.rocket, active: e.target.checked }
                        })
                      }
                      className="rounded text-purple-600 focus:ring-0"
                    />
                    <span>Active</span>
                  </label>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">ROCKET_MERCHANT_NUMBER</label>
                    <input
                      type="text"
                      value={gatewayForm.rocket.merchantNumber}
                      onChange={(e) =>
                        setGatewayForm({
                          ...gatewayForm,
                          rocket: { ...gatewayForm.rocket, merchantNumber: e.target.value }
                        })
                      }
                      placeholder="019XXXXXXXX-X"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">ROCKET_INSTRUCTIONS</label>
                    <input
                      type="text"
                      value={gatewayForm.rocket.instructions}
                      onChange={(e) =>
                        setGatewayForm({
                          ...gatewayForm,
                          rocket: { ...gatewayForm.rocket, instructions: e.target.value }
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Upay */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                      U
                    </span>
                    <h3 className="font-bold text-sm text-blue-400">Upay (UCB) Settings</h3>
                  </div>
                  <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={gatewayForm.upay?.active ?? true}
                      onChange={(e) =>
                        setGatewayForm({
                          ...gatewayForm,
                          upay: { 
                            active: e.target.checked,
                            merchantNumber: gatewayForm.upay?.merchantNumber || '01988877766',
                            instructions: gatewayForm.upay?.instructions || 'ডায়াল করুন *268#'
                          }
                        })
                      }
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span>Active</span>
                  </label>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">UPAY_MERCHANT_NUMBER</label>
                    <input
                      type="text"
                      value={gatewayForm.upay?.merchantNumber || '01988877766'}
                      onChange={(e) =>
                        setGatewayForm({
                          ...gatewayForm,
                          upay: { 
                            active: gatewayForm.upay?.active ?? true,
                            merchantNumber: e.target.value,
                            instructions: gatewayForm.upay?.instructions || 'ডায়াল করুন *268#'
                          }
                        })
                      }
                      placeholder="019XXXXXXXX"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">UPAY_INSTRUCTIONS</label>
                    <input
                      type="text"
                      value={gatewayForm.upay?.instructions || 'ডায়াল করুন *268# অথবা উপায় অ্যাপ দিয়ে সেন্ড মানি করুন।'}
                      onChange={(e) =>
                        setGatewayForm({
                          ...gatewayForm,
                          upay: { 
                            active: gatewayForm.upay?.active ?? true,
                            merchantNumber: gatewayForm.upay?.merchantNumber || '01988877766',
                            instructions: e.target.value
                          }
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. General Store Settings & Support Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>স্টোর জেনারেল এনভায়রনমেন্ট ও সাপোর্ট ইনফো</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">APP_URL (ডোমেইন / হোস্ট ইউআরএল)</label>
                  <input
                    type="text"
                    value={gatewayForm.appUrl || 'https://fftopupbd.com'}
                    onChange={(e) => setGatewayForm({ ...gatewayForm, appUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">WHATSAPP_SUPPORT (সাপোর্ট মোবাইল নম্বর)</label>
                  <input
                    type="text"
                    value={gatewayForm.whatsappSupport}
                    onChange={(e) => setGatewayForm({ ...gatewayForm, whatsappSupport: e.target.value })}
                    placeholder="+88017XXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">HOMEPAGE_NOTICE (ওয়েবসাইটের শীর্ষ স্ক্রলিং নোটিশ)</label>
                  <input
                    type="text"
                    value={gatewayForm.notice}
                    onChange={(e) => setGatewayForm({ ...gatewayForm, notice: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* 5. Custom Environment Variables Builder */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>কাস্টম এনভায়রনমেন্ট ভেরিয়েবল (Custom .env Variables)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    যেকোনো নতুন এপিআই কি, এসএমএস গেটওয়ে বা পার্টনার সিক্রেট এখানে যুক্ত করতে পারেন।
                  </p>
                </div>
              </div>

              {/* Table of custom env vars */}
              {(gatewayForm.customEnvVars && gatewayForm.customEnvVars.length > 0) && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-2 font-mono">KEY</th>
                        <th className="pb-2 font-mono">VALUE</th>
                        <th className="pb-2">DESCRIPTION</th>
                        <th className="pb-2 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {gatewayForm.customEnvVars.map((env) => (
                        <tr key={env.key} className="hover:bg-slate-800/30">
                          <td className="py-2.5 font-mono font-bold text-amber-400">{env.key}</td>
                          <td className="py-2.5 font-mono text-slate-200">
                            {env.value ? '••••••••' : <span className="text-slate-500 italic">empty</span>}
                          </td>
                          <td className="py-2.5 text-slate-400">{env.description || '---'}</td>
                          <td className="py-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomEnv(env.key)}
                              className="text-slate-500 hover:text-rose-400 p-1"
                              title="Delete Variable"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Add form */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-200">+ নতুন ভেরিয়েবল যোগ করুন</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <input
                      type="text"
                      value={newEnvKey}
                      onChange={(e) => setNewEnvKey(e.target.value)}
                      placeholder="e.g. SMS_GATEWAY_KEY"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={newEnvVal}
                      onChange={(e) => setNewEnvVal(e.target.value)}
                      placeholder="Variable Value"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={newEnvDesc}
                      onChange={(e) => setNewEnvDesc(e.target.value)}
                      placeholder="বিবরণ (Description)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomEnv}
                  className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ভেরিয়েবল যোগ করুন</span>
                </button>
              </div>
            </div>

            {/* Bottom Save Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400">
                পরিবর্তন সেভ করলে তা অবিলম্বে ব্রাউজার ও পেমেন্ট মডালে কার্যকর হবে।
              </p>
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold px-8 py-3.5 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>সব এনভায়রনমেন্ট ভেরিয়েবল সেভ করুন</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 1: DASHBOARD STATS */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="text-xs font-semibold text-slate-400 mb-1">মোট বিক্রয় (Total Revenue)</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                ৳ {totalRevenue.toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-medium">
                <span>↑ লাইভ লেনদেন</span>
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs font-semibold text-slate-400 mb-1">ডেলিভার্ড ডায়মন্ড (Diamonds)</div>
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
                {totalDiamonds.toLocaleString()} 💎
              </div>
              <p className="text-[11px] text-slate-400 mt-2">ফ্রি ফায়ার প্লেয়ার অ্যাকাউন্টে প্রেরিত</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs font-semibold text-slate-400 mb-1">মোট অর্ডার সংখ্যা (Orders)</div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                {orders.length}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">সবগুলো পেমেন্ট মেথড মিলিয়ে</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs font-semibold text-slate-400 mb-1">অপেক্ষমান অর্ডার (Pending)</div>
              <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
                {pendingOrdersCount}
              </div>
              <p className="text-[11px] text-rose-300 mt-2">দ্রুত ডেলিভারি করুন</p>
            </div>
          </div>

          {/* Quick Recent Pending Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>অপেক্ষমান ও সাম্প্রতিক অর্ডারসমূহ (Recent Feed)</span>
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-amber-400 hover:underline font-semibold"
              >
                সব অর্ডার দেখুন →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Order #</th>
                    <th className="pb-3 font-semibold">Player UID</th>
                    <th className="pb-3 font-semibold">Package</th>
                    <th className="pb-3 font-semibold">Price</th>
                    <th className="pb-3 font-semibold">Gateway</th>
                    <th className="pb-3 font-semibold">TrxID</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-mono font-bold text-amber-400">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 font-mono text-slate-200">
                        {order.playerId}
                        {order.playerNickname && (
                          <span className="block text-[10px] text-slate-400">
                            {order.playerNickname}
                          </span>
                        )}
                      </td>
                      <td className="py-3 font-medium text-white">{order.packageName}</td>
                      <td className="py-3 font-mono font-bold text-slate-200">৳{order.price}</td>
                      <td className="py-3 uppercase text-[11px] font-semibold text-pink-400">
                        {order.paymentMethod}
                      </td>
                      <td className="py-3 font-mono text-slate-400">{order.trxId || '---'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.orderStatus === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : order.orderStatus === 'processing'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {order.orderStatus !== 'completed' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'completed', 'Approved & delivered by admin')}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1 rounded text-[11px] transition-colors"
                          >
                            ডেলিভারি দিন
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Search & Filter Toolbar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search UID, Order ID, TrxID..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
              {['all', 'pending', 'processing', 'completed', 'cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors whitespace-nowrap ${
                    orderStatusFilter === st
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <th className="p-4 font-semibold">অর্ডার আইডি</th>
                    <th className="p-4 font-semibold">প্লেয়ার আইডি (UID)</th>
                    <th className="p-4 font-semibold">প্যাকেজ ও ডায়মন্ড</th>
                    <th className="p-4 font-semibold">মূল্য</th>
                    <th className="p-4 font-semibold">পেমেন্ট গেটওয়ে</th>
                    <th className="p-4 font-semibold">TrxID / ফোন</th>
                    <th className="p-4 font-semibold">স্ট্যাটাস</th>
                    <th className="p-4 font-semibold text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        কোনো অর্ডার পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-amber-400">
                          {order.orderNumber}
                          <span className="block text-[10px] text-slate-500 font-normal">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-mono font-bold text-white block">{order.playerId}</span>
                          <span className="text-[11px] text-emerald-400">{order.playerNickname || 'Player'}</span>
                        </td>
                        <td className="p-4 font-medium text-slate-200">
                          {order.packageName}
                          <span className="text-amber-400 font-bold block">{order.diamonds} 💎</span>
                        </td>
                        <td className="p-4 font-mono font-bold text-white">৳{order.price}</td>
                        <td className="p-4">
                          <span className="capitalize font-semibold text-pink-400 bg-pink-950/40 px-2 py-0.5 rounded border border-pink-500/20">
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-slate-300">
                          <div>{order.trxId || 'N/A'}</div>
                          <div className="text-[10px] text-slate-500">{order.userPhone}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold block w-fit ${
                            order.orderStatus === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : order.orderStatus === 'processing'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : order.orderStatus === 'cancelled'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {order.orderStatus}
                          </span>
                          {order.apiProvider && (
                            <span className="mt-1 inline-flex items-center gap-1 text-[9px] font-mono font-bold text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-600/30">
                              <Zap className="w-2.5 h-2.5 text-amber-400" />
                              {order.apiProvider === 'auto_shell' ? 'Auto Shell' : 'UniPin'}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                          {order.orderStatus !== 'completed' && (
                            <button
                              type="button"
                              onClick={() => dispatchAutoTopUp(order.id)}
                              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-2 py-1.5 rounded-lg text-xs transition-colors inline-flex items-center gap-1 shadow"
                              title="সক্রিয় এপিআই দিয়ে প্লেয়ারের UID-তে স্বয়ংক্রিয় ডায়মন্ড পাঠান"
                            >
                              <Zap className="w-3.5 h-3.5 fill-slate-950" />
                              <span>অটো টপ-আপ</span>
                            </button>
                          )}
                          {order.orderStatus !== 'completed' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'completed', 'Delivered by admin')}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                              title="ডায়মন্ড সফল ডেলিভারি মার্ক করুন"
                            >
                              ✓ ডেলিভার
                            </button>
                          )}
                          {order.orderStatus !== 'cancelled' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'cancelled', 'Refunded / Cancelled by admin')}
                              className="bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 px-2 py-1.5 rounded-lg text-xs transition-colors"
                              title="অর্ডার বাতিল"
                            >
                              বাতিল
                            </button>
                          )}
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PACKAGES CRUD */}
      {activeTab === 'packages' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white">
              ডায়মন্ড ও মেম্বারশিপ প্যাকেজ তালিকা ({packages.length} টি)
            </h3>
            <button
              onClick={() => setShowAddPackageModal(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন প্যাকেজ যোগ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map((pkg) => {
              return (
                <div
                  key={pkg.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative flex flex-col justify-between"
                >
                  {pkg.badge && (
                    <span className="absolute top-3 right-3 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {pkg.badge}
                    </span>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">💎</span>
                      <h4 className="font-bold text-base text-white">{pkg.name}</h4>
                    </div>
                    <p className="text-xs text-slate-400">{pkg.nameBn}</p>
                    <p className="text-xs text-emerald-400 mt-1">
                      {pkg.diamonds} Diamonds {pkg.bonusDiamonds ? `(+${pkg.bonusDiamonds} Bonus)` : ''}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 capitalize">
                      Category: {pkg.category} | {pkg.inStock ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-black text-amber-400 font-mono">
                        ৳{pkg.price}
                      </span>
                      {pkg.originalPrice && (
                        <span className="text-xs text-slate-500 line-through ml-2 font-mono">
                          ৳{pkg.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updatePackage(pkg.id, { inStock: !pkg.inStock })}
                        className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                          pkg.inStock
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {pkg.inStock ? 'Active' : 'Disabled'}
                      </button>

                      <button
                        onClick={() => deletePackage(pkg.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Package Modal */}
          {showAddPackageModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
              <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <h3 className="font-bold text-base text-white">নতুন প্যাকেজ তৈরি করুন</h3>
                  <button onClick={() => setShowAddPackageModal(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreatePackage} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Package Name (English)</label>
                    <input
                      type="text"
                      value={newPackage.name}
                      onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">প্যাকেজের নাম (বাংলা)</label>
                    <input
                      type="text"
                      value={newPackage.nameBn}
                      onChange={(e) => setNewPackage({ ...newPackage, nameBn: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Diamonds</label>
                      <input
                        type="number"
                        value={newPackage.diamonds}
                        onChange={(e) => setNewPackage({ ...newPackage, diamonds: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Bonus Diamonds</label>
                      <input
                        type="number"
                        value={newPackage.bonusDiamonds || 0}
                        onChange={(e) => setNewPackage({ ...newPackage, bonusDiamonds: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Price (৳ BDT)</label>
                      <input
                        type="number"
                        value={newPackage.price}
                        onChange={(e) => setNewPackage({ ...newPackage, price: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Original Price (৳)</label>
                      <input
                        type="number"
                        value={newPackage.originalPrice || 0}
                        onChange={(e) => setNewPackage({ ...newPackage, originalPrice: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Category</label>
                    <select
                      value={newPackage.category}
                      onChange={(e) => setNewPackage({ ...newPackage, category: e.target.value as Category })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="diamonds">Diamonds</option>
                      <option value="membership">Membership</option>
                      <option value="evo_gun">EVO Gun</option>
                      <option value="special_airdrop">Special Airdrop</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Badge (Optional)</label>
                    <input
                      type="text"
                      value={newPackage.badge || ''}
                      onChange={(e) => setNewPackage({ ...newPackage, badge: e.target.value })}
                      placeholder="e.g. Popular, Hot"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="flex gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAddPackageModal(false)}
                      className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
                    >
                      প্যাকেজ সেভ করুন
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: LIVE .ENV & API DOCUMENTATION */}
      {activeTab === 'apiDocs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-400" />
                <span>লাইভ জেনারেটেড .env ফাইল ও ব্যাকএন্ড API</span>
              </h3>
              <p className="text-xs text-slate-400">
                উপরের গেটওয়ে সেটিংসের সাথে এটি রিয়েল-টাইমে সিঙ্ক হয়। আপনি যেকোনো সময় কপি বা ডাউনলোড করে আপনার সার্ভারে রাখতে পারেন।
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadEnv}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>.env ডাউনলোড</span>
              </button>
              <button
                onClick={copyEnvToClipboard}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow transition-colors"
              >
                {copiedEnv ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEnv ? 'কপি হয়েছে!' : '.env কপি করুন'}</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto shadow-inner">
            <pre className="whitespace-pre">{envString}</pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-pink-600 text-white font-bold flex items-center justify-center text-[10px]">
                  bK
                </span>
                <h4 className="font-bold text-pink-400">bKash Tokenized Checkout Payload</h4>
              </div>
              <p className="text-slate-400 text-[11px]">POST {gatewayForm.bkash.baseUrl}/tokenized/checkout/create</p>
              <pre className="bg-slate-900 p-3 rounded-xl text-slate-300 font-mono text-[11px] overflow-x-auto">
{`{
  "mode": "0011",
  "payerReference": "01712345678",
  "callbackURL": "${gatewayForm.appUrl || 'https://fftopupbd.com'}/bkash/callback",
  "amount": "260.00",
  "currency": "BDT",
  "intent": "sale",
  "merchantInvoiceNumber": "FF-98241"
}`}
              </pre>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-orange-600 text-white font-bold flex items-center justify-center text-[10px]">
                  নগদ
                </span>
                <h4 className="font-bold text-orange-400">Nagad Initialize Payment Payload</h4>
              </div>
              <p className="text-slate-400 text-[11px]">POST {gatewayForm.nagad.baseUrl}/check-out/initialize/</p>
              <pre className="bg-slate-900 p-3 rounded-xl text-slate-300 font-mono text-[11px] overflow-x-auto">
{`{
  "dateTime": "${new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)}",
  "sensitiveData": "RSA_ENCRYPTED_DATA",
  "signature": "SHA256_WITH_RSA_SIGNATURE",
  "merchantId": "${gatewayForm.nagad.merchantId}",
  "orderId": "FF-98241"
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB: WALLETS & USER BALANCE MANAGEMENT */}
      {activeTab === 'wallets' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Admin Notice & Summary Banner */}
          <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    {language === 'bn' ? 'ব্যবহারকারী ওয়ালেট ও ব্যালেন্স কন্ট্রোল' : 'User Wallet & Digital Balance Control'}
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Live
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'bn'
                      ? 'যেকোনো গ্রাহকের ওয়ালেটে সরাসরি টাকা ক্রেডিট বা ডেবিট করুন এবং সকল লেনদেন ট্র্যাক করুন।'
                      : 'Credit or debit customer wallet balances directly and monitor complete transaction history.'}
                  </p>
                </div>
              </div>

              {/* Admin Ordering Restriction Badge */}
              <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <div>
                  <span className="font-bold block text-rose-200">অ্যাডমিন অর্ডার সুরক্ষা সক্রিয়</span>
                  <span className="text-[11px] text-rose-300/80">অ্যাডমিন অ্যাকাউন্ট থেকে কেনাকাটা ব্লক করা আছে</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6">
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4">
                <span className="text-xs text-slate-400 font-medium block">মোট ইউজার ওয়ালেট ব্যালেন্স</span>
                <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
                  ৳{users.reduce((acc, u) => acc + (u.walletBalance || 0), 0).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500">গ্রাহকদের কাছে জমা</span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4">
                <span className="text-xs text-slate-400 font-medium block">মোট নিবন্ধিত ইউজার</span>
                <span className="text-2xl font-black text-white font-mono mt-1 block">
                  {users.length}
                </span>
                <span className="text-[10px] text-slate-500">সক্রিয় অ্যাকাউন্ট</span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4">
                <span className="text-xs text-slate-400 font-medium block">ওয়ালেট লেনদেন সংখ্যা</span>
                <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">
                  {walletTransactions.length}
                </span>
                <span className="text-[10px] text-slate-500">ডিপোজিট ও পারচেজ</span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4">
                <span className="text-xs text-slate-400 font-medium block">গড় ইউজার ব্যালেন্স</span>
                <span className="text-2xl font-black text-sky-400 font-mono mt-1 block">
                  ৳{users.length > 0 ? Math.round(users.reduce((acc, u) => acc + (u.walletBalance || 0), 0) / users.length) : 0}
                </span>
                <span className="text-[10px] text-slate-500">প্রতি একাউন্টে</span>
              </div>
            </div>
          </div>

          {/* User List and Adjustment Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-amber-400" />
                  {language === 'bn' ? 'ব্যবহারকারী তালিকা ও ব্যালেন্স সমন্বয়' : 'User Accounts & Balance Adjustment'}
                </h3>
                <p className="text-xs text-slate-400">
                  {language === 'bn' ? 'যেকোনো ইউজারের ওয়ালেট ব্যালেন্স ম্যানুয়ালি পরিবর্তন করতে অ্যাডজাস্ট বাটনে ক্লিক করুন।' : 'Click Adjust to credit or debit any user balance.'}
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder={language === 'bn' ? 'নাম, ফোন বা ইমেইল খুঁজুন...' : 'Search user or phone...'}
                  value={walletSearch}
                  onChange={(e) => setWalletSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">ইউজার / নাম</th>
                    <th className="px-4 py-3">ফোন / ইমেইল</th>
                    <th className="px-4 py-3">রোল</th>
                    <th className="px-4 py-3">বর্তমান ওয়ালেট ব্যালেন্স</th>
                    <th className="px-4 py-3 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {users
                    .filter((u) => 
                      u.name.toLowerCase().includes(walletSearch.toLowerCase()) ||
                      u.email.toLowerCase().includes(walletSearch.toLowerCase()) ||
                      u.phone.includes(walletSearch)
                    )
                    .map((user) => (
                      <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-200">{user.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">ID: {user.id.slice(-6)}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="text-slate-300 font-mono">{user.phone}</div>
                          <div className="text-[11px] text-slate-500">{user.email}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              user.role === 'admin'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {user.role === 'admin' ? 'Admin (Restricted)' : 'Customer'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-base font-black text-emerald-400">
                            ৳{(user.walletBalance || 0).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setAdjustingUser(user);
                              setAdjustAmount(100);
                              setAdjustType('credit');
                              setAdjustReason('অ্যাডমিন ম্যানুয়াল টপ-আপ');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-bold transition-all text-xs"
                          >
                            ব্যালেন্স সমন্বয় / Adjust
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Wallet Ledger */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              {language === 'bn' ? 'সিস্টেম-ওয়াইড ওয়ালেট ট্রানজ্যাকশন লেজার' : 'System-Wide Wallet Transactions Ledger'}
            </h3>

            {walletTransactions.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                কোনো ওয়ালেট ট্রানজ্যাকশন পাওয়া যায়নি।
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">তারিখ ও সময়</th>
                      <th className="px-4 py-3">ব্যবহারকারী</th>
                      <th className="px-4 py-3">ধরন</th>
                      <th className="px-4 py-3">বিবরণ</th>
                      <th className="px-4 py-3">TrxID</th>
                      <th className="px-4 py-3 text-right">পরিমাণ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                    {walletTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                          {new Date(tx.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-slate-300 font-medium">
                            {users.find((u) => u.id === tx.userId)?.name || tx.userEmail || tx.userId}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              tx.type === 'deposit'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : tx.type === 'purchase'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-sky-500/20 text-sky-300'
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-300">{tx.description}</td>
                        <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">{tx.trxId || '---'}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-sm">
                          <span className={tx.type === 'deposit' ? 'text-emerald-400' : 'text-rose-400'}>
                            {tx.type === 'deposit' ? `+৳${tx.amount}` : `-৳${Math.abs(tx.amount)}`}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ADJUST USER WALLET MODAL */}
          {adjustingUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
              <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">ইউজার ব্যালেন্স সমন্বয়</h4>
                      <p className="text-[11px] text-slate-400">{adjustingUser.name} ({adjustingUser.phone})</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAdjustingUser(null)}
                    className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">বর্তমান ওয়ালেট ব্যালেন্স:</span>
                  <span className="text-base font-bold font-mono text-emerald-400">
                    ৳{(adjustingUser.walletBalance || 0).toLocaleString()}
                  </span>
                </div>

                {/* Credit or Debit Type Toggle */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">লেনদেনের ধরন:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAdjustType('credit')}
                      className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        adjustType === 'credit'
                          ? 'bg-emerald-500 text-slate-950 shadow'
                          : 'bg-slate-950 border border-slate-800 text-slate-400'
                      }`}
                    >
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                      টাকা যোগ করুন (+ Credit)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdjustType('debit')}
                      className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        adjustType === 'debit'
                          ? 'bg-rose-500 text-white shadow'
                          : 'bg-slate-950 border border-slate-800 text-slate-400'
                      }`}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      টাকা কাটুন (- Debit)
                    </button>
                  </div>
                </div>

                {/* Amount input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">টাকার পরিমাণ (BDT):</label>
                  <input
                    type="number"
                    min="1"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono outline-none"
                  />
                </div>

                {/* Reason input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">কারণ / মন্তব্য (Reason):</label>
                  <input
                    type="text"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    placeholder="যেমনঃ নগদ ডিপোজিট পেয়েছি / রিফান্ড"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAdjustingUser(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                  >
                    বাতিল
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (adjustAmount <= 0) {
                        addToast('সঠিক টাকার পরিমাণ দিন', 'error');
                        return;
                      }
                      const ok = adjustUserWallet(adjustingUser.id, adjustAmount, adjustType, adjustReason || 'Admin adjustment');
                      if (ok) {
                        setAdjustingUser(null);
                      }
                    }}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs text-slate-950 transition-all ${
                      adjustType === 'credit'
                        ? 'bg-emerald-400 hover:bg-emerald-300'
                        : 'bg-rose-500 text-white hover:bg-rose-400'
                    }`}
                  >
                    নিশ্চিত করুন ({adjustType === 'credit' ? `+৳${adjustAmount}` : `-৳${adjustAmount}`})
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
