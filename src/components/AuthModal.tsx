import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, User as UserIcon, Lock, Mail, Phone, ShieldCheck, Key } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { login, register, language } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [email, setEmail] = useState<string>('fazlebarymahim@gmail.com');
  const [password, setPassword] = useState<string>('123456');
  const [name, setName] = useState<string>('Fazle Bary Mahim');
  const [phone, setPhone] = useState<string>('01712345678');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'login') {
      const res = login(email, password);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message);
      }
    } else {
      const res = register(name, email, phone, password);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  const handleQuickAdminLogin = () => {
    setEmail('admin@fftopup.com');
    setPassword('admin12345');
    const res = login('admin@fftopup.com', 'admin12345');
    if (res.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <UserIcon className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-base text-white">
              {mode === 'login'
                ? (language === 'bn' ? 'অ্যাকাউন্টে লগইন করুন' : 'Account Login')
                : (language === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create an Account')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`w-1/2 py-3 text-center transition-colors ${
              mode === 'login'
                ? 'text-amber-400 border-b-2 border-amber-500 bg-amber-500/5'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'লগইন' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`w-1/2 py-3 text-center transition-colors ${
              mode === 'register'
                ? 'text-amber-400 border-b-2 border-amber-500 bg-amber-500/5'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'রেজিস্ট্রেশন' : 'Register'}
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {language === 'bn' ? 'আপনার নাম' : 'Full Name'}
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 font-bold text-slate-950 text-xs sm:text-sm shadow-md transition-all mt-2"
            >
              {mode === 'login'
                ? (language === 'bn' ? 'লগইন করুন' : 'Sign In')
                : (language === 'bn' ? 'অ্যাকাউন্ট খুলুন' : 'Create Account')}
            </button>
          </form>

          {/* Quick Admin Login button as mentioned in prompt */}
          <div className="pt-3 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-700 text-amber-400 hover:text-amber-300 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Key className="w-4 h-4" />
              <span>
                {language === 'bn'
                  ? '⚡ অ্যাডমিন কুইক লগইন (admin@fftopup.com)'
                  : '⚡ Quick Admin Login (admin@fftopup.com)'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
