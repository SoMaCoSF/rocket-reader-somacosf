# Dogfooding RRS on RRS

Every non-trivial source file must carry an RRS header and possess a corresponding explainer under `explainers/`.

## Current targets

| File | Status |
|------|--------|
| docs/RRS_VISION.md | ✅ stamped |
| docs/RRS_HEADER_PROTOCOL.md | pending |
| lib/uuidv8.ts | pending |
| app/api/explain/route.ts | pending |
| components/RocketReader.tsx | pending |
| app/page.tsx | pending |

## Process

1. Explain the file
2. Mint UUIDv8
3. Write explainers/<uuid>.md
4. Stamp source with # RRS: …
5. Commit `rrs: dogfood <path>`
