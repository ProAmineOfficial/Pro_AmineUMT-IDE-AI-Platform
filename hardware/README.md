# Hardware (`hardware/`)

Reference designs for the physical layer of the UMT Platform.

## Subdirectories

- `bga-16x16/` — reference designs for the UMT BGA 16×16 Package Substrate
  Standard (ADR-0006, Standard S-002).
- `nanokit-integrated/` — the NanoKit Integrated Model reference designs
  (SMD/THT versions, ESP32 first-run, roadmap to STM32 and RP2040).
- `nanokit-im/` — the NanoKit-iM board — **(MCU or SoC) Integrated Modules**
  — swappable modules on a BGA 16×16 substrate.
- `reference-designs/` — application-level reference designs (motor
  controllers, sensor gateways, edge AI accelerators).

## Design files

Schematics: KiCad (`.kicad_sch`, `.kicad_pro`).
Board layout: KiCad (`.kicad_pcb`).
Gerbers: shipped in `release/*/gerbers/` per revision.
Bill of materials: CSV in `release/*/bom.csv`.

All schematic and layout files are licensed Apache-2.0 with the trademark
carve-out described in `TRADEMARKS.md`. Fabrication for personal or
commercial use is permitted; use of the NanoKit and Pro_Amine marks on
manufactured boards is not.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
