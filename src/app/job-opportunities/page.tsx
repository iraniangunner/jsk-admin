import { JobOpportunityTable } from "@/components/jobOpportunity-table";
import QueryProvider from "@/providers/query-provider";

export default function JobOpportunities() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <JobOpportunityTable />
      </QueryProvider>
    </div>
  );
}