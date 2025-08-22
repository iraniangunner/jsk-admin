"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getJobCategories } from "@/hooks/use-jobCategory";
import { getJobCities } from "@/hooks/use-jobCity";
import {
  updateJobOpportunity,
  getJobOpportunityById,
} from "@/hooks/use-jobOpportunity";
import type { UpdateJobOpportunityRequest } from "@/types/job-opportunity-types";

const jobOpportunitySchema = z.object({
  title: z
    .string()
    .min(1, "عنوان شغل الزامی است")
    .max(63, "عنوان شغل نباید بیش از 63 کاراکتر باشد"),
  title_en: z
    .string()
    .max(63, "عنوان انگلیسی نباید بیش از 63 کاراکتر باشد")
    .optional()
    .or(z.literal("")),
  job_category_id: z.number().min(1, "انتخاب دسته‌بندی الزامی است"),
  city_id: z.number().min(1, "انتخاب شهر الزامی است"),
  persian_content: z.object({
    description: z.string().optional(),
    requirements: z.array(z.string()),
    responsibilities: z.array(z.string()),
  }),
  english_content: z.object({
    description: z.string().optional(),
    requirements: z.array(z.string()),
    responsibilities: z.array(z.string()),
  }),
});

type JobOpportunityFormData = z.infer<typeof jobOpportunitySchema>;

interface StructuredJobData {
  description: string;
  requirements: string[];
  responsibilities: string[];
}

export default function JobOpportunityEdit() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JobOpportunityFormData>({
    resolver: zodResolver(jobOpportunitySchema),
    defaultValues: {
      title: "",
      title_en: "",
      job_category_id: 0,
      city_id: 0,
      persian_content: {
        description: "",
        requirements: [""],
        responsibilities: [""],
      },
      english_content: {
        description: "",
        requirements: [""],
        responsibilities: [""],
      },
    },
  });

  // Watch form values for dynamic arrays
  const persianRequirements = watch("persian_content.requirements");
  const persianResponsibilities = watch("persian_content.responsibilities");
  const englishRequirements = watch("english_content.requirements");
  const englishResponsibilities = watch("english_content.responsibilities");

  // API hooks
  const { data: categories, isLoading: loadingCategories } = getJobCategories();
  const { data: cities, isLoading: loadingCities } = getJobCities();
  const { data: jobOpportunity, isLoading: isLoadingJob } =
    getJobOpportunityById(jobId);
  const { mutate: updateJobMutation, isPending: isSaving } =
    updateJobOpportunity();

  // Parse structured data from JSON strings
  const parseStructuredData = (textContent?: string): StructuredJobData => {
    if (!textContent) {
      return { description: "", requirements: [""], responsibilities: [""] };
    }

    try {
      const parsed = JSON.parse(textContent);
      return {
        description: parsed.description || "",
        requirements:
          Array.isArray(parsed.requirements) && parsed.requirements.length > 0
            ? parsed.requirements
            : [""],
        responsibilities:
          Array.isArray(parsed.responsibilities) &&
          parsed.responsibilities.length > 0
            ? parsed.responsibilities
            : [""],
      };
    } catch {
      return {
        description: textContent,
        requirements: [""],
        responsibilities: [""],
      };
    }
  };

  useEffect(() => {
    if (jobOpportunity) {
      // Parse Persian data
      const parsedPersianData = parseStructuredData(jobOpportunity.text);
      // Parse English data
      const parsedEnglishData = parseStructuredData(jobOpportunity.text_en);

      reset({
        title: jobOpportunity.title || "",
        title_en: jobOpportunity.title_en || "",
        job_category_id: jobOpportunity.job_category_id || 0,
        city_id: jobOpportunity.city_id || 0,
        persian_content: {
          description: parsedPersianData.description,
          requirements: parsedPersianData.requirements,
          responsibilities: parsedPersianData.responsibilities,
        },
        english_content: {
          description: parsedEnglishData.description,
          requirements: parsedEnglishData.requirements,
          responsibilities: parsedEnglishData.responsibilities,
        },
      });
    }
  }, [jobOpportunity, reset]);

  const addPersianRequirement = () => {
    setValue("persian_content.requirements", [...persianRequirements, ""]);
  };

  const removePersianRequirement = (index: number) => {
    setValue(
      "persian_content.requirements",
      persianRequirements.filter((_, i) => i !== index)
    );
  };

  const updatePersianRequirement = (index: number, value: string) => {
    const updated = [...persianRequirements];
    updated[index] = value;
    setValue("persian_content.requirements", updated);
  };

  const addPersianResponsibility = () => {
    setValue("persian_content.responsibilities", [
      ...persianResponsibilities,
      "",
    ]);
  };

  const removePersianResponsibility = (index: number) => {
    setValue(
      "persian_content.responsibilities",
      persianResponsibilities.filter((_, i) => i !== index)
    );
  };

  const updatePersianResponsibility = (index: number, value: string) => {
    const updated = [...persianResponsibilities];
    updated[index] = value;
    setValue("persian_content.responsibilities", updated);
  };

  const addEnglishRequirement = () => {
    setValue("english_content.requirements", [...englishRequirements, ""]);
  };

  const removeEnglishRequirement = (index: number) => {
    setValue(
      "english_content.requirements",
      englishRequirements.filter((_, i) => i !== index)
    );
  };

  const updateEnglishRequirement = (index: number, value: string) => {
    const updated = [...englishRequirements];
    updated[index] = value;
    setValue("english_content.requirements", updated);
  };

  const addEnglishResponsibility = () => {
    setValue("english_content.responsibilities", [
      ...englishResponsibilities,
      "",
    ]);
  };

  const removeEnglishResponsibility = (index: number) => {
    setValue(
      "english_content.responsibilities",
      englishResponsibilities.filter((_, i) => i !== index)
    );
  };

  const updateEnglishResponsibility = (index: number, value: string) => {
    const updated = [...englishResponsibilities];
    updated[index] = value;
    setValue("english_content.responsibilities", updated);
  };

  const onSubmit = async (data: JobOpportunityFormData) => {
    try {
      // Structure the Persian data for text
      const structuredTextPersian = JSON.stringify({
        description: data.persian_content.description,
        requirements: data.persian_content.requirements.filter(
          (req) => req.trim() !== ""
        ),
        responsibilities: data.persian_content.responsibilities.filter(
          (resp) => resp.trim() !== ""
        ),
      });

      // Structure the English data for text_en
      const structuredTextEnglish = JSON.stringify({
        description: data.english_content.description,
        requirements: data.english_content.requirements.filter(
          (req) => req.trim() !== ""
        ),
        responsibilities: data.english_content.responsibilities.filter(
          (resp) => resp.trim() !== ""
        ),
      });

      const updateData: UpdateJobOpportunityRequest = {
        title: data.title.trim(),
        title_en: data.title_en?.trim() || undefined,
        job_category_id: data.job_category_id,
        city_id: data.city_id,
        text: structuredTextPersian,
        text_en: structuredTextEnglish,
      };

      updateJobMutation(
        { id: jobId, data: updateData },
        {
          onSuccess: () => {
            toast.success("فرصت شغلی با موفقیت به‌روزرسانی شد");
            setTimeout(() => {
              router.push("/job-opportunities");
            }, 1500);
          },
          onError: (error) => {
            console.error("Update failed:", error);
            toast.error("خطا در به‌روزرسانی فرصت شغلی. لطفا دوباره تلاش کنید.");
          },
        }
      );
    } catch (err) {
      toast.error("خطا در به‌روزرسانی فرصت شغلی. لطفا دوباره تلاش کنید.");
      console.error(err);
    }
  };

  if (isLoadingJob) {
    return (
      <div className="container py-10 max-w-4xl mx-auto" dir="rtl">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="mr-2">در حال بارگذاری...</span>
        </div>
      </div>
    );
  }

  if (!jobOpportunity) {
    return (
      <div className="container py-10 max-w-4xl mx-auto" dir="rtl">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-red-500">فرصت شغلی یافت نشد</p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => router.push("/job-categories")}
            >
              بازگشت به لیست
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="container py-10 max-w-4xl mx-auto" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">ویرایش فرصت شغلی</h1>
          <Button
            variant="outline"
            className="cursor-pointer bg-transparent"
            onClick={() => router.push("/job-opportunities")}
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            بازگشت به لیست
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardDescription>
              اطلاعات فرصت شغلی را ویرایش کنید و دکمه به‌روزرسانی را بزنید.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title" className="required mb-2">
                      عنوان شغل (فارسی)
                    </Label>
                    <Input
                      id="title"
                      {...register("title")}
                      placeholder="عنوان شغل را وارد کنید"
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="title_en" className="mb-2">
                      عنوان شغل (انگلیسی)
                    </Label>
                    <Input
                      dir="ltr"
                      id="title_en"
                      {...register("title_en")}
                      placeholder="Job Title (optional)"
                    />
                    {errors.title_en && (
                      <p className="text-sm text-red-500">
                        {errors.title_en.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category" className="required mb-2">
                      دسته‌بندی شغلی
                    </Label>
                    <select
                      id="category"
                      {...register("job_category_id", { valueAsNumber: true })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={loadingCategories}
                    >
                      <option value={0}>
                        {loadingCategories
                          ? "در حال بارگذاری..."
                          : "انتخاب دسته‌بندی"}
                      </option>
                      {categories?.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.title}
                        </option>
                      ))}
                    </select>
                    {errors.job_category_id && (
                      <p className="text-sm text-red-500">
                        {errors.job_category_id.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="city" className="required mb-2">
                      شهر
                    </Label>
                    <select
                      id="city"
                      {...register("city_id", { valueAsNumber: true })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={loadingCities}
                    >
                      <option value={0}>
                        {loadingCities ? "در حال بارگذاری..." : "انتخاب شهر"}
                      </option>
                      {cities?.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.title}
                        </option>
                      ))}
                    </select>
                    {errors.city_id && (
                      <p className="text-sm text-red-500">
                        {errors.city_id.message}
                      </p>
                    )}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Persian Content */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">محتوای فارسی</h3>

                  <div className="grid gap-2">
                    <Label htmlFor="description_fa" className="mb-2">
                      توضیحات شغل
                    </Label>
                    <Textarea
                      id="description_fa"
                      {...register("persian_content.description")}
                      placeholder="توضیحات کلی شغل..."
                      rows={3}
                    />
                  </div>

                  {/* Persian Requirements */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="mb-2">الزامات</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addPersianRequirement}
                      >
                        افزودن الزام
                      </Button>
                    </div>
                    {persianRequirements.map((requirement, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={requirement}
                          onChange={(e) =>
                            updatePersianRequirement(index, e.target.value)
                          }
                          placeholder="الزام را وارد کنید..."
                        />
                        {persianRequirements.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removePersianRequirement(index)}
                          >
                            حذف
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Persian Responsibilities */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="mb-2">مسئولیت‌ها</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addPersianResponsibility}
                      >
                        افزودن مسئولیت
                      </Button>
                    </div>
                    {persianResponsibilities.map((responsibility, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={responsibility}
                          onChange={(e) =>
                            updatePersianResponsibility(index, e.target.value)
                          }
                          placeholder="مسئولیت را وارد کنید..."
                        />
                        {persianResponsibilities.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removePersianResponsibility(index)}
                          >
                            حذف
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* English Content */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">English Content</h3>

                  <div className="grid gap-2">
                    <Label htmlFor="description_en" className="mb-2">
                      Job Description
                    </Label>
                    <Textarea
                      dir="ltr"
                      id="description_en"
                      {...register("english_content.description")}
                      placeholder="Brief job description..."
                      rows={3}
                    />
                  </div>

                  {/* English Requirements */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="mb-2">Requirements</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addEnglishRequirement}
                      >
                        Add Requirement
                      </Button>
                    </div>
                    {englishRequirements.map((requirement, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          dir="ltr"
                          value={requirement}
                          onChange={(e) =>
                            updateEnglishRequirement(index, e.target.value)
                          }
                          placeholder="Enter requirement..."
                        />
                        {englishRequirements.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeEnglishRequirement(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* English Responsibilities */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="mb-2">Responsibilities</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addEnglishResponsibility}
                      >
                        Add Responsibility
                      </Button>
                    </div>
                    {englishResponsibilities.map((responsibility, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          dir="ltr"
                          value={responsibility}
                          onChange={(e) =>
                            updateEnglishResponsibility(index, e.target.value)
                          }
                          placeholder="Enter responsibility..."
                        />
                        {englishResponsibilities.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeEnglishResponsibility(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || isSaving}
              className="cursor-pointer px-8 py-2"
            >
              {isSubmitting || isSaving ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  در حال به‌روزرسانی...
                </>
              ) : (
                "به روز رسانی"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
