"use client";

import { CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getJobCategories } from "@/hooks/use-jobCategory";
import { getJobCities } from "@/hooks/use-jobCity";
import { createJobOpportunity } from "@/hooks/use-jobOpportunity";
import type { CreateJobOpportunityRequest } from "@/types/job-opportunity-types";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const jobOpportunitySchema = z.object({
  title: z
    .string()
    .min(1, "عنوان شغل الزامی است")
    .max(63, "عنوان شغل نباید بیش از 63 کاراکتر باشد"),
  title_en: z
    .string()
    .max(63, "English title should not exceed 63 characters")
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

export default function JobOpportunityCreate() {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
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

  const watchedData = watch();

  const addPersianRequirement = () => {
    const current = watchedData.persian_content.requirements;
    setValue("persian_content.requirements", [...current, ""]);
  };

  const removePersianRequirement = (index: number) => {
    const current = watchedData.persian_content.requirements;
    if (current.length > 1) {
      setValue(
        "persian_content.requirements",
        current.filter((_, i) => i !== index)
      );
    }
  };

  const addPersianResponsibility = () => {
    const current = watchedData.persian_content.responsibilities;
    setValue("persian_content.responsibilities", [...current, ""]);
  };

  const removePersianResponsibility = (index: number) => {
    const current = watchedData.persian_content.responsibilities;
    if (current.length > 1) {
      setValue(
        "persian_content.responsibilities",
        current.filter((_, i) => i !== index)
      );
    }
  };

  const addEnglishRequirement = () => {
    const current = watchedData.english_content.requirements;
    setValue("english_content.requirements", [...current, ""]);
  };

  const removeEnglishRequirement = (index: number) => {
    const current = watchedData.english_content.requirements;
    if (current.length > 1) {
      setValue(
        "english_content.requirements",
        current.filter((_, i) => i !== index)
      );
    }
  };

  const addEnglishResponsibility = () => {
    const current = watchedData.english_content.responsibilities;
    setValue("english_content.responsibilities", [...current, ""]);
  };

  const removeEnglishResponsibility = (index: number) => {
    const current = watchedData.english_content.responsibilities;
    if (current.length > 1) {
      setValue(
        "english_content.responsibilities",
        current.filter((_, i) => i !== index)
      );
    }
  };

  // API hooks
  const { data: categories, isLoading: loadingCategories } = getJobCategories();
  const { data: cities, isLoading: loadingCities } = getJobCities();
  const { mutate: createJobMutation, isPending: isSaving } =
    createJobOpportunity();

  const onSubmit = async (data: JobOpportunityFormData) => {
    try {
      // Structure the Persian data for text
      const structuredTextPersian = JSON.stringify({
        description: data.persian_content.description || "",
        requirements:
          data.persian_content.requirements?.filter(
            (req) => req.trim() !== ""
          ) || [],
        responsibilities:
          data.persian_content.responsibilities?.filter(
            (resp) => resp.trim() !== ""
          ) || [],
      });

      // Structure the English data for text_en
      const structuredTextEnglish = JSON.stringify({
        description: data.english_content.description || "",
        requirements:
          data.english_content.requirements?.filter(
            (req) => req.trim() !== ""
          ) || [],
        responsibilities:
          data.english_content.responsibilities?.filter(
            (resp) => resp.trim() !== ""
          ) || [],
      });

      const requestData: CreateJobOpportunityRequest = {
        title: data.title.trim(),
        title_en: data.title_en?.trim() || undefined,
        job_category_id: data.job_category_id,
        city_id: data.city_id,
        text: structuredTextPersian,
        text_en: structuredTextEnglish,
      };

      createJobMutation(
        { data: requestData },
        {
          onSuccess: () => {
            toast.success("فرصت شغلی با موفقیت ایجاد شد");
            reset(); // Use react-hook-form reset
            setTimeout(() => {
              router.push("/job-opportunities");
            }, 1500);
          },
          onError: (error) => {
            console.error("Create failed:", error);
            toast.error("خطا در ایجاد فرصت شغلی. لطفا دوباره تلاش کنید.");
          },
        }
      );
    } catch (err) {
      toast.error("خطا در ایجاد فرصت شغلی. لطفا دوباره تلاش کنید.");
      console.error(err);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container py-10 max-w-4xl mx-auto" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">ایجاد فرصت شغلی</h1>
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
              اطلاعات فرصت شغلی را وارد کنید و دکمه ایجاد را بزنید.
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
                    <Controller
                      name="job_category_id"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number.parseInt(e.target.value))
                          }
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
                      )}
                    />
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
                    <Controller
                      name="city_id"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number.parseInt(e.target.value))
                          }
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={loadingCities}
                        >
                          <option value={0}>
                            {loadingCities
                              ? "در حال بارگذاری..."
                              : "انتخاب شهر"}
                          </option>
                          {cities?.map((city) => (
                            <option key={city.id} value={city.id}>
                              {city.title}
                            </option>
                          ))}
                        </select>
                      )}
                    />
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
                    {watchedData.persian_content.requirements.map(
                      (_, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            {...register(
                              `persian_content.requirements.${index}`
                            )}
                            placeholder="الزام را وارد کنید..."
                          />
                          {watchedData.persian_content.requirements.length >
                            1 && (
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
                      )
                    )}
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
                    {watchedData.persian_content.responsibilities.map(
                      (_, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            {...register(
                              `persian_content.responsibilities.${index}`
                            )}
                            placeholder="مسئولیت را وارد کنید..."
                          />
                          {watchedData.persian_content.responsibilities.length >
                            1 && (
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
                      )
                    )}
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
                    {watchedData.english_content.requirements.map(
                      (_, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            dir="ltr"
                            {...register(
                              `english_content.requirements.${index}`
                            )}
                            placeholder="Enter requirement..."
                          />
                          {watchedData.english_content.requirements.length >
                            1 && (
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
                      )
                    )}
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
                    {watchedData.english_content.responsibilities.map(
                      (_, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            dir="ltr"
                            {...register(
                              `english_content.responsibilities.${index}`
                            )}
                            placeholder="Enter responsibility..."
                          />
                          {watchedData.english_content.responsibilities.length >
                            1 && (
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
                      )
                    )}
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
                  در حال ایجاد...
                </>
              ) : (
                "ایجاد فرصت شغلی"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
