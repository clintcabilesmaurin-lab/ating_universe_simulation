// Robust wrapper around the official YouTube IFrame Player API.
// Handles API script injection, player lifecycle, responsive aspect ratio,
// playback state changes, and error recovery.

import { useCallback, useEffect, useRef, useState } from "react";
import type { RefCallback } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiLoadPromise: Promise<void> | null = null;

function loadYouTubeIframeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise((resolve) => {
    const checkReady = () => {
      if (window.YT?.Player) {
        resolve();
        return true;
      }
      return false;
    };

    if (checkReady()) return;

    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve();
    };

    // If script is already in the document, poll for completion
    if (document.getElementById("youtube-iframe-api-script")) {
      const pollInterval = window.setInterval(() => {
        if (checkReady()) {
          window.clearInterval(pollInterval);
        }
      }, 100);
      return;
    }

    const script = document.createElement("script");
    script.id = "youtube-iframe-api-script";
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onload = () => {
      // In case onYouTubeIframeAPIReady fired before listener or wasn't called
      window.setTimeout(checkReady, 100);
    };
    document.head.appendChild(script);
  });

  return apiLoadPromise;
}

export type YouTubePlaybackStatus = "idle" | "cued" | "playing" | "paused" | "buffering" | "ended";

export function useYouTubePlayer() {
  const playerRef = useRef<any>(null);
  const volumeRef = useRef(80);
  const requestedVideoIdRef = useRef<string | null>(null);
  const isReadyRef = useRef(false);
  const onErrorRef = useRef<((errorCode: number) => void) | null>(null);
  const onEndedRef = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState<YouTubePlaybackStatus>("idle");
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [progress, setProgress] = useState({ currentSeconds: 0, durationSeconds: 0 });
  const [volume, setVolumeState] = useState(80);
  const [isReady, setIsReady] = useState(false);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  const mountRef: RefCallback<HTMLElement> = useCallback((node) => setMountNode(node), []);

  useEffect(() => {
    let cancelled = false;

    void loadYouTubeIframeApi().then(() => {
      if (cancelled || !window.YT?.Player || !mountNode) return;

      // Clean up previous instance if any
      try {
        playerRef.current?.destroy?.();
      } catch {}

      try {
        playerRef.current = new window.YT.Player(mountNode, {
          height: "100%",
          width: "100%",
          playerVars: {
            autoplay: 1,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            controls: 1,
            enablejsapi: 1,
            fs: 1,
            origin: typeof window !== "undefined" ? window.location.origin : undefined,
          },
          events: {
            onReady: (event: any) => {
              if (cancelled) return;
              isReadyRef.current = true;
              setIsReady(true);
              try {
                event.target.setVolume(volumeRef.current);
              } catch {}
              if (requestedVideoIdRef.current) {
                const videoId = requestedVideoIdRef.current;
                requestedVideoIdRef.current = null;
                setCurrentVideoId(videoId);
                try {
                  event.target.loadVideoById(videoId);
                  event.target.playVideo();
                } catch (e) {
                  console.warn("Autoplay deferred:", e);
                }
              }
            },
            onStateChange: (event: any) => {
              if (cancelled) return;
              const State = window.YT?.PlayerState;
              if (!State) return;
              if (event.data === State.PLAYING) setStatus("playing");
              else if (event.data === State.PAUSED) setStatus("paused");
              else if (event.data === State.BUFFERING) setStatus("buffering");
              else if (event.data === State.CUED) setStatus("cued");
              else if (event.data === State.ENDED) {
                setStatus("ended");
                onEndedRef.current?.();
              }
            },
            onError: (event: any) => {
              if (cancelled) return;
              console.warn("[YouTube Player] Error code:", event.data);
              onErrorRef.current?.(event.data);
            },
          },
        });
      } catch (err) {
        console.error("[YouTube Player] Initialization error:", err);
      }
    });

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy?.();
      } catch {}
      playerRef.current = null;
      isReadyRef.current = false;
      setIsReady(false);
    };
  }, [mountNode]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const player = playerRef.current;
      if (!player || !isReadyRef.current || typeof player.getCurrentTime !== "function") return;
      try {
        const cur = player.getCurrentTime() ?? 0;
        const dur = player.getDuration() ?? 0;
        setProgress({
          currentSeconds: cur,
          durationSeconds: dur,
        });
      } catch {
        // ignore transient player state errors
      }
    }, 500);
    return () => window.clearInterval(timer);
  }, []);

  const playVideoId = useCallback((videoId: string) => {
    requestedVideoIdRef.current = videoId;
    setCurrentVideoId(videoId);
    const player = playerRef.current;
    if (!player || !isReadyRef.current) return;
    requestedVideoIdRef.current = null;
    try {
      player.loadVideoById(videoId);
      player.playVideo?.();
    } catch (err) {
      console.warn("PlayVideoById fallback:", err);
    }
  }, []);

  const cueVideoId = useCallback((videoId: string) => {
    requestedVideoIdRef.current = null;
    setCurrentVideoId(videoId);
    const player = playerRef.current;
    if (!player || !isReadyRef.current) return;
    try {
      player.cueVideoById(videoId);
    } catch (err) {
      console.warn("CueVideoById fallback:", err);
    }
  }, []);

  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player || !isReadyRef.current) return;
    try {
      const state = player.getPlayerState?.();
      if (state === window.YT?.PlayerState?.PLAYING) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    } catch (err) {
      console.warn("togglePlay error:", err);
    }
  }, []);

  const seekToRatio = useCallback((ratio: number) => {
    const player = playerRef.current;
    if (!player || !isReadyRef.current) return;
    try {
      const duration = player.getDuration?.() ?? 0;
      if (duration > 0) player.seekTo(duration * ratio, true);
    } catch (err) {
      console.warn("seekToRatio error:", err);
    }
  }, []);

  const setVolume = useCallback((value: number) => {
    volumeRef.current = value;
    setVolumeState(value);
    try {
      playerRef.current?.setVolume?.(value);
    } catch {}
  }, []);

  const setOnError = useCallback((handler: (errorCode: number) => void) => {
    onErrorRef.current = handler;
  }, []);

  const setOnEnded = useCallback((handler: () => void) => {
    onEndedRef.current = handler;
  }, []);

  return {
    status,
    progress,
    volume,
    isReady,
    currentVideoId,
    mountRef,
    playVideoId,
    cueVideoId,
    togglePlay,
    seekToRatio,
    setVolume,
    setOnError,
    setOnEnded,
  };
}
