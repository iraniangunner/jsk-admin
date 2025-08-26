import { EditTenderCategory } from "@/components/tenderCategory-edit";
import QueryProvider from "@/providers/query-provider";

export default function SingleTenderCategory() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <EditTenderCategory />
      </QueryProvider>
    </div>
  );
}
