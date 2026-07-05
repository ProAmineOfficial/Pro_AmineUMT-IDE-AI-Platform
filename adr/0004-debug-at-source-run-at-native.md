# ADR-0004: Foundational Decision #2 — Debug at Source, Run at Native

- **Status**: Accepted
- **Date**: 2026-06-16
- **Author**: Amine Saoud ibn al-Bashir (Pro_Amine LLC)

## Context

ADR-0003 hides the generated C++ from the developer. This raises a debugging
question: should breakpoints, variable inspection, and stack traces operate
on the `.umt` source or on the generated C++?

Every successful abstracted language has answered this question the same
way: debug at the source, run at the native output. TypeScript debugs `.ts`
not JavaScript; CUDA debugs `.cu` not PTX; Flutter debugs `.dart` not the
native ARM binary. The enabling technology is a source map — a bidirectional
translation table between source lines and the lower-level output.

## Decision

The Pro_AmineUMT IDE with AI Platform debugs at the `.umt` source level.
The Abstraction Intelligence Algorithm Engine emits a source map at
`.umt/cache/aia_map.json` alongside the generated C++.

The debug flow is:
1. Developer sets a breakpoint in the `.umt` source at line N.
2. IDE reads `aia_map.json` and finds the mapping `.umt:N → .cpp:M`.
3. IDE issues GDB `break main_generated.cpp:M`.
4. GDB reads ELF debug symbols and locates the machine address.
5. GDB programs a hardware breakpoint via JTAG or SWD.
6. Target halts; GDB reports the machine address.
7. IDE reverse-maps the address to `.umt:N` and highlights the source line.
8. Variables are shown at the VR level (`VR_ADC_IN4.value = 2048`), never
   at the framework level (`adc1_get_raw(...) = 0x800`).

## Consequences

- Positive: the abstraction from ADR-0003 is preserved throughout the entire
  development lifecycle. Writing, building, running, and debugging all
  operate at the same level.
- Positive: developers can hover over VR names and see their physical GPIO
  resolution as a tooltip, without those numbers leaking into the primary
  view.
- Negative: the AIA Engine must produce and maintain the source map on every
  build. This adds ~5% to build time.
- Negative: source-level debugging requires a hardware probe (JTAG or SWD)
  for most targets. Boards without a probe (e.g. Arduino UNO on the default
  bootloader) fall back to serial logging.

## Locked implications

- The name **Debug at Source, Run at Native** is a locked canonical phrase.
- The path `.umt/cache/aia_map.json` is locked as the sole location of the
  source map.
- The source map schema is normative; see Standard S-005.

## Alternatives considered

- Debug at generated C++ level — rejected: breaks four of the five
  guarantees in ADR-0003.
- No source-level debugging (printf only) — rejected: unacceptable for
  professional development.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
