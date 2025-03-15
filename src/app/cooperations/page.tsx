import { CooperationTable } from "@/components/cooperation-table";
import QueryProvider from "@/providers/query-provider";

export default function Cooperations() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <CooperationTable />
      </QueryProvider>
    </div>
  );
}
