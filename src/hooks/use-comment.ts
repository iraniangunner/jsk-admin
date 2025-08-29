import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { CommentSearchParams } from "@/types/comment-types";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export const fetchComments = async (
  params: CommentSearchParams
): Promise<Comment[] | any> => {
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
    `${process.env.NEXT_PUBLIC_API_URL}/comments?${queryParams.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
};

export const deleteCommentById = async (id: number): Promise<void> => {
  return await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/comments/${id}`,
    {
      method: "DELETE",
    }
  );
};

export const getComments = (params: CommentSearchParams) => {
  return useQuery({
    queryKey: ["comments", params],
    queryFn: () => fetchComments(params),
    enabled: !params?.title || (params.title?.length ?? 0) >= 2,
  });
};

export const deleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCommentById,
    onSuccess: () => {
      // Invalidate the resumes query to refetch data after deletion
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};
