"use client";
import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { createSlide } from "@/hooks/use-carousel";

const carouselSchema = z.object({
  text: z.string().min(1, "متن فارسی الزامی است"),
  text_en: z.string().optional(),
  link: z.string().min(1, "لینک الزامی است"),
  image: z
    .any()
    .refine((files) => files?.length > 0, "تصویر الزامی است")
    .refine(
      (files) => files?.[0]?.size <= 5120 * 1024,
      "حجم تصویر نباید بیشتر از 5 مگابایت باشد"
    )
    .refine(
      (files) =>
        ["image/jpeg", "image/jpg", "image/png", "image/bmp"].includes(
          files?.[0]?.type
        ),
      "فرمت تصویر باید jpg، jpeg، png یا bmp باشد"
    ),
});

type CarouselFormData = z.infer<typeof carouselSchema>;

export default function CreateCarousel() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<CarouselFormData>({
    resolver: zodResolver(carouselSchema),
    defaultValues: {
      text: "",
      text_en: "",
      link: "",
    },
  });

  const { mutate: createSlideMutation, isPending: isSaving } = createSlide();

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: any) => void
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    onChange(files);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: CarouselFormData) => {
    try {
      const formData = new FormData();

      formData.append("text", data.text);
      formData.append("text_en", data.text_en || "");
      formData.append("link", data.link);

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      createSlideMutation(
        { formData },
        {
          onSuccess: () => {
            toast.success("اسلاید با موفقیت ایجاد شد");
            setTimeout(() => {
              router.push("/slides");
            }, 1500);
          },
          onError: (error) => {
            console.error("Update failed:", error);
            toast.error("خطا در ایجاد اسلاید. لطفا دوباره تلاش کنید.");
          },
        }
      );
    } catch (err) {
      toast.error("خطا در ایجاد اسلاید. لطفا دوباره تلاش کنید.");
      console.error(err);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container py-10 max-w-3xl mx-auto" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">ایجاد اسلاید</h1>
          <Button
            variant="outline"
            className="cursor-pointer bg-transparent"
            onClick={() => router.push("/slides")}
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            بازگشت به لیست
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardDescription>
              اطلاعات اسلاید را وارد کنید و دکمه ایجاد اسلاید را بزنید.
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
                    render={({ field: { onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel className="mb-2">تصویر</FormLabel>
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
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/bmp"
                              onChange={(e) => handleImageChange(e, onChange)}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                            در این قسمت تصویر را آپلود کنید (حداکثر 5 مگابایت -
                            فرمت: jpg, jpeg, png, bmp)
                          </p>
                        </div>
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
          <CardFooter className="flex justify-center">
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSaving}
              className="cursor-pointer px-8 py-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  در حال ایجاد...
                </>
              ) : (
                "ایجاد اسلاید"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
