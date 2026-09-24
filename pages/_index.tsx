import React, { useEffect, useRef, useState } from "react";
import type { Group } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, OrbitControls } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Headphones, MessageCircle, Moon, Orbit, Radio, Sparkles, Volume2, X, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useRealtimeChannel, useRealtimeConnectionStatus } from "../components/FlootRealtimeProvider";
import { channels } from "../helpers/realtimeChannels";
import { useYouTubePlayer } from "../helpers/useYouTubePlayer";
import { postSimulationChat } from "../endpoints/simulation/chat_POST.schema";
import { getSimulationSession } from "../endpoints/simulation/session_GET.schema";
import { getSimulationMessages } from "../endpoints/simulation/messages_GET.schema";
import { postSimulationMusic } from "../endpoints/simulation/music_POST.schema";
import { postSimulationSession } from "../endpoints/simulation/session_POST.schema";
import { postSimulationTick } from "../endpoints/simulation/tick_POST.schema";
import { postSimulationWorld } from "../endpoints/simulation/world_POST.schema";
import type { OutputType as SessionOutput } from "../endpoints/simulation/session_POST.schema";
import { getSimulationDayCycle, type RoutineSnapshot } from "../helpers/simulationDayCycle";
import { musicLibrary } from "../helpers/musicLibrary";
import styles from "./_index.module.css";

type Speaker = "clint" | "maica";
type Message = SessionOutput["messages"][number];
const SIMULATION_SESSION_VERSION = "scripted-v6";

const MUSIC_CATEGORIES = [
  { id: "all", label: "All sounds", icon: "◌" },
  { id: "pop", label: "🌤️ Golden Hour", icon: "☀" },
  { id: "soft-rock", label: "💿 Vintage Room", icon: "◈" },
  { id: "indie", label: "🌿 Twilight Garden", icon: "✦" },
  { id: "jazz", label: "☕ Rainy Café", icon: "☕" },
  { id: "cinematic", label: "🎬 Dream Theater", icon: "◒" },
  { id: "opm", label: "🇵🇭 Home at Night", icon: "⌂" },
  { id: "emo", label: "🖤 Midnight Room", icon: "☾" },
] as const;

function MusicWorld({
  session,
  onSelectTrack,
}: {
  session: SessionOutput;
  onSelectTrack: (trackId: string) => Promise<void>;
}) {
  const [category, setCategory] = useState("all");
  const activeTrack = musicLibrary.find((track) => track.id === session.activeMusic);
  const tracks = musicLibrary.filter((track) => category === "all" || track.roomIds.includes(category));
  const clintReaction = activeTrack?.description.match(/\*\*Clint:\*\*\n([\s\S]*?)(?:\n\n|$)/)?.[1]?.trim();
  const maicaReaction = activeTrack?.description.match(/\*\*Maica:\*\*\n([\s\S]*)$/)?.[1]?.trim();

  return (
    <section className={styles.musicWorld}>
      <div className={styles.musicWorldHead}>
        <div>
          <span className={styles.panelKicker}>◒ MUSIC WORLD · SHARED LISTENING</span>
          <h2>{activeTrack?.title ?? "Choose a track"}</h2>
          <p>{activeTrack?.artist ?? "The room is waiting."}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={styles.playMoodButton}
          onClick={() => void onSelectTrack(tracks[Math.floor(Math.random() * tracks.length)]?.id ?? tracks[0]?.id)}
          disabled={tracks.length === 0}
        >
          <Play size={13} /> Play {category === "all" ? "something" : "this mood"}
        </Button>
      </div>

      <div className={styles.musicAgents}>
        <div className={styles.musicAgent}>
          <span className={styles.musicAgentGlyph}>C</span>
          <div><strong>CLINT</strong><p>{clintReaction ?? "Listening quietly."}</p></div>
        </div>
        <div className={styles.musicAgent}>
          <span className={styles.musicAgentGlyph}>M</span>
          <div><strong>MAICA</strong><p>{maicaReaction ?? "Just listening."}</p></div>
        </div>
      </div>

      <div className={styles.musicCategories}>
        {MUSIC_CATEGORIES.map((item) => (
          <button key={item.id} type="button" className={category === item.id ? styles.musicCategoryActive : styles.musicCategory} onClick={() => setCategory(item.id)}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
      </div>

      <div className={styles.musicTrackGrid}>
        {tracks.map((track) => (
          <button
            key={track.id}
            type="button"
            className={track.id === activeTrack?.id ? styles.trackCardActive : styles.trackCard}
            onClick={() => void onSelectTrack(track.id)}
          >
            <img src={track.coverImage} alt="" loading="lazy" />
            <span className={styles.trackCardBody}>
              <strong>{track.title}</strong>
              <small>{track.artist} · {track.year}</small>
              <span>{track.tags.slice(0, 3).join(" · ")}</span>
            </span>
            {track.id === activeTrack?.id && <span className={styles.trackPlayingMark}>▶</span>}
          </button>
        ))}
      </div>
    </section>
  );
}

function OrbitalCore({ active }: { active: Speaker | null }) {
  const group = React.useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = clock.getElapsedTime() * (active ? 0.13 : 0.06);
    group.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.35) * 0.08;
  });
  return (
    <group ref={group}>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[1.15, 64, 64]} />
        <meshStandardMaterial color="#171a1f" emissive={active === "maica" ? "#d8bc72" : "#8fa8bd"} emissiveIntensity={active ? 0.34 : 0.18} roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2.8, 0.2, 0.4]}>
        <torusGeometry args={[1.65, 0.012, 12, 220]} />
        <meshBasicMaterial color="#d8bc72" transparent opacity={active ? 0.62 : 0.38} />
      </mesh>
      <mesh position={[0, 0.35, 0]} rotation={[0.4, Math.PI / 2.5, 0]}>
        <torusGeometry args={[1.95, 0.007, 12, 220]} />
        <meshBasicMaterial color="#8fa8bd" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

function SimulatedWorld({ active }: { active: Speaker | null }) {
  return (
    <Canvas camera={{ position: [0, 0.8, 7], fov: 42 }} dpr={[1, 1.6]}>
      <color attach="background" args={["#080b12"]} />
      <fog attach="fog" args={["#080b12", 6, 16]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[2.8, 2.5, 3]} color="#d8bc72" intensity={7} distance={10} />
      <pointLight position={[-3, -0.8, 1]} color="#7f9ab8" intensity={5} distance={8} />
      <Stars radius={28} depth={22} count={1400} factor={1.2} saturation={0} fade speed={0.25} />
      <Float speed={0.8} rotationIntensity={0.08} floatIntensity={0.4}>
        <OrbitalCore active={active} />
      </Float>
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.35} maxPolarAngle={Math.PI / 1.65} autoRotate autoRotateSpeed={0.24} />
    </Canvas>
  );
}

export default function IndexPage() {
  const [session, setSession] = useState<SessionOutput | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeSpeaker, setActiveSpeaker] = useState<Speaker>("clint");
  const [isPanelOpen, setPanelOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isObserving, setIsObserving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dayCycle, setDayCycle] = useState<RoutineSnapshot>(() => getSimulationDayCycle());
  const [hasOlderMessages, setHasOlderMessages] = useState(false);
  const [olderMessagesCursor, setOlderMessagesCursor] = useState<string | null>(null);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [playbackNotice, setPlaybackNotice] = useState<string | null>(null);
  const busyRef = useRef(false);
  const messageScrollRef = useRef<HTMLDivElement | null>(null);
  const stickToBottomRef = useRef(true);
  const realtimeStatus = useRealtimeConnectionStatus();
  const youtubePlayer = useYouTubePlayer();
  const fallbackAttemptRef = useRef<{ trackId: string; index: number } | null>(null);
  const hydratePlayerRef = useRef(true);

  useEffect(() => {
    const activeTrack = musicLibrary.find((track) => track.id === session?.activeMusic);
    if (hydratePlayerRef.current && youtubePlayer.isReady && activeTrack) {
      youtubePlayer.cueVideoId(activeTrack.youtubeId);
      hydratePlayerRef.current = false;
    }
  }, [youtubePlayer.isReady, session?.activeMusic, youtubePlayer.cueVideoId]);

  const applyMessage = (nextMessage: Message) => {
    setMessages((current) => {
      if (current.some((item) => item.messageId === nextMessage.messageId)) return current;
      const next = [...current, nextMessage];
      return next.length > 100 ? next.slice(-100) : next;
    });
  };

  const persistMusicSelection = async (trackId: string) => {
    if (!session) return;
    setError(null);
    try {
      const result = await postSimulationMusic({ sessionId: session.sessionId, trackId });
      result.messages.forEach((message) => applyMessage({
        messageId: message.messageId,
        speaker: message.speaker,
        text: message.text,
        source: "simulation",
        interactionId: message.interactionId,
        createdAt: message.createdAt,
      }));
      setSession((current) => current ? {
        ...current,
        activeMusic: result.trackId,
        currentActivity: result.currentActivity,
      } : current);
    } catch (musicError) {
      setError(musicError instanceof Error ? musicError.message : "Could not change music.");
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
    const currentIndex = musicLibrary.findIndex((track) => track.id === session.activeMusic);
    const nextIndex = currentIndex === -1
      ? 0
      : (currentIndex + direction + musicLibrary.length) % musicLibrary.length;
    void playTrack(musicLibrary[nextIndex]?.id);
  };

  useEffect(() => {
    youtubePlayer.setOnEnded(() => advanceQueue(1));
    youtubePlayer.setOnError((errorCode) => {
      const track = musicLibrary.find((item) => item.id === session?.activeMusic);
      if (!track) return;
      // YouTube error 2 = invalid id, 5 = HTML5 issue, 100 = removed/private, 101/150 = embedding disabled by the rights holder.
      const candidates = [track.youtubeId, ...(track.fallbackYoutubeIds ?? [])];
      const previousAttempt = fallbackAttemptRef.current?.trackId === track.id ? fallbackAttemptRef.current.index : 0;
      const nextAttempt = previousAttempt + 1;
      if (nextAttempt < candidates.length) {
        fallbackAttemptRef.current = { trackId: track.id, index: nextAttempt };
        youtubePlayer.playVideoId(candidates[nextAttempt]);
      } else {
        setPlaybackNotice(track.title + " isn't playable here right now — skipping to the next track.");
        advanceQueue(1);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const loadOlderMessages = async () => {
    if (!session || !hasOlderMessages || !olderMessagesCursor || isLoadingOlder) return;
    const container = messageScrollRef.current;
    if (!container) return;

    const previousHeight = container.scrollHeight;
    const previousTop = container.scrollTop;
    setIsLoadingOlder(true);

    try {
      const page = await getSimulationMessages(session.sessionId, olderMessagesCursor, 50);
      setMessages((current) => {
        const existing = new Set(current.map((message) => message.messageId));
        const older = page.messages.filter((message) => !existing.has(message.messageId));
        const merged = [...older, ...current];
        return merged.length > 100 ? merged.slice(0, 100) : merged;
      });
      setHasOlderMessages(page.hasMore);
      setOlderMessagesCursor(page.nextBefore);

      requestAnimationFrame(() => {
        const nextContainer = messageScrollRef.current;
        if (!nextContainer) return;
        nextContainer.scrollTop = nextContainer.scrollHeight - previousHeight + previousTop;
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load older messages.");
    } finally {
      setIsLoadingOlder(false);
    }
  };

  const handleMessageScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    stickToBottomRef.current = container.scrollHeight - container.scrollTop - container.clientHeight < 36;
    if (container.scrollTop < 70) void loadOlderMessages();
  };

  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      try {
        const storedVersion = window.localStorage.getItem("simulation-session-version");
        const storedId = storedVersion === SIMULATION_SESSION_VERSION
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
        window.localStorage.setItem("simulation-session-version", SIMULATION_SESSION_VERSION);
        setSession(loaded);
        setMessages(loaded.messages);
        setHasOlderMessages(loaded.messages.length === 50);
        setOlderMessagesCursor(loaded.messages[0]?.createdAt ?? null);
        requestAnimationFrame(() => {
          const container = messageScrollRef.current;
          if (container) container.scrollTop = container.scrollHeight;
        });
      } catch (bootError) {
        if (!cancelled) setError(bootError instanceof Error ? bootError.message : "Could not initialize the simulation.");
      }
    };
    void boot();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const update = () => setDayCycle(getSimulationDayCycle());
    update();
    const timer = window.setInterval(update, 15000);
    return () => window.clearInterval(timer);
  }, []);

  useRealtimeChannel(channels.simulation("main"), (event: any) => {
    if (!session || event?.sessionId !== session.sessionId) return;
    if (event.type === "simulation.world") {
      setSession((current) => current ? { ...current, world: event.world, currentActivity: event.currentActivity } : current);
      return;
    }
    if (event.type === "simulation.message") {
      applyMessage(event.message);
      setSession((current) => current ? { ...current, currentActivity: event.currentActivity } : current);
      return;
    }
    if (event.type === "simulation.music") {
      event.messages?.forEach((message: Message) => applyMessage({
        ...message,
        source: "simulation",
      }));
      setSession((current) => current ? {
        ...current,
        activeMusic: event.trackId,
        currentActivity: event.currentActivity,
      } : current);
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
      setSession((current) => current ? { ...current, currentActivity: event.speaker === "clint" ? "Clint is speaking" : "Maica is speaking" } : current);
    }
  });

  const runTick = async () => {
    if (!session || busyRef.current) return null;
    busyRef.current = true;
    setIsSending(true);
    setError(null);
    try {
      const result = await postSimulationTick({ sessionId: session.sessionId });
      applyMessage(result.message);
      setSession((current) => current ? { ...current, currentActivity: result.currentActivity } : current);
      return result;
    } catch (tickError) {
      setError(tickError instanceof Error ? tickError.message : "The simulation could not continue.");
      return null;
    } finally {
      busyRef.current = false;
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (!isObserving || !session) return;

    let cancelled = false;
    let timer: number | undefined;

    const loop = async () => {
      if (cancelled) return;

      const next = await runTick();
      if (cancelled) return;

      const lastDelay = next?.nextDelayMs ?? (30000 + Math.floor(Math.random() * 30000));
      timer = window.setTimeout(loop, lastDelay);
    };

    void loop();

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [isObserving, session?.sessionId]);

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
      setSession((current) => current ? { ...current, currentActivity: result.speaker === "clint" ? "Clint is speaking" : "Maica is speaking" } : current);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "The simulation could not answer.");
    } finally {
      busyRef.current = false;
      setIsSending(false);
    }
  };

  const changeWorld = async (nextWorld: "living-room" | "music-room") => {
    if (!session || session.world === nextWorld) return;
    try {
      const result = await postSimulationWorld({ sessionId: session.sessionId, world: nextWorld });
      setSession((current) => current ? { ...current, world: result.world, currentActivity: result.currentActivity } : current);
    } catch (worldError) {
      setError(worldError instanceof Error ? worldError.message : "Could not change world.");
    }
  };

  const worldLabel = session?.world === "music-room" ? "MUSIC WORLD" : "THE LIVING ROOM";
  const activeAgent = messages.at(-1)?.speaker ?? (
    dayCycle.primaryAgent === "clint" || dayCycle.primaryAgent === "maica"
      ? dayCycle.primaryAgent
      : null
  );

  return (
    <main className={styles.shell}>
      <div className={styles.canvasLayer} aria-hidden="true"><SimulatedWorld active={activeAgent} /></div>
      <div className={styles.vignette} />
      <div className={styles.scanline} />

      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}><span className={styles.signalDot} />{realtimeStatus === "connected" ? "SIMULATION LIVE" : "SIMULATION CONNECTING"} · {dayCycle.timeLabel}</div>
          <h1>Simulation World</h1>
        </div>
        <div className={styles.headerMeta}>
          <span>{worldLabel}</span>
          <span>{dayCycle.dayLabel}</span>
          <Button variant="ghost" size="icon" aria-label="Open simulation controls" onClick={() => setPanelOpen(true)}><Activity size={17} /></Button>
        </div>
      </header>

      <section className={styles.sceneHud}>
        <div className={styles.identityRail}>
          <div className={styles.agentCard + " " + (activeAgent === "clint" ? styles.activeAgent : "")}>
            <div className={styles.agentGlyph}>C</div><div><p>AI CLINT</p><span>{activeAgent === "clint" && messages.length ? "speaking" : dayCycle.clintActivity}</span></div>
          </div>
          <div className={styles.connectionMark}><span />↔<span /></div>
          <div className={styles.agentCard + " " + (activeAgent === "maica" ? styles.activeAgent : "")}>
            <div className={styles.agentGlyph}>M</div><div><p>AI MAICA</p><span>{activeAgent === "maica" && messages.length ? "speaking" : dayCycle.maicaActivity}</span></div>
          </div>
        </div>
        <div className={styles.sceneLabel}>
          <span>WORLD 01 · PERSISTENT SESSION</span>
          <strong>{worldLabel}</strong>
          <small>{isObserving ? session?.currentActivity ?? "Preparing the simulation..." : dayCycle.sharedActivity}</small>
          <small>Next rhythm shift · {dayCycle.nextTransition}</small>
          <small>Clint · {dayCycle.clintDetail}</small>
          <small>Maica · {dayCycle.maicaDetail}</small>
        </div>
      </section>

      <section className={styles.chatPanel}>
        {session?.world === "music-room" ? (
          <MusicWorld session={session} onSelectTrack={playTrack} />
        ) : (
        <>
        <div className={styles.chatHead}>
          <div><span className={styles.panelKicker}><MessageCircle size={14} /> SHARED CONVERSATION</span><h2>{isObserving ? "They are talking." : "They are just living."}</h2></div>
          <div className={styles.aiStatus}><span /> {isObserving ? "autonomous mode" : "human guided"}</div>
        </div>

        {error && <div className={styles.errorBar}>{error}</div>}

        <div
          ref={messageScrollRef}
          className={styles.messages}
          onScroll={handleMessageScroll}
          role="log"
          aria-live="polite"
          aria-label="Simulation conversation"
        >
          {isLoadingOlder && <div className={styles.historyLoader}>Loading older conversation…</div>}
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <Orbit size={18} /><span>No conversation exists yet.</span><small>Send a message or let them begin without you.</small>
            </div>
          ) : messages.map((message) => (
            <motion.article layout="position" key={message.messageId} className={styles.message + " " + (message.source === "user" ? styles.userMessage : (message.speaker === "clint" ? styles.clintMessage : styles.maicaMessage))} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className={styles.messageMeta}>
                <span>{message.source === "user" ? "YOU → " + message.speaker.toUpperCase() : message.speaker === "clint" ? "CLINT" : "MAICA"}</span>
                <time>{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}</time>
              </div>
              <p>{message.text}</p>
            </motion.article>
          ))}
        </div>

        <div className={styles.composer}>
          <Button variant="ghost" size="sm" className={styles.speakerSwitch} onClick={() => setActiveSpeaker((current) => current === "clint" ? "maica" : "clint")} aria-label="Switch message target">
            <span className={styles.smallAgent}>{activeSpeaker === "clint" ? "C" : "M"}</span>{activeSpeaker === "clint" ? "AI CLINT" : "AI MAICA"}
          </Button>
          <Input disabled={!session || isSending} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void sendMessage(); }} placeholder={session ? "Write into the simulation..." : "Initializing session..."} aria-label="Simulation message" />
          <Button size="sm" onClick={() => void sendMessage()} disabled={!session || isSending || !draft.trim()}><Radio size={14} /> {isSending ? "Replying" : "Send"}</Button>
        </div>
        </>
        )}
      </section>

      {(() => {
        const nowPlaying = musicLibrary.find((track) => track.id === session?.activeMusic);
        const progressRatio = youtubePlayer.progress.durationSeconds > 0
          ? youtubePlayer.progress.currentSeconds / youtubePlayer.progress.durationSeconds
          : 0;
        const formatTime = (seconds: number) => {
          const total = Math.max(0, Math.floor(seconds));
          return Math.floor(total / 60) + ":" + String(total % 60).padStart(2, "0");
        };
        return (
          <div className={styles.nowPlayingBar + " " + (nowPlaying ? "" : styles.nowPlayingBarIdle)}>
            {playbackNotice && <div className={styles.playbackNotice}>{playbackNotice}</div>}
            <div className={styles.nowPlayingArt} id="simulation-yt-mount" ref={youtubePlayer.mountRef} />
            <div className={styles.nowPlayingInfo}>
              <strong>{nowPlaying?.title ?? "Nothing playing"}</strong>
              <small>{nowPlaying?.artist ?? "Pick a track in Music World"}</small>
            </div>
            <div className={styles.nowPlayingTransport}>
              <button type="button" disabled={!nowPlaying} aria-label="Previous track" onClick={() => advanceQueue(-1)}><SkipBack size={15} /></button>
              <button type="button" disabled={!nowPlaying} className={styles.nowPlayingPlayButton} aria-label={youtubePlayer.status === "playing" ? "Pause" : "Play"} onClick={() => youtubePlayer.togglePlay()}>
                {youtubePlayer.status === "playing" ? <Pause size={15} /> : <Play size={15} />}
              </button>
              <button type="button" disabled={!nowPlaying} aria-label="Next track" onClick={() => advanceQueue(1)}><SkipForward size={15} /></button>
            </div>
            <div className={styles.nowPlayingProgress}>
              <span>{formatTime(youtubePlayer.progress.currentSeconds)}</span>
              <div
                className={styles.nowPlayingProgressTrack}
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  youtubePlayer.seekToRatio((event.clientX - rect.left) / rect.width);
                }}
              >
                <div className={styles.nowPlayingProgressFill} style={{ width: (progressRatio * 100) + "%" }} />
              </div>
              <span>{formatTime(youtubePlayer.progress.durationSeconds)}</span>
            </div>
            <div className={styles.nowPlayingVolume}>
              <Volume2 size={14} />
              <input
                type="range"
                min={0}
                max={100}
                value={youtubePlayer.volume}
                onChange={(event) => youtubePlayer.setVolume(Number(event.target.value))}
                aria-label="Volume"
              />
            </div>
          </div>
        );
      })()}

      <footer className={styles.footerBar}>
        <Button variant="ghost" size="sm" onClick={() => void changeWorld("living-room")} className={session?.world === "living-room" ? styles.worldButtonActive : styles.worldButton}><Orbit size={15} />Living Room</Button>
        <Button variant="ghost" size="sm" onClick={() => void changeWorld("music-room")} className={session?.world === "music-room" ? styles.worldButtonActive : styles.worldButton}><Headphones size={15} />Music World</Button>
        <Button variant={isObserving ? "secondary" : "primary"} size="sm" onClick={() => setIsObserving((current) => !current)} disabled={!session || isSending}>
          {isObserving ? <Pause size={14} /> : <Play size={14} />} {isObserving ? "Stop observing" : "Observe AI Simulation"}
        </Button>
        <div className={styles.footerHint}><Moon size={14} /> Scripted engine <strong>{isObserving ? "active" : "idle"}</strong></div>
      </footer>

      <AnimatePresence>
        {isPanelOpen && (
          <motion.aside className={styles.sidePanel} initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}>
            <div className={styles.sidePanelHead}>
              <div><span className={styles.panelKicker}><Sparkles size={14} /> SIMULATION CONTROL</span><h3>World state</h3></div>
              <Button variant="ghost" size="icon" onClick={() => setPanelOpen(false)} aria-label="Close controls"><X size={17} /></Button>
            </div>
            <div className={styles.controlBlock}><span>SESSION</span><strong>{session ? "Persistent" : "Starting..."}</strong><small>Messages and world state are stored in Postgres.</small></div>
            <div className={styles.controlBlock}><span>DAY CYCLE</span><strong>{dayCycle.phase}</strong><small>{dayCycle.dateLabel} · {dayCycle.timeLabel} · Asia/Manila</small></div>
            <div className={styles.controlBlock}><span>AUTONOMOUS SIMULATION</span><strong>{isObserving ? "Running" : "Idle"}</strong><small>Fully scripted, no external AI calls. The random-event and dialogue engine runs locally, on or off.</small></div>
            <div className={styles.controlBlock}><span>RIGHT NOW</span><strong>{dayCycle.sharedActivity}</strong><small>Clint · {dayCycle.clintActivity}<br />Maica · {dayCycle.maicaActivity}</small></div>
            <div className={styles.controlBlock}><span>REALTIME</span><strong>{realtimeStatus}</strong><small>World changes and simulation turns are broadcast to connected clients.</small></div>
            <div className={styles.controlBlock}><span>MUSIC WORLD</span><strong>{musicLibrary.length} tracks</strong><small>YouTube embeds come directly from the music library. Track selection, agent reactions, and active music are persisted in Postgres.</small></div>
          </motion.aside>
        )}
      </AnimatePresence>
    </main>
  );
}