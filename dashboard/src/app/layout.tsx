import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Content Hub",
    template: "%s",
  },
  description:
    "Panel de control para la gestión de contenido: YouTube, análisis, calendario, competencia y noticias.",
};

/**
 * Dark theme is applied globally and unconditionally (no toggle, no
 * next-themes) by hard-coding the `dark` class here. See CLAUDE.md
 * "Theming" for how to add a light/dark toggle later if ever needed.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
