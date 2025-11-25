export interface TranscriptWord {
  start: number;
  end: number;
  word: string;
}

export interface TranscriptSegment {
  id: number;
  start: number;
  end: number;
  text: string;
  words: TranscriptWord[];
}

export interface TranscriptContent {
  language: string;
  segments: TranscriptSegment[];
  text: string;
}

export interface TranscriptData {
  transcript: TranscriptContent;
}
