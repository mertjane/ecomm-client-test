'use client';

import { useState, useEffect } from 'react';
import { LoginForm, SignupForm } from '../components/auth';
import { useAuth } from '@/lib/hooks/useAuth';
import { Loader2, Package, MapPin, User, Heart, LogOut, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

// Section components
import { DashboardSection } from './sections/DashboardSection';
import { OrdersSection } from './sections/OrdersSection';
import { AddressesSection } from './sections/AddressesSection';
import { AccountDetailsSection } from './sections/AccountDetailsSection';
import { WishlistSection } from './sections/WishlistSection';

type AccountSection = 'dashboard' | 'orders' | 'addresses' | 'account-details' | 'wishlist';

const menuItems: { id: AccountSection; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'orders', label: 'Orders', icon: <Package className="w-5 h-5" /> },
  { id: 'addresses', label: 'Addresses', icon: <MapPin className="w-5 h-5" /> },
  { id: 'account-details', label: 'Account Details', icon: <User className="w-5 h-5" /> },
  { id: 'wishlist', label: 'Wishlist', icon: <Heart className="w-5 h-5" /> },
];

export default function MyAccountPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (initialLoad || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emperador" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <AccountDashboard />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-background rounded-lg shadow-lg p-8">
          {showLogin ? (
            <LoginForm onSwitchToSignup={() => setShowLogin(false)} />
          ) : (
            <SignupForm onSwitchToLogin={() => setShowLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
}

function AccountDashboard() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<AccountSection>('dashboard');

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection onNavigate={setActiveSection} />;
      case 'orders':
        return <OrdersSection />;
      case 'addresses':
        return <AddressesSection />;
      case 'account-details':
        return <AccountDetailsSection />;
      case 'wishlist':
        return <WishlistSection />;
      default:
        return <DashboardSection onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold uppercase tracking-wide mb-2">
              My Account
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.first_name || user?.email || 'user'}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:w-64 flex-shrink-0">
              <nav className="bg-background rounded-lg shadow-lg p-4">
                <ul className="space-y-1">
                  {menuItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveSection(item.id)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
                          activeSection === item.id
                            ? 'bg-emperador text-white'
                            : 'hover:bg-muted text-foreground'
                        )}
                      >
                        {item.icon}
                        <span className="text-sm font-medium uppercase tracking-wide">
                          {item.label}
                        </span>
                      </button>
                    </li>
                  ))}
                  <li className="pt-4 border-t border-border mt-4">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors hover:bg-destructive/10 text-destructive"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-sm font-medium uppercase tracking-wide">
                        Logout
                      </span>
                    </button>
                  </li>
                </ul>
              </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
              <div className="bg-background rounded-lg shadow-lg p-6 lg:p-8">
                {renderSection()}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
