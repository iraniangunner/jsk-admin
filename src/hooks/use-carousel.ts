import { Slide } from "@/types/carousel-types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

//const AUTH_TOKEN = "Bearer 3|aEbpCRb3dEf0gV3YyrmjFpmGdkEyYGxJue9ResHtb33d8a02";

// 5|qVzNpMFyHLf6yVe3g2nMCKZpBMt96njAy1ifV5khaadb8391

export const fetchSlides = async (): Promise<Slide[] | any> => {
  const response = await fetch("/api/proxy/sliders", {
    method:"GET",
    // headers: {
    //   Authorization:
    //     AUTH_TOKEN,
    // },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch slides");
  }

  return response.json();
};

export const fetchSlideById = async (id: string): Promise<Slide | any> => {
  const response = await fetch(`/api/proxy/sliders/${id}`, {
    method:"GET",
    // headers: {
    //   Authorization:
    //   AUTH_TOKEN,
    // },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch slide");
  }

  return response.json();
};

export const deleteSlideById = async (id: number): Promise<void> => {
  const response = await fetch(`/api/proxy/sliders/${id}`, {
    method: "DELETE",
    // headers: {
    //   Authorization:
    //   AUTH_TOKEN,
    // },
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
  const response = await fetch(`/api/proxy/sliders/${id}`, {
    method: "POST", // or PUT if your backend accepts PUT with multipart
    // headers: {
    //   Authorization:
    //   AUTH_TOKEN,
    // },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update slide");
  }

  return response.json();
};

export const createNewSlide = async ({
  formData,
}: {
  formData: FormData;
}): Promise<Slide> => {
  const response = await fetch("/api/proxy/sliders", {
    method: "POST",
    // headers: {
    //   Authorization:
    //   AUTH_TOKEN,
    // },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create slide");
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
