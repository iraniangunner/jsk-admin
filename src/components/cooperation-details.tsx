"use client";
// import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Download, Phone, Smartphone } from "lucide-react";
import Link from "next/link";

// Format date to a more readable format
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function CooperationDetails({ cooperation }: { cooperation: any }) {
  // Handle file download
  const handleDownload = () => {
    window.open(cooperation.full_path, "_blank");
  };

  const submissionDate = formatDate(cooperation.created_at);

  // Calculate time since submission
  //   const timeSinceSubmission = formatDistanceToNow(new Date(resume.created_at), {
  //     addSuffix: true,
  //   });

  return (
    <div className="space-y-6 rtl">
      <Card>
        <CardHeader className="pb-2">
          <div className="mb-6 bg-gray-200 rounded-sm">
            <Link href="/cooperations" className="flex items-center p-2 text-sm">
              <ChevronRight className="flex justify-center items-center" />
              <span>بازگشت به همکاری شرکت ها</span>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">
                {cooperation.company_name}
              </CardTitle>
            </div>
            {cooperation.file !== null && (
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
              <span>{cooperation.phone}</span>
            </div>
            {cooperation.mobile && (
              <div className="flex items-center gap-2 text-sm">
                <Smartphone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">موبایل :</span>
                <span>{cooperation.mobile}</span>
              </div>
            )}
          </div>
          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">نوع همکاری</h3>
            <div className="rounded-lg border p-4 whitespace-pre-line">
              {cooperation.type_cooperation.join(" - ")}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">آدرس</h3>
            <div className="rounded-lg border p-4 whitespace-pre-line">
              {cooperation.address}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">توضیحات</h3>
            <div className="rounded-lg border p-4 whitespace-pre-line">
              {cooperation.text}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              <span>تاریخ ارسال: </span>
              <span>{submissionDate}</span>
            </div>
            {/* <div>{timeSinceSubmission}</div> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
