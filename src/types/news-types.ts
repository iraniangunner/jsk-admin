export interface News {
  id: number;
  title: string;
  title_en: string;
  content: string;
  content_en: string;
  image_url: string;
}

export interface NewsSearchParams {
  page?: number;
  per_page?: number;
}

export interface CreateNewsRequest {
  title: string;
  title_en: string;
  content: string;
  content_en: string;
  image: File;
}

export interface UpdateNewsRequest {
  title: string;
  title_en: string;
  content: string;
  content_en: string;
  image: File;
}
