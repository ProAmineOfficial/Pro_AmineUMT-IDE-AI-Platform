# ADR-0001: Repository Architecture v3.1

- **Status**: Accepted
- **Date**: 2026-06-15
- **Author**: Amine Saoud ibn al-Bashir (Pro_Amine LLC)
- **Deciders**: Founder

## Context

The Pro_AmineUMT IDE with AI project accumulated approximately four years of
parallel research, prototypes, and deliverables across five fronts — the UMT
SDK, the IDE, the AIA Engine, the BGA 16×16 substrate, and the Architecture
Map. To open-source the work at a level comparable to PlatformIO, VS Code,
LLVM, Flutter, and React, we need a single, disciplined repository layout.

## Decision

Adopt Repository Architecture v3.1 as the canonical top-level layout of
`Pro_AmineUMT-IDE-AI-Platform`. The top-level directories are:

- `adr/` — Architecture Decision Records.
- `apps/` — end-user applications (IDE, CLI, Simulator, Dashboard).
- `boards/` — board profiles.
- `community/` — contributors, sponsors, hall of fame.
- `core/` — platform engine layer (AIA Engine, VR SDK, kernel).
- `docs/` — user and developer documentation.
- `enterprise/` — commercial engagement framework.
- `examples/` — example projects.
- `hardware/` — reference designs (BGA 16×16, NanoKit).
- `packages/` — framework, toolchains, libraries.
- `partners/` — chipmakers, distributors, industry partners.
- `prototype/` — research and experimental work.
- `standards/` — the ten normative standards.
- `templates/` — starter and project templates.
- `.github/` — CI, issue templates, CODEOWNERS.

Root-level files: `README.md`, `LICENSE`, `NOTICE`, `AUTHORS.md`,
`TRADEMARKS.md`, `SECURITY.md`, `SUPPORT.md`, `CHANGELOG.md`, `ROADMAP.md`,
`CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `GOVERNANCE.md`,
`THIRD_PARTY_NOTICES.md`, `.gitignore`, `.editorconfig`, `VERSION`.

## Consequences

- Positive: clear separation of concerns; each top-level directory has one
  reason to change. New contributors find their area immediately.
- Positive: matches the mental model used by PlatformIO, LLVM, and React,
  reducing the onboarding cost.
- Negative: some cross-cutting concerns (e.g. the AIA Engine used by both
  `apps/ide/` and `apps/cli/`) require careful dependency management.

## Locked implications

- The name of the top-level directories is locked. Renaming any of them
  requires a new ADR that supersedes this one.
- The distinction between `core/` (platform engine) and `apps/` (end-user
  products) is locked.

## Alternatives considered

- Monolithic layout with `src/` and `docs/` only — rejected: hides the
  structure and does not scale to a multi-audience project.
- Multi-repo (one repo per app) — rejected at v0.1; may be revisited if
  release cadences diverge substantially.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
