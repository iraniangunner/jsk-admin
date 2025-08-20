import { fetchWithAuth } from "@/lib/fetchWithAuth";
import type {
  CreateJobCityRequest,
  JobCity,
  UpdateJobCityRequest,
} from "@/types/jobCity-types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export const fetchJobCities = async (): Promise<JobCity[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cities`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch job cities");
  }

  return response.json();
};

export const fetchJobCityById = async (id: string): Promise<JobCity> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/cities/${id}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch job city");
  }

  return response.json();
};

export const deleteJobCityById = async (id: number): Promise<void> => {
  return await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/cities/${id}`,
    {
      method: "DELETE",
    }
  );
};

export const updateJobCityById = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateJobCityRequest;
}) => {
  return await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/cities/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
};

export const createNewJobCity = async ({
  data,
}: {
  data: CreateJobCityRequest;
}): Promise<JobCity> => {
  return await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/cities`, {
    method: "POST",
    body: JSON.stringify(data),
  });
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
