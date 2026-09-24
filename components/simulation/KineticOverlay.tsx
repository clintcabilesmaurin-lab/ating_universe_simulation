import React, { useEffect, useRef, useState } from "react";
import { animate, createTimeline, stagger } from "animejs";

interface KineticOverlayProps {
  activeSpeaker: "clint" | "maica" | null;
  isObserving: boolean;
  sharedActivity: string;
  timeLabel: string;
}

export function KineticOverlay({
  activeSpeaker,
  isObserving,
}: KineticOverlayProps) {
  const [headline, setHeadline] = useState<string | null>("SIMULATION ACTIVE");
  const [subline, setSubline] = useState<string | null>("OBSERVATORY PROTOCOL INITIALIZED");
  const textRef = useRef<HTMLDivElement>(null);
  const prevSpeaker = useRef<"clint" | "maica" | null>(null);
  const prevObserving = useRef(isObserving);

  // Trigger kinetic moments on meaningful state transitions
  useEffect(() => {
    if (activeSpeaker && activeSpeaker !== prevSpeaker.current) {
      if (activeSpeaker === "clint") {
        setHeadline("CLINT SPEAKING");
        setSubline("NODE 01 TRANSMITTING // 2.65 AU TRAJECTORY");
      } else {
        setHeadline("MAICA REFLECTING");
        setSubline("NODE 02 TRANSMITTING // 2.45 AU TRAJECTORY");
      }
    } else if (isObserving !== prevObserving.current) {
      if (isObserving) {
        setHeadline("AUTONOMOUS MODE");
        setSubline("PASSIVE SPECTATOR ENGAGED");
      } else {
        setHeadline("DIRECT INTERACTION");
        setSubline("OBSERVER CHANNEL RESTORED");
      }
    }
    prevSpeaker.current = activeSpeaker;
    prevObserving.current = isObserving;
  }, [activeSpeaker, isObserving]);

  useEffect(() => {
    if (!headline || !textRef.current) return;

    const el = textRef.current;
    el.style.opacity = "1";
    el.style.transform = "translateX(-50%) translateY(0px)";

    const chars = el.querySelectorAll(".kinetic-char");
    const sub = el.querySelector(".kinetic-sub");

    const tl = createTimeline({
      onComplete: () => {
        setHeadline(null);
        setSubline(null);
      },
    });

    tl.add(chars, {
      opacity: [0, 1],
      translateY: [35, 0],
      duration: 600,
      ease: "outCubic",
      delay: stagger(28),
    });

    if (sub) {
      tl.add(
        sub,
        {
          opacity: [0, 0.7],
          translateY: [12, 0],
          duration: 400,
          ease: "outQuad",
        },
        "-=300"
      );
    }

    tl.add(
      el,
      {
        opacity: [1, 0],
        translateY: [0, -18],
        duration: 500,
        ease: "inQuad",
        delay: 1800,
      }
    );

    return () => {
      tl.pause();
    };
  }, [headline]);

  if (!headline) return null;

  return (
    <div
      ref={textRef}
      style={{
        position: "absolute",
        top: "15%",
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "none",
        zIndex: 2,
        textAlign: "center",
        width: "100%",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-family-display)",
          fontSize: "clamp(26px, 5vw, 60px)",
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          color: "rgba(240, 243, 248, 0.92)",
          textTransform: "uppercase",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "0.15em",
        }}
      >
        {headline.split("").map((char, index) => (
          <span
            key={index}
            className="kinetic-char"
            style={{
              display: "inline-block",
              opacity: 0,
              whiteSpace: char === " " ? "pre" : "normal",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>

      {subline && (
        <div
          className="kinetic-sub"
          style={{
            fontFamily: "var(--font-family-base)",
            fontSize: "9.5px",
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: "#8a95a5",
            marginTop: "10px",
            opacity: 0,
          }}
        >
          {subline}
        </div>
      )}
    </div>
  );
}
