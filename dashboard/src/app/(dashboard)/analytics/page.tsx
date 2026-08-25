import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";

import { PlaceholderSection } from "@/components/dashboard/placeholder-section";

export const metadata: Metadata = {
  title: "Análisis | Content Hub",
};

export default function AnalyticsPage() {
  return (
    <PlaceholderSection
      icon={BarChart3}
      title="Análisis"
      description="Métricas de rendimiento y tendencias de contenido en todas las plataformas."
      plannedFeatures={[
        {
          title: "Panel de crecimiento",
          description:
            "Evolución de audiencia, suscriptores e impresiones a lo largo del tiempo.",
        },
        {
          title: "Rendimiento por contenido",
          description:
            "Compara qué formatos y temas generan mejores resultados.",
        },
        {
          title: "Reportes exportables",
          description: "Genera reportes en PDF o CSV para el equipo.",
        },
        {
          title: "Alertas de tendencias",
          description:
            "Notificaciones cuando una métrica se desvía de lo esperado.",
        },
      ]}
    />
  );
}
