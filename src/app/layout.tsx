import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import localFont from "next/font/local";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const yekanbakh = localFont({
  src: [
    {
      path: "../../public/fonts/yekanbakh/YekanBakhFaNum-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/yekanbakh/YekanBakhFaNum-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/yekanbakh/YekanBakhFaNum-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/yekanbakh/YekanBakhFaNum-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/yekanbakh/YekanBakhFaNum-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/yekanbakh/YekanBakhFaNum-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-yekanbakh",
});

export const metadata: Metadata = {
  title: "پنل ادمین ژیوار صنعت کیان",
  description: "پنل ادمین ژیوار صنعت کیان",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${yekanbakh.variable}`}>
      <body className={`antialiased min-h-screen`}>
       {children}
      </body>
    </html>
  );
}
