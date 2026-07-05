# Frequently Asked Questions

## Is UMT a new programming language?

No. UMT is a **C++ dialect** — the same C++ syntax you already know, with
a different peripheral API library. The relationship is identical to
Arduino: `.ino` files are C++ with the Arduino Core API. `.umt` files are
C++ with the UMT VR API. Same compilers (gcc, clang), same standard types
(int, String, bool, void), same control flow.

## Why not just extend Arduino?

Arduino exposes GPIO numbers directly. UMT hides them. The single most
important difference: a `.umt` file compiles unchanged on ESP32, STM32,
and RP2040. An `.ino` file does not.

## What is the Abstraction Intelligence Algorithm Engine?

The AIA Engine (always spelled in full) is the deterministic pipeline that
transforms a `.umt` source into flashed firmware. It resolves VR names to
physical GPIOs, generates the platform-specific C++, invokes the toolchain,
and produces the source map for Debug at Source.

## Do I need special hardware?

No. Any supported development board works: NanoKit Integrated ESP32,
Arduino UNO, Raspberry Pi Pico, ESP32 DevKit, STM32 Nucleo. The UMT BGA
16×16 Package Substrate Standard is the physical-layer target for
future chipmaker adoption; existing boards use a virtual VR-to-GPIO
mapping in software.

## What does "Rising Star in Microchip Technology Solutions in Europe" refer to?

It is the award received by the founder from Corporate Vision Magazine UK
as part of the Technology Innovator Awards 2025.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
