import { XMLParser } from "fast-xml-parser";
import { Episode } from "@/types";

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || "UCnFAxzMvp4ot-uElK_z1qSQ";
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

let cache: { episodes: Episode[]; timestamp: number } | null = null;

/**
 * Fetches and parses the YouTube RSS feed for the MetôCast channel.
 * Results are cached in memory for 10 minutes to reduce load.
 */
export async function getEpisodes(): Promise<Episode[]> {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.episodes;
  }

  try {
    const response = await fetch(RSS_URL, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`);
    }

    const xml = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });

    const feed = parser.parse(xml);
    const entries = feed.feed?.entry;

    if (!entries) {
      if (cache) return cache.episodes;
      return [];
    }

    const episodeList = Array.isArray(entries) ? entries : [entries];

    const episodes: Episode[] = episodeList.map((entry: Record<string, unknown>) => {
      const videoId = entry["yt:videoId"] as string;
      const mediaGroup = entry["media:group"] as Record<string, unknown> | undefined;

      return {
        videoId,
        title: entry.title as string,
        description: (mediaGroup?.["media:description"] as string) || "",
        publishedAt: entry.published as string,
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      };
    });

    cache = { episodes, timestamp: Date.now() };
    return episodes;
  } catch (error) {
    console.error("Error fetching YouTube RSS feed:", error);
    if (cache) return cache.episodes;
    return [];
  }
}

/**
 * Returns a single episode by video ID, or null if not found.
 */
export async function getEpisodeById(videoId: string): Promise<Episode | null> {
  const episodes = await getEpisodes();
  return episodes.find((ep) => ep.videoId === videoId) || null;
}

/**
 * Returns a paginated slice of episodes.
 */
export async function getEpisodesPaginated(
  page: number,
  perPage: number = 6
): Promise<{ episodes: Episode[]; totalPages: number; currentPage: number }> {
  const allEpisodes = await getEpisodes();
  const totalPages = Math.max(1, Math.ceil(allEpisodes.length / perPage));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const start = (safePage - 1) * perPage;
  const episodes = allEpisodes.slice(start, start + perPage);

  return { episodes, totalPages, currentPage: safePage };
}
