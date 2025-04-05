import EditCarousel from "@/components/carousel-edit";
import QueryProvider from "@/providers/query-provider";

export default function SingleSlide() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <EditCarousel />
      </QueryProvider>
    </div>
  );
}
