import type { Metadata } from "next";
import { Rss } from "lucide-react";

import { PlaceholderSection } from "@/components/dashboard/placeholder-section";

export const metadata: Metadata = {
  title: "Consolidador de noticias | Content Hub",
};

export default function NewsPage() {
  return (
    <PlaceholderSection
      icon={Rss}
      title="Consolidador de noticias"
      description="Reúne noticias e ideas relevantes del sector para inspirar contenido."
      plannedFeatures={[
        {
          title: "Fuentes RSS",
          description:
            "Agrega y organiza fuentes de noticias por tema o industria.",
        },
        {
          title: "Feed unificado",
          description:
            "Todas las noticias relevantes en un solo timeline filtrable.",
        },
        {
          title: "Guardado de ideas",
          description:
            "Marca artículos como inspiración para futuro contenido.",
        },
        {
          title: "Resúmenes automáticos",
          description:
            "Resumen breve de cada artículo para revisión rápida.",
        },
      ]}
    />
  );
}
