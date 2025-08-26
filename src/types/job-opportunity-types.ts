export interface JobOpportunity {
  id: number;
  title: string;
  title_en?: string;
  job_category_id: number;
  city_id: number;
  text: string;
  text_en?: string;
  created_at?: string;
  updated_at?: string;
  job_category?: {
    id: number;
    title: string;
    title_en: string;
  };
  city?: {
    id: number;
    title: string;
    title_en: string;
  };
}

export interface CreateJobOpportunityRequest {
  title: string;
  title_en?: string;
  job_category_id: number;
  city_id: number;
  text: string;
  text_en?: string;
}

export interface UpdateJobOpportunityRequest {
  title?: string;
  title_en?: string;
  job_category_id?: number;
  city_id?: number;
  text?: string;
  text_en?: string;
}

export interface JobOpportunityFilters {
  job_category_id?: number;
  city_id?: number;
  title?: string;
  title_en?: string;
}

