import { EditJobCategory } from "@/components/jobCategory-edit";
import QueryProvider from "@/providers/query-provider";

export default function SingleJobCategory() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <EditJobCategory />
      </QueryProvider>
    </div>
  );
}
