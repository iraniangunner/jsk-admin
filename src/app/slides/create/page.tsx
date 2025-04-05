import CreateCarousel from "@/components/carousel-create";
import QueryProvider from "@/providers/query-provider";

export default function CreateSlide() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <CreateCarousel />
      </QueryProvider>
    </div>
  );
}
