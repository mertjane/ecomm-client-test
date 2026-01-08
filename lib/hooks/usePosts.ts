import { useQuery } from '@tanstack/react-query';
import { postsApi } from '../api/posts';
import type { PostsQueryParams } from '@/types/post';

/**
 * Hook to fetch blog posts using TanStack Query
 */
export function usePosts(params?: PostsQueryParams) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => postsApi.fetchPosts(params),
    staleTime: 1000 * 60 * 30, // 30 minutes - posts don't change often
    gcTime: 1000 * 60 * 60 * 6, // 6 hours - match backend cache
  });
}

/**
 * Hook to fetch a single blog post by slug using TanStack Query
 */
export function usePostBySlug(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => postsApi.fetchPostBySlug(slug),
    enabled: !!slug, // Only fetch if slug is provided
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60 * 6, // 6 hours - match backend cache
  });
}
