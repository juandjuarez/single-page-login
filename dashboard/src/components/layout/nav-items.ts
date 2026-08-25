import {
  SquarePlay,
  BarChart3,
  CalendarDays,
  Radar,
  Rss,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

/**
 * Single source of truth for the sidebar navigation. Add a section here and
 * it appears in the sidebar automatically — see CLAUDE.md "Adding a new
 * section" for the full checklist.
 */
export const navItems: NavItem[] = [
  {
    title: "Canal de YouTube",
    href: "/youtube",
    icon: SquarePlay,
    description: "Administrador de canal de YouTube",
  },
  {
    title: "Análisis",
    href: "/analytics",
    icon: BarChart3,
    description: "Métricas y rendimiento de contenido",
  },
  {
    title: "Calendario",
    href: "/calendar",
    icon: CalendarDays,
    description: "Calendario de contenido",
  },
  {
    title: "Competencia",
    href: "/competitors",
    icon: Radar,
    description: "Seguimiento de la competencia",
  },
  {
    title: "Noticias",
    href: "/news",
    icon: Rss,
    description: "Consolidador de noticias",
  },
];
