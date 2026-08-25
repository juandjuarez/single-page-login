import { SidebarNav } from "@/components/layout/sidebar-nav";

/** Static sidebar shown on md+ viewports. Mobile uses MobileHeader's Sheet instead. */
export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:block">
      <div className="fixed h-svh w-64">
        <SidebarNav />
      </div>
    </aside>
  );
}
