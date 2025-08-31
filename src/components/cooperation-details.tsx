"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ChevronRight,
  Download,
  Loader2,
  Phone,
  Printer,
  Smartphone,
  Mail
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { useParams } from "next/navigation";
import { getCooperationById } from "@/hooks/use-cooperation";

// Format date to a more readable format
function formatDate(dateString: any) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function CooperationDetails() {
  const params = useParams();
  const id = (params?.id as string) || "1";

  const { data, isLoading, isError } = getCooperationById(id);

  const handleDownload = () => {
    window.open(data?.data?.full_path, "_blank");
  };

  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({ contentRef });

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
        <p className="mb-6">"پیام مورد نظر یافت نشد.</p>
        <Button>
          <ArrowLeft className="ml-2 h-4 w-4" />
          بازگشت به لیست پیام ها
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 rtl">
      <div className="mb-4 print:hidden">
        <Button onClick={() => handlePrint()} className="gap-2 cursor-pointer">
          <Printer className="h-4 w-4" />
          چاپ
        </Button>
      </div>
      <Card ref={contentRef}>
        <CardHeader className="pb-2">
          <div className="mb-6 bg-gray-200 rounded-sm">
            <Link
              href="/cooperations"
              className="flex items-center p-2 text-sm"
            >
              <ChevronRight className="flex justify-center items-center" />
              <span>بازگشت به همکاری شرکت ها</span>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">
                {data?.data?.company_name}
              </CardTitle>
            </div>
            {data?.data?.file !== null && (
              <Button
                onClick={handleDownload}
                className="sm:self-start cursor-pointer"
              >
                <Download className="mr-2 h-4 w-4" />
                دانلود رزومه
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <h3 className="text-lg font-semibold">اطلاعات تماس</h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">تلفن ثابت :</span>
              <span>{data?.data?.phone}</span>
            </div>
            {data?.data?.mobile && (
              <div className="flex items-center gap-2 text-sm">
                <Smartphone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">موبایل :</span>
                <span>{data?.data?.mobile}</span>
              </div>
            )}
             {data?.data?.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">ایمیل :</span>
                <span>{data?.data?.email}</span>
              </div>
            )}
          </div>
          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">نوع همکاری</h3>
            <div className="rounded-lg border p-4 whitespace-pre-line">
              {data?.data?.type_cooperation?.join(" - ")}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">آدرس</h3>
            <div className="rounded-lg border p-4 whitespace-pre-line">
              {data?.data?.address}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">توضیحات</h3>
            <div className="rounded-lg border p-4 whitespace-pre-line">
              {data?.data?.text}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              <span>تاریخ ارسال: </span>
              <span>{formatDate(data?.data?.created_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
