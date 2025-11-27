import type { EpisodeRecentRead } from '@/shared/api/podcastSchemas';

/**
 * Sort episodes by updated_at → created_at (newest → oldest)
 */
export const sortEpisodes = (episodes: EpisodeRecentRead[]) => {
  return [...episodes].sort((a, b) => {
    const tA = new Date(a.updated_at ?? a.created_at ?? 0).getTime();
    const tB = new Date(b.updated_at ?? b.created_at ?? 0).getTime();
    return tB - tA;
  });
};
