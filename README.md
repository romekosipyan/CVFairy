# CVFairy

AI-powered resume builder. Local-first, honest free tier, PDF + DOCX export, no watermarks.

> Your resume, your rules. No watermarks. No surprises.

## Why CVFairy

Built as a better alternative to Enhancv:

| | Enhancv | CVFairy |
|---|---|---|
| Free export | Watermarked trial | Unbranded PDF, forever |
| DOCX | No | Yes (client-side) |
| Pricing | ~$20–30/mo, no lifetime | Free / $9.99/mo / $149 lifetime |
| ATS scoring | Opaque score | Transparent parsed view |
| Data | Account required | Local-first, optional cloud |

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Zustand + Zod + IndexedDB (local-first)
- @react-pdf/renderer + docx (client-side export)
- Cloudflare Pages (free tier) + D1 + R2 + KV + Workers AI

## Development

Requires Node 20.19+ (`npm run dev`). Wrangler 4 / Cloudflare deploy wants Node 22.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Knowledge

This repo is built with an agentic SDLC. Start here:

- [`AGENTS.md`](AGENTS.md) — hot-memory instructions for AI agents
- [`docs/sdlc/agentic-sdlc.md`](docs/sdlc/agentic-sdlc.md) — full methodology
- [`docs/knowledge-base/index.md`](docs/knowledge-base/index.md) — requirements, ADRs, tasks

## License

Private — all rights reserved.
