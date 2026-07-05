# ADR-0002: Apache-2.0 License Selection

- **Status**: Accepted
- **Date**: 2026-06-15
- **Author**: Amine Saoud ibn al-Bashir (Pro_Amine LLC)

## Context

The project targets adoption by:
- Individual embedded developers.
- Chipmakers integrating the UMT BGA 16×16 pinout at the package substrate stage.
- Enterprise integrators building commercial products on the UMT Platform.

The chosen license must be permissive enough for commercial adoption while
preserving the founder's ability to protect the brand marks and the
Abstraction Intelligence Algorithm Engine name.

## Decision

The repository is licensed under the Apache License, Version 2.0.

The following clarifications apply:
- Every source file, documentation file, and hardware design file in this
  repository is Apache-2.0 unless a subdirectory contains its own `LICENSE`
  file explicitly overriding it.
- Trademarks are governed separately by `TRADEMARKS.md` and are not granted
  under the Apache-2.0 patent-and-trademark carve-out.
- The `NOTICE` file carries the founder attribution and must be preserved
  verbatim in every redistribution.

## Consequences

- Positive: broad compatibility with commercial use.
- Positive: explicit patent grant protects users from patent troll behavior.
- Positive: `NOTICE` file requirement enforces the brand line preservation.
- Neutral: not copyleft; downstream forks may keep improvements proprietary.
  This is acceptable for a platform intended for chipmaker adoption.

## Locked implications

- Apache-2.0 is the exclusive default license.
- The trademark carve-out is locked.
- The NOTICE text is locked and can only be changed by a new ADR.

## Alternatives considered

- MIT — rejected: no patent grant, no NOTICE mechanism.
- BSD 3-Clause — rejected: same reasons as MIT.
- MPL 2.0 — rejected: file-level copyleft complicates integration into
  proprietary chipmaker toolchains.
- GPL v3 — rejected: incompatible with the goal of chipmaker adoption.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
