import { ProjectCategoryTable } from "@/components/projectCategory-table";
import QueryProvider from "@/providers/query-provider";

export default function ProjectCategories() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <ProjectCategoryTable />
      </QueryProvider>
    </div>
  );
}
