"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Badge, Loader2, Upload, X } from "lucide-react";
import { getProjectById, updateProject } from "@/hooks/use-project";
import { getCategories } from "@/hooks/use-category";
import { toast, ToastContainer } from "react-toastify";

// انواع
type Category = { id: number; title: string };
type ProjectImage = { id: number; image: string; full_path?: string }; // full_path اگر بک‌اند برگرداند
type Project = {
  id: number;
  title: string;
  title_en: string | null;
  employer: string;
  employer_en: string | null;
  start_date: string; // "YYYY-MM-DD"
  location: string;
  location_en: string | null;
  text: string;
  text_en: string | null;
  preview_image: string | null; // مسیر/URL
  video: string | null; // مسیر/URL
  images: ProjectImage[];
  categories: Category[];
};

// برای آیتم‌های گالری در UI
type ImageItem = {
  // برای تصاویر موجود
  id?: number;
  // برای تصاویر جدید:
  file?: File;
  // آدرس قابل نمایش (قدیمی: URL فایل از سرور، جدید: ObjectURL)
  url: string;
  // آیا برای حذف علامت خورده؟
  toDelete?: boolean;
  // آیا قبلی است؟
  isExisting: boolean;
};

export function EditProject() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  
  // const [submitting, setSubmitting] = React.useState(false);
  // const [error, setError] = React.useState<string | null>(null);

  // فرم‌های ساده
  const [form, setForm] = React.useState({
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

  // دسته‌بندی‌ها (آرایه)
  const [selectedCategories, setSelectedCategories] = React.useState<number[]>(
    []
  );

  // Preview image (کاور)
  const [existingPreviewUrl, setExistingPreviewUrl] = React.useState<
    string | null
  >(null);
  const [previewFile, setPreviewFile] = React.useState<File | null>(null);
  const [deletePreview, setDeletePreview] = React.useState(false);

  // Video
  const [existingVideoUrl, setExistingVideoUrl] = React.useState<string | null>(
    null
  );
  const [videoFile, setVideoFile] = React.useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = React.useState<string | null>(
    null
  );
  const [deleteVideo, setDeleteVideo] = React.useState(false);

  // گالری
  const [imageItems, setImageItems] = React.useState<ImageItem[]>([]);

  // update project

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


  // fetch پروژه و دسته‌بندی‌ها
  React.useEffect(() => {
    
    (async () => {
      try {
        // ست فیلدها
        setForm({
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

        setSelectedCategories(
          (projectData.categories || []).map((c: any) => c.id)
        );

        // preview image
        setExistingPreviewUrl(projectData.preview_image_url || null);
        setDeletePreview(false);
        setPreviewFile(null);

        // video
        setExistingVideoUrl(projectData.video || null);
        setDeleteVideo(false);
        setVideoFile(null);
        setVideoPreviewUrl(null);

        // گالری
        const mapped: ImageItem[] = (projectData.images || []).map(
          (img: any) => ({
            id: img.id,
            url: img.full_path || img.image, // اگر full_path داری از آن استفاده کن
            isExisting: true,
            toDelete: false,
          })
        );
        setImageItems(mapped);
      } catch (e: any) {
        // setError(e?.message || "خطا در دریافت اطلاعات");
      } finally {
        // setLoading(false);
      }
    })();

    return () => {
      // جمع‌آوری URLهای موقت
      imageItems.forEach((it) => {
        if (!it.isExisting && it.url?.startsWith("blob:")) {
          URL.revokeObjectURL(it.url);
        }
      });
      if (videoPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectData]);

  const onChangeText = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (id: number, checked: boolean | "indeterminate") => {
    const isChecked = checked === true;
    setSelectedCategories((prev) =>
      isChecked ? [...prev, id] : prev.filter((cid) => cid !== id)
    );
  };

  // اضافه کردن تصاویر جدید با پیش‌نمایش
  const onAddImages = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    const mapped = arr.map<ImageItem>((file) => ({
      file,
      url: URL.createObjectURL(file),
      isExisting: false,
      toDelete: false,
    }));
    setImageItems((prev) => [...prev, ...mapped]);
  };

  // علامت زدن/برداشتن حذف برای تصاویر موجود
  const toggleDeleteExisting = (index: number) => {
    setImageItems((prev) =>
      prev.map((it, i) =>
        i === index ? { ...it, toDelete: !it.toDelete } : it
      )
    );
  };

  // حذف از UI برای تصاویر جدید (قبل از ارسال)
  const removeNewImage = (index: number) => {
    setImageItems((prev) => {
      const target = prev[index];
      if (target && !target.isExisting && target.url?.startsWith("blob:")) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // ویدیو
  const onChangeVideo = (file?: File) => {
    // پاک کردن prev URL
    if (videoPreviewUrl?.startsWith("blob:"))
      URL.revokeObjectURL(videoPreviewUrl);

    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
      setDeleteVideo(false);
    } else {
      setVideoFile(null);
      setVideoPreviewUrl(null);
    }
  };

  // preview image
  const onChangePreviewImage = (file?: File) => {
    if (previewFile && (previewFile as any).__tmpUrl) {
      URL.revokeObjectURL((previewFile as any).__tmpUrl);
    }
    if (file) {
      // برای نمایش سریع می‌توانیم یک URL موقت تولید کنیم:
      const tmpUrl = URL.createObjectURL(file);
      (file as any).__tmpUrl = tmpUrl;
      setPreviewFile(file);
      setDeletePreview(false);
    } else {
      setPreviewFile(null);
      setDeletePreview(true);
    }
  };

  const onSubmit = async () => {
    if (!projectData) return;
    // setSubmitting(true);
    // setError(null);

    try {
      const fd = new FormData();

      // داده‌های متنی
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          fd.append(key, String(value));
        }
      });

      // دسته‌بندی‌ها
      selectedCategories.forEach((id) =>
        fd.append("category_id[]", String(id))
      );

      // preview image / delete_preview
      if (deletePreview) {
        fd.append("delete_preview_image", "true");
      }
      if (previewFile) {
        fd.append("preview_image", previewFile);
      }

      // گالری: حذف تصاویر موجودِ علامت‌خورده
      imageItems
        .filter((it) => it.isExisting && it.toDelete && it.id)
        .forEach((it) => fd.append("delete_image_ids[]", String(it.id)));

      // گالری: افزودن تصاویر جدید
      imageItems
        .filter((it) => !it.isExisting && it.file)
        .forEach((it) => fd.append("images[]", it.file as File));

      // ویدیو
      if (deleteVideo) {
        fd.append("delete_video", "true");
      }
      if (videoFile) {
        fd.append("video", videoFile);
      }

      // در صورتی که Route شما PUT است و سرور از method override استفاده می‌کند:
      fd.append("_method", "PUT");

      // ارسال:

      updateProjectMutation(
        { id: projectId, formData: fd },
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

      // ریدایرکت یا پیام موفقیت
      // router.push("/projects");
    } catch (e: any) {
      // setError(e?.response?.data?.message || e?.message || "خطا در بروزرسانی");
    } finally {
      // setSubmitting(false);
    }
  };

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center h-72">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        در حال بارگذاری...
      </div>
    );
  }
  if (projectError) {
    return (
      <div className="max-w-md mx-auto my-12 text-center">
        <p className="text-destructive mb-4">مشکلی پیش آمده دوباره تلاش کنید</p>
        <Button variant="outline" onClick={() => router.refresh()}>
          تلاش مجدد
        </Button>
      </div>
    );
  }
  if (!projectData) return null;

  return (
    <>
      <ToastContainer />
      <div className="container max-w-4xl mx-auto py-10" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">ویرایش پروژه</h1>
          <Button variant="outline" className="cursor-pointer" onClick={() => router.push("/projects")}>
            <ArrowLeft className="ml-2 h-4 w-4" />
            بازگشت به لیست
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>اطلاعات پروژه</CardTitle>
            <CardDescription>
              فیلدها را ویرایش و رسانه‌ها را مدیریت کنید
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* فیلدها */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">عنوان</Label>
                <Input
                  id="title"
                  name="title"
                  value={projectData.title}
                  onChange={onChangeText}
                />
              </div>
              <div>
                <Label htmlFor="title_en">عنوان (EN)</Label>
                <Input
                  id="title_en"
                  name="title_en"
                  value={projectData.title_en}
                  onChange={onChangeText}
                  dir="ltr"
                />
              </div>
              <div>
                <Label htmlFor="employer">کارفرما</Label>
                <Input
                  id="employer"
                  name="employer"
                  value={projectData.employer}
                  onChange={onChangeText}
                />
              </div>
              <div>
                <Label htmlFor="employer_en">کارفرما (EN)</Label>
                <Input
                  id="employer_en"
                  name="employer_en"
                  value={projectData.employer_en}
                  onChange={onChangeText}
                  dir="ltr"
                />
              </div>
              <div>
                <Label htmlFor="start_date">تاریخ شروع</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  value={projectData.start_date}
                  onChange={onChangeText}
                  placeholder="YYYY-MM-DD"
                />
              </div>
              <div>
                <Label htmlFor="location">مکان</Label>
                <Input
                  id="location"
                  name="location"
                  value={projectData.location}
                  onChange={onChangeText}
                />
              </div>
              <div>
                <Label htmlFor="location_en">مکان (EN)</Label>
                <Input
                  id="location_en"
                  name="location_en"
                  value={projectData.location_en}
                  onChange={onChangeText}
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="text">توضیحات</Label>
                <Textarea
                  id="text"
                  name="text"
                  value={projectData.text}
                  onChange={onChangeText}
                  className="min-h-[120px]"
                />
              </div>
              <div>
                <Label htmlFor="text_en">توضیحات (EN)</Label>
                <Textarea
                  id="text_en"
                  name="text_en"
                  value={projectData.text_en}
                  onChange={onChangeText}
                  className="min-h-[120px]"
                  dir="ltr"
                />
              </div>
            </div>

            {/* دسته‌بندی‌ها */}
            <div>
              <Label>دسته‌بندی‌ها</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {categories.map((cat: any) => {
                  const checked = selectedCategories.includes(cat.id);
                  return (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2 rounded-md border p-2"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(v) => toggleCategory(cat.id, v)}
                      />
                      <span className="text-sm">{cat.title}</span>
                      {checked && <Badge className="mr-auto">انتخاب شده</Badge>}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Preview Image (کاور) */}
            <div className="space-y-2">
              <Label>تصویر کاور (Preview)</Label>
              <div className="flex flex-wrap items-start gap-4">
                {/* قبلی */}
                {existingPreviewUrl && !deletePreview && !previewFile && (
                  <div className="relative">
                    <img
                      src={existingPreviewUrl}
                      alt="preview"
                      className="w-40 h-40 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => setDeletePreview(true)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      حذف
                    </Button>
                  </div>
                )}

                {/* جدید */}
                {(deletePreview || !existingPreviewUrl) && (
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
                        onChangePreviewImage(e.target.files?.[0] || undefined)
                      }
                    />
                  </label>
                )}

                {/* پیش‌نمایش فایل جدید */}
                {previewFile && (
                  <div className="relative">
                    <img
                      src={(previewFile as any).__tmpUrl}
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

            {/* ویدیو */}
            <div className="space-y-2">
              <Label>ویدیو</Label>
              <div className="flex flex-col gap-3">
                {/* ویدیو موجود */}
                {existingVideoUrl && !deleteVideo && !videoPreviewUrl && (
                  <div className="relative w-full max-w-md">
                    <video
                      src={existingVideoUrl}
                      controls
                      className="w-full rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setDeleteVideo(true)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      حذف
                    </Button>
                  </div>
                )}

                {/* انتخاب ویدیو جدید */}
                {(deleteVideo || !existingVideoUrl) && !videoPreviewUrl && (
                  <label className="flex flex-col items-center justify-center w-full max-w-md h-28 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/70">
                    <div className="flex flex-col items-center">
                      <Upload className="w-6 h-6 mb-2 opacity-70" />
                      <span className="text-sm">آپلود ویدیو (MP4)</span>
                    </div>
                    <Input
                      type="file"
                      accept="video/mp4"
                      className="hidden"
                      onChange={(e) => onChangeVideo(e.target.files?.[0])}
                    />
                  </label>
                )}

                {/* پیش‌نمایش ویدیوی جدید */}
                {videoPreviewUrl && (
                  <div className="relative w-full max-w-md">
                    <video
                      src={videoPreviewUrl}
                      controls
                      className="w-full rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => onChangeVideo(undefined)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      حذف انتخاب
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* گالری تصاویر */}
            <div className="space-y-2">
              <Label>گالری تصاویر</Label>

              {/* دکمه آپلود چندتایی */}
              <label className="mt-2 flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/70">
                <div className="flex flex-col items-center">
                  <Upload className="w-6 h-6 mb-2 opacity-70" />
                  <span className="text-sm">برای افزودن تصاویر کلیک کنید</span>
                  <span className="text-xs opacity-70">PNG, JPG, JPEG</span>
                </div>
                <Input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  multiple
                  className="hidden"
                  onChange={(e) => onAddImages(e.target.files)}
                />
              </label>

              {/* گرید پیش‌نمایش */}
              {imageItems.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {imageItems.map((it, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={it.url}
                        alt="gallery"
                        className={`w-full h-32 object-cover rounded-lg border ${
                          it.toDelete ? "opacity-50 border-red-500" : ""
                        }`}
                      />

                      {/* برای تصاویر موجود: چک حذف */}
                      {it.isExisting ? (
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/70 rounded-md px-2 py-1">
                          <Checkbox
                            checked={!!it.toDelete}
                            onCheckedChange={() => toggleDeleteExisting(index)}
                          />
                          <span className="text-xs">حذف</span>
                        </div>
                      ) : (
                        // برای تصاویر جدید: دکمه حذف از لیست
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition"
                          onClick={() => removeNewImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/projects")} className="cursor-pointer">
              انصراف
            </Button>
            <Button onClick={onSubmit} disabled={isSaving} className="cursor-pointer">
              {isSaving? (
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
