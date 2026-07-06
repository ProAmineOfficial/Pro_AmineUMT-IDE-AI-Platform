# Prototype — Interactive Architecture Map

React (JSX) prototype of the platform's **Interactive Engineering
Documentation**. Renders every block of the Pro_AmineUMT IDE with AI
Platform architecture as an interactive diagram with drill-down
navigation into each subsystem.

## Status

**Prototype** — subject to breaking changes without notice. Graduates
out of `prototype/` when it is embedded in the public documentation
site as the canonical `/architecture-map` mount point.

Reference: architecture v3.1, §6 (Docs ↔ Map Crosslink Registry) —
`docs/architecture/Pro_AmineUMT_IDE_AI_Platform_Architecture_v3_1.md`.

## Files

- [`ProAmineUMT_Architecture_Map_v4.jsx`](ProAmineUMT_Architecture_Map_v4.jsx) — the standalone React component.

## Runtime dependencies

The component is a pure functional React component (~1700 lines). It
expects a host environment that provides:

- `react` (≥ 18)
- `react-dom` (≥ 18)
- Tailwind-compatible CSS classes for layout (optional — inline styles
  cover the critical path)

No build step is required for local development beyond a standard
React scaffold (Vite, Create React App, or Next.js).

## Running standalone (Vite)

```sh
npm create vite@latest architecture-map -- --template react
cd architecture-map
cp ../Pro_AmineUMT-IDE-AI-Platform/prototype/architecture-map/ProAmineUMT_Architecture_Map_v4.jsx src/
```

Then import and render in `src/main.jsx`:

```jsx
import ArchitectureMap from './ProAmineUMT_Architecture_Map_v4.jsx';
ReactDOM.createRoot(document.getElementById('root'))
  .render(<ArchitectureMap />);
```

```sh
npm install
npm run dev
```

## Embedding in Docusaurus

Drop the JSX into `apps/website/src/components/` (when the website is
scaffolded) and register a page at `/architecture-map` that renders
the component. See architecture v3.1, §6.1 for the canonical mount
policy and the crosslink registry.

## What the map visualizes

- The five-layer platform stack (L0 hardware → L5 IDE/CLI/API).
- The Abstraction Intelligence Algorithm Engine and its ten
  sub-functions.
- The seven-step build pipeline.
- The Pure VR Source / Hidden Native Backend contract at the
  `.umt` ↔ `main_generated.cpp` boundary.
- The Debug at Source flow via `aia_map.json`.
- The UMT BGA 16×16 substrate ball map (256 balls + 4 pads).
- The three-tier API surface: `Interface()`, `Interface_Pin()`, `Digital_Pin()`.

## Relationship to the Knowledge Base

The Interactive Architecture Map answers **"how does the system fit
together?"**. The Knowledge Base prototype in the neighboring
directory answers **"what does each identifier mean?"**. Both are
prototypes intended to graduate into the public documentation site.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
