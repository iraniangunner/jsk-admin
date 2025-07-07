export interface JobCity {
  id: number;
  title: string;
  title_en?: string;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateJobCityRequest {
  title: string;
  title_en?: string;
  order?: number;
}

export interface UpdateJobCityRequest {
  title: string;
  title_en?: string;
  order?: number;
}
