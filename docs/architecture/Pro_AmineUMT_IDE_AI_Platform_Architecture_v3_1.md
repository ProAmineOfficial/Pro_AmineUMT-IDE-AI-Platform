<div align="center">

# Pro_AmineUMT IDE with AI Platform — Enterprise Open Platform Architecture

### Official Open Source Repository: Pro_AmineUMT-IDE-AI-Platform · Built on UMT (Unified Microchip Technology)

**Document v3.1 — July 4, 2026 — Status: IDENTITY DIRECTIVE APPLIED on the approved v3.0 architecture — ready to LOCK**

*Supersedes v3.0 (16/16 founder directives applied) · This revision changes identity, not architecture · Prepared in the role of Lead Open Source Architect*

**© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe**

</div>

---

## 0. Repository Identity & What Changed

### 0.1 The Identity Directive (v3.1) — Branding Hierarchy, LOCKED

The repository presents itself, from its very first line, as **the official open-source repository of the software platform**. UMT remains the underlying technology inside the platform — **it is no longer the repository identity.**

| Level | Official name |
|---|---|
| **Product** | Pro_AmineUMT IDE with AI Platform |
| **Repository** | `Pro_AmineUMT-IDE-AI-Platform` — `github.com/pro-amine/Pro_AmineUMT-IDE-AI-Platform` |
| **Technology** | UMT (Unified Microchip Technology) — the UMT Platform |

**Replacements applied everywhere** — all headings, comments, root descriptions, README references, architecture documents, and repository annotations:

| Retired | Official |
|---|---|
| `umt/` (repository root) | `Pro_AmineUMT-IDE-AI-Platform/` |
| `github.com/pro-amine/umt` | `github.com/pro-amine/Pro_AmineUMT-IDE-AI-Platform` |
| `umt-platform` (repo-name candidate) | Retired — the Phase-0 repository-name question is now **DECIDED** |
| "UMT Repository" / "UMT Platform Repository" | *Pro_AmineUMT IDE with AI Platform* (product) · `Pro_AmineUMT-IDE-AI-Platform` (repository) |

**Where UMT rightfully survives — the technology layer (guard list, do not over-replace):** UMT / UMT Platform in prose about the *technology*; every internal folder, package, and identifier name (`packages/umt-sdk`, `umt-cli`, `umt-simulator`, `standards/umt-*-standard`, `boards/*.json`, `.umt` sources, `VR_*` tokens, `~/.umt/`); the tagline *"One code. Any architecture."*; and the *Built on:* line of the official root header below. This directive changes **identity, not architecture** — the approved repository structure is preserved exactly.

### 0.2 What Changed in v3.0 (recap)

Document v1.0 organized the project as a world-class **software repository**. The Founder Review of July 2026 corrected the identity: this is not a software project — it is a complete Technology Platform: **Pro_AmineUMT IDE with AI Platform**, built on **UMT (Unified Microchip Technology)**, spanning Hardware, Software, SDK, IDE, AI, Standards, Documentation, Simulation, Community, Enterprise, Chip Vendors, and Research — in the tradition of PlatformIO, LLVM, Flutter, VS Code, and Kubernetes, but with its own identity.

v3.0 applied all sixteen founder directives **on top of the approved v1.0 basis** — nothing rewritten from scratch, nothing deleted, no ideas changed. The structural additions: a **`core/`** layer (the heart of the platform), a **`hardware/`** layer, a **`standards/`** system of ten independent standards, and three human layers — **`community/`**, **`partners/`**, **`enterprise/`**. The repository answers, in its first screen, the founder's test: *a developer, a company, a chip manufacturer, an investor, or a researcher opening this repository for the first time must feel they are looking at a complete Technology Platform — structured to grow for ten years without radical reorganization.*

Three identity statements anchor `core/README.md`, exactly as directed:

> **AIA Engine is not a library — it is the engine of the platform.**
> **AI Bashir is not a chatbot — it is the official intelligent assistant of the platform.**
> **`.CmdGenius` is not documentation — it is the intelligent knowledge system of the platform.**

---

## 1. Founder Directives — Integration Matrix (16/16)

| # | Directive | How it is applied in v3.0 | Architect note |
|---|---|---|---|
| 1 | Create `core/` layer | New top-level `core/` — the heart of the platform (tree in §2) | See **Note A** (§1.1): the illustrative list ("مثلاً") is reconciled with LOCKED ADR-0003 |
| 2 | Move AIA Engine | `packages/aia-engine` → `core/aia-engine` | Ten LOCKED sub-functions become its internal module structure |
| 3 | Move AI Bashir | Out of the IDE package → `core/ai-bashir` | The IDE keeps its **AI Bashir panel** (UI surface), so the LOCKED six-part IDE composition (Editor·Debug·Monitor·ProjectMgr·AI Bashir·Dock) is unchanged; the assistant's *engine* now lives in core |
| 4 | Move CmdGenius | Engine → `core/cmdgenius`; template **kept** inside every new project (`templates/myproject/.CmdGenius/`, ten locked files); normative definition stays in `standards/cmdgenius-standard/` | Three homes, three roles: engine / template / standard |
| 5 | Rename IDE package | `packages/vscode-umt` + `packages/antigravity-umt` → **`packages/proamineumt-ide/`** with `vscode/` and `antigravity/` inside | README states the standalone-IDE trajectory the founder set: the project is an IDE, not only an extension |
| 6 | Reorganize apps | `apps/website/` + `apps/prototype/` containing eight prototypes, **each with its own README** | Five new prototype folders are founder-directed scaffolds (README-only until built) |
| 7 | Architecture Map = Interactive Engineering Documentation | Mounted as the official interactive reference of the site; bound to `docs/` through the **Docs ↔ Map Crosslink Registry** (§6.1) | Structural mechanism, no new code required |
| 8 | `specs/` → `standards/` | Renamed and expanded into **ten independent standards** + `rfcs/` (§4) | Each standard carries its own status (Draft / LOCKED / Adopted) and version |
| 9 | Add `hardware/` | New top-level `hardware/` with the eight requested areas | NanoKit + NanoKit-iM + UMT IC get physical-world homes; the platform is visibly not software-only |
| 10 | Community system | New `community/` with governance files, `contributors/`, hall-of-fame, and the **nine contribution classifications** | See **Note B** (§1.2): thin root stubs remain so GitHub's community-health detection keeps working (the Kubernetes pattern) |
| 11 | Partners | New `partners/` — chip-vendors, universities, industrial, research, technology-partners | `chip-vendors/` is the onboarding surface for the BGA 16×16 adoption program |
| 12 | Enterprise / investors | New `enterprise/` — business, roadmap, funding, investors, sponsorship, presentations | See **Note C** (§1.3): public-safe materials here; NDA materials stay in the private `umt-internal` repo |
| 13 | Documentation | `docs/` restructured into the fourteen requested sections | v1.0's Diátaxis discipline survives *inside* each section; ADRs live at the industry-standard path `docs/architecture/decisions/` |
| 14 | Examples | Ten categories: beginner → education | Existing examples slotted in; empty categories become labeled good-first-issue territory |
| 15 | License & Attribution | **Apache-2.0 — DECIDED** (v1.0 recommendation accepted); `LICENSE` + `NOTICE` (founder's verbatim text, §8) + `AUTHORS.md` at root | Closes the largest Phase-0 open item |
| 16 | Keep everything | Relocation delta in §3 — every v1.0 path has a v3.0 destination; zero deletions, zero idea changes | — |

### 1.1 Note A — `core/` and the LOCKED single-intelligence-core decision (ADR-0003)

The directive's component list was explicitly illustrative (*"مثلاً"*), which gives the architect latitude to apply it without breaking a decision the founder himself locked and verified in July 2026: **the AIA Engine (Abstraction Intelligence Algorithm Engine) is the single intelligence core; no separate engine exists anywhere; the abstraction path is deterministic-first.** Creating sibling folders named `abstraction-engine/`, `vr-engine/`, `compiler/`, `runtime/` would visually contradict ADR-0003 by suggesting multiple engines. v3.0 therefore maps every requested name to its true home:

| Requested in review | v3.0 home | Why |
|---|---|---|
| `abstraction-engine/` | `core/aia-engine/umt-abstraction/` | UMT Abstraction is LOCKED sub-function ⑥ — steps 1–5 of the 7-step pipeline (VR intent parse → pin scan → symbolic token match → functional clone → conflict check) |
| `vr-engine/` | `core/aia-engine/umt-abstraction/` | The VR resolution engine *is* UMT Abstraction — one thing, one name |
| `compiler/` | `core/aia-engine/code-generation/` + `build-system/` | The hidden C++ emitter and the internal arduino-cli/PIO driver are LOCKED sub-functions ⑦ and ⑧ |
| `runtime/` | `packages/umt-sdk/` (Framework Layer) | The only UMT code that executes **on the target** is the SDK runtime — it ships to devices, so it belongs in `packages/`, not `core/` |
| `project-generator/` | `core/project-generator/` | Legitimate standalone platform engine — instantiates `templates/myproject/` |
| `dependency-engine/` | `core/dependency-engine/` | Platform component ② brain: Toolchains · Packages · BoardMgr resolution over the `boards/` registry |

If the founder prefers the literal folder names regardless, thin façade directories (README pointing into `aia-engine/`) can be added — not recommended, as it reintroduces the "multiple engines" appearance ADR-0003 exists to prevent.

### 1.2 Note B — Community files and GitHub's detection rules

GitHub only surfaces `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and `SECURITY.md` in its UI (new-issue banners, community-standards checklist, private vulnerability reporting) when they sit at the **root**, in **`.github/`**, or in **`docs/`**. The founder's `community/` directory becomes the **canonical** home of the full governance system; the root keeps **thin stub files** that point into it — exactly how Kubernetes bridges its community repo. `SECURITY.md` remains a full root file because the private-vulnerability-reporting integration reads it there.

### 1.3 Note C — The `enterprise/` boundary rule

One sentence governs the split: **everything an investor may see without an NDA lives in `enterprise/`; everything under NDA stays in the private `pro-amine/umt-internal` repo.** Consequently: the *engineering* roadmap stays at root `ROADMAP.md` (open-source convention); the *business* roadmap (market, adoption, funding milestones) lives in `enterprise/roadmap/`; the public pitch deck (Master Pitch Hook) lives in `enterprise/presentations/`; confidential financials and negotiations never enter the public repo.

---

## 2. Complete Project Tree — v3.1

```text
Pro_AmineUMT-IDE-AI-Platform/           ← MONOREPO ROOT
│                                          github.com/pro-amine/Pro_AmineUMT-IDE-AI-Platform
│
│  ← Official Open Source Repository
│     Product: Pro_AmineUMT IDE with AI Platform
│     Built on: UMT Platform (Unified Microchip Technology Platform)
│     Organization: Pro_Amine LLC
│     License: Apache License 2.0
│
│  ── Root: identity, law, and GitHub-required files ──
├── README.md                           ← First line: Pro_AmineUMT IDE with AI Platform —
│                                          Official Open Source Repository. First screen:
│                                          the platform test of Directive 16's final goal (§5)
├── LICENSE                             ← Apache-2.0 ★ DECIDED (Directive 15)
├── NOTICE                              ← Founder's verbatim attribution text (§8)
├── AUTHORS.md                          ← Founder + every author of record
├── TRADEMARKS.md                       ← UMT · AIA Engine · AI Bashir · Pro_Amine · NanoKit-iM
├── CONTRIBUTING.md                     ← root stub → community/CONTRIBUTING.md   (Note B)
├── CODE_OF_CONDUCT.md                  ← root stub → community/CODE_OF_CONDUCT.md
├── SECURITY.md                         ← full file at root (GitHub vuln-reporting hook)
├── SUPPORT.md                          ← stub → community/ + docs/getting-started/
├── CHANGELOG.md · ROADMAP.md · CITATION.cff · CLAUDE.md
├── .gitignore · .gitattributes · .editorconfig
│
├── .github/                            ← unchanged from v1.0: workflows (docs-deploy · ci ·
│                                          release), issue templates (bug · feature ·
│                                          board_support_request · standard_rfc), PR template,
│                                          CODEOWNERS, FUNDING.yml
│
├── core/                               ★ NEW — the heart of the platform (Directives 1–4).
│   │                                      WHY: separates what UMT *is* (engines) from what
│   │                                      UMT *ships* (packages). Nothing here is a library.
│   ├── README.md                       ← the three identity statements (§0)
│   ├── aia-engine/                     ← THE single intelligence core — ADR-0003.
│   │   │                                  Node.js service; ten LOCKED sub-functions as modules:
│   │   ├── project-analysis/
│   │   ├── prompt-builder/
│   │   ├── context-manager/
│   │   ├── model-selection/
│   │   ├── api-communication/          ← Claude · OpenAI · Gemini · DeepSeek · Moonshot Kimi
│   │   ├── umt-abstraction/            ← the VR engine — pipeline steps 1–5 (deterministic)
│   │   ├── code-generation/            ← the hidden C++ emitter (deterministic)
│   │   ├── build-system/               ← drives arduino-cli / PlatformIO internally
│   │   ├── debug-system/               ← produces aia_map.json (Debug at Source, ADR-0002)
│   │   ├── documentation-generation/   ← feeds .CmdGenius knowledge files
│   │   └── prompts/                    ← system prompts consumed by the Prompt Builder
│   ├── ai-bashir/                      ← official intelligent assistant — voice permission
│   │                                      gating, TTS, DigitalHumanHead, Project Interview
│   │                                      Mode; the 5-layer AI Voice System architecture
│   ├── cmdgenius/                      ← Project Intelligence Workspace *engine* — generates
│   │                                      and maintains the ten locked knowledge files
│   ├── project-generator/              ← scaffolding engine — instantiates templates/myproject
│   └── dependency-engine/              ← Platform component ② brain: Toolchains · Packages ·
│                                          BoardMgr — resolves over the boards/ registry
│
├── standards/                          ★ RENAMED from specs/ + expanded (Directive 8).
│   │                                      WHY: ten independent, individually versioned,
│   │                                      individually adoptable standards — the W3C/LLVM
│   │                                      signal to IC package manufacturers.
│   ├── README.md                       ← status index: Draft / LOCKED / Adopted
│   ├── umt-platform-standard/          ← the five-component platform composition +
│   │                                      board-profile JSON Schema (CI validates boards/*.json)
│   ├── umt-language-standard/          ← the .umt C++ dialect (was specs/umt-language)
│   ├── umt-sdk-standard/               ← API surface: 18 peripheral classes · 318 VR
│   │                                      identifiers · 45 interface types
│   ├── umt-ide-standard/               ← the LOCKED six-part IDE composition
│   ├── umt-ic-standard/                ← UMT IC: master + slave drivers in parallel inside
│   │                                      the substrate over the hybrid SPI+I2C+PCIe bus
│   ├── vr-api-standard/                ← VR Naming Rule (ADR-0005) + pin lifecycle
│   │                                      FREE → RESERVED → BOUND + Functional Comment Rule
│   │                                      (ADR-0004)
│   ├── bga-standard/                   ← ★ UMT IC BGA 16×16 Package Substrate Standard —
│   │                                      VR_0x[Row][Col] hex grid (rows/cols 1–F),
│   │                                      physical (UMT IC · NanoKit-iM) vs virtual (dev boards)
│   ├── cmdgenius-standard/             ← .CmdGenius Official v2 + the locked 10-file tree
│   ├── ai-standard/                    ← the AIA contract: ten sub-functions, deterministic-
│   │                                      first abstraction path (never LLM-dependent),
│   │                                      provider-agnostic API; AI Bashir wording rules
│   ├── simulator-standard/             ← behavior contract for Targets A / B / C
│   └── rfcs/                           ← numbered change proposals against any standard
│
├── hardware/                           ★ NEW (Directive 9). WHY: the platform is Hardware +
│   │                                      Software; the repository must show it in its
│   │                                      first screen.
│   ├── README.md
│   ├── nanokit/                        ← NanoKit Integrated ESP32 (canonical 40-pin) +
│   │                                      NanoKit-iM — "(MCU or SoC) Integrated Modules"
│   ├── umt-ic/                         ← the UMT IC on the BGA 16×16 substrate
│   ├── reference-designs/
│   ├── pcb/
│   ├── schematics/
│   ├── manufacturing/
│   ├── datasheets/
│   └── certification/
│
├── packages/                           ← what the platform SHIPS (post-move: four products)
│   ├── umt-sdk/                        ← unchanged internal layout (v1.0 §8); the SDK
│   │                                      Framework Layer is the on-target *runtime*
│   ├── umt-cli/                        ← Build·Flash·Debug·Monitor·SimCtrl·BoardSelect·Config
│   ├── proamineumt-ide/                ★ RENAMED (Directive 5)
│   │   ├── README.md                   ← standalone-IDE trajectory statement
│   │   ├── vscode/                     ← existing VS Code extension (moved, unchanged)
│   │   └── antigravity/                ← existing Antigravity extension (moved, unchanged)
│   └── umt-simulator/
│       ├── target-a-dev-boards/
│       ├── target-b-mcu-bga16x16/
│       └── target-c-nanokit-im/
│
├── apps/                               ← (Directive 6)
│   ├── website/                        ← Docusaurus → GitHub Pages · umt.proamine.tech
│   └── prototype/                      ← each prototype: standalone README + package.json
│       ├── architecture-map/           ← Interactive Engineering Documentation (Directive 7;
│       │                                  crosslink registry in §6.1) — was v6.0 JSX
│       ├── knowledge-base/             ← was KB v7.2 JSX
│       ├── software-hierarchy/         ← was Hierarchy JSX
│       ├── simulator-ui/               ← founder-directed scaffold (README until built)
│       ├── ide-demo/                   ← founder-directed scaffold
│       ├── sdk-demo/                   ← founder-directed scaffold
│       ├── ai-bashir-demo/             ← founder-directed scaffold
│       └── command-genius-demo/        ← founder-directed scaffold
│
├── boards/                             ← unchanged: nanokit-esp32.json (canonical) ·
│                                          arduino-uno.json · pico.json · README
│                                          ("add your board in one JSON file")
│
├── templates/
│   └── myproject/                      ← MyProject/ scaffold + .CmdGenius/ with the TEN
│                                          locked knowledge files (Directive 4: template kept)
│
├── examples/                           ← (Directive 14) — proof of One code. Any architecture.
│   ├── README.md                       ← category map + contribution invitation
│   ├── beginner/
│   │   ├── led-blink/                  ← default example (UART0.deactivate → RX0 as LED …)
│   │   └── adc-read/                   ← canonical VR_ADC4 (GPIO32 · BGA VR_0x54)
│   ├── intermediate/
│   │   └── dc-motor/                   ← the Architecture-Map demo as real .umt source
│   ├── advanced/ · industrial/ · ai/ · robotics/ · iot/
│   ├── automotive/ · aerospace/ · education/
│   │                                      (labeled good-first-issue territory until filled)
│
├── docs/                               ← (Directive 13) — fourteen sections; Diátaxis
│   │                                      discipline survives INSIDE each section
│   ├── getting-started/                ← install · first project · first flash
│   ├── tutorials/                      ← learning paths
│   ├── architecture/                   ← system design docs + decisions/ (ADR-0001…0006 at
│   │                                      the industry-standard ADR path) + map-index.md
│   │                                      (the Docs ↔ Map Crosslink Registry, §6.1)
│   ├── whitepapers/                    ← Pure VR Source + Debug at Source originals (PDF)
│   ├── articles/                       ← the 5-article launch series
│   ├── api/                            ← VR interface catalog · SDK API reference
│   ├── hardware/                       ← NanoKit pinout · ESP32 hardware restrictions
│   │                                      (GPIO6–11 flash · input-only 34/35/36/39 · GPIO0 boot)
│   ├── standards/                      ← reader-friendly guides to /standards (canonical
│   │                                      normative text stays in /standards)
│   ├── sdk/ · ide/ · simulator/ · ai/ · cmdgenius/
│   ├── research/                       ← papers, citations, academic collaboration
│   └── assets/{img, pdf}
│
├── community/                          ★ NEW (Directive 10) — canonical governance system
│   ├── CONTRIBUTING.md                 ← full document (root stub points here)
│   ├── CODE_OF_CONDUCT.md              ← Contributor Covenant v2.1 (root stub points here)
│   ├── GOVERNANCE.md                   ← founder-led + standards changed only via rfcs/
│   ├── MAINTAINERS.md
│   ├── SUPPORTERS.md                   ← the letters-of-gold registry; BGA-adopting
│   │                                      companies at the top
│   ├── contribution-types.md           ← the NINE classifications: Software · Hardware ·
│   │                                      Documentation · Financial · Research · Industrial ·
│   │                                      Testing · Translation · Community
│   └── contributors/
│       ├── developers.md · companies.md · sponsors.md · hall-of-fame.md
│
├── partners/                           ★ NEW (Directive 11) — institutional front doors
│   ├── chip-vendors/                   ← BGA 16×16 adoption program onboarding (links
│   │                                      standards/bga-standard + boards/ + the
│   │                                      board_support_request template)
│   ├── universities/ · industrial/ · research/ · technology-partners/
│
├── enterprise/                         ★ NEW (Directive 12) — public-safe business layer
│   │                                      (boundary rule in Note C)
│   ├── business/                       ← company & platform overview (no-NDA)
│   ├── roadmap/                        ← BUSINESS roadmap (engineering ROADMAP.md stays root)
│   ├── funding/ · investors/ · sponsorship/
│   └── presentations/                  ← the Master Pitch (public deck)
│
└── tools/                              ← repo maintenance scripts (board-JSON validator,
                                           docs link-checker, crosslink-registry checker)
```

---

## 3. Relocation Delta — v1.0 → v3.0 (nothing deleted)

Only paths that **change** relative to v1.0 are listed; everything else keeps its v1.0 destination. The v1.0 §2 table (original files → repository) remains valid upstream of this delta.

| # | v1.0 path | v3.0 path | Directive |
|---|---|---|---|
| 1 | `packages/aia-engine/` (+ `prompts/`) | `core/aia-engine/` (+ ten sub-function modules + `prompts/`) | 1, 2 |
| 2 | AI Bashir engine (inside IDE package) | `core/ai-bashir/` — IDE keeps the AI Bashir panel UI | 3 |
| 3 | `.CmdGenius` engine logic (inside IDE/AIA) | `core/cmdgenius/` | 4 |
| 4 | — (new) | `core/project-generator/`, `core/dependency-engine/` | 1 |
| 5 | `packages/vscode-umt/` | `packages/proamineumt-ide/vscode/` | 5 |
| 6 | `packages/antigravity-umt/` (existing extension code) | `packages/proamineumt-ide/antigravity/` | 5 |
| 7 | `apps/architecture-map/`, `apps/knowledge-base/`, `apps/software-hierarchy/` | `apps/prototype/{same names}/` | 6 |
| 8 | — (new scaffolds) | `apps/prototype/{simulator-ui, ide-demo, sdk-demo, ai-bashir-demo, command-genius-demo}/` | 6 |
| 9 | `specs/umt-language/` | `standards/umt-language-standard/` | 8 |
| 10 | `specs/vr-api/` | `standards/vr-api-standard/` | 8 |
| 11 | `specs/bga-16x16-substrate/` | `standards/bga-standard/` (full title preserved inside) | 8 |
| 12 | `specs/board-profile/` | `standards/umt-platform-standard/` (board-profile JSON Schema) | 8 |
| 13 | `specs/cmdgenius/` | `standards/cmdgenius-standard/` | 8 |
| 14 | `specs/rfcs/` | `standards/rfcs/` | 8 |
| 15 | — (new standards) | `standards/{umt-platform, umt-sdk, umt-ide, umt-ic, ai, simulator}-standard/` — content transcribed from LOCKED decisions, KB, and SDK headers | 8 |
| 16 | NanoKit / BGA physical-world material (docs only in v1.0) | `hardware/{nanokit, umt-ic, …}` + reader docs in `docs/hardware/` | 9 |
| 17 | Root `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `GOVERNANCE.md`, `SUPPORTERS.md` (full files) | Canonical → `community/`; root keeps stubs (Note B); `SECURITY.md` full at root | 10 |
| 18 | — (new) | `community/{MAINTAINERS.md, contribution-types.md, contributors/*}` + root `AUTHORS.md` | 10, 15 |
| 19 | — (new) | `partners/{chip-vendors, universities, industrial, research, technology-partners}/` | 11 |
| 20 | Public-safe business material (was `umt-internal` only) | `enterprise/{business, roadmap, funding, investors, sponsorship, presentations}/` — NDA material stays private (Note C) | 12 |
| 21 | `docs/{tutorials, how-to, reference, explanation, decisions, articles, assets}` | Fourteen-section layout (§2); `how-to`/`explanation` content distributed per area; `reference` → `api/`; `decisions/` → `docs/architecture/decisions/` | 13 |
| 22 | `docs/assets/pdf/{pure-vr-source, debug-at-source}.pdf` | `docs/whitepapers/` (they *are* the platform's first whitepapers) | 13 |
| 23 | `examples/{led-blink, adc-read, dc-motor}` | `examples/beginner/{led-blink, adc-read}`, `examples/intermediate/dc-motor` + seven new category folders | 14 |
| 24 | `LICENSE` (recommended Apache-2.0) | `LICENSE` Apache-2.0 **decided** + `NOTICE` verbatim (§8) + `AUTHORS.md` | 15 |

---

## 4. The Standards System (Directive 8)

Every standard is an independent unit: its own folder, its own `README.md` carrying **Status** (Draft / LOCKED / Adopted), **Version**, and **Change process** (only via `standards/rfcs/`). Initial status map — all content transcribed from existing locked material, nothing invented:

| Standard | Seed content (already exists) | Initial status |
|---|---|---|
| `umt-platform-standard` | Five-component platform definition + board-profile JSON Schema | Draft |
| `umt-language-standard` | ".umt is C++ — a dialect, not a new language" (PureVR supplement §A.1) | LOCKED |
| `umt-sdk-standard` | `UMT.h` / `VRTypes.h` surfaces: 18 classes · 318 VR ids · 45 types | LOCKED (v1.0.0) |
| `umt-ide-standard` | The six-part IDE composition | LOCKED |
| `umt-ic-standard` | UMT IC master/slave drivers · hybrid SPI+I2C+PCIe substrate bus | Draft (feeds BGA Hybrid v9 horizon) |
| `vr-api-standard` | VR Naming Rule + pin lifecycle + Functional Comment Rule | LOCKED (ADR-0004, ADR-0005) |
| `bga-standard` | UMT IC BGA 16×16 Package Substrate Standard — VR_0x[Row][Col] | LOCKED (adoption target) |
| `cmdgenius-standard` | `.CmdGenius` Official v2 + ten locked file names | LOCKED |
| `ai-standard` | AIA contract: ten sub-functions · deterministic-first path · provider-agnostic API · AI Bashir wording | LOCKED (ADR-0003) |
| `simulator-standard` | Targets A / B / C definitions | Draft |

---

## 5. README — Platform-Identity Revision

The v1.0 sixteen-section skeleton survives with three changes that execute the founder's philosophy: **(a)** the first line reads *Pro_AmineUMT IDE with AI Platform — Official Open Source Repository*, followed immediately by *Built on UMT (Unified Microchip Technology)* — the tagline stays *"One code. Any architecture."*; **(b)** section 4 becomes a **platform map**: one row each for Core · Standards · Hardware · Packages · Apps · Docs · Community · Partners · Enterprise, each with a one-line purpose and link — so the five audiences (developer, company, chip vendor, investor, researcher) each see their door in the first screen; **(c)** section 13 (Recognition) uses the exact NOTICE wording (§8).

---

## 6. Documentation & the Architecture Map (Directives 7, 13)

The fourteen sections in §2 are the visible structure. Inside each section, pages still declare their Diátaxis role (tutorial / how-to / reference / explanation) in front-matter — the v1.0 discipline survives as internal ordering, which keeps "where does my page go?" answerable for contributors.

### 6.1 Docs ↔ Map Crosslink Registry

Directive 7 makes the Architecture Map the platform's **Interactive Engineering Documentation**. The binding is structural, not new code:

1. **Canonical mount** — the website serves the Map at `/architecture-map`, linked from `docs/index` as *"the official interactive reference of the Pro_AmineUMT IDE with AI Platform."*
2. **Registry file** — `docs/architecture/map-index.md` lists every Map block/step → its documentation page (e.g., *AIA Engine block → docs/ai/ + standards/ai-standard*; *Step 16 Command Genius → docs/cmdgenius/*; *BGA pinout → docs/hardware/ + standards/bga-standard*).
3. **Front-matter key** — every architecture/standard doc carries `map_block:` naming its Map counterpart; CI's link-checker (in `tools/`) verifies the registry both ways.
4. **Deep links** — when the Map gains URL-addressable steps (M2 work item c), the registry entries become clickable both directions.

---

## 7. Updated Migration Plan (delta on v1.0 §10)

Phases and exit criteria stand; the deltas: **Phase 0** shrinks again — the license is DECIDED and the repository name is now **DECIDED by the Identity Directive** (`Pro_AmineUMT-IDE-AI-Platform` under `github.com/pro-amine/`); remaining calls: Docusaurus confirmation, prompt privacy, and the one-word NOTICE question (§9). **Phase 1** stages the v3.1 tree (§2) using v1.0 §2 + §3 above as the complete move list. **Phase 2** grows: author the `community/` system (incl. `contribution-types.md`, root stubs per Note B), `NOTICE` verbatim, `AUTHORS.md`, the ten standard READMEs with status labels, and README placeholders for `hardware/`, `partners/`, `enterprise/`, and the five new prototypes. **Phase 5** adds the Map's canonical mount + `map-index.md` registry. **Phase 6** adds the crosslink checker to CI and re-syncs `CLAUDE.md` paths to the v3.1 tree. Realistic solo effort: **~3 weeks part-time**, Pages still live end of week 1.

---

## 8. NOTICE — Verbatim Content (Directive 15)

```text
Copyright © Pro_Amine LLC

Developed by:
Amine Saoud ibn al-Bashir
Founder of Pro_Amine LLC

Official Project:
Pro_AmineUMT IDE with AI
UMT Platform

Recognition:
Recognized by Corporate Vision Magazine (United Kingdom)
Technology Innovator Awards 2025
Rising Star in Microchip Technology Solutions — Europe
```

---

## 9. Remaining Open Decisions (Phase 0 residue)

**Repository name — DECIDED** by the Identity Directive: `Pro_AmineUMT-IDE-AI-Platform` under `github.com/pro-amine/`. Closed.

1. **Docs engine** — Docusaurus (recommended; the prototypes embed as live pages) vs MkDocs Material.
2. **Prompt privacy** — Master Prompt + Antigravity build prompt stay in the private companion repo initially; opening them later is a launch option (the AI-built story is already public in the pitch). Cosmetic sub-call: the private repo may adopt the matching name `Pro_AmineUMT-Internal`.
3. **NOTICE product line (one word)** — the §8 verbatim text reads *"Pro_AmineUMT IDE with AI"*; the Identity Directive names the product *"Pro_AmineUMT IDE with AI Platform"*. Whether NOTICE adopts the final word is the founder's call — v3.1 keeps §8 verbatim as authored until directed.

---

<div align="center">

**Pro_AmineUMT IDE with AI Platform**

*Built on UMT — Unified Microchip Technology · One code. Any architecture.*

**© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe**

</div>
