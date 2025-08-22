import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  PaginatedProjectResponse,
  Project,
  ProjectSearchParams,
} from "@/types/project-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const fetchProjects = async (
  params: ProjectSearchParams
): Promise<PaginatedProjectResponse<Project>> => {
  const queryParams = new URLSearchParams();
  if (params.page) {
    queryParams.set("page", params.page.toString());
  }
  if (params.per_page) {
    queryParams.set("per_page", params.per_page.toString());
  }

  if (params.category_id) {
    queryParams.set("category_id", params.category_id);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects?${queryParams.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
};

export const fetchProjectById = async (id: string): Promise<Project | any> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }

  return response.json();
};

export const deleteProjectById = async (id: number): Promise<void> => {
  return await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
    {
      method: "DELETE",
    }
  );
};

export const updateProjectById = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}): Promise<Project> => {
  return await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
    {
      method: "POST",
      body: formData,
    }
  );
};

export const createNewProject = async ({
  formData,
}: {
  formData: FormData;
}): Promise<Project> => {
  return await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
    method: "POST",
    body: formData,
  });
};



// export const createNewProject = async (formData: FormData) => {
//   try {
//     // دریافت توکن از API داخلی خودت
//     // const tokenRes = await fetch("/api/token", { cache: "no-store" });
//     // if (!tokenRes.ok) throw new Error("No token found");
//     // const { token } = await tokenRes.json();

//     // ارسال request
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
//       method: "POST",
//       body: formData, // ⚠️ هیچ Content-Type دستی قرار نده
//       // headers: {
//       //   Authorization: `Bearer ${token}`,
//       // },
//       // redirect: "manual", // جلوگیری از ری‌دایرکت خودکار مرورگر
//     });

//     // اگر status 302 یا 307 بود، مشخصاً توکن یا مسیر مشکل داره
//     if (response.status === 302 || response.status === 307) {
//       const location = response.headers.get("Location");
//       throw new Error(`Redirected to ${location}. احتمالا توکن نامعتبر است.`);
//     }

//     if (!response.ok) {
//       const text = await response.text();
//         console.log(text)
//       throw new Error(text || "خطا در ارسال پروژه");
//     }

//     return await response.json();
//   } catch (err) {
//     console.error("Error creating project:", err);
//     throw err;
//   }
// };


export const getProjectById = (id: string) => {
  return useQuery({
    queryKey: ["project"],
    queryFn: () => fetchProjectById(id),
  });
};

export const updateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProjectById,
    onSuccess: () => {
      // Invalidate the projects query to refetch data after update
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
  });
};

export const deleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProjectById,
    onSuccess: () => {
      // Invalidate the projects query to refetch data after deletion
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const getProjects = (params: ProjectSearchParams) => {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => fetchProjects(params),
    //   enabled: !params?.title || (params.title?.length ?? 0) >= 2,
  });
};

export const createProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewProject,
    onSuccess: () => {
      // Invalidate the projects query to refetch data after creation
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
