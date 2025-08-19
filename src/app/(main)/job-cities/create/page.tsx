import { CreateJobCity } from "@/components/jobCity-create";
import QueryProvider from "@/providers/query-provider";

export default function CreateJobCities() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <CreateJobCity />
      </QueryProvider>
    </div>
  );
}
