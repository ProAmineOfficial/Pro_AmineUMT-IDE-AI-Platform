# Board Profiles (`boards/`)

Every supported target board has a subdirectory here containing:
- `board.json` — the board profile (normative schema in Standard S-006).
- `README.md` — human-facing description.
- `pinout/` — pinout images and reference tables.

The board profile is loaded by the AIA Engine at build time to resolve VR
identifiers to physical pins, select the toolchain, and choose the flash
protocol.

## Currently supported

- `nanokit-esp32/` — NanoKit Integrated ESP32 V2020 (ESP32-D0WD, Xtensa LX6).
- `arduino-uno/` — Arduino UNO R3 (ATmega328P, AVR).
- `pico/` — Raspberry Pi Pico (RP2040, Cortex-M0+).
- `esp32-devkit/` — Espressif ESP32 DevKit v1.
- `stm32-nucleo-f401re/` — STMicroelectronics Nucleo-F401RE (STM32F401RE, Cortex-M4).

Adding a new board is done via a pull request following the board-profile
schema in Standard S-006.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
