import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { TopUpStore } from './components/TopUpStore';
import { OrderTracker } from './components/OrderTracker';
import { UserOrders } from './components/UserOrders';
import { AdminPanel } from './components/AdminPanel';
import { BkashModal } from './components/BkashModal';
import { NagadModal } from './components/NagadModal';
import { ManualPaymentModal } from './components/ManualPaymentModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AuthModal } from './components/AuthModal';
import { WalletModal } from './components/WalletModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';
import { Package, PaymentMethodType, Order } from './types';

const MainContent: React.FC = () => {
  const { placeOrder, payWithWallet, currentUser, addToast, language } = useApp();

  const [currentTab, setCurrentTab] = useState<'shop' | 'track' | 'orders' | 'admin'>('shop');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [walletModalOpen, setWalletModalOpen] = useState<boolean>(false);
  const [trackSearchNum, setTrackSearchNum] = useState<string>('');

  // Automatically direct admin to admin panel & guard track tab for non-admins
  useEffect(() => {
    if (currentUser?.role === 'admin' && currentTab === 'shop') {
      setCurrentTab('admin');
    }
    if (currentUser?.role !== 'admin' && currentTab === 'track') {
      setCurrentTab('shop');
    }
  }, [currentUser, currentTab]);

  // Active checkout flow states
  const [activePaymentModal, setActivePaymentModal] = useState<'none' | 'bkash' | 'nagad' | 'manual'>('none');
  const [checkoutData, setCheckoutData] = useState<{
    pkg: Package;
    playerId: string;
    playerNickname: string;
    phone: string;
    method: PaymentMethodType;
  } | null>(null);

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const handleInitiatePayment = (
    pkg: Package,
    playerId: string,
    playerNickname: string,
    phone: string,
    method: PaymentMethodType
  ) => {
    setCheckoutData({ pkg, playerId, playerNickname, phone, method });

    if (method === 'wallet') {
      const order = payWithWallet({
        userEmail: currentUser?.email,
        userPhone: phone,
        playerId,
        playerNickname: playerNickname || 'Player',
        packageId: pkg.id,
        packageName: pkg.name,
        diamonds: pkg.diamonds + (pkg.bonusDiamonds || 0),
        price: pkg.price,
      });
      if (order) {
        setCompletedOrder(order);
      }
      return;
    }

    if (method === 'bkash') {
      setActivePaymentModal('bkash');
    } else if (method === 'nagad') {
      setActivePaymentModal('nagad');
    } else {
      setActivePaymentModal('manual');
    }
  };

  const handlePaymentSuccess = (trxId: string, senderNumber: string, isManual = false) => {
    if (!checkoutData) return;

    const newOrder = placeOrder({
      userEmail: currentUser?.email,
      userPhone: checkoutData.phone,
      playerId: checkoutData.playerId,
      playerNickname: checkoutData.playerNickname,
      packageId: checkoutData.pkg.id,
      packageName: checkoutData.pkg.name,
      diamonds: checkoutData.pkg.diamonds + (checkoutData.pkg.bonusDiamonds || 0),
      price: checkoutData.pkg.price,
      paymentMethod: checkoutData.method,
      paymentStatus: isManual ? 'paid' : 'paid',
      trxId: trxId,
      senderNumber: senderNumber,
      notes: isManual ? 'Manual verification required' : 'Tokenized auto payment verified'
    });

    setActivePaymentModal('none');
    setCompletedOrder(newOrder);

    addToast(
      language === 'bn'
        ? `✅ অর্ডার #${newOrder.orderNumber} সফলভাবে গ্রহণ করা হয়েছে!`
        : `✅ Order #${newOrder.orderNumber} placed successfully!`,
      'success'
    );
  };

  const handleSelectOrderToTrack = (orderNumber: string) => {
    setTrackSearchNum(orderNumber);
    setCurrentTab('track');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenWallet={() => setWalletModalOpen(true)}
      />

      <main className="flex-1">
        {currentTab === 'shop' && (
          <TopUpStore 
            onInitiatePayment={handleInitiatePayment} 
            onOpenWallet={() => setWalletModalOpen(true)}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentTab === 'track' && (
          <OrderTracker
            initialSearch={trackSearchNum}
            onGoToShop={() => setCurrentTab('shop')}
          />
        )}

        {currentTab === 'orders' && (
          <UserOrders
            onSelectOrderToTrack={handleSelectOrderToTrack}
            onGoToShop={() => setCurrentTab('shop')}
          />
        )}

        {currentTab === 'admin' && <AdminPanel />}
      </main>

      <Footer />

      {/* Modals */}
      {activePaymentModal === 'bkash' && checkoutData && (
        <BkashModal
          pkg={checkoutData.pkg}
          playerId={checkoutData.playerId}
          playerNickname={checkoutData.playerNickname}
          phone={checkoutData.phone}
          onSuccess={(trx, sender) => handlePaymentSuccess(trx, sender, false)}
          onClose={() => setActivePaymentModal('none')}
        />
      )}

      {activePaymentModal === 'nagad' && checkoutData && (
        <NagadModal
          pkg={checkoutData.pkg}
          playerId={checkoutData.playerId}
          playerNickname={checkoutData.playerNickname}
          phone={checkoutData.phone}
          onSuccess={(trx, sender) => handlePaymentSuccess(trx, sender, false)}
          onClose={() => setActivePaymentModal('none')}
        />
      )}

      {activePaymentModal === 'manual' && checkoutData && (
        <ManualPaymentModal
          pkg={checkoutData.pkg}
          playerId={checkoutData.playerId}
          playerNickname={checkoutData.playerNickname}
          phone={checkoutData.phone}
          method={checkoutData.method}
          onSubmitManual={(trx, sender) => handlePaymentSuccess(trx, sender, true)}
          onClose={() => setActivePaymentModal('none')}
        />
      )}

      {completedOrder && (
        <OrderSuccessModal
          order={completedOrder}
          onClose={() => setCompletedOrder(null)}
          onTrackOrder={(num) => {
            setCompletedOrder(null);
            handleSelectOrderToTrack(num);
          }}
        />
      )}

      {authModalOpen && (
        <AuthModal onClose={() => setAuthModalOpen(false)} />
      )}

      {walletModalOpen && (
        <WalletModal onClose={() => setWalletModalOpen(false)} />
      )}

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
