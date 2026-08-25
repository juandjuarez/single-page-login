import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";

import { PlaceholderSection } from "@/components/dashboard/placeholder-section";

export const metadata: Metadata = {
  title: "Calendario de contenido | Content Hub",
};

export default function CalendarPage() {
  return (
    <PlaceholderSection
      icon={CalendarDays}
      title="Calendario de contenido"
      description="Planifica y programa publicaciones en todas tus plataformas."
      plannedFeatures={[
        {
          title: "Vista mensual",
          description:
            "Todas las publicaciones programadas organizadas por fecha.",
        },
        {
          title: "Arrastrar y soltar",
          description: "Reprograma contenido moviendo tarjetas entre días.",
        },
        {
          title: "Estados de publicación",
          description: "Borrador, en revisión, programado y publicado.",
        },
        {
          title: "Recordatorios de equipo",
          description:
            "Notificaciones automáticas antes de cada fecha límite.",
        },
      ]}
    />
  );
}
