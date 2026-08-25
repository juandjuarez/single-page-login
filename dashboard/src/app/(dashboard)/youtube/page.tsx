import type { Metadata } from "next";
import { Eye, SquarePlay, ThumbsUp, Users, Video } from "lucide-react";

import { BarChart } from "@/components/dataviz/bar-chart";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatTile } from "@/components/dashboard/stat-tile";
import { ChannelHeader } from "@/components/dashboard/youtube/channel-header";
import { YouTubeErrorNotice } from "@/components/dashboard/youtube/error-notice";
import { YouTubeSetupNotice } from "@/components/dashboard/youtube/setup-notice";
import { VideoGrid } from "@/components/dashboard/youtube/video-grid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCompactNumber, formatNumber } from "@/lib/format";
import { getYouTubeChannelData, type YouTubeChannelData } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "Canal de YouTube | Content Hub",
};

export default async function YouTubePage() {
  const result = await getYouTubeChannelData();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={SquarePlay}
        title="Administrador de canal de YouTube"
        description="Gestiona videos, playlists y el rendimiento de tu canal desde un solo lugar."
      />

      {result.ok ? (
        <ChannelOverview data={result.data} />
      ) : result.reason === "not-configured" ? (
        <YouTubeSetupNotice />
      ) : (
        <YouTubeErrorNotice message={result.message} />
      )}
    </div>
  );
}

function ChannelOverview({ data }: { data: YouTubeChannelData }) {
  const { channel, videos } = data;
  const topVideos = videos.slice(0, 6);
  const avgViews =
    videos.length > 0
      ? Math.round(
          videos.reduce((sum, video) => sum + video.viewCount, 0) /
            videos.length
        )
      : 0;

  return (
    <div className="flex flex-col gap-6">
      <ChannelHeader channel={channel} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={Users}
          label="Suscriptores"
          value={
            channel.subscriberCount === null
              ? "Oculto"
              : formatCompactNumber(channel.subscriberCount)
          }
        />
        <StatTile
          icon={Eye}
          label="Vistas totales"
          value={formatCompactNumber(channel.viewCount)}
        />
        <StatTile
          icon={Video}
          label="Videos"
          value={formatNumber(channel.videoCount)}
        />
        <StatTile
          icon={ThumbsUp}
          label="Promedio de vistas (recientes)"
          value={formatCompactNumber(avgViews)}
        />
      </div>

      {topVideos.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Vistas por video</CardTitle>
              <CardDescription>
                Videos más recientes, ordenados de mayor a menor.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                title="Vistas por video"
                categories={topVideos.map((video) => video.title)}
                series={[
                  {
                    key: "views",
                    label: "Vistas",
                    color: "#3987e5",
                    values: topVideos.map((video) => video.viewCount),
                  },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interacción por video</CardTitle>
              <CardDescription>
                Likes y comentarios de los mismos videos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                title="Interacción por video"
                categories={topVideos.map((video) => video.title)}
                series={[
                  {
                    key: "likes",
                    label: "Likes",
                    color: "#3987e5",
                    values: topVideos.map((video) => video.likeCount),
                  },
                  {
                    key: "comments",
                    label: "Comentarios",
                    color: "#d95926",
                    values: topVideos.map((video) => video.commentCount),
                  },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold">Videos recientes</h2>
        <VideoGrid videos={videos} />
      </div>
    </div>
  );
}
