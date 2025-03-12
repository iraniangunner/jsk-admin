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
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

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

export function ResumeDetails({ resume }: { resume: any }) {
  // Handle file download
  const handleDownload = () => {
    window.open(resume.full_path, "_blank");
  };

  const submissionDate = formatDate(resume.created_at);

  // Calculate time since submission
  //   const timeSinceSubmission = formatDistanceToNow(new Date(resume.created_at), {
  //     addSuffix: true,
  //   });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="mb-6 bg-gray-200 rounded-sm">
            <Link
              href="/resumes"
              className="flex items-center p-2 text-sm"
            >
              <ChevronRight className="flex justify-center items-center" />
              <span>بازگشت به رزومه ها</span>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{resume.name}</CardTitle>
              <CardDescription className="mt-1 text-base">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {resume.email}
                </div>
              </CardDescription>
            </div>
            <Button
              onClick={handleDownload}
              className="sm:self-start cursor-pointer"
            >
              <Download className="mr-2 h-4 w-4" />
              دانلود رزومه
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <h3 className="text-lg font-semibold">اطلاعات فردی</h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">جنسیت:</span>
              <span>{resume.gender}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">تاریخ تولد:</span>
              <span>{resume.birthday}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">وضعیت تاهل:</span>
              <span>{resume.marital}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">وضعیت نظام وظیفه:</span>
              <span>{resume.military}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">سابقه کار:</span>
              <span>{resume.experience}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">اطلاعات تحصیلی</h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">مدرک تحصیلی:</span>
                <span>{resume.degree}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">دانشگاه:</span>
                <span>{resume.university}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">رشته تحصیلی:</span>
                <span>{resume.major}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">توضیحات</h3>
            <div className="rounded-lg border p-4 whitespace-pre-line">
              {resume.text}
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
