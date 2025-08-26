export type TenderStatus = "open" | "closed" | "pending";

export interface TenderCategory {
    id: number;
    title: string;
    title_en: string;
  }
  
  export interface Tender {
    id: number;
    title: string;
    title_en: string | null;
    category: TenderCategory;
    number: string;
    start_date: string;
    end_date: string;
    department: string;
    department_en: string | null;
    phone: string;
    email: string;
    doc_opening_date: string;
    doc_submission_deadline: string;
    doc_submission_location: string;
    doc_submission_location_en: string | null;
    status: string;
    text: string;
    text_en: string | null;
    file_url: string;
    created_at: string;
  }
  
  export interface TenderSearchParams {
    page?: number;
    per_page?: number;
    category_id?: string;
    status?: string;
  }
  
  export interface PaginatedTenderResponse<T> {
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