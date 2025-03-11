import { CooperationDetails } from "@/components/cooperation-details";
import { getCooperationById } from "@/utils/server/cooperation";

export default async function CooperationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const cooperation = await getCooperationById(Number.parseInt(id, 10));
    return (
      <div className="my-6 mx-8 mt-12">
        <div className="max-w-[960px] mx-auto">
          <CooperationDetails cooperation={cooperation.data} />
        </div>
      </div>
    );
  } catch (error) {
    if (error instanceof Error && error.message === "No such cooperation") {
      return <p>چنین همکاری یافت نشد...</p>;
    }
    return <p>مشکلی پیش امده دوباره تلاش کنید</p>;
  }
}
