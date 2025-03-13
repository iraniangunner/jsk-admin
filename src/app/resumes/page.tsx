import { ResumeTable } from "@/components/resume-table";
import QueryProvider from "@/providers/query-provider";

export default function Resumes() {
  return (
    <div className="my-6 mt-12 mx-4">
      {/* <h1 className="my-12 p-4 text-2xl text-center font-bold">
          رزومه های دریافتی
        </h1> */}
      <QueryProvider>
        <ResumeTable />
      </QueryProvider>
    </div>
  );
}
