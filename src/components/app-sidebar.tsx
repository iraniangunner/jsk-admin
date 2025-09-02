"use client";

import { useEffect } from "react";
import {
  Home,
  Settings,
  Users,
  FileText,
  BarChart3,
  HelpCircle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import LogoutButton from "./logout-button";

interface SidebarItemType {
  title: string;
  icon: React.ElementType;
  href: string;
  isActive?: boolean;
}

const sidebarItems: SidebarItemType[] = [
  {
    title: "داشبورد",
    icon: Home,
    href: "/",
  },
  {
    title: "رزومه ها",
    icon: Users,
    href: "/resumes",
  },
  {
    title: "همکاری شرکت ها",
    icon: FileText,
    href: "/cooperations",
  },
  {
    title: "تماس با ما",
    icon: BarChart3,
    href: "/comments",
  },
  {
    title: "اسلایدر",
    icon: Settings,
    href: "/slides",
  },
  {
    title: "دسته بندی پروژه ها",
    icon: HelpCircle,
    href: "/project-categories",
  },
  {
    title: "پروژه ها",
    icon: HelpCircle,
    href: "/projects",
  },
  {
    title: "شهرهای متقاضی مشاغل",
    icon: HelpCircle,
    href: "/job-cities",
  },
  {
    title: "دسته بندی مشاغل",
    icon: HelpCircle,
    href: "/job-categories",
  },
  {
    title: "فرصت های شغلی",
    icon: HelpCircle,
    href: "/job-opportunities",
  },
  {
    title: "دسته بندی فراخوان ها",
    icon: HelpCircle,
    href: "/tender-categories",
  },
  {
    title: "فراخوان ها",
    icon: HelpCircle,
    href: "/tenders",
  },
  {
    title: "اخبار و مقالات",
    icon: HelpCircle,
    href: "/news",
  },
];

export function AppSidebar() {
  useEffect(() => {
    document.documentElement.dir = "rtl";
  }, []);

  return (
    <Sidebar
      side="right"
      collapsible="icon"
      className="border-l dark:border-l-slate-700"
    >
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            JSK
          </div>
          <span className="font-semibold">ژیوار صنعت کیان</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={item.title}
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <LogoutButton />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
