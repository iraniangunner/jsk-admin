"use client";

// import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Download,
  FileText,
  GraduationCap,
  Mail,
  User,
  Users,
  Shield,
  Building,
  Clock,
  Phone,
  MapPin,
  Handshake,
  Smartphone,
} from "lucide-react";

// Format date to Persian-friendly format
const formatDate = (dateString: any) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR");
  } catch (e) {
    return dateString;
  }
};

// Format submission date

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
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">
                {cooperation.company_name}
              </CardTitle>
              {/* <CardDescription className="mt-1 text-base">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {cooperation.phone}
                </div>
              </CardDescription> */}
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
