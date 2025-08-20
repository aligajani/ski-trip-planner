import { DesktopSidebar } from "@/components/desktop-sidebar";
import { ProtectedHeader } from "@/components/protected-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Content */}
      <div className="lg:pl-64 flex-1 flex flex-col">
        {/* Header */}
        <ProtectedHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
