import { apiClient } from './axios';
import type { PostsApiResponse, SinglePostApiResponse, PostsQueryParams } from '@/types/post';

export const postsApi = {
  /**
   * Fetch blog posts
   */
  fetchPosts: async (params?: PostsQueryParams): Promise<PostsApiResponse> => {
    const { limit = 6 } = params || {};

    const queryParams: Record<string, any> = {
      limit,
    };

    const { data } = await apiClient.get<PostsApiResponse>('/api/posts', {
      params: queryParams,
    });

    return data;
  },

  /**
   * Fetch a single blog post by slug
   */
  fetchPostBySlug: async (slug: string): Promise<SinglePostApiResponse> => {
    const { data } = await apiClient.get<SinglePostApiResponse>(`/api/posts/${slug}`);

    return data;
  },
};
