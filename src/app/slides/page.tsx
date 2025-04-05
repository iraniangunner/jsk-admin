import { CarouselTable } from "@/components/carousel-table";
import QueryProvider from "@/providers/query-provider";

export default function Slides() {
  return (
    <div className="my-6 mt-12 mx-4">
      <QueryProvider>
        <CarouselTable/>
      </QueryProvider>
    </div>
  );
}
