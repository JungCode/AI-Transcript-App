import type { FlashList, FlashListRef } from '@shopify/flash-list';
import { useEffect, useRef, useState } from 'react';
import type { TranscriptSegment } from '../../../constants/transcript';

type IHandleBeforeScrollFlashList = (
  index: number,
  id: number | undefined,
  segment: TranscriptSegment,
) => void;

type IHandleScrollFlashList = (
  listRef: React.RefObject<FlashListRef<TranscriptSegment> | null>,
  index: number,
) => Promise<void>;

interface IUseFlashListScrollParams {
  transcriptSegments: TranscriptSegment[];
  currentTime: number;
  beforeScrollCallback?: IHandleBeforeScrollFlashList;
  scrollCallback?: IHandleScrollFlashList;
}

const useFlashListScroll = ({
  transcriptSegments,
  currentTime,
  scrollCallback,
  beforeScrollCallback,
}: IUseFlashListScrollParams) => {
  const listRef =
    useRef<React.ComponentRef<typeof FlashList<TranscriptSegment>>>(null);
  const [activeSegmentIndex, setactiveSegmentIndex] = useState(0);
  const [activeSegment, setactiveSegment] = useState<TranscriptSegment>(
    transcriptSegments[0],
  );

  // Update active segment index based on current time
  useEffect(() => {
    if (!transcriptSegments.length) return;

    const index = transcriptSegments.findIndex(
      segment => currentTime >= segment.start && currentTime <= segment.end,
    );

    if (index !== -1 && index !== activeSegmentIndex) {
      setactiveSegmentIndex(index);
      setactiveSegment(transcriptSegments[index]);
    }
  }, [currentTime, transcriptSegments]);

  // Scroll to active segment
  useEffect(() => {
    beforeScrollCallback?.(
      activeSegmentIndex,
      activeSegment?.id,
      activeSegment,
    );

    const run = async () => {
      await scrollCallback?.(listRef, activeSegmentIndex);
    };
    void run();
  }, [activeSegmentIndex, activeSegment]);

  return { listRef };
};

export {
  useFlashListScroll,
  type IHandleBeforeScrollFlashList,
  type IHandleScrollFlashList,
};
