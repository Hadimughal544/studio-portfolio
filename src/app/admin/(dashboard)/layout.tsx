import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-elevated text-foreground lg:flex-row">
      <AdminSidebar />
      <div className="min-w-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}
