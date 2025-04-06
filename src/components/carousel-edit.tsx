"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowLeft, ImageIcon } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { getSlideById, updateSlide } from "@/hooks/use-carousel";

export default function EditCarousel() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Form state
  const [text, setText] = useState("");
  const [textEn, setTextEn] = useState("");
  const [linkAttachment, setLinkAttachment] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch slide data
  const { data, isLoading, isError } = getSlideById(id);

  // Update mutation
  const { mutate: updateSlideMutation, isPending: isSaving } = updateSlide();

  // Set form values when data is loaded
  useEffect(() => {
    if (data) {
      setText(data.text || "");
      setTextEn(data.text_en || "");
      setLinkAttachment(data.link || "");
      setImagePreview(data.full_path || "");
    }
  }, [data]);

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text || !textEn) {
      toast.error("لطفا فیلدهای ضروری را پر کنید");
      return;
    }

    try {
      // Create FormData to send both text data and image file
      const formData = new FormData();

      // Add text fields to FormData
      formData.append("text", text);
      formData.append("text_en", textEn);
      formData.append("link", linkAttachment || "");
      formData.append("_method", "PUT");

      // Add image file if a new one was selected
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Call the update mutation with FormData
      updateSlideMutation(
        { id, formData },
        {
          onSuccess: () => {
            toast.success("اسلاید با موفقیت بروزرسانی شد");
            // Navigate back to slides list after successful update
            setTimeout(() => {
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
        <Button onClick={() => router.push("/slides")}>
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
            className="cursor-pointer"
            onClick={() => router.push("/slides")}
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="text" className="required mb-2">
                    متن فارسی
                  </Label>
                  <Textarea
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="متن فارسی اسلاید را وارد کنید"
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="text_en" className="required mb-2">
                    متن انگلیسی
                  </Label>
                  <Textarea
                    dir="ltr"
                    id="text_en"
                    value={textEn}
                    onChange={(e) => setTextEn(e.target.value)}
                    placeholder="Enter english text"
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <Separator className="my-2" />

                <div className="grid gap-2">
                  <Label htmlFor="image" className="mb-2">
                    تصویر
                  </Label>
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
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          document.getElementById("image")?.click()
                        }
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      برای تغییر تصویر، فایل جدید را انتخاب کنید. در غیر این
                      صورت، تصویر فعلی حفظ خواهد شد.
                    </p>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="linkAttachment" className="mb-2">
                    پیوست
                  </Label>
                  <Input
                    id="linkAttachment"
                    dir="ltr"
                    value={linkAttachment}
                    onChange={(e) => setLinkAttachment(e.target.value)}
                    placeholder="Enter the link"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => router.push("/slides")}
              disabled={isSaving}
            >
              انصراف
            </Button>
            <Button
              onClick={handleSubmit}
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
