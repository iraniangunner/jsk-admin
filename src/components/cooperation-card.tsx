"use client";
// import { useState } from "react";
// import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Briefcase,
  Calendar,
  Download,
  GraduationCap,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  Star,
} from "lucide-react";
import Link from "next/link";

export function CooperationCard({ cooperation }: { cooperation: any }) {
  // Get initials for avatar
  const getInitials = (name: any) => {
    return name
      .split(" ")
      .map((part: any) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Format date
  //   const formattedDate = formatDistanceToNow(new Date(resume.date), {
  //     addSuffix: true,
  //   });

  return (
    <>
      <Card className="group overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="p-4 pb-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
                <AvatarFallback>
                  {getInitials(cooperation.company_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">
                  {cooperation.company_name}
                </CardTitle>
                {/* <CardDescription className="line-clamp-1">
                  {resume.position}
                </CardDescription> */}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span className="truncate">{cooperation.phone}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{cooperation.address}</span>
            </div>

            {/* {cooperation.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{cooperation.phone}</span>
              </div>
            )} */}
            {/* {cooperation.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{cooperation.location}</span>
              </div>
            )} */}
            {/* <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Applied {formattedDate}</span>
            </div> */}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-4 pt-0">
          <Button variant="outline" size="sm">
            <Link className="w-full h-full" href={`/cooperations/${cooperation.id}`}>
              مشاهده جزئیات
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
