import { CooperationDetails } from "@/components/cooperation-details";
import QueryProvider from "@/providers/query-provider";

export default function CooperationPage() {
  return (
    <div className="my-6 mx-8 mt-12">
      <div className="max-w-[960px] mx-auto">
        <QueryProvider>
          <CooperationDetails />
        </QueryProvider>
      </div>
    </div>
  );
}
