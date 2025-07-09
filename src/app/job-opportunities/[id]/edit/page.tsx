import JobOpportunityEdit from "@/components/jobOpportunity-edit";
import QueryProvider from "@/providers/query-provider";

export default function SingleJobOpportunity() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <JobOpportunityEdit  />
      </QueryProvider>
    </div>
  );
}
