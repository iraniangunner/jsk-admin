"use client";

import { CardFooter } from "@/components/ui/card";
import type React from "react";
import { useState } from "react";
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

// interface JobOpportunityCreateFormProps {
//   onSuccess?: (jobOpportunity: any) => void;
//   onCancel?: () => void;
// }

export default function JobOpportunityCreate() {
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [jobCategoryId, setJobCategoryId] = useState(0);
  const [cityId, setCityId] = useState(0);

  // Persian structured data
  const [persianDescription, setPersianDescription] = useState("");
  const [persianRequirements, setPersianRequirements] = useState<string[]>([
    "",
  ]);
  const [persianResponsibilities, setPersianResponsibilities] = useState<
    string[]
  >([""]);

  // English structured data
  const [englishDescription, setEnglishDescription] = useState("");
  const [englishRequirements, setEnglishRequirements] = useState<string[]>([
    "",
  ]);
  const [englishResponsibilities, setEnglishResponsibilities] = useState<
    string[]
  >([""]);

  // API hooks
  const { data: categories, isLoading: loadingCategories } = getJobCategories();
  const { data: cities, isLoading: loadingCities } = getJobCities();
  const { mutate: createJobMutation, isPending: isSaving } =
    createJobOpportunity();

  // Persian requirement handlers
  const addPersianRequirement = () => {
    setPersianRequirements([...persianRequirements, ""]);
  };

  const removePersianRequirement = (index: number) => {
    setPersianRequirements(persianRequirements.filter((_, i) => i !== index));
  };

  const updatePersianRequirement = (index: number, value: string) => {
    setPersianRequirements(
      persianRequirements.map((req, i) => (i === index ? value : req))
    );
  };

  // Persian responsibility handlers
  const addPersianResponsibility = () => {
    setPersianResponsibilities([...persianResponsibilities, ""]);
  };

  const removePersianResponsibility = (index: number) => {
    setPersianResponsibilities(
      persianResponsibilities.filter((_, i) => i !== index)
    );
  };

  const updatePersianResponsibility = (index: number, value: string) => {
    setPersianResponsibilities(
      persianResponsibilities.map((resp, i) => (i === index ? value : resp))
    );
  };

  // English requirement handlers
  const addEnglishRequirement = () => {
    setEnglishRequirements([...englishRequirements, ""]);
  };

  const removeEnglishRequirement = (index: number) => {
    setEnglishRequirements(englishRequirements.filter((_, i) => i !== index));
  };

  const updateEnglishRequirement = (index: number, value: string) => {
    setEnglishRequirements(
      englishRequirements.map((req, i) => (i === index ? value : req))
    );
  };

  // English responsibility handlers
  const addEnglishResponsibility = () => {
    setEnglishResponsibilities([...englishResponsibilities, ""]);
  };

  const removeEnglishResponsibility = (index: number) => {
    setEnglishResponsibilities(
      englishResponsibilities.filter((_, i) => i !== index)
    );
  };

  const updateEnglishResponsibility = (index: number, value: string) => {
    setEnglishResponsibilities(
      englishResponsibilities.map((resp, i) => (i === index ? value : resp))
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || jobCategoryId === 0 || cityId === 0) {
      toast.error("لطفا تمام فیلدهای اجباری را پر کنید");
      return;
    }

    try {
      // Structure the Persian data for text
      const structuredTextPersian = JSON.stringify({
        description: persianDescription,
        requirements: persianRequirements.filter((req) => req.trim() !== ""),
        responsibilities: persianResponsibilities.filter(
          (resp) => resp.trim() !== ""
        ),
      });

      // Structure the English data for text_en
      const structuredTextEnglish = JSON.stringify({
        description: englishDescription,
        requirements: englishRequirements.filter((req) => req.trim() !== ""),
        responsibilities: englishResponsibilities.filter(
          (resp) => resp.trim() !== ""
        ),
      });

      const data: CreateJobOpportunityRequest = {
        title: title.trim(),
        title_en: titleEn.trim() || undefined,
        job_category_id: jobCategoryId,
        city_id: cityId,
        text: structuredTextPersian,
        text_en: structuredTextEnglish,
      };

      createJobMutation(
        { data },
        {
          onSuccess: () => {
            toast.success("فرصت شغلی با موفقیت ایجاد شد");

            // Reset form
            setTitle("");
            setTitleEn("");
            setJobCategoryId(0);
            setCityId(0);
            setPersianDescription("");
            setPersianRequirements([""]);
            setPersianResponsibilities([""]);
            setEnglishDescription("");
            setEnglishRequirements([""]);
            setEnglishResponsibilities([""]);

           // onSuccess?.(result);

            // Navigate back after successful creation
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title" className="required mb-2">
                      عنوان شغل (فارسی)
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="عنوان شغل را وارد کنید"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="title_en" className="mb-2">
                      عنوان شغل (انگلیسی)
                    </Label>
                    <Input
                      dir="ltr"
                      id="title_en"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      placeholder="Job Title (optional)"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category" className="required mb-2">
                      دسته‌بندی شغلی
                    </Label>
                    <select
                      id="category"
                      value={jobCategoryId}
                      onChange={(e) =>
                        setJobCategoryId(Number.parseInt(e.target.value))
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={loadingCategories}
                      required
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
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="city" className="required mb-2">
                      شهر
                    </Label>
                    <select
                      id="city"
                      value={cityId}
                      onChange={(e) =>
                        setCityId(Number.parseInt(e.target.value))
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={loadingCities}
                      required
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
                      value={persianDescription}
                      onChange={(e) => setPersianDescription(e.target.value)}
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
                      value={englishDescription}
                      onChange={(e) => setEnglishDescription(e.target.value)}
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
              onClick={handleSubmit}
              disabled={isSaving}
              className="cursor-pointer px-8 py-2"
            >
              {isSaving ? (
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
