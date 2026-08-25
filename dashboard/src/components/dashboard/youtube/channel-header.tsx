import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ChannelSummary } from "@/lib/youtube";

export function ChannelHeader({ channel }: { channel: ChannelSummary }) {
  return (
    <Card className="overflow-hidden py-0">
      {channel.bannerUrl && (
        <div className="relative h-28 w-full sm:h-40">
          <Image
            src={channel.bannerUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      <CardContent
        className={cn(
          "flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-end",
          channel.bannerUrl && "-mt-10 sm:-mt-12"
        )}
      >
        <div className="relative size-20 shrink-0 overflow-hidden rounded-full bg-muted ring-4 ring-card sm:size-24">
          {channel.thumbnailUrl ? (
            <Image
              src={channel.thumbnailUrl}
              alt={channel.title}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-lg font-semibold text-muted-foreground">
              {channel.title.slice(0, 1)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-semibold">{channel.title}</h2>
          {channel.customUrl && (
            <p className="text-sm text-muted-foreground">{channel.customUrl}</p>
          )}
          {channel.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {channel.description}
            </p>
          )}
        </div>

        <Badge variant="secondary" className="w-fit shrink-0">
          Datos públicos
        </Badge>
      </CardContent>
    </Card>
  );
}
