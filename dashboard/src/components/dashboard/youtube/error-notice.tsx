import { AlertTriangle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function YouTubeErrorNotice({ message }: { message: string }) {
  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-destructive" />
          <CardTitle>No se pudo cargar el canal</CardTitle>
        </div>
        <CardDescription>
          La YouTube Data API respondió con un error. Revisa tu{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">
            YOUTUBE_API_KEY
          </code>{" "}
          y{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">
            YOUTUBE_CHANNEL_ID
          </code>{" "}
          en <code className="rounded bg-muted px-1 py-0.5 text-foreground">.env.local</code>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="rounded-md border bg-muted/50 p-3 text-sm text-foreground">
          {message}
        </p>
      </CardContent>
    </Card>
  );
}
