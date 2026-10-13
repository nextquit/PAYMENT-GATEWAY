import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { initSecurityProtections } from './utils/security';
import Navbar from './components/Navbar';
import BalanceCard from './components/BalanceCard';
import QuickActions from './components/QuickActions';
import TransactionHistoryModal from './components/TransactionHistoryModal';
import PaymentModal from './components/PaymentModal';
import BalanceModal from './components/BalanceModal';
import BankDetailsModal from './components/BankDetailsModal';
import TopUpModal from './components/TopUpModal';
import TransactionDetailModal from './components/TransactionDetailModal';
import ProfileModal from './components/ProfileModal';
import ReceiveMoneyModal from './components/ReceiveMoneyModal';
import AuthScreen from './components/AuthScreen';
import PinModal from './components/PinModal';
import QrScannerModal from './components/QrScannerModal';
import BottomNav from './components/BottomNav';
import TopIncomingNotification from './components/TopIncomingNotification';
import FeedbackModal from './components/FeedbackModal';
import FeedbacksPage from './components/FeedbacksPage';
import DesktopLandingPage from './components/DesktopLandingPage';
import GalaxyButton from './components/GalaxyButton';
import { playFeedbackNotificationSound } from './utils/sound';
import { api } from './services/api';
import { 
  RotateCw, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight, 
  Activity, 
  Layers,
  Lock,
  Zap,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  Smartphone,
  MessageSquareText
} from 'lucide-react';

const Dashboard = ({ onBackToLanding }) => {
  const { user, balance, refreshBalance, incomingNotification, dismissNotification, syncTrigger } = useAuth();

  // Modals state
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [isBalanceOpen, setIsBalanceOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isBankDetailsOpen, setIsBankDetailsOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [scannedPayee, setScannedPayee] = useState(null);

  // PIN gate for Pay Money
  const [isPinOpen, setIsPinOpen] = useState(false);

  // Trigger history refresh on payment/topup/receive or background sync
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Auto-refresh transaction history whenever background sync detects new transaction
  useEffect(() => {
    if (syncTrigger > 0) {
      setRefreshTrigger((prev) => prev + 1);
    }
  }, [syncTrigger]);

  // Mobile bottom tab
  const [mobileTab, setMobileTab] = useState('home');

  const handleMobileTabSelect = (tab) => {
    setMobileTab(tab);
    if (tab === 'history') setIsHistoryOpen(true);
    if (tab === 'balance') setIsBalanceOpen(true);
    if (tab === 'profile') setIsProfileOpen(true);
  };

  const handlePaymentSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleTopUpSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="app-container">
      <Navbar
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />

      <main className="main-content">
        {/* User Greeting & Simulator Badge */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          gap: '0.75rem',
        }}>
          <div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-dim)', fontWeight: '500' }}>
              Welcome back,
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {user?.fullName || (user?.username === 'fakemoney2@idc' ? 'Palak Singh' : 'Anubhav Tiwari')}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                ← Back to Showcase
              </button>
            )}

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#eef2ff',
              border: '1px solid #c7d2fe',
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: '700',
              color: '#3730a3',
            }}>
              <ShieldCheck size={16} color="#4f46e5" />
              <span>Verified & Active</span>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Dashboard Grid for Laptops */}
        <div className="dashboard-grid">
          {/* Left Column: Balance Card + Info Panel */}
          <div className="dashboard-col-left" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <BalanceCard />

            {/* Security & Status Info Card */}
            <div
              className="account-status-card"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.1rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '0.02em' }}>Account Status</span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  fontSize: '0.68rem', fontWeight: '700',
                  background: 'var(--success-bg)', color: 'var(--success)',
                  border: '1px solid var(--success-border)',
                  padding: '0.15rem 0.55rem', borderRadius: '9999px',
                }}>
                  <CheckCircle2 size={11} />
                  Live
                </span>
              </div>

              {/* Status rows */}
              {[
                { icon: ShieldCheck, color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: 'PIN Protection', value: 'Enabled' },
                { icon: Lock, color: '#6366f1', bg: 'rgba(99,102,241,0.12)', label: 'Session Security', value: 'Encrypted' },
                { icon: Zap, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'Transfer Speed', value: 'Instant' },
                { icon: TrendingUp, color: '#0284c7', bg: 'rgba(2,132,199,0.12)', label: 'Auto-Sync', value: 'Instant Live' },
              ].map(({ icon: Icon, color, bg, label, value }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '8px',
                    background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={14} color={color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '500' }}>{label}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: '700', whiteSpace: 'nowrap' }}>{value}</span>
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Right Column: Quick Actions Hub */}
          <div className="dashboard-col-right">
            <QuickActions
              onOpenPay={() => setIsPinOpen(true)}
              onOpenReceive={() => setIsReceiveOpen(true)}
              onOpenBalance={() => setIsBalanceOpen(true)}
              onOpenHistory={() => setIsHistoryOpen(true)}
              onOpenBankDetails={() => setIsBankDetailsOpen(true)}
              onOpenTopUp={() => setIsTopUpOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <BottomNav
        activeTab={mobileTab}
        onSelectTab={handleMobileTabSelect}
        onOpenScan={() => setIsScanOpen(true)}
        onOpenPay={() => setIsPayOpen(true)}
      />

      {/* QR Code Camera Scanner Modal */}
      <QrScannerModal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        onScanSuccess={(payee) => {
          setIsScanOpen(false);
          setScannedPayee(payee);
          setIsPayOpen(true);
        }}
      />

      {/* PIN Gate Modal for Pay Money */}
      <PinModal
        isOpen={isPinOpen}
        onClose={() => setIsPinOpen(false)}
        onSuccess={() => {
          setIsPinOpen(false);
          setIsPayOpen(true);
        }}
        title="Authorize Payment"
      />

      {/* Modals */}
      <PaymentModal
        isOpen={isPayOpen}
        onClose={() => {
          setIsPayOpen(false);
          setScannedPayee(null);
        }}
        initialRecipient={scannedPayee}
        onSuccessPayment={handlePaymentSuccess}
        onViewTransaction={(txn) => setSelectedTxn(txn)}
      />

      <ReceiveMoneyModal
        isOpen={isReceiveOpen}
        onClose={() => setIsReceiveOpen(false)}
        onSuccessReceive={() => setRefreshTrigger((prev) => prev + 1)}
      />

      <BalanceModal
        isOpen={isBalanceOpen}
        onClose={() => setIsBalanceOpen(false)}
      />

      <BankDetailsModal
        isOpen={isBankDetailsOpen}
        onClose={() => setIsBankDetailsOpen(false)}
      />

      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onSuccess={handleTopUpSuccess}
      />

      <TransactionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectTransaction={(txn) => setSelectedTxn(txn)}
        refreshTrigger={refreshTrigger}
      />

      <TransactionDetailModal
        transaction={selectedTxn}
        isOpen={!!selectedTxn}
        onClose={() => setSelectedTxn(null)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* Top Floating Real-Time Incoming Money Banner */}
      <TopIncomingNotification
        notification={incomingNotification}
        onClose={dismissNotification}
        onViewDetails={(txn) => setSelectedTxn(txn)}
      />
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated, loading, user } = useAuth();
  
  // Helper to detect mobile viewport (width <= 768px)
  const isMobileViewport = () => typeof window !== 'undefined' && window.innerWidth <= 768;
  const [isMobile, setIsMobile] = useState(() => isMobileViewport());
  const [desktopViewMode, setDesktopViewMode] = useState('landing'); // 'landing' | 'app'

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track full-page views within project ('home' or 'feedbacks')
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window === 'undefined') return 'home';
    const urlParams = new URLSearchParams(window.location.search);
    return (
      urlParams.get('view') === 'feedbacks' ||
      window.location.pathname === '/feedbacks' ||
      window.location.hash === '#feedbacks'
    ) ? 'feedbacks' : 'home';
  });

  const navigateTo = (view) => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      if (view === 'feedbacks') {
        window.history.pushState({ view: 'feedbacks', _spa: true }, '', '/?view=feedbacks');
      } else {
        if (window.history.state?.view === 'feedbacks') {
          window.history.back();
        } else {
          window.history.pushState({ view: 'home', _spa: true }, '', '/');
        }
      }
    }
  };

  const handleBackFromFeedbacks = () => {
    if (typeof window !== 'undefined' && window.history.state?.view === 'feedbacks') {
      window.history.back();
    } else {
      if (typeof window !== 'undefined') {
        window.history.replaceState({ view: 'home' }, '', '/');
      }
      setCurrentView('home');
    }
  };

  const [hasNewFeedback, setHasNewFeedback] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('hexa_has_unread_feedback') === 'true';
  });

  const latestFeedbackIdRef = useRef(null);
  const previousFeedbackCountRef = useRef(null);
  const currentViewRef = useRef(currentView);

  useEffect(() => {
    currentViewRef.current = currentView;
  }, [currentView]);

  useEffect(() => {
    let isMounted = true;
    let pollTimer = null;

    const checkFeedbacks = async () => {
      try {
        const data = await api.getFeedbacks();
        if (!isMounted) return;
        const list = data?.feedbacks || [];
        const currentCount = list.length;
        const latestFb = list[0];
        const latestId = latestFb?._id;

        // Establish silent baseline on first check after mount (never play sound on initial load/view switch)
        if (previousFeedbackCountRef.current === null) {
          previousFeedbackCountRef.current = currentCount;
          latestFeedbackIdRef.current = latestId || null;
          return;
        }

        const prevCount = previousFeedbackCountRef.current;
        const prevId = latestFeedbackIdRef.current;

        const isNewReview = Boolean(
          (currentCount > prevCount) ||
          (latestId && prevId && latestId !== prevId)
        );

        // Update baseline to current remote state
        previousFeedbackCountRef.current = currentCount;
        latestFeedbackIdRef.current = latestId || null;

        if (isNewReview && latestFb) {
          console.log('⭐ Live Judge Review received:', latestFb.judgeName, latestFb.rating);
          localStorage.setItem('hexa_seen_feedback_id', latestId);
          localStorage.setItem('hexa_seen_feedback_count', String(currentCount));
          localStorage.setItem('hexa_has_unread_feedback', 'true');
          setHasNewFeedback(true);

          // Play true_caller notification ringtone
          playFeedbackNotificationSound();

          // Dispatch global event for FeedbacksPage auto-refresh
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('new_feedback_received', { detail: latestFb }));
          }
        }
      } catch (err) {
        // Silently retry
      }
    };

    checkFeedbacks();
    pollTimer = setInterval(checkFeedbacks, 2500);

    const handleFeedbackRead = () => {
      setHasNewFeedback(false);
      localStorage.removeItem('hexa_has_unread_feedback');
    };
    const handleStorage = (e) => {
      if (e.key === 'hexa_has_unread_feedback') {
        setHasNewFeedback(e.newValue === 'true');
      }
    };

    window.addEventListener('feedback_read', handleFeedbackRead);
    window.addEventListener('storage', handleStorage);

    return () => {
      isMounted = false;
      if (pollTimer) clearInterval(pollTimer);
      window.removeEventListener('feedback_read', handleFeedbackRead);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleDesktopFeedbackClick = () => {
    setHasNewFeedback(false);
    localStorage.removeItem('hexa_has_unread_feedback');
    navigateTo('feedbacks');
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Always set the initial history state so we know what view we're on
    const urlParams = new URLSearchParams(window.location.search);
    const isFbOnLoad = urlParams.get('view') === 'feedbacks';

    if (!window.history.state) {
      window.history.replaceState({ view: isFbOnLoad ? 'feedbacks' : 'home', _spa: true }, '', window.location.href);
    }

    // Push a sentinel "home" guard entry if we're on the home view.
    if (!isFbOnLoad) {
      window.history.replaceState({ view: 'home', _spa: true, _sentinel: true }, '', '/');
      window.history.pushState({ view: 'home', _spa: true }, '', '/');
    }

    const handlePopState = (e) => {
      const state = e.state;

      // If we popped back to the sentinel (or there's no state / outside SPA), stay in app
      if (!state || state._sentinel || !state._spa) {
        window.history.pushState({ view: 'home', _spa: true }, '', '/');
        setCurrentView('home');
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const isFb = (
        params.get('view') === 'feedbacks' ||
        window.location.pathname === '/feedbacks' ||
        state?.view === 'feedbacks'
      );
      setCurrentView(isFb ? 'feedbacks' : 'home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Render current view content
  const renderCurrentPageView = () => {
    if (currentView === 'feedbacks') {
      return <FeedbacksPage onBack={handleBackFromFeedbacks} />;
    }

  // Desktop & Laptop Screen: Show full-featured scrolling showcase page
  if (!isMobile && desktopViewMode === 'landing') {
    return (
      <DesktopLandingPage
        onOpenFeedbacks={handleDesktopFeedbackClick}
        hasNewFeedback={hasNewFeedback}
        onLaunchApp={() => setDesktopViewMode('app')}
        user={user}
      />
    );
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        background: '#06080d',
        color: '#ffffff',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: '#090a0d',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 28px rgba(0, 0, 0, 0.65)',
          overflow: 'hidden',
          padding: 0,
        }}>
          <img
            src="/Hexa.png"
            alt="HexaPay Logo"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
        <RotateCw size={24} className="animate-spin" color="#ef4444" />
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>
          Loading IDC 3.0...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <Navbar
          onOpenProfile={() => {}}
          onOpenAuth={() => {}}
        />
        <main className="main-content auth-main-content" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <AuthScreen />
        </main>
      </div>
    );
  }

    return <Dashboard onBackToLanding={!isMobile ? () => setDesktopViewMode('landing') : undefined} />;
  };

  return renderCurrentPageView();
};

function App() {
  useEffect(() => {
    document.title = 'HexaPay';
    const cleanupSecurity = initSecurityProtections();
    return () => {
      cleanupSecurity();
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
