import { CommentDetails } from "@/components/comment-details";
import QueryProvider from "@/providers/query-provider";

export default function CommentPage() {
  return (
    <div className="my-6 mx-8 mt-12">
      <div className="max-w-[960px] mx-auto">
        <QueryProvider>
          <CommentDetails />
        </QueryProvider>
      </div>
    </div>
  );
}
