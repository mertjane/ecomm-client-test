'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Cookie } from 'lucide-react'; // Assuming you use Lucide icons

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // 1. Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');

    if (!consent) {
      // 2. If no choice, wait 5 seconds then show
      const timer = setTimeout(() => {
        setShouldRender(true);
        // Small delay after render to trigger the CSS transition
        requestAnimationFrame(() => setIsVisible(true));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
    setTimeout(() => setShouldRender(false), 500); // Remove from DOM after animation
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
    setTimeout(() => setShouldRender(false), 500);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-50 
        transform transition-transform duration-700 ease-out
        ${isVisible ? 'translate-y-0' : 'translate-y-[150%]'}
      `}
    >
      <div className="mx-auto max-w-screen-xl px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8">
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 relative">
          
          {/* Close Button (Optional UX choice) */}
          <button 
            onClick={handleDecline}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors md:hidden"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon & Text */}
          <div className="flex-1 flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left">
            <div className="bg-emperador/10 p-3 rounded-full shrink-0 text-emperador">
              <Cookie className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">
                We use cookies
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. 
                <Link href="/privacy-policy" className="text-emperador hover:underline ml-1">
                  Read our Policy
                </Link>.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto min-w-[280px]">
            <button
              onClick={handleDecline}
              className="px-6 py-2.5 rounded-full border border-border text-foreground font-medium hover:bg-muted transition-colors w-full sm:w-1/2 md:w-auto"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2.5 rounded-full bg-emperador text-white font-medium hover:bg-emperador/90 transition-colors shadow-sm w-full sm:w-1/2 md:w-auto"
            >
              Accept All
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}