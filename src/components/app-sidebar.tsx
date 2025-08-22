"use client";

import { useEffect } from "react";
import {
  Home,
  Settings,
  Users,
  FileText,
  BarChart3,
  HelpCircle,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import router, { useRouter } from "next/navigation";
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
  // {
  //   title: "مناقصات",
  //   icon: HelpCircle,
  //   href: "/tenders",
  // },
];

export function AppSidebar() {
  // Set the document direction to RTL
  useEffect(() => {
    document.documentElement.dir = "rtl";
  }, []);

  // const router = useRouter();

  // const handleLogout = async () => {
  //   try {
  //     const res = await fetch("/api/auth/logout", {
  //       method: "POST",
  //       credentials: "include", // کوکی JWT را می‌فرستد
  //     });
  //     const data = await res.json();
  //     // بعد از logout → ریدایرکت به صفحه login
  //     router.push("/login");
  //   } catch (err) {
  //     console.error("Logout failed:", err);
  //   }
  // };

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
          {/* <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={item.title}
                  >
                    {/* <a href={item.href} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a> */}
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
              {/* <button
                // href="/logout"
                onClick={handleLogout}
                className="flex items-center gap-2 text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span>خروج</span>
              </button> */}
              <LogoutButton />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
