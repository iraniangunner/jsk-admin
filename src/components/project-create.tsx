"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "./ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mock categories data - replace with your API call
const categories = [
  { id: 1, name: "مسکونی" },
  { id: 2, name: "تجاری" },
  { id: 3, name: "اداری" },
  { id: 4, name: "صنعتی" },
  { id: 5, name: "آموزشی" },
];

interface ProjectFormData {
  title: string;
  title_en: string;
  employer: string;
  employer_en: string;
  start_date: string;
  location: string;
  location_en: string;
  text: string;
  text_en: string;
}

interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export function ProjectCreate() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    title_en: "",
    employer: "",
    employer_en: "",
    start_date: "",
    location: "",
    location_en: "",
    text: "",
    text_en: "",
  });
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCategoryChange = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, id]);
    } else {
      setSelectedCategories((prev) =>
        prev.filter((categoryId) => categoryId !== id)
      );
    }

    if (errors.categories) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.categories;
        return newErrors;
      });
    }
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "video/mp4") {
        toast.error("فقط فایل‌های MP4 پذیرفته می‌شوند");
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

      // Validate file types
      const validFiles = newFiles.filter(
        (file) =>
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "image/jpg"
      );

      if (validFiles.length !== newFiles.length) {
        toast.error("فقط فایل‌های تصویری (JPEG, PNG) پذیرفته می‌شوند");
      }

      // Create new image items with previews and unique IDs
      const newImageItems = validFiles.map((file) => ({
        id: generateId(),
        file,
        preview: URL.createObjectURL(file),
      }));

      setImageItems((prev) => [...prev, ...newImageItems]);

      if (errors.images) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.images;
          return newErrors;
        });
      }
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.title.length < 2) {
      newErrors.title = "عنوان باید حداقل 2 کاراکتر باشد";
    }

    if (formData.title_en.length < 2) {
      newErrors.title_en = "عنوان انگلیسی باید حداقل 2 کاراکتر باشد";
    }

    if (formData.employer.length < 2) {
      newErrors.employer = "نام کارفرما باید حداقل 2 کاراکتر باشد";
    }

    if (formData.employer_en.length < 2) {
      newErrors.employer_en = "نام کارفرمای انگلیسی باید حداقل 2 کاراکتر باشد";
    }

    if (!formData.start_date) {
      newErrors.start_date = "تاریخ شروع پروژه را وارد کنید";
    }

    if (selectedCategories.length === 0) {
      newErrors.categories = "حداقل یک دسته‌بندی باید انتخاب شود";
    }

    if (formData.location.length < 2) {
      newErrors.location = "مکان باید حداقل 2 کاراکتر باشد";
    }

    if (formData.location_en.length < 2) {
      newErrors.location_en = "مکان انگلیسی باید حداقل 2 کاراکتر باشد";
    }

    if (formData.text.length < 10) {
      newErrors.text = "توضیحات باید حداقل 10 کاراکتر باشد";
    }

    if (formData.text_en.length < 10) {
      newErrors.text_en = "توضیحات انگلیسی باید حداقل 10 کاراکتر باشد";
    }

    if (imageItems.length === 0) {
      newErrors.images = "حداقل یک تصویر باید آپلود شود";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("لطفا خطاهای فرم را برطرف کنید");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create FormData for file uploads
      const submitData = new FormData();

      // Add form values
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          submitData.append(key, value as string);
        }
      });

      // Add categories
      selectedCategories.forEach((id, index) => {
        submitData.append(`category_id[${index}]`, id.toString());
      });

      // Add video if exists
      if (videoFile) {
        submitData.append("video", videoFile);
      }

      // Add images
      imageItems.forEach((item, index) => {
        submitData.append(`images[${index}]`, item.file);
      });

      // Send to API
      const response = await fetch("/api/projects", {
        method: "POST",
        body: submitData,
        // Don't set Content-Type header, it will be set automatically with boundary
      });

      if (!response.ok) {
        throw new Error("خطا در ارسال اطلاعات");
      }

      toast.success("پروژه با موفقیت ایجاد شد");

      // Redirect to projects list
      router.push("/projects");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error instanceof Error ? error.message : "خطا در ارسال اطلاعات"
      );
    } finally {
      setIsSubmitting(false);
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
    <div className="w-full" dir="rtl">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>ایجاد پروژه جدید</CardTitle>
          <CardDescription>اطلاعات پروژه جدید را وارد کنید</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان پروژه</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="عنوان پروژه را وارد کنید"
                  value={formData.title}
                  onChange={handleInputChange}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title_en">عنوان انگلیسی</Label>
                <Input
                  id="title_en"
                  name="title_en"
                  placeholder="Enter project title"
                  dir="ltr"
                  value={formData.title_en}
                  onChange={handleInputChange}
                />
                {errors.title_en && (
                  <p className="text-sm text-red-500">{errors.title_en}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="employer">کارفرما</Label>
                <Input
                  id="employer"
                  name="employer"
                  placeholder="نام کارفرما را وارد کنید"
                  value={formData.employer}
                  onChange={handleInputChange}
                />
                {errors.employer && (
                  <p className="text-sm text-red-500">{errors.employer}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="employer_en">کارفرما (انگلیسی)</Label>
                <Input
                  id="employer_en"
                  name="employer_en"
                  placeholder="Enter employer name"
                  dir="ltr"
                  value={formData.employer_en}
                  onChange={handleInputChange}
                />
                {errors.employer_en && (
                  <p className="text-sm text-red-500">{errors.employer_en}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date">تاریخ شروع</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  placeholder="تاریخ شروع را وارد کنید (مثال: 1402-06-15)"
                  value={formData.start_date}
                  onChange={handleInputChange}
                />
                {errors.start_date && (
                  <p className="text-sm text-red-500">{errors.start_date}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>دسته‌بندی‌ها</Label>
                <p className="text-sm text-muted-foreground">
                  حداقل یک دسته‌بندی را انتخاب کنید
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2 space-x-reverse"
                    >
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={(checked) =>
                          handleCategoryChange(category.id, checked === true)
                        }
                      />
                      <Label
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-normal cursor-pointer mr-2"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.categories && (
                  <p className="text-sm text-red-500">{errors.categories}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">مکان پروژه</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="مکان پروژه را وارد کنید"
                  value={formData.location}
                  onChange={handleInputChange}
                />
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location_en">مکان پروژه (انگلیسی)</Label>
                <Input
                  id="location_en"
                  name="location_en"
                  placeholder="Enter project location"
                  dir="ltr"
                  value={formData.location_en}
                  onChange={handleInputChange}
                />
                {errors.location_en && (
                  <p className="text-sm text-red-500">{errors.location_en}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="text">توضیحات</Label>
                <Textarea
                  id="text"
                  name="text"
                  placeholder="توضیحات پروژه را وارد کنید"
                  className="min-h-[120px]"
                  value={formData.text}
                  onChange={handleInputChange}
                />
                {errors.text && (
                  <p className="text-sm text-red-500">{errors.text}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="text_en">توضیحات (انگلیسی)</Label>
                <Textarea
                  id="text_en"
                  name="text_en"
                  placeholder="Enter project description"
                  className="min-h-[120px]"
                  dir="ltr"
                  value={formData.text_en}
                  onChange={handleInputChange}
                />
                {errors.text_en && (
                  <p className="text-sm text-red-500">{errors.text_en}</p>
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
                {errors.images && (
                  <p className="text-sm text-red-500">{errors.images}</p>
                )}

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
          </CardContent>
          <CardFooter className="flex justify-between my-4">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              انصراف
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  در حال ارسال...
                </>
              ) : (
                "ایجاد پروژه"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
