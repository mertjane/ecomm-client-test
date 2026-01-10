'use client';

import { use } from 'react';
import { usePageBySlug } from '@/lib/hooks/useWooPages';
import { PageContent } from '@/app/components/layout/page-content';
import { Breadcrumb, type BreadcrumbItem } from '@/app/components/layout/breadcrumb';
import { Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { BlogPost } from '@/types/page';
import Image from 'next/image';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const { data, isLoading, error } = usePageBySlug(slug);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emperador" />
      </div>
    );
  }

  if (error || !data?.success) {
    notFound();
  }

  const post = data.data as BlogPost;

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: post.title },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb items={breadcrumbItems} />

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Featured Image */}
        {post.og_image?.[0]?.url && (
          <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.og_image[0].url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map((category, idx) => (
              <span
                key={idx}
                className="text-xs uppercase tracking-wide text-emperador bg-marble px-3 py-1 rounded"
              >
                {category}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          {post.title}
        </h1>

        {/* Date */}
        <time className="text-sm text-muted-foreground mb-8 block">
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:text-foreground prose-headings:font-bold
            prose-p:text-foreground prose-p:leading-relaxed
            prose-a:text-emperador prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground prose-strong:font-semibold
            prose-ul:text-foreground prose-ol:text-foreground
            prose-li:text-foreground prose-li:marker:text-emperador
            prose-img:rounded-lg prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}