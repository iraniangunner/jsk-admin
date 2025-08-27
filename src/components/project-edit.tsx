"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Badge, Loader2, Upload, X } from "lucide-react"
import { getProjectById, updateProject } from "@/hooks/use-project"
import { getCategories } from "@/hooks/use-category"
import { toast, ToastContainer } from "react-toastify"

const projectSchema = z.object({
  title: z.string().min(1, "عنوان الزامی است"),
  title_en: z.string().optional(),
  employer: z.string().min(1, "کارفرما الزامی است"),
  employer_en: z.string().optional(),
  category_id: z.array(z.number()).min(1, "حداقل یک دسته‌بندی انتخاب کنید"),
  start_date: z
    .string()
    .min(1, "تاریخ شروع الزامی است")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "فرمت تاریخ باید YYYY-MM-DD باشد"),
  location: z.string().min(1, "مکان الزامی است"),
  location_en: z.string().optional(),
  text: z.string().min(1, "توضیحات الزامی است"),
  text_en: z.string().optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

// انواع
type Category = { id: number; title: string }
type ProjectImage = { id: number; image: string; full_path?: string }
type Project = {
  id: number
  title: string
  title_en: string | null
  employer: string
  employer_en: string | null
  start_date: string
  location: string
  location_en: string | null
  text: string
  text_en: string | null
  preview_image: string | null
  video: string | null
  images: ProjectImage[]
  categories: Category[]
}

type ImageItem = {
  id?: number
  file?: File
  url: string
  toDelete?: boolean
  isExisting: boolean
}

export function EditProject() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm<ProjectFormData>({
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
  })

  // Watch category_id for checkbox handling
  const selectedCategories = watch("category_id")

  // Preview image (کاور)
  const [existingPreviewUrl, setExistingPreviewUrl] = React.useState<string | null>(null)
  const [previewFile, setPreviewFile] = React.useState<File | null>(null)
  const [deletePreview, setDeletePreview] = React.useState(false)

  // Video
  const [existingVideoUrl, setExistingVideoUrl] = React.useState<string | null>(null)
  const [videoFile, setVideoFile] = React.useState<File | null>(null)
  const [videoPreviewUrl, setVideoPreviewUrl] = React.useState<string | null>(null)
  const [deleteVideo, setDeleteVideo] = React.useState(false)

  // گالری
  const [imageItems, setImageItems] = React.useState<ImageItem[]>([])

  // update project
  const { mutate: updateProjectMutation, isPending: isSaving } = updateProject()

  // Get categories
  const { data: categories, isLoading: categoriesLoading } = getCategories()

  // Get project data
  const { data: projectData, isLoading: projectLoading, isError: projectError } = getProjectById(projectId)

  React.useEffect(() => {
    if (projectData) {
      // Reset form with project data
      reset({
        title: projectData.title || "",
        title_en: projectData.title_en || "",
        employer: projectData.employer || "",
        employer_en: projectData.employer_en || "",
        category_id: (projectData.categories || []).map((c: any) => c.id),
        start_date: projectData.start_date || "",
        location: projectData.location || "",
        location_en: projectData.location_en || "",
        text: projectData.text || "",
        text_en: projectData.text_en || "",
      })

      // preview image
      setExistingPreviewUrl(projectData.preview_image_url || null)
      setDeletePreview(false)
      setPreviewFile(null)

      // video
      setExistingVideoUrl(projectData.video || null)
      setDeleteVideo(false)
      setVideoFile(null)
      setVideoPreviewUrl(null)

      // گالری
      const mapped: ImageItem[] = (projectData.images || []).map((img: any) => ({
        id: img.id,
        url: img.full_path || img.image,
        isExisting: true,
        toDelete: false,
      }))
      setImageItems(mapped)
    }

    return () => {
      // جمع‌آوری URLهای موقت
      imageItems.forEach((it) => {
        if (!it.isExisting && it.url?.startsWith("blob:")) {
          URL.revokeObjectURL(it.url)
        }
      })
      if (videoPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(videoPreviewUrl)
      }
    }
  }, [projectData, reset])

  const toggleCategory = (id: number, checked: boolean | "indeterminate") => {
    const isChecked = checked === true
    const currentCategories = selectedCategories || []
    const newCategories = isChecked ? [...currentCategories, id] : currentCategories.filter((cid) => cid !== id)
    setValue("category_id", newCategories, { shouldValidate: true })
  }

  // اضافه کردن تصاویر جدید با پیش‌نمایش
  const onAddImages = (files: FileList | null) => {
    if (!files) return
    const arr = Array.from(files)
    const mapped = arr.map<ImageItem>((file) => ({
      file,
      url: URL.createObjectURL(file),
      isExisting: false,
      toDelete: false,
    }))
    setImageItems((prev) => [...prev, ...mapped])
  }

  // علامت زدن/برداشتن حذف برای تصاویر موجود
  const toggleDeleteExisting = (index: number) => {
    setImageItems((prev) => prev.map((it, i) => (i === index ? { ...it, toDelete: !it.toDelete } : it)))
  }

  // حذف از UI برای تصاویر جدید (قبل از ارسال)
  const removeNewImage = (index: number) => {
    setImageItems((prev) => {
      const target = prev[index]
      if (target && !target.isExisting && target.url?.startsWith("blob:")) {
        URL.revokeObjectURL(target.url)
      }
      return prev.filter((_, i) => i !== index)
    })
  }

  // ویدیو
  const onChangeVideo = (file?: File) => {
    if (videoPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(videoPreviewUrl)

    if (file) {
      setVideoFile(file)
      const url = URL.createObjectURL(file)
      setVideoPreviewUrl(url)
      setDeleteVideo(false)
    } else {
      setVideoFile(null)
      setVideoPreviewUrl(null)
    }
  }

  // preview image
  const onChangePreviewImage = (file?: File) => {
    if (previewFile && (previewFile as any).__tmpUrl) {
      URL.revokeObjectURL((previewFile as any).__tmpUrl)
    }
    if (file) {
      const tmpUrl = URL.createObjectURL(file)
      ;(file as any).__tmpUrl = tmpUrl
      setPreviewFile(file)
      setDeletePreview(false)
    } else {
      setPreviewFile(null)
      setDeletePreview(true)
    }
  }

  const onSubmit = async (formData: ProjectFormData) => {
    if (!projectData) return

    try {
      const fd = new FormData()

      // داده‌های متنی
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "category_id") {
          // Handle category array separately
          ;(value as number[]).forEach((id) => fd.append("category_id[]", String(id)))
        } else if (value !== undefined && value !== null && value !== "") {
          fd.append(key, String(value))
        }
      })

      // preview image / delete_preview
      if (deletePreview) {
        fd.append("delete_preview_image", "true")
      }
      if (previewFile) {
        fd.append("preview_image", previewFile)
      }

      // گالری: حذف تصاویر موجودِ علامت‌خورده
      imageItems
        .filter((it) => it.isExisting && it.toDelete && it.id)
        .forEach((it) => fd.append("delete_image_ids[]", String(it.id)))

      // گالری: افزودن تصاویر جدید
      imageItems.filter((it) => !it.isExisting && it.file).forEach((it) => fd.append("images[]", it.file as File))

      // ویدیو
      if (deleteVideo) {
        fd.append("delete_video", "true")
      }
      if (videoFile) {
        fd.append("video", videoFile)
      }

      fd.append("_method", "PUT")

      updateProjectMutation(
        { id: projectId, formData: fd },
        {
          onSuccess: () => {
            toast.success("پروژه با موفقیت بروزرسانی شد")
            setTimeout(() => {
              router.push("/projects")
            }, 1500)
          },
          onError: (error) => {
            console.error("Update failed:", error)
            toast.error("خطا در بروزرسانی پروژه. لطفا دوباره تلاش کنید.")
          },
        },
      )
    } catch (e: any) {
      toast.error("خطا در بروزرسانی پروژه")
    }
  }

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center h-72">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        در حال بارگذاری...
      </div>
    )
  }
  if (projectError) {
    return (
      <div className="max-w-md mx-auto my-12 text-center">
        <p className="text-destructive mb-4">مشکلی پیش آمده دوباره تلاش کنید</p>
        <Button variant="outline" onClick={() => router.refresh()}>
          تلاش مجدد
        </Button>
      </div>
    )
  }
  if (!projectData) return null

  return (
    <>
      <ToastContainer />
      <div className="container max-w-4xl mx-auto py-10" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">ویرایش پروژه</h1>
          <Button variant="outline" className="cursor-pointer bg-transparent" onClick={() => router.push("/projects")}>
            <ArrowLeft className="ml-2 h-4 w-4" />
            بازگشت به لیست
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات پروژه</CardTitle>
              <CardDescription>فیلدها را ویرایش و رسانه‌ها را مدیریت کنید</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="mb-2">عنوان *</Label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id="title" className={errors.title ? "border-red-500" : ""} />
                    )}
                  />
                  {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
                </div>
                <div>
                  <Label htmlFor="title_en" className="mb-2">عنوان (EN)</Label>
                  <Controller
                    name="title_en"
                    control={control}
                    render={({ field }) => <Input {...field} id="title_en" dir="ltr" />}
                  />
                </div>
                <div>
                  <Label htmlFor="employer" className="mb-2">کارفرما *</Label>
                  <Controller
                    name="employer"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id="employer" className={errors.employer ? "border-red-500" : ""} />
                    )}
                  />
                  {errors.employer && <p className="text-sm text-red-500 mt-1">{errors.employer.message}</p>}
                </div>
                <div>
                  <Label htmlFor="employer_en" className="mb-2">کارفرما (EN)</Label>
                  <Controller
                    name="employer_en"
                    control={control}
                    render={({ field }) => <Input {...field} id="employer_en" dir="ltr" />}
                  />
                </div>
                <div>
                  <Label htmlFor="start_date" className="mb-2">تاریخ شروع *</Label>
                  <Controller
                    name="start_date"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="start_date"
                        placeholder="YYYY-MM-DD"
                        className={errors.start_date ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.start_date && <p className="text-sm text-red-500 mt-1">{errors.start_date.message}</p>}
                </div>
                <div>
                  <Label htmlFor="location" className="mb-2">مکان *</Label>
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id="location" className={errors.location ? "border-red-500" : ""} />
                    )}
                  />
                  {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>}
                </div>
                <div>
                  <Label htmlFor="location_en" className="mb-2">مکان (EN)</Label>
                  <Controller
                    name="location_en"
                    control={control}
                    render={({ field }) => <Input {...field} id="location_en" dir="ltr" />}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="text" className="mb-2">توضیحات *</Label>
                  <Controller
                    name="text"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        id="text"
                        className={`min-h-[120px] ${errors.text ? "border-red-500" : ""}`}
                      />
                    )}
                  />
                  {errors.text && <p className="text-sm text-red-500 mt-1">{errors.text.message}</p>}
                </div>
                <div>
                  <Label htmlFor="text_en" className="mb-2">توضیحات (EN)</Label>
                  <Controller
                    name="text_en"
                    control={control}
                    render={({ field }) => <Textarea {...field} id="text_en" className="min-h-[120px]" dir="ltr" />}
                  />
                </div>
              </div>

              {/* دسته‌بندی‌ها */}
              <div>
                <Label className="mb-2">دسته‌بندی‌ها *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {categories?.map((cat: any) => {
                    const checked = selectedCategories?.includes(cat.id) || false
                    return (
                      <label key={cat.id} className="flex items-center gap-2 rounded-md border p-2">
                        <Checkbox checked={checked} onCheckedChange={(v) => toggleCategory(cat.id, v)} />
                        <span className="text-sm">{cat.title}</span>
                        {checked && <Badge className="mr-auto">انتخاب شده</Badge>}
                      </label>
                    )
                  })}
                </div>
                {errors.category_id && <p className="text-sm text-red-500 mt-1">{errors.category_id.message}</p>}
              </div>

              {/* Preview Image (کاور) */}
              <div className="space-y-2">
                <Label>تصویر کاور (Preview)</Label>
                <div className="flex flex-wrap items-start gap-4">
                  {/* قبلی */}
                  {existingPreviewUrl && !deletePreview && !previewFile && (
                    <div className="relative">
                      <img
                        src={existingPreviewUrl || "/placeholder.svg"}
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
                        onChange={(e) => onChangePreviewImage(e.target.files?.[0] || undefined)}
                      />
                    </label>
                  )}

                  {/* پیش‌نمایش فایل جدید */}
                  {previewFile && (
                    <div className="relative">
                      <img
                        src={(previewFile as any).__tmpUrl || "/placeholder.svg"}
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
                      <video src={existingVideoUrl} controls className="w-full rounded-lg border" />
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
                      <video src={videoPreviewUrl} controls className="w-full rounded-lg border" />
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
                          src={it.url || "/placeholder.svg"}
                          alt="gallery"
                          className={`w-full h-32 object-cover rounded-lg border ${
                            it.toDelete ? "opacity-50 border-red-500" : ""
                          }`}
                        />

                        {/* برای تصاویر موجود: چک حذف */}
                        {it.isExisting ? (
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/70 rounded-md px-2 py-1">
                            <Checkbox checked={!!it.toDelete} onCheckedChange={() => toggleDeleteExisting(index)} />
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
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/projects")}
                className="cursor-pointer"
              >
                انصراف
              </Button>
              <Button type="submit" disabled={isSaving || !isValid} className="cursor-pointer">
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
        </form>
      </div>
    </>
  )
}
