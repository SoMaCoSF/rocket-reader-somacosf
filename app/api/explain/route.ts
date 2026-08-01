import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { uuidv8 } from "@/lib/uuidv8";

export const maxDuration = 60;

const OPENROUTER_BASE = "https://openrouter.ai/api/v1";
const FREE_MODELS = [
  "meta-llama/llama-3.1-8b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
  "google/gemma-2-9b-it:free",
  "qwen/qwen-2-7b-instruct:free",
];

function mockExplain(filename: string, content: string): string {
  const isPython = filename.endsWith(".py") || content.includes("def ") || content.includes("import ");
  const isMd = filename.endsWith(".md") || content.startsWith("#");
  const lines = content.split("\n").filter((l) => l.trim()).length;
  const chars = content.length;

  if (isPython) {
    const defs = (content.match(/def\s+\w+/g) || []).map((d) => d.replace("def ", ""));
    const classes = (content.match(/class\s+\w+/g) || []).map((c) => c.replace("class ", ""));
    return `This Python module spans roughly ${lines} lines. ${
      classes.length ? `It defines classes: ${classes.join(", ")}. ` : ""
    }${defs.length ? `Key functions include ${defs.slice(0, 6).join(", ")}. ` : ""}Start at the imports, then walk the class hierarchy and standalone helpers. The entry point is usually at the bottom under a main guard. This structural map is designed for rapid absorption in Rocket Reader mode.`;
  }
  if (isMd) {
    const headings = (content.match(/^#{1,3}\s+.+$/gm) || []).slice(0, 8);
    return `Markdown document of ${lines} lines. ${
      headings.length ? `Primary sections: ${headings.map((h) => h.replace(/^#+\s+/, "")).join("; ")}. ` : ""
    }Read for claims, code blocks, and conclusions. Tuned for single-word RSVP at three hundred words per minute.`;
  }
  return `File received: ${filename} (${lines} lines, ${chars} characters). Prepared for Rocket Reader absorption.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filename, content, model } = body as { filename?: string; content?: string; model?: string };
    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }
    const truncated = content.length > 14000 ? content.slice(0, 14000) + "\n\n...[truncated]..." : content;
    const evalId = uuidv8();
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    let explanation: string;
    let usedModel = "local-structural";
    let mode: "mock" | "openrouter" | "openai" = "mock";

    if (openrouterKey) {
      const chosen = model && FREE_MODELS.includes(model) ? model : FREE_MODELS[0];
      const openrouter = createOpenAI({ apiKey: openrouterKey, baseURL: OPENROUTER_BASE });
      const { text } = await generateText({
        model: openrouter(chosen),
        system: `You write short technical explanations for RSVP speed reading. Short sentences. No markdown headings or bullets. Flowing prose. 280-420 words. Cover purpose, structure, risks, how to review.`,
        prompt: `Filename: ${filename || "unknown"}\n\n\`\`\`\n${truncated}\n\`\`\`\n\nExplain for rapid absorption.`,
      });
      explanation = text;
      usedModel = chosen;
      mode = "openrouter";
    } else if (openaiKey) {
      const openai = createOpenAI({ apiKey: openaiKey });
      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        system: `Concise technical explanations for RSVP. Short sentences, no markdown, 280-420 words.`,
        prompt: `File: ${filename}\n\n${truncated}\n\nExplain clearly.`,
      });
      explanation = text;
      usedModel = "gpt-4o-mini";
      mode = "openai";
    } else {
      explanation = mockExplain(filename || "file", truncated);
    }

    const header = {
      id: evalId,
      version: "uuidv8",
      filename: filename || "unknown",
      model: usedModel,
      mode,
      createdAt: new Date().toISOString(),
      wpmTarget: 300,
      charCount: explanation.length,
      wordCount: explanation.split(/\s+/).filter(Boolean).length,
      tags: [
        filename?.endsWith(".py") ? "python" : null,
        filename?.endsWith(".md") ? "markdown" : null,
        "rrs",
      ].filter(Boolean),
    };

    return NextResponse.json({ id: evalId, header, explanation, mode, model: usedModel });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Explanation failed" }, { status: 500 });
  }
}
