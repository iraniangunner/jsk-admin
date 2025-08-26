"use client";

import { CardFooter } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { createTenderCategory } from "@/hooks/use-tenderCategory";

const tenderCategorySchema = z.object({
  title: z
    .string()
    .min(1, "عنوان فارسی الزامی است")
    .max(64, "عنوان فارسی نباید بیش از 64 کاراکتر باشد"),
  title_en: z
    .string()
    .max(64, "عنوان انگلیسی نباید بیش از 64 کاراکتر باشد")
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

export function CreateTenderCategory() {
  const router = useRouter();

  const {
    register,
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

  // Create mutation
  const { mutate: createTenderCategoryMutation, isPending: isSaving } =
    createTenderCategory();

  const onSubmit = async (data: TenderCategoryFormData) => {
    try {
      // Prepare data object
      const submitData = {
        title: data.title.trim(),
        title_en: data.title_en?.trim() || undefined,
        order: data.order ? Number(data.order) : undefined,
      };

      // Call the create mutation
      createTenderCategoryMutation(
        { data: submitData },
        {
          onSuccess: () => {
            toast.success("دسته بندی با موفقیت ایجاد شد");
            reset();
            // Navigate back to project categories list after successful creation
            setTimeout(() => {
              router.push("/tender-categories");
            }, 1500);
          },
          onError: (error) => {
            console.error("Create failed:", error);
            toast.error("خطا در ایجاد دسته بندی . لطفا دوباره تلاش کنید.");
          },
        }
      );
    } catch (err) {
      toast.error("خطا در ایجاد دسته بندی . لطفا دوباره تلاش کنید.");
      console.error(err);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container py-10 max-w-3xl mx-auto" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">ایجاد دسته بندی</h1>
          <Button
            variant="outline"
            className="cursor-pointer bg-transparent"
            onClick={() => router.push("/project-categories")}
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            بازگشت به لیست
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardDescription>
              اطلاعات دسته بندی را وارد کنید و دکمه ایجاد را بزنید.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="required mb-2">
                    عنوان فارسی
                  </Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="عنوان فارسی دسته بندی را وارد کنید"
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="title_en" className="mb-2">
                    عنوان انگلیسی
                  </Label>
                  <Input
                    dir="ltr"
                    id="title_en"
                    {...register("title_en")}
                    placeholder="Enter English title (optional)"
                    className={errors.title_en ? "border-red-500" : ""}
                  />
                  {errors.title_en && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.title_en.message}
                    </p>
                  )}
                </div>

                <Separator className="my-2" />

                <div className="grid gap-2">
                  <Label htmlFor="order" className="mb-2">
                    ترتیب نمایش
                  </Label>
                  <Input
                    id="order"
                    type="number"
                    {...register("order")}
                    placeholder="ترتیب نمایش (اختیاری)"
                    min="1"
                    max="255"
                    className={errors.order ? "border-red-500" : ""}
                  />
                  {errors.order && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.order.message}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    عدد کمتر، اولویت نمایش بالاتر
                  </p>
                </div>
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
                  در حال ایجاد...
                </>
              ) : (
                "ایجاد دسته بندی"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
