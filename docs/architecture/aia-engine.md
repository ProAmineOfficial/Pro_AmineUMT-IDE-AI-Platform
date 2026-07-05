# The AIA Engine — Seven-Step Pipeline

The Abstraction Intelligence Algorithm Engine (always spelled in full)
transforms a `.umt` source into flashed firmware in seven deterministic
steps.

## Step 1 — Parse VR intent

The `.umt` source is parsed. For every VR API call, extract the intent:
which interface, which method, in which mode (activate/deactivate/enable/
disable/read/write).

## Step 2 — Full-pin scan

Scan all pins on the target MCU. Build a table of every peripheral
each pin can serve.

## Step 3 — Symbolic token match

Decompose each VR name into semantic tokens. Example: `VR_UART_RX0` →
`{UART, RX, 0}` → find a pin that supports UART peripheral 0 in RX
direction. On NanoKit ESP32, this resolves to GPIO3.

## Step 4 — Functional clone

Bind the GPIO's peripheral capability to the VR identifier for the
lifetime of this build.

## Step 5 — Conflict check

Verify: is the pin free? Is any conflicting peripheral already claimed on
it? Is it flash-reserved? Is it BOOT-strapped? Reject the build with a
clear diagnostic if any check fails.

## Step 6 — Backend code generation

Emit the platform-specific C++ into `.umt/generated/main_generated.cpp`
using the chosen framework (Arduino, ESP-IDF, HAL, Pico SDK). Emit the
source map into `.umt/cache/aia_map.json`.

## Step 7 — Compile and flash

Invoke the toolchain. Produce firmware artifacts under `.umt/build/`.
Flash to the target via UART, JTAG, SWD, or GFU as specified in the board
profile.

## Rule engine

Steps 3–5 run through a deterministic rule engine before any LLM inference.
The abstraction is never subject to an LLM's discretion — the LLM only
assists at the front-end (interpreting the user's intent when it is
ambiguous). See Standard S-003.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
