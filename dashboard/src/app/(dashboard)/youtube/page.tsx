import type { Metadata } from "next";
import { SquarePlay } from "lucide-react";

import { PlaceholderSection } from "@/components/dashboard/placeholder-section";

export const metadata: Metadata = {
  title: "Canal de YouTube | Content Hub",
};

export default function YouTubePage() {
  return (
    <PlaceholderSection
      icon={SquarePlay}
      title="Administrador de canal de YouTube"
      description="Gestiona videos, playlists y el rendimiento de tu canal desde un solo lugar."
      plannedFeatures={[
        {
          title: "Biblioteca de videos",
          description:
            "Lista y estado de publicación de todos los videos del canal.",
        },
        {
          title: "Métricas por video",
          description:
            "Vistas, retención y engagement por cada pieza de contenido.",
        },
        {
          title: "Gestión de playlists",
          description: "Organiza y programa el orden de tus playlists.",
        },
        {
          title: "Comentarios y comunidad",
          description:
            "Modera y responde comentarios directamente desde el panel.",
        },
      ]}
    />
  );
}
