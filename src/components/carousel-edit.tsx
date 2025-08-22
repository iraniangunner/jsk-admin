"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowLeft, ImageIcon } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getSlideById, updateSlide } from "@/hooks/use-carousel";

const formSchema = z.object({
  text: z.string().min(1, "متن فارسی الزامی است"),
  text_en: z.string().optional(),
  link: z.string().min(1, "لینک الزامی است"),
  image: z
    .any()
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true; // Optional for updates
      const file = files[0];
      return file.size <= 5120 * 1024; // 5MB max
    }, "حداکثر حجم فایل 5 مگابایت است")
    .refine((files) => {
      if (!files || files.length === 0) return true;
      const file = files[0];
      return ["image/jpeg", "image/jpg", "image/png", "image/bmp"].includes(
        file.type
      );
    }, "فرمت فایل باید jpg، jpeg، png یا bmp باشد"),
});

type FormData = z.infer<typeof formSchema>;

export default function EditCarousel() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || "1";

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      text_en: "",
      link: "",
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch slide data
  const { data, isLoading, isError } = getSlideById(id);

  // Update mutation
  const { mutate: updateSlideMutation, isPending: isSaving } = updateSlide();

  useEffect(() => {
    if (data) {
      form.reset({
        text: data.text || "",
        text_en: data.text_en || "",
        link: data.link || "",
      });
      setImagePreview(data.full_path || "");
    }
  }, [data, form]);

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    form.setValue("image", e.target.files);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values: FormData) => {
    try {
      // Create FormData to send both text data and image file
      const formData = new FormData();

      // Add text fields to FormData
      formData.append("text", values.text);
      formData.append("text_en", values.text_en || "");
      formData.append("link", values.link);
      formData.append("_method", "PUT");

      // Add image file if a new one was selected
      if (values.image && values.image.length > 0) {
        formData.append("image", values.image[0]);
      }

      // Call the update mutation with FormData
      updateSlideMutation(
        { id, formData },
        {
          onSuccess: () => {
            toast.success("اسلاید با موفقیت بروزرسانی شد");
            setTimeout(() => {
              // toast.info("در حالت نمایشی، بازگشت به لیست غیرفعال است");
              router.push("/slides");
            }, 1500);
          },
          onError: (error) => {
            console.error("Update failed:", error);
            toast.error("خطا در بروزرسانی اسلاید. لطفا دوباره تلاش کنید.");
          },
        }
      );
    } catch (err) {
      toast.error("خطا در بروزرسانی اسلاید. لطفا دوباره تلاش کنید.");
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" dir="rtl">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh]"
        dir="rtl"
      >
        <div className="text-destructive mb-4 text-xl">
          خطا در بارگذاری اطلاعات
        </div>
        <p className="mb-6">{error || "اسلاید مورد نظر یافت نشد."}</p>
        <Button
          onClick={() =>
            toast.info("در حالت نمایشی، بازگشت به لیست غیرفعال است")
          }
        >
          <ArrowLeft className="ml-2 h-4 w-4" />
          بازگشت به لیست اسلایدها
        </Button>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="container py-10 max-w-3xl mx-auto" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">ویرایش اسلاید</h1>
          <Button
            variant="outline"
            className="cursor-pointer bg-transparent"
            onClick={() =>
              // toast.info("در حالت نمایشی، بازگشت به لیست غیرفعال است")
              router.push("/slides")
            }
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            بازگشت به لیست
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="mb-2">ویرایش اسلاید شماره {id}</CardTitle>
            <CardDescription>
              اطلاعات اسلاید را ویرایش کنید و دکمه ذخیره را بزنید.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required mb-2">
                          متن فارسی
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="متن فارسی اسلاید را وارد کنید"
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="text_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-2">متن انگلیسی</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            dir="ltr"
                            placeholder="Enter english text"
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator className="my-2" />

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-2">تصویر</FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-4">
                            {imagePreview && (
                              <div className="relative h-[200px] w-full overflow-hidden rounded border">
                                <img
                                  src={imagePreview || "/placeholder.svg"}
                                  alt="پیش نمایش تصویر"
                                  className="object-contain w-full h-full"
                                />
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <Input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/bmp"
                                onChange={handleImageChange}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  const fileInput = document.querySelector(
                                    'input[type="file"]'
                                  ) as HTMLInputElement | null;
                                  fileInput?.click();
                                }}
                              >
                                <ImageIcon className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              تصویر فعلی به صورت خودکار بارگذاری شده است. برای
                              تغییر تصویر، فایل جدید را انتخاب کنید. (حداکثر 5
                              مگابایت)
                            </p>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required mb-2">پیوست</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            dir="ltr"
                            placeholder="Enter the link"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              className="cursor-pointer bg-transparent"
              onClick={() =>
                toast.info("در حالت نمایشی، بازگشت به لیست غیرفعال است")
              }
              disabled={isSaving}
            >
              انصراف
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSaving}
              className="cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  در حال ذخیره...
                </>
              ) : (
                "ذخیره تغییرات"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
