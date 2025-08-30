"use client";

import { CommentDetails } from "@/components/comment-details";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function CommentPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="my-6 mx-8 mt-12">
        <div className="max-w-[960px] mx-auto">
          <CommentDetails />
        </div>
      </div>
    </QueryClientProvider>
  );
}
