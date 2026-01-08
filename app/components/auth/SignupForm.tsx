'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface SignupFormProps {
  onSwitchToLogin?: () => void;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const router = useRouter();
  const { signup, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const result = await signup({ email, password, subscribeNewsletter });

    if (result.success) {
      router.push('/my-account');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold uppercase tracking-wide mb-2">Sign Up</h2>
        <p className="text-muted-foreground">Create a new account to get started.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email Address</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password">Create Password</Label>
          <Input
            id="signup-password"
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={isLoading}
            className="h-12"
          />
          <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="newsletter"
            checked={subscribeNewsletter}
            onCheckedChange={(checked) => setSubscribeNewsletter(checked as boolean)}
            disabled={isLoading}
          />
          <label
            htmlFor="newsletter"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Subscribe to our newsletter
          </label>
        </div>

        <Button
          type="submit"
          className="w-full h-12 uppercase tracking-wide"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>

        {onSwitchToLogin && (
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-emperador hover:underline font-medium"
                disabled={isLoading}
              >
                Login
              </button>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
