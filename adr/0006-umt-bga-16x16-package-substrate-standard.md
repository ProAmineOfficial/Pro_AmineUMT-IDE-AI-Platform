# ADR-0006: UMT BGA 16×16 Package Substrate Standard

- **Status**: Accepted
- **Date**: 2026-06-22
- **Author**: Amine Saoud ibn al-Bashir (Pro_Amine LLC)

## Context

Every microchip, whether MCU or SoC, exposes a proprietary pinout at the
package substrate. Even nominally compatible chips (ESP32-D0WD versus
ESP32-S3, STM32F401 versus STM32F411, RP2040 versus RP2350) differ in ball
assignment, causing PCB designs to be non-portable at the substrate layer.

The UMT Platform relies on a stable virtual-to-physical mapping to deliver
its cross-architecture promise. That mapping is most powerful when the
physical layer itself is standardized, so that a UMT-compliant chip can be
dropped into an existing PCB without redesign.

## Decision

Establish the **UMT BGA 16×16 Package Substrate Standard**: a normative
ball-grid-array pinout of 16 rows × 16 columns (256 balls total) plus 4
external power pads, with row-and-column addresses `VR_0xRC` (R ∈ 0..F,
C ∈ 0..F).

Row assignments (locked):
- `0x0` — UART ×4 + INT0-3 + timers.
- `0x1` — SPI ×2 + QSPI + USART.
- `0x2` — USB 2.0 ×2 + USB 3.0 ×2 + CAN.
- `0x3` — I2C ×2 + I3C + PDM + BOOT + storage.
- `0x4` — JTAG + MIPI CSI Camera 1 + touch.
- `0x5` — ADC ×8 + Ethernet GbE RMII.
- `0x6` — I2S ×2 + MIPI DSI + PWM audio.
- `0x7` — DAC ×3 + HDMI 2.0 + PCIe x1 Gen3.
- `0x8` — VR_GPIO ×16 (chipmaker-extensible).
- `0x9` — LPDDR data D0–D15.
- `0xA` — LPDDR control + ODT + RST_n.
- `0xB` — Camera 2 CSI + LVDS ×2 + SPDIF.
- `0xC` — PWM ×4 + SWD + TRACE + DMA + WDT + RTC + FlexIO.
- `0xD` — Power (GND, VCC, VREF, XTAL, PLL, WAKE).
- `0xE` — DisplayPort + wireless antennas + audio differential.
- `0xF` — NFC + IR + display control + system reset.

Row `0x8` (16 GPIO pins) is intentionally left open for chipmaker-specific
custom interfaces; each chipmaker may define proprietary interfaces on
these 16 pins via `bindTo(VR_NewInterface)`.

## Consequences

- Positive: PCB designers can lay out one board and drop in any
  UMT-compliant chip without redesign.
- Positive: chipmakers gain a defined slot for proprietary innovation
  (row `0x8`) without breaking cross-compatibility.
- Positive: enables the "same code, any chip" promise at the physical
  layer, not only at the software layer.
- Negative: adoption requires chipmakers to accept a normative pinout
  constraint. This is the multi-year go-to-market effort.

## Locked implications

- The row assignments above are locked. Row-level revisions require a new
  ADR.
- The 16×16 dimension is locked. Larger BGA densities are addressed in
  future work as separate substrates (e.g. BGA 32×32) that inter-operate
  via a defined mapping — not as revisions of this standard.
- The name "UMT BGA 16×16 Package Substrate Standard" is a locked
  canonical phrase.

## Alternatives considered

- Software-only VR mapping without a physical standard — rejected: leaves
  PCB designers subject to per-chipmaker changes.
- BGA 32×32 as the initial standard — rejected: too expensive for
  cost-sensitive MCU targets. BGA 16×16 covers the current market.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
