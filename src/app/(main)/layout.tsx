// app/dashboard/layout.tsx
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex items-center">
          <SidebarTrigger className="h-9 w-9" />
        </div>
        <div className="w-full lg:w-[90%] mx-auto">{children}</div>
      </main>
    </SidebarProvider>
  );
}
