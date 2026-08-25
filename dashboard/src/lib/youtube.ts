import "server-only";

/**
 * Thin server-side client for the YouTube Data API v3. Public data only
 * (channel snippet/statistics + recent uploads) — no OAuth, just an API
 * key. See CLAUDE.md "YouTube integration" for setup and the reasoning
 * behind that scope.
 */

const API_BASE = "https://www.googleapis.com/youtube/v3";
const MAX_VIDEOS = 8;

// ---- Public types consumed by the UI ---------------------------------

export type ChannelSummary = {
  id: string;
  title: string;
  description: string;
  customUrl?: string;
  thumbnailUrl: string;
  bannerUrl?: string;
  /** null when the channel owner has hidden the subscriber count. */
  subscriberCount: number | null;
  viewCount: number;
  videoCount: number;
};

export type VideoSummary = {
  id: string;
  title: string;
  publishedAt: string;
  thumbnailUrl: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
};

export type YouTubeChannelData = {
  channel: ChannelSummary;
  videos: VideoSummary[];
};

export type YouTubeFetchResult =
  | { ok: true; data: YouTubeChannelData }
  | { ok: false; reason: "not-configured" }
  | { ok: false; reason: "api-error"; message: string };

// ---- Minimal shapes for the YouTube API responses we actually read ---

type YouTubeThumbnail = { url?: string };

type ChannelsListResponse = {
  items?: Array<{
    id: string;
    snippet?: {
      title?: string;
      description?: string;
      customUrl?: string;
      thumbnails?: {
        high?: YouTubeThumbnail;
        medium?: YouTubeThumbnail;
        default?: YouTubeThumbnail;
      };
    };
    statistics?: {
      subscriberCount?: string;
      viewCount?: string;
      videoCount?: string;
      hiddenSubscriberCount?: boolean;
    };
    brandingSettings?: {
      image?: { bannerExternalUrl?: string };
    };
    contentDetails?: {
      relatedPlaylists?: { uploads?: string };
    };
  }>;
};

type PlaylistItemsListResponse = {
  items?: Array<{
    contentDetails?: { videoId?: string };
    snippet?: {
      title?: string;
      publishedAt?: string;
      thumbnails?: {
        medium?: YouTubeThumbnail;
        default?: YouTubeThumbnail;
      };
    };
  }>;
};

type VideosListResponse = {
  items?: Array<{
    id: string;
    statistics?: {
      viewCount?: string;
      likeCount?: string;
      commentCount?: string;
    };
  }>;
};

type YouTubeErrorResponse = {
  error?: { message?: string };
};

// ---- Fetch helpers -----------------------------------------------------

function getConfig(): { apiKey: string; channelId: string } | null {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!apiKey || !channelId) return null;
  return { apiKey, channelId };
}

async function youtubeGet<T>(
  path: string,
  params: Record<string, string>,
  apiKey: string
): Promise<T> {
  const url = new URL(`${API_BASE}/${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  url.searchParams.set("key", apiKey);

  // Snapshot data only (see CLAUDE.md) — cache for an hour so navigating
  // the dashboard doesn't burn API quota on every render.
  const res = await fetch(url, { next: { revalidate: 3600 } });
  const json = (await res.json()) as T & YouTubeErrorResponse;

  if (!res.ok) {
    throw new Error(json?.error?.message ?? `YouTube API respondió ${res.status}`);
  }

  return json;
}

// ---- Public entry point -------------------------------------------------

export async function getYouTubeChannelData(): Promise<YouTubeFetchResult> {
  const config = getConfig();
  if (!config) return { ok: false, reason: "not-configured" };

  const { apiKey, channelId } = config;

  try {
    const channelJson = await youtubeGet<ChannelsListResponse>(
      "channels",
      { part: "snippet,statistics,brandingSettings,contentDetails", id: channelId },
      apiKey
    );

    const channelItem = channelJson.items?.[0];
    if (!channelItem) {
      return {
        ok: false,
        reason: "api-error",
        message: `No se encontró ningún canal con el ID "${channelId}".`,
      };
    }

    const snippet = channelItem.snippet ?? {};
    const statistics = channelItem.statistics ?? {};

    const channel: ChannelSummary = {
      id: channelItem.id,
      title: snippet.title ?? "Canal de YouTube",
      description: snippet.description ?? "",
      customUrl: snippet.customUrl,
      thumbnailUrl:
        snippet.thumbnails?.high?.url ??
        snippet.thumbnails?.medium?.url ??
        snippet.thumbnails?.default?.url ??
        "",
      bannerUrl: channelItem.brandingSettings?.image?.bannerExternalUrl,
      subscriberCount: statistics.hiddenSubscriberCount
        ? null
        : Number(statistics.subscriberCount ?? 0),
      viewCount: Number(statistics.viewCount ?? 0),
      videoCount: Number(statistics.videoCount ?? 0),
    };

    const uploadsPlaylistId = channelItem.contentDetails?.relatedPlaylists?.uploads;
    const videos = uploadsPlaylistId
      ? await getRecentVideos(uploadsPlaylistId, apiKey)
      : [];

    return { ok: true, data: { channel, videos } };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Error desconocido al consultar la API de YouTube.";
    return { ok: false, reason: "api-error", message };
  }
}

async function getRecentVideos(
  uploadsPlaylistId: string,
  apiKey: string
): Promise<VideoSummary[]> {
  const playlistJson = await youtubeGet<PlaylistItemsListResponse>(
    "playlistItems",
    {
      part: "snippet,contentDetails",
      playlistId: uploadsPlaylistId,
      maxResults: String(MAX_VIDEOS),
    },
    apiKey
  );

  const items = playlistJson.items ?? [];
  const videoIds = items
    .map((item) => item.contentDetails?.videoId)
    .filter((id): id is string => Boolean(id));

  const statsById = new Map<
    string,
    { viewCount: number; likeCount: number; commentCount: number }
  >();

  if (videoIds.length > 0) {
    const videosJson = await youtubeGet<VideosListResponse>(
      "videos",
      { part: "statistics", id: videoIds.join(",") },
      apiKey
    );

    for (const item of videosJson.items ?? []) {
      statsById.set(item.id, {
        viewCount: Number(item.statistics?.viewCount ?? 0),
        likeCount: Number(item.statistics?.likeCount ?? 0),
        commentCount: Number(item.statistics?.commentCount ?? 0),
      });
    }
  }

  const videos: VideoSummary[] = [];
  for (const item of items) {
    const videoId = item.contentDetails?.videoId;
    if (!videoId) continue;
    const stats = statsById.get(videoId);
    videos.push({
      id: videoId,
      title: item.snippet?.title ?? "Video sin título",
      publishedAt: item.snippet?.publishedAt ?? "",
      thumbnailUrl:
        item.snippet?.thumbnails?.medium?.url ??
        item.snippet?.thumbnails?.default?.url ??
        "",
      viewCount: stats?.viewCount ?? 0,
      likeCount: stats?.likeCount ?? 0,
      commentCount: stats?.commentCount ?? 0,
    });
  }

  return videos.sort((a, b) => b.viewCount - a.viewCount);
}
