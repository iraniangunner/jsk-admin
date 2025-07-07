import { CreateJobCategory } from "@/components/jobCategory-create";
import QueryProvider from "@/providers/query-provider";

export default function CreateJobCategories() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <CreateJobCategory />
      </QueryProvider>
    </div>
  );
}
