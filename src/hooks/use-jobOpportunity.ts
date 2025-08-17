import type {
  CreateJobOpportunityRequest,
  JobOpportunity,
  UpdateJobOpportunityRequest,
  JobOpportunityFilters,
} from "@/types/job-opportunity-types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

//const API_BASE_URL = "https://jsk-co.com/api";
//const AUTH_TOKEN = "Bearer 3|aEbpCRb3dEf0gV3YyrmjFpmGdkEyYGxJue9ResHtb33d8a02";

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
  //   if (filters?.page) {
  //     searchParams.append("page", filters.page.toString());
  //   }
  //   if (filters?.per_page) {
  //     searchParams.append("per_page", filters.per_page.toString());
  //   }

  const response = await fetch(
    `/api/proxy/job-opportunities${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`,
    {
      // headers: {
      //   Authorization: AUTH_TOKEN,
      //   "Content-Type": "application/json",
      // },
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
  const response = await fetch(`/api/proxy/job-opportunities/${id}`, {
    method:"GET",
    // headers: {
    //   Authorization: AUTH_TOKEN,
    //   "Content-Type": "application/json",
    // },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch job opportunity");
  }

  return response.json();
};

export const deleteJobOpportunityById = async (id: number): Promise<void> => {
  const response = await fetch(`/api/proxy/job-opportunities/${id}`, {
    method: "DELETE",
    // headers: {
    //   Authorization: AUTH_TOKEN,
    //   "Content-Type": "application/json",
    // },
  });

  if (!response.ok) {
    throw new Error("Failed to delete job opportunity");
  }

  return;
};

export const updateJobOpportunityById = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateJobOpportunityRequest;
}) => {
  const response = await fetch(`/api/proxy/job-opportunities/${id}`, {
    method: "PUT", // or PATCH depending on your API
    // headers: {
    //   Authorization: AUTH_TOKEN,
    //   "Content-Type": "application/json",
    // },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update job opportunity");
  }

  return;
};

export const createNewJobOpportunity = async ({
  data,
}: {
  data: CreateJobOpportunityRequest;
}): Promise<JobOpportunity> => {
  const response = await fetch("/api/proxy/job-opportunities", {
    method: "POST",
    // headers: {
    //   Authorization: AUTH_TOKEN,
    //   "Content-Type": "application/json",
    // },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create job opportunity");
  }

  return response.json();
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
