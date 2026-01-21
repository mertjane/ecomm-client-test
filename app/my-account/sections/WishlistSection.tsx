'use client';

import { Heart } from 'lucide-react';

export function WishlistSection() {
  return (
    <div>
      <h2 className="text-xl font-semibold uppercase tracking-wide mb-6">Wishlist</h2>

      <div className="text-center py-12">
        <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-2">Your wishlist is empty.</p>
        <p className="text-sm text-muted-foreground">
          Browse our products and click the heart icon to save items for later.
        </p>
      </div>
    </div>
  );
}
