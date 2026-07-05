# Source Map — `aia_map.json`

The source map is emitted by the AIA Engine alongside the generated C++.
It lives at `.umt/cache/aia_map.json` and enables Debug at Source.

## Schema

```json
{
  "version": 1,
  "source": "MyProject.umt",
  "generated": ".umt/generated/main_generated.cpp",
  "target": "nanokit-esp32",
  "toolchain": "arduino-esp32",
  "build_mode": "debug",
  "mappings": [
    { "umt": 2, "cpp": 4, "vr": "VR_ADC4",    "gpio": 32, "method": "activate" },
    { "umt": 3, "cpp": 5, "vr": "VR_ADC_IN4", "gpio": 32, "method": "enable" },
    { "umt": 7, "cpp": 10, "vr": "VR_ADC_IN4", "gpio": 32, "method": "read" }
  ],
  "vr_resolution": {
    "VR_ADC4":    { "peripheral": "ADC1", "channel": "CH4" },
    "VR_ADC_IN4": { "pin": "GPIO32", "peripheral": "ADC1_CH4" }
  },
  "variable_views": {
    "VR_ADC_IN4.value": { "cpp": "analogRead_result", "format": "int_0_4095" }
  }
}
```

## Bidirectional mapping

The IDE uses `mappings[]` in both directions:
- Set breakpoint: `.umt:7` → `.cpp:10` → machine address via ELF.
- Report halt: machine address → `.cpp:10` → `.umt:7` → highlight source.

## Variable views

Variables are shown at the VR level to preserve the abstraction.
`variable_views` maps every VR-level variable to its underlying C++
symbol and a format hint.

## Standard

The full normative specification is Standard S-005 (`standards/s-005-*`).

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
