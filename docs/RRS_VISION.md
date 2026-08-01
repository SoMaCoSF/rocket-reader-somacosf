# RRS: https://rr.somacosf.com/e/019fbe7a-9943-8001-a2a0-2026f9d3c618

# RRS — Rocket Reader SomaCoSF / Reverse RSS

> The holy grail of documentation depth: every file carries a single UUIDv8 link that expands into a speed-readable, provenance-tracked explanation of *what it is, what it does, how it is deployed, and why it exists*.

## One-sentence product

**RRS turns any file into a self-documenting asset** by embedding a header link that resolves to a Rocket-Reader (RSVP + ORP) explanation, permanently identified by a UUIDv8.

## Why “Reverse RSS”

Classic RSS pushes content *to* you.  
RRS lets the *file itself* pull you into its explanation on demand — a reverse, on-demand, single-asset feed.

The header line is the QR code.  
The UUIDv8 is the permanent address.  
The Rocket Reader is the delivery vehicle.

## Core loop

1. **Ingest** a file
2. **Generate** a short, high-signal explanation optimized for 300–600 WPM RSVP
3. **Mint** a UUIDv8
4. **Commit** the explanation under `explainers/<uuidv8>.md`
5. **Stamp** the original file with `# RRS: https://rr.somacosf.com/e/<uuidv8>`
6. Anyone can open the link and absorb the explanation in < 90 seconds

## Provenance by design

Every explanation is identified by UUIDv8, versioned in git, tagged, linked back to source, and replayable forever.

## Dogfooding rule

We use RRS to document RRS. The system that generates explanations is itself explained by the system.

## Future-retro-recursiveness

We freeze only the identity format, the header contract, the flowing-prose body, and the URL resolver. Anything that can resolve a URL and flash words can become an RRS client.

## Economic elegance

Free-tier models, static/edge explainers, git as source of truth, domain as permanent resolver. Depth without cost. Speed without shallowness.
