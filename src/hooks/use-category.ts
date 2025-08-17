import { Category } from "@/types/project-types";
import { useQuery } from "@tanstack/react-query";

//const AUTH_TOKEN = "Bearer 3|aEbpCRb3dEf0gV3YyrmjFpmGdkEyYGxJue9ResHtb33d8a02";

export const fetchCategories = async (): Promise<Category[] | any> => {
  const response = await fetch("/api/proxy/categories", {
    method:"GET",
    // headers: {
    //   Authorization:
    //   AUTH_TOKEN,
    // },
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
