import React, { useState } from "react";
import {
  Headphones,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
  Shuffle,
  ExternalLink,
} from "lucide-react";
import type { MusicTrack } from "../../helpers/musicLibrary";
import type { useYouTubePlayer } from "../../helpers/useYouTubePlayer";

export type MusicCategory =
  | "all"
  | "pop"
  | "indie"
  | "acoustic"
  | "lofi"
  | "ambient"
  | "rnb"
  | "gospel"
  | "rock";

export const MUSIC_CATEGORIES: { id: MusicCategory; label: string; icon: string }[] = [
  { id: "all", label: "All Sounds", icon: "✦" },
  { id: "pop", label: "Contemporary Pop", icon: "🌤️" },
  { id: "indie", label: "Indie / Folk", icon: "🌿" },
  { id: "acoustic", label: "Acoustic / Warm", icon: "🎸" },
  { id: "lofi", label: "Lo-Fi / Study", icon: "☕" },
  { id: "ambient", label: "Ambient / Night", icon: "🌙" },
  { id: "rnb", label: "Soul / R&B", icon: "🍷" },
  { id: "gospel", label: "Faith / Acoustic", icon: "🕊️" },
  { id: "rock", label: "Alt / Indie Rock", icon: "⚡" },
];

export type UseYouTubePlayerResult = ReturnType<typeof useYouTubePlayer>;

interface MusicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTrack: MusicTrack | null;
  isPlaying: boolean;
  youtubePlayer: UseYouTubePlayerResult;
  musicLibrary: MusicTrack[];
  onSelectTrack: (trackId: string) => Promise<void> | void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  clintReaction: string | null;
  maicaReaction: string | null;
}

function formatTime(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds || 0));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function MusicDrawer({
  isOpen,
  onClose,
  activeTrack,
  isPlaying,
  youtubePlayer,
  musicLibrary,
  onSelectTrack,
  onPrevTrack,
  onNextTrack,
  clintReaction,
  maicaReaction,
}: MusicDrawerProps) {
  const [category, setCategory] = useState<MusicCategory>("all");
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(70);

  if (!isOpen) return null;

  const tracks =
    category === "all"
      ? musicLibrary
      : musicLibrary.filter(
          (t) => t.genre === category || t.roomIds.includes(category)
        );

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetSeconds = ratio * (youtubePlayer.progress.durationSeconds || 1);
    youtubePlayer.seekToRatio(ratio);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      youtubePlayer.setVolume(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(youtubePlayer.volume);
      youtubePlayer.setVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: "44px",
        width: "min(460px, 94vw)",
        background: "rgba(8, 10, 15, 0.94)",
        backdropFilter: "blur(28px)",
        borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        boxShadow: "-20px 0 60px rgba(0, 0, 0, 0.7)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "8.5px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#748092",
            }}
          >
            AUDIO ARCHIVE
          </span>
          <h2
            style={{
              margin: "3px 0 0",
              fontFamily: "var(--font-family-display)",
              fontSize: "20px",
              fontWeight: 400,
              color: "#f0f3f8",
            }}
          >
            Soundtrack
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            display: "grid",
            placeItems: "center",
            width: "28px",
            height: "28px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "3px",
            color: "#8a96a8",
            cursor: "pointer",
          }}
          aria-label="Close music archive"
        >
          <X size={15} />
        </button>
      </div>

      {/* Content scroll area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "18px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Active Track Stage */}
        {activeTrack ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "72px 1fr",
              gap: "14px",
              padding: "12px",
              background: "rgba(255, 255, 255, 0.025)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "3px",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "72px",
                height: "72px",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <img
                src={activeTrack.coverImage}
                alt={activeTrack.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {isPlaying && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    boxShadow: "inset 0 0 12px rgba(90, 200, 250, 0.5)",
                  }}
                />
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minWidth: 0,
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "8px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#5ac8fa",
                  }}
                >
                  <span>{isPlaying ? "● LIVE AUDIO" : "◌ PAUSED"}</span>
                  <span style={{ color: "#4d5565" }}>·</span>
                  <span style={{ color: "#748092" }}>{activeTrack.genre}</span>
                </div>
                <h3
                  style={{
                    margin: "2px 0 0",
                    fontFamily: "var(--font-family-display)",
                    fontSize: "16px",
                    fontWeight: 400,
                    color: "#f5f7fb",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {activeTrack.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    color: "#8a96a8",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {activeTrack.artist} · {activeTrack.year}
                </p>
              </div>

              {/* Progress and controls */}
              <div>
                {/* Scrubber */}
                <div
                  onClick={handleSeek}
                  style={{
                    position: "relative",
                    height: "3px",
                    background: "rgba(255, 255, 255, 0.12)",
                    borderRadius: "1px",
                    cursor: "pointer",
                    margin: "6px 0 4px",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${
                        youtubePlayer.progress.durationSeconds > 0
                          ? (youtubePlayer.progress.currentSeconds /
                              youtubePlayer.progress.durationSeconds) *
                            100
                          : 0
                      }%`,
                      background: "#5ac8fa",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "8px",
                    color: "#6c7787",
                  }}
                >
                  <span>{formatTime(youtubePlayer.progress.currentSeconds)}</span>
                  <span>{formatTime(youtubePlayer.progress.durationSeconds)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: "16px",
              textAlign: "center",
              border: "1px dashed rgba(255, 255, 255, 0.1)",
              borderRadius: "3px",
              color: "#6c7787",
              fontSize: "11px",
            }}
          >
            No track currently loaded. Select a soundtrack below.
          </div>
        )}

        {/* Transport Toolbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 12px",
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "3px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              onClick={onPrevTrack}
              style={{
                background: "transparent",
                border: "none",
                color: "#8a96a8",
                cursor: "pointer",
                padding: "2px",
              }}
              aria-label="Previous track"
            >
              <SkipBack size={14} />
            </button>
            <button
              type="button"
              onClick={
                isPlaying ? () => youtubePlayer.togglePlay() : () => youtubePlayer.togglePlay()
              }
              style={{
                display: "grid",
                placeItems: "center",
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                background: "#ffffff",
                color: "#0a0c10",
                border: "none",
                cursor: "pointer",
              }}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            </button>
            <button
              type="button"
              onClick={onNextTrack}
              style={{
                background: "transparent",
                border: "none",
                color: "#8a96a8",
                cursor: "pointer",
                padding: "2px",
              }}
              aria-label="Next track"
            >
              <SkipForward size={14} />
            </button>
          </div>

          {/* Volume */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              type="button"
              onClick={handleToggleMute}
              style={{
                background: "transparent",
                border: "none",
                color: "#8a96a8",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {isMuted || youtubePlayer.volume === 0 ? (
                <VolumeX size={13} />
              ) : (
                <Volume2 size={13} />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : youtubePlayer.volume}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                youtubePlayer.setVolume(v);
                if (v > 0) setIsMuted(false);
              }}
              style={{ width: "60px", accentColor: "#5ac8fa" }}
            />
          </div>

          {/* Randomizer */}
          <button
            type="button"
            onClick={() => {
              if (tracks.length === 0) return;
              const random = tracks[Math.floor(Math.random() * tracks.length)];
              if (random) void onSelectTrack(random.id);
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              background: "transparent",
              border: "none",
              color: "#8a96a8",
              fontSize: "9px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            <Shuffle size={11} />
            <span>SHUFFLE</span>
          </button>
        </div>

        {/* Agent Reactions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
          }}
        >
          <div
            style={{
              borderLeft: "2px solid #5ac8fa",
              padding: "6px 8px",
              background: "rgba(255, 255, 255, 0.015)",
              fontSize: "9px",
            }}
          >
            <strong style={{ color: "#5ac8fa", letterSpacing: "0.12em" }}>CLINT</strong>
            <p style={{ margin: "2px 0 0", color: "#8a96a8", fontSize: "10.5px" }}>
              {clintReaction || "Listening to the harmonics."}
            </p>
          </div>
          <div
            style={{
              borderLeft: "2px solid #ff7a70",
              padding: "6px 8px",
              background: "rgba(255, 255, 255, 0.015)",
              fontSize: "9px",
            }}
          >
            <strong style={{ color: "#ff7a70", letterSpacing: "0.12em" }}>MAICA</strong>
            <p style={{ margin: "2px 0 0", color: "#8a96a8", fontSize: "10.5px" }}>
              {maicaReaction || "Absorbing the acoustics."}
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div
          style={{
            display: "flex",
            gap: "5px",
            overflowX: "auto",
            paddingBottom: "4px",
            scrollbarWidth: "none",
          }}
        >
          {MUSIC_CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              style={{
                background:
                  category === item.id ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.03)",
                border:
                  category === item.id
                    ? "1px solid rgba(255, 255, 255, 0.25)"
                    : "1px solid rgba(255, 255, 255, 0.06)",
                color: category === item.id ? "#ffffff" : "#748092",
                padding: "3px 8px",
                borderRadius: "2px",
                fontSize: "8.5px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "inherit",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Track List */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {tracks.map((track) => {
            const isSelected = activeTrack?.id === track.id;
            return (
              <div
                key={track.id}
                onClick={() => void onSelectTrack(track.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 10px",
                  background: isSelected
                    ? "rgba(90, 200, 250, 0.08)"
                    : "rgba(255, 255, 255, 0.015)",
                  border: isSelected
                    ? "1px solid rgba(90, 200, 250, 0.3)"
                    : "1px solid rgba(255, 255, 255, 0.05)",
                  borderRadius: "2px",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  <img
                    src={track.coverImage}
                    alt=""
                    style={{ width: "32px", height: "32px", objectFit: "cover", borderRadius: "2px" }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "11px",
                        color: isSelected ? "#ffffff" : "#dde3ec",
                        fontWeight: isSelected ? 500 : 400,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {track.title}
                    </div>
                    <div style={{ fontSize: "9px", color: "#6c7787" }}>
                      {track.artist} · {track.genre}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                  {isSelected && (
                    <span style={{ fontSize: "9px", color: "#5ac8fa", fontWeight: 600 }}>
                      {isPlaying ? "PLAYING" : "PAUSED"}
                    </span>
                  )}
                  <a
                    href={`https://www.youtube.com/watch?v=${track.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ color: "#545e6d", padding: "2px" }}
                    title="Open on YouTube"
                  >
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
