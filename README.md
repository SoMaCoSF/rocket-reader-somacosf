# RRS — Rocket Reader SomaCoSF / Reverse RSS

**Every file gets a UUIDv8-backed speed-read explanation.**  
One header line. Permanent provenance. Absorbed at 300–600 WPM.

```
# RRS: https://rr.somacosf.com/e/<uuidv8>
```

That line is the QR code for the file’s soul.

## Why this exists

Documentation is usually either:
- too shallow (comments), or
- too heavy (wikis that drift)

RRS sits in the middle: a single, permanent, speed-readable explanation that travels with the asset and is addressable forever.

## Live

- Domain target: **https://rr.somacosf.com**
- Project: `rocket-reader-somacosf` (this repo)

## Phase status

| Phase | Status | What |
|-------|--------|------|
| 0 | ✅ | LCARS Rocket Reader, UUIDv8, OpenRouter, interactive demo |
| 1 | 🔄 | Header protocol, dogfood, docs, Git-backed source of truth |
| 2 | ☐ | Batch dogfood runner + auto-stamp |
| 3 | ☐ | `/e/[uuid]` resolver + QR embeds |
| 4 | ☐ | Catalog graph + tiers |

## Quick start

```bash
npm install
npm run dev
```

## Environment

| Variable | Purpose |
|----------|---------|
| `OPENROUTER_API_KEY` | Preferred free-tier models |
| `OPENAI_API_KEY` | Fallback |

## Core docs

- [RRS Vision](docs/RRS_VISION.md)
- [Header Protocol](docs/RRS_HEADER_PROTOCOL.md)
- [Dogfooding](docs/DOGFOOD.md)
- [Future-Retro-Recursiveness](docs/FUTURE_RETRO.md)

## Domain CLI

```bash
vercel domains add rr.somacosf.com --scope somacosfs-projects
```

Point the domain at the Vercel project that deploys **this** repository.

## Dogfood rule

We use RRS to document RRS.  
Every non-trivial file in this repo will carry an RRS header and an explainer under `explainers/`.

---

*Depth without cost. Speed without shallowness. Provenance by design.*
