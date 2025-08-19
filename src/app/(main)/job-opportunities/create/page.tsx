import JobOpportunityCreate from "@/components/jobOpportunity-create";
import QueryProvider from "@/providers/query-provider";

export default function CreateJobOpportunities() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <JobOpportunityCreate />
      </QueryProvider>
    </div>
  );
}
