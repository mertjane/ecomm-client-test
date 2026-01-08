// types/navigation.ts
export interface NavigationSubItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  submenu?: NavigationSubItem[];
  hasMegamenu?: boolean;
  apiLabel?: string; // Add this to map to API response
}

export const navigationItems: NavigationItem[] = [
  {
    label: 'Stone Collection',
    href: '/stone-collection',
    hasMegamenu: true,
    apiLabel: 'Stone Collection',
  },
  {
    label: 'Custom Stonework',
    href: '/custom-stonework',
    hasMegamenu: true,
    apiLabel: 'Custom Stone Works',
  },
  {
    label: 'Design & Pattern',
    href: '/design-pattern',
    hasMegamenu: true,
    apiLabel: 'Design & Pattern',
  },
  {
    label: 'Stone Project',
    href: '/stone-project',
    hasMegamenu: true,
    apiLabel: 'Stone Project',
  },
];