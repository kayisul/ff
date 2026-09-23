export type Category = 'diamonds' | 'membership' | 'evo_gun' | 'special_airdrop';

export interface Package {
  id: string;
  name: string;
  nameBn: string;
  diamonds: number;
  bonusDiamonds?: number;
  price: number;
  originalPrice?: number;
  category: Category;
  badge?: string;
  popular?: boolean;
  inStock: boolean;
  description?: string;
}

export type PaymentMethodType = 'bkash' | 'nagad' | 'rocket' | 'upay' | 'wallet';

export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface WalletTransaction {
  id: string;
  userId: string;
  userEmail?: string;
  type: 'deposit' | 'purchase' | 'refund' | 'admin_adjustment';
  amount: number;
  paymentMethod?: PaymentMethodType;
  trxId?: string;
  orderNumber?: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  userEmail?: string;
  userPhone: string;
  playerId: string; // Free Fire UID
  playerNickname?: string;
  packageId: string;
  packageName: string;
  diamonds: number;
  price: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trxId: string;
  senderNumber?: string;
  createdAt: string;
  completedAt?: string;
  notes?: string;
  apiProvider?: TopUpApiProvider;
  apiTxId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  walletBalance: number;
  savedPlayerIds?: string[];
  createdAt: string;
}

export type TopUpApiProvider = 'auto_shell' | 'unipin' | 'manual';

export interface AutoShellConfig {
  enabled: boolean;
  region: 'BD' | 'MY' | 'SG';
  username: string;
  apiKey: string;
  currentShellBalance: number;
}

export interface UniPinConfig {
  enabled: boolean;
  partnerId: string;
  secretKey: string;
  currentBalance: number;
  currency: string;
}

export interface ApiDispatchLog {
  id: string;
  orderId?: string;
  orderNumber: string;
  playerId: string;
  packageName: string;
  diamonds: number;
  provider: TopUpApiProvider;
  status: 'success' | 'failed' | 'processing';
  message: string;
  cost: string;
  costInShells?: number;
  costInBdt?: number;
  apiTransactionId?: string;
  timestamp: string;
}

export interface GatewaySettings {
  appUrl: string;
  showLatestOrdersButton: boolean; // Admin can toggle the 'সর্বশেষ অর্ডার' button on/off
  activeTopUpApi: TopUpApiProvider; // Admin chooses 'auto_shell', 'unipin', or 'manual'
  autoShell: AutoShellConfig;
  unipin: UniPinConfig;
  bkash: {
    active: boolean;
    isSandbox: boolean;
    baseUrl: string;
    appKey: string;
    appSecret: string;
    username: string;
    password: string;
    merchantNumber: string;
  };
  nagad: {
    active: boolean;
    isSandbox: boolean;
    baseUrl: string;
    merchantId: string;
    merchantNumber: string;
    pgPublicKeyPath: string;
    merchantPrivateKeyPath: string;
  };
  rocket: {
    active: boolean;
    merchantNumber: string;
    instructions: string;
  };
  upay: {
    active: boolean;
    merchantNumber: string;
    instructions: string;
  };
  notice: string;
  whatsappSupport: string;
  customEnvVars?: Array<{ key: string; value: string; description?: string }>;
}
