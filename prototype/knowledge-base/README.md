# Prototype — Knowledge Base

React (JSX) prototype of the platform's **structured knowledge base**
for developers, AI assistants, chipmaker engineers, and academic
reviewers. Presents the platform vocabulary — every VR interface,
every locked term, every canonical example — in a searchable,
cross-linked format.

## Status

**Prototype** — subject to breaking changes without notice. Graduates
out of `prototype/` when it is embedded in the public documentation
site as a canonical reference surface.

Reference: architecture v3.1, §2 and §6 — `docs/architecture/Pro_AmineUMT_IDE_AI_Platform_Architecture_v3_1.md`.

## Files

- [`ProAmineUMT_Knowledge_Base_v7.jsx`](ProAmineUMT_Knowledge_Base_v7.jsx) — the standalone React component.

## Runtime dependencies

Pure functional React component (~2200 lines). Expects:

- `react` (≥ 18)
- `react-dom` (≥ 18)

## Running standalone (Vite)

```sh
npm create vite@latest knowledge-base -- --template react
cd knowledge-base
cp ../Pro_AmineUMT-IDE-AI-Platform/prototype/knowledge-base/ProAmineUMT_Knowledge_Base_v7.jsx src/
```

Then in `src/main.jsx`:

```jsx
import KnowledgeBase from './ProAmineUMT_Knowledge_Base_v7.jsx';
ReactDOM.createRoot(document.getElementById('root'))
  .render(<KnowledgeBase />);
```

```sh
npm install
npm run dev
```

## Coverage

- The 45 UMT VR interfaces (per Standard S-001), each with:
  - Short interface name (used by `Interface()`).
  - Direction-suffixed pin name(s) (used by `Interface_Pin()` and `Digital_Pin()`).
  - Canonical BGA row/column addresses (VR_0x[Row][Col]).
  - Per-target physical GPIO resolution for the reference boards.
- The locked terminology set — Abstraction Intelligence Algorithm
  Engine, Pure VR Source / Hidden Native Backend, Debug at Source /
  Run at Native, NanoKit-iM ((MCU or SoC) Integrated Modules), and
  the founder's brand line.
- The canonical `VR_ADC4` dual-role example (potentiometer under
  `activate()`, LED under `deactivate()`) with the same-line
  functional comment rule.
- Cross-references to `adr/`, `standards/`, and `docs/whitepapers/`.

## Relationship to the Architecture Map

The Knowledge Base is the **vocabulary reference**; the Architecture
Map is the **structural view**. Together they form the platform's
Interactive Engineering Documentation. Both are prototypes intended
to graduate into the public documentation site.

## Contribution notes

Because this is a prototype, contribution is limited to error
corrections and content updates that reflect changes already
committed to the normative material in `standards/` and `adr/`.
Structural rewrites wait until graduation.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
