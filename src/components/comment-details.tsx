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

export function CommentDetails({ comment }: { comment: any }) {
  // Calculate time since submission
  //   const timeSinceSubmission = formatDistanceToNow(new Date(resume.created_at), {
  //     addSuffix: true,
  //   });
  const submissionDate = formatDate(comment.created_at);

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
              {comment.name && (
                <CardTitle className="text-2xl">{comment.name}</CardTitle>
              )}

              <CardDescription className="mt-1 text-base">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {comment.email}
                </div>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {comment.website && (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">آدرس وبسایت:</span>
                <span>{comment.website}</span>
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">توضیحات</h3>
            <div className="rounded-lg border p-4 whitespace-pre-line">
              {comment.text}
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
