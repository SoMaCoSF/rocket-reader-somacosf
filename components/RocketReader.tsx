"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Props {
  text: string;
  onClose: () => void;
  initialWpm?: number;
  evalId?: string;
}

function orpIndex(word: string): number {
  const n = word.length;
  if (n <= 1) return 0;
  if (n <= 3) return 0;
  if (n <= 5) return 1;
  if (n <= 9) return 2;
  if (n <= 13) return 3;
  return Math.floor(n / 3);
}

export default function RocketReader({ text, onClose, initialWpm = 300, evalId }: Props) {
  const words = text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const [index, setIndex] = useState(0);
  const [wpm, setWpm] = useState(initialWpm);
  const [playing, setPlaying] = useState(true);
  const [bold, setBold] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const word = words[index] || "";
  const i = orpIndex(word);
  const before = word.slice(0, i);
  const focus = word[i] || "";
  const after = word.slice(i + 1);

  const advance = useCallback(() => {
    setIndex((x) => {
      if (x >= words.length - 1) {
        setPlaying(false);
        return x;
      }
      return x + 1;
    });
  }, [words.length]);

  useEffect(() => {
    if (!playing || !words.length) return;
    const base = 60000 / wpm;
    const extra = word.length > 8 ? 80 : word.endsWith(".") || word.endsWith(",") ? 120 : 0;
    timer.current = setTimeout(advance, Math.max(80, base + extra));
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [playing, index, wpm, advance, words, word]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === "ArrowUp") setWpm((w) => Math.min(1000, w + 25));
      else if (e.key === "ArrowDown") setWpm((w) => Math.max(50, w - 25));
      else if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") { setIndex((x) => Math.max(0, x - 1)); setPlaying(false); }
      else if (e.key === "ArrowRight") setIndex((x) => Math.min(words.length - 1, x + 1));
      else if (e.key === "Home") setIndex(0);
      else if (e.key === "End") { setIndex(words.length - 1); setPlaying(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, words.length]);

  const progress = words.length ? ((index + 1) / words.length) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-[#2a2a32] bg-[#0c0c0e] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#2a2a32] px-4 py-2.5">
          <span className="text-xs font-medium tracking-wide text-[#8888a0]">
            RRS · {evalId ? evalId.slice(0, 8) : "demo"} · {index + 1}/{words.length}
          </span>
          <button onClick={onClose} className="text-[#8888a0] hover:text-white text-lg leading-none">×</button>
        </div>
        <div className="relative flex h-48 items-center justify-center bg-[#141418] md:h-56">
          <div className="absolute inset-y-0 left-1/2 w-px bg-[#2a2a32]" />
          <div className={`rocket-word select-none text-4xl md:text-5xl ${bold ? "font-bold" : "font-medium"}`} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            <span className="text-[#e8e8ec]">{before}</span>
            <span className="font-semibold text-[#ff6b00]">{focus}</span>
            <span className="text-[#e8e8ec]">{after}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#2a2a32] px-4 py-3">
          <div className="text-sm text-[#8888a0]"><span className="text-[#e8e8ec] font-medium">{wpm}</span> wpm</div>
          <div className="flex items-center gap-1">
            <button onClick={() => setBold((b) => !b)} className={`h-8 w-8 rounded text-xs font-semibold ${bold ? "bg-[#ff6b00] text-black" : "bg-[#1a1a20] text-[#e8e8ec] hover:bg-[#222]"}`}>B</button>
            <button onClick={() => setWpm((w) => Math.max(50, w - 25))} className="h-8 w-8 rounded bg-[#1a1a20] text-[#e8e8ec] hover:bg-[#222]">−</button>
            <button onClick={() => setWpm((w) => Math.min(1000, w + 25))} className="h-8 w-8 rounded bg-[#1a1a20] text-[#e8e8ec] hover:bg-[#222]">+</button>
            <button onClick={() => setPlaying((p) => !p)} className="h-8 w-8 rounded bg-[#1a1a20] text-[#e8e8ec] hover:bg-[#222] text-sm">{playing ? "‖" : "▶"}</button>
            <button onClick={onClose} className="h-8 w-8 rounded bg-[#1a1a20] text-[#e8e8ec] hover:bg-[#222]">×</button>
          </div>
        </div>
        <div className="h-1 bg-[#1a1a20]"><div className="h-full bg-[#ff6b00] transition-all duration-100" style={{ width: `${progress}%` }} /></div>
        <div className="flex flex-wrap gap-x-4 px-4 py-2 text-[11px] text-[#55556a]">
          <span>Space play/pause</span><span>↑↓ speed</span><span>←→ step</span><span>Esc close</span>
        </div>
      </div>
    </div>
  );
}
