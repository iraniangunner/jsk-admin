"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Upload, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateProject, getProjectById } from "@/hooks/use-project";
import { getCategories } from "@/hooks/use-category";

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
  file?: File;
  preview: string;
  isExisting?: boolean;
  url?: string;
}

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export function EditProject() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const [projectFormData, setProjectFormData] = useState<ProjectFormData>({
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
  const [existingVideo, setExistingVideo] = useState<string | null>(null);
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [existingImagesToDelete, setExistingImagesToDelete] = useState<
    string[]
  >([]);

  // Update mutation
  const { mutate: updateProjectMutation, isPending: isSaving } =
    updateProject();

  // Get categories
  const { data: categories, isLoading: categoriesLoading } = getCategories();

  // Get project data
  const {
    data: projectData,
    isLoading: projectLoading,
    isError: projectError,
  } = getProjectById(projectId);

  // Add a useEffect to update form state when project data is loaded
  useEffect(() => {
    if (projectData) {
      // Set form data
      setProjectFormData({
        title: projectData.title || "",
        title_en: projectData.title_en || "",
        employer: projectData.employer || "",
        employer_en: projectData.employer_en || "",
        start_date: projectData.start_date || "",
        location: projectData.location || "",
        location_en: projectData.location_en || "",
        text: projectData.text || "",
        text_en: projectData.text_en || "",
      });

      // Set categories
      if (projectData.categories && Array.isArray(projectData.categories)) {
        setSelectedCategories(projectData.categories.map((cat: any) => cat.id));
      }

      // Set video
      if (projectData.video) {
        setExistingVideo(projectData.video);
        setVideoPreview(projectData.video);
      }
      // Set video to null if the value is video
      if (typeof projectData.video === "string") {
        setExistingVideo(null);
        setVideoPreview(null);
      }

      // Set images
      if (projectData.images && Array.isArray(projectData.images)) {
        const existingImages = projectData.images.map((img: any) => ({
          id: generateId(),
          preview: img.full_path,
          isExisting: true,
          url: img.url,
        }));
        setImageItems(existingImages);
      }
    }
  }, [projectData]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProjectFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, id]);
    } else {
      setSelectedCategories((prev) =>
        prev.filter((categoryId) => categoryId !== id)
      );
    }
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      setExistingVideo(null); // Clear existing video reference
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
        isExisting: false,
      }));

      setImageItems((prev) => [...prev, ...newImageItems]);
    }
  };

  //   console.log(existingImagesToDelete);
  //   console.log(imageItems);

//   const removeImage = (id: string) => {
//     setImageItems((prevItems) => {
      //   const itemToRemove = prevItems.find((item) => item.id === id);
      //   if (itemToRemove) {
      //     // Revoke the object URL to avoid memory leaks
      //     if (!itemToRemove.isExisting) {
      //       URL.revokeObjectURL(itemToRemove.preview);
      //     } else if (itemToRemove.url) {
      //       // Mark existing image for deletion on the server
      //       setExistingImagesToDelete((prev) => [...prev, itemToRemove.url!]);
      //     }
      //   }

      // Return a new array without the removed item
//       return prevItems.filter((item) => item.id !== id);
//     });
//   };

  const removeImage = (id: string) => {
    setImageItems((prevItems) => {
      // Clean up memory for new images before removing
      const itemToRemove = prevItems.find(item => item.id === id);
      if (itemToRemove && !itemToRemove.isExisting) {
        URL.revokeObjectURL(itemToRemove.preview);
      }
      
      return prevItems.filter((item) => item.id !== id);
    });
  };

  const removeVideo = () => {
    if (videoPreview && !existingVideo) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoFile(null);
    setVideoPreview(null);
    setExistingVideo(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!projectFormData.employer || !projectFormData.text) {
      toast.error("لطفا فیلدهای ضروری را پر کنید");
      return;
    }

    try {
      // Create formData for file uploads
      const formData = new FormData();

      // Add form values
      Object.entries(projectFormData).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value as string);
        }
      });

      // Add categories
      selectedCategories.forEach((id, index) => {
        formData.append(`category_id[${index}]`, id.toString());
      });

      // Add video if exists
      if (videoFile) {
        formData.append("video", videoFile);
      }

      // Add all images (both new and existing that weren't removed)
      //   const imagesToUpload = imageItems.filter(
      //     (item) => item.isExisting && !item.file
      //   );
      imageItems.forEach((item, index) => {
        if (item.file) {
          formData.append(`images[${index}]`, item.file);
        }
      });

      formData.append("_method", "PUT");

      // Send to API
      updateProjectMutation(
        { id: projectId, formData },
        {
          onSuccess: () => {
            toast.success("پروژه با موفقیت بروزرسانی شد");
            // Navigate back to projects list after successful update
            setTimeout(() => {
              router.push("/projects");
            }, 1500);
          },
          onError: (error) => {
            console.error("Update failed:", error);
            toast.error("خطا در بروزرسانی پروژه. لطفا دوباره تلاش کنید.");
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
      imageItems
        .filter((item) => !item.isExisting)
        .forEach((item) => URL.revokeObjectURL(item.preview));

      if (videoPreview && !existingVideo) URL.revokeObjectURL(videoPreview);
    };
  }, [imageItems, videoPreview, existingVideo]);

  if (projectLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2">در حال بارگذاری...</span>
      </div>
    );
  }

  if (projectError) {
    return (
      <div className="flex justify-center items-center h-64 flex-col">
        <p className="text-destructive text-lg mb-4">
          خطا در بارگذاری اطلاعات پروژه
        </p>
        <Button variant="outline" onClick={() => router.push("/projects")}>
          بازگشت به لیست پروژه‌ها
        </Button>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="container py-10 max-w-4xl mx-auto" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">ویرایش پروژه</h1>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => router.push("/projects")}
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            بازگشت به لیست
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ویرایش پروژه</CardTitle>
            <CardDescription>اطلاعات پروژه را ویرایش کنید</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان پروژه</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="عنوان پروژه را وارد کنید"
                  value={projectFormData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title_en">عنوان انگلیسی</Label>
                <Input
                  id="title_en"
                  name="title_en"
                  placeholder="Enter project title"
                  dir="ltr"
                  value={projectFormData.title_en}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employer">کارفرما</Label>
                <Input
                  id="employer"
                  name="employer"
                  placeholder="نام کارفرما را وارد کنید"
                  value={projectFormData.employer}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employer_en">کارفرما (انگلیسی)</Label>
                <Input
                  id="employer_en"
                  name="employer_en"
                  placeholder="Enter employer name"
                  dir="ltr"
                  value={projectFormData.employer_en}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date">تاریخ شروع</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  placeholder="تاریخ شروع را وارد کنید (مثال: 1402-06-15)"
                  value={projectFormData.start_date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label>دسته‌بندی‌ها</Label>
                <p className="text-sm text-muted-foreground">
                  حداقل یک دسته‌بندی را انتخاب کنید
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {categoriesLoading ? (
                    <p>loading....</p>
                  ) : (
                    <>
                      {categories.map((category: any) => (
                        <div
                          key={category.id}
                          className="flex items-center space-x-2 space-x-reverse"
                        >
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
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
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">مکان پروژه</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="مکان پروژه را وارد کنید"
                  value={projectFormData.location}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location_en">مکان پروژه (انگلیسی)</Label>
                <Input
                  id="location_en"
                  name="location_en"
                  placeholder="Enter project location"
                  dir="ltr"
                  value={projectFormData.location_en}
                  onChange={handleInputChange}
                />
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
                  value={projectFormData.text}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="text_en">توضیحات (انگلیسی)</Label>
                <Textarea
                  id="text_en"
                  name="text_en"
                  placeholder="Enter project description"
                  className="min-h-[120px]"
                  dir="ltr"
                  value={projectFormData.text_en}
                  onChange={handleInputChange}
                />
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
                          alt={`Preview ${item.file?.name || "Image"}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => router.push("/projects")}
              disabled={isSaving}
            >
              انصراف
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSaving}
              className="cursor-pointer px-8 py-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  در حال بروزرسانی...
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
