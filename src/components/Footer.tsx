import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame, ShieldCheck, Headphones, MessageCircle, Clock, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, gatewaySettings } = useApp();

  return (
    <footer className="mt-16 bg-slate-950 border-t border-slate-900 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-slate-950">
                <Flame className="w-5 h-5 text-slate-950" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                FF TOPUP BD
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {language === 'bn'
                ? 'বাংলাদেশের সবচেয়ে দ্রুত ও বিশ্বস্ত ফ্রি ফায়ার ডায়মন্ড টপ-আপ প্ল্যাটফর্ম। বিকাশ এবং নগদ অটোমেটেড পেমেন্টে ১-৩ মিনিটে ইনস্ট্যান্ট ডেলিভারি।'
                : 'Fastest & most reliable Free Fire diamond recharge platform in Bangladesh. Instant 1-3 minutes automated delivery via bKash & Nagad.'}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              {language === 'bn' ? 'আমাদের বৈশিষ্ট্য' : 'Why Choose Us'}
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>ইনস্ট্যান্ট অটো ডেলিভারি (১-৩ মিনিট)</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>১০০% নিরাপদ ও অফিশিয়াল আইডি টপ-আপ</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>২৪/৭ লাইভ অর্ডার ট্র্যাকিং সিস্টেম</span>
              </li>
            </ul>
          </div>

          {/* Payment Gateways */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              {language === 'bn' ? 'সমর্থিত পেমেন্ট মাধ্যম' : 'Payment Gateways'}
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="bg-pink-950/80 text-pink-400 border border-pink-500/30 px-2.5 py-1 rounded-lg font-bold text-[11px]">
                bKash Tokenized
              </span>
              <span className="bg-orange-950/80 text-orange-400 border border-orange-500/30 px-2.5 py-1 rounded-lg font-bold text-[11px]">
                Nagad Gateway
              </span>
              <span className="bg-purple-950/80 text-purple-400 border border-purple-500/30 px-2.5 py-1 rounded-lg font-bold text-[11px]">
                Rocket / Upay
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              পেমেন্ট সম্পূর্ণ হওয়ার সাথে সাথেই সিস্টেমে অর্ডার অটো প্রসেস হয়।
            </p>
          </div>

          {/* Support */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              {language === 'bn' ? 'গ্রাহক সেবা ও যোগাযোগ' : 'Customer Support'}
            </h4>
            <p className="text-[11px] text-slate-400">
              যেকোনো প্রয়োজনে আমাদের WhatsApp হেল্পলাইনে মেসেজ দিন।
            </p>
            <a
              href={`https://wa.me/${gatewaySettings.whatsappSupport.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp সাপোর্ট</span>
            </a>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 border-t border-slate-900 text-center text-[11px] text-slate-500 space-y-1">
          <p>© {new Date().getFullYear()} Free Fire TopUp BD. All rights reserved.</p>
          <p className="text-[10px] text-slate-600">
            Free Fire is a registered trademark of Garena International. This platform provides third-party top-up services for players.
          </p>
        </div>
      </div>
    </footer>
  );
};
