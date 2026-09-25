import React, { useEffect, useRef, useState, useMemo } from "react";
import superjson from "superjson";
import { Activity, X, Radio } from "lucide-react";
import { StarfieldCanvas } from "../components/StarfieldCanvas";
import { SimulationWorld } from "../components/simulation/SimulationWorld";
import { KineticOverlay } from "../components/simulation/KineticOverlay";
import { SimulationTimeline } from "../components/simulation/SimulationTimeline";
import {
  ConversationOverlay,
  type SimulationMessage,
} from "../components/simulation/ConversationOverlay";
import { SimulationControls } from "../components/simulation/SimulationControls";
import { MusicDrawer } from "../components/simulation/MusicDrawer";
import {
  useRealtimeChannel,
  useRealtimeConnectionStatus,
} from "../components/FlootRealtimeProvider";
import { channels } from "../helpers/realtimeChannels";
import {
  getSimulationDayCycle,
  type RoutineSnapshot,
} from "../helpers/simulationDayCycle";
import { musicLibrary } from "../helpers/musicLibrary";
import { useYouTubePlayer } from "../helpers/useYouTubePlayer";
import type { Speaker } from "../helpers/simulationConversationThreads";
import {
  postSimulationSession,
  type OutputType as SessionOutput,
} from "../endpoints/simulation/session_POST.schema";
import { getSimulationSession } from "../endpoints/simulation/session_GET.schema";
import { postSimulationTick } from "../endpoints/simulation/tick_POST.schema";
import { postSimulationChat } from "../endpoints/simulation/chat_POST.schema";
import { postSimulationWorld } from "../endpoints/simulation/world_POST.schema";
import { postSimulationMusic } from "../endpoints/simulation/music_POST.schema";
import { getSimulationMessages } from "../endpoints/simulation/messages_GET.schema";
import styles from "./_index.module.css";

const SIMULATION_SESSION_VERSION = "v3";
type Message = SessionOutput["messages"][number];

export default function IndexPage() {
  const [session, setSession] = useState<SessionOutput | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeSpeaker, setActiveSpeaker] = useState<Speaker>("clint");
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isObserving, setIsObserving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dayCycle, setDayCycle] = useState<RoutineSnapshot>(() =>
    getSimulationDayCycle()
  );
  const [hasOlderMessages, setHasOlderMessages] = useState(false);
  const [olderMessagesCursor, setOlderMessagesCursor] = useState<string | null>(
    null
  );
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [playbackNotice, setPlaybackNotice] = useState<string | null>(null);
  const [engineStatus, setEngineStatus] = useState<{
    geminiConfigured: boolean;
    model: string;
  } | null>(null);
  const [isConversationCollapsed, setIsConversationCollapsed] = useState(false);
  const [isMusicDrawerOpen, setIsMusicDrawerOpen] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);

  const busyRef = useRef(false);
  const realtimeStatus = useRealtimeConnectionStatus();
  const youtubePlayer = useYouTubePlayer();
  const fallbackAttemptRef = useRef<{ trackId: string; index: number } | null>(
    null
  );
  const hydratePlayerRef = useRef(true);

  // Fetch AI engine status
  useEffect(() => {
    fetch("/_api/simulation/engine-status")
      .then((res) => res.text())
      .then((text) => {
        try {
          const parsed = superjson.parse<{
            geminiConfigured: boolean;
            model: string;
          }>(text);
          setEngineStatus(parsed);
        } catch {}
      })
      .catch(() => {});
  }, []);

  // Hydrate music player once session is ready
  useEffect(() => {
    const activeTrack = musicLibrary.find(
      (track) => track.id === session?.activeMusic
    );
    if (hydratePlayerRef.current && youtubePlayer.isReady && activeTrack) {
      youtubePlayer.cueVideoId(activeTrack.youtubeId);
      hydratePlayerRef.current = false;
    }
  }, [youtubePlayer.isReady, session?.activeMusic, youtubePlayer.cueVideoId]);

  const applyMessage = (nextMessage: Message) => {
    setMessages((current) => {
      if (current.some((item) => item.messageId === nextMessage.messageId))
        return current;
      const next = [...current, nextMessage];
      return next.length > 100 ? next.slice(-100) : next;
    });
  };

  const persistMusicSelection = async (trackId: string) => {
    if (!session) return;
    setError(null);
    try {
      const result = await postSimulationMusic({
        sessionId: session.sessionId,
        trackId,
      });
      result.messages.forEach((message) =>
        applyMessage({
          messageId: message.messageId,
          speaker: message.speaker,
          text: message.text,
          source: "simulation",
          interactionId: message.interactionId,
          createdAt: message.createdAt,
        })
      );
      setSession((current) =>
        current
          ? {
              ...current,
              activeMusic: result.trackId,
              currentActivity: result.currentActivity,
            }
          : current
      );
    } catch (musicError) {
      setError(
        musicError instanceof Error ? musicError.message : "Could not change music."
      );
    }
  };

  const playTrack = async (trackId: string | undefined) => {
    if (!trackId) return;
    const track = musicLibrary.find((item) => item.id === trackId);
    if (!track) return;
    hydratePlayerRef.current = false;
    setPlaybackNotice(null);
    fallbackAttemptRef.current = null;
    if (youtubePlayer.isReady) {
      youtubePlayer.playVideoId(track.youtubeId);
    }
    if (session && session.activeMusic !== trackId) {
      await persistMusicSelection(trackId);
    }
  };

  const advanceQueue = (direction: 1 | -1) => {
    if (!session?.activeMusic || musicLibrary.length === 0) return;
    const currentIndex = musicLibrary.findIndex(
      (track) => track.id === session.activeMusic
    );
    const nextIndex =
      currentIndex === -1
        ? 0
        : (currentIndex + direction + musicLibrary.length) % musicLibrary.length;
    void playTrack(musicLibrary[nextIndex]?.id);
  };

  useEffect(() => {
    youtubePlayer.setOnEnded(() => advanceQueue(1));
    youtubePlayer.setOnError(() => {
      const track = musicLibrary.find((item) => item.id === session?.activeMusic);
      if (!track) return;
      const candidates = [track.youtubeId, ...(track.fallbackYoutubeIds ?? [])];
      const previousAttempt =
        fallbackAttemptRef.current?.trackId === track.id
          ? fallbackAttemptRef.current.index
          : 0;
      const nextAttempt = previousAttempt + 1;
      if (nextAttempt < candidates.length) {
        fallbackAttemptRef.current = { trackId: track.id, index: nextAttempt };
        setPlaybackNotice("Using alternate stream for " + track.title + "…");
        youtubePlayer.playVideoId(candidates[nextAttempt]);
      } else {
        setPlaybackNotice(
          track.title + " has embedding restrictions. Try another track."
        );
      }
    });
  });

  const loadOlderMessages = async () => {
    if (!session || !hasOlderMessages || !olderMessagesCursor || isLoadingOlder)
      return;
    setIsLoadingOlder(true);
    try {
      const page = await getSimulationMessages(
        session.sessionId,
        olderMessagesCursor,
        50
      );
      setMessages((current) => {
        const existing = new Set(current.map((message) => message.messageId));
        const older = page.messages.filter(
          (message) => !existing.has(message.messageId)
        );
        const merged = [...older, ...current];
        return merged.length > 100 ? merged.slice(0, 100) : merged;
      });
      setHasOlderMessages(page.hasMore);
      setOlderMessagesCursor(page.nextBefore);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load older transmissions."
      );
    } finally {
      setIsLoadingOlder(false);
    }
  };

  // Boot simulation session
  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      try {
        const storedVersion = window.localStorage.getItem(
          "simulation-session-version"
        );
        const storedId =
          storedVersion === SIMULATION_SESSION_VERSION
            ? window.localStorage.getItem("simulation-session-id")
            : null;
        let loaded: SessionOutput;
        if (storedId) {
          try {
            loaded = await getSimulationSession(storedId, 50);
          } catch {
            loaded = await postSimulationSession();
          }
        } else {
          loaded = await postSimulationSession();
        }
        if (cancelled) return;
        window.localStorage.setItem("simulation-session-id", loaded.sessionId);
        window.localStorage.setItem(
          "simulation-session-version",
          SIMULATION_SESSION_VERSION
        );
        setSession(loaded);
        setMessages(loaded.messages);
        setHasOlderMessages(loaded.messages.length === 50);
        setOlderMessagesCursor(loaded.messages[0]?.createdAt ?? null);
        setError(null);
      } catch (bootError) {
        if (!cancelled) {
          setError(
            bootError instanceof Error
              ? bootError.message
              : "Could not initialize the simulation."
          );
        }
      }
    };
    void boot();
    return () => {
      cancelled = true;
    };
  }, []);

  // Day cycle ticker
  useEffect(() => {
    const update = () => setDayCycle(getSimulationDayCycle());
    update();
    const timer = window.setInterval(update, 15000);
    return () => window.clearInterval(timer);
  }, []);

  // Realtime subscription
  useRealtimeChannel(channels.simulation("main"), (event: any) => {
    if (!session || event?.sessionId !== session.sessionId) return;
    if (event.type === "simulation.world") {
      setSession((current) =>
        current
          ? {
              ...current,
              world: event.world,
              currentActivity: event.currentActivity,
            }
          : current
      );
      return;
    }
    if (event.type === "simulation.message") {
      applyMessage(event.message);
      setSession((current) =>
        current
          ? { ...current, currentActivity: event.currentActivity }
          : current
      );
      return;
    }
    if (event.type === "simulation.music") {
      event.messages?.forEach((message: Message) =>
        applyMessage({
          ...message,
          source: "simulation",
        })
      );
      setSession((current) =>
        current
          ? {
              ...current,
              activeMusic: event.trackId,
              currentActivity: event.currentActivity,
            }
          : current
      );
      const incomingTrack = musicLibrary.find((track) => track.id === event.trackId);
      if (incomingTrack) {
        hydratePlayerRef.current = false;
        fallbackAttemptRef.current = null;
        if (youtubePlayer.isReady) {
          youtubePlayer.playVideoId(incomingTrack.youtubeId);
        }
      }
      return;
    }
    if (event.type === "simulation.chat") {
      setSession((current) =>
        current
          ? {
              ...current,
              currentActivity:
                event.speaker === "clint"
                  ? "Clint is speaking"
                  : "Maica is speaking",
            }
          : current
      );
    }
  });

  // Tick generator
  const runTick = async () => {
    if (!session || busyRef.current) return null;
    busyRef.current = true;
    setIsSending(true);
    try {
      const result = await postSimulationTick({ sessionId: session.sessionId });
      applyMessage(result.message);
      setSession((current) =>
        current
          ? { ...current, currentActivity: result.currentActivity }
          : current
      );
      setError(null);
      return result;
    } catch (tickError) {
      console.warn("Simulation tick handled gracefully:", tickError);
      return null;
    } finally {
      busyRef.current = false;
      setIsSending(false);
    }
  };

  // Autonomous Simulation Loop: keeps simulation signals and transmissions active
  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    let timer: number | undefined;

    const loop = async () => {
      if (cancelled) return;
      const next = await runTick();
      if (cancelled) return;
      const baseDelay = isObserving ? 25000 : 45000;
      const variance = isObserving ? 15000 : 30000;
      const nextDelay =
        next?.nextDelayMs ?? (baseDelay + Math.floor(Math.random() * variance));
      timer = window.setTimeout(loop, nextDelay);
    };

    timer = window.setTimeout(loop, isObserving ? 6000 : 18000);

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [isObserving, session?.sessionId]);

  // Send message
  const sendMessage = async () => {
    if (!session || !draft.trim() || busyRef.current) return;
    const text = draft.trim();
    setDraft("");
    setIsSending(true);
    busyRef.current = true;
    setError(null);
    try {
      const result = await postSimulationChat({
        sessionId: session.sessionId,
        speaker: activeSpeaker,
        message: text,
        world: session.world as "living-room" | "music-room",
      });
      const createdAt = new Date().toISOString();
      applyMessage({
        messageId: result.userMessageId,
        speaker: activeSpeaker,
        text,
        source: "user",
        interactionId: null,
        createdAt,
      });
      applyMessage({
        messageId: result.responseMessageId,
        speaker: result.speaker,
        text: result.message,
        source: "simulation",
        interactionId: result.interactionId,
        createdAt: new Date().toISOString(),
      });
      setSession((current) =>
        current
          ? {
              ...current,
              currentActivity:
                result.speaker === "clint"
                  ? "Clint is speaking"
                  : "Maica is speaking",
            }
          : current
      );
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "The simulation could not answer."
      );
    } finally {
      busyRef.current = false;
      setIsSending(false);
    }
  };

  const changeWorld = async (nextWorld: "living-room" | "music-room") => {
    if (!session || session.world === nextWorld) return;
    try {
      const result = await postSimulationWorld({
        sessionId: session.sessionId,
        world: nextWorld,
      });
      setSession((current) =>
        current
          ? {
              ...current,
              world: result.world,
              currentActivity: result.currentActivity,
            }
          : current
      );
    } catch (worldError) {
      setError(
        worldError instanceof Error ? worldError.message : "Could not change world."
      );
    }
  };

  // Convert messages for the editorial overlay
  const overlayMessages: SimulationMessage[] = useMemo(() => {
    return messages.map((m) => ({
      id: m.messageId,
      speaker: m.speaker as Speaker,
      text: m.text,
      time: new Date(m.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    }));
  }, [messages]);

  const activeAgent = useMemo(() => {
    const last = messages.at(-1)?.speaker;
    if (last === "clint" || last === "maica") return last;
    if (
      dayCycle.primaryAgent === "clint" ||
      dayCycle.primaryAgent === "maica"
    ) {
      return dayCycle.primaryAgent;
    }
    return null;
  }, [messages, dayCycle.primaryAgent]);

  const activeTrack = useMemo(() => {
    return (
      musicLibrary.find((track) => track.id === session?.activeMusic) ?? null
    );
  }, [session?.activeMusic]);

  return (
    <main className={styles.shell}>
      {/* Layer 1: The World (3D R3F Core, Agents & Orbits + Observatory Canvas) */}
      <div className={styles.canvasLayer} aria-hidden="true">
        <StarfieldCanvas />
        <SimulationWorld
          activeSpeaker={activeAgent}
          isObserving={isObserving}
          isPlayingMusic={youtubePlayer.status === "playing"}
          onSelectSpeaker={(speaker) => setActiveSpeaker(speaker)}
        />
      </div>

      <div className={styles.vignette} />
      <div className={styles.observatoryGrid} />

      {/* Kinetic Typography Moments */}
      <KineticOverlay
        activeSpeaker={activeAgent}
        isObserving={isObserving}
        sharedActivity={dayCycle.sharedActivity}
        timeLabel={dayCycle.timeLabel}
      />

      {/* Header: Minimal Scientific Overlay */}
      <header className={styles.header}>
        <div className={styles.brandCluster}>
          <div className={styles.statusIndicator} />
          <div className={styles.brandText}>
            <span className={styles.brandKicker}>
              AT-UNIVERSE · SYSTEM OBSERVATORY
            </span>
            <h1 className={styles.brandTitle}>Clint &amp; Maica</h1>
          </div>
        </div>

        <div className={styles.headerMeta}>
          <span
            className={`${styles.metaTag} ${
              engineStatus?.geminiConfigured ? styles.metaTagActive : ""
            }`}
          >
            {engineStatus?.geminiConfigured ? "✨ GEMINI AI" : "📜 SCRIPTED"}
          </span>
          <span className={styles.metaTag}>{dayCycle.phase.toUpperCase()}</span>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setIsTelemetryOpen(true)}
            aria-label="Simulation telemetry and status"
            title="Open system diagnostics"
          >
            <Activity size={14} />
          </button>
        </div>
      </header>

      {/* Subtle Side Telemetry Pins */}
      <div className={styles.agentHudLeft}>
        <span className={styles.hudPip}>NODE 01 // CLINT</span>
        <span className={styles.hudVal}>{dayCycle.clintActivity}</span>
      </div>
      <div className={styles.agentHudRight}>
        <span className={styles.hudPip}>NODE 02 // MAICA</span>
        <span className={styles.hudVal}>{dayCycle.maicaActivity}</span>
      </div>

      {/* Floating Bottom Instrument Stack */}
      <div className={styles.bottomStack}>
        {playbackNotice && (
          <div className={styles.playbackNotice}>{playbackNotice}</div>
        )}
        {error && <div className={styles.errorBar}>{error}</div>}

        {/* 24-Hour Scientific Simulation Timeline */}
        <SimulationTimeline dayCycle={dayCycle} />

        {/* Editorial Non-Boxed Dialogue Overlay */}
        <ConversationOverlay
          messages={overlayMessages}
          activeSpeaker={activeSpeaker}
          onToggleSpeaker={() =>
            setActiveSpeaker((c) => (c === "clint" ? "maica" : "clint"))
          }
          draft={draft}
          onDraftChange={setDraft}
          onSend={() => void sendMessage()}
          isSending={isSending}
          disabled={!session}
          isCollapsed={isConversationCollapsed}
          onToggleCollapse={() => setIsConversationCollapsed((c) => !c)}
          onLoadMoreHistory={() => void loadOlderMessages()}
          hasMoreHistory={hasOlderMessages}
          isLoadingHistory={isLoadingOlder}
        />
      </div>

      {/* Hidden Persistent YouTube Audio Mount */}
      <div className={styles.hiddenAudioMount} aria-hidden="true">
        <div id="simulation-yt-mount" ref={youtubePlayer.mountRef} />
      </div>

      {/* Layer 3: Interaction - Minimal Instrument Control Strip */}
      <SimulationControls
        currentWorld={
          (session?.world as "living-room" | "music-room") || "living-room"
        }
        onSelectWorld={(world) => void changeWorld(world)}
        isObserving={isObserving}
        onToggleObserving={() => setIsObserving((c) => !c)}
        isPlayingMusic={youtubePlayer.status === "playing"}
        activeTrack={activeTrack}
        onTogglePlayMusic={() => youtubePlayer.togglePlay()}
        isMusicDrawerOpen={isMusicDrawerOpen}
        onToggleMusicDrawer={() => setIsMusicDrawerOpen((open) => !open)}
      />

      {/* Refined Audio Archive Drawer */}
      <MusicDrawer
        isOpen={isMusicDrawerOpen}
        onClose={() => setIsMusicDrawerOpen(false)}
        activeTrack={activeTrack}
        isPlaying={youtubePlayer.status === "playing"}
        youtubePlayer={youtubePlayer}
        musicLibrary={musicLibrary}
        onSelectTrack={playTrack}
        onPrevTrack={() => advanceQueue(-1)}
        onNextTrack={() => advanceQueue(1)}
        clintReaction={
          messages.filter((m) => m.speaker === "clint").at(-1)?.text ?? null
        }
        maicaReaction={
          messages.filter((m) => m.speaker === "maica").at(-1)?.text ?? null
        }
      />

      {/* Telemetry & State Side Panel */}
      {isTelemetryOpen && (
        <aside className={styles.sidePanel}>
          <div className={styles.sidePanelHead}>
            <div>
              <span className={styles.panelKicker}>DIAGNOSTIC PROTOCOL</span>
              <h3>System Telemetry</h3>
            </div>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setIsTelemetryOpen(false)}
              aria-label="Close telemetry"
            >
              <X size={15} />
            </button>
          </div>

          <div className={styles.controlBlock}>
            <span>PERSISTENT SESSION</span>
            <strong>{session ? "ACTIVE" : "INITIALIZING"}</strong>
            <small>
              Session ID: {session?.sessionId.slice(0, 16)}...
              <br />
              Transmissions: {messages.length}
            </small>
          </div>

          <div className={styles.controlBlock}>
            <span>INTELLIGENCE ENGINE</span>
            <strong>
              {engineStatus?.geminiConfigured
                ? "Gemini 3.5 Flash Lite"
                : "Scripted Dialogue Engine"}
            </strong>
            <small>
              {engineStatus?.geminiConfigured
                ? "Live multimodal model executing character simulation and emotional memory."
                : "Deterministic relational dialog matrix running offline in browser."}
            </small>
          </div>

          <div className={styles.controlBlock}>
            <span>TIME &amp; ROUTINE</span>
            <strong>
              {dayCycle.timeLabel} · {dayCycle.dayLabel}
            </strong>
            <small>
              Phase: {dayCycle.phase.toUpperCase()}
              <br />
              Shared: {dayCycle.sharedActivity}
              <br />
              Clint: {dayCycle.clintDetail}
              <br />
              Maica: {dayCycle.maicaDetail}
            </small>
          </div>

          <div className={styles.controlBlock}>
            <span>REALTIME NETWORK</span>
            <strong>{realtimeStatus}</strong>
            <small>Channel: simulation/main (broadcast active)</small>
          </div>

          <div className={styles.controlBlock}>
            <span>AUDIO STREAM</span>
            <strong>{activeTrack ? activeTrack.title : "SILENT"}</strong>
            <small>
              {activeTrack
                ? `${activeTrack.artist} (${activeTrack.genre})`
                : "Open Music Archive in bottom instrument strip to play."}
            </small>
          </div>
        </aside>
      )}
    </main>
  );
}
