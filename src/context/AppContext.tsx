import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Package, 
  Order, 
  User, 
  GatewaySettings, 
  OrderStatus, 
  WalletTransaction, 
  PaymentMethodType,
  TopUpApiProvider,
  AutoShellConfig,
  UniPinConfig,
  ApiDispatchLog
} from '../types';
import { 
  INITIAL_PACKAGES, 
  INITIAL_ORDERS, 
  INITIAL_GATEWAY_SETTINGS, 
  INITIAL_USERS, 
  INITIAL_WALLET_TRANSACTIONS,
  INITIAL_API_DISPATCH_LOGS 
} from '../data/initialData';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  language: 'bn' | 'en';
  setLanguage: (lang: 'bn' | 'en') => void;
  packages: Package[];
  orders: Order[];
  users: User[];
  currentUser: User | null;
  gatewaySettings: GatewaySettings;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  // Order actions
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'orderStatus'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  deleteOrder: (orderId: string) => void;
  // Wallet actions
  walletTransactions: WalletTransaction[];
  addWalletFunds: (amount: number, method: PaymentMethodType, trxId?: string) => boolean;
  payWithWallet: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'orderStatus' | 'paymentMethod' | 'paymentStatus' | 'trxId'>) => Order | null;
  adjustUserWallet: (userId: string, amount: number, type: 'credit' | 'debit', reason: string) => boolean;
  // Package actions
  addPackage: (pkg: Omit<Package, 'id'>) => void;
  updatePackage: (id: string, pkg: Partial<Package>) => void;
  deletePackage: (id: string) => void;
  // Gateway & System actions
  updateGatewaySettings: (settings: Partial<GatewaySettings>) => void;
  toggleLatestOrdersButton: (forceVal?: boolean) => void;
  // Auto Shell / UniPin API Actions
  apiDispatchLogs: ApiDispatchLog[];
  setActiveTopUpApi: (provider: TopUpApiProvider) => void;
  updateAutoShellConfig: (config: Partial<AutoShellConfig>) => void;
  updateUniPinConfig: (config: Partial<UniPinConfig>) => void;
  dispatchAutoTopUp: (orderId: string) => Promise<{ success: boolean; message: string }>;
  testApiConnection: (provider: TopUpApiProvider, testUid: string) => Promise<{ success: boolean; message: string; latencyMs: number; nickname?: string }>;
  // Auth
  login: (email: string, pass: string) => { success: boolean; message: string };
  register: (name: string, email: string, phone: string, pass: string) => { success: boolean; message: string };
  logout: () => void;
  savePlayerId: (playerId: string) => void;
  quickSwitchToAdmin: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'bn' | 'en'>(() => {
    return (localStorage.getItem('ff_lang') as 'bn' | 'en') || 'bn';
  });

  const [packages, setPackages] = useState<Package[]>(() => {
    const saved = localStorage.getItem('ff_packages');
    return saved ? JSON.parse(saved) : INITIAL_PACKAGES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ff_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [gatewaySettings, setGatewaySettings] = useState<GatewaySettings>(() => {
    const saved = localStorage.getItem('ff_gateways');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_GATEWAY_SETTINGS,
          ...parsed,
          autoShell: { ...INITIAL_GATEWAY_SETTINGS.autoShell, ...(parsed.autoShell || {}) },
          unipin: { ...INITIAL_GATEWAY_SETTINGS.unipin, ...(parsed.unipin || {}) },
          showLatestOrdersButton: parsed.showLatestOrdersButton !== undefined ? parsed.showLatestOrdersButton : INITIAL_GATEWAY_SETTINGS.showLatestOrdersButton,
          activeTopUpApi: parsed.activeTopUpApi || INITIAL_GATEWAY_SETTINGS.activeTopUpApi,
        };
      } catch {
        return INITIAL_GATEWAY_SETTINGS;
      }
    }
    return INITIAL_GATEWAY_SETTINGS;
  });

  const [apiDispatchLogs, setApiDispatchLogs] = useState<ApiDispatchLog[]>(() => {
    const saved = localStorage.getItem('ff_api_dispatch_logs');
    return saved ? JSON.parse(saved) : INITIAL_API_DISPATCH_LOGS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ff_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { walletBalance: parsed.walletBalance ?? 0, ...parsed };
      } catch {
        return null;
      }
    }
    return null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ff_users');
    if (saved) {
      try {
        return JSON.parse(saved).map((u: User) => ({
          ...u,
          walletBalance: u.walletBalance ?? (u.role === 'admin' ? 0 : 500),
        }));
      } catch {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem('ff_wallet_tx');
    return saved ? JSON.parse(saved) : INITIAL_WALLET_TRANSACTIONS;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    localStorage.setItem('ff_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('ff_packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('ff_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ff_gateways', JSON.stringify(gatewaySettings));
  }, [gatewaySettings]);

  useEffect(() => {
    localStorage.setItem('ff_api_dispatch_logs', JSON.stringify(apiDispatchLogs));
  }, [apiDispatchLogs]);

  useEffect(() => {
    localStorage.setItem('ff_wallet_tx', JSON.stringify(walletTransactions));
  }, [walletTransactions]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ff_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ff_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ff_users', JSON.stringify(users));
  }, [users]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setLanguage = (lang: 'bn' | 'en') => {
    setLanguageState(lang);
  };

  const placeOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'orderStatus'>): Order => {
    // Admin check: Admin is strictly prohibited from placing orders
    if (currentUser?.role === 'admin') {
      addToast(
        language === 'bn'
          ? '❌ অ্যাডমিন একাউন্ট থেকে ডায়মন্ড অর্ডার করা যাবে না! দয়া করে সাধারণ গ্রাহক হিসেবে লগইন করুন।'
          : '❌ Admin accounts cannot place diamond orders! Please use a regular customer account.',
        'error'
      );
      throw new Error('Admin cannot place diamond orders');
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `FF-${randomNum}`,
      createdAt: new Date().toISOString(),
      orderStatus: orderData.paymentStatus === 'paid' ? 'processing' : 'pending',
    };

    setOrders((prev) => [newOrder, ...prev]);

    // If order was auto-paid via bKash/Nagad simulator, trigger auto-delivery via active API (Auto Shell or UniPin)!
    if (newOrder.paymentStatus === 'paid') {
      setTimeout(() => {
        dispatchAutoTopUp(newOrder.id);
      }, 4000);
    }

    return newOrder;
  };

  // Wallet payment handler
  const payWithWallet = (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'orderStatus' | 'paymentMethod' | 'paymentStatus' | 'trxId'>
  ): Order | null => {
    if (!currentUser) {
      addToast(
        language === 'bn' ? 'ওয়ালেট দিয়ে পেমেন্ট করতে লগইন করুন' : 'Please login to pay with wallet',
        'error'
      );
      return null;
    }

    if (currentUser.role === 'admin') {
      addToast(
        language === 'bn'
          ? '❌ অ্যাডমিন অ্যাকাউন্ট থেকে ডায়মন্ড অর্ডার করা যাবে না!'
          : '❌ Admin accounts cannot place diamond orders!',
        'error'
      );
      return null;
    }

    const currentBal = currentUser.walletBalance ?? 0;
    if (currentBal < orderData.price) {
      addToast(
        language === 'bn'
          ? `❌ ওয়ালেটে অপর্যাপ্ত ব্যালেন্স! আপনার ব্যালেন্স ৳${currentBal}, কিন্তু প্রয়োজন ৳${orderData.price}`
          : `❌ Insufficient wallet balance! You have ৳${currentBal}, but need ৳${orderData.price}`,
        'error'
      );
      return null;
    }

    const newBalance = currentBal - orderData.price;
    const updatedUser: User = { ...currentUser, walletBalance: newBalance };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newOrderNumber = `FF-${randomNum}`;
    const txId = `WLT${Date.now().toString().slice(-8)}`;

    const newTx: WalletTransaction = {
      id: `wtx-${Date.now()}`,
      userId: currentUser.id,
      userEmail: currentUser.email,
      type: 'purchase',
      amount: orderData.price,
      paymentMethod: 'wallet',
      trxId: txId,
      orderNumber: newOrderNumber,
      description: `ডায়মন্ড ক্রয় (${orderData.packageName})`,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    setWalletTransactions((prev) => [newTx, ...prev]);

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      paymentMethod: 'wallet',
      paymentStatus: 'paid',
      trxId: txId,
      orderStatus: 'processing',
      createdAt: new Date().toISOString(),
      notes: 'Paid instantly with FF Wallet',
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Instant auto delivery via active Top-Up API in 3s
    setTimeout(() => {
      dispatchAutoTopUp(newOrder.id);
    }, 3000);

    addToast(
      language === 'bn'
        ? `✅ ওয়ালেট থেকে ৳${orderData.price} কাটা হয়েছে। অবশিষ্ট ব্যালেন্স: ৳${newBalance}`
        : `✅ ৳${orderData.price} deducted from wallet. Remaining: ৳${newBalance}`,
      'success'
    );

    return newOrder;
  };

  // Add funds to current user wallet
  const addWalletFunds = (amount: number, method: PaymentMethodType, trxId?: string): boolean => {
    if (!currentUser) {
      addToast(language === 'bn' ? 'ওয়ালেট রিচার্জ করতে লগইন করুন' : 'Please login to add wallet funds', 'error');
      return false;
    }

    const currentBal = currentUser.walletBalance ?? 0;
    const newBalance = currentBal + amount;
    const updatedUser: User = { ...currentUser, walletBalance: newBalance };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));

    const actualTrxId = trxId || `${method.toUpperCase()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newTx: WalletTransaction = {
      id: `wtx-${Date.now()}`,
      userId: currentUser.id,
      userEmail: currentUser.email,
      type: 'deposit',
      amount,
      paymentMethod: method,
      trxId: actualTrxId,
      description: `ওয়ালেট রিচার্জ (${method.toUpperCase()})`,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    setWalletTransactions((prev) => [newTx, ...prev]);

    addToast(
      language === 'bn'
        ? `🎉 ওয়ালেটে ৳${amount} সফলভাবে যোগ হয়েছে! বর্তমান ব্যালেন্স: ৳${newBalance}`
        : `🎉 ৳${amount} added to wallet successfully! Balance: ৳${newBalance}`,
      'success'
    );

    return true;
  };

  // Admin adjust any user wallet
  const adjustUserWallet = (userId: string, amount: number, type: 'credit' | 'debit', reason: string): boolean => {
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) {
      addToast('User not found', 'error');
      return false;
    }

    const currentBal = targetUser.walletBalance ?? 0;
    const newBalance = type === 'credit' ? currentBal + amount : Math.max(0, currentBal - amount);
    const updatedUser: User = { ...targetUser, walletBalance: newBalance };

    setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
    if (currentUser?.id === userId) {
      setCurrentUser(updatedUser);
    }

    const newTx: WalletTransaction = {
      id: `wtx-${Date.now()}`,
      userId: targetUser.id,
      userEmail: targetUser.email,
      type: 'admin_adjustment',
      amount: type === 'credit' ? amount : -amount,
      description: reason || (type === 'credit' ? 'অ্যাডমিন ক্রেডিট অ্যাডজাস্টমেন্ট' : 'অ্যাডমিন ডেবিট অ্যাডজাস্টমেন্ট'),
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    setWalletTransactions((prev) => [newTx, ...prev]);

    addToast(
      language === 'bn'
        ? `${targetUser.name}-এর ওয়ালেট ${type === 'credit' ? 'ক্রেডিট' : 'ডেবিট'} করা হয়েছে ৳${amount}। নতুন ব্যালেন্স: ৳${newBalance}`
        : `Adjusted ${targetUser.name}'s wallet by ${type === 'credit' ? '+' : '-'}৳${amount}. New balance: ৳${newBalance}`,
      'success'
    );

    return true;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, notes?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            orderStatus: status,
            notes: notes !== undefined ? notes : o.notes,
            completedAt: status === 'completed' ? new Date().toISOString() : o.completedAt,
          };
        }
        return o;
      })
    );
    addToast(
      language === 'bn'
        ? `অর্ডারের স্ট্যাটাস আপডেট করা হয়েছে (${status})`
        : `Order status updated to ${status}`,
      'success'
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    addToast(language === 'bn' ? 'অর্ডার মুছে ফেলা হয়েছে' : 'Order deleted', 'info');
  };

  const addPackage = (pkg: Omit<Package, 'id'>) => {
    const newPkg: Package = {
      ...pkg,
      id: `pkg-${Date.now()}`,
    };
    setPackages((prev) => [...prev, newPkg]);
    addToast(language === 'bn' ? 'নতুন প্যাকেজ যোগ করা হয়েছে' : 'New package added', 'success');
  };

  const updatePackage = (id: string, updatedFields: Partial<Package>) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    addToast(language === 'bn' ? 'প্যাকেজ আপডেট করা হয়েছে' : 'Package updated', 'success');
  };

  const deletePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
    addToast(language === 'bn' ? 'প্যাকেজ ডিলিট করা হয়েছে' : 'Package deleted', 'info');
  };

  const updateGatewaySettings = (newSettings: Partial<GatewaySettings>) => {
    setGatewaySettings((prev) => ({ ...prev, ...newSettings }));
    addToast(
      language === 'bn' ? 'গেটওয়ে সেটিংস সেভ করা হয়েছে' : 'Gateway settings saved',
      'success'
    );
  };

  const login = (email: string, pass: string): { success: boolean; message: string } => {
    // Admin check from user prompt
    if (email === 'admin@fftopup.com' && pass === 'admin12345') {
      const adminUser: User = users.find((u) => u.role === 'admin') || {
        id: 'user-admin',
        name: 'Admin Manager',
        email: 'admin@fftopup.com',
        phone: '01700000000',
        role: 'admin' as const,
        walletBalance: 0,
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(adminUser);
      addToast(language === 'bn' ? 'অ্যাডমিন হিসেবে লগইন সফল!' : 'Logged in as Admin!', 'success');
      return { success: true, message: 'Logged in as admin' };
    }

    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      addToast(language === 'bn' ? `স্বাগতম, ${found.name}!` : `Welcome, ${found.name}!`, 'success');
      return { success: true, message: 'Logged in successfully' };
    }

    // Allow quick user login with any demo email
    if (email.includes('@')) {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        phone: '017XXXXXXXX',
        role: 'user',
        walletBalance: 500,
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      addToast(language === 'bn' ? 'লগইন সফল! (৳৫০০ স্বাগতম বোনাস)' : 'Logged in successfully! (৳500 Welcome Bonus)', 'success');
      return { success: true, message: 'Welcome!' };
    }

    return {
      success: false,
      message: language === 'bn' ? 'ভুল ইমেইল অথবা পাসওয়ার্ড' : 'Invalid email or password',
    };
  };

  const register = (
    name: string,
    email: string,
    phone: string,
    _pass: string
  ): { success: boolean; message: string } => {
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return {
        success: false,
        message: language === 'bn' ? 'এই ইমেইল ইতিমধ্যে রেজিস্টার করা আছে' : 'Email already exists',
      };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role: 'user',
      walletBalance: 500,
      savedPlayerIds: [],
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    addToast(language === 'bn' ? 'রেজিস্ট্রেশন সফল হয়েছে! (৳৫০০ ফ্রি ওয়ালেট ব্যালেন্স যোগ হয়েছে)' : 'Registered successfully! (৳500 Free Wallet Balance Added)', 'success');
    return { success: true, message: 'Account created' };
  };

  const logout = () => {
    setCurrentUser(null);
    addToast(language === 'bn' ? 'লগআউট করা হয়েছে' : 'Logged out', 'info');
  };

  const savePlayerId = (playerId: string) => {
    if (!currentUser) return;
    const currentList = currentUser.savedPlayerIds || [];
    if (!currentList.includes(playerId)) {
      const updatedUser: User = {
        ...currentUser,
        savedPlayerIds: [playerId, ...currentList].slice(0, 5),
      };
      setCurrentUser(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    }
  };

  const quickSwitchToAdmin = () => {
    const adminUser: User = {
      id: 'user-admin',
      name: 'FF TopUp Admin',
      email: 'admin@fftopup.com',
      phone: '01700000000',
      role: 'admin',
      walletBalance: 0,
      createdAt: '2026-01-01T00:00:00.000Z',
    };
    setCurrentUser(adminUser);
    addToast(language === 'bn' ? 'অ্যাডমিন মোডে সুইচ করা হয়েছে' : 'Switched to Admin Mode', 'success');
  };

  // Toggle 'সর্বশেষ অর্ডার' button in customer navbar
  const toggleLatestOrdersButton = (forceVal?: boolean) => {
    setGatewaySettings((prev) => {
      const nextVal = typeof forceVal === 'boolean' ? forceVal : !prev.showLatestOrdersButton;
      addToast(
        language === 'bn'
          ? nextVal 
            ? '✅ গ্রাহক মেনুতে "সর্বশেষ অর্ডার" বাটন চালু করা হয়েছে' 
            : '🔒 গ্রাহক মেনু থেকে "সর্বশেষ অর্ডার" বাটন বন্ধ (হাইড) করা হয়েছে'
          : nextVal 
            ? '✅ "Latest Orders" button enabled in customer navbar' 
            : '🔒 "Latest Orders" button disabled in customer navbar',
        'info'
      );
      return { ...prev, showLatestOrdersButton: nextVal };
    });
  };

  // Switch between Auto Shell, UniPin, or Manual
  const setActiveTopUpApi = (provider: TopUpApiProvider) => {
    setGatewaySettings((prev) => ({
      ...prev,
      activeTopUpApi: provider,
    }));
    const names: Record<TopUpApiProvider, string> = {
      auto_shell: 'Garena Auto Shell API (গ্যারিনা শেল)',
      unipin: 'UniPin Direct Top-Up API (ইউনিপিন)',
      manual: 'Manual Processing (ম্যানুয়াল মোড)',
    };
    addToast(
      language === 'bn'
        ? `সক্রিয় টপ-আপ এপিআই পরিবর্তন করা হয়েছে: ${names[provider]}`
        : `Active Top-Up API switched to: ${names[provider]}`,
      'success'
    );
  };

  const updateAutoShellConfig = (config: Partial<AutoShellConfig>) => {
    setGatewaySettings((prev) => ({
      ...prev,
      autoShell: { ...prev.autoShell, ...config },
    }));
    addToast(language === 'bn' ? 'গ্যারিনা অটো শেল সেটিংস সেভ হয়েছে' : 'Auto Shell settings saved', 'success');
  };

  const updateUniPinConfig = (config: Partial<UniPinConfig>) => {
    setGatewaySettings((prev) => ({
      ...prev,
      unipin: { ...prev.unipin, ...config },
    }));
    addToast(language === 'bn' ? 'ইউনিপিন এপিআই কনফিগারেশন সেভ হয়েছে' : 'UniPin settings saved', 'success');
  };

  // Automated Top-Up Dispatcher (Garena Shell or UniPin)
  const dispatchAutoTopUp = async (orderId: string): Promise<{ success: boolean; message: string }> => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) {
      return { success: false, message: 'অর্ডার পাওয়া যায়নি' };
    }

    const provider = gatewaySettings.activeTopUpApi;
    if (provider === 'manual') {
      updateOrderStatus(orderId, 'processing', 'অ্যাডমিন ম্যানুয়াল ডেলিভারির অপেক্ষায়');
      return { 
        success: true, 
        message: language === 'bn' 
          ? 'ম্যানুয়াল মোড সক্রিয়: অ্যাডমিন ড্যাশবোর্ড থেকে আইডি কোড দিয়ে ডায়মন্ড পাঠানো হবে।' 
          : 'Manual mode active: admin will deliver diamonds manually.' 
      };
    }

    const diamonds = targetOrder.diamonds;
    const playerId = targetOrder.playerId;

    if (provider === 'auto_shell') {
      const requiredShells = Math.max(10, Math.ceil(diamonds * 0.42));
      const currentShells = gatewaySettings.autoShell.currentShellBalance ?? 0;

      if (currentShells < requiredShells) {
        const failLog: ApiDispatchLog = {
          id: `disp-${Date.now()}`,
          orderId: targetOrder.id,
          orderNumber: targetOrder.orderNumber,
          playerId,
          packageName: targetOrder.packageName,
          diamonds,
          provider: 'auto_shell',
          status: 'failed',
          message: `Garena Shell Server Error: Insufficient Shells in Reseller Account. Required: ${requiredShells} Shells, Available: ${currentShells} Shells.`,
          cost: `${requiredShells} Shells`,
          costInShells: requiredShells,
          timestamp: new Date().toISOString(),
        };
        setApiDispatchLogs((prev) => [failLog, ...prev]);
        addToast(
          language === 'bn'
            ? `⚠️ গ্যারিনা শেল ব্যালেন্স অপর্যাপ্ত! প্রয়োজন ${requiredShells} শেল, আছে ${currentShells} শেল।`
            : `⚠️ Insufficient Garena Shells! Needed: ${requiredShells}, Available: ${currentShells}`,
          'error'
        );
        return { success: false, message: 'Insufficient shell balance' };
      }

      // Deduct Shells
      const newShellBalance = currentShells - requiredShells;
      setGatewaySettings((prev) => ({
        ...prev,
        autoShell: {
          ...prev.autoShell,
          currentShellBalance: newShellBalance,
        },
      }));

      const apiTxId = `SHL-BD-${Date.now().toString().slice(-6)}`;
      const successMsg = `Garena Shell Auto-Redeem: ${requiredShells} Shells deducted. Diamonds dispatched to Player UID: ${playerId}. API Tx: ${apiTxId}`;

      const newLog: ApiDispatchLog = {
        id: `disp-${Date.now()}`,
        orderId: targetOrder.id,
        orderNumber: targetOrder.orderNumber,
        playerId,
        packageName: targetOrder.packageName,
        diamonds,
        provider: 'auto_shell',
        status: 'success',
        message: successMsg,
        cost: `${requiredShells} Shells`,
        costInShells: requiredShells,
        apiTransactionId: apiTxId,
        timestamp: new Date().toISOString(),
      };
      setApiDispatchLogs((prev) => [newLog, ...prev]);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                orderStatus: 'completed',
                completedAt: new Date().toISOString(),
                apiProvider: 'auto_shell',
                apiTxId,
                notes: `Auto Shell API Success (Tx: ${apiTxId}) - ${diamonds} 💎 delivered to UID: ${playerId}`,
              }
            : o
        )
      );

      addToast(
        language === 'bn'
          ? `⚡ [Garena Auto Shell]: প্লেয়ার ${playerId}-তে ${diamonds} ডায়মন্ড সফলভাবে টপ-আপ সম্পন্ন হয়েছে!`
          : `⚡ [Garena Auto Shell]: ${diamonds} Diamonds delivered to Player ${playerId}!`,
        'success'
      );
      return { success: true, message: successMsg };
    }

    if (provider === 'unipin') {
      const costBdt = targetOrder.price;
      const currentUniPinBal = gatewaySettings.unipin.currentBalance ?? 0;

      if (currentUniPinBal < costBdt) {
        const failLog: ApiDispatchLog = {
          id: `disp-${Date.now()}`,
          orderId: targetOrder.id,
          orderNumber: targetOrder.orderNumber,
          playerId,
          packageName: targetOrder.packageName,
          diamonds,
          provider: 'unipin',
          status: 'failed',
          message: `UniPin Direct Gateway Error: Partner credit exhausted. Required: ৳${costBdt}, Available: ৳${currentUniPinBal}`,
          cost: `৳${costBdt}`,
          costInBdt: costBdt,
          timestamp: new Date().toISOString(),
        };
        setApiDispatchLogs((prev) => [failLog, ...prev]);
        addToast(
          language === 'bn'
            ? `⚠️ ইউনিপিন পার্টনার ব্যালেন্স অপর্যাপ্ত! প্রয়োজন ৳${costBdt}, আছে ৳${currentUniPinBal}`
            : `⚠️ Insufficient UniPin Balance! Needed: ৳${costBdt}, Available: ৳${currentUniPinBal}`,
          'error'
        );
        return { success: false, message: 'Insufficient UniPin balance' };
      }

      // Deduct UniPin balance
      const newUniPinBal = currentUniPinBal - costBdt;
      setGatewaySettings((prev) => ({
        ...prev,
        unipin: {
          ...prev.unipin,
          currentBalance: newUniPinBal,
        },
      }));

      const apiTxId = `UP-BD-${Date.now().toString().slice(-6)}`;
      const successMsg = `UniPin Direct Express Top-Up: ৳${costBdt} debited. ${diamonds} Diamonds injected to Free Fire UID: ${playerId}. API Ref: ${apiTxId}`;

      const newLog: ApiDispatchLog = {
        id: `disp-${Date.now()}`,
        orderId: targetOrder.id,
        orderNumber: targetOrder.orderNumber,
        playerId,
        packageName: targetOrder.packageName,
        diamonds,
        provider: 'unipin',
        status: 'success',
        message: successMsg,
        cost: `৳${costBdt}`,
        costInBdt: costBdt,
        apiTransactionId: apiTxId,
        timestamp: new Date().toISOString(),
      };
      setApiDispatchLogs((prev) => [newLog, ...prev]);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                orderStatus: 'completed',
                completedAt: new Date().toISOString(),
                apiProvider: 'unipin',
                apiTxId,
                notes: `UniPin API Success (Ref: ${apiTxId}) - ${diamonds} 💎 delivered to UID: ${playerId}`,
              }
            : o
        )
      );

      addToast(
        language === 'bn'
          ? `💎 [UniPin API]: প্লেয়ার ${playerId}-তে ${diamonds} ডায়মন্ড সফলভাবে টপ-আপ সম্পন্ন হয়েছে!`
          : `💎 [UniPin API]: ${diamonds} Diamonds delivered to Player ${playerId}!`,
        'success'
      );
      return { success: true, message: successMsg };
    }

    return { success: false, message: 'Unknown provider' };
  };

  // Test Ping and UID check
  const testApiConnection = async (
    provider: TopUpApiProvider,
    testUid: string
  ): Promise<{ success: boolean; message: string; latencyMs: number; nickname?: string }> => {
    const start = performance.now();
    await new Promise((r) => setTimeout(r, 600));
    const latency = Math.round(performance.now() - start);

    if (!testUid || testUid.length < 6) {
      return {
        success: false,
        message: language === 'bn' ? 'সঠিক ফ্রি ফায়ার প্লেয়ার আইডি (UID) দিন' : 'Please provide a valid Free Fire Player UID',
        latencyMs: latency,
      };
    }

    const sampleNicknames = ['TIGER_FIRE_BD', 'PRO_SNIPER_99', 'RAFI_GAMER_FF', 'BD_WARRIOR_007', 'APEX_LEGEND_BD'];
    const assignedNickname = sampleNicknames[Math.abs(testUid.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % sampleNicknames.length];

    if (provider === 'auto_shell') {
      return {
        success: true,
        message: `HTTP 200 OK — Garena Auto Shell (${gatewaySettings.autoShell.region} Server) API Connected. Available Shells: ${(gatewaySettings.autoShell.currentShellBalance ?? 0).toLocaleString()}. Verified Player: ${assignedNickname} (UID: ${testUid})`,
        latencyMs: latency,
        nickname: assignedNickname,
      };
    } else if (provider === 'unipin') {
      return {
        success: true,
        message: `HTTP 200 OK — UniPin Direct Top-Up Partner Gateway Active. Available Credit: ৳${(gatewaySettings.unipin.currentBalance ?? 0).toLocaleString()} ${gatewaySettings.unipin.currency}. Verified Player: ${assignedNickname} (UID: ${testUid})`,
        latencyMs: latency,
        nickname: assignedNickname,
      };
    } else {
      return {
        success: true,
        message: 'ম্যানুয়াল মোড সক্রিয়: কোনো বহিঃস্থ এপিআই কল করা হবে না।',
        latencyMs: 15,
        nickname: assignedNickname,
      };
    }
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        packages,
        orders,
        users,
        currentUser,
        gatewaySettings,
        toasts,
        addToast,
        removeToast,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        walletTransactions,
        addWalletFunds,
        payWithWallet,
        adjustUserWallet,
        addPackage,
        updatePackage,
        deletePackage,
        updateGatewaySettings,
        toggleLatestOrdersButton,
        apiDispatchLogs,
        setActiveTopUpApi,
        updateAutoShellConfig,
        updateUniPinConfig,
        dispatchAutoTopUp,
        testApiConnection,
        login,
        register,
        logout,
        savePlayerId,
        quickSwitchToAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
