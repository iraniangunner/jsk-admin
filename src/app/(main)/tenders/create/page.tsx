import { CreateTender } from "@/components/tender-create";
import QueryProvider from "@/providers/query-provider";

export default function CreateTenders() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <CreateTender />
      </QueryProvider>
    </div>
  );
}
