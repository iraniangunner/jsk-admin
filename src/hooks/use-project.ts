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

export const fetchProjectById = async (id: string): Promise<Project | any> => {
  const response = await fetch(`https://jsk-co.com/api/projects/${id}`, {
    headers: {
      Authorization:
        "Bearer 3|aEbpCRb3dEf0gV3YyrmjFpmGdkEyYGxJue9ResHtb33d8a02",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }

  return response.json();
};

export const updateProjectById = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}): Promise<Project> => {
  const response = await fetch(`https://jsk-co.com/api/projects/${id}`, {
    method: "POST", // or PUT if your backend accepts PUT with multipart
    headers: {
      Authorization:
        "Bearer 3|aEbpCRb3dEf0gV3YyrmjFpmGdkEyYGxJue9ResHtb33d8a02",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update project");
  }

  return response.json();
};

export const createNewProject = async ({
  formData,
}: {
  formData: FormData;
}): Promise<Project> => {
  const response = await fetch("https://jsk-co.com/api/projects", {
    method: "POST",
    headers: {
      Authorization:
        "Bearer 3|aEbpCRb3dEf0gV3YyrmjFpmGdkEyYGxJue9ResHtb33d8a02",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  return response.json();
};

export const getProjectById = (id: string) => {
  return useQuery({
    queryKey: ["project"],
    queryFn: () => fetchProjectById(id),
  });
};

export const updateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProjectById,
    onSuccess: () => {
      // Invalidate the projects query to refetch data after update
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
  });
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

export const createProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewProject,
    onSuccess: () => {
      // Invalidate the projects query to refetch data after creation
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
