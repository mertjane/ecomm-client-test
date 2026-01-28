'use client';

import { useEffect, useState } from 'react';
import { Loader2, User, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCheckout } from '@/lib/hooks/useCheckout';

export function CheckoutLoginStep() {
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
  const { onLoginSuccess, continueAsGuest } = useCheckout();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Auto-advance if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      onLoginSuccess();
    }
  }, [isAuthenticated, onLoginSuccess]);

  // Load remembered email
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('remembered_email');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const result = await login({ email, password, rememberMe });

    if (result.success) {
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
      } else {
        localStorage.removeItem('remembered_email');
      }
      onLoginSuccess();
    }
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-emperador" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold uppercase tracking-wide mb-2">
          How would you like to checkout?
        </h2>
        <p className="text-muted-foreground">
          Sign in to your account or continue as a guest.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Sign In Section */}
        <div className="border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emperador/10 rounded-full">
              <User className="w-5 h-5 text-emperador" />
            </div>
            <h3 className="font-semibold uppercase tracking-wide text-sm">
              Returning Customer
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Sign in with your email and password to access your saved addresses and order history.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={isLoading}
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 uppercase tracking-wide"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In & Continue'
              )}
            </Button>

            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <a
                  href="/my-account"
                  className="text-emperador hover:underline font-medium"
                >
                  Create one
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Guest Checkout Section */}
        <div className="border border-border rounded-lg p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-muted rounded-full">
              <UserX className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="font-semibold uppercase tracking-wide text-sm">
              Guest Checkout
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6 flex-1">
            Continue without creating an account. You can still track your order via email and create an account later if you wish.
          </p>

          <div className="space-y-4">
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emperador rounded-full" />
                No account required
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emperador rounded-full" />
                Order confirmation via email
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emperador rounded-full" />
                Quick and easy checkout
              </li>
            </ul>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 uppercase tracking-wide"
              onClick={continueAsGuest}
            >
              Continue as Guest
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
