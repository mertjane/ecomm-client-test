'use client';

import { PostCard } from './PostCard';
import { Loader2 } from 'lucide-react';
import { usePosts } from '@/lib/hooks/usePosts';

export function PostsGrid() {
  const { data, isLoading, error } = usePosts({ limit: 3 });

  if (isLoading) {
    return (
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emperador" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.data || data.data.length === 0) {
    return null; // Don't show section if there's an error or no posts
  }

  const posts = data.data;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold uppercase tracking-wide mb-3">
            Latest from Our Blog
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover expert tips, design inspiration, and industry insights
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
