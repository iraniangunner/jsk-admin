import { CreateTenderCategory } from "@/components/tenderCategory-create";
import QueryProvider from "@/providers/query-provider";

export default function CreateTenderCategories() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <CreateTenderCategory />
      </QueryProvider>
    </div>
  );
}
