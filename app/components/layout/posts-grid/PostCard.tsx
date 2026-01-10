'use client';

import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import type { Post } from '@/types/post';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const imageUrl = post.og_image?.[0]?.url || '/placeholder-blog.jpg';
  const formattedDate = new Date(post.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Strip HTML tags from excerpt
  const cleanExcerpt = post.excerpt?.replace(/<[^>]*>/g, '').substring(0, 120) + '...' || '';

  return (
    <Link
      href={`/${post.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-background rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Category Badge */}
        {post.categories && post.categories.length > 0 && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-emperador text-white text-xs uppercase tracking-wide rounded-full">
              {post.categories[0]}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Calendar className="w-4 h-4" />
          <time dateTime={post.date}>{formattedDate}</time>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-emperador transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        {cleanExcerpt && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {cleanExcerpt}
          </p>
        )}

        {/* Read More */}
        <div className="flex items-center gap-2 text-emperador font-medium text-sm uppercase tracking-wide">
          Read More
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
