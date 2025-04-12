import { Category } from "@/types/project-types";
import { useQuery } from "@tanstack/react-query";

export const fetchCategories = async (): Promise<Category[] | any> => {
  const response = await fetch("https://jsk-co.com/api/categories", {
    headers: {
      Authorization:
        "Bearer 3|aEbpCRb3dEf0gV3YyrmjFpmGdkEyYGxJue9ResHtb33d8a02",
    },
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
