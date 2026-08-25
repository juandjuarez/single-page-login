import type { Metadata } from "next";
import { Radar } from "lucide-react";

import { PlaceholderSection } from "@/components/dashboard/placeholder-section";

export const metadata: Metadata = {
  title: "Seguimiento de la competencia | Content Hub",
};

export default function CompetitorsPage() {
  return (
    <PlaceholderSection
      icon={Radar}
      title="Seguimiento de la competencia"
      description="Monitorea canales y estrategias de contenido de la competencia."
      plannedFeatures={[
        {
          title: "Lista de competidores",
          description:
            "Canales rastreados con sus métricas clave en un vistazo.",
        },
        {
          title: "Comparativa de contenido",
          description:
            "Compara tu rendimiento contra el de la competencia.",
        },
        {
          title: "Detección de tendencias",
          description:
            "Identifica temas y formatos que están ganando tracción.",
        },
        {
          title: "Alertas de nuevos videos",
          description:
            "Notificaciones cuando un competidor publica contenido nuevo.",
        },
      ]}
    />
  );
}
