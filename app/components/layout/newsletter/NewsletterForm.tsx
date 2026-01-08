'use client';

import { useState } from 'react';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement newsletter subscription API
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSuccess(true);
      setEmail('');

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading || isSuccess}
            className="h-12 pl-12 pr-4"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || isSuccess}
          className="h-12 px-8 uppercase tracking-wide"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Subscribing...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Subscribed!
            </>
          ) : (
            'Subscribe'
          )}
        </Button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-destructive text-center">{error}</p>
      )}

      {isSuccess && (
        <p className="mt-3 text-sm text-green-600 text-center">
          Thank you for subscribing! Check your email for confirmation.
        </p>
      )}
    </form>
  );
}
