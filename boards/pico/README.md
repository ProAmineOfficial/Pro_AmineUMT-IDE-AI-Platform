# `boards/pico/` — Raspberry Pi Pico

- **MCU**: RP2040
- **Architecture**: ARM Cortex-M0+ dual-core 133 MHz
- **Flash**: 2 MB
- **RAM**: 264 KB
- **Toolchain**: rp2040-pico-sdk
- **Flash protocol**: picotool (USB BOOTSEL)

## VR mapping

The complete VR-to-physical mapping for this board is stored in
`board.json`. The AIA Engine loads that file at build time.

## Restrictions

{
  "internal": [
    "GPIO23",
    "GPIO24",
    "GPIO25 (LED)"
  ]
}

## Pinout reference

See `pinout/` for the diagrams and a full pin-by-pin table.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
