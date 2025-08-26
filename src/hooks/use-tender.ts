import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  PaginatedTenderResponse,
  Tender,
  TenderSearchParams,
} from "@/types/tender-types";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const fetchTenders = async (
  params: TenderSearchParams
): Promise<PaginatedTenderResponse<Tender>> => {
  const queryParams = new URLSearchParams();
  if (params.page) {
    queryParams.set("page", params.page.toString());
  }
  if (params.per_page) {
    queryParams.set("per_page", params.per_page.toString());
  }
  if (params.category_id) {
    queryParams.set("category_id", params.category_id);
  }
  if (params.status) {
    queryParams.set("status", params.status);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tenders?${queryParams.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch tenders");
  }

  return response.json();
};

export const fetchTenderById = async (id: string): Promise<Tender | any> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tenders/${id}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch tender");
  }

  return response.json();
};

export const deleteTenderById = async (id: number): Promise<void> => {
  return await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/tenders/${id}`,
    {
      method: "DELETE",
    }
  );
};

export const updateTenderById = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}): Promise<Tender> => {
  return await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/tenders/${id}`,
    {
      method: "POST",
      body: formData,
    }
  );
};

export const createNewTender = async ({
  formData,
}: {
  formData: FormData;
}): Promise<Tender> => {
  return await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/tenders`, {
    method: "POST",
    body: formData,
  });
};

export const getTenderById = (id: string) => {
  return useQuery({
    queryKey: ["tender", id],
    queryFn: () => fetchTenderById(id),
  });
};

export const updateTender = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTenderById,
    onSuccess: () => {
      // Invalidate the tenders query to refetch data after update
      queryClient.invalidateQueries({ queryKey: ["tenders"] });
      queryClient.invalidateQueries({ queryKey: ["tender"] });
    },
  });
};

export const deleteTender = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTenderById,
    onSuccess: () => {
      // Invalidate the tenders query to refetch data after deletion
      queryClient.invalidateQueries({ queryKey: ["tenders"] });
    },
  });
};

export const getTenders = (params: TenderSearchParams) => {
  return useQuery({
    queryKey: ["tenders", params],
    queryFn: () => fetchTenders(params),
  });
};

export const createTender = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewTender,
    onSuccess: () => {
      // Invalidate the tenders query to refetch data after creation
      queryClient.invalidateQueries({ queryKey: ["tenders"] });
    },
  });
};
