'use client';

import { NewsletterForm } from './NewsletterForm';

export function NewsletterSection() {
  return (
    <section className="py-20 bg-emperador text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Header */}
          <h2 className="text-3xl md:text-4xl font-semibold uppercase tracking-wide mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Get the latest updates on new products, exclusive offers, and design inspiration
            delivered straight to your inbox.
          </p>

          {/* Newsletter Form */}
          <NewsletterForm />

          {/* Privacy Note */}
          <p className="mt-6 text-sm text-white/60">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
