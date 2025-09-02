"use client";
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
import { createNews } from "@/hooks/use-news";

const formSchema = z.object({
  title: z.string().min(1, "عنوان فارسی الزامی است"),
  title_en: z.string().min(1, "عنوان انگلیسی الزامی است"),
  content: z.string().min(1, "متن فارسی الزامی است"),
  content_en: z.string().min(1, "متن انگلیسی الزامی است"),
  image: z
    .any()
    .refine((files) => {
      // در store تصویر الزامی است
      return files && files.length > 0;
    }, "تصویر الزامی است")
    .refine((files) => {
      if (!files || files.length === 0) return true;
      const file = files[0];
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/bmp",
      ];
      return allowedTypes.includes(file.type);
    }, "فرمت فایل باید jpg، jpeg، png یا bmp باشد")
    .refine((files) => {
      if (!files || files.length === 0) return true;
      const file = files[0];
      return file.size <= 5 * 1024 * 1024;
    }, "حداکثر حجم فایل 5 مگابایت است"),
});
type FormData = z.infer<typeof formSchema>;

export default function NewsCreate() {
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      title_en: "",
      content: "",
      content_en: "",
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ایجاد خبر جدید
  const { mutate: createNewsMutation, isPending: isSaving } = createNews();

  // انتخاب عکس
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    form.setValue("image", e.target.files);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values: FormData) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("title_en", values.title_en || "");
      formData.append("content", values.content);
      formData.append("content_en", values.content_en || "");

      if (values.image && values.image.length > 0) {
        formData.append("image", values.image[0]);
      }

      createNewsMutation(
        { formData },
        {
          onSuccess: () => {
            toast.success("خبر با موفقیت ایجاد شد");
            setTimeout(() => {
              router.push("/news");
            }, 1500);
          },
          onError: () => {
            toast.error("خطا در ایجاد خبر. لطفا دوباره تلاش کنید.");
          },
        }
      );
    } catch (err) {
      toast.error("خطا در ایجاد خبر.");
      console.error(err);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container py-10 max-w-3xl mx-auto" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">ایجاد خبر جدید</h1>
          <Button
            variant="outline"
            className="cursor-pointer bg-transparent"
            onClick={() => router.push("/news")}
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            بازگشت به لیست
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="mb-2">ایجاد خبر</CardTitle>
            <CardDescription>
              اطلاعات خبر را وارد کنید و دکمه ذخیره را بزنید.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="required mb-2">
                            عنوان فارسی
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="عنوان فارسی خبر" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="title_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="mb-2">عنوان انگلیسی</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              dir="ltr"
                              placeholder="Enter english title"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required mb-2">
                          متن فارسی
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="متن فارسی خبر را وارد کنید"
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-2">متن انگلیسی</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            dir="ltr"
                            placeholder="Enter english content"
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
                    render={() => (
                      <FormItem>
                        <FormLabel className="mb-2">تصویر</FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-4">
                            {imagePreview && (
                              <div className="relative h-[200px] w-full overflow-hidden rounded border">
                                <img
                                  src={imagePreview}
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
                          </div>
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
              disabled={isSaving}
              onClick={() => router.push("/news")}
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
                "ایجاد خبر"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
