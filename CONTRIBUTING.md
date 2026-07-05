# Contributing to Pro_AmineUMT IDE with AI Platform

Thank you for your interest in contributing. This project welcomes
contributions from individuals and organizations of all sizes.

## Ways to Contribute

- **Code** — bug fixes, features, refactors, tests. See open issues labeled
  `good first issue` and `help wanted`.
- **Documentation** — improve `docs/`, tutorials, API reference, translations.
- **Hardware** — new board profiles under `boards/`, contributions to the
  BGA 16×16 substrate reference designs in `hardware/`.
- **Standards** — RFCs against the ten normative standards under `standards/`.
- **Community** — help newcomers on Discord, GitHub Discussions, and issues.
- **Sponsorship** — see `FUNDING.yml` in `.github/`.

## Development Workflow

1. Fork the repository under your own GitHub account.
2. Create a topic branch: `feat/short-description` or `fix/issue-N`.
3. Follow the `.editorconfig` style and the language-specific style guide
   under `docs/style-guides/`.
4. Add tests for new functionality; keep existing tests passing.
5. Write meaningful commit messages following the Conventional Commits
   specification: `type(scope): subject`.
6. Sign your commits with a valid GPG or SSH key.
7. Open a pull request against `main`. Fill in the PR template.
8. A CODEOWNER will review within five business days.

## Contributor License Agreement (CLA)

At the first pull request, a bot will ask you to sign the Individual or
Corporate CLA. This is a one-time step. The CLA text is stored in
`.github/CLA.md`.

## Architecture Decisions

Substantive architectural changes are proposed via Architecture Decision
Records under `adr/`. Read the existing ADRs before proposing a change.

## Locked Conventions

The following are locked and cannot be changed by pull request. They can
only be changed by a new ADR:
- The Apache-2.0 license and the NOTICE text.
- The brand line (see any `README.md` footer).
- The naming of `Abstraction Intelligence Algorithm Engine` (always spelled
  in full in normative documents).
- The UMT VR API naming rule: `Interface()` uses the short interface name
  (e.g. `VR_ADC4`); `Interface_Pin()` and `Digital_Pin()` use the direction-
  suffixed pin name (e.g. `VR_ADC_IN4`).
- The term `NanoKit-iM` — "(MCU or SoC) Integrated Modules".

## Code of Conduct

Participation is governed by `CODE_OF_CONDUCT.md`.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
