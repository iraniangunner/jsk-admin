"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
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
import {
  getTenderCategoryById,
  updateTenderCategory,
} from "@/hooks/use-tenderCategory";

const tenderCategorySchema = z.object({
  title: z
    .string()
    .min(1, "عنوان فارسی الزامی است")
    .max(64, "عنوان فارسی نباید بیشتر از 64 کاراکتر باشد"),
  title_en: z
    .string()
    .max(64, "عنوان انگلیسی نباید بیشتر از 64 کاراکتر باشد")
    .optional()
    .or(z.literal("")),
  order: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        const num = Number(val);
        return !isNaN(num) && num > 0 && num <= 255;
      },
      {
        message: "ترتیب نمایش باید بین 1 تا 255 باشد",
      }
    ),
});

type TenderCategoryFormData = z.infer<typeof tenderCategorySchema>;

export function EditTenderCategory() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TenderCategoryFormData>({
    resolver: zodResolver(tenderCategorySchema),
    defaultValues: {
      title: "",
      title_en: "",
      order: "",
    },
  });

  const { data: tenderCategory, isLoading: isLoadingCategory } =
    getTenderCategoryById(categoryId);
  const { mutate: updateTenderCategoryMutation, isPending: isSaving } =
    updateTenderCategory();

  useEffect(() => {
    if (tenderCategory) {
      reset({
        title: tenderCategory.title || "",
        title_en: tenderCategory.title_en || "",
        order: tenderCategory.order?.toString() || "",
      });
    }
  }, [tenderCategory, reset]);

  const onSubmit = async (data: TenderCategoryFormData) => {
    try {
      const submitData = {
        title: data.title.trim(),
        title_en: data.title_en?.trim() || undefined,
        order: data.order ? Number(data.order) : undefined,
      };

      updateTenderCategoryMutation(
        { id: categoryId, data: submitData },
        {
          onSuccess: () => {
            toast.success("دسته بندی با موفقیت به‌روزرسانی شد");
            setTimeout(() => router.push("/tender-categories"), 1500);
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

  if (isLoadingCategory) {
    return (
      <div className="container py-10 max-w-3xl mx-auto" dir="rtl">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="mr-2">در حال بارگذاری...</span>
        </div>
      </div>
    );
  }

  if (!tenderCategory) {
    return (
      <div className="container py-10 max-w-3xl mx-auto" dir="rtl">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-red-500">دسته بندی یافت نشد</p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => router.push("/tender-categories")}
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
            onClick={() => router.push("/tender-categories")}
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4">
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <div className="grid gap-2">
                      <Label htmlFor="title" className="required mb-2">
                        عنوان فارسی
                      </Label>
                      <Input
                        id="title"
                        placeholder="عنوان فارسی دسته بندی را وارد کنید"
                        {...field}
                        className={errors.title ? "border-red-500" : ""}
                      />
                      {errors.title && (
                        <p className="text-sm text-red-500">
                          {errors.title.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="title_en"
                  control={control}
                  render={({ field }) => (
                    <div className="grid gap-2">
                      <Label htmlFor="title_en" className="mb-2">
                        عنوان انگلیسی
                      </Label>
                      <Input
                        id="title_en"
                        dir="ltr"
                        placeholder="Enter English title (optional)"
                        {...field}
                        className={errors.title_en ? "border-red-500" : ""}
                      />
                      {errors.title_en && (
                        <p className="text-sm text-red-500">
                          {errors.title_en.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Separator className="my-2" />

                <Controller
                  name="order"
                  control={control}
                  render={({ field }) => (
                    <div className="grid gap-2">
                      <Label htmlFor="order" className="mb-2">
                        ترتیب نمایش
                      </Label>
                      <Input
                        id="order"
                        type="number"
                        placeholder="ترتیب نمایش (اختیاری)"
                        min={1}
                        max={255}
                        {...field}
                        className={errors.order ? "border-red-500" : ""}
                      />
                      {errors.order && (
                        <p className="text-sm text-red-500">
                          {errors.order.message}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        عدد کمتر، اولویت نمایش بالاتر
                      </p>
                    </div>
                  )}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
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
