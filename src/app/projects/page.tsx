import { ProjectTable } from "@/components/project-table";
import QueryProvider from "@/providers/query-provider";

export default function Projects() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <ProjectTable />
      </QueryProvider>
    </div>
  );
}
