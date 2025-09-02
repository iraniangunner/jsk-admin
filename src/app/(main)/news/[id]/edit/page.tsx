import EditNews from "@/components/news-edit";
import QueryProvider from "@/providers/query-provider";

export default function SingleNews() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <EditNews />
      </QueryProvider>
    </div>
  );
}
