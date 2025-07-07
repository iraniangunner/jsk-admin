import {EditJobCity} from "@/components/jobCity-edit";
import QueryProvider from "@/providers/query-provider";

export default function SingleJobCity() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <EditJobCity />
      </QueryProvider>
    </div>
  );
}
