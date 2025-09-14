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
  title: z.string().min(1, "عنوان شغل الزامی است").max(63, "عنوان شغل نباید بیش از 63 کاراکتر باشد"),
  title_en: z.string().max(63, "English title should not exceed 63 characters").optional().or(z.literal("")),
  job_category_id: z.number().min(1, "انتخاب دسته‌بندی الزامی است"),
  city_id: z.number().min(1, "انتخاب شهر الزامی است"),
  persian_content: z.object({
    description: z.string().optional(),
    requirements: z.array(z.string()).min(1, "حداقل یک الزام باید وارد شود"),
    responsibilities: z.array(z.string()).min(1, "حداقل یک مسئولیت باید وارد شود"),
  }),
  english_content: z.object({
    description: z.string().optional(),
    requirements: z.array(z.string()).min(1, "حداقل یک Requirement باید وارد شود"),
    responsibilities: z.array(z.string()).min(1, "حداقل یک Responsibility باید وارد شود"),
  }),
});

type JobOpportunityFormData = z.infer<typeof jobOpportunitySchema>;

export default function JobOpportunityCreate() {
  const router = useRouter();

  const {
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
      persian_content: { description: "", requirements: [""], responsibilities: [""] },
      english_content: { description: "", requirements: [""], responsibilities: [""] },
    },
  });

  const watchedData = watch();

  const addItem = (field: keyof JobOpportunityFormData["persian_content"]) => {
    const current = watchedData.persian_content[field] as string[];
    setValue(`persian_content.${field}`, [...current, ""]);
  };

  const removeItem = (field: keyof JobOpportunityFormData["persian_content"], index: number) => {
    const current = watchedData.persian_content[field] as string[];
    if (current.length > 1) {
      setValue(`persian_content.${field}`, current.filter((_, i) => i !== index));
    }
  };

  const addItemEn = (field: keyof JobOpportunityFormData["english_content"]) => {
    const current = watchedData.english_content[field] as string[];
    setValue(`english_content.${field}`, [...current, ""]);
  };

  const removeItemEn = (field: keyof JobOpportunityFormData["english_content"], index: number) => {
    const current = watchedData.english_content[field] as string[];
    if (current.length > 1) {
      setValue(`english_content.${field}`, current.filter((_, i) => i !== index));
    }
  };

  const { data: categories, isLoading: loadingCategories } = getJobCategories();
  const { data: cities, isLoading: loadingCities } = getJobCities();
  const { mutate: createJobMutation, isPending: isSaving } = createJobOpportunity();

  const onSubmit = async (data: JobOpportunityFormData) => {
    try {
      const structuredTextPersian = JSON.stringify({
        description: data.persian_content.description || "",
        requirements: data.persian_content.requirements.filter((r) => r.trim() !== ""),
        responsibilities: data.persian_content.responsibilities.filter((r) => r.trim() !== ""),
      });

      const structuredTextEnglish = JSON.stringify({
        description: data.english_content.description || "",
        requirements: data.english_content.requirements.filter((r) => r.trim() !== ""),
        responsibilities: data.english_content.responsibilities.filter((r) => r.trim() !== ""),
      });

      const requestData: CreateJobOpportunityRequest = {
        title: data.title.trim(),
        title_en: data.title_en?.trim() || undefined,
        job_category_id: data.job_category_id,
        city_id: data.city_id,
        text: structuredTextPersian,
        text_en: structuredTextEnglish,
      };

      createJobMutation({ data: requestData }, {
        onSuccess: () => {
          toast.success("فرصت شغلی با موفقیت ایجاد شد");
          reset();
          setTimeout(() => router.push("/job-opportunities"), 1500);
        },
        onError: (err) => {
          console.error(err);
          toast.error("خطا در ایجاد فرصت شغلی. لطفا دوباره تلاش کنید.");
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("خطا در ایجاد فرصت شغلی. لطفا دوباره تلاش کنید.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container py-10 max-w-4xl mx-auto" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">ایجاد فرصت شغلی</h1>
          <Button variant="outline" onClick={() => router.push("/job-opportunities")}>
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
              {/* Titles */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="required mb-2">عنوان شغل (فارسی)</Label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="عنوان شغل را وارد کنید" />}
                  />
                  {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="title_en" className="mb-2">عنوان شغل (انگلیسی)</Label>
                  <Controller
                    name="title_en"
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="Job Title (optional)" />}
                  />
                  {errors.title_en && <p className="text-sm text-red-500">{errors.title_en.message}</p>}
                </div>
              </div>

              {/* Selects */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="required mb-2">دسته‌بندی شغلی</Label>
                  <Controller
                    name="job_category_id"
                    control={control}
                    render={({ field }) => (
                      <select {...field} onChange={e => field.onChange(Number(e.target.value))} disabled={loadingCategories} className="h-10 w-full rounded-md border px-3 py-2">
                        <option value={0}>{loadingCategories ? "در حال بارگذاری..." : "انتخاب دسته‌بندی"}</option>
                        {categories?.map(cat => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
                      </select>
                    )}
                  />
                  {errors.job_category_id && <p className="text-sm text-red-500">{errors.job_category_id.message}</p>}
                </div>

                <div className="grid gap-2">
                  <Label className="required mb-2">شهر</Label>
                  <Controller
                    name="city_id"
                    control={control}
                    render={({ field }) => (
                      <select {...field} onChange={e => field.onChange(Number(e.target.value))} disabled={loadingCities} className="h-10 w-full rounded-md border px-3 py-2">
                        <option value={0}>{loadingCities ? "در حال بارگذاری..." : "انتخاب شهر"}</option>
                        {cities?.map(city => <option key={city.id} value={city.id}>{city.title}</option>)}
                      </select>
                    )}
                  />
                  {errors.city_id && <p className="text-sm text-red-500">{errors.city_id.message}</p>}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Persian Content */}
              <h3 className="text-lg font-semibold">محتوای فارسی</h3>
              <Controller
                name="persian_content.description"
                control={control}
                render={({ field }) => <Textarea {...field} placeholder="توضیحات کلی شغل..." rows={3} />}
              />

              {/* Persian Requirements */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>الزامات</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => addItem("requirements")}>افزودن الزام</Button>
                </div>
                {watchedData.persian_content.requirements.map((_, index) => (
                  <Controller
                    key={index}
                    name={`persian_content.requirements.${index}`}
                    control={control}
                    render={({ field }) => (
                      <div className="flex gap-2">
                        <Input {...field} placeholder="الزام را وارد کنید..." />
                        {watchedData.persian_content.requirements.length > 1 && (
                          <Button type="button" variant="outline" size="sm" onClick={() => removeItem("requirements", index)}>حذف</Button>
                        )}
                      </div>
                    )}
                  />
                ))}
              </div>

              {/* Persian Responsibilities */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>مسئولیت‌ها</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => addItem("responsibilities")}>افزودن مسئولیت</Button>
                </div>
                {watchedData.persian_content.responsibilities.map((_, index) => (
                  <Controller
                    key={index}
                    name={`persian_content.responsibilities.${index}`}
                    control={control}
                    render={({ field }) => (
                      <div className="flex gap-2">
                        <Input {...field} placeholder="مسئولیت را وارد کنید..." />
                        {watchedData.persian_content.responsibilities.length > 1 && (
                          <Button type="button" variant="outline" size="sm" onClick={() => removeItem("responsibilities", index)}>حذف</Button>
                        )}
                      </div>
                    )}
                  />
                ))}
              </div>

              <Separator className="my-4" />

              {/* English Content */}
              <h3 className="text-lg font-semibold">English Content</h3>
              <Controller
                name="english_content.description"
                control={control}
                render={({ field }) => <Textarea {...field} dir="ltr" placeholder="Brief job description..." rows={3} />}
              />

              {/* English Requirements */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Requirements</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => addItemEn("requirements")}>Add Requirement</Button>
                </div>
                {watchedData.english_content.requirements.map((_, index) => (
                  <Controller
                    key={index}
                    name={`english_content.requirements.${index}`}
                    control={control}
                    render={({ field }) => (
                      <div className="flex gap-2">
                        <Input {...field} dir="ltr" placeholder="Enter requirement..." />
                        {watchedData.english_content.requirements.length > 1 && (
                          <Button type="button" variant="outline" size="sm" onClick={() => removeItemEn("requirements", index)}>Remove</Button>
                        )}
                      </div>
                    )}
                  />
                ))}
              </div>

              {/* English Responsibilities */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Responsibilities</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => addItemEn("responsibilities")}>Add Responsibility</Button>
                </div>
                {watchedData.english_content.responsibilities.map((_, index) => (
                  <Controller
                    key={index}
                    name={`english_content.responsibilities.${index}`}
                    control={control}
                    render={({ field }) => (
                      <div className="flex gap-2">
                        <Input {...field} dir="ltr" placeholder="Enter responsibility..." />
                        {watchedData.english_content.responsibilities.length > 1 && (
                          <Button type="button" variant="outline" size="sm" onClick={() => removeItemEn("responsibilities", index)}>Remove</Button>
                        )}
                      </div>
                    )}
                  />
                ))}
              </div>

              <CardFooter className="flex justify-center">
                <Button type="submit" disabled={isSubmitting || isSaving} className="px-8 py-2 cursor-pointer">
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

            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
