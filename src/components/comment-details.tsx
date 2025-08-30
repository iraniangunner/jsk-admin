"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, User, ChevronRight, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getCommentById } from "@/hooks/use-comment";

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

export function CommentDetails() {
  const params = useParams();
  const id = (params?.id as string) || "1";

  const { data, isLoading, isError } = getCommentById(id);

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
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="mb-6 bg-gray-200 rounded-sm">
            <Link href="/comments" className="flex items-center p-2 text-sm">
              <ChevronRight className="flex justify-center items-center" />
              <span>بازگشت به پیام های ارسالی</span>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              {data?.name && (
                <CardTitle className="text-2xl">{data.name}</CardTitle>
              )}

              <CardDescription className="mt-1 text-base">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {data?.email}
                </div>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {data?.website && (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">آدرس وبسایت:</span>
                <span>{data.website}</span>
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">توضیحات</h3>
            <div className="rounded-lg border p-4 whitespace-pre-line">
              {data?.text}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              <span>تاریخ ارسال: </span>
              <span>{formatDate(data?.created_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
