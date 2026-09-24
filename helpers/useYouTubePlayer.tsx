// Thin wrapper around the official YouTube IFrame Player API.
// Loads the script once, creates a single persistent player instance mounted
// into the DOM node with id === mountId, and exposes simple playback controls
// plus onError/onEnded hooks so the caller can implement fallback-track retry
// and playlist auto-advance.

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
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve();
    };
    if (document.getElementById("youtube-iframe-api-script")) {
      const startedAt = Date.now();
      const poll = window.setInterval(() => {
        if (window.YT?.Player) {
          window.clearInterval(poll);
          resolve();
        } else if (Date.now() - startedAt > 15000) {
          window.clearInterval(poll);
          resolve();
        }
      }, 100);
      return;
    }
    const script = document.createElement("script");
    script.id = "youtube-iframe-api-script";
    script.src = "https://www.youtube.com/iframe_api";
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
  const [progress, setProgress] = useState({ currentSeconds: 0, durationSeconds: 0 });
  const [volume, setVolumeState] = useState(80);
  const [isReady, setIsReady] = useState(false);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  const mountRef: RefCallback<HTMLElement> = useCallback((node) => setMountNode(node), []);

  useEffect(() => {
    let cancelled = false;

    void loadYouTubeIframeApi().then(() => {
      if (cancelled || !window.YT?.Player || !mountNode) return;
      playerRef.current = new window.YT.Player(mountNode, {
        height: "100%",
        width: "100%",
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1, controls: 0 },
        events: {
          onReady: (event: any) => {
            isReadyRef.current = true;
            setIsReady(true);
            event.target.setVolume(volumeRef.current);
            if (requestedVideoIdRef.current) {
              const videoId = requestedVideoIdRef.current;
              requestedVideoIdRef.current = null;
              event.target.loadVideoById(videoId);
              event.target.playVideo();
            }
          },
          onStateChange: (event: any) => {
            const State = window.YT.PlayerState;
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
            onErrorRef.current?.(event.data);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy?.();
      } catch {
        // player may already be gone
      }
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
        setProgress({
          currentSeconds: player.getCurrentTime() ?? 0,
          durationSeconds: player.getDuration() ?? 0,
        });
      } catch {
        // ignore transient player state errors
      }
    }, 500);
    return () => window.clearInterval(timer);
  }, []);

  const playVideoId = useCallback((videoId: string) => {
    requestedVideoIdRef.current = videoId;
    const player = playerRef.current;
    if (!player || !isReadyRef.current) return;
    requestedVideoIdRef.current = null;
    player.loadVideoById(videoId);
    player.playVideo();
  }, []);

  const cueVideoId = useCallback((videoId: string) => {
    requestedVideoIdRef.current = null;
    const player = playerRef.current;
    if (!player || !isReadyRef.current) return;
    player.cueVideoById(videoId);
  }, []);

  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player || !isReadyRef.current) return;
    const state = player.getPlayerState?.();
    if (state === window.YT?.PlayerState?.PLAYING) player.pauseVideo();
    else player.playVideo();
  }, []);

  const seekToRatio = useCallback((ratio: number) => {
    const player = playerRef.current;
    if (!player || !isReadyRef.current) return;
    const duration = player.getDuration?.() ?? 0;
    if (duration > 0) player.seekTo(duration * ratio, true);
  }, []);

  const setVolume = useCallback((value: number) => {
    volumeRef.current = value;
    setVolumeState(value);
    playerRef.current?.setVolume?.(value);
  }, []);

  const setOnError = useCallback((handler: (errorCode: number) => void) => {
    onErrorRef.current = handler;
  }, []);

  const setOnEnded = useCallback((handler: () => void) => {
    onEndedRef.current = handler;
  }, []);

  return { status, progress, volume, isReady, mountRef, playVideoId, cueVideoId, togglePlay, seekToRatio, setVolume, setOnError, setOnEnded };
}
