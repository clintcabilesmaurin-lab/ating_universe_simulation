import React from "react";
import { Headphones, Play, Pause, Disc3, Radio } from "lucide-react";
import type { MusicTrack } from "../../helpers/musicLibrary";

interface SimulationControlsProps {
  currentWorld: "living-room" | "music-room";
  onSelectWorld: (world: "living-room" | "music-room") => void;
  isObserving: boolean;
  onToggleObserving: () => void;
  isPlayingMusic: boolean;
  activeTrack: MusicTrack | null;
  onTogglePlayMusic: () => void;
  isMusicDrawerOpen: boolean;
  onToggleMusicDrawer: () => void;
}

export function SimulationControls({
  currentWorld,
  onSelectWorld,
  isObserving,
  onToggleObserving,
  isPlayingMusic,
  activeTrack,
  onTogglePlayMusic,
  isMusicDrawerOpen,
  onToggleMusicDrawer,
}: SimulationControlsProps) {
  return (
    <footer
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        background: "rgba(6, 8, 12, 0.88)",
        backdropFilter: "blur(20px)",
        zIndex: 10,
        userSelect: "none",
      }}
    >
      {/* Left: Scientific Mode Indicators */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* World: Living Room */}
        <button
          type="button"
          onClick={() => onSelectWorld("living-room")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            background: "transparent",
            border: "none",
            color: currentWorld === "living-room" ? "#ffffff" : "#6c7787",
            fontSize: "9.5px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            cursor: "pointer",
            padding: "4px 6px",
            transition: "all 0.2s ease",
            fontFamily: "inherit",
          }}
        >
          <span
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: currentWorld === "living-room" ? "#5ac8fa" : "#3d4653",
              boxShadow: currentWorld === "living-room" ? "0 0 8px #5ac8fa" : "none",
              transition: "all 0.3s ease",
            }}
          />
          <span>LIVING</span>
        </button>

        {/* World: Music Room */}
        <button
          type="button"
          onClick={() => {
            onSelectWorld("music-room");
            onToggleMusicDrawer();
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            background: "transparent",
            border: "none",
            color: currentWorld === "music-room" || isMusicDrawerOpen ? "#ffffff" : "#6c7787",
            fontSize: "9.5px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            cursor: "pointer",
            padding: "4px 6px",
            transition: "all 0.2s ease",
            fontFamily: "inherit",
          }}
        >
          <span
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: currentWorld === "music-room" || isMusicDrawerOpen ? "#ff7a70" : "#3d4653",
              boxShadow:
                currentWorld === "music-room" || isMusicDrawerOpen ? "0 0 8px #ff7a70" : "none",
              transition: "all 0.3s ease",
            }}
          />
          <span>MUSIC ARCHIVE</span>
        </button>

        {/* Observe Mode Toggle */}
        <button
          type="button"
          onClick={onToggleObserving}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            background: isObserving ? "rgba(255, 255, 255, 0.08)" : "transparent",
            border: isObserving
              ? "1px solid rgba(255, 255, 255, 0.2)"
              : "1px solid transparent",
            color: isObserving ? "#ffffff" : "#6c7787",
            fontSize: "9.5px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            cursor: "pointer",
            padding: "3px 8px",
            borderRadius: "2px",
            transition: "all 0.2s ease",
            fontFamily: "inherit",
          }}
        >
          <span
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: isObserving ? "#a6e3a1" : "#3d4653",
              boxShadow: isObserving ? "0 0 8px #a6e3a1" : "none",
              transition: "all 0.3s ease",
            }}
          />
          <span>OBSERVE {isObserving ? "[ACTIVE]" : "[IDLE]"}</span>
        </button>
      </div>

      {/* Right: Now Playing Minimal Instrument Ticker */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {activeTrack ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.07)",
              padding: "2px 8px 2px 4px",
              borderRadius: "2px",
            }}
          >
            <button
              type="button"
              onClick={onTogglePlayMusic}
              style={{
                display: "grid",
                placeItems: "center",
                width: "20px",
                height: "20px",
                background: "transparent",
                border: "none",
                color: "#e2e7f0",
                cursor: "pointer",
                padding: 0,
              }}
              aria-label={isPlayingMusic ? "Pause audio" : "Play audio"}
            >
              {isPlayingMusic ? <Pause size={12} /> : <Play size={12} />}
            </button>
            <span
              onClick={onToggleMusicDrawer}
              style={{
                fontSize: "9px",
                color: "#c2cbd8",
                letterSpacing: "0.08em",
                maxWidth: "180px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: "pointer",
              }}
              title="Click to open music archive"
            >
              {activeTrack.title} — <span style={{ color: "#748092" }}>{activeTrack.artist}</span>
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onToggleMusicDrawer}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "transparent",
              border: "none",
              color: "#5f6979",
              fontSize: "9px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Headphones size={12} />
            <span>SOUNDTRACK SILENT</span>
          </button>
        )}
      </div>
    </footer>
  );
}
