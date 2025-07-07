export interface JobCategory {
  id: number;
  title: string;
  title_en?: string;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateJobCategoryRequest {
  title: string;
  title_en?: string;
  order?: number;
}

export interface UpdateJobCategoryRequest {
  title: string;
  title_en?: string;
  order?: number;
}
