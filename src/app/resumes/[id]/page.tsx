import { ResumeDetails } from "@/components/resume-details";
import { getResumeById } from "@/utils/server/resume";

export default async function ResumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const resume = await getResumeById(Number.parseInt(id, 10));
    return (
      <div className="my-6 mx-8 mt-12">
        <div className="max-w-[960px] mx-auto">
          <ResumeDetails resume={resume.data} />
        </div>
      </div>
    );
  } catch (error) {
    if (error instanceof Error && error.message === "No such resume") {
      return <p>چنین رزومه ای یافت نشد...</p>;
    }
    return <p>مشکلی پیش امده دوباره تلاش کنید</p>;
  }
}
