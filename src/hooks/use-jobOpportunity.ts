import { fetchWithAuth } from "@/lib/fetchWithAuth";
import type {
  CreateJobOpportunityRequest,
  JobOpportunity,
  UpdateJobOpportunityRequest,
  JobOpportunityFilters,
} from "@/types/job-opportunity-types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export const fetchJobOpportunities = async (
  filters?: JobOpportunityFilters
): Promise<JobOpportunity[]> => {
  const searchParams = new URLSearchParams();

  if (filters?.job_category_id) {
    searchParams.append("job_category_id", filters.job_category_id.toString());
  }
  if (filters?.city_id) {
    searchParams.append("city_id", filters.city_id.toString());
  }
  if (filters?.title) {
    searchParams.append("search", filters.title);
  }
  if (filters?.title_en) {
    searchParams.append("search", filters.title_en);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/job-opportunities${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch job opportunities");
  }

  return response.json();
};

export const fetchJobOpportunityById = async (
  id: string
): Promise<JobOpportunity> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/job-opportunities/${id}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch job opportunity");
  }

  return response.json();
};

export const deleteJobOpportunityById = async (id: number): Promise<void> => {
  return await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/job-opportunities/${id}`,
    {
      method: "DELETE",
    }
  );
};

export const updateJobOpportunityById = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateJobOpportunityRequest;
}) => {
  return await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/job-opportunities/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
      // headers: {
      //   "Content-Type": "application/json",
      // },
    }
  );
};

export const createNewJobOpportunity = async ({
  data,
}: {
  data: CreateJobOpportunityRequest;
}): Promise<JobOpportunity> => {
  return await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/job-opportunities`,
    {
      method: "POST",
      body: JSON.stringify(data),
      // headers: {
      //   "Content-Type": "application/json",
      // },
    }
  );
};

// React Query Hooks
export const getJobOpportunities = (filters?: JobOpportunityFilters) => {
  return useQuery({
    queryKey: ["job-opportunities", filters],
    queryFn: () => fetchJobOpportunities(filters),
  });
};

export const getJobOpportunityById = (id: string) => {
  return useQuery({
    queryKey: ["job-opportunity", id],
    queryFn: () => fetchJobOpportunityById(id),
    enabled: !!id, // Only run query if id exists
  });
};

export const deleteJobOpportunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteJobOpportunityById,
    onSuccess: () => {
      // Invalidate the job-opportunities query to refetch data after deletion
      queryClient.invalidateQueries({ queryKey: ["job-opportunities"] });
    },
  });
};

export const updateJobOpportunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateJobOpportunityById,
    onSuccess: (data, variables) => {
      // Invalidate the job-opportunities query to refetch data after update
      queryClient.invalidateQueries({ queryKey: ["job-opportunities"] });
      queryClient.invalidateQueries({
        queryKey: ["job-opportunity", variables.id],
      });
    },
  });
};

export const createJobOpportunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNewJobOpportunity,
    onSuccess: () => {
      // Invalidate the job-opportunities query to refetch data after creation
      queryClient.invalidateQueries({ queryKey: ["job-opportunities"] });
    },
  });
};

// Additional utility hooks for specific use cases
export const getJobOpportunitiesByCategory = (categoryId: number) => {
  return useQuery({
    queryKey: ["job-opportunities", "category", categoryId],
    queryFn: () => fetchJobOpportunities({ job_category_id: categoryId }),
    enabled: !!categoryId,
  });
};

export const getJobOpportunitiesByCity = (cityId: number) => {
  return useQuery({
    queryKey: ["job-opportunities", "city", cityId],
    queryFn: () => fetchJobOpportunities({ city_id: cityId }),
    enabled: !!cityId,
  });
};

export const searchJobOpportunities = (searchTerm: string) => {
  return useQuery({
    queryKey: ["job-opportunities", "search", searchTerm],
    queryFn: () => fetchJobOpportunities({ title: searchTerm }),
    enabled: !!searchTerm && searchTerm.length > 2, // Only search if term is longer than 2 characters
  });
};
