import { fetchWithAuth } from "@/lib/fetchWithAuth";
import type {
  CreateProjectCategoryRequest,
  ProjectCategory,
  UpdateProjectCategoryRequest,
} from "@/types/projectCategory-types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export const fetchProjectCategories = async (): Promise<ProjectCategory[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch project categories");
  }

  return response.json();
};

export const fetchProjectCategoryById = async (
  id: string
): Promise<ProjectCategory> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch project category");
  }

  return response.json();
};

export const deleteProjectCategoryById = async (id: number): Promise<void> => {
  return await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
    {
      method: "DELETE",
    }
  );
};

export const updateProjectCategoryById = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateProjectCategoryRequest;
}) => {
  return await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    }
  );
};

export const createNewProjectCategory = async ({
  data,
}: {
  data: CreateProjectCategoryRequest;
}): Promise<ProjectCategory> => {
  return await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
    method: "POST",
    body: JSON.stringify(data),
    // headers: {
    //   "Content-Type": "application/json",
    // },
  });
};

// React Query Hooks
export const getProjectCategories = () => {
  return useQuery({
    queryKey: ["project-categories"],
    queryFn: () => fetchProjectCategories(),
  });
};

export const getProjectCategoryById = (id: string) => {
  return useQuery({
    queryKey: ["project-category", id],
    queryFn: () => fetchProjectCategoryById(id),
    enabled: !!id, // Only run query if id exists
  });
};

export const deleteProjectCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectCategoryById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-categories"] });
    },
  });
};

export const updateProjectCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectCategoryById,
    onSuccess: (data, variables) => {
      // Invalidate the project-categories query to refetch data after update
      queryClient.invalidateQueries({ queryKey: ["project-categories"] });
      queryClient.invalidateQueries({
        queryKey: ["project-category", variables.id],
      });
    },
  });
};

export const createProjectCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNewProjectCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-categories"] });
    },
  });
};
