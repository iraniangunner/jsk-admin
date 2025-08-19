import type {
  CreateJobCategoryRequest,
  JobCategory,
  UpdateJobCategoryRequest,
} from "@/types/jobCategory-types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";


export const fetchJobCategories = async (): Promise<JobCategory[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job-categories`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch job categories");
  }

  return response.json();
};

export const fetchJobCategoryById = async (
  id: string
): Promise<JobCategory> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job-categories/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch job category");
  }

  return response.json();
};

export const deleteJobCategoryById = async (id: number): Promise<void> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job-categories/${id}`, {
    method: "DELETE",
    // headers: {
    //   Authorization: AUTH_TOKEN,
    //   "Content-Type": "application/json",
    // },
  });

  if (!response.ok) {
    throw new Error("Failed to delete job category");
  }

  return;
};

export const updateJobCategoryById = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateJobCategoryRequest;
}) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job-categories/${id}`, {
    method: "PUT", 
    // headers: {
    //   Authorization: AUTH_TOKEN,
    //   "Content-Type": "application/json",
    // },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update job category");
  }

  return;
};

export const createNewJobCategory = async ({
  data,
}: {
  data: CreateJobCategoryRequest;
}): Promise<JobCategory> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job-categories`, {
    method: "POST",
    // headers: {
    //   Authorization: AUTH_TOKEN,
    //   "Content-Type": "application/json",
    // },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create job category");
  }

  return response.json();
};

// React Query Hooks
export const getJobCategories = () => {
  return useQuery({
    queryKey: ["job-categories"],
    queryFn: () => fetchJobCategories(),
  });
};

export const getJobCategoryById = (id: string) => {
  return useQuery({
    queryKey: ["job-category", id],
    queryFn: () => fetchJobCategoryById(id),
    enabled: !!id, // Only run query if id exists
  });
};

export const deleteJobCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteJobCategoryById,
    onSuccess: () => {
      // Invalidate the job-cities query to refetch data after deletion
      queryClient.invalidateQueries({ queryKey: ["job-categories"] });
    },
  });
};

export const updateJobCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateJobCategoryById,
    onSuccess: (data, variables) => {
      // Invalidate the job-categories query to refetch data after update
      queryClient.invalidateQueries({ queryKey: ["job-categories"] });
      queryClient.invalidateQueries({
        queryKey: ["job-category", variables.id],
      });
    },
  });
};

export const createJobCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNewJobCategory,
    onSuccess: () => {
      // Invalidate the job-cities query to refetch data after creation
      queryClient.invalidateQueries({ queryKey: ["job-categories"] });
    },
  });
};
