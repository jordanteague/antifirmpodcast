"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type PlayerState = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  playing: boolean;
  current: number;
  duration: number;
  rate: number;
  toggle: () => void;
  seek: (sec: number, play?: boolean) => void;
  cycleRate: () => void;
  /** The embedded YouTube video, once someone has started it. Seeks go to it from then on. */
  video: { start: number } | null;
  startVideo: (at?: number) => void;
  videoRef: React.RefObject<HTMLIFrameElement | null>;
};

const Ctx = createContext<PlayerState | null>(null);
const RATES = [1, 1.25, 1.5, 2];

export function PlayerProvider({ src, initialDuration, children }: { src: string | null; initialDuration: number; children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(initialDuration);
  const [rate, setRate] = useState(1);
  const [video, setVideo] = useState<{ start: number } | null>(null);
  const videoRef = useRef<HTMLIFrameElement | null>(null);

  const ytCommand = useCallback((func: string, args: unknown[] = []) => {
    videoRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), "*");
  }, []);

  const startVideo = useCallback(
    (at?: number) => {
      audioRef.current?.pause();
      setVideo({ start: Math.floor(at ?? audioRef.current?.currentTime ?? 0) });
    },
    [],
  );

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setCurrent(a.currentTime);
    const onMeta = () => Number.isFinite(a.duration) && a.duration > 0 && setDuration(a.duration);
    const onPlay = () => {
      setPlaying(true);
      ytCommand("pauseVideo");
    };
    const onPause = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onPause);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onPause);
    };
  }, [ytCommand]);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) void a.play();
    else a.pause();
  }, []);

  const seek = useCallback((sec: number, play = true) => {
    if (video) {
      ytCommand("seekTo", [sec, true]);
      if (play) ytCommand("playVideo");
      videoRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = sec;
    setCurrent(sec);
    if (play) void a.play();
  }, [video, ytCommand]);

  const cycleRate = useCallback(() => {
    setRate((r) => {
      const next = RATES[(RATES.indexOf(r) + 1) % RATES.length];
      if (audioRef.current) audioRef.current.playbackRate = next;
      return next;
    });
  }, []);

  return (
    <Ctx.Provider value={{ audioRef, playing, current, duration, rate, toggle, seek, cycleRate, video, startVideo, videoRef }}>
      {src && <audio ref={audioRef} src={src} preload="metadata" />}
      {children}
    </Ctx.Provider>
  );
}

export function usePlayer() {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePlayer must be used inside PlayerProvider");
  return v;
}
