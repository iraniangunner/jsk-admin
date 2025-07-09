"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { getJobCategoryById, updateJobCategory } from "@/hooks/use-jobCategory";

export function EditJobCategory() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  // Form state
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [order, setOrder] = useState("");

  // Queries and mutations
  const { data: jobCategory, isLoading: isLoadingJobCategory } =
    getJobCategoryById(categoryId);
  const { mutate: updateJobCategoryMutation, isPending: isSaving } =
    updateJobCategory();

  // Load existing data
  useEffect(() => {
    if (jobCategory) {
      setTitle(jobCategory.title || "");
      setTitleEn(jobCategory.title_en || "");
      setOrder(jobCategory.order?.toString() || "");
    }
  }, [jobCategory]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      toast.error("لطفا عنوان فارسی را وارد کنید");
      return;
    }

    try {
      // Prepare data object
      const data = {
        title: title.trim(),
        title_en: titleEn.trim() || undefined,
        order: order ? Number(order) : undefined,
      };

      // Call the update mutation
      updateJobCategoryMutation(
        { id: categoryId, data },
        {
          onSuccess: () => {
            toast.success("دسته بندی با موفقیت به‌روزرسانی شد");
            // Navigate back to job cities list after successful update
            setTimeout(() => {
              router.push("/job-categories");
            }, 1500);
          },
          onError: (error) => {
            console.error("Update failed:", error);
            toast.error("خطا در به‌روزرسانی دسته بندی. لطفا دوباره تلاش کنید.");
          },
        }
      );
    } catch (err) {
      toast.error("خطا در به‌روزرسانی دسته بندی. لطفا دوباره تلاش کنید.");
      console.error(err);
    }
  };

  if (isLoadingJobCategory) {
    return (
      <div className="container py-10 max-w-3xl mx-auto" dir="rtl">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="mr-2">در حال بارگذاری...</span>
        </div>
      </div>
    );
  }

  if (!jobCategory) {
    return (
      <div className="container py-10 max-w-3xl mx-auto" dir="rtl">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-red-500">دسته بندی یافت نشد</p>
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
      <div className="container py-10 max-w-3xl mx-auto" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">ویرایش دسته بندی</h1>
          <Button
            variant="outline"
            className="cursor-pointer bg-transparent"
            onClick={() => router.push("/job-categories")}
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            بازگشت به لیست
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardDescription>
              اطلاعات دسته بندی را ویرایش کنید و دکمه به‌روزرسانی را بزنید.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="required mb-2">
                    عنوان فارسی
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="عنوان فارسی دسته بندی را وارد کنید"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="title_en" className="mb-2">
                    عنوان انگلیسی
                  </Label>
                  <Input
                    dir="ltr"
                    id="title_en"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Enter English title (optional)"
                  />
                </div>

                <Separator className="my-2" />

                <div className="grid gap-2">
                  <Label htmlFor="order" className="mb-2">
                    ترتیب نمایش
                  </Label>
                  <Input
                    id="order"
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    placeholder="ترتیب نمایش (اختیاری)"
                    min="1"
                  />
                  <p className="text-sm text-muted-foreground">
                    عدد کمتر، اولویت نمایش بالاتر
                  </p>
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
