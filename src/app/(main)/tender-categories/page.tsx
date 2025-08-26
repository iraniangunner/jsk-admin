import { TenderCategoryTable } from "@/components/tenderCategory-table";
import QueryProvider from "@/providers/query-provider";

export default function TenderCategories() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <TenderCategoryTable />
      </QueryProvider>
    </div>
  );
}
