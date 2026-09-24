import React, { useMemo } from "react";
import type { RoutineSnapshot } from "../../helpers/simulationDayCycle";

interface SimulationTimelineProps {
  dayCycle: RoutineSnapshot;
}

export function SimulationTimeline({ dayCycle }: SimulationTimelineProps) {
  // Parse decimal hour from timeLabel "HH:MM"
  const progressPercent = useMemo(() => {
    if (!dayCycle.timeLabel) return 50;
    const parts = dayCycle.timeLabel.split(":");
    if (parts.length < 2) return 50;
    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    const decimal = hours + minutes / 60;
    return Math.min(Math.max((decimal / 24) * 100, 0), 100);
  }, [dayCycle.timeLabel]);

  const checkpoints = [
    { label: "00:00", pct: 0 },
    { label: "06:00", pct: 25 },
    { label: "12:00", pct: 50 },
    { label: "18:00", pct: 75 },
    { label: "24:00", pct: 100 },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "680px",
        margin: "0 auto",
        padding: "6px 12px 2px",
        userSelect: "none",
      }}
    >
      {/* Top telemetry status */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "9px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#7e8896",
          marginBottom: "6px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#f0f2f5", fontWeight: 500 }}>
            {dayCycle.dayLabel} · {dayCycle.timeLabel}
          </span>
          <span style={{ color: "#4d5563" }}>/</span>
          <span style={{ color: "#929cb0" }}>{dayCycle.sharedActivity}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span>PHASE: <strong style={{ color: "#e2e7f0", fontWeight: 500 }}>{dayCycle.phase}</strong></span>
          <span>NEXT: <strong style={{ color: "#929cb0", fontWeight: 400 }}>{dayCycle.nextTransition}</strong></span>
        </div>
      </div>

      {/* Thin Technical Track */}
      <div
        style={{
          position: "relative",
          height: "2px",
          background: "rgba(255, 255, 255, 0.1)",
          width: "100%",
        }}
      >
        {/* Progress fill */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${progressPercent}%`,
            background: "linear-gradient(90deg, rgba(90, 200, 250, 0.3) 0%, rgba(255, 122, 112, 0.5) 100%)",
          }}
        />

        {/* Checkpoint ticks */}
        {checkpoints.map((cp) => (
          <div
            key={cp.label}
            style={{
              position: "absolute",
              left: `${cp.pct}%`,
              top: "-2px",
              height: "6px",
              width: "1px",
              background: "rgba(255, 255, 255, 0.25)",
              transform: cp.pct === 100 ? "translateX(-1px)" : "none",
            }}
          />
        ))}

        {/* Current Time Needle */}
        <div
          style={{
            position: "absolute",
            left: `${progressPercent}%`,
            top: "-5px",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 3,
          }}
        >
          <div
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "#ffffff",
              boxShadow: "0 0 8px rgba(255, 255, 255, 0.9)",
            }}
          />
          <div
            style={{
              width: "1px",
              height: "7px",
              background: "rgba(255, 255, 255, 0.7)",
            }}
          />
        </div>
      </div>

      {/* Axis Labels */}
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "8px",
          letterSpacing: "0.08em",
          color: "#5c6575",
          marginTop: "4px",
        }}
      >
        {checkpoints.map((cp) => (
          <span key={cp.label}>{cp.label}</span>
        ))}
      </div>
    </div>
  );
}
