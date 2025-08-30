"use client";
import { CooperationDetails } from "@/components/cooperation-details";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function CooperationPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="my-6 mx-8 mt-12">
        <div className="max-w-[960px] mx-auto">
          <CooperationDetails />
        </div>
      </div>
    </QueryClientProvider>
  );
}
