'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm, SignupForm } from '../components/auth';
import { useAuth } from '@/lib/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function MyAccountPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Allow initial auth check to complete
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Show loading during initial auth check
  if (initialLoad || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emperador" />
      </div>
    );
  }

  // If authenticated, show account dashboard
  if (isAuthenticated && user) {
    return <AccountDashboard />;
  }

  // If not authenticated, show login/signup
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

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-background rounded-lg shadow-lg p-8 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold uppercase tracking-wide mb-2">
                  My Account
                </h1>
                <p className="text-muted-foreground">
                  Welcome back, {user?.email || "user"}
                </p>
              </div>
              <button
                onClick={logout}
                className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors uppercase tracking-wide text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Account Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Orders */}
            <div className="bg-background rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <h3 className="text-lg font-semibold uppercase tracking-wide mb-2">Orders</h3>
              <p className="text-sm text-muted-foreground mb-4">
                View and track your orders
              </p>
              <div className="text-sm text-emperador">View Orders →</div>
            </div>

            {/* Addresses */}
            <div className="bg-background rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <h3 className="text-lg font-semibold uppercase tracking-wide mb-2">Addresses</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage your shipping addresses
              </p>
              <div className="text-sm text-emperador">Manage Addresses →</div>
            </div>

            {/* Account Details */}
            <div className="bg-background rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <h3 className="text-lg font-semibold uppercase tracking-wide mb-2">
                Account Details
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Update your personal information
              </p>
              <div className="text-sm text-emperador">Edit Details →</div>
            </div>

            {/* Wishlist */}
            <div className="bg-background rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <h3 className="text-lg font-semibold uppercase tracking-wide mb-2">Wishlist</h3>
              <p className="text-sm text-muted-foreground mb-4">
                View your saved products
              </p>
              <div className="text-sm text-emperador">View Wishlist →</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
