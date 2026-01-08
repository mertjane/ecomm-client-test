'use client';

import { usePageBySlug } from '@/lib/hooks/useWooPages';
import { PageHero, PageContent } from '@/app/components/layout/page-content';
import { Loader2 } from 'lucide-react';
import type { Page } from '@/types/page';

export default function SealingAndMaintenancePage() {
  const { data, isLoading, error } = usePageBySlug('sealing-and-maintenance');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emperador" />
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-foreground mb-4">Page Not Found</h1>
          <p className="text-muted-foreground">
            We couldn't load this page. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const page = data.data as Page;

  return (
    <>
      <PageHero
        title={page.title}
        image={page.og_image?.[0]?.url}
      />
      <PageContent
        title={page.title}
        content={page.content}
      />
    </>
  );
}
