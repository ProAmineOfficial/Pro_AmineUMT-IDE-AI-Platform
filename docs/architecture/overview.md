# System Architecture Overview

The Pro_AmineUMT IDE with AI Platform has six layers, top to bottom.

## L5 — IDE, CLI, API

The developer-facing surface: Visual Studio Code extension, command-line
interface (`umt`), and HTTP/WebSocket API for programmatic access.

## L4 — Abstraction Intelligence Algorithm Engine

The single intelligence core. Ten sub-functions:
Project Analysis, Prompt Builder, Context Manager, Model Selection, API
Communication, UMT Abstraction, Code Generation, Build System, Debug
System, Documentation Generation. Deterministic-first — the abstraction
path (UMT Abstraction → Code Generation → Build) never depends on an LLM.

## L3 — UMT SDK / VR API

The only layer the developer touches. `UMT.h`, `VRTypes.h`, `UMTConfig.h`,
and `UMT.cpp` — all installed globally under `~/.umt/sdk/`. See Standard
S-008.

## L2 — Framework Layer

Hidden. Arduino Core, ESP-IDF, STM32 HAL, Pico SDK — whichever the AIA
Engine selects per target. The developer never selects a framework.

## L1 — Platform Layer

Hidden. Toolchains, linkers, HAL macros. Installed automatically under
`~/.umt/toolchains/`.

## L0 — Hardware / Silicon

The physical MCU or SoC. Addressed by VR name, never by GPIO number in
developer code.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
