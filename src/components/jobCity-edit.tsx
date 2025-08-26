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
import { getJobCityById, updateJobCity } from "@/hooks/use-jobCity";

const editJobCitySchema = z.object({
  title: z
    .string()
    .min(1, "عنوان فارسی الزامی است")
    .max(16, "عنوان فارسی نباید بیشتر از ۱۶ کاراکتر باشد"),
  title_en: z
    .string()
    .max(16, "عنوان انگلیسی نباید بیشتر از ۱۶ کاراکتر باشد")
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
        message: "ترتیب باید عددی بین ۱ تا ۲۵۵ باشد",
      }
    ),
});

type EditJobCityFormData = z.infer<typeof editJobCitySchema>;

export function EditJobCity() {
  const router = useRouter();
  const params = useParams();
  const cityId = params.id as string;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditJobCityFormData>({
    resolver: zodResolver(editJobCitySchema),
    defaultValues: {
      title: "",
      title_en: "",
      order: "",
    },
  });

  const { data: jobCity, isLoading: isLoadingJobCity } = getJobCityById(cityId);
  const { mutate: updateJobCityMutation, isPending: isSaving } =
    updateJobCity();

  useEffect(() => {
    if (jobCity) {
      reset({
        title: jobCity.title || "",
        title_en: jobCity.title_en || "",
        order: jobCity.order?.toString() || "",
      });
    }
  }, [jobCity, reset]);

  const onSubmit = async (data: EditJobCityFormData) => {
    try {
      const submitData = {
        title: data.title.trim(),
        title_en: data.title_en?.trim() || undefined,
        order: data.order ? Number(data.order) : undefined,
      };

      updateJobCityMutation(
        { id: cityId, data: submitData },
        {
          onSuccess: () => {
            toast.success("شهر با موفقیت به‌روزرسانی شد");
            setTimeout(() => {
              router.push("/job-cities");
            }, 1500);
          },
          onError: (error) => {
            console.error("Update failed:", error);
            toast.error("خطا در به‌روزرسانی شهر. لطفا دوباره تلاش کنید.");
          },
        }
      );
    } catch (err) {
      toast.error("خطا در به‌روزرسانی شهر. لطفا دوباره تلاش کنید.");
      console.error(err);
    }
  };

  if (isLoadingJobCity) {
    return (
      <div className="container py-10 max-w-3xl mx-auto" dir="rtl">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="mr-2">در حال بارگذاری...</span>
        </div>
      </div>
    );
  }

  if (!jobCity) {
    return (
      <div className="container py-10 max-w-3xl mx-auto" dir="rtl">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-red-500">شهر یافت نشد</p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => router.push("/job-cities")}
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
          <h1 className="text-2xl font-bold">ویرایش شهر</h1>
          <Button
            variant="outline"
            className="cursor-pointer bg-transparent"
            onClick={() => router.push("/job-cities")}
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            بازگشت به لیست
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardDescription>
              اطلاعات شهر را ویرایش کنید و دکمه به‌روزرسانی را بزنید.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4">
                {/* عنوان فارسی */}
                <div className="grid gap-2">
                  <Label htmlFor="title" className="required mb-2">
                    عنوان فارسی
                  </Label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="title"
                        placeholder="عنوان فارسی شهر را وارد کنید"
                        className={errors.title ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* عنوان انگلیسی */}
                <div className="grid gap-2">
                  <Label htmlFor="title_en" className="mb-2">
                    عنوان انگلیسی
                  </Label>
                  <Controller
                    name="title_en"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="title_en"
                        dir="ltr"
                        placeholder="Enter English title (optional)"
                        className={errors.title_en ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.title_en && (
                    <p className="text-sm text-red-500">
                      {errors.title_en.message}
                    </p>
                  )}
                </div>

                <Separator className="my-2" />

                {/* ترتیب نمایش */}
                <div className="grid gap-2">
                  <Label htmlFor="order" className="mb-2">
                    ترتیب نمایش
                  </Label>
                  <Controller
                    name="order"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="order"
                        type="number"
                        placeholder="ترتیب نمایش (اختیاری)"
                        min={1}
                        max={255}
                        className={errors.order ? "border-red-500" : ""}
                      />
                    )}
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
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
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
