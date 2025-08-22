import { EditProjectCategory } from "@/components/projectCategory-edit";
import QueryProvider from "@/providers/query-provider";

export default function SingleProjectCategory() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <EditProjectCategory />
      </QueryProvider>
    </div>
  );
}
