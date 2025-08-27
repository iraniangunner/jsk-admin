import { EditTender } from "@/components/tender-edit";
import QueryProvider from "@/providers/query-provider";

export default function SingleTender() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <EditTender />
      </QueryProvider>
    </div>
  );
}
