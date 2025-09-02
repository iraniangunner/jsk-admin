import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { News, NewsSearchParams } from "@/types/news-types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export const fetchNews = async (
  params: NewsSearchParams
): Promise<News[] | any> => {
  const queryParams = new URLSearchParams();
  if (params.page) {
    queryParams.set("page", params.page.toString());
  }
  if (params.per_page) {
    queryParams.set("per_page", params.per_page.toString());
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/news${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }

  return response.json();
};

export const fetchNewsById = async (id: string): Promise<News | any> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/news/${id}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }

  return response.json();
};

export const deleteNewsById = async (id: number): Promise<void> => {
  return await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/news/${id}`, {
    method: "DELETE",
  });
};

export const updateNewsById = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}): Promise<News> => {
  return await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/news/${id}`, {
    method: "POST",
    body: formData,
  });
};

export const createNewNews = async ({
  formData,
}: {
  formData: FormData;
}): Promise<News> => {
  return await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/news`, {
    method: "POST",
    body: formData,
  });
};

export const getNews = (params:NewsSearchParams) => {
  return useQuery({
    queryKey: ["news", params],
    queryFn: () => fetchNews(params),
  });
};

export const getNewsById = (id: string) => {
  return useQuery({
    queryKey: ["single news"],
    queryFn: () => fetchNewsById(id),
  });
};

export const deleteNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNewsById,
    onSuccess: () => {
      // Invalidate the slides query to refetch data after deletion
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

export const updateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNewsById,
    onSuccess: () => {
      // Invalidate the slides query to refetch data after update
      queryClient.invalidateQueries({ queryKey: ["news"] });
      queryClient.invalidateQueries({ queryKey: ["single news"] });
    },
  });
};

export const createNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewNews,
    onSuccess: () => {
      // Invalidate the slides query to refetch data after creation
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};
