# `boards/arduino-uno/` — Arduino UNO R3

- **MCU**: ATmega328P
- **Architecture**: AVR 8-bit 16 MHz
- **Flash**: 32 KB
- **RAM**: 2 KB
- **Toolchain**: arduino-avr
- **Flash protocol**: avrdude (UART)

## VR mapping

The complete VR-to-physical mapping for this board is stored in
`board.json`. The AIA Engine loads that file at build time.

## Restrictions

{
  "reserved": [
    "PB6",
    "PB7 (crystal)"
  ]
}

## Pinout reference

See `pinout/` for the diagrams and a full pin-by-pin table.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
