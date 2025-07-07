import { JobCategoryTable } from "@/components/jobCategory-table";
import QueryProvider from "@/providers/query-provider";

export default function JobCategories() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <JobCategoryTable />
      </QueryProvider>
    </div>
  );
}
