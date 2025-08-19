import { CommentDetails } from "@/components/comment-details";
import { getCommentById } from "@/utils/server/comment";

export default async function CommentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const comment = await getCommentById(Number.parseInt(id, 10));
    return (
      <div className="my-6 mx-8 mt-12">
        <div className="max-w-[960px] mx-auto">
          <CommentDetails comment={comment} />
        </div>
      </div>
    );
  } catch (error) {
    if (error instanceof Error && error.message === "No such comment") {
      return <p>چنین پیامی یافت نشد...</p>;
    }
    return <p>مشکلی پیش امده دوباره تلاش کنید</p>;
  }
}
