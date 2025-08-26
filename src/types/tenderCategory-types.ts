export interface TenderCategory {
    id: number;
    title: string;
    title_en?: string;
    order?: number;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface CreateTenderCategoryRequest {
    title: string;
    title_en?: string;
    order?: number;
  }
  
  export interface UpdateTenderCategoryRequest {
    title: string;
    title_en?: string;
    order?: number;
  }