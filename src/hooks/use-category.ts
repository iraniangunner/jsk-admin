import { Category } from "@/types/project-types";
import { useQuery } from "@tanstack/react-query";


export const fetchCategories = async (): Promise<Category[] | any> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
    method:"GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
};

export const getCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });
};
