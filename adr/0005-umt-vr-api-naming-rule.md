# ADR-0005: UMT VR API Naming Rule

- **Status**: Accepted
- **Date**: 2026-06-20
- **Author**: Amine Saoud ibn al-Bashir (Pro_Amine LLC)

## Context

The UMT VR API operates at three levels: whole-interface operations
(activate, deactivate), individual channel or line operations (enable,
disable, read, write), and raw digital pin operations. Some interfaces
have a single pin (ADC channel, DAC channel, PWM channel), and others
have multiple pins (UART = RX + TX, SPI = MOSI + MISO + SCLK + CS,
I2C = SDA + SCL).

Early prototypes used direction-suffixed names uniformly, which produced
awkward expressions like `UMT.Interface(VR_ADC_IN4).activate()` — the
`_IN4` suffix is misleading at the interface level because the whole ADC
peripheral is being activated, not one input line.

## Decision

The UMT VR API adopts a two-tier naming rule:

- `Interface()` — uses the **short interface name** for `activate()` and
  `deactivate()`. Examples: `VR_ADC4`, `VR_PWM0`, `VR_DAC1`, `VR_UART0`,
  `VR_SPI0`, `VR_I2C0`.

- `Interface_Pin()` and `Digital_Pin()` — use the **direction-suffixed pin
  name** for `enable()`, `disable()`, `read()`, and `write()`. Examples:
  `VR_ADC_IN4`, `VR_PWM_OUT0`, `VR_DAC_OUT1`, `VR_UART_RX0`, `VR_UART_TX0`,
  `VR_SPI_MOSI0`.

Rationale: single-pin interfaces (ADC, PWM, DAC) address the interface as a
whole with the short name, and the specific pin with the suffixed name.
Multi-pin interfaces (UART, SPI, I2C) address the interface as a whole with
the short name, and each pin individually with its own suffixed name.

## Consequences

- Positive: expressions read naturally. `UMT.Interface(VR_ADC4).activate()`
  clearly activates the ADC peripheral; `UMT.Interface_Pin(VR_ADC_IN4).read()`
  clearly reads a specific channel.
- Positive: multi-pin interfaces gain a natural way to enable one line
  independently: `UMT.Interface_Pin(VR_UART_RX0).enable()` without
  `VR_UART_TX0`.
- Neutral: existing code using suffixed names at the interface level must
  be migrated. The AIA Engine emits a warning until v0.2.0 and an error
  from v0.3.0.

## Locked implications

- The naming rule is normative; see Standard S-001.
- `Interface()` accepting a suffixed name is deprecated behavior and will
  be removed at v0.3.0.
- The canonical example in all documentation is `VR_ADC4` on
  `VR_ADC_IN4` — a single-pin interface that demonstrates the dual role
  (potentiometer via `activate`, LED via `deactivate`).

## Alternatives considered

- Suffixed names throughout — rejected: awkward at the interface level.
- Short names throughout — rejected: ambiguous for multi-pin interfaces
  (which pin does `.enable()` on `VR_UART0` refer to?).

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
