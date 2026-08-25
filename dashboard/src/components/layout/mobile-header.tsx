"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/sidebar-nav";

/** Top bar + slide-over nav shown below the md breakpoint. */
export function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Abrir menú">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 p-0 [&>button]:text-sidebar-foreground"
        >
          <SheetTitle className="sr-only">Navegación</SheetTitle>
          <SheetDescription className="sr-only">
            Menú de navegación del panel de control
          </SheetDescription>
          <SidebarNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <span className="text-sm font-semibold">Content Hub</span>
    </header>
  );
}
