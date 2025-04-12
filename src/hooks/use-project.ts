import {
  PaginatedProjectResponse,
  Project,
  ProjectSearchParams,
} from "@/types/project-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const fetchProjects = async (
  params: ProjectSearchParams
): Promise<PaginatedProjectResponse<Project>> => {
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

  const response = await fetch(
    `https://jsk-co.com/api/projects?${queryParams.toString()}`,
    {
      headers: {
        Authorization:
          "Bearer 3|aEbpCRb3dEf0gV3YyrmjFpmGdkEyYGxJue9ResHtb33d8a02",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
};

export const deleteProjectById = async (id: number): Promise<void> => {
  const response = await fetch(`https://jsk-co.com/api/projects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization:
        "Bearer 3|aEbpCRb3dEf0gV3YyrmjFpmGdkEyYGxJue9ResHtb33d8a02",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete Project");
  }

  return;
};

export const deleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProjectById,
    onSuccess: () => {
      // Invalidate the projects query to refetch data after deletion
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const getProjects = (params: ProjectSearchParams) => {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => fetchProjects(params),
    //   enabled: !params?.title || (params.title?.length ?? 0) >= 2,
  });
};
