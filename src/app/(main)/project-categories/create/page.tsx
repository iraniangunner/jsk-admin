import { CreateProjectCategory } from "@/components/projectCategory-create";
import QueryProvider from "@/providers/query-provider";

export default function CreateProjectCategories() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <CreateProjectCategory />
      </QueryProvider>
    </div>
  );
}
