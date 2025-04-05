import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { CommentSearchParams, PaginatedCommentResponse } from "@/types/comment-types";

export const fetchComments = async (
  params:CommentSearchParams
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

  const response = await fetch(
    `https://jsk-co.com/api/comments?${queryParams.toString()}`,
    {
      headers: {
        Authorization:
          "Bearer 3|aEbpCRb3dEf0gV3YyrmjFpmGdkEyYGxJue9ResHtb33d8a02",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }

  return response.json();
};

export const deleteCommentById = async (id: number): Promise<void> => {
  const response = await fetch(
    `https://jsk-co.com/api/comments/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization:
          "Bearer 3|aEbpCRb3dEf0gV3YyrmjFpmGdkEyYGxJue9ResHtb33d8a02",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete comment");
  }

  return;
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
