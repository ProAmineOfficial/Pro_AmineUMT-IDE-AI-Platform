# `boards/esp32-devkit/` — Espressif ESP32 DevKit v1

- **MCU**: ESP32-D0WDQ6
- **Architecture**: Xtensa LX6 dual-core 240 MHz
- **Flash**: 4 MB
- **RAM**: 520 KB
- **Toolchain**: arduino-esp32
- **Flash protocol**: esptool (UART)

## VR mapping

The complete VR-to-physical mapping for this board is stored in
`board.json`. The AIA Engine loads that file at build time.

## Restrictions

{
  "input_only": [
    "GPIO34",
    "GPIO35",
    "GPIO36",
    "GPIO39"
  ],
  "flash_reserved": [
    "GPIO6",
    "GPIO7",
    "GPIO8",
    "GPIO9",
    "GPIO10",
    "GPIO11"
  ]
}

## Pinout reference

See `pinout/` for the diagrams and a full pin-by-pin table.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
