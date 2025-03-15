import { CommentTable } from "@/components/comment-table";
import QueryProvider from "@/providers/query-provider";

export default function Resumes() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <CommentTable />
      </QueryProvider>
    </div>
  );
}
