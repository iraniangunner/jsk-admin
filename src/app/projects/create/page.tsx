import { ProjectCreate } from "@/components/project-create";
import QueryProvider from "@/providers/query-provider";

export default function CreateProject() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <ProjectCreate />
      </QueryProvider>
    </div>
  );
}
