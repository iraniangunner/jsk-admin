export interface Category {
  id: number;
  title: string;
  title_en: string;
}

export interface Project {
  id: number;
  title: string;
  title_en: string;
  employer: string;
  employer_en: string;
  start_date: string;
  location: string;
  location_en: string;
  text: string;
  text_en: string;
  categories: Category[];
  created_at: string;
}

export interface ProjectSearchParams {
  page?: number;
  per_page?: number;
  category_id?: string;
}

export interface PaginatedProjectResponse<T> {
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
