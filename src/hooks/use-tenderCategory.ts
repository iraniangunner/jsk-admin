import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  CreateTenderCategoryRequest,
  TenderCategory,
  UpdateTenderCategoryRequest,
} from "@/types/tenderCategory-types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export const fetchTenderCategories = async (): Promise<TenderCategory[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tender-categories`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch tender categories");
  }

  return response.json();
};

export const fetchTenderCategoryById = async (
  id: string
): Promise<TenderCategory> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tender-categories/${id}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch tender category");
  }

  return response.json();
};

export const deleteTenderCategoryById = async (id: number): Promise<void> => {
  return await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/tender-categories/${id}`,
    {
      method: "DELETE",
    }
  );
};

export const updateTenderCategoryById = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateTenderCategoryRequest;
}) => {
  return await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/tender-categories/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
};

export const createNewTenderCategory = async ({
  data,
}: {
  data: CreateTenderCategoryRequest;
}): Promise<TenderCategory> => {
  return await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/tender-categories`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
};

// React Query Hooks
export const getTenderCategories = () => {
  return useQuery({
    queryKey: ["tender-categories"],
    queryFn: () => fetchTenderCategories(),
  });
};

export const getTenderCategoryById = (id: string) => {
  return useQuery({
    queryKey: ["tender-category", id],
    queryFn: () => fetchTenderCategoryById(id),
    enabled: !!id, // Only run query if id exists
  });
};

export const deleteTenderCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTenderCategoryById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tender-categories"] });
    },
  });
};

export const updateTenderCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTenderCategoryById,
    onSuccess: (data, variables) => {
      // Invalidate the tender-categories query to refetch data after update
      queryClient.invalidateQueries({ queryKey: ["tender-categories"] });
      queryClient.invalidateQueries({
        queryKey: ["tender-category", variables.id],
      });
    },
  });
};

export const createTenderCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNewTenderCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tender-categories"] });
    },
  });
};
