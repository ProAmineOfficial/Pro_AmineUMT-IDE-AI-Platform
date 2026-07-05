# Your First Project

This tutorial creates a project that reads a potentiometer on `VR_ADC_IN4`
and prints the value to the serial console.

## Create the project

1. In Visual Studio Code, open the command palette
   (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Run "UMT: New Project".
3. Name it `first_read`.
4. Select target `nanokit-esp32`.
5. The IDE creates the following structure:

```
first_read/
├── src/first_read.umt
├── umt.json
└── .umt/                (empty until first build)
```

## Write the code

Open `src/first_read.umt` and paste:

```cpp
void setup() {
  UMT.Interface(VR_ADC4).activate();
  UMT.Interface_Pin(VR_ADC_IN4).enable();
}

void loop() {
  int v = UMT.Interface_Pin(VR_ADC_IN4).read();
  UMT.Serial.println(v);
  UMT.delay(50);
}
```

## Build and flash

1. Click the "Build" icon in the toolbar (or `Ctrl+Shift+B`).
2. Once the build succeeds, connect your NanoKit Integrated ESP32.
3. Click "Flash". Firmware is uploaded over USB serial.

## Observe

Open the Serial Monitor. As you turn the potentiometer, values from
`0` to `4095` scroll past.

## What just happened

The Abstraction Intelligence Algorithm Engine resolved `VR_ADC_IN4` to
GPIO32 on your ESP32, generated the equivalent Arduino-ESP32 code into
`.umt/generated/main_generated.cpp`, compiled it with the ESP32 toolchain,
and flashed the resulting firmware. You never saw a GPIO number.

Continue to `quick-tour.md`.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
