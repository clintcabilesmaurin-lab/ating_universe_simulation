import React, { useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Radio } from "lucide-react";
import type { Speaker } from "../../helpers/simulationConversationThreads";
import { animateMessageEntrance } from "../animation/animeMotion";

export type SimulationMessage = {
  id: string;
  speaker: Speaker | "user";
  text: string;
  time: string;
};

interface ConversationOverlayProps {
  messages: SimulationMessage[];
  activeSpeaker: Speaker;
  onToggleSpeaker: () => void;
  draft: string;
  onDraftChange: (val: string) => void;
  onSend: () => void;
  isSending: boolean;
  disabled: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLoadMoreHistory?: () => void;
  hasMoreHistory?: boolean;
  isLoadingHistory?: boolean;
}

export function ConversationOverlay({
  messages,
  activeSpeaker,
  onToggleSpeaker,
  draft,
  onDraftChange,
  onSend,
  isSending,
  disabled,
  isCollapsed,
  onToggleCollapse,
  onLoadMoreHistory,
  hasMoreHistory,
  isLoadingHistory,
}: ConversationOverlayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMsgRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef(messages.length);

  // Auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    // Animate latest message entrance with Anime.js
    if (messages.length > prevCount.current && lastMsgRef.current) {
      const latest = messages[messages.length - 1];
      animateMessageEntrance(lastMsgRef.current, latest.speaker);
    }
    prevCount.current = messages.length;
  }, [messages.length, messages]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "680px",
        margin: "0 auto",
        userSelect: "text",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Editorial Header Strip */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 14px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(8, 10, 15, 0.72)",
          backdropFilter: "blur(16px)",
          borderRadius: isCollapsed ? "4px" : "4px 4px 0 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontFamily: "var(--font-family-base)",
              fontSize: "9px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#9aa3b2",
              fontWeight: 500,
            }}
          >
            DIALOGUE STREAM
          </span>
          <span
            style={{
              fontSize: "8.5px",
              color: "#545d6c",
              letterSpacing: "0.1em",
            }}
          >
            [{messages.length} TRANSMISSIONS]
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            background: "transparent",
            border: "none",
            color: "#8a94a6",
            fontSize: "9px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer",
            padding: "2px 6px",
          }}
          aria-label={isCollapsed ? "Expand conversation" : "Collapse conversation"}
        >
          <span>{isCollapsed ? "EXPAND" : "MINIMIZE"}</span>
          {isCollapsed ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* Collapsible Message Stream and Composer */}
      {!isCollapsed && (
        <div
          style={{
            background: "rgba(8, 10, 15, 0.78)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderTop: "none",
            borderRadius: "0 0 4px 4px",
            padding: "8px 14px",
          }}
        >
          {/* Scrollable messages container */}
          <div
            ref={scrollRef}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              maxHeight: "clamp(100px, 17vh, 150px)",
              minHeight: "65px",
              overflowY: "auto",
              overflowX: "hidden",
              overscrollBehavior: "contain",
              paddingRight: "4px",
              scrollbarWidth: "thin",
            }}
          >
            {hasMoreHistory && (
              <button
                type="button"
                onClick={onLoadMoreHistory}
                disabled={isLoadingHistory}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#6c7687",
                  fontSize: "8.5px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "4px",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                {isLoadingHistory ? "RETRIEVING ARCHIVE..." : "LOAD PREVIOUS TRANSMISSIONS"}
              </button>
            )}

            {messages.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "16px 0",
                  color: "#6c7687",
                  fontSize: "11px",
                  letterSpacing: "0.04em",
                }}
              >
                Listening for simulation signals...
              </div>
            ) : (
              messages.map((msg, index) => {
                const isClint = msg.speaker === "clint";
                const isMaica = msg.speaker === "maica";
                const isLast = index === messages.length - 1;

                return (
                  <div
                    key={msg.id || index}
                    ref={isLast ? lastMsgRef : null}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      borderLeft: `2px solid ${
                        isClint ? "#5ac8fa" : isMaica ? "#ff7a70" : "#d8bc72"
                      }`,
                      paddingLeft: "10px",
                      background: "rgba(255, 255, 255, 0.015)",
                      padding: "6px 10px",
                      borderRadius: "0 3px 3px 0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "8.5px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          color: isClint ? "#5ac8fa" : isMaica ? "#ff7a70" : "#d8bc72",
                        }}
                      >
                        {isClint ? "CLINT" : isMaica ? "MAICA" : "OBSERVER"}
                      </span>
                      <span style={{ color: "#545d6c" }}>{msg.time}</span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        lineHeight: 1.45,
                        color: "#dde2eb",
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.text}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Minimalist Editorial Composer */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              gap: "8px",
              alignItems: "center",
              marginTop: "10px",
              paddingTop: "8px",
              borderTop: "1px solid rgba(255, 255, 255, 0.07)",
            }}
          >
            {/* Minimal Target Switcher */}
            <button
              type="button"
              onClick={onToggleSpeaker}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                background: "rgba(255, 255, 255, 0.04)",
                border: `1px solid ${
                  activeSpeaker === "clint" ? "#5ac8fa" : "#ff7a70"
                }`,
                color: activeSpeaker === "clint" ? "#5ac8fa" : "#ff7a70",
                fontSize: "9px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "5px 9px",
                borderRadius: "2px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "inherit",
              }}
              title="Click to toggle recipient"
            >
              <span>{activeSpeaker === "clint" ? "TO: CLINT" : "TO: MAICA"}</span>
            </button>

            {/* Hairline Input Field */}
            <input
              type="text"
              value={draft}
              onChange={(e) => onDraftChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !disabled && draft.trim()) {
                  onSend();
                }
              }}
              disabled={disabled || isSending}
              placeholder={
                disabled
                  ? "Initializing simulation stream..."
                  : `Transmitting as observer to ${
                      activeSpeaker === "clint" ? "Clint" : "Maica"
                    }...`
              }
              style={{
                width: "100%",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "2px",
                padding: "6px 10px",
                color: "#e8ecf2",
                fontSize: "12px",
                outline: "none",
                fontFamily: "inherit",
              }}
            />

            {/* Precision Send Button */}
            <button
              type="button"
              onClick={onSend}
              disabled={disabled || isSending || !draft.trim()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                background: isSending ? "#253040" : "#ffffff",
                color: isSending ? "#8a96a8" : "#090b10",
                border: "none",
                borderRadius: "2px",
                padding: "6px 11px",
                fontSize: "9px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: disabled || isSending || !draft.trim() ? "not-allowed" : "pointer",
                opacity: disabled || !draft.trim() ? 0.45 : 1,
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              <Radio size={11} />
              <span>{isSending ? "SENDING" : "TRANSMIT"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
