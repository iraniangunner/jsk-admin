import { ResumeDetails } from "@/components/resume-details";
import QueryProvider from "@/providers/query-provider";

export default function ResumePage() {
  return (
    <div className="my-6 mx-8 mt-12">
      <div className="max-w-[960px] mx-auto">
        <QueryProvider>
          <ResumeDetails />
        </QueryProvider>
      </div>
    </div>
  );
}
