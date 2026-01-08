// Blog Post Types

export interface PostImage {
  url: string;
  width?: number;
  height?: number;
}

export interface PostAuthor {
  name: string;
  avatar?: string;
}

export interface Post {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: string;
  excerpt?: string;
  content?: string;
  og_image: PostImage[];
  categories?: string[];
  tags?: string[];
  author?: PostAuthor;
}

export interface PostsApiResponse {
  success: boolean;
  message: string;
  data: Post[];
}

export interface SinglePostApiResponse {
  success: boolean;
  message: string;
  data: Post;
}

export interface PostsQueryParams {
  limit?: number;
}
