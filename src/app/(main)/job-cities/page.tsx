import { JobCityTable } from "@/components/jobCity-table";
import QueryProvider from "@/providers/query-provider";

export default function JobCities() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <JobCityTable />
      </QueryProvider>
    </div>
  );
}
