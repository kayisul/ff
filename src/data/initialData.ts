import { Package, Order, User, GatewaySettings, WalletTransaction, ApiDispatchLog } from '../types';

export const INITIAL_PACKAGES: Package[] = [
  {
    id: 'pkg-25',
    name: '25 Diamonds',
    nameBn: '২৫ ডায়মন্ড',
    diamonds: 25,
    bonusDiamonds: 0,
    price: 22,
    originalPrice: 25,
    category: 'diamonds',
    inStock: true,
    description: 'Instant UID Top-Up for BD Server'
  },
  {
    id: 'pkg-50',
    name: '50 Diamonds',
    nameBn: '৫০ ডায়মন্ড',
    diamonds: 50,
    bonusDiamonds: 0,
    price: 40,
    originalPrice: 45,
    category: 'diamonds',
    inStock: true,
    description: 'Direct UID Delivery in 1-5 mins'
  },
  {
    id: 'pkg-115',
    name: '115 Diamonds',
    nameBn: '১১৫ ডায়মন্ড',
    diamonds: 100,
    bonusDiamonds: 15,
    price: 85,
    originalPrice: 95,
    category: 'diamonds',
    badge: 'জনপ্রিয় (Popular)',
    popular: true,
    inStock: true,
    description: '100 + 15 Bonus Diamonds'
  },
  {
    id: 'pkg-240',
    name: '240 Diamonds',
    nameBn: '২৪০ ডায়মন্ড',
    diamonds: 210,
    bonusDiamonds: 30,
    price: 175,
    originalPrice: 190,
    category: 'diamonds',
    inStock: true,
    description: '210 + 30 Bonus Diamonds'
  },
  {
    id: 'pkg-355',
    name: '355 Diamonds',
    nameBn: '৩৫৫ ডায়মন্ড',
    diamonds: 310,
    bonusDiamonds: 45,
    price: 260,
    originalPrice: 280,
    category: 'diamonds',
    badge: 'সেরা অফার (Best Deal)',
    popular: true,
    inStock: true,
    description: '310 + 45 Bonus Diamonds'
  },
  {
    id: 'pkg-505',
    name: '505 Diamonds',
    nameBn: '৫০৫ ডায়মন্ড',
    diamonds: 450,
    bonusDiamonds: 55,
    price: 365,
    originalPrice: 395,
    category: 'diamonds',
    inStock: true,
    description: '450 + 55 Bonus Diamonds'
  },
  {
    id: 'pkg-610',
    name: '610 Diamonds',
    nameBn: '৬১০ ডায়মন্ড',
    diamonds: 530,
    bonusDiamonds: 80,
    price: 440,
    originalPrice: 480,
    category: 'diamonds',
    inStock: true,
    description: '530 + 80 Bonus Diamonds'
  },
  {
    id: 'pkg-1090',
    name: '1090 Diamonds',
    nameBn: '১০৯০ ডায়মন্ড',
    diamonds: 950,
    bonusDiamonds: 140,
    price: 780,
    originalPrice: 850,
    category: 'diamonds',
    badge: 'মেগা ডিল',
    inStock: true,
    description: '950 + 140 Bonus Diamonds'
  },
  {
    id: 'pkg-2180',
    name: '2180 Diamonds',
    nameBn: '২১৮০ ডায়মন্ড',
    diamonds: 1900,
    bonusDiamonds: 280,
    price: 1550,
    originalPrice: 1680,
    category: 'diamonds',
    inStock: true,
    description: '1900 + 280 Bonus Diamonds'
  },
  // Memberships
  {
    id: 'pkg-weekly',
    name: 'Weekly Membership',
    nameBn: 'উইকলি মেম্বারশিপ',
    diamonds: 450,
    price: 165,
    originalPrice: 190,
    category: 'membership',
    badge: 'Hot Item',
    popular: true,
    inStock: true,
    description: 'Instant 100 Diamonds + 350 claimable (50/day)'
  },
  {
    id: 'pkg-monthly',
    name: 'Monthly Membership',
    nameBn: 'মান্থলি মেম্বারশিপ',
    diamonds: 2600,
    price: 790,
    originalPrice: 850,
    category: 'membership',
    badge: 'Super Saver',
    inStock: true,
    description: 'Instant 500 Diamonds + 2100 claimable (70/day)'
  },
  {
    id: 'pkg-levelup',
    name: 'Level Up Pass',
    nameBn: 'লেভেল আপ পাস',
    diamonds: 802,
    price: 180,
    originalPrice: 210,
    category: 'membership',
    inStock: true,
    description: 'Total 802 Diamonds as you level up to Lv.30'
  },
  // EVO Gun
  {
    id: 'pkg-evo-token',
    name: 'EVO Gun Token Box x10',
    nameBn: 'ইভো গান টোকেন বক্স (১০ টি)',
    diamonds: 120,
    price: 90,
    originalPrice: 110,
    category: 'evo_gun',
    inStock: true,
    description: 'Contains EVO weapon upgrade tokens'
  },
  // Special Airdrop
  {
    id: 'pkg-airdrop-95',
    name: 'Special Airdrop (৳95)',
    nameBn: 'স্পেশাল এয়ারড্রপ',
    diamonds: 300,
    price: 95,
    originalPrice: 120,
    category: 'special_airdrop',
    inStock: true,
    description: 'Direct in-game special airdrop pack'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'FF-98241',
    userEmail: 'fazlebarymahim@gmail.com',
    userPhone: '01712345678',
    playerId: '2849182391',
    playerNickname: '★BD_SNIPER★',
    packageId: 'pkg-355',
    packageName: '355 Diamonds',
    diamonds: 355,
    price: 260,
    paymentMethod: 'bkash',
    paymentStatus: 'paid',
    orderStatus: 'completed',
    trxId: 'BKH9A82J1K',
    createdAt: '2026-09-22T08:15:00.000Z',
    completedAt: '2026-09-22T08:17:30.000Z',
    notes: 'Auto delivered via UID api'
  },
  {
    id: 'ord-2',
    orderNumber: 'FF-98242',
    userEmail: 'tanvir.gamer@gmail.com',
    userPhone: '01898765432',
    playerId: '1948204918',
    playerNickname: 'TIGER_FIRE_BD',
    packageId: 'pkg-weekly',
    packageName: 'Weekly Membership',
    diamonds: 450,
    price: 165,
    paymentMethod: 'nagad',
    paymentStatus: 'paid',
    orderStatus: 'completed',
    trxId: 'NGD7X42P0M',
    createdAt: '2026-09-22T08:42:00.000Z',
    completedAt: '2026-09-22T08:44:10.000Z'
  },
  {
    id: 'ord-3',
    orderNumber: 'FF-98243',
    userEmail: 'rahim.gamer99@yahoo.com',
    userPhone: '01655443322',
    playerId: '3049182042',
    playerNickname: 'SHADOW_K1LLER',
    packageId: 'pkg-115',
    packageName: '115 Diamonds',
    diamonds: 115,
    price: 85,
    paymentMethod: 'bkash',
    paymentStatus: 'paid',
    orderStatus: 'processing',
    trxId: 'BKH2M91Z7Q',
    createdAt: '2026-09-22T09:05:00.000Z'
  },
  {
    id: 'ord-4',
    orderNumber: 'FF-98244',
    userPhone: '01911223344',
    playerId: '1829401923',
    playerNickname: 'PRO_NOOB_FF',
    packageId: 'pkg-505',
    packageName: '505 Diamonds',
    diamonds: 505,
    price: 365,
    paymentMethod: 'rocket',
    paymentStatus: 'paid',
    orderStatus: 'pending',
    trxId: 'RKT9918274',
    senderNumber: '01911223344',
    createdAt: '2026-09-22T09:12:00.000Z',
    notes: 'Awaiting admin manual verification'
  }
];

export const INITIAL_GATEWAY_SETTINGS: GatewaySettings = {
  appUrl: 'https://fftopupbd.com',
  showLatestOrdersButton: true,
  activeTopUpApi: 'auto_shell',
  autoShell: {
    enabled: true,
    region: 'BD',
    username: 'garena_bd_reseller_official',
    apiKey: 'shl_live_992481029148bd',
    currentShellBalance: 3450,
  },
  unipin: {
    enabled: true,
    partnerId: 'UP_BD_PARTNER_8829',
    secretKey: 'up_sec_live_771928401928',
    currentBalance: 14250,
    currency: 'BDT',
  },
  bkash: {
    active: true,
    isSandbox: true,
    baseUrl: 'https://tokenized.sandbox.bka.sh/v1.2.0-beta',
    appKey: '4f6o9ilh32n6b2df181p426vdg',
    appSecret: '2is7hdktrekvrflqjhbfm162bv18a1a921d7',
    username: 'sandboxTokenizedUser02',
    password: 'sandboxTokenizedPassword02@',
    merchantNumber: '01877722233'
  },
  nagad: {
    active: true,
    isSandbox: true,
    baseUrl: 'http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0',
    merchantId: '6831102919381',
    merchantNumber: '01799988811',
    pgPublicKeyPath: '/storage/nagad/nagad_pg_public_key.pem',
    merchantPrivateKeyPath: '/storage/nagad/merchant_private_key.pem'
  },
  rocket: {
    active: true,
    merchantNumber: '01977766655-8',
    instructions: 'ডায়াল করুন *322# অথবা রকেট অ্যাপ থেকে "Send Money" বা "Merchant Pay" করুন।'
  },
  upay: {
    active: true,
    merchantNumber: '01988877766',
    instructions: 'ডায়াল করুন *268# অথবা উপায় অ্যাপ থেকে "Send Money" করুন।'
  },
  notice: '🔥 অফার চলছে! bKash বা Nagad-এ তাৎক্ষণিক ১-৩ মিনিটের মধ্যে ডায়মন্ড আপনার আইডিতে চলে যাবে। শুধুমাত্র সঠিক Player ID (UID) দিন।',
  whatsappSupport: '+8801700000000',
  customEnvVars: [
    { key: 'SMS_GATEWAY_API_KEY', value: 'sms_live_key_998124', description: 'বাল্ক এসএমএস গেটওয়ে এপিআই কি' },
    { key: 'GARENA_SHELL_API_KEY', value: 'shl_live_992481029148bd', description: 'গ্যারিনা অটো শেল রিডেম্পশন এপিআই কি' },
    { key: 'UNIPIN_SECRET_KEY', value: 'up_sec_live_771928401928', description: 'ইউনিপিন পার্টনার সিক্রেট এপিআই কি' }
  ]
};

export const INITIAL_API_DISPATCH_LOGS: ApiDispatchLog[] = [
  {
    id: 'disp-1',
    orderNumber: 'FF-98242',
    playerId: '1948204918',
    packageName: 'Weekly Membership',
    diamonds: 450,
    provider: 'auto_shell',
    status: 'success',
    message: 'Garena Shell Redeem Server: 100 Shells redeemed successfully. Player TIGER_FIRE_BD received Weekly Pass.',
    cost: '100 Shells',
    timestamp: '2026-09-22T08:44:10.000Z'
  },
  {
    id: 'disp-2',
    orderNumber: 'FF-98241',
    playerId: '2849182391',
    packageName: '240 Diamonds',
    diamonds: 240,
    provider: 'unipin',
    status: 'success',
    message: 'UniPin Direct UID Gateway: TransID UP_BD_99182 successful. 240 Diamonds injected to player RAFI_GAMER.',
    cost: '৳175 BDT',
    timestamp: '2026-09-22T08:16:30.000Z'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Admin Manager',
    email: 'admin@fftopup.com',
    phone: '01700000000',
    role: 'admin',
    walletBalance: 0,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'user-demo',
    name: 'Fazle Bary Mahim',
    email: 'fazlebarymahim@gmail.com',
    phone: '01712345678',
    role: 'user',
    walletBalance: 500,
    savedPlayerIds: ['2849182391', '1948204918'],
    createdAt: '2026-03-10T12:00:00.000Z'
  }
];

export const INITIAL_WALLET_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'wtx-1',
    userId: 'user-demo',
    userEmail: 'fazlebarymahim@gmail.com',
    type: 'deposit',
    amount: 500,
    paymentMethod: 'bkash',
    trxId: 'BKH9912891',
    description: 'ওয়ালেট রিচার্জ (bKash Tokenized Auto)',
    status: 'completed',
    createdAt: '2026-09-21T14:30:00.000Z'
  }
];
