import { ResumeTable } from "@/components/resume-table";
import QueryProvider from "@/providers/query-provider";
import { getResumes } from "@/utils/server/resume";

export default async function Resumes() {
  const resumes = await getResumes();
  return (
    <div className="my-6 mx-8 mt-12">
      <div className="mx-auto">
        <h1 className="my-12 p-4 text-2xl text-center font-bold">
          رزومه های دریافتی
        </h1>
        <QueryProvider>
          <ResumeTable />
        </QueryProvider>
      </div>
    </div>
  );
}
