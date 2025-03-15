import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="fa" dir="rtl">
      <body className={`antialiased min-h-screen`}>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full">
            <div className="flex items-center">
              <SidebarTrigger className="h-9 w-9" />
              {/* <p>منوی پنل</p> */}
            </div>

            <div className="w-full lg:w-[90%] mx-auto">{children}</div>
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
