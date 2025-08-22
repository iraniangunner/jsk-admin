export interface ProjectCategory {
  id: number;
  title: string;
  title_en?: string;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProjectCategoryRequest {
  title: string;
  title_en?: string;
  order?: number;
}

export interface UpdateProjectCategoryRequest {
  title: string;
  title_en?: string;
  order?: number;
}