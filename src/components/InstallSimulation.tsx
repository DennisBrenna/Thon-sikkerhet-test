"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  showOncePerSession?: boolean;
  minDurationMs?: number;
  redirectTo?: string;
  onFinish?: () => void;
};

const STEPS = [
  "Starter sikkerhetsskann …",
  "Laster ned komponenter …",
  "Verifiserer signaturer …",
  "Installerer moduler …",
  "Aktiverer tillatelser …",
  "Fullfører oppsett …",
];

export default function InstallSimulation({
  showOncePerSession = true,
  minDurationMs = 2500, 
  redirectTo = "/hacked",
  onFinish,
}: Props) {
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const [lines, setLines] = useState<string[]>([]);
  const startRef = useRef<number | null>(null);
  const finishedRef = useRef(false);

  const isMobile = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches,
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (showOncePerSession && sessionStorage.getItem("install-sim-shown") === "1") {
      setVisible(false);
      return;
    }
    sessionStorage.setItem("install-sim-shown", "1");
  }, [showOncePerSession]);

  useEffect(() => {
    if (!visible) return;

    const vibrate = (p: number) => {
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        if ([25, 50, 75, 100].includes(Math.round(p))) navigator.vibrate?.(15);
      }
    };

    const addLine = (text: string) =>
      setLines((prev) => (prev.length > 5 ? [...prev.slice(1), text] : [...prev, text]));

    addLine(STEPS[0]);
    let stepIdx = 0;

    const tick = () => {
      setProgress((prev) => {
        const next = Math.min(100, prev + (Math.random() * 7 + 8));
        progressRef.current = next;
        vibrate(next);

        const thresholds = [5, 25, 45, 65, 85];
        if (stepIdx < thresholds.length && next >= thresholds[stepIdx]) {
          addLine(STEPS[stepIdx + 1]);
          stepIdx++;
        }
        return next;
      });
    };

    const interval = setInterval(tick, 150);
    startRef.current = performance.now();

    const endGuard = setInterval(() => {
      const elapsed = performance.now() - (startRef.current ?? 0);
      if (!finishedRef.current && progressRef.current >= 100 && elapsed >= minDurationMs) {
        finishedRef.current = true;
        clearInterval(interval);
        clearInterval(endGuard);
        (navigator as any)?.vibrate?.([10, 30, 10]);

        setTimeout(() => {
          setVisible(false);
          onFinish?.();
          router.push(redirectTo);
        }, 350);
      }
    }, 80);

    return () => {
      clearInterval(interval);
      clearInterval(endGuard);
    };
  }, [visible, minDurationMs, onFinish, redirectTo, router]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-label="Installerer"
    >
      <div className="w-full sm:w-[26rem] rounded-t-2xl sm:rounded-2xl bg-neutral-900 text-neutral-100 p-5 shadow-2xl border border-neutral-800">
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-400">System</div>
          <div className="text-sm text-neutral-400">Sikkerhetstest</div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-green-500/20 grid place-items-center">
            <span className="text-green-400 font-semibold">QR</span>
          </div>
          <div>
            <div className="font-medium">Installerer</div>
            <div className="text-xs text-neutral-400">Ikke lukk appen</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Status</span>
            <span>{Math.floor(progress)}%</span>
          </div>
        </div>

        <div className="mt-2 h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <ul className="mt-4 space-y-1 text-sm font-mono text-green-300/90 min-h-[5rem]">
          {lines.map((l, i) => (
            <li key={i} className="truncate">{l}</li>
          ))}
          {progress < 100 ? (
            <li className="animate-pulse text-green-400/80">…</li>
          ) : (
            <li className="text-green-400">Ferdig</li>
          )}
        </ul>
      </div>
    </div>
  );
}
