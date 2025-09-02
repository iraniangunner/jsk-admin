import { NewsTable } from "@/components/news-table";
import QueryProvider from "@/providers/query-provider";

export default function News() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <NewsTable />
      </QueryProvider>
    </div>
  );
}