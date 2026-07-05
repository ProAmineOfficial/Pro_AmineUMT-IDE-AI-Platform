# Platform Engine (`core/`)

The `core/` directory contains the platform engine — the code that transforms
`.umt` source files into firmware and enforces the Pure VR Source /
Hidden Native Backend contract.

## Subdirectories

- `aia-engine/` — the Abstraction Intelligence Algorithm Engine.
- `vr-sdk/` — the master copy of the UMT SDK (`UMT.h`, `VRTypes.h`,
  `UMTConfig.h`, `UMT.cpp`).
- `kernel/` — the platform kernel (project loader, build orchestration).
- `source-map/` — the source-map emitter for Debug at Source.
- `rule-engine/` — the deterministic conflict-check and pin-guard engine.

## Runtime language

`core/aia-engine/` is Node.js + TypeScript. `core/vr-sdk/` is C++.
`core/kernel/`, `core/source-map/`, and `core/rule-engine/` are TypeScript.

## Boundary with `apps/`

`core/` is a library. It does not depend on any application. `apps/ide/`,
`apps/cli/`, and `apps/simulator/` all depend on `core/`.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
