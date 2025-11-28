import { getSecureItem } from '@/shared/utlis/storage';
import { useEffect, useRef, useState } from 'react';
import EventSource from 'react-native-sse';

interface TranscriptStreamData {
  progress: number;
  status: string | null;
  done: boolean;
}

interface SSEMessageEvent {
  data: string | null;
  type?: string;
}

export function useTranscriptStream(transcriptId: number, enabled: boolean) {
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';
  const [token, setToken] = useState<string | null>(null);

  const [data, setData] = useState<TranscriptStreamData>({
    progress: 0,
    status: null,
    done: false,
  });

  const sourceRef = useRef<EventSource | null>(null);

  // 1. Load token
  useEffect(() => {
    void (async () => {
      const saved = await getSecureItem('access_token');
      setToken(saved ?? null);
    })();
  }, []);

  // 2. Init SSE
  useEffect(() => {
    if (!enabled || !token || !transcriptId) return;

    if (sourceRef.current) {
      sourceRef.current.close();
      sourceRef.current = null;
    }

    const url = `${BASE_URL}/ai-translator/transcript/stream/${transcriptId}`;

    const source = new EventSource(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
      // DO NOT override line endings unless needed
      debug: true,
    });

    sourceRef.current = source;

    source.addEventListener('message', (event: SSEMessageEvent) => {
      if (!event?.data) return;

      let parsed: {
        progress?: number;
        status?: string;
        done?: boolean;
      } | null = null;
      try {
        parsed = JSON.parse(event.data) as {
          progress?: number;
          status?: string;
          done?: boolean;
        };
      } catch {
        console.warn('⚠️ Non-JSON SSE message ignored:', event.data);
        return;
      }

      if (!parsed) return;

      console.log('📩 SSE MESSAGE:', parsed);

      if (parsed.done) {
        setData(prev => ({
          ...prev,
          status: parsed.status ?? null,
          done: true,
        }));
        source.close();
        return;
      }

      if (parsed.progress !== undefined) {
        setData({
          progress: parsed.progress,
          status: parsed.status ?? null,
          done: false,
        });
      }
    });

    source.addEventListener('error', event => {
      console.error('❌ SSE error:', event);
      source.close();
    });

    return () => {
      source.close();
    };
  }, [token, enabled, transcriptId]);

  return data;
}
