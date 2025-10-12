/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";

type Props = {
  opacity?: number;   // fade-styrke (0–1)
  fontSize?: number;  // px
  fps?: number;       // maks oppdateringer pr sekund
};

export default function MatrixRain({ opacity = 0.06, fontSize = 18, fps = 50 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;


    const setupSize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;
      canvas.style.width = cssW + "px";
      canvas.style.height = cssH + "px";
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontSize}px monospace`;
    };

    setupSize();

    const chars =
      "0123456789@#$%&*()+-=<>[]{}\\/|!?€£¥₿§^~;:.,アカサタナハマヤラワABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const columns = Math.floor(window.innerWidth / fontSize);

    const drops = Array.from({ length: columns }, () =>
      Math.floor(Math.random() * window.innerHeight)
    );
    const speeds = Array.from({ length: columns }, () => 1 + Math.random() * 2);

    const draw = () => {
      ctx.fillStyle = `rgba(0,0,0,${opacity})`;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = 0; i < columns; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const headChar = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = "#baffc1";
        (ctx as any).shadowColor = "#baffc1";
        (ctx as any).shadowBlur = 12;
        ctx.fillText(headChar, x, y);

        (ctx as any).shadowBlur = 0;
        ctx.fillStyle = "rgba(0,255,95,0.75)";
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y - fontSize);
        ctx.fillStyle = "rgba(0,255,95,0.45)";
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y - 2 * fontSize);

        if (y > window.innerHeight + 100 && Math.random() > 0.975) {
          drops[i] = -Math.random() * 20;
        }
        drops[i] += speeds[i];
      }
    };

    let last = 0;
    const interval = 1000 / fps;
    const loop = (t: number) => {
      if (t - last >= interval) {
        last = t;
        draw();
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const onResize = () => {
      setupSize();
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [opacity, fontSize, fps]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 block w-full h-full"
      aria-hidden
    />
  );
}
