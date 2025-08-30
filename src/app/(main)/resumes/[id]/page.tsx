"use client";
import { ResumeDetails } from "@/components/resume-details";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function ResumePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="my-6 mx-8 mt-12">
        <div className="max-w-[960px] mx-auto">
          <ResumeDetails />
        </div>
      </div>
    </QueryClientProvider>
  );
}
