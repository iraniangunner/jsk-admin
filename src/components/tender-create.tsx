"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Loader2, Upload, X, ArrowLeft } from "lucide-react";
import { createTender } from "@/hooks/use-tender";
import { getTenderCategories } from "@/hooks/use-tenderCategory";
import { toast, ToastContainer } from "react-toastify";

// Define the tender status enum to match TenderStatusEnum
const statusMap: Record<string, string> = {
  فعال: "active",
  غیرفعال: "inactive",
  تمدید: "renewal",
  لغو: "cancelled",
};

// Zod schema based on Laravel validation rules
const tenderSchema = z.object({
  title: z
    .string()
    .min(1, "عنوان الزامی است")
    .max(63, "عنوان نمی‌تواند بیش از ۶۳ کاراکتر باشد"),
  title_en: z
    .string()
    .max(63, "عنوان انگلیسی نمی‌تواند بیش از ۶۳ کاراکتر باشد")
    .optional(),
  tender_category_id: z.number({ message: "دسته‌بندی الزامی است" }),
  number: z
    .string()
    .min(1, "شماره مناقصه الزامی است")
    .max(63, "شماره نمی‌تواند بیش از ۶۳ کاراکتر باشد"),
  start_date: z
    .string()
    .min(1, "تاریخ شروع الزامی است")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "فرمت تاریخ باید YYYY-MM-DD باشد"),
  end_date: z
    .string()
    .min(1, "تاریخ پایان الزامی است")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "فرمت تاریخ باید YYYY-MM-DD باشد"),
  department: z
    .string()
    .min(1, "دپارتمان الزامی است")
    .max(63, "دپارتمان نمی‌تواند بیش از ۶۳ کاراکتر باشد"),
  department_en: z
    .string()
    .max(63, "دپارتمان انگلیسی نمی‌تواند بیش از ۶۳ کاراکتر باشد")
    .optional(),
  phone: z
    .string()
    .min(1, "تلفن الزامی است")
    .max(15, "تلفن نمی‌تواند بیش از ۱۵ کاراکتر باشد"),
  email: z
    .string()
    .min(1, "ایمیل الزامی است")
    .max(127, "ایمیل نمی‌تواند بیش از ۱۲۷ کاراکتر باشد")
    .email("ایمیل نامعتبر است"),
  doc_opening_date: z
    .string()
    .min(1, "تاریخ بازگشایی اسناد الزامی است")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "فرمت تاریخ باید YYYY-MM-DD باشد"),
  doc_submission_deadline: z
    .string()
    .min(1, "مهلت ارسال اسناد الزامی است")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "فرمت تاریخ باید YYYY-MM-DD باشد"),
  doc_submission_location: z
    .string()
    .min(1, "محل ارسال اسناد الزامی است")
    .max(63, "محل ارسال اسناد نمی‌تواند بیش از ۶۳ کاراکتر باشد"),
  doc_submission_location_en: z
    .string()
    .max(63, "محل ارسال اسناد انگلیسی نمی‌تواند بیش از ۶۳ کاراکتر باشد")
    .optional(),
  status: z.string({ message: "وضعیت الزامی است" }),
  text: z.string().min(1, "توضیحات الزامی است"),
  text_en: z.string().optional(),
});

type TenderFormData = z.infer<typeof tenderSchema>;

export function CreateTender() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    register,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm<TenderFormData>({
    resolver: zodResolver(tenderSchema),
    defaultValues: {
      title: "",
      title_en: "",
      tender_category_id: undefined,
      number: "",
      start_date: "",
      end_date: "",
      department: "",
      department_en: "",
      phone: "",
      email: "",
      doc_opening_date: "",
      doc_submission_deadline: "",
      doc_submission_location: "",
      doc_submission_location_en: "",
      status: "",
      text: "",
      text_en: "",
    },
  });

  // Tender file handling
  const [tenderFile, setTenderFile] = React.useState<File | null>(null);

  // Create tender mutation
  const { mutate: createTenderMutation, isPending: isSaving } = createTender();

  // Get tender categories
  const { data: categories, isLoading: categoriesLoading } =
    getTenderCategories();

  // Handle file change
  const onChangeFile = (file?: File) => {
    if (tenderFile && (tenderFile as any).__tmpUrl) {
      URL.revokeObjectURL((tenderFile as any).__tmpUrl);
    }

    if (file) {
      const tmpUrl = URL.createObjectURL(file);
      (file as any).__tmpUrl = tmpUrl;
      setTenderFile(file);
    } else {
      setTenderFile(null);
    }
  };

  const onSubmit = async (formData: TenderFormData) => {
    try {
      const fd = new FormData();

      // Append text fields
      Object.entries(formData)?.forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          fd.append(key, String(value));
        }
      });

      // Tender file
      if (tenderFile) {
        fd.append("tender_file", tenderFile);
      }

      createTenderMutation(
        { formData: fd },
        {
          onSuccess: () => {
            toast.success("مناقصه با موفقیت ایجاد شد");
            setTimeout(() => {
              router.push("/tenders");
            }, 1500);
          },
          onError: (error) => {
            console.error("Creation failed:", error);
            toast.error("خطا در ایجاد مناقصه. لطفا دوباره تلاش کنید.");
          },
        }
      );
    } catch (e: any) {
      toast.error("خطا در ایجاد مناقصه");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container max-w-4xl mx-auto py-10" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">ایجاد فراخوان جدید</h1>
          <Button
            variant="outline"
            className="cursor-pointer bg-transparent"
            onClick={() => router.push("/tenders")}
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            بازگشت به لیست
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>ایجاد فراخوان</CardTitle>
              <CardDescription>
                اطلاعات فراخوان جدید را وارد کنید
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="mb-2">
                    عنوان *
                  </Label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="title"
                        className={errors.title ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="title_en" className="mb-2">
                    عنوان (EN)
                  </Label>
                  <Controller
                    name="title_en"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id="title_en" dir="ltr" />
                    )}
                  />
                  {errors.title_en && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.title_en.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="number" className="mb-2">
                    شماره مناقصه *
                  </Label>
                  <Controller
                    name="number"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="number"
                        className={errors.number ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.number && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.number.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category" className="required mb-1">
                    دسته‌بندی *
                  </Label>
                  <select
                    id="category"
                    {...register("tender_category_id", { valueAsNumber: true })}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                    disabled={categoriesLoading}
                  >
                    <option value="">
                      {categoriesLoading
                        ? "در حال بارگذاری..."
                        : "انتخاب دسته‌بندی"}
                    </option>
                    {categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                  {errors.tender_category_id && (
                    <p className="text-sm text-red-500">
                      {errors.tender_category_id.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="start_date" className="mb-2">
                    تاریخ شروع *
                  </Label>
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
                  {errors.start_date && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.start_date.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="end_date" className="mb-2">
                    تاریخ پایان *
                  </Label>
                  <Controller
                    name="end_date"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="end_date"
                        placeholder="YYYY-MM-DD"
                        className={errors.end_date ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.end_date && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.end_date.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="department" className="mb-2">
                    دپارتمان *
                  </Label>
                  <Controller
                    name="department"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="department"
                        className={errors.department ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.department && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.department.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="department_en" className="mb-2">
                    دپارتمان (EN)
                  </Label>
                  <Controller
                    name="department_en"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} id="department_en" dir="ltr" />
                    )}
                  />
                  {errors.department_en && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.department_en.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone" className="mb-2">
                    تلفن *
                  </Label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="phone"
                        className={errors.phone ? "border-red-500" : ""}
                        dir="ltr"
                      />
                    )}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" className="mb-2">
                    ایمیل *
                  </Label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="email"
                        className={errors.email ? "border-red-500" : ""}
                        dir="ltr"
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="doc_opening_date" className="mb-2">
                    تاریخ بازگشایی اسناد *
                  </Label>
                  <Controller
                    name="doc_opening_date"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="doc_opening_date"
                        placeholder="YYYY-MM-DD"
                        className={
                          errors.doc_opening_date ? "border-red-500" : ""
                        }
                      />
                    )}
                  />
                  {errors.doc_opening_date && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.doc_opening_date.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="doc_submission_deadline" className="mb-2">
                    مهلت ارسال اسناد *
                  </Label>
                  <Controller
                    name="doc_submission_deadline"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="doc_submission_deadline"
                        placeholder="YYYY-MM-DD"
                        className={
                          errors.doc_submission_deadline ? "border-red-500" : ""
                        }
                      />
                    )}
                  />
                  {errors.doc_submission_deadline && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.doc_submission_deadline.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="doc_submission_location" className="mb-2">
                    محل ارسال اسناد *
                  </Label>
                  <Controller
                    name="doc_submission_location"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="doc_submission_location"
                        className={
                          errors.doc_submission_location ? "border-red-500" : ""
                        }
                      />
                    )}
                  />
                  {errors.doc_submission_location && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.doc_submission_location.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="doc_submission_location_en" className="mb-2">
                    محل ارسال اسناد (EN)
                  </Label>
                  <Controller
                    name="doc_submission_location_en"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="doc_submission_location_en"
                        dir="ltr"
                      />
                    )}
                  />
                  {errors.doc_submission_location_en && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.doc_submission_location_en.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status" className="required mb-1">
                    وضعیت *
                  </Label>
                  <select
                    id="status"
                    {...register("status")}
                    onChange={(e) => setValue("status", e.target.value)}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  >
                    <option value="">انتخاب وضعیت</option>
                    <option value="active">فعال</option>
                    <option value="inactive">غیرفعال</option>
                    <option value="renewal">تمدید</option>
                    <option value="cancelled">لغو</option>
                  </select>
                  {errors.status && (
                    <p className="text-sm text-red-500">
                      {errors.status.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="text" className="mb-2">
                    توضیحات *
                  </Label>
                  <Controller
                    name="text"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        id="text"
                        className={`min-h-[120px] ${
                          errors.text ? "border-red-500" : ""
                        }`}
                      />
                    )}
                  />
                  {errors.text && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.text.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="text_en" className="mb-2">
                    توضیحات (EN)
                  </Label>
                  <Controller
                    name="text_en"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        id="text_en"
                        className="min-h-[120px]"
                        dir="ltr"
                      />
                    )}
                  />
                  {errors.text_en && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.text_en.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Tender File */}
              <div className="space-y-2">
                <Label>فایل فراخوان</Label>
                <div className="flex flex-col gap-3">
                  {/* New file upload */}
                  {!tenderFile && (
                    <label className="flex flex-col items-center justify-center w-full max-w-md h-28 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/70">
                      <div className="flex flex-col items-center">
                        <Upload className="w-6 h-6 mb-2 opacity-70" />
                        <span className="text-sm">
                          آپلود فایل (PDF, JPG, JPEG, PNG, BMP, DOC, DOCX, ZIP)
                        </span>
                      </div>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.bmp,.doc,.docx,.zip"
                        className="hidden"
                        onChange={(e) => onChangeFile(e.target.files?.[0])}
                      />
                    </label>
                  )}

                  {/* New file preview */}
                  {tenderFile && (
                    <div className="relative w-full max-w-md">
                      <span className="text-sm">{tenderFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 left-[40%]"
                        onClick={() => onChangeFile(undefined)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        حذف انتخاب
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/tenders")}
                className="cursor-pointer"
              >
                انصراف
              </Button>
              <Button
                type="submit"
                disabled={isSaving || !isValid}
                className="cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    در حال ایجاد...
                  </>
                ) : (
                  "ایجاد فراخوان"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </>
  );
}
