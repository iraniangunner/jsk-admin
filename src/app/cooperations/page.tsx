import { CooperationCard } from "@/components/cooperation-card";
import { getCooperations } from "@/utils/server/cooperation";

export default async function Cooperation() {
  const cooperations = await getCooperations();
  return (
    <div className="my-6 mx-8 mt-12">
      <div className="mx-auto">
        <h1 className="my-12 p-4 text-2xl text-center font-bold">
          همکاری شرکت ها
        </h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cooperations.data.map((cooperation: any) => (
            <CooperationCard key={cooperation.id} cooperation={cooperation} />
          ))}
        </div>
      </div>
    </div>
  );
}
