import { useQueryClient, useMutation } from "@tanstack/react-query";

import {
  ResumeSearchParams,
  Resume,
  PaginatedResumeResponse,
} from "@/types/resume-types";
import { useQuery } from "@tanstack/react-query";

export const fetchResumes = async (
  params: ResumeSearchParams
): Promise<PaginatedResumeResponse<Resume>> => {
  const queryParams = new URLSearchParams();
  if (params.page) {
    queryParams.set("page", params.page.toString());
  }
  if (params.per_page) {
    queryParams.set("per_page", params.per_page.toString());
  }

  if (params.title && params.title.length >= 2) {
    queryParams.set("title", params.title);
  }

  const response = await fetch(
    `https://jsk-co.com/api/resumes?${queryParams.toString()}`,
    {
      headers: {
        Authorization:
          "Bearer 3|aEbpCRb3dEf0gV3YyrmjFpmGdkEyYGxJue9ResHtb33d8a02",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch resumes");
  }

  return response.json();
};

export const deleteResumeById = async (id: number): Promise<void> => {
  const response = await fetch(`https://jsk-co.com/api/resumes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization:
        "Bearer 3|aEbpCRb3dEf0gV3YyrmjFpmGdkEyYGxJue9ResHtb33d8a02",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete resume");
  }

  return;
};

export const getResumes = (params: ResumeSearchParams) => {
  return useQuery({
    queryKey: ["resumes", params],
    queryFn: () => fetchResumes(params),
    enabled: !params?.title || (params.title?.length ?? 0) >= 2,
  });
};

export const deleteResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResumeById,
    onSuccess: () => {
      // Invalidate the resumes query to refetch data after deletion
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
};
