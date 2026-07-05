# ADR-0003: Foundational Decision #1 — Pure VR Source / Hidden Native Backend

- **Status**: Accepted
- **Date**: 2026-06-16
- **Author**: Amine Saoud ibn al-Bashir (Pro_Amine LLC)

## Context

Embedded development is fragmented across dozens of MCU families and hundreds
of framework APIs (Arduino Core, ESP-IDF, STM32 HAL, Pico SDK, Zephyr, ...).
A developer who masters one family does not transfer that knowledge to
another without significant re-learning.

Every successful high-level language has solved this problem the same way:
the developer writes in a source language, and a compiler produces a lower
level output that the developer never sees. TypeScript → JavaScript, Kotlin
→ JVM bytecode, Dart → native ARM/x86, CUDA → PTX.

## Decision

The Pro_AmineUMT IDE with AI Platform adopts the same model, formalized as
**Pure VR Source / Hidden Native Backend**:

- The developer writes only `.umt` files using the UMT VR API.
- The Abstraction Intelligence Algorithm Engine generates the
  platform-specific C++ into `.umt/generated/main_generated.cpp`.
- The generated file is never edited, never read, and never touched by the
  developer. It is regenerated on every build and wiped by `umt clean`.

Five guarantees enforce this decision:
1. The developer never sees GPIO numbers.
2. The developer never manually selects Arduino, ESP-IDF, or Zephyr.
3. The developer never configures platform toolchains.
4. The developer writes only UMT VR code in `.umt` files.
5. All mapping, backend selection, and firmware generation are handled by
   the Abstraction Intelligence Algorithm Engine.

## Consequences

- Positive: a single `.umt` file compiles on ESP32, STM32, RP2040, and every
  future UMT-compliant MCU or SoC.
- Positive: the multi-year MCU-family learning curve collapses to a single
  VR API.
- Negative: the AIA Engine must ship a code-generation backend for every
  supported target; this is a real ongoing investment.
- Negative: debugging cannot use the traditional gdb-on-generated-C++ path
  without extra tooling. This is resolved by ADR-0004.

## Locked implications

- The name **Pure VR Source / Hidden Native Backend** is a locked canonical
  phrase.
- The five guarantees above are locked; they can only be relaxed by a new
  ADR that supersedes this one.
- The path `.umt/generated/main_generated.cpp` is locked as the sole
  location of the generated backend for a project.

## Alternatives considered

- Wrapper library (Arduino model) — rejected: exposes GPIO numbers and
  framework calls; developer still learns each MCU family.
- Bytecode virtual machine on the MCU (MicroPython model) — rejected:
  performance cost is unacceptable for real-time and low-power targets.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
