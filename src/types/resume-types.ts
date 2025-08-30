export interface Resume {
  id: number;
  name: string;
  birthday: string;
  gender: string;
  marital: string;
  degree: string;
  military: string;
  university: string;
  major: string;
  experience: string;
  email: string;
  file: string;
  full_path: string;
  text: string;
  created_at: string;
}

export interface ResumeResponse {
  data: {
    id: number;
    name: string;
    birthday: string;
    gender: string;
    marital: string;
    degree: string;
    military: string;
    university: string;
    major: string;
    experience: string;
    email: string;
    file: string;
    full_path: string;
    text: string;
    created_at: string;
  };
}

export interface ResumeSearchParams {
  page?: number;
  per_page?: number;
  title?: string;
}

export interface PaginatedResumeResponse<T> {
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
