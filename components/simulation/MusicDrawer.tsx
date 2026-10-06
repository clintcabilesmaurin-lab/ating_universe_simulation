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
  Search,
} from "lucide-react";
import type { MusicTrack } from "../../helpers/musicLibrary";
import type { useYouTubePlayer } from "../../helpers/useYouTubePlayer";

export type MusicCategory =
  | "all"
  | "pop"
  | "soft-rock"
  | "indie"
  | "jazz"
  | "cinematic"
  | "opm"
  | "emo";

export const MUSIC_CATEGORIES: { id: MusicCategory; label: string; icon: string }[] = [
  { id: "all", label: "All Sounds (69)", icon: "✦" },
  { id: "pop", label: "Pop / Contemporary (16)", icon: "🌤️" },
  { id: "soft-rock", label: "Soft Rock / Adult Cont. (6)", icon: "💿" },
  { id: "indie", label: "Indie / Alternative (5)", icon: "🌿" },
  { id: "jazz", label: "Jazz / Bossa (13)", icon: "☕" },
  { id: "cinematic", label: "Cinematic Romance (4)", icon: "🎬" },
  { id: "opm", label: "Filipino / OPM (14)", icon: "🇵🇭" },
  { id: "emo", label: "Emo / Pop-Punk (11)", icon: "🌧️" },
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(70);

  if (!isOpen) return null;

  const filteredTracks = musicLibrary.filter((t) => {
    const matchesCategory =
      category === "all" || t.genre === category || t.roomIds.includes(category);
    if (!matchesCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

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

  const GENRE_SECTIONS: { id: MusicCategory; label: string; icon: string; count: number }[] = [
    { id: "pop", label: "Pop / Contemporary Pop", icon: "🌤️", count: 16 },
    { id: "soft-rock", label: "Soft Rock / Adult Contemporary", icon: "💿", count: 6 },
    { id: "indie", label: "Indie / Alternative / Indie Pop", icon: "🌿", count: 5 },
    { id: "jazz", label: "Jazz / Jazz-Pop / Bossa-Inspired", icon: "☕", count: 13 },
    { id: "cinematic", label: "Musical / Cinematic Romance", icon: "🎬", count: 4 },
    { id: "opm", label: "Filipino / OPM", icon: "🇵🇭", count: 14 },
    { id: "emo", label: "Emo / Pop-Punk / Alternative Emo", icon: "🌧️", count: 11 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: "44px",
        width: "min(480px, 94vw)",
        background: "rgba(8, 10, 15, 0.96)",
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
          flexShrink: 0,
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

      {/* Pinned Category Navigation & Search */}
      <div
        style={{
          padding: "12px 18px",
          background: "rgba(13, 17, 24, 0.98)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a96a8", fontWeight: 600 }}>
            GENRE CATEGORIES (7 SECTIONS · 69 TRACKS)
          </span>
          {category !== "all" && (
            <button
              type="button"
              onClick={() => setCategory("all")}
              style={{
                background: "transparent",
                border: "none",
                color: "#5ac8fa",
                fontSize: "9px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Show All (69)
            </button>
          )}
        </div>

        {/* Category Pills Slider */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            overflowX: "auto",
            paddingBottom: "4px",
            scrollbarWidth: "none",
          }}
        >
          {MUSIC_CATEGORIES.map((item) => {
            const isActive = category === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  background: isActive ? "rgba(90, 200, 250, 0.2)" : "rgba(255, 255, 255, 0.04)",
                  border: isActive ? "1px solid #5ac8fa" : "1px solid rgba(255, 255, 255, 0.08)",
                  color: isActive ? "#ffffff" : "#9ba8ba",
                  padding: "5px 10px",
                  borderRadius: "3px",
                  fontSize: "10.5px",
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                  boxShadow: isActive ? "0 0 10px rgba(90, 200, 250, 0.3)" : "none",
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Filter */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.07)",
            borderRadius: "3px",
            padding: "5px 8px",
          }}
        >
          <Search size={12} color="#748092" />
          <input
            type="text"
            placeholder="Search 69 soundtracks, artists, or lyrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#ffffff",
              fontSize: "11px",
              width: "100%",
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              style={{
                background: "transparent",
                border: "none",
                color: "#748092",
                cursor: "pointer",
                padding: "0 2px",
                fontSize: "11px",
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Content scroll area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 20px",
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
              if (filteredTracks.length === 0) return;
              const random = filteredTracks[Math.floor(Math.random() * filteredTracks.length)];
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

        {/* Track List Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {filteredTracks.length === 0 ? (
            <div
              style={{
                padding: "24px 16px",
                textAlign: "center",
                color: "#748092",
                fontSize: "12px",
                background: "rgba(255, 255, 255, 0.02)",
                borderRadius: "3px",
              }}
            >
              No soundtracks found matching "{searchQuery}".
              <br />
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setCategory("all");
                }}
                style={{
                  marginTop: "8px",
                  background: "transparent",
                  border: "none",
                  color: "#5ac8fa",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
              >
                Clear filter & show all 69 tracks
              </button>
            </div>
          ) : category === "all" && !searchQuery ? (
            // Grouped by the 7 categories
            GENRE_SECTIONS.map((sec) => {
              const secTracks = musicLibrary.filter((t) => t.genre === sec.id);
              if (secTracks.length === 0) return null;
              return (
                <div key={sec.id} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "5px 10px",
                      background: "rgba(255, 255, 255, 0.035)",
                      borderLeft: "2px solid #5ac8fa",
                      borderRadius: "2px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "12px" }}>{sec.icon}</span>
                      <span
                        style={{
                          fontSize: "10px",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#f0f3f8",
                          fontWeight: 600,
                        }}
                      >
                        {sec.label}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCategory(sec.id)}
                      style={{
                        fontSize: "9px",
                        color: "#5ac8fa",
                        background: "rgba(90, 200, 250, 0.1)",
                        border: "1px solid rgba(90, 200, 250, 0.25)",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        cursor: "pointer",
                      }}
                    >
                      {secTracks.length} tracks
                    </button>
                  </div>

                  {secTracks.map((track) => {
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
                            ? "rgba(90, 200, 250, 0.1)"
                            : "rgba(255, 255, 255, 0.015)",
                          border: isSelected
                            ? "1px solid rgba(90, 200, 250, 0.35)"
                            : "1px solid rgba(255, 255, 255, 0.04)",
                          borderRadius: "2px",
                          cursor: "pointer",
                          transition: "background 0.15s ease",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                          <img
                            src={track.coverImage}
                            alt=""
                            style={{ width: "32px", height: "32px", objectFit: "cover", borderRadius: "2px", flexShrink: 0 }}
                          />
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: "11px",
                                color: isSelected ? "#ffffff" : "#dde3ec",
                                fontWeight: isSelected ? 600 : 400,
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
              );
            })
          ) : (
            // Filtered view (either by single category or search)
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "5px 10px",
                  background: "rgba(255, 255, 255, 0.035)",
                  borderLeft: "2px solid #5ac8fa",
                  borderRadius: "2px",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#f0f3f8",
                    fontWeight: 600,
                  }}
                >
                  {category !== "all"
                    ? `${MUSIC_CATEGORIES.find((c) => c.id === category)?.icon} ${
                        MUSIC_CATEGORIES.find((c) => c.id === category)?.label
                      }`
                    : `Search Results (${filteredTracks.length})`}
                </span>
                <span
                  style={{
                    fontSize: "9px",
                    color: "#748092",
                    background: "rgba(255, 255, 255, 0.05)",
                    padding: "2px 8px",
                    borderRadius: "10px",
                  }}
                >
                  {filteredTracks.length} tracks
                </span>
              </div>

              {filteredTracks.map((track) => {
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
                        ? "rgba(90, 200, 250, 0.1)"
                        : "rgba(255, 255, 255, 0.015)",
                      border: isSelected
                        ? "1px solid rgba(90, 200, 250, 0.35)"
                        : "1px solid rgba(255, 255, 255, 0.04)",
                      borderRadius: "2px",
                      cursor: "pointer",
                      transition: "background 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                      <img
                        src={track.coverImage}
                        alt=""
                        style={{ width: "32px", height: "32px", objectFit: "cover", borderRadius: "2px", flexShrink: 0 }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "11px",
                            color: isSelected ? "#ffffff" : "#dde3ec",
                            fontWeight: isSelected ? 600 : 400,
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
          )}
        </div>
      </div>
    </div>
  );
}
