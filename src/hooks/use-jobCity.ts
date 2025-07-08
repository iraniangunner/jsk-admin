import type {
  CreateJobCityRequest,
  JobCity,
  UpdateJobCityRequest,
} from "@/types/jobCity-types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = "https://jsk-co.com/api";
const AUTH_TOKEN = "Bearer 3|aEbpCRb3dEf0gV3YyrmjFpmGdkEyYGxJue9ResHtb33d8a02";

export const fetchJobCities = async (): Promise<JobCity[]> => {
  const response = await fetch(`${API_BASE_URL}/cities`, {
    headers: {
      Authorization: AUTH_TOKEN,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch job cities");
  }

  return response.json();
};

export const fetchJobCityById = async (id: string): Promise<JobCity> => {
  const response = await fetch(`${API_BASE_URL}/cities/${id}`, {
    headers: {
      Authorization: AUTH_TOKEN,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch job city");
  }

  return response.json();
};

export const deleteJobCityById = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/cities/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: AUTH_TOKEN,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete job city");
  }

  return;
};

export const updateJobCityById = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateJobCityRequest;
}) => {
  const response = await fetch(`${API_BASE_URL}/cities/${id}`, {
    method: "PUT", // or PATCH depending on your API
    headers: {
      Authorization: AUTH_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update job city");
  }

  return;
};

export const createNewJobCity = async ({
  data,
}: {
  data: CreateJobCityRequest;
}): Promise<JobCity> => {
  const response = await fetch(`${API_BASE_URL}/cities`, {
    method: "POST",
    headers: {
      Authorization: AUTH_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create job city");
  }

  return response.json();
};

// React Query Hooks
export const getJobCities = () => {
  return useQuery({
    queryKey: ["job-cities"],
    queryFn: () => fetchJobCities(),
  });
};

export const getJobCityById = (id: string) => {
  return useQuery({
    queryKey: ["job-city", id],
    queryFn: () => fetchJobCityById(id),
    enabled: !!id, // Only run query if id exists
  });
};

export const deleteJobCity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteJobCityById,
    onSuccess: () => {
      // Invalidate the job-cities query to refetch data after deletion
      queryClient.invalidateQueries({ queryKey: ["job-cities"] });
    },
  });
};

export const updateJobCity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateJobCityById,
    onSuccess: (data, variables) => {
      // Invalidate the job-cities query to refetch data after update
      queryClient.invalidateQueries({ queryKey: ["job-cities"] });
      queryClient.invalidateQueries({ queryKey: ["job-city", variables.id] });
    },
  });
};

export const createJobCity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNewJobCity,
    onSuccess: () => {
      // Invalidate the job-cities query to refetch data after creation
      queryClient.invalidateQueries({ queryKey: ["job-cities"] });
    },
  });
};
