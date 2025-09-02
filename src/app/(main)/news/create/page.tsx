import NewsCreate from "@/components/news-create";
import QueryProvider from "@/providers/query-provider";

export default function CreateNews() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <NewsCreate/>
      </QueryProvider>
    </div>
  );
}
