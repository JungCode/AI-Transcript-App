import type { EpisodeRecentRead } from '@/shared/api/podcastSchemas';
import { formatDateOnly } from '@/shared/helpers/format';

/**
 * Group episodes by formatted date (NO sorting here)
 */
export const groupEpisodesByDate = (episodes: EpisodeRecentRead[]) => {
  return episodes.reduce(
    (groups, ep) => {
      const key = formatDateOnly(ep.updated_at || ep.created_at || '');
      if (!groups[key]) groups[key] = [];
      groups[key].push(ep);
      return groups;
    },
    {} as Record<string, EpisodeRecentRead[]>,
  );
};
