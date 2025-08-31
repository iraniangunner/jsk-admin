export interface Cooperation {
  
    id: number;
    company_name: string;
    phone: string;
    mobile: string;
    address: string;
    type_cooperation: string[];
    file: string;
    full_path: string;
    text: string;
    created_at: string;
 
}


export interface CooperationResponse {
  data: {
    id: number;
    company_name: string;
    phone: string;
    mobile: string;
    email:string;
    address: string;
    type_cooperation: string[];
    file: string;
    full_path: string;
    text: string;
    created_at: string;
  };
}


export interface CooperationSearchParams {
  page?: number;
  per_page?: number;
  title?: string;
}

export interface PaginatedCooperationResponse<T> {
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
