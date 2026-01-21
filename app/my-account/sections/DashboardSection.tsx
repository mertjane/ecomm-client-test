'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { Package, MapPin, User, Heart } from 'lucide-react';

type AccountSection = 'dashboard' | 'orders' | 'addresses' | 'account-details' | 'wishlist';

interface DashboardSectionProps {
  onNavigate: (section: AccountSection) => void;
}

const quickLinks = [
  {
    id: 'orders' as AccountSection,
    label: 'Orders',
    description: 'View and track your orders',
    icon: <Package className="w-6 h-6" />,
  },
  {
    id: 'addresses' as AccountSection,
    label: 'Addresses',
    description: 'Manage your shipping addresses',
    icon: <MapPin className="w-6 h-6" />,
  },
  {
    id: 'account-details' as AccountSection,
    label: 'Account Details',
    description: 'Update your personal information',
    icon: <User className="w-6 h-6" />,
  },
  {
    id: 'wishlist' as AccountSection,
    label: 'Wishlist',
    description: 'View your saved products',
    icon: <Heart className="w-6 h-6" />,
  },
];

export function DashboardSection({ onNavigate }: DashboardSectionProps) {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-xl font-semibold uppercase tracking-wide mb-6">Dashboard</h2>

      <p className="text-muted-foreground mb-8">
        Hello, <span className="text-foreground font-medium">{user?.first_name || user?.email}</span>!
        From your account dashboard you can view your recent orders, manage your shipping addresses,
        and edit your account details.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {quickLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => onNavigate(link.id)}
            className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-emperador hover:shadow-md transition-all text-left group"
          >
            <div className="p-2 rounded-lg bg-muted group-hover:bg-emperador/10 transition-colors">
              {link.icon}
            </div>
            <div>
              <h3 className="font-semibold uppercase tracking-wide text-sm mb-1">
                {link.label}
              </h3>
              <p className="text-sm text-muted-foreground">{link.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
