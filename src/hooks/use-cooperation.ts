import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  CooperationSearchParams,
  Cooperation,
  PaginatedCooperationResponse,
} from "@/types/cooperation-types";
import { useQuery } from "@tanstack/react-query";


export const fetchCooperations = async (
  params: CooperationSearchParams
): Promise<PaginatedCooperationResponse<Cooperation>> => {
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
    `${process.env.NEXT_PUBLIC_API_URL}/companies-cooperation?${queryParams.toString()}`,
    {
      method:"GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch cooperations");
  }

  return response.json();
};

export const deleteCooperationById = async (id: number): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/companies-cooperation/${id}`,
    {
      method: "DELETE",
      // headers: {
      //   Authorization:
      //   AUTH_TOKEN,
      // },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete cooperation");
  }

  return;
};

export const getCooperations = (params: CooperationSearchParams) => {
  return useQuery({
    queryKey: ["cooperations", params],
    queryFn: () => fetchCooperations(params),
    enabled: !params?.title || (params.title?.length ?? 0) >= 2,
  });
};

export const deleteCooperation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCooperationById,
    onSuccess: () => {
      // Invalidate the resumes query to refetch data after deletion
      queryClient.invalidateQueries({ queryKey: ["cooperations"] });
    },
  });
};
