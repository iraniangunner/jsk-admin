import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Slide } from "@/types/carousel-types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export const fetchSlides = async (): Promise<Slide[] | any> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sliders`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch slides");
  }

  return response.json();
};

export const fetchSlideById = async (id: string): Promise<Slide | any> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/sliders/${id}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch slide");
  }

  return response.json();
};

export const deleteSlideById = async (id: number): Promise<void> => {
  return await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/sliders/${id}`,
    {
      method: "DELETE",
    }
  );
};

export const updateSlideById = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}): Promise<Slide> => {
  return await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/sliders/${id}`,
    {
      method: "POST",
      body: formData,
    }
  );
};

export const createNewSlide = async ({
  formData,
}: {
  formData: FormData;
}): Promise<Slide> => {
  return await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/sliders`, {
    method: "POST",
    body: formData,
  });
};

export const getSlides = () => {
  return useQuery({
    queryKey: ["slides"],
    queryFn: () => fetchSlides(),
  });
};

export const getSlideById = (id: string) => {
  return useQuery({
    queryKey: ["slide"],
    queryFn: () => fetchSlideById(id),
  });
};

export const deleteSlide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSlideById,
    onSuccess: () => {
      // Invalidate the slides query to refetch data after deletion
      queryClient.invalidateQueries({ queryKey: ["slides"] });
    },
  });
};

export const updateSlide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSlideById,
    onSuccess: () => {
      // Invalidate the slides query to refetch data after update
      queryClient.invalidateQueries({ queryKey: ["slides"] });
      queryClient.invalidateQueries({ queryKey: ["slide"] });
    },
  });
};

export const createSlide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewSlide,
    onSuccess: () => {
      // Invalidate the slides query to refetch data after creation
      queryClient.invalidateQueries({ queryKey: ["slides"] });
    },
  });
};
