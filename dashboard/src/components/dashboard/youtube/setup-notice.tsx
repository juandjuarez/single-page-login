import { KeyRound } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const codeClass = "rounded bg-muted px-1 py-0.5 text-foreground";
const linkClass = "font-medium text-primary underline underline-offset-2";

export function YouTubeSetupNotice() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <KeyRound className="size-4 text-muted-foreground" />
          <CardTitle>Conecta tu canal de YouTube</CardTitle>
        </div>
        <CardDescription>
          Esta sección se conecta a la YouTube Data API v3 con una API key —
          no necesitas iniciar sesión con tu cuenta de Google. Solo se leen
          datos públicos de tu canal: suscriptores, vistas y videos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Habilita la <strong>YouTube Data API v3</strong> en{" "}
            <a
              className={linkClass}
              href="https://console.cloud.google.com/apis/library/youtube.googleapis.com"
              target="_blank"
              rel="noreferrer"
            >
              Google Cloud Console
            </a>
            .
          </li>
          <li>
            En &quot;Credenciales&quot;, crea una <strong>API key</strong>.
          </li>
          <li>
            Copia el ID de tu canal desde{" "}
            <a
              className={linkClass}
              href="https://www.youtube.com/account_advanced"
              target="_blank"
              rel="noreferrer"
            >
              YouTube → Configuración → Canal → Configuración avanzada
            </a>
            .
          </li>
          <li>
            Crea un archivo <code className={codeClass}>.env.local</code>{" "}
            dentro de <code className={codeClass}>dashboard/</code> con:
          </li>
        </ol>
        <pre className="overflow-x-auto rounded-md border bg-muted/50 p-3 text-xs text-foreground">
          {`YOUTUBE_API_KEY=tu_api_key\nYOUTUBE_CHANNEL_ID=tu_channel_id`}
        </pre>
        <p>
          Reinicia <code className={codeClass}>npm run dev</code> y esta
          página mostrará tus datos reales automáticamente.
        </p>
      </CardContent>
    </Card>
  );
}
