import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Flame, 
  Search, 
  ShoppingBag, 
  User as UserIcon, 
  ShieldCheck, 
  LogOut, 
  Sparkles,
  Wallet
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'shop' | 'track' | 'orders' | 'admin';
  setCurrentTab: (tab: 'shop' | 'track' | 'orders' | 'admin') => void;
  onOpenAuth: () => void;
  onOpenWallet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenAuth, onOpenWallet }) => {
  const { language, setLanguage, currentUser, logout, gatewaySettings } = useApp();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const showLatestOrders = gatewaySettings.showLatestOrdersButton !== false;

  const t = {
    topup: language === 'bn' ? 'টপ-আপ' : 'Top-Up',
    track: language === 'bn' ? 'অর্ডার ট্র্যাক' : 'Track Order',
    myOrders: language === 'bn' ? 'সর্বশেষ অর্ডার' : 'Latest Orders',
    admin: language === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel',
    login: language === 'bn' ? 'লগইন / সাইনআপ' : 'Login / Register',
    logout: language === 'bn' ? 'লগআউট' : 'Logout',
    support: language === 'bn' ? 'হেল্পলাইন' : 'Support',
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-orange-600 text-white text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>
          {language === 'bn'
            ? '🔥 ফ্রি ফায়ার ইনস্ট্যান্ট টপ-আপ: bKash ও Nagad-এ অটো ডেলিভারি মাত্র ১-৩ মিনিটে!'
            : '🔥 Instant Free Fire Top-Up: Auto delivery via bKash & Nagad in 1-3 mins!'}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentTab('shop')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Flame className="w-6 h-6 text-amber-500 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                  FF TOPUP BD
                </span>
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  BD SERVER
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {language === 'bn' ? 'দ্রুত ও বিশ্বস্ত ডায়মন্ড শপ' : 'Fast & Trusted Diamond Shop'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {currentUser?.role !== 'admin' && (
              <button
                onClick={() => setCurrentTab('shop')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  currentTab === 'shop'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                {t.topup}
              </button>
            )}

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setCurrentTab('track')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  currentTab === 'track'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Search className="w-4 h-4" />
                {t.track}
              </button>
            )}

            {(showLatestOrders || currentUser?.role === 'admin') && (
              <button
                onClick={() => setCurrentTab('orders')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  currentTab === 'orders'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
                title={!showLatestOrders && currentUser?.role === 'admin' ? 'কাস্টমারদের জন্য এই বাটনটি বর্তমানে অফ আছে' : undefined}
              >
                <UserIcon className="w-4 h-4" />
                <span>{t.myOrders}</span>
                {!showLatestOrders && currentUser?.role === 'admin' && (
                  <span className="text-[10px] bg-red-950 text-red-400 border border-red-800/80 px-1.5 py-0.5 rounded font-normal">
                    {language === 'bn' ? 'অফ' : 'OFF'}
                  </span>
                )}
              </button>
            )}

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  currentTab === 'admin'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'text-slate-400 hover:text-red-300 hover:bg-red-950/30'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-red-400" />
                {t.admin}
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </button>
            )}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Wallet Pill Button for Customer */}
            {currentUser && currentUser.role !== 'admin' && (
              <button
                type="button"
                onClick={onOpenWallet}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all shadow-sm group"
                title={language === 'bn' ? 'ওয়ালেট ব্যালেন্স ও রিচার্জ' : 'Wallet Balance & Top Up'}
              >
                <Wallet className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="font-mono">৳{(currentUser.walletBalance ?? 0).toLocaleString()}</span>
                <span className="w-4 h-4 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px] flex items-center justify-center font-bold">
                  +
                </span>
              </button>
            )}

            {/* Language Switcher */}
            <div className="bg-slate-900 p-0.5 rounded-lg border border-slate-800 flex items-center text-xs">
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  language === 'bn' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  language === 'en' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* User Account / Login */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 px-3 py-1.5 rounded-lg text-sm text-slate-200 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 flex items-center justify-center text-xs font-bold text-slate-950">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate hidden sm:inline text-xs font-medium">
                    {currentUser.name}
                  </span>
                  {currentUser.role === 'admin' && (
                    <span className="bg-red-500/20 text-red-300 text-[10px] px-1.5 py-0.5 rounded border border-red-500/30">
                      Admin
                    </span>
                  )}
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1.5 z-50">
                    <div className="px-3.5 py-2 border-b border-slate-800">
                      <p className="text-xs text-slate-400">লগইন অ্যাকাউন্ট:</p>
                      <p className="text-sm font-semibold text-white truncate">{currentUser.email}</p>
                    </div>

                    {/* Quick wallet in dropdown */}
                    {currentUser.role !== 'admin' && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenWallet();
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-emerald-300 hover:bg-slate-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                          <span>ওয়ালেট ব্যালেন্স:</span>
                        </div>
                        <span className="font-mono font-bold">৳{(currentUser.walletBalance || 0).toLocaleString()}</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setCurrentTab('orders');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                      {t.myOrders}
                    </button>
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setCurrentTab('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-red-300 hover:bg-red-950/40 flex items-center gap-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                        {t.admin}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-rose-400 hover:bg-slate-800 flex items-center gap-2 border-t border-slate-800"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      {t.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAuth}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm px-3.5 py-2 rounded-lg shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>{t.login}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden border-t border-slate-800/80 py-2 items-center justify-around text-xs">
          {currentUser?.role !== 'admin' && (
            <button
              onClick={() => setCurrentTab('shop')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded ${
                currentTab === 'shop' ? 'text-amber-400 font-bold' : 'text-slate-400'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.topup}</span>
            </button>
          )}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setCurrentTab('track')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded ${
                currentTab === 'track' ? 'text-amber-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>{t.track}</span>
            </button>
          )}
          {(showLatestOrders || currentUser?.role === 'admin') && (
            <button
              onClick={() => setCurrentTab('orders')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded ${
                currentTab === 'orders' ? 'text-amber-400 font-bold' : 'text-slate-400'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>{t.myOrders}</span>
            </button>
          )}
          {currentUser && currentUser.role !== 'admin' && (
            <button
              onClick={onOpenWallet}
              className="flex flex-col items-center gap-1 py-1 px-3 rounded text-emerald-400 font-bold"
            >
              <Wallet className="w-4 h-4" />
              <span>৳{(currentUser.walletBalance || 0).toLocaleString()}</span>
            </button>
          )}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded ${
                currentTab === 'admin' ? 'text-red-400 font-bold' : 'text-slate-400'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t.admin}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
