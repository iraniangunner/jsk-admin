"use client";
import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { createSlide } from "@/hooks/use-carousel";

export default function CreateCarousel() {
  const router = useRouter();
  // Form state
  const [text, setText] = useState("");
  const [textEn, setTextEn] = useState("");
  const [linkAttachment, setLinkAttachment] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Update mutation
  const { mutate: createSlideMutation, isPending: isSaving } = createSlide();

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

    if (!text || !textEn || !imageFile) {
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

      // Add image file if a new one was selected
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Call the update mutation with FormData
      createSlideMutation(
        { formData },
        {
          onSuccess: () => {
            toast.success("اسلاید با موفقیت ایجاد شد");
            // Navigate back to slides list after successful update
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
            className="cursor-pointer"
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
                      در این قسمت تصویر را آپلود کنید
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
          <CardFooter className="flex justify-center">
            <Button
              onClick={handleSubmit}
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
