'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { BlogPost } from '@/types/page';

interface BlogGridProps {
  posts: BlogPost[];
  className?: string;
}

export function BlogGrid({ posts, className }: BlogGridProps) {
  return (
    <div className={cn('container mx-auto px-4 py-12', className)}>
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Post Image */}
              {post.og_image?.[0]?.url && (
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.og_image[0].url}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Post Content */}
              <div className="p-6">
                {/* Categories */}
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.categories.map((category, idx) => (
                      <span
                        key={idx}
                        className="text-xs uppercase tracking-wide text-emperador bg-marble px-2 py-1 rounded"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h6 className="text-foreground mb-3 line-clamp-2 group-hover:text-emperador transition-colors">
                  <Link href={`/${post.slug}`}>
                    {post.title}
                  </Link>
                </h6>

                {/* Excerpt */}
                <div
                  className="text-muted-foreground text-sm mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: post.excerpt }}
                />

                {/* Date */}
                <time className="text-xs text-muted-foreground">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
