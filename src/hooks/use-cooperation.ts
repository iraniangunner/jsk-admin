import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  CooperationSearchParams,
  Cooperation,
  PaginatedCooperationResponse,
  CooperationResponse,
} from "@/types/cooperation-types";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

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

  return await fetchWithAuth(
    `${
      process.env.NEXT_PUBLIC_API_URL
    }/companies-cooperation?${queryParams.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
};

// export async function fetchCooperationById(id: string) {
//   return await fetchWithAuth(
//     ` ${process.env.NEXT_PUBLIC_API_URL}/companies-cooperation/${id}`,
//     {
//       method: "GET",
//       cache: "no-store",
//     }
//   );
// }

export const fetchCooperationById = async (id: string): Promise<CooperationResponse> => {
  return await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/companies-cooperation/${id}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
};

export const deleteCooperationById = async (id: number): Promise<void> => {
  return await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/companies-cooperation/${id}`,
    {
      method: "DELETE",
    }
  );
};

export const getCooperations = (params: CooperationSearchParams) => {
  return useQuery({
    queryKey: ["cooperations", params],
    queryFn: () => fetchCooperations(params),
    enabled: !params?.title || (params.title?.length ?? 0) >= 2,
  });
};


export const getCooperationById = (id: string) => {
  return useQuery({
    queryKey: ["cooperation"],
    queryFn: () => fetchCooperationById(id),
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
