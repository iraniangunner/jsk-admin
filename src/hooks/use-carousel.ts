import { Slide } from "@/types/carousel-types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// export type UpdateSlideData = {
//   id: number;
//   data: Partial<Slide>;
// };

export const fetchSlides = async (): Promise<Slide[] | any> => {
  const response = await fetch("https://jsk-co.com/api/sliders", {
    headers: {
      Authorization:
        "Bearer 3|aEbpCRb3dEf0gV3YyrmjFpmGdkEyYGxJue9ResHtb33d8a02",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch slides");
  }

  return response.json();
};

export const fetchSlideById = async (id: string): Promise<Slide | any> => {
  const response = await fetch(`https://jsk-co.com/api/sliders/${id}`, {
    headers: {
      Authorization:
        "Bearer 3|aEbpCRb3dEf0gV3YyrmjFpmGdkEyYGxJue9ResHtb33d8a02",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch slide");
  }

  return response.json();
};

export const deleteSlideById = async (id: number): Promise<void> => {
  const response = await fetch(`https://jsk-co.com/api/sliders/${id}`, {
    method: "DELETE",
    headers: {
      Authorization:
        "Bearer 3|aEbpCRb3dEf0gV3YyrmjFpmGdkEyYGxJue9ResHtb33d8a02",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete slide");
  }

  return;
};

export const updateSlideById = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}): Promise<Slide> => {
  const response = await fetch(`https://jsk-co.com/api/sliders/${id}`, {
    method: "POST", // or PUT if your backend accepts PUT with multipart
    headers: {
      Authorization:
        "Bearer 3|aEbpCRb3dEf0gV3YyrmjFpmGdkEyYGxJue9ResHtb33d8a02",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update slide");
  }

  return response.json();
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

export const createNewSlide = async ({
  formData,
}: {
  formData: FormData;
}): Promise<Slide> => {
  const response = await fetch("https://jsk-co.com/api/sliders", {
    method: "POST",
    headers: {
      Authorization:
        "Bearer 3|aEbpCRb3dEf0gV3YyrmjFpmGdkEyYGxJue9ResHtb33d8a02",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create slide");
  }

  return response.json();
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
