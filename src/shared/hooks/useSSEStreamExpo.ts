import { useEffect, useRef, useState } from 'react';
import EventSource from 'react-native-sse';

interface SSEStreamOptions<T> {
  onMessage?: (data: T) => void;
  onError?: (err: Error) => void;
  onOpen?: () => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

export function useSSEStreamExpo<T>(
  path: string | null,
  options?: SSEStreamOptions<T>,
) {
  const {
    onMessage,
    onError,
    onOpen,
    autoReconnect = true,
    reconnectInterval = 3000,
  } = options ?? {};

  const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';
  const url = path ? `${BASE_URL}${path}` : null;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const eventSourceRef = useRef<EventSource | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = () => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;

    if (retryRef.current) {
      clearTimeout(retryRef.current);
      retryRef.current = null;
    }

    setIsConnected(false);
  };

  const connect = () => {
    if (!url) return;

    stop();

    const es = new EventSource(url, {
      headers: {
        Accept: 'text/event-stream',
      },
    });

    eventSourceRef.current = es;

    es.addEventListener('open', () => {
      setIsConnected(true);
      onOpen?.();
    });

    es.addEventListener('message', event => {
      const raw = event.data;

      if (!raw) return;

      try {
        const parsed = JSON.parse(raw) as T;
        setData(parsed);
        onMessage?.(parsed);
      } catch {
        setData(raw as T);
        onMessage?.(raw as T);
      }
    });

    es.addEventListener('error', err => {
      const error =
        err instanceof Error ? err : new Error('SSE connection error');
      setError(error);
      onError?.(error);
      setIsConnected(false);

      es.close();

      if (autoReconnect) {
        retryRef.current = setTimeout(connect, reconnectInterval);
      }
    });
  };

  useEffect(() => {
    connect();
    return () => stop();
  }, [url, autoReconnect, reconnectInterval]);

  return { data, error, isConnected, stop, reconnect: connect };
}
