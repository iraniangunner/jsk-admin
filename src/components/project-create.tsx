"use client";

import { useState, useEffect, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Upload, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createProject } from "@/hooks/use-project";
import { getCategories } from "@/hooks/use-category";

const projectSchema = z.object({
  title: z.string().min(1, "عنوان پروژه الزامی است"),
  title_en: z.string().optional(),
  employer: z.string().min(1, "نام کارفرما الزامی است"),
  employer_en: z.string().optional(),
  category_id: z.array(z.number()).min(1, "حداقل یک دسته‌بندی را انتخاب کنید"),
  start_date: z.string().min(1, "تاریخ شروع الزامی است"),
  location: z.string().min(1, "مکان پروژه الزامی است"),
  location_en: z.string().optional(),
  text: z.string().min(1, "توضیحات الزامی است"),
  text_en: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export function ProjectCreate() {
  const router = useRouter();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      title_en: "",
      employer: "",
      employer_en: "",
      category_id: [],
      start_date: "",
      location: "",
      location_en: "",
      text: "",
      text_en: "",
    },
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  // Update mutation
  const { mutate: createProjectMutation, isPending: isSaving } =
    createProject();
  // Get categories
  const { data, isLoading, isError } = getCategories();

  const handleCategoryChange = (id: number, checked: boolean) => {
    const currentCategories = form.getValues("category_id");
    if (checked) {
      form.setValue("category_id", [...currentCategories, id]);
    } else {
      form.setValue(
        "category_id",
        currentCategories.filter((categoryId) => categoryId !== id)
      );
    }
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error("حجم ویدیو نباید بیشتر از 100 مگابایت باشد");
        return;
      }
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);

      // Create new image items with previews and unique IDs
      const newImageItems = newFiles.map((file) => ({
        id: generateId(),
        file,
        preview: URL.createObjectURL(file),
      }));

      setImageItems((prev) => [...prev, ...newImageItems]);
    }
  };

  const removeImage = (id: string) => {
    setImageItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === id);
      if (itemToRemove) {
        // Revoke the object URL to avoid memory leaks
        URL.revokeObjectURL(itemToRemove.preview);
      }

      // Return a new array without the removed item
      return prevItems.filter((item) => item.id !== id);
    });
  };

  const removeVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoFile(null);
    setVideoPreview(null);
  };

  const onChangePreviewImage = (file?: File) => {
    if (previewFile && (previewFile as any).__tmpUrl) {
      URL.revokeObjectURL((previewFile as any).__tmpUrl);
    }
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("حجم تصویر کاور نباید بیشتر از 2 مگابایت باشد");
        return;
      }
      // برای نمایش سریع می‌توانیم یک URL موقت تولید کنیم:
      const tmpUrl = URL.createObjectURL(file);
      (file as any).__tmpUrl = tmpUrl;
      setPreviewFile(file);
    } else {
      setPreviewFile(null);
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      // Create FormData for file uploads
      const formData = new FormData();

      // Add form values
      Object.entries(data).forEach(([key, value]) => {
        if (key === "category_id") {
          // Handle array of category IDs
          (value as number[]).forEach((id, index) => {
            formData.append(`category_id[${index}]`, id.toString());
          });
        } else if (value) {
          formData.append(key, value as string);
        }
      });

      // Add video if exists
      if (videoFile) {
        formData.append("video", videoFile);
      }

      // Add preview image if exists
      if (previewFile) {
        formData.append("preview_image", previewFile);
      }

      // Add images
      imageItems.forEach((item, index) => {
        formData.append(`images[${index}]`, item.file);
      });

      // Send to API
      createProjectMutation(
        { formData },
        {
          onSuccess: () => {
            toast.success("پروژه با موفقیت اضافه شد");
            // Navigate back to projects list after successful creation
            setTimeout(() => {
              router.push("/projects");
            }, 1500);
          },
          onError: (error) => {
            console.error("Creation failed:", error);
            toast.error("خطا در ایجاد پروژه. لطفا دوباره تلاش کنید.");
          },
        }
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error instanceof Error ? error.message : "خطا در ارسال اطلاعات"
      );
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      imageItems.forEach((item) => URL.revokeObjectURL(item.preview));
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [imageItems, videoPreview]);

  return (
    <>
      <ToastContainer />
      <div className="container py-10 max-w-4xl mx-auto" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">ایجاد پروژه جدید</h1>
          <Button
            variant="outline"
            className="cursor-pointer bg-transparent"
            onClick={() => router.push("/projects")}
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            بازگشت به لیست
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ایجاد پروژه جدید</CardTitle>
            <CardDescription>اطلاعات پروژه جدید را وارد کنید</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>عنوان پروژه *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="عنوان پروژه را وارد کنید"
                            {...field}
                          />
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
                        <FormLabel>عنوان انگلیسی</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter project title"
                            dir="ltr"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>کارفرما *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="نام کارفرما را وارد کنید"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employer_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>کارفرما (انگلیسی)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter employer name"
                            dir="ltr"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>تاریخ شروع *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="تاریخ شروع را وارد کنید (مثال: 1402-06-15)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>دسته‌بندی‌ها *</FormLabel>
                        <FormDescription>
                          حداقل یک دسته‌بندی را انتخاب کنید
                        </FormDescription>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-2 pt-2">
                            {isLoading ? (
                              <p>loading....</p>
                            ) : (
                              <>
                                {data?.map((category: any) => (
                                  <div
                                    key={category.id}
                                    className="flex items-center space-x-2 space-x-reverse"
                                  >
                                    <Checkbox
                                      id={`category-${category.id}`}
                                      checked={field.value.includes(
                                        category.id
                                      )}
                                      onCheckedChange={(checked) =>
                                        handleCategoryChange(
                                          category.id,
                                          checked === true
                                        )
                                      }
                                    />
                                    <Label
                                      htmlFor={`category-${category.id}`}
                                      className="text-sm font-normal cursor-pointer mr-2"
                                    >
                                      {category.title}
                                    </Label>
                                  </div>
                                ))}
                              </>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>مکان پروژه *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="مکان پروژه را وارد کنید"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>مکان پروژه (انگلیسی)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter project location"
                            dir="ltr"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>توضیحات *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="توضیحات پروژه را وارد کنید"
                            className="min-h-[120px]"
                            {...field}
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
                        <FormLabel>توضیحات (انگلیسی)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter project description"
                            className="min-h-[120px]"
                            dir="ltr"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>تصویر کاور (Preview)</Label>
                  <div className="flex flex-wrap items-start gap-4">
                    {/* جدید */}
                    {!previewFile && (
                      <label className="flex flex-col items-center justify-center w-60 h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/70">
                        <div className="flex flex-col items-center">
                          <Upload className="w-6 h-6 mb-2 opacity-70" />
                          <span className="text-sm">برای آپلود کلیک کنید</span>
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            onChangePreviewImage(
                              e.target.files?.[0] || undefined
                            )
                          }
                        />
                      </label>
                    )}

                    {/* پیش‌نمایش فایل جدید */}
                    {previewFile && (
                      <div className="relative">
                        <img
                          src={
                            (previewFile as any).__tmpUrl || "/placeholder.svg"
                          }
                          alt="new-preview"
                          className="w-40 h-40 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => onChangePreviewImage(undefined)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          حذف انتخاب
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="video-upload">ویدیو پروژه (MP4)</Label>
                    <div className="mt-2">
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="video-upload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold">
                                برای آپلود ویدیو کلیک کنید
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              MP4 (حداکثر 100MB)
                            </p>
                          </div>
                          <Input
                            id="video-upload"
                            type="file"
                            accept="video/mp4"
                            className="hidden"
                            onChange={handleVideoChange}
                          />
                        </label>
                      </div>
                    </div>

                    {videoPreview && (
                      <div className="mt-4 relative">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 z-10"
                          onClick={removeVideo}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">حذف ویدیو</span>
                        </Button>
                        <video
                          src={videoPreview}
                          controls
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="images-upload">تصاویر پروژه</Label>
                    <p className="text-sm text-muted-foreground">
                      حداقل یک تصویر آپلود کنید
                    </p>
                    <div className="mt-2">
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="images-upload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold">
                                برای آپلود تصاویر کلیک کنید
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG, JPEG
                            </p>
                          </div>
                          <Input
                            id="images-upload"
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            multiple
                            className="hidden"
                            onChange={handleImagesChange}
                          />
                        </label>
                      </div>
                    </div>

                    {imageItems.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {imageItems.map((item) => (
                          <div key={item.id} className="relative">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6 z-10"
                              onClick={() => removeImage(item.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <img
                              src={item.preview || "/placeholder.svg"}
                              alt={`Preview ${item.file.name}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="cursor-pointer px-8 py-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        در حال ارسال...
                      </>
                    ) : (
                      "ایجاد پروژه"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
