# rrs explain (sketch)

```bash
rrs explain <path> [--stamp] [--commit]
```

1. Read file
2. Call /api/explain
3. Receive { id, header, explanation }
4. Write explainers/<id>.md
5. Optionally stamp source with # RRS: …
6. Optionally commit

This is the dogfood engine for Phase 2.
