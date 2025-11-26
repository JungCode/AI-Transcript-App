import type { FlashList, FlashListRef } from '@shopify/flash-list';
import { useEffect, useRef, useState } from 'react';
import type { TranscriptSegment } from '../constants/transcript';

interface IUseFlashListScrollParams {
  transcriptSegments: TranscriptSegment[];
  currentTime: number;
  scrollCallback?: (
    listRef: React.RefObject<FlashListRef<TranscriptSegment> | null>,
    index: number,
  ) => Promise<void> | void;
}

const useFlashListScroll = ({
  transcriptSegments,
  currentTime,
  scrollCallback,
}: IUseFlashListScrollParams) => {
  const listRef =
    useRef<React.ComponentRef<typeof FlashList<TranscriptSegment>>>(null);
  const [activedSegmentIndex, setActivedSegmentIndex] = useState(0);

  // Update active segment index based on current time
  useEffect(() => {
    if (!transcriptSegments.length) return;

    const index = transcriptSegments.findIndex(
      segment => currentTime >= segment.start && currentTime <= segment.end,
    );

    if (index !== -1 && index !== activedSegmentIndex) {
      setActivedSegmentIndex(index);
    }
  }, [currentTime, transcriptSegments]);

  // Scroll to active segment
  useEffect(() => {
    if (activedSegmentIndex != null) {
      const run = async () => {
        await scrollCallback?.(listRef, activedSegmentIndex);
      };
      void run();
    }
  }, [activedSegmentIndex]);

  return { listRef };
};

export { useFlashListScroll };
