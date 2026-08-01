"use client";

import { useState, useCallback } from "react";
import RocketReader from "@/components/RocketReader";

const DEMO = `def fibonacci(n: int) -> list[int]:
    """Return the first n Fibonacci numbers."""
    if n <= 0:
        return []
    seq = [0, 1]
    while len(seq) < n:
        seq.append(seq[-1] + seq[-2])
    return seq[:n]

class Analyzer:
    def __init__(self, data: list[int]):
        self.data = data

    def mean(self) -> float:
        return sum(self.data) / len(self.data) if self.data else 0.0

if __name__ == "__main__":
    nums = fibonacci(12)
    print(Analyzer(nums).mean())
`;

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [explanation, setExplanation] = useState("");
  const [evalId, setEvalId] = useState("");
  const [header, setHeader] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showReader, setShowReader] = useState(false);
  const [mode, setMode] = useState("");

  const handleFile = useCallback((f: File | null) => {
    setFile(f);
    setExplanation("");
    setEvalId("");
    setHeader(null);
    setError("");
    setMode("");
    if (!f) { setContent(""); return; }
    const r = new FileReader();
    r.onload = (e) => setContent((e.target?.result as string) || "");
    r.readAsText(f);
  }, []);

  const loadDemo = () => {
    setFile(null);
    setContent(DEMO);
    setExplanation("");
    setEvalId("");
    setHeader(null);
    setError("");
    setMode("");
  };

  const generate = async () => {
    if (!content) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file?.name || "demo.py", content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setExplanation(data.explanation);
      setEvalId(data.id);
      setHeader(data.header);
      setMode(data.mode);
      setShowReader(true);
    } catch (e: any) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-10 md:px-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-medium tracking-widest text-[#ff6b00]">RRS</p>
          <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Rocket Reader SomaCoSF
          </h1>
          <p className="text-sm text-[#8888a0] max-w-md">
            Reverse RSS. Drop a file, get a UUIDv8-backed explanation, absorb it at speed.
          </p>
        </header>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f && (f.name.endsWith(".md") || f.name.endsWith(".py") || f.name.endsWith(".txt"))) {
              handleFile(f);
            } else setError("Use .md, .py or .txt");
          }}
          className="relative rounded-lg border border-dashed border-[#2a2a32] bg-[#141418] px-6 py-12 text-center transition hover:border-[#ff6b00]/50"
        >
          <input
            type="file"
            accept=".md,.py,.txt,text/markdown,text/x-python,text/plain"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
          />
          <p className="text-sm text-[#e8e8ec]">{file ? file.name : "Drop .md / .py / .txt or click"}</p>
          <p className="mt-1 text-xs text-[#55556a]">or load the demo below</p>
        </div>

        {content && (
          <div className="rounded-lg border border-[#2a2a32] bg-[#141418] overflow-hidden">
            <div className="flex justify-between border-b border-[#2a2a32] px-3 py-1.5 text-[11px] text-[#55556a]">
              <span>preview</span>
              <span>{content.length.toLocaleString()} chars</span>
            </div>
            <pre className="max-h-36 overflow-auto p-3 font-mono text-xs text-[#8888a0] whitespace-pre-wrap">
              {content.slice(0, 700)}{content.length > 700 ? "…" : ""}
            </pre>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button onClick={loadDemo} className="rounded-md border border-[#2a2a32] px-4 py-2 text-sm text-[#e8e8ec] hover:border-[#444] hover:bg-[#141418]">
            Load demo
          </button>
          <button onClick={generate} disabled={!content || loading} className="rounded-md bg-[#ff6b00] px-5 py-2 text-sm font-medium text-black disabled:opacity-40 hover:bg-[#ff8533]">
            {loading ? "Generating…" : "Generate + launch"}
          </button>
          {explanation && !showReader && (
            <button onClick={() => setShowReader(true)} className="rounded-md border border-[#ff6b00]/60 px-4 py-2 text-sm text-[#ff6b00] hover:bg-[#ff6b00]/10">
              Re-open reader
            </button>
          )}
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        {header && (
          <div className="rounded-lg border border-[#2a2a32] bg-[#141418] p-4 font-mono text-xs space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-[#55556a] mb-2">eval · uuidv8</div>
            <div><span className="text-[#55556a]">id</span> {header.id}</div>
            <div><span className="text-[#55556a]">model</span> {header.model}</div>
            <div><span className="text-[#55556a]">mode</span> {header.mode}</div>
            <div><span className="text-[#55556a]">words</span> {header.wordCount} · {header.wpmTarget} wpm</div>
          </div>
        )}

        <footer className="pt-6 border-t border-[#1a1a20] text-[11px] text-[#55556a] space-y-1">
          <p>Header: <code className="text-[#8888a0]"># RRS: https://rr.somacosf.com/e/&lt;uuidv8&gt;</code></p>
          <p>Repo: github.com/SoMaCoSF/rocket-reader-somacosf</p>
        </footer>
      </div>

      {showReader && explanation && (
        <RocketReader text={explanation} onClose={() => setShowReader(false)} initialWpm={300} evalId={evalId} />
      )}
    </main>
  );
}
