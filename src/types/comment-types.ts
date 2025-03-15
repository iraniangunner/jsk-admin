export interface Comment {
  id: number;
  name: string;
  email: string;
  website: string;
  text: string;
  created_at: string;
}

export interface CommentSearchParams {
  page?: number;
  per_page?: number;
  title?: string;
}

export interface PaginatedCommentResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  meta: {
    last_page: number;
  };
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
