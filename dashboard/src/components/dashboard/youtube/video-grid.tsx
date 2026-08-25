import Image from "next/image";
import Link from "next/link";
import { Eye, MessageCircle, ThumbsUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatCompactNumber, formatDate } from "@/lib/format";
import type { VideoSummary } from "@/lib/youtube";

export function VideoGrid({ videos }: { videos: VideoSummary[] }) {
  if (videos.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Este canal todavía no tiene videos publicados.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {videos.map((video) => (
        <Link
          key={video.id}
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noreferrer noopener"
          className="group block"
        >
          <Card className="h-full overflow-hidden py-0 transition-colors group-hover:border-primary/50">
            <div className="relative aspect-video w-full bg-muted">
              {video.thumbnailUrl && (
                <Image
                  src={video.thumbnailUrl}
                  alt={video.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              )}
            </div>
            <CardContent className="space-y-2 px-4 py-4">
              <p className="line-clamp-2 text-sm leading-snug font-medium">
                {video.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(video.publishedAt)}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="size-3.5" />
                  {formatCompactNumber(video.viewCount)}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="size-3.5" />
                  {formatCompactNumber(video.likeCount)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="size-3.5" />
                  {formatCompactNumber(video.commentCount)}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
