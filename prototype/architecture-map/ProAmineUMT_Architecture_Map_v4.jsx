import { useState, useEffect, useCallback, useRef } from "react";

/*═══════════════════════════════════════════════════
  Pro_AmineUMT IDE with AI — v4
  System Architecture & Dependency Map (Package Substrate Edition)

  v4 UPDATES (from v3.1):
  1. NEW: AI Bashir Conversation block (chat/voice with developer)
  2. NEW: UMT Simulator block (between AIA Engine and Targets)
  3. NEW: Code Editor block (with typing animation in demo)
  4. NEW: AIA Engine Codegen Output block (hidden C++ written char-by-char)
  5. NEW: Command — A Genius Guides You block (educational panel)
  6. NEW: Direct User → UMT SDK shortcut
  7. CHANGED: Build engine = "Codegen + Compile" (no PlatformIO mentions)
  8. CHANGED: Target B + Target C now support MCU + SoC (not just MCU)
  9. NEW: 16-step demo with conversational AI Bashir + char-by-char typing
         + educational guidance (Algorithm + Flowchart + Pseudocode)

  AIA Engine = Abstraction Intelligence Algorithm Engine
  (the smart resolution + reasoning + codegen layer)

═══════════════════════════════════════════════════
  CANONICAL DEFINITIONS — AI BASHIR + .CmdGenius
  (referenced from the Key/Glossary in 8 languages; kept here as the
   single source of truth so AI Bashir's own behaviour inside the IDE
   stays consistent with this architecture map)
═══════════════════════════════════════════════════

  ─── AI BASHIR (Integrated AI Assistant) ───
  AI Bashir is the integrated AI assistant of Pro_AmineUMT IDE with AI.
  It is the developer-facing intelligence (L5) of the platform — distinct
  from the hidden AIA Engine (L4) that performs deterministic VR→GPIO
  resolution. AI Bashir:
    • Writes UMT VR API code in `.umt` files on the developer's behalf
    • Explains UMT concepts, peripherals, and the active project context
    • Refines developer prompts into precise, build-ready specifications
    • Monitors Build / Debug / Simulation / Runtime and translates their
      output into clear human language and actionable next steps
    • Generates and maintains the `.CmdGenius` workspace for every project
    • Can be reached by chat, voice (Web Speech API), or the "Refine"
      pipeline that converses with Claude Sonnet 4.6 / DeepSeek R1 /
      ChatGPT / Gemini through the developer's own API token
    • Backend model is configurable; default for code generation tasks
      is Claude Sonnet 4.6 via the standard Messages API

  ─── .CmdGenius (Project Intelligence Workspace) — OFFICIAL v2 ───
  ★ This is the DEFINITIVE polished specification. All future AI Bashir replies,
    docs, and IDE panels must use this exact wording. ★

  `.CmdGenius` is the Project Intelligence Workspace of every UMT project. It is
  automatically created and managed by Pro_AmineUMT IDE with AI, serving as the
  project's intelligent command, guidance, and knowledge center.

  Unlike a traditional Terminal or a simple documentation folder, `.CmdGenius`
  provides a unified AI-powered workspace that brings together AI Bashir, the
  Terminal, Build Output, Debug Information, Runtime Information, and
  automatically generated engineering documentation into a single intelligent
  environment.

  Powered by AI Bashir, the integrated AI assistant of Pro_AmineUMT IDE,
  `.CmdGenius` continuously analyzes the entire project, understands the UMT VR
  API source code, monitors Build / Debug / Simulation / Runtime processes, and
  provides intelligent assistance throughout the complete software development
  lifecycle.

  `.CmdGenius` is deeply integrated with the IDE's Problems, Output, Debug
  Console, Terminal, and Ports panels. AI Bashir continuously monitors and
  interprets information from these development tools, transforming compiler
  diagnostics, runtime logs, debugging sessions, serial communication, and
  system diagnostics into clear explanations, actionable recommendations, and
  AI-powered guidance. This enables developers to understand, build, debug,
  troubleshoot, and optimize their projects from a single intelligent workspace.

  By analyzing `MyProject.umt` together with the complete project context, AI
  Bashir automatically generates engineering knowledge that helps developers:
    • Understand the project architecture
    • Wire hardware components correctly
    • Analyze algorithms and execution flow
    • Generate flowcharts and pseudocode
    • Create Architecture and Dependency Maps
    • Explain compiler, terminal, and debugger messages
    • Diagnose and resolve Build, Runtime, and hardware-communication issues
    • Improve project performance and code quality
    • Answer project-specific questions using the complete project context
    • Guide developers step by step without leaving the IDE

  `.CmdGenius` ALWAYS contains the following engineering knowledge files
  (markdown, regenerated every build) — LOCKED file names:

      .CmdGenius/
      ├── 🔌 1. Hardware Wiring — NanoKit Integrated ESP32 or Another Target.md
      ├── 📊 2. Algorithm (Logical Steps in UMT VR Language).md
      ├── 📈 3. Flowchart (Decision Tree — UMT VR Interfaces).md
      ├── 📝 4. Pseudocode (Plain English + UMT VR Names).md
      ├── 🧩 5. Algorithm & System Architecture Diagram & Dependency Map.md
      ├── 📱 6. Connect IoT / AdvancedHMI (C#) or Flutter Application Guide.md
      ├── 📚 7. API Reference.md
      ├── 🧪 8. Testing Guide.md
      ├── ⚡️ 9. Performance Report.md
      └── 🐞 10. Debug Guide.md

  Beyond generating these knowledge files, `.CmdGenius` functions as an
  interactive AI workspace where developers can: chat directly with AI Bashir;
  analyze compiler diagnostics / terminal output / build logs; receive
  AI-assisted debugging and solution recommendations; monitor serial
  communication and connected hardware through the Ports panel; understand UMT
  VR APIs, interfaces, and generated source code; automatically generate
  engineering documentation and project knowledge; visualize hardware wiring,
  algorithms, flowcharts, system architecture, and dependency diagrams; receive
  optimization recommendations for code, memory, and performance; and
  explore, understand, and maintain the project through AI-powered
  guidance without switching between multiple IDE windows.

  The leading dot (`.`) indicates that `.CmdGenius` is a hidden system
  workspace automatically managed by the UMT Platform. Developers do not edit
  or manage it manually. Instead, it continuously evolves alongside the
  project, acting as the intelligent bridge between the source code, AI
  Bashir, the AIA Engine, the Build System, the Debugger, the Terminal, and
  the IDE's Problems / Output / Debug Console / Ports panels, while
  automatically generating structured engineering knowledge and project
  documentation.

  Together, these components provide a unified, intelligent, context-aware,
  and AI-driven software development experience inside Pro_AmineUMT IDE with AI.
═══════════════════════════════════════════════════*/

const W = 1200, H = 1820;

const BL = {
  // ── LEFT COLUMN (gaps 50px - mobile-friendly) ──
  user:     { x:15,  y:50,   w:188, h:78  },
  aiChat:   { x:15,  y:178,  w:188, h:130 },   // gap=50 from user
  sdks:     { x:15,  y:358,  w:188, h:200 },   // gap=50 from aiChat
  plats:    { x:15,  y:608,  w:188, h:130 },   // gap=50 from sdks
  // ── CENTER COLUMN (gaps 55px - mobile-friendly) ──
  editor:   { x:232, y:50,   w:380, h:200 },
  aiGen:    { x:232, y:305,  w:380, h:200 },   // gap=55 from editor
  cmdGen:   { x:232, y:560,  w:380, h:220 },   // gap=55 from aiGen
  fw:       { x:232, y:835,  w:380, h:340 },   // gap=55 from cmdGen
  platform: { x:258, y:1230, w:330, h:128 },   // gap=55 from fw
  // ── BUILD PIPELINE (shifted down) ──
  build:    { x:42,  y:1408, w:240, h:88  },   // gap=50 from platform
  fwout:    { x:320, y:1408, w:175, h:48  },
  flash:    { x:320, y:1488, w:200, h:48  },
  monitor:  { x:710, y:1488, w:265, h:48  },
  // ── RIGHT COLUMN (gaps 50px - mobile-friendly) ──
  sim:      { x:632, y:50,   w:280, h:138 },
  tgtA:     { x:632, y:238,  w:280, h:240 },   // gap=50 from sim
  tgtB:     { x:632, y:528,  w:280, h:240 },   // gap=50 from tgtA
  tgtC:     { x:632, y:818,  w:280, h:240 },   // gap=50 from tgtB
  // ── FOOTER ──
  mfg:      { x:15,  y:1590, w:1170, h:155 },
};

/* ═══ CONNECTIONS — UMT SDK / Framework as Central Hub ═══
   Architecture rule: Pro_AmineUMT UMT SDK / Framework is the BASE of everything.
   Every block must connect through it (directly or via Editor → SDK).
   - User & AI Bashir interact through Editor → SDK
   - SDK manages: AI Bashir context, Target selection, AIA Codegen,
     Command Genius, Platform/SDKs/Plats, Simulator, Flash routing
   ═══════════════════════════════════════════════════════ */
const CN = [
  // === LAYER 1: User & AI Bashir → Editor (UI interaction) ===
  { id:"u-ai",   f:"user",    t:"aiChat",   m:"1", d:"Developer asks AI Bashir (chat / voice)" },
  { id:"u-ed",   f:"user",    t:"editor",   m:"",  d:"Developer writes/edits .umt code directly" },
  { id:"ai-ed",  f:"aiChat",  t:"editor",   m:"1", d:"AI Bashir generates .umt code char-by-char into Editor" },

  // === LAYER 2: AI Bashir & Editor BOTH connect to UMT SDK (the Base) ===
  { id:"ai-fw",  f:"aiChat",  t:"fw",       m:"1", d:"AI Bashir queries UMT SDK for context (boards, VRs, capabilities)" },
  { id:"ed-fw",  f:"editor",  t:"fw",       m:"1", d:"Final .umt code → UMT SDK / AIA Engine" },

  // === LAYER 3: UMT SDK orchestrates AIA Codegen + Command Genius ===
  { id:"fw-gen", f:"fw",      t:"aiGen",    m:"1", d:"UMT SDK invokes AIA Engine to write hidden C++" },
  { id:"fw-cmd", f:"fw",      t:"cmdGen",   m:"1", d:"UMT SDK invokes Command Genius (reads main.umt)" },
  { id:"cmd-ai", f:"cmdGen",  t:"aiChat",   m:"",  d:"Genius asks AI Bashir to confirm with developer" },

  // === LAYER 4: UMT SDK → Platform layer (SDKs + Plats config) ===
  { id:"fw-pl",  f:"fw",      t:"platform", m:"1", d:"UMT-IR → toolchain config" },
  { id:"pl-sdk", f:"platform",t:"sdks",     m:"1", d:"Select framework (Arduino/ESP-IDF/Zephyr)" },
  { id:"pl-plt", f:"platform",t:"plats",    m:"1", d:"Select platform (Espressif/STM/ARM)" },

  // === LAYER 5: UMT SDK → Targets (Pick Target A/B/C is managed by SDK) ===
  { id:"fw-tA",  f:"fw",      t:"tgtA",     m:"1", d:"UMT SDK picks Target A — Dev Boards (NanoKit ESP32, Arduino, ...)" },
  { id:"fw-tB",  f:"fw",      t:"tgtB",     m:"1", d:"UMT SDK picks Target B — UMT IC (MCU/SoC die on BGA)" },
  { id:"fw-tC",  f:"fw",      t:"tgtC",     m:"1", d:"UMT SDK picks Target C — NanoKit-iM (selectable module)" },

  // === LAYER 6: UMT SDK → Simulator (virtual run BEFORE flash) ===
  { id:"fw-sim", f:"fw",      t:"sim",      m:"1", d:"UMT SDK launches Simulator: virtual run before flash" },
  { id:"sim-tA", f:"sim",     t:"tgtA",     m:"",  d:"Sim → Target A virtual board" },
  { id:"sim-tB", f:"sim",     t:"tgtB",     m:"",  d:"Sim → Target B UMT IC virtual" },
  { id:"sim-tC", f:"sim",     t:"tgtC",     m:"",  d:"Sim → Target C NanoKit-iM virtual" },

  // === LAYER 7: AIA Codegen → Build pipeline (codegen + compile) ===
  { id:"gen-pl", f:"aiGen",   t:"platform", m:"1", d:"Generated C++ → toolchain for compile" },
  { id:"pl-bld", f:"platform",t:"build",    m:"1", d:"Build config → codegen + compile" },
  { id:"sk-bld", f:"sdks",    t:"build",    m:"1", d:"HAL/libs → build input" },
  { id:"pt-bld", f:"plats",   t:"build",    m:"1", d:"Platform defs → linker/startup" },
  { id:"bld-fw", f:"build",   t:"fwout",    m:"1", d:"Compile → .bin/.hex/.elf/.uf2" },
  { id:"fw-fl",  f:"fwout",   t:"flash",    m:"1", d:"Binary → flash interface" },

  // === LAYER 8: Flash → Targets ===
  { id:"fl-tA",  f:"flash",   t:"tgtA",     m:"1", d:"Flash to dev board (UART/JTAG/SWD)" },
  { id:"fl-tB",  f:"flash",   t:"tgtB",     m:"1", d:"Flash to UMT IC (JTAG/SWD)" },
  { id:"fl-tC",  f:"flash",   t:"tgtC",     m:"1", d:"Flash to NanoKit-iM (UART/JTAG/SWD)" },

  // === LAYER 9: Targets → Monitor (serial output return) ===
  { id:"tA-mn",  f:"tgtA",    t:"monitor",  m:"",  d:"Serial output FROM running board" },
  { id:"tB-mn",  f:"tgtB",    t:"monitor",  m:"",  d:"Serial output FROM running UMT IC" },
  { id:"tC-mn",  f:"tgtC",    t:"monitor",  m:"",  d:"Serial output FROM NanoKit-iM" },
  { id:"fl-mn",  f:"flash",   t:"monitor",  m:"",  d:"Debug logs → monitor display" },
];

/* ═══ EXAMPLE CODE for Editor (typing animation target) ═══ */
const EXAMPLE_CODE = `#include <UMT.h>

// DC Motor Speed Controller + RPM Display
// Project by: Developer · Target: NanoKit Integrated ESP32

volatile uint32_t pulse_count = 0;
unsigned long last_rpm_calc = 0;

void onEncoderPulse() {
  pulse_count++;
}

void setup() {
  UMT.Interface(VR_UART0).activate();     // UART0 ON — AIA claims TX/RX pins, 115200 baud, FREE → RESERVED
  UMT.Interface(VR_ADC).activate();       // ADC ON — analog subsystem armed, 12-bit
  UMT.Interface(VR_PWM_OUT0).activate();  // PWM ch0 ON — 5 kHz, 8-bit duty on GPIO2
  UMT.Interface(VR_I2C0).activate();      // I2C0 ON — SDA/SCL claimed for the LCD bus
  UMT.Interface(VR_GPIO00).bindTo(VR_INT0).activate();   // GPIO00 rebound as interrupt line
  UMT.Interface_Pin(VR_INT0).attach(onEncoderPulse, RISING);   // ISR fires on each encoder edge
  UMT.LCD.init(0x27);
  UMT.LCD.print("Motor RPM: 0");
}

void loop() {
  int pot  = UMT.Interface_Pin(VR_ADC_IN0).read();   // one conversion → 0..4095
  int duty = pot * 255 / 4095;                       // rescale 12-bit → 8-bit
  UMT.Interface_Pin(VR_PWM_OUT0).write(duty);        // motor speed follows the pot

  if (millis() - last_rpm_calc >= 1000) {
    int rpm = (pulse_count * 60) / 20;
    pulse_count = 0;
    last_rpm_calc = millis();
    UMT.LCD.clear();
    UMT.LCD.print("Speed: " + String(duty * 100 / 255) + "%");
    UMT.LCD.setCursor(0, 1);
    UMT.LCD.print("RPM: " + String(rpm));
  }
  delay(50);
}`;

/* ═══ AIA-GENERATED HIDDEN C++ (Arduino backend, never shown to developer) ═══ */
const GENERATED_CODE = `// AIA Engine Codegen · Arduino-ESP32 Core
// AIA = Abstraction Intelligence Algorithm Engine
// Hidden from developer · NanoKit ESP32 · DC Motor Controller
#include <Arduino.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);
volatile uint32_t pulse_count = 0;
unsigned long last_rpm_calc = 0;

void IRAM_ATTR onEncoderPulse() {
  pulse_count++;
}

void setup() {
  // VR_UART0 -> Serial @ 115200
  Serial.begin(115200);
  // VR_ADC -> ADC1, 12-bit resolution
  analogReadResolution(12);
  // VR_PWM_OUT0 -> LEDC ch0, 5kHz, 8-bit duty, GPIO2
  ledcSetup(0, 5000, 8);
  ledcAttachPin(2, 0);
  // VR_I2C0 -> Wire (SDA=GPIO21, SCL=GPIO22)
  Wire.begin(21, 22);
  lcd.init();
  lcd.backlight();
  lcd.print("Motor RPM: 0");
  // VR_GPIO00 bound to VR_INT0 -> GPIO4 INPUT_PULLUP + ISR
  pinMode(4, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(4), onEncoderPulse, RISING);
}

void loop() {
  // VR_ADC_IN0 -> GPIO36 (ADC1_CH0)
  int pot  = analogRead(36);
  int duty = pot * 255 / 4095;
  ledcWrite(0, duty);

  if (millis() - last_rpm_calc >= 1000) {
    int rpm = (pulse_count * 60) / 20;
    pulse_count = 0;
    last_rpm_calc = millis();
    lcd.clear();
    lcd.print("Speed: " + String(duty * 100 / 255) + "%");
    lcd.setCursor(0, 1);
    lcd.print("RPM: " + String(rpm));
  }
  delay(50);
}`;

/* ═══ COMMAND GENIUS GUIDE (UMT VR syntax — reads from main.umt, NOT Arduino) ═══ */
const CMDGEN_GUIDE = `╔════════════════════════════════════════════════════════╗
║  💡 Command — A Genius Guides You                       ║
║  Reading from: Code Editor — main.umt                   ║
║  Project: DC Motor Speed Controller + RPM Display       ║
║  Language: UMT VR (Virtual Register) syntax             ║
╚════════════════════════════════════════════════════════╝

🔌 1. HARDWARE WIRING — NanoKit Integrated ESP32

   NanoKit Integrated ESP32        UMT Components
   ┌──────────────────────┐        ┌────────────────────────┐
   │ VR_ADC_IN0   (pin 5) ├───────►│ Potentiometer wiper    │
   │                      │        │ 10kΩ (sides → 3V3/GND) │
   │ VR_PWM_OUT0  (pin17) ├───────►│ L298N IN1 (driver)     │
   │                      │        │   OUT1/OUT2 → DC Motor │
   │                      │        │   12V / 1A external PSU│
   │ VR_I2C_SDA0  (pin23) ├───────►│ 16×2 I2C LCD — SDA     │
   │ VR_I2C_SCL0  (pin18) ├───────►│ 16×2 I2C LCD — SCL     │
   │                      │        │ PCF8574 backpack 0x27  │
   │ VR_GPIO00    (pin 6) ├───────►│ Encoder Phase A output │
   │                      │        │ (RISING-edge interrupt)│
   │ VR_UART_TX0  (pin25) ├───────►│ USB-Serial → PC        │
   │ VR_GND (pin 12 & 31) ├───────►│ Common Ground rail     │
   │ +3V3                 ├───────►│ Pot / LCD / Encoder VCC│
   └──────────────────────┘        └────────────────────────┘

   ⚠ MOTOR POWER: 12V / 1A is supplied EXTERNALLY through the
      L298N driver. NEVER connect 12V directly to NanoKit pins.
   ⚠ ENCODER: assume 20 pulses per revolution (slot-type encoder).
      Change the divisor in the .umt code if your encoder differs.
   ⚠ COMMON GROUND: NanoKit GND, L298N GND, and 12V PSU GND must
      all be tied together for the signal levels to be valid.

📊 2. ALGORITHM (Logical Steps in UMT VR Language)

   STEP 1: Initialize VR Interfaces
       VR_UART0     → activate (Serial monitor)
       VR_ADC       → activate (potentiometer reads)
       VR_PWM_OUT0  → activate (motor speed PWM)
       VR_I2C0      → activate (LCD communication)
       VR_GPIO00    → bindTo(VR_INT0) → activate (encoder)
       VR_INT0      → attach(onEncoderPulse, RISING)
       LCD.init(0x27) → print "Motor RPM: 0"

   STEP 2: Main Loop (forever)
       2.1  Read VR_ADC_IN0 → potValue (0..4095)
       2.2  duty ← potValue × 255 / 4095
       2.3  Write VR_PWM_OUT0 ← duty
       2.4  IF (millis() − last_rpm_calc) ≥ 1000 THEN
              2.4.1  rpm ← (pulse_count × 60) / 20
              2.4.2  Reset pulse_count to 0
              2.4.3  Update last_rpm_calc ← millis()
              2.4.4  LCD.clear()
              2.4.5  LCD.print "Speed: " + duty% + "%"
              2.4.6  LCD.setCursor(0, 1)
              2.4.7  LCD.print "RPM: " + rpm
       2.5  delay(50 ms)

   STEP 3: Interrupt Handler (asynchronous, ISR)
       ON VR_INT0 RISING edge:
           pulse_count ← pulse_count + 1

📈 3. FLOWCHART (Decision Tree — UMT VR Interfaces)

           ┌──────────────────────────┐
           │         START            │
           └────────────┬─────────────┘
                        ▼
           ┌────────────────────────────┐
           │  INITIALIZE 5 VR INTERFACES│
           │  • VR_UART0 activate       │
           │  • VR_ADC activate         │
           │  • VR_PWM_OUT0 activate    │
           │  • VR_I2C0 activate        │
           │  • VR_GPIO00→VR_INT0 act.  │
           │  LCD.init(0x27)            │
           └────────────┬───────────────┘
                        ▼
           ┌──────────────────────────┐
           │     LOOP (forever)       │
           └────────────┬─────────────┘
                        ▼
           ┌──────────────────────────┐
           │ Read VR_ADC_IN0 → pot    │
           │ duty = pot × 255 / 4095  │
           │ Write VR_PWM_OUT0 = duty │
           └────────────┬─────────────┘
                        ▼
                 ◇ 1 second elapsed? ◇
                  ┌────┴─────┐
                YES         NO
                  ▼           ▼
       ┌──────────────────┐   │
       │ rpm = count × 60 │   │
       │       ÷ 20       │   │
       │ pulse_count = 0  │   │
       │ LCD.clear()      │   │
       │ LCD.print(...)   │   │
       └─────────┬────────┘   │
                 └─────┬──────┘
                       ▼
                  delay(50 ms)
                       │
                       ▼
                 (back to LOOP)

   ◇ ASYNC ISR ◇ ON VR_INT0 RISING EDGE:
                  pulse_count ← pulse_count + 1

📝 4. PSEUDOCODE (Plain English + UMT VR Names)

   BEGIN PROGRAM

       // Setup phase
       ACTIVATE VR_UART0       → Serial monitor @ 115200 baud
       ACTIVATE VR_ADC         → enable analog reads (12-bit)
       ACTIVATE VR_PWM_OUT0    → enable motor PWM (8-bit, 5kHz)
       ACTIVATE VR_I2C0        → enable LCD bus
       BIND     VR_GPIO00 → VR_INT0
       ACTIVATE VR_INT0 with handler onEncoderPulse, RISING edge
       INIT LCD at I2C address 0x27
       PRINT "Motor RPM: 0" on LCD

       // Main loop
       REPEAT FOREVER:
           potValue ← READ VR_ADC_IN0       // range 0..4095
           duty     ← potValue × 255 / 4095 // map to 0..255
           WRITE VR_PWM_OUT0 ← duty

           IF 1 second has elapsed SINCE last LCD update:
               rpm ← (pulse_count × 60) ÷ 20
               pulse_count ← 0
               LCD Line 1: "Speed: " + (duty × 100 / 255) + "%"
               LCD Line 2: "RPM: " + rpm
           END IF

           WAIT 50 ms
       END REPEAT

       // Interrupt service routine (asynchronous)
       ON VR_INT0 RISING EDGE:
           pulse_count ← pulse_count + 1

   END PROGRAM

🧩 5. ALGORITHM & SYSTEM ARCHITECTURE DIAGRAM & DEPENDENCY MAP

   Node-RED-style block visualization — interfaces, functions,
   inputs, outputs, component connections, and dependencies.

   ┌─ INPUTS ─────────────┐  ┌─ PROCESSING ────────────┐  ┌─ OUTPUTS ────────────┐
   │                      │  │                         │  │                      │
   │ ┌──────────────────┐ │  │ ┌─────────────────────┐ │  │ ┌──────────────────┐ │
   │ │ 🎛  VR_ADC_IN0    │─┼─►│ │ map(0-4095, 0-255)  │─┼─►│ │ ⚙  VR_PWM_OUT0    │ │
   │ │   (pot 0..4095)  │ │  │ │  duty calc.         │ │  │ │   (motor duty)   │ │
   │ └──────────────────┘ │  │ └─────────────────────┘ │  │ └────────┬─────────┘ │
   │                      │  │                         │  │          │           │
   │ ┌──────────────────┐ │  │ ┌─────────────────────┐ │  │          ▼           │
   │ │ ⚡ VR_INT0        │─┼─►│ │ pulse_count++       │ │  │  [L298N driver IC]  │
   │ │  (encoder ISR)   │ │  │ │  (async, IRAM)      │ │  │          │           │
   │ └──────────────────┘ │  │ └──────────┬──────────┘ │  │          ▼           │
   │                      │  │            ▼            │  │   DC Motor 12V/1A   │
   │ ┌──────────────────┐ │  │ ┌─────────────────────┐ │  │                      │
   │ │ ⏱  millis()       │─┼─►│ │ rpm = count×60÷20   │ │  │ ┌──────────────────┐ │
   │ │   (1 Hz timer)   │ │  │ └──────────┬──────────┘ │  │ │ 📟 VR_I2C0        │ │
   │ └──────────────────┘ │  │            ▼            │──┼─►│  (LCD 16×2 0x27) │ │
   │                      │  │ ┌─────────────────────┐ │  │ └──────────────────┘ │
   │                      │  │ │ build LCD lines     │─┼──┼─►"Speed:   xx%"     │
   │                      │  │ └─────────────────────┘ │  │  "RPM:    yyy"      │
   │                      │  │                         │  │                      │
   │                      │  │                         │  │ ┌──────────────────┐ │
   │                      │  │                         │──┼─►│ 💻 VR_UART0       │ │
   │                      │  │                         │  │ │   (debug log)    │ │
   │                      │  │                         │  │ └──────────────────┘ │
   └──────────────────────┘  └─────────────────────────┘  └──────────────────────┘

   📋 DEPENDENCY MAP (which interface depends on which):

      VR_PWM_OUT0  ← depends on ←  VR_ADC_IN0   (duty from potentiometer)
      VR_I2C0      ← depends on ←  VR_INT0      (RPM from pulse count)
      VR_I2C0      ← depends on ←  VR_ADC_IN0   (Speed% from duty)
      VR_INT0      ← depends on ←  VR_GPIO00    (bound via .bindTo)
      VR_UART0     ← depends on ←  all          (debug visibility)

   🎯 LATENCY BUDGET (real-time targets):

      ADC read + PWM update     →  every  50 ms  (20 Hz control loop)
      Encoder interrupt (ISR)   →  < 5  µs   per pulse (IRAM_ATTR)
      RPM calc + LCD update     →  every 1000 ms (1 Hz display refresh)
      Serial debug log          →  every 1000 ms (1 Hz log rate)

   🔗 INTERFACE COUNT: 5 VR interfaces working simultaneously
      (VR_UART0, VR_ADC, VR_PWM_OUT0, VR_I2C0, VR_GPIO00→VR_INT0)
      — demonstrating AIA Engine multi-peripheral coordination.

✅ Notice: ALL pins use VR_ names — NO GPIO numbers,
   NO PortA/PortB, NO Arduino references.
   This is pure UMT — the developer NEVER cares about the
   underlying chip (ESP32, STM32, RP2040 — same code works).

🤖 AI Bashir asks: "Need a deeper dive into any block, or
   shall we move to the next project?"`;

/* ═══ COMMAND GENIUS — PRO MODE (schematic-level discrete components) ═══
   Same 5 sections as MODULE mode, but section 1 (HARDWARE WIRING) and a NEW
   "BILL OF MATERIALS" sub-section show discrete electronic components instead
   of ready-made driver modules. Used when the developer wants to design a
   real PCB for production. Default packages: SMD; THT used only for parts
   that handle high voltage/current (MOSFET, relay, bulk electrolytics). */
const CMDGEN_GUIDE_PRO = `╔════════════════════════════════════════════════════════╗
║  💡 Command — A Genius Guides You  ·  ⚙ PRO MODE         ║
║  Reading from: Code Editor — main.umt                   ║
║  Project: DC Motor Speed Controller + RPM Display       ║
║  Schematic: discrete components (SMD default, THT for   ║
║             high-voltage/current parts)                 ║
╚════════════════════════════════════════════════════════╝

🔌 1. HARDWARE WIRING — Discrete Schematic on NanoKit Integrated ESP32

   Mode: PRO — components are placed individually on a PCB exactly as
   a power-electronics engineer would design for production. The
   software (.umt code) is identical to MODULE mode — only the wiring
   and BoM change. The AIA Engine outputs the same PWM signal either way.

      ESP32 (logic side, 3V3)         |        Power side (12V isolated)
   ┌──────────────────────────┐       |    ┌────────────────────────────┐
   │ VR_PWM_OUT0  (pin 17)    │──R1──►│LED ▷│PC817 collector──────┐     │
   │                          │       │  ┐ │PC817 emitter──► GND │     │
   │                          │       │  │ │                     │     │
   │                          │       │  │ │  +12V ── R2 ────────┤     │
   │                          │       │  │ │             ┌───────┴───┐ │
   │                          │       │  │ │  C3 ─┐      │  Gate     │ │
   │                          │       │  │ │      │      │ IRLZ44N   │ │
   │                          │       │  │ │      ▼     ─┤ N-MOSFET  │ │
   │                          │       │  │ │     GND     │  TO-220   │ │
   │                          │       │  │ │             │ (heatsink)│ │
   │                          │       │  │ │             └─┬───┬─────┘ │
   │                          │       │  │ │     Drain ────┘   │ Source│
   │                          │       │  │ │       │           │       │
   │ VR_ADC_IN0   (pin 5)     │◄──────┼──┘ │       │           ▼       │
   │   ↑ pot wiper (10kΩ pot, │       │    │       │          GND      │
   │     C5 100nF wiper→GND)  │       │    │       │                   │
   │                          │       │    │  Motor (12V/1A DC)        │
   │ VR_I2C_SDA0  (pin 23) ───┼───────┼────┼──► LCD 1602 + PCF8574     │
   │ VR_I2C_SCL0  (pin 18) ───┼───────┼────┼──► (R6,R7 4.7kΩ if needed)│
   │                          │       │    │                           │
   │ VR_GPIO00    (pin 6)  ◄──┼───────┼────┼──► Encoder DO (R5 10kΩ↑,  │
   │   ↑ RISING-edge IRAM ISR │       │    │     C6 100nF debounce)    │
   │                          │       │    │                           │
   │ VR_UART_TX0  (pin 25) ───┼───────┼────┼──► USB-Serial (PC)        │
   │                          │       │    │                           │
   │ VR_GND (pin 12 & 31) ─── COMMON GROUND ──── (PSU GND + 12V GND)  │
   │ +3V3                     │       │    │  ← LCD VCC, pot VCC,      │
   │                          │       │    │    encoder VCC            │
   └──────────────────────────┘       |    └────────────────────────────┘

   Notes:
     • C1 (470µF/25V THT) — placed across the 12V rail at motor PSU input
     • C2 (100nF SMD) — placed across MOSFET drain to GND (local decoupling)
     • D1 (SS34 SMD) — flyback diode in parallel with motor, cathode→+12V
                       (clamps back-EMF spikes when MOSFET switches off)
     • R3 (10Ω SMD) — gate series resistor (damps gate oscillation)
     • R4 (10kΩ SMD) — gate pull-down to source (keeps MOSFET OFF on boot)
     • Optocoupler PC817 provides full galvanic isolation between the
       3V3 logic side and the 12V power side — protects the ESP32 from
       motor noise, transients, and any ground-loop currents.

📋 BILL OF MATERIALS (PRO MODE — for one DC motor channel)

   Ref  | Component             | Value         | Package      | Notes
   -----+-----------------------+---------------+--------------+----------------
   U1   | Optocoupler           | PC817 / TLP785| SOP-4  SMD   | logic isolation
   Q1   | N-channel MOSFET      | IRLZ44N       | TO-220 THT ★ | 47A/55V, logic-Vgs
   D1   | Schottky flyback diode| SS34          | SMC    SMD   | 40V/3A, back-EMF
   R1   | Opto LED current limit| 220Ω 1/8W     | 0805   SMD   | ~5mA opto drive
   R2   | Opto collector pull-up| 4.7kΩ 1/8W    | 0805   SMD   | to +12V rail
   R3   | MOSFET gate series    | 10Ω 1/8W      | 1206   SMD   | damps Vgs ring
   R4   | MOSFET gate pull-down | 10kΩ 1/8W     | 0805   SMD   | OFF-state safety
   R5   | Encoder signal pull-up| 10kΩ 1/8W     | 0805   SMD   | open-collector
   R6,R7| I2C SDA/SCL pull-ups  | 4.7kΩ 1/8W    | 0805   SMD   | only if LCD bare
   C1   | Motor rail bulk       | 470µF / 25V   | Radial THT ★ | electrolytic
   C2   | MOSFET drain local    | 100nF / 50V   | 0805   SMD   | ceramic X7R
   C3   | Logic side bulk       | 10µF / 16V    | 1206   SMD   | tantalum
   C4   | Logic side ceramic    | 100nF / 16V   | 0805   SMD   | × 2 near ESP32
   C5   | Pot wiper noise filter| 100nF / 16V   | 0805   SMD   | RC low-pass
   C6   | Encoder debounce      | 100nF / 16V   | 0805   SMD   | wiper→GND
   RV1  | Potentiometer (speed) | 10kΩ linear   | Panel-mount  | mechanical
   LCD1 | LCD 16×2 + PCF8574    | 1602 module   | Pre-built    | I2C addr 0x27
   ENC1 | Encoder (slot/rotary) | 20 PPR        | Module/discrete
   PSU1 | DC PSU                | 12V / 2A      | External     | with EMI filter
   M1   | DC motor              | 12V / 1A      | External     | with flywheel

   ★ THT (through-hole) chosen for parts handling high current, high
     voltage, or significant heat dissipation:
        - IRLZ44N MOSFET (heatsink-friendly TO-220 for 1A continuous)
        - 470µF bulk electrolytic (THT case is cheaper + higher voltage)
        - Connectors / screw terminals for motor and PSU wiring
     Everything else is SMD (0805/1206/SOP-4/SMC) for compact PCB layout.

   ⚠ SAFETY:
     • 12V/1A is low-voltage but capable of large current spikes during
       motor stall — bulk capacitor C1 and the SS34 flyback diode are
       NOT optional, they prevent MOSFET destruction.
     • The optocoupler PC817 provides ~5kV isolation — recommended even
       at 12V to keep ESP32 power and motor power on separate ground
       planes (star-grounded at a single point).
     • Add a 1A fast-blow fuse on the 12V rail in front of C1 for
       production builds.

📊 2. ALGORITHM (Logical Steps in UMT VR Language)

   STEP 1: Initialize VR Interfaces
       VR_UART0     → activate (Serial monitor)
       VR_ADC       → activate (potentiometer reads)
       VR_PWM_OUT0  → activate (motor speed PWM — drives PC817 LED)
       VR_I2C0      → activate (LCD communication)
       VR_GPIO00    → bindTo(VR_INT0) → activate (encoder)
       VR_INT0      → attach(onEncoderPulse, RISING)
       LCD.init(0x27) → print "Motor RPM: 0"

   STEP 2: Main Loop (forever)
       2.1  Read VR_ADC_IN0 → potValue (0..4095)
       2.2  duty ← potValue × 255 / 4095
       2.3  Write VR_PWM_OUT0 ← duty  (passes through optocoupler→MOSFET)
       2.4  IF (millis() − last_rpm_calc) ≥ 1000 THEN
              2.4.1  rpm ← (pulse_count × 60) / 20
              2.4.2  Reset pulse_count to 0
              2.4.3  Update last_rpm_calc ← millis()
              2.4.4  LCD.clear()
              2.4.5  LCD.print "Speed: " + duty% + "%"
              2.4.6  LCD.setCursor(0, 1)
              2.4.7  LCD.print "RPM: " + rpm
       2.5  delay(50 ms)

   STEP 3: Interrupt Handler (asynchronous, ISR)
       ON VR_INT0 RISING edge:
           pulse_count ← pulse_count + 1

   Note: The .umt source is BIT-FOR-BIT IDENTICAL to the MODULE-mode
         source. The AIA Engine doesn't know (or care) whether the
         PWM output drives an L298N module or a discrete optocoupler+
         MOSFET stage. That's the whole point of Pure VR Source.

📈 3. FLOWCHART (Decision Tree — UMT VR Interfaces)

           ┌──────────────────────────┐
           │         START            │
           └────────────┬─────────────┘
                        ▼
           ┌────────────────────────────┐
           │  INITIALIZE 5 VR INTERFACES│
           │  • VR_UART0 activate       │
           │  • VR_ADC activate         │
           │  • VR_PWM_OUT0 activate    │
           │  • VR_I2C0 activate        │
           │  • VR_GPIO00→VR_INT0 act.  │
           │  LCD.init(0x27)            │
           └────────────┬───────────────┘
                        ▼
           ┌──────────────────────────┐
           │     LOOP (forever)       │
           └────────────┬─────────────┘
                        ▼
           ┌──────────────────────────┐
           │ Read VR_ADC_IN0 → pot    │
           │ duty = pot × 255 / 4095  │
           │ Write VR_PWM_OUT0 = duty │
           │   ↓ (via PC817 → IRLZ44N)│
           │   → motor RPM proportional│
           └────────────┬─────────────┘
                        ▼
                 ◇ 1 second elapsed? ◇
                  ┌────┴─────┐
                YES         NO
                  ▼           ▼
       ┌──────────────────┐   │
       │ rpm = count × 60 │   │
       │       ÷ 20       │   │
       │ pulse_count = 0  │   │
       │ LCD.clear()      │   │
       │ LCD.print(...)   │   │
       └─────────┬────────┘   │
                 └─────┬──────┘
                       ▼
                  delay(50 ms)
                       │
                       ▼
                 (back to LOOP)

   ◇ ASYNC ISR ◇ ON VR_INT0 RISING EDGE (via encoder pull-up + debounce):
                  pulse_count ← pulse_count + 1

📝 4. PSEUDOCODE (Plain English + UMT VR Names)

   BEGIN PROGRAM

       // Setup phase (identical to MODULE mode)
       ACTIVATE VR_UART0       → Serial monitor @ 115200 baud
       ACTIVATE VR_ADC         → enable analog reads (12-bit)
       ACTIVATE VR_PWM_OUT0    → enable motor PWM (8-bit, 5kHz)
                                (drives discrete optocoupler→MOSFET)
       ACTIVATE VR_I2C0        → enable LCD bus (+ external 4.7kΩ pull-ups)
       BIND     VR_GPIO00 → VR_INT0
       ACTIVATE VR_INT0 with handler onEncoderPulse, RISING edge
                                (encoder signal pulled up by R5 = 10kΩ)
       INIT LCD at I2C address 0x27
       PRINT "Motor RPM: 0" on LCD

       // Main loop
       REPEAT FOREVER:
           potValue ← READ VR_ADC_IN0       // range 0..4095
                                            // (C5 100nF filters wiper noise)
           duty     ← potValue × 255 / 4095 // map to 0..255
           WRITE VR_PWM_OUT0 ← duty         // → PC817 LED → MOSFET gate

           IF 1 second has elapsed SINCE last LCD update:
               rpm ← (pulse_count × 60) ÷ 20
               pulse_count ← 0
               LCD Line 1: "Speed: " + (duty × 100 / 255) + "%"
               LCD Line 2: "RPM: " + rpm
           END IF

           WAIT 50 ms
       END REPEAT

       // Interrupt service routine (asynchronous)
       ON VR_INT0 RISING EDGE:
           pulse_count ← pulse_count + 1

   END PROGRAM

🧩 5. ALGORITHM & SYSTEM ARCHITECTURE DIAGRAM & DEPENDENCY MAP

   Node-RED-style block visualization — interfaces, functions,
   inputs, outputs, component connections, and dependencies.
   PRO MODE: the OUTPUT panel shows the discrete power stage chain
   (PC817 → IRLZ44N → SS34 → Motor) instead of a single L298N module.

   ┌─ INPUTS ─────────────┐  ┌─ PROCESSING ────────────┐  ┌─ OUTPUTS ────────────┐
   │                      │  │                         │  │                      │
   │ ┌──────────────────┐ │  │ ┌─────────────────────┐ │  │ ┌──────────────────┐ │
   │ │ 🎛  VR_ADC_IN0    │─┼─►│ │ map(0-4095, 0-255)  │─┼─►│ │ ⚙  VR_PWM_OUT0    │ │
   │ │  (pot 0..4095,   │ │  │ │  duty calc.         │ │  │ │  (PWM to PC817)  │ │
   │ │   C5 noise filt.)│ │  │ └─────────────────────┘ │  │ └────────┬─────────┘ │
   │ └──────────────────┘ │  │                         │  │          │           │
   │                      │  │ ┌─────────────────────┐ │  │          ▼           │
   │ ┌──────────────────┐ │  │ │ pulse_count++       │ │  │  PC817 optocoupler  │
   │ │ ⚡ VR_INT0        │─┼─►│ │  (async, IRAM)      │ │  │   (3V3 ↔ 12V isol.) │
   │ │ (encoder pulled  │ │  │ └──────────┬──────────┘ │  │          │           │
   │ │  up by R5, C6    │ │  │            ▼            │  │          ▼           │
   │ │  debounced)      │ │  │ ┌─────────────────────┐ │  │  IRLZ44N N-MOSFET   │
   │ └──────────────────┘ │  │ │ rpm = count×60÷20   │ │  │ (gate R3+R4, drain  │
   │                      │  │ └──────────┬──────────┘ │  │  C2 decoupled)      │
   │ ┌──────────────────┐ │  │            ▼            │  │          │           │
   │ │ ⏱  millis()       │─┼─►│ ┌─────────────────────┐ │  │          ▼           │
   │ │  (1 Hz timer)    │ │  │ │ build LCD lines     │─┼──┼─►SS34 flyback diode│
   │ └──────────────────┘ │  │ └─────────────────────┘ │  │          │           │
   │                      │  │                         │  │          ▼           │
   │                      │  │                         │  │   DC Motor 12V/1A   │
   │                      │  │                         │  │ (C1 470µF bulk PSU  │
   │                      │  │                         │  │  filtering on rail) │
   │                      │  │                         │  │                      │
   │                      │  │                         │  │ ┌──────────────────┐ │
   │                      │  │                         │──┼─►│ 📟 VR_I2C0        │ │
   │                      │  │                         │  │ │ (LCD 16×2 0x27,  │ │
   │                      │  │                         │  │ │  R6/R7 4.7kΩ↑)   │ │
   │                      │  │                         │  │ └──────────────────┘ │
   │                      │  │                         │  │                      │
   │                      │  │                         │  │ ┌──────────────────┐ │
   │                      │  │                         │──┼─►│ 💻 VR_UART0       │ │
   │                      │  │                         │  │ │   (debug log)    │ │
   │                      │  │                         │  │ └──────────────────┘ │
   └──────────────────────┘  └─────────────────────────┘  └──────────────────────┘

   📋 DEPENDENCY MAP (which interface depends on which):

      VR_PWM_OUT0  ← depends on ←  VR_ADC_IN0   (duty from potentiometer)
      VR_I2C0      ← depends on ←  VR_INT0      (RPM from pulse count)
      VR_I2C0      ← depends on ←  VR_ADC_IN0   (Speed% from duty)
      VR_INT0      ← depends on ←  VR_GPIO00    (bound via .bindTo)
      VR_UART0     ← depends on ←  all          (debug visibility)

      HARDWARE chain (Pro Mode adds two stages):
        VR_PWM_OUT0 → PC817 → IRLZ44N gate → Motor (+SS34 flyback clamp)

   🎯 LATENCY BUDGET (real-time targets):

      ADC read + PWM update     →  every  50 ms  (20 Hz control loop)
      PC817 propagation delay   →  < 4   µs   (PWM still clean at 5 kHz)
      IRLZ44N switching time    →  < 50  ns   (way faster than PWM period)
      Encoder interrupt (ISR)   →  < 5   µs   per pulse (IRAM_ATTR)
      RPM calc + LCD update     →  every 1000 ms (1 Hz display refresh)
      Serial debug log          →  every 1000 ms (1 Hz log rate)

   🔗 INTERFACE COUNT: 5 VR interfaces working simultaneously
      (VR_UART0, VR_ADC, VR_PWM_OUT0, VR_I2C0, VR_GPIO00→VR_INT0)
      — same as MODULE mode; only the physical hardware after VR_PWM_OUT0
      changes (discrete schematic vs. ready-made module).

✅ Notice: ALL pins still use VR_ names — NO GPIO numbers in the .umt
   source. The schematic adds discrete parts AFTER the ESP32 pin; the
   software side is identical to MODULE mode. This is what makes UMT
   production-ready: same code, choose your hardware path.

🤖 AI Bashir asks: "Switch back to MODULE mode (L298N driver board),
   or shall we walk through PCB layout next?"`;

/* ═══ COMMAND GENIUS — ARABIC TRANSLATION (MODULE MODE) ═══
   نسخة عربية كاملة من دليل MODULE MODE — التعليمات والشروحات بالعربية،
   مع الحفاظ على المصطلحات التقنية (VR_xxx, UMT, AIA, GPIO) باللغة الإنجليزية. */
const CMDGEN_GUIDE_AR = `╔════════════════════════════════════════════════════════╗
║  💡 Command — A Genius Guides You                       ║
║  يقرأ من: Code Editor — main.umt                        ║
║  المشروع: مُتحكِّم سرعة المحرّك DC + عرض RPM            ║
║  اللغة: UMT VR (Virtual Register) syntax                ║
╚════════════════════════════════════════════════════════╝

🔌 1. التوصيل العتادي — NanoKit Integrated ESP32

   NanoKit Integrated ESP32        المكوّنات / UMT Components
   ┌──────────────────────┐        ┌────────────────────────┐
   │ VR_ADC_IN0  (دبوس 5) ├───────►│ ذراع المقاومة المتغيِّرة │
   │                      │        │ 10kΩ (الطرفان→3V3/GND) │
   │ VR_PWM_OUT0 (دبوس17) ├───────►│ L298N IN1 (مُشغِّل)     │
   │                      │        │   OUT1/OUT2 → المحرّك  │
   │                      │        │   مزوِّد 12V/1A خارجي  │
   │ VR_I2C_SDA0 (دبوس23) ├───────►│ شاشة LCD 16×2 — SDA    │
   │ VR_I2C_SCL0 (دبوس18) ├───────►│ شاشة LCD 16×2 — SCL    │
   │                      │        │ PCF8574 backpack 0x27  │
   │ VR_GPIO00   (دبوس 6) ├───────►│ خرج Phase A للـ encoder│
   │                      │        │ (مقاطعة RISING-edge)   │
   │ VR_UART_TX0 (دبوس25) ├───────►│ USB-Serial → الحاسوب   │
   │ VR_GND (دبوس 12 و31) ├───────►│ خط الأرضي المشترك      │
   │ +3V3                 ├───────►│ تغذية المكوّنات         │
   └──────────────────────┘        └────────────────────────┘

   ⚠ طاقة المحرّك: 12V/1A تُورَّد خارجياً عبر L298N. لا تُوصِّل أبداً
      جهد 12V مباشرة بأطراف NanoKit.
   ⚠ Encoder: نفترض 20 نبضة لكل دورة (slot-type). عدِّل المقسوم في
      كود .umt إذا كان الـ encoder عندك مختلفاً.
   ⚠ الأرضي المشترك: GND للـ NanoKit + GND للـ L298N + GND للـ PSU 12V
      يجب أن تكون كلها مربوطة معاً لضمان صحة مستويات الإشارة.

📊 2. الخوارزمية (خطوات منطقية بلغة UMT VR)

   الخطوة 1: تهيئة واجهات VR
       VR_UART0     ← تفعيل (Serial monitor)
       VR_ADC       ← تفعيل (قراءات المقاومة)
       VR_PWM_OUT0  ← تفعيل (PWM للتحكم بالسرعة)
       VR_I2C0      ← تفعيل (اتصال LCD)
       VR_GPIO00    ← bindTo(VR_INT0) ← تفعيل (encoder)
       VR_INT0      ← attach(onEncoderPulse, RISING)
       LCD.init(0x27) ← اطبع "Motor RPM: 0"

   الخطوة 2: الحلقة الرئيسية (إلى الأبد)
       2.1  اقرأ VR_ADC_IN0 ← قيمة المقاومة (0..4095)
       2.2  duty ← قيمة المقاومة × 255 / 4095
       2.3  اكتب على VR_PWM_OUT0 ← duty
       2.4  إذا (millis() − last_rpm_calc) ≥ 1000:
              2.4.1  rpm ← (pulse_count × 60) / 20
              2.4.2  أعد ضبط pulse_count = 0
              2.4.3  حدِّث last_rpm_calc ← millis()
              2.4.4  LCD.clear()
              2.4.5  LCD.print "Speed: " + duty% + "%"
              2.4.6  LCD.setCursor(0, 1)
              2.4.7  LCD.print "RPM: " + rpm
       2.5  delay(50 ms)

   الخطوة 3: مُعالِج المقاطعة (غير متزامن، ISR)
       عند حافة VR_INT0 صاعدة:
           pulse_count ← pulse_count + 1

📈 3. مخطط التدفق (شجرة القرارات — واجهات UMT VR)

           ┌──────────────────────────┐
           │         بداية            │
           └────────────┬─────────────┘
                        ▼
           ┌────────────────────────────┐
           │  تهيئة خمس واجهات VR      │
           │  • VR_UART0 تفعيل         │
           │  • VR_ADC تفعيل           │
           │  • VR_PWM_OUT0 تفعيل       │
           │  • VR_I2C0 تفعيل          │
           │  • VR_GPIO00→VR_INT0 تفعيل│
           │  LCD.init(0x27)            │
           └────────────┬───────────────┘
                        ▼
           ┌──────────────────────────┐
           │   حلقة (إلى الأبد)        │
           └────────────┬─────────────┘
                        ▼
           ┌──────────────────────────┐
           │ اقرأ VR_ADC_IN0 → pot    │
           │ duty = pot × 255 / 4095  │
           │ اكتب VR_PWM_OUT0 = duty  │
           └────────────┬─────────────┘
                        ▼
                 ◇ مضت ثانية واحدة؟ ◇
                  ┌────┴─────┐
                نعم        لا
                  ▼           ▼
       ┌──────────────────┐   │
       │ rpm = count × 60 │   │
       │       ÷ 20       │   │
       │ pulse_count = 0  │   │
       │ LCD.clear()      │   │
       │ LCD.print(...)   │   │
       └─────────┬────────┘   │
                 └─────┬──────┘
                       ▼
                  delay(50 ms)
                       │
                       ▼
                  (عودة إلى الحلقة)

   ◇ ISR غير متزامن ◇ عند حافة VR_INT0 صاعدة:
                      pulse_count ← pulse_count + 1

📝 4. الـ Pseudocode (شرح مبسّط بأسماء UMT VR)

   ابدأ البرنامج

       // مرحلة التهيئة
       فعِّل VR_UART0       ← Serial monitor عند 115200 baud
       فعِّل VR_ADC         ← قراءات تماثلية (12-bit)
       فعِّل VR_PWM_OUT0    ← PWM للمحرّك (8-bit، 5kHz)
       فعِّل VR_I2C0        ← bus الـ LCD
       اربط    VR_GPIO00 ← VR_INT0
       فعِّل VR_INT0 مع مُعالِج onEncoderPulse، حافة صاعدة
       تهيئة LCD عند I2C address 0x27
       اطبع "Motor RPM: 0" على LCD

       // الحلقة الرئيسية
       كرِّر إلى الأبد:
           potValue ← اقرأ VR_ADC_IN0       // المدى 0..4095
           duty     ← potValue × 255 / 4095 // التحويل إلى 0..255
           اكتب VR_PWM_OUT0 ← duty

           إذا مضت ثانية واحدة منذ آخر تحديث LCD:
               rpm ← (pulse_count × 60) ÷ 20
               pulse_count ← 0
               LCD السطر 1: "Speed: " + (duty × 100 / 255) + "%"
               LCD السطر 2: "RPM: " + rpm
           انتهِ من إذا

           انتظر 50 ms
       انتهِ من كرِّر

       // ISR — مُعالِج خدمة المقاطعة (غير متزامن)
       عند حافة VR_INT0 صاعدة:
           pulse_count ← pulse_count + 1

   انتهِ من البرنامج

🧩 5. مخطط الخوارزمية والبنية والاعتماد

   تصوير بنمط Node-RED-style — واجهات، دوال، مدخلات، مخرجات،
   توصيلات المكوّنات، والتبعيّات.

   ┌─ المدخلات ──────────┐  ┌─ المعالجة ──────────────┐  ┌─ المخرجات ──────────┐
   │                      │  │                         │  │                      │
   │ ┌──────────────────┐ │  │ ┌─────────────────────┐ │  │ ┌──────────────────┐ │
   │ │ 🎛  VR_ADC_IN0    │─┼─►│ │ map(0-4095, 0-255)  │─┼─►│ │ ⚙  VR_PWM_OUT0    │ │
   │ │  (pot 0..4095)   │ │  │ │  حساب duty          │ │  │ │  (duty المحرّك)  │ │
   │ └──────────────────┘ │  │ └─────────────────────┘ │  │ └────────┬─────────┘ │
   │                      │  │                         │  │          │           │
   │ ┌──────────────────┐ │  │ ┌─────────────────────┐ │  │          ▼           │
   │ │ ⚡ VR_INT0        │─┼─►│ │ pulse_count++       │ │  │   [L298N driver]   │
   │ │  (encoder ISR)   │ │  │ │  (غير متزامن، IRAM) │ │  │          │           │
   │ └──────────────────┘ │  │ └──────────┬──────────┘ │  │          ▼           │
   │                      │  │            ▼            │  │  محرّك DC 12V/1A    │
   │ ┌──────────────────┐ │  │ ┌─────────────────────┐ │  │                      │
   │ │ ⏱  millis()       │─┼─►│ │ rpm = count×60÷20   │ │  │ ┌──────────────────┐ │
   │ │  (مؤقّت 1 Hz)     │ │  │ └──────────┬──────────┘ │  │ │ 📟 VR_I2C0        │ │
   │ └──────────────────┘ │  │            ▼            │──┼─►│ (LCD 16×2 0x27)  │ │
   │                      │  │ ┌─────────────────────┐ │  │ └──────────────────┘ │
   │                      │  │ │ بناء أسطر LCD       │─┼──┼─►"Speed:   xx%"     │
   │                      │  │ └─────────────────────┘ │  │  "RPM:    yyy"      │
   │                      │  │                         │  │                      │
   │                      │  │                         │  │ ┌──────────────────┐ │
   │                      │  │                         │──┼─►│ 💻 VR_UART0       │ │
   │                      │  │                         │  │ │  (سجلّ التنقيح)  │ │
   │                      │  │                         │  │ └──────────────────┘ │
   └──────────────────────┘  └─────────────────────────┘  └──────────────────────┘

   📋 خريطة التبعيّات (أيّ واجهة تعتمد على أيّ):

      VR_PWM_OUT0  ← يعتمد على ←  VR_ADC_IN0   (duty من المقاومة)
      VR_I2C0      ← يعتمد على ←  VR_INT0      (RPM من عدّ النبضات)
      VR_I2C0      ← يعتمد على ←  VR_ADC_IN0   (Speed% من duty)
      VR_INT0      ← يعتمد على ←  VR_GPIO00    (مرتبط عبر .bindTo)
      VR_UART0     ← يعتمد على ←  الكل         (لظهور التنقيح)

   🎯 ميزانية الزمن الحقيقي (الأهداف الزمنية):

      قراءة ADC + تحديث PWM     →  كل  50 ms  (حلقة تحكم 20 Hz)
      مقاطعة Encoder (ISR)      →  < 5  µs   لكل نبضة (IRAM_ATTR)
      حساب RPM + تحديث LCD      →  كل 1000 ms (تحديث 1 Hz)
      سجلّ Serial للتنقيح       →  كل 1000 ms (1 Hz)

   🔗 عدد الواجهات: 5 واجهات VR تعمل في وقت واحد
      (VR_UART0, VR_ADC, VR_PWM_OUT0, VR_I2C0, VR_GPIO00→VR_INT0)
      — مما يُثبت قدرة AIA Engine على تنسيق peripherals متعدِّدة.

✅ لاحظ: كل الأطراف تستخدم أسماء VR_ — لا أرقام GPIO،
   لا PortA/PortB، ولا مراجع Arduino.
   هذا هو UMT الخالص — المطور لا يهتم أبداً بالشريحة الكامنة
   (ESP32، STM32، RP2040 — نفس الكود يعمل).

🤖 AI Bashir يسأل: "هل تريد تعمُّقاً أكبر في أيّ block،
   أم ننتقل إلى المشروع التالي؟"`;

/* ═══ COMMAND GENIUS — ARABIC TRANSLATION (PRO MODE) ═══
   نسخة عربية كاملة من دليل PRO MODE — التعليمات والشروحات بالعربية،
   مع الحفاظ على المصطلحات التقنية وأسماء المكوّنات (PC817, IRLZ44N,
   SS34, IRAM, etc.) باللغة الإنجليزية. */
const CMDGEN_GUIDE_PRO_AR = `╔════════════════════════════════════════════════════════╗
║  💡 Command — A Genius Guides You  ·  ⚙ وضع PRO          ║
║  يقرأ من: Code Editor — main.umt                        ║
║  المشروع: مُتحكِّم سرعة المحرّك DC + عرض RPM            ║
║  المخطط: مكوّنات منفصلة (SMD افتراضي، THT للجهد/         ║
║         التيار العالي)                                  ║
╚════════════════════════════════════════════════════════╝

🔌 1. التوصيل العتادي — مخطط المكوّنات المنفصلة على NanoKit ESP32

   الوضع: PRO — توضع المكوّنات بشكل فردي على PCB تماماً كما يُصمِّم
   مهندس power electronics للإنتاج. كود .umt مطابق تماماً لـ MODULE
   mode — فقط التوصيلات وقائمة المكوّنات تتغيَّر. AIA Engine تُخرِج
   نفس إشارة PWM في كلتا الحالتين.

      ESP32 (جانب المنطق، 3V3)        |        جانب الطاقة (12V معزول)
   ┌──────────────────────────┐       |    ┌────────────────────────────┐
   │ VR_PWM_OUT0 (دبوس 17)    │──R1──►│LED ▷│PC817 collector──────┐     │
   │                          │       │  ┐ │PC817 emitter──► GND │     │
   │                          │       │  │ │                     │     │
   │                          │       │  │ │  +12V ── R2 ────────┤     │
   │                          │       │  │ │             ┌───────┴───┐ │
   │                          │       │  │ │  C3 ─┐      │  Gate     │ │
   │                          │       │  │ │      │      │ IRLZ44N   │ │
   │                          │       │  │ │      ▼     ─┤ N-MOSFET  │ │
   │                          │       │  │ │     GND     │  TO-220   │ │
   │                          │       │  │ │             │ (مشتت)   │ │
   │                          │       │  │ │             └─┬───┬─────┘ │
   │                          │       │  │ │     Drain ────┘   │ Source│
   │                          │       │  │ │       │           │       │
   │ VR_ADC_IN0  (دبوس 5)     │◄──────┼──┘ │       │           ▼       │
   │   ↑ ذراع المقاومة (10kΩ، │       │    │       │          GND      │
   │     C5 100nF فلتر)       │       │    │       │                   │
   │                          │       │    │  محرّك DC 12V/1A          │
   │ VR_I2C_SDA0 (دبوس 23) ───┼───────┼────┼──► LCD 1602 + PCF8574     │
   │ VR_I2C_SCL0 (دبوس 18) ───┼───────┼────┼──► (R6,R7 4.7kΩ عند الحاجة)│
   │                          │       │    │                           │
   │ VR_GPIO00   (دبوس 6) ◄───┼───────┼────┼──► Encoder DO (R5 10kΩ↑،  │
   │   ↑ ISR ذو IRAM، حافة     │       │    │     C6 100nF debounce)    │
   │     صاعدة                │       │    │                           │
   │                          │       │    │                           │
   │ VR_UART_TX0 (دبوس 25) ───┼───────┼────┼──► USB-Serial (الحاسوب)   │
   │                          │       │    │                           │
   │ VR_GND (دبوس 12 و31) ─── أرضي مشترك ──── (PSU GND + 12V GND)     │
   │ +3V3                     │       │    │  ← LCD VCC، pot VCC،      │
   │                          │       │    │    encoder VCC            │
   └──────────────────────────┘       |    └────────────────────────────┘

   ملاحظات:
     • C1 (470µF/25V THT) — يوضع عبر قضيب 12V عند مدخل PSU المحرّك
     • C2 (100nF SMD) — يوضع عبر drain الـ MOSFET إلى GND (decoupling محلي)
     • D1 (SS34 SMD) — flyback diode موازٍ للمحرّك، الكاثود → +12V
                       (يكبح نتوءات back-EMF عند فصل MOSFET)
     • R3 (10Ω SMD) — مقاومة gate على التوالي (damping للتذبذب)
     • R4 (10kΩ SMD) — pull-down من gate إلى source (إبقاء MOSFET متوقفاً عند الإقلاع)
     • Optocoupler PC817 يُوفِّر عزلاً galvanic كاملاً بين جانب 3V3
       المنطقي وجانب 12V للطاقة — يحمي ESP32 من ضوضاء المحرّك ونتوءاته
       وأي تيارات ground-loop.

📋 قائمة المكوّنات (وضع PRO — لقناة محرّك DC واحدة)

   Ref  | المكوّن                | القيمة        | Package      | ملاحظات
   -----+-----------------------+---------------+--------------+----------------
   U1   | Optocoupler           | PC817 / TLP785| SOP-4  SMD   | عزل المنطق
   Q1   | MOSFET قناة N         | IRLZ44N       | TO-220 THT ★ | 47A/55V، logic-Vgs
   D1   | Schottky flyback diode| SS34          | SMC    SMD   | 40V/3A، back-EMF
   R1   | حد تيار LED للـ opto  | 220Ω 1/8W     | 0805   SMD   | ~5mA لـ opto
   R2   | pull-up للـ collector | 4.7kΩ 1/8W    | 0805   SMD   | إلى +12V
   R3   | gate سلسلة            | 10Ω 1/8W      | 1206   SMD   | damps Vgs ring
   R4   | gate pull-down        | 10kΩ 1/8W     | 0805   SMD   | أمان OFF-state
   R5   | pull-up لإشارة encoder| 10kΩ 1/8W     | 0805   SMD   | open-collector
   R6,R7| pull-ups لـ I2C       | 4.7kΩ 1/8W    | 0805   SMD   | عند LCD مكشوف
   C1   | bulk لقضيب المحرّك   | 470µF / 25V   | Radial THT ★ | كهرلي
   C2   | decoupling drain      | 100nF / 50V   | 0805   SMD   | ceramic X7R
   C3   | bulk جانب المنطق      | 10µF / 16V    | 1206   SMD   | tantalum
   C4   | ceramic جانب المنطق   | 100nF / 16V   | 0805   SMD   | × 2 بجوار ESP32
   C5   | فلتر ضوضاء pot wiper  | 100nF / 16V   | 0805   SMD   | RC low-pass
   C6   | debounce لـ encoder   | 100nF / 16V   | 0805   SMD   | wiper→GND
   RV1  | مقاومة متغيِّرة (سرعة)| 10kΩ linear   | Panel-mount  | ميكانيكي
   LCD1 | LCD 16×2 + PCF8574    | 1602 module   | جاهز         | I2C addr 0x27
   ENC1 | Encoder (slot/rotary) | 20 PPR        | Module/discrete
   PSU1 | مزوِّد DC             | 12V / 2A      | خارجي        | مع EMI filter
   M1   | محرّك DC              | 12V / 1A      | خارجي        | مع دولاب طيران

   ★ THT (through-hole) مُختار للأجزاء التي تتعامل مع تيار عالٍ
     أو جهد عالٍ أو تبديد حراري كبير:
        - MOSFET IRLZ44N (TO-220 صديق للمشتت، 1A متواصل)
        - 470µF كهرلي bulk (الحالة THT أرخص + جهد أعلى)
        - الموصلات / أطراف screw لتوصيلات المحرّك والـ PSU
     كل ما عدا ذلك SMD (0805/1206/SOP-4/SMC) لتخطيط PCB مضغوط.

   ⚠ السلامة:
     • 12V/1A جهد منخفض لكنه قادر على نتوءات تيار كبيرة عند توقف
       المحرّك — مكثف C1 الـ bulk وَ flyback diode SS34 ليسا
       اختياريَّين، فهما يمنعان تدمير MOSFET.
     • Optocoupler PC817 يُوفِّر عزلاً ~5kV — مُوصى به حتى عند 12V
       لإبقاء تغذية ESP32 وتغذية المحرّك على مستويين أرضيَّين منفصلين
       (star-grounded عند نقطة واحدة).
     • أضف فاصمة (fuse) سريعة الانصهار 1A على قضيب 12V أمام C1
       للإنتاج.

📊 2. الخوارزمية (خطوات منطقية بلغة UMT VR)

   الخطوة 1: تهيئة واجهات VR
       VR_UART0     ← تفعيل (Serial monitor)
       VR_ADC       ← تفعيل (قراءات المقاومة)
       VR_PWM_OUT0  ← تفعيل (PWM للمحرّك — يقود PC817 LED)
       VR_I2C0      ← تفعيل (اتصال LCD)
       VR_GPIO00    ← bindTo(VR_INT0) ← تفعيل (encoder)
       VR_INT0      ← attach(onEncoderPulse, RISING)
       LCD.init(0x27) ← اطبع "Motor RPM: 0"

   الخطوة 2: الحلقة الرئيسية (إلى الأبد)
       2.1  اقرأ VR_ADC_IN0 ← potValue (0..4095)
       2.2  duty ← potValue × 255 / 4095
       2.3  اكتب VR_PWM_OUT0 ← duty  (يمر عبر optocoupler→MOSFET)
       2.4  إذا (millis() − last_rpm_calc) ≥ 1000:
              2.4.1  rpm ← (pulse_count × 60) / 20
              2.4.2  أعد pulse_count = 0
              2.4.3  حدِّث last_rpm_calc ← millis()
              2.4.4  LCD.clear()
              2.4.5  LCD.print "Speed: " + duty% + "%"
              2.4.6  LCD.setCursor(0, 1)
              2.4.7  LCD.print "RPM: " + rpm
       2.5  delay(50 ms)

   الخطوة 3: مُعالِج المقاطعة (غير متزامن، ISR)
       عند حافة VR_INT0 صاعدة:
           pulse_count ← pulse_count + 1

   ملاحظة: مصدر .umt مُطابق حرفياً bit-for-bit لمصدر MODULE mode.
           AIA Engine لا تعرف (ولا تهتم) إذا كان خرج PWM يقود
           L298N module أم optocoupler+MOSFET منفصلين. هذه هي
           نقطة Pure VR Source بأكملها.

📈 3. مخطط التدفق (شجرة قرارات — واجهات UMT VR)

           ┌──────────────────────────┐
           │         بداية            │
           └────────────┬─────────────┘
                        ▼
           ┌────────────────────────────┐
           │  تهيئة خمس واجهات VR      │
           │  • VR_UART0 تفعيل         │
           │  • VR_ADC تفعيل           │
           │  • VR_PWM_OUT0 تفعيل       │
           │  • VR_I2C0 تفعيل          │
           │  • VR_GPIO00→VR_INT0 تفعيل│
           │  LCD.init(0x27)            │
           └────────────┬───────────────┘
                        ▼
           ┌──────────────────────────┐
           │   حلقة (إلى الأبد)        │
           └────────────┬─────────────┘
                        ▼
           ┌──────────────────────────┐
           │ اقرأ VR_ADC_IN0 → pot    │
           │ duty = pot × 255 / 4095  │
           │ اكتب VR_PWM_OUT0 = duty  │
           │   ↓ (عبر PC817 → IRLZ44N)│
           │   → RPM المحرّك متناسب  │
           └────────────┬─────────────┘
                        ▼
                 ◇ مضت ثانية؟ ◇
                  ┌────┴─────┐
                نعم        لا
                  ▼           ▼
       ┌──────────────────┐   │
       │ rpm = count × 60 │   │
       │       ÷ 20       │   │
       │ pulse_count = 0  │   │
       │ LCD.clear()      │   │
       │ LCD.print(...)   │   │
       └─────────┬────────┘   │
                 └─────┬──────┘
                       ▼
                  delay(50 ms)
                       │
                       ▼
                  (عودة إلى الحلقة)

   ◇ ISR غير متزامن ◇ عند حافة VR_INT0 صاعدة (عبر pull-up + debounce):
                      pulse_count ← pulse_count + 1

📝 4. Pseudocode (شرح بسيط بأسماء UMT VR)

   ابدأ البرنامج

       // مرحلة التهيئة (مطابقة لـ MODULE mode)
       فعِّل VR_UART0       ← Serial monitor عند 115200 baud
       فعِّل VR_ADC         ← قراءات تماثلية (12-bit)
       فعِّل VR_PWM_OUT0    ← PWM للمحرّك (8-bit، 5kHz)
                              (يقود optocoupler→MOSFET منفصلين)
       فعِّل VR_I2C0        ← bus الـ LCD (+ pull-ups خارجية 4.7kΩ)
       اربط    VR_GPIO00 ← VR_INT0
       فعِّل VR_INT0 مع مُعالِج onEncoderPulse، حافة صاعدة
                              (إشارة encoder مسحوبة بـ R5 = 10kΩ)
       تهيئة LCD عند I2C address 0x27
       اطبع "Motor RPM: 0" على LCD

       // الحلقة الرئيسية
       كرِّر إلى الأبد:
           potValue ← اقرأ VR_ADC_IN0       // المدى 0..4095
                                           // (C5 100nF يفلتر ضوضاء wiper)
           duty     ← potValue × 255 / 4095 // تحويل إلى 0..255
           اكتب VR_PWM_OUT0 ← duty         // → PC817 LED → MOSFET gate

           إذا مضت ثانية منذ آخر تحديث LCD:
               rpm ← (pulse_count × 60) ÷ 20
               pulse_count ← 0
               LCD السطر 1: "Speed: " + (duty × 100 / 255) + "%"
               LCD السطر 2: "RPM: " + rpm
           انتهِ من إذا

           انتظر 50 ms
       انتهِ من كرِّر

       // ISR — مُعالِج خدمة المقاطعة (غير متزامن)
       عند حافة VR_INT0 صاعدة:
           pulse_count ← pulse_count + 1

   انتهِ من البرنامج

🧩 5. مخطط الخوارزمية والبنية والاعتماد

   تصوير بنمط Node-RED-style — واجهات، دوال، مدخلات، مخرجات،
   توصيلات المكوّنات، والتبعيّات.
   وضع PRO: لوحة المخرجات تُظهر سلسلة الطاقة المنفصلة
   (PC817 → IRLZ44N → SS34 → محرّك) بدلاً من L298N module واحد.

   ┌─ المدخلات ──────────┐  ┌─ المعالجة ──────────────┐  ┌─ المخرجات ──────────┐
   │                      │  │                         │  │                      │
   │ ┌──────────────────┐ │  │ ┌─────────────────────┐ │  │ ┌──────────────────┐ │
   │ │ 🎛  VR_ADC_IN0    │─┼─►│ │ map(0-4095, 0-255)  │─┼─►│ │ ⚙  VR_PWM_OUT0    │ │
   │ │ (pot 0..4095،    │ │  │ │  حساب duty          │ │  │ │  (PWM إلى PC817) │ │
   │ │  C5 فلتر ضوضاء)  │ │  │ └─────────────────────┘ │  │ └────────┬─────────┘ │
   │ └──────────────────┘ │  │                         │  │          │           │
   │                      │  │ ┌─────────────────────┐ │  │          ▼           │
   │ ┌──────────────────┐ │  │ │ pulse_count++       │ │  │  PC817 optocoupler  │
   │ │ ⚡ VR_INT0        │─┼─►│ │  (غير متزامن، IRAM) │ │  │   (عزل 3V3 ↔ 12V)  │
   │ │ (encoder مسحوب   │ │  │ └──────────┬──────────┘ │  │          │           │
   │ │  بـ R5، C6        │ │  │            ▼            │  │          ▼           │
   │ │  debounced)      │ │  │ ┌─────────────────────┐ │  │  IRLZ44N N-MOSFET   │
   │ └──────────────────┘ │  │ │ rpm = count×60÷20   │ │  │ (gate R3+R4، drain  │
   │                      │  │ └──────────┬──────────┘ │  │  C2 decoupled)      │
   │ ┌──────────────────┐ │  │            ▼            │  │          │           │
   │ │ ⏱  millis()       │─┼─►│ ┌─────────────────────┐ │  │          ▼           │
   │ │  (مؤقّت 1 Hz)     │ │  │ │ بناء أسطر LCD       │─┼──┼─►SS34 flyback diode│
   │ └──────────────────┘ │  │ └─────────────────────┘ │  │          │           │
   │                      │  │                         │  │          ▼           │
   │                      │  │                         │  │   محرّك DC 12V/1A   │
   │                      │  │                         │  │ (C1 470µF bulk PSU  │
   │                      │  │                         │  │  يفلتر القضيب)      │
   │                      │  │                         │  │                      │
   │                      │  │                         │  │ ┌──────────────────┐ │
   │                      │  │                         │──┼─►│ 📟 VR_I2C0        │ │
   │                      │  │                         │  │ │ (LCD 16×2 0x27، │ │
   │                      │  │                         │  │ │  R6/R7 4.7kΩ↑)   │ │
   │                      │  │                         │  │ └──────────────────┘ │
   │                      │  │                         │  │                      │
   │                      │  │                         │  │ ┌──────────────────┐ │
   │                      │  │                         │──┼─►│ 💻 VR_UART0       │ │
   │                      │  │                         │  │ │  (سجلّ التنقيح)  │ │
   │                      │  │                         │  │ └──────────────────┘ │
   └──────────────────────┘  └─────────────────────────┘  └──────────────────────┘

   📋 خريطة التبعيّات (أيّ واجهة تعتمد على أيّ):

      VR_PWM_OUT0  ← يعتمد على ←  VR_ADC_IN0   (duty من المقاومة)
      VR_I2C0      ← يعتمد على ←  VR_INT0      (RPM من عدّ النبضات)
      VR_I2C0      ← يعتمد على ←  VR_ADC_IN0   (Speed% من duty)
      VR_INT0      ← يعتمد على ←  VR_GPIO00    (مرتبط عبر .bindTo)
      VR_UART0     ← يعتمد على ←  الكل         (لظهور التنقيح)

      سلسلة العتاد (PRO mode تُضيف مرحلتين):
        VR_PWM_OUT0 → PC817 → gate IRLZ44N → محرّك (+SS34 flyback clamp)

   🎯 ميزانية الزمن الحقيقي (الأهداف الزمنية):

      قراءة ADC + تحديث PWM     →  كل  50 ms  (حلقة تحكم 20 Hz)
      تأخير propagation للـ PC817 → < 4   µs   (PWM لا يزال نظيفاً عند 5 kHz)
      زمن تبديل IRLZ44N         →  < 50  ns   (أسرع بكثير من فترة PWM)
      مقاطعة Encoder (ISR)      →  < 5   µs   لكل نبضة (IRAM_ATTR)
      حساب RPM + تحديث LCD      →  كل 1000 ms (تحديث 1 Hz)
      سجلّ Serial للتنقيح       →  كل 1000 ms (1 Hz)

   🔗 عدد الواجهات: 5 واجهات VR تعمل في وقت واحد
      (VR_UART0, VR_ADC, VR_PWM_OUT0, VR_I2C0, VR_GPIO00→VR_INT0)
      — نفس MODULE mode؛ فقط العتاد الفيزيائي بعد VR_PWM_OUT0
      يتغيَّر (مخطط منفصل مقابل وحدة جاهزة).

✅ لاحظ: كل الأطراف لا تزال تستخدم أسماء VR_ — لا أرقام GPIO في
   مصدر .umt. المخطط يُضيف أجزاءً منفصلة بعد دبوس ESP32؛ جانب
   البرنامج مطابق لـ MODULE mode. هذا ما يجعل UMT جاهزاً للإنتاج:
   نفس الكود، اختر مسار عتادك.

🤖 AI Bashir يسأل: "هل ننتقل إلى MODULE mode (لوحة L298N)،
   أم نتجوّل في تصميم PCB التالي؟"`;

/* ═══ COMMAND GENIUS — РУССКИЙ ПЕРЕВОД (MODULE MODE) ═══
   Полная русская версия руководства MODULE MODE. Технические термины (VR_xxx,
   UMT, AIA, GPIO и т.п.) остаются на английском по правилу проекта. */
const CMDGEN_GUIDE_RU = `╔════════════════════════════════════════════════════════╗
║  💡 Command — A Genius Guides You                       ║
║  Источник: Code Editor — main.umt                       ║
║  Проект: Регулятор скорости DC мотора + индикатор RPM   ║
║  Язык: UMT VR (Virtual Register) syntax                 ║
╚════════════════════════════════════════════════════════╝

🔌 1. АППАРАТНАЯ РАЗВОДКА — NanoKit Integrated ESP32

   NanoKit Integrated ESP32        Компоненты / UMT Components
   ┌──────────────────────┐        ┌────────────────────────┐
   │ VR_ADC_IN0  (pin 5)  ├───────►│ Ползунок потенциометра │
   │                      │        │ 10kΩ (концы → 3V3/GND) │
   │ VR_PWM_OUT0 (pin 17) ├───────►│ L298N IN1 (драйвер)    │
   │                      │        │   OUT1/OUT2 → мотор    │
   │                      │        │   12V/1A внешний PSU   │
   │ VR_I2C_SDA0 (pin 23) ├───────►│ LCD 16×2 — SDA         │
   │ VR_I2C_SCL0 (pin 18) ├───────►│ LCD 16×2 — SCL         │
   │                      │        │ PCF8574 backpack 0x27  │
   │ VR_GPIO00   (pin 6)  ├───────►│ Encoder Phase A        │
   │                      │        │ (прерывание по фронту) │
   │ VR_UART_TX0 (pin 25) ├───────►│ USB-Serial → ПК        │
   │ VR_GND (pin 12 & 31) ├───────►│ Общая земля            │
   │ +3V3                 ├───────►│ Питание компонентов    │
   └──────────────────────┘        └────────────────────────┘

   ⚠ ПИТАНИЕ МОТОРА: 12V/1A подаётся ВНЕШНЕ через L298N.
      НИКОГДА не подавайте 12V напрямую на выводы NanoKit.
   ⚠ ENCODER: предполагаются 20 импульсов на оборот.
      Измените делитель в .umt при другом энкодере.
   ⚠ ОБЩАЯ ЗЕМЛЯ: GND NanoKit + GND L298N + GND PSU 12V
      должны быть соединены вместе для корректных уровней.

📊 2. АЛГОРИТМ (логические шаги на языке UMT VR)

   ШАГ 1: Инициализация VR-интерфейсов
       VR_UART0     → активировать (Serial monitor)
       VR_ADC       → активировать (чтение потенциометра)
       VR_PWM_OUT0  → активировать (PWM скорости мотора)
       VR_I2C0      → активировать (связь с LCD)
       VR_GPIO00    → bindTo(VR_INT0) → активировать (encoder)
       VR_INT0      → attach(onEncoderPulse, RISING)
       LCD.init(0x27) → вывести "Motor RPM: 0"

   ШАГ 2: Основной цикл (вечно)
       2.1  Прочитать VR_ADC_IN0 → potValue (0..4095)
       2.2  duty ← potValue × 255 / 4095
       2.3  Записать VR_PWM_OUT0 ← duty
       2.4  ЕСЛИ (millis() − last_rpm_calc) ≥ 1000 ТО
              2.4.1  rpm ← (pulse_count × 60) / 20
              2.4.2  pulse_count ← 0
              2.4.3  last_rpm_calc ← millis()
              2.4.4  LCD.clear()
              2.4.5  LCD.print "Speed: " + duty% + "%"
              2.4.6  LCD.setCursor(0, 1)
              2.4.7  LCD.print "RPM: " + rpm
       2.5  delay(50 ms)

   ШАГ 3: Обработчик прерывания (асинхронно, ISR)
       НА восходящем фронте VR_INT0:
           pulse_count ← pulse_count + 1

📈 3. БЛОК-СХЕМА (дерево решений — VR-интерфейсы)

           ┌──────────────────────────┐
           │         СТАРТ            │
           └────────────┬─────────────┘
                        ▼
           ┌────────────────────────────┐
           │ ИНИЦИАЛИЗАЦИЯ 5 ИНТЕРФЕЙСОВ│
           │  • VR_UART0 активировать   │
           │  • VR_ADC активировать     │
           │  • VR_PWM_OUT0 активировать│
           │  • VR_I2C0 активировать    │
           │  • VR_GPIO00→VR_INT0 акт.  │
           │  LCD.init(0x27)            │
           └────────────┬───────────────┘
                        ▼
           ┌──────────────────────────┐
           │     ЦИКЛ (вечно)         │
           └────────────┬─────────────┘
                        ▼
           ┌──────────────────────────┐
           │ Чтение VR_ADC_IN0 → pot  │
           │ duty = pot × 255 / 4095  │
           │ Запись VR_PWM_OUT0 = duty│
           └────────────┬─────────────┘
                        ▼
                 ◇ Прошла 1 секунда? ◇
                  ┌────┴─────┐
                ДА          НЕТ
                  ▼           ▼
       ┌──────────────────┐   │
       │ rpm = count × 60 │   │
       │       ÷ 20       │   │
       │ pulse_count = 0  │   │
       │ LCD.clear()      │   │
       │ LCD.print(...)   │   │
       └─────────┬────────┘   │
                 └─────┬──────┘
                       ▼
                  delay(50 ms)
                       │
                       ▼
                  (назад к ЦИКЛУ)

   ◇ АСИНХРОННОЕ ISR ◇ НА восходящем фронте VR_INT0:
                       pulse_count ← pulse_count + 1

📝 4. ПСЕВДОКОД (простой русский + имена UMT VR)

   НАЧАЛО ПРОГРАММЫ

       // Фаза инициализации
       АКТИВИРОВАТЬ VR_UART0   → Serial monitor @ 115200 baud
       АКТИВИРОВАТЬ VR_ADC     → аналоговое чтение (12-bit)
       АКТИВИРОВАТЬ VR_PWM_OUT0→ PWM мотора (8-bit, 5kHz)
       АКТИВИРОВАТЬ VR_I2C0    → шина LCD
       ПРИВЯЗАТЬ    VR_GPIO00 → VR_INT0
       АКТИВИРОВАТЬ VR_INT0 с обработчиком onEncoderPulse, RISING
       ИНИЦ. LCD по адресу I2C 0x27
       ВЫВЕСТИ "Motor RPM: 0" на LCD

       // Основной цикл
       ПОВТОРЯТЬ ВЕЧНО:
           potValue ← ЧИТАТЬ VR_ADC_IN0      // диапазон 0..4095
           duty     ← potValue × 255 / 4095  // 0..255
           ЗАПИСАТЬ VR_PWM_OUT0 ← duty

           ЕСЛИ прошла 1 секунда С последнего обновления LCD:
               rpm ← (pulse_count × 60) ÷ 20
               pulse_count ← 0
               LCD стр.1: "Speed: " + (duty × 100 / 255) + "%"
               LCD стр.2: "RPM: " + rpm
           КОНЕЦ ЕСЛИ

           ЖДАТЬ 50 ms
       КОНЕЦ ПОВТОРА

       // Обработчик прерывания (асинхронный)
       НА восходящем фронте VR_INT0:
           pulse_count ← pulse_count + 1

   КОНЕЦ ПРОГРАММЫ

🧩 5. АЛГОРИТМ И АРХИТЕКТУРА И КАРТА ЗАВИСИМОСТЕЙ

   Визуализация в стиле Node-RED — интерфейсы, функции, входы,
   выходы, соединения компонентов и зависимости.

   ┌─ ВХОДЫ ──────────────┐  ┌─ ОБРАБОТКА ─────────────┐  ┌─ ВЫХОДЫ ─────────────┐
   │                      │  │                         │  │                      │
   │ ┌──────────────────┐ │  │ ┌─────────────────────┐ │  │ ┌──────────────────┐ │
   │ │ 🎛  VR_ADC_IN0    │─┼─►│ │ map(0-4095, 0-255)  │─┼─►│ │ ⚙  VR_PWM_OUT0    │ │
   │ │   (pot 0..4095)  │ │  │ │  расчёт duty        │ │  │ │   (duty мотора)  │ │
   │ └──────────────────┘ │  │ └─────────────────────┘ │  │ └────────┬─────────┘ │
   │                      │  │                         │  │          │           │
   │ ┌──────────────────┐ │  │ ┌─────────────────────┐ │  │          ▼           │
   │ │ ⚡ VR_INT0        │─┼─►│ │ pulse_count++       │ │  │   [L298N драйвер]  │
   │ │  (encoder ISR)   │ │  │ │  (асинхр., IRAM)    │ │  │          │           │
   │ └──────────────────┘ │  │ └──────────┬──────────┘ │  │          ▼           │
   │                      │  │            ▼            │  │   DC мотор 12V/1A   │
   │ ┌──────────────────┐ │  │ ┌─────────────────────┐ │  │                      │
   │ │ ⏱  millis()       │─┼─►│ │ rpm = count×60÷20   │ │  │ ┌──────────────────┐ │
   │ │   (таймер 1 Hz)  │ │  │ └──────────┬──────────┘ │  │ │ 📟 VR_I2C0        │ │
   │ └──────────────────┘ │  │            ▼            │──┼─►│  (LCD 16×2 0x27) │ │
   │                      │  │ ┌─────────────────────┐ │  │ └──────────────────┘ │
   │                      │  │ │ формирование строк  │─┼──┼─►"Speed:   xx%"     │
   │                      │  │ └─────────────────────┘ │  │  "RPM:    yyy"      │
   │                      │  │                         │  │                      │
   │                      │  │                         │  │ ┌──────────────────┐ │
   │                      │  │                         │──┼─►│ 💻 VR_UART0       │ │
   │                      │  │                         │  │ │  (debug log)     │ │
   │                      │  │                         │  │ └──────────────────┘ │
   └──────────────────────┘  └─────────────────────────┘  └──────────────────────┘

   📋 КАРТА ЗАВИСИМОСТЕЙ (какой интерфейс от какого зависит):

      VR_PWM_OUT0  ← зависит от ←  VR_ADC_IN0   (duty из потенциометра)
      VR_I2C0      ← зависит от ←  VR_INT0      (RPM из счёта импульсов)
      VR_I2C0      ← зависит от ←  VR_ADC_IN0   (Speed% из duty)
      VR_INT0      ← зависит от ←  VR_GPIO00    (привязан через .bindTo)
      VR_UART0     ← зависит от ←  всех         (для отладки)

   🎯 БЮДЖЕТ РЕАЛЬНОГО ВРЕМЕНИ:

      ADC + обновление PWM      →  каждые  50 ms (20 Hz петля)
      Прерывание encoder (ISR)  →  < 5  µs   на импульс (IRAM_ATTR)
      Расчёт RPM + LCD          →  каждые 1000 ms (1 Hz обновление)
      Serial debug log          →  каждые 1000 ms (1 Hz логи)

   🔗 КОЛИЧЕСТВО ИНТЕРФЕЙСОВ: 5 VR работают одновременно
      (VR_UART0, VR_ADC, VR_PWM_OUT0, VR_I2C0, VR_GPIO00→VR_INT0)
      — демонстрирует координацию AIA Engine.

✅ Заметьте: все выводы используют имена VR_ — никаких GPIO,
   никаких PortA/PortB, никаких Arduino-ссылок.
   Это чистый UMT — разработчик НЕ заботится о чипе под капотом
   (ESP32, STM32, RP2040 — один и тот же код работает).

🤖 AI Bashir спрашивает: "Нужно глубже разобрать какой-то блок,
   или переходим к следующему проекту?"`;

/* ═══ LANGUAGE TRANSLATIONS — 8 LANGUAGES ═══
   Technical terms (VR_xxx, UMT, AIA, GPIO, etc.) ALWAYS stay in English.
   Only the explanation prose is translated.
   Add more languages here by following the same key structure. */
const LANGUAGES = [
  { code:"en", flag:"🇬🇧", name:"English",   dir:"ltr" },
  { code:"ar", flag:"🇩🇿", name:"العربية",   dir:"rtl" },
  { code:"ru", flag:"🇷🇺", name:"Русский",   dir:"ltr" },
  { code:"hi", flag:"🇮🇳", name:"हिन्दी",      dir:"ltr" },
  { code:"es", flag:"🇪🇸", name:"Español",   dir:"ltr" },
  { code:"de", flag:"🇩🇪", name:"Deutsch",   dir:"ltr" },
  { code:"zh", flag:"🇨🇳", name:"中文",       dir:"ltr" },
  { code:"ja", flag:"🇯🇵", name:"日本語",     dir:"ltr" },
];

/* ═══ WRITE-PROJECT-HERE BUTTON LABELS (i18n) ═══
   Localized labels for the custom-project input button — switch based on
   currently selected UI language. Technical labels (Generate, Reset, Refine)
   stay short and recognizable across languages. */
const WRITE_PROJECT_LABELS = {
  en: { open: "▶ Write Your Project Here",      close: "▼ Write Your Project Here",      active: "✓ Custom project active · click to edit",  placeholder: "Example: I want to build a motion alarm with PIR sensor, buzzer, and OLED display, all running on NanoKit Integrated ESP32 ...",                                                generate: "🪄 Generate 16 Steps",        refine: "🎯 AI Project Interview",        reset: "✕ Reset",  voiceTip: "Click to dictate — voice input",                            sendTip: "Send to AI Bashir for the project interview",                       platformLabel: "Project type:",            wordCount: "words", masterPrompt: "🪄 Generate Master Prompt", interviewReady: "✅ AI Bashir is ready to generate the Master Prompt", masterPromptTip: "Generate the full Master Prompt now — uses the interview chat as context" },
  ar: { open: "▶ اكتب مشروعك هنا",                 close: "▼ اكتب مشروعك هنا",                 active: "✓ المشروع المُخصَّص فعّال · اضغط للتعديل",         placeholder: "مثال: أريد بناء نظام إنذار حركة بحسّاس PIR وجَرَس وشاشة OLED، يعمل كله على NanoKit Integrated ESP32 ...",                                                       generate: "🪄 وَلِّد 16 خطوة",            refine: "🎯 مقابلة المشروع مع AI Bashir",   reset: "✕ إعادة ضبط", voiceTip: "اضغط للإملاء — إدخال صوتي",                                  sendTip: "أرسل إلى AI Bashir لبدء مقابلة المشروع",                             platformLabel: "نوع المشروع:",             wordCount: "كلمة",  masterPrompt: "🪄 وَلِّد Master Prompt",      interviewReady: "✅ AI Bashir جاهز لتوليد الـ Master Prompt",            masterPromptTip: "وَلِّد Master Prompt الكامل الآن — يعتمد على محادثة المقابلة" },
  ru: { open: "▶ Напишите ваш проект здесь",      close: "▼ Напишите ваш проект здесь",       active: "✓ Пользовательский проект активен · нажмите для редактирования", placeholder: "Пример: я хочу построить систему сигнализации движения с PIR-датчиком, зуммером и OLED-дисплеем, всё работает на NanoKit Integrated ESP32 ...",            generate: "🪄 Создать 16 шагов",         refine: "🎯 Интервью по проекту",            reset: "✕ Сброс",  voiceTip: "Нажмите для диктовки — голосовой ввод",                      sendTip: "Отправить AI Bashir для проектного интервью",                              platformLabel: "Тип проекта:",            wordCount: "слов",  masterPrompt: "🪄 Создать Master Prompt",   interviewReady: "✅ AI Bashir готов создать Master Prompt",              masterPromptTip: "Создать полный Master Prompt — на основе чата интервью" },
  hi: { open: "▶ अपना प्रोजेक्ट यहाँ लिखें",         close: "▼ अपना प्रोजेक्ट यहाँ लिखें",          active: "✓ कस्टम प्रोजेक्ट सक्रिय · संपादित करने के लिए क्लिक करें",       placeholder: "उदाहरण: मैं PIR सेंसर, बज़र और OLED डिस्प्ले के साथ एक मोशन अलार्म सिस्टम बनाना चाहता हूँ, सब कुछ NanoKit Integrated ESP32 पर चलता है ...",     generate: "🪄 16 चरण बनाएँ",           refine: "🎯 AI प्रोजेक्ट इंटरव्यू",            reset: "✕ रीसेट",  voiceTip: "बोलने के लिए क्लिक करें — आवाज़ इनपुट",                       sendTip: "प्रोजेक्ट इंटरव्यू के लिए AI Bashir को भेजें",                       platformLabel: "प्रोजेक्ट प्रकार:",          wordCount: "शब्द",  masterPrompt: "🪄 Master Prompt बनाएँ",     interviewReady: "✅ AI Bashir Master Prompt बनाने के लिए तैयार है",     masterPromptTip: "इंटरव्यू चैट से पूर्ण Master Prompt बनाएँ" },
  es: { open: "▶ Escriba su proyecto aquí",       close: "▼ Escriba su proyecto aquí",        active: "✓ Proyecto personalizado activo · clic para editar",            placeholder: "Ejemplo: quiero construir un sistema de alarma de movimiento con sensor PIR, zumbador y pantalla OLED, todo funcionando en NanoKit Integrated ESP32 ...",  generate: "🪄 Generar 16 pasos",         refine: "🎯 Entrevista del proyecto",         reset: "✕ Reiniciar",voiceTip: "Clic para dictar — entrada de voz",                          sendTip: "Enviar a AI Bashir para la entrevista del proyecto",                      platformLabel: "Tipo de proyecto:",       wordCount: "palabras", masterPrompt: "🪄 Generar Master Prompt",  interviewReady: "✅ AI Bashir está listo para generar el Master Prompt", masterPromptTip: "Generar el Master Prompt completo — basado en la entrevista" },
  de: { open: "▶ Schreiben Sie Ihr Projekt hier",  close: "▼ Schreiben Sie Ihr Projekt hier",  active: "✓ Eigenes Projekt aktiv · zum Bearbeiten klicken",                placeholder: "Beispiel: Ich möchte einen Bewegungsalarm mit PIR-Sensor, Summer und OLED-Display bauen, alles läuft auf NanoKit Integrated ESP32 ...",                  generate: "🪄 16 Schritte erzeugen",     refine: "🎯 KI-Projekt-Interview",            reset: "✕ Zurücksetzen",voiceTip: "Klicken zum Diktieren — Spracheingabe",                  sendTip: "An AI Bashir senden für das Projekt-Interview",                   platformLabel: "Projekttyp:",             wordCount: "Wörter", masterPrompt: "🪄 Master Prompt erzeugen", interviewReady: "✅ AI Bashir ist bereit, den Master Prompt zu erstellen", masterPromptTip: "Erstellen Sie den vollständigen Master Prompt — basierend auf dem Interview" },
  zh: { open: "▶ 在此处编写您的项目",                   close: "▼ 在此处编写您的项目",                   active: "✓ 自定义项目已激活 · 点击编辑",                                placeholder: "示例:我想构建一个带 PIR 传感器、蜂鸣器和 OLED 显示屏的运动警报系统,全部在 NanoKit Integrated ESP32 上运行 ...",                                              generate: "🪄 生成 16 步骤",              refine: "🎯 AI 项目访谈",                     reset: "✕ 重置",   voiceTip: "点击口述 — 语音输入",                                       sendTip: "发送给 AI Bashir 进行项目访谈",                                     platformLabel: "项目类型:",               wordCount: "字",   masterPrompt: "🪄 生成 Master Prompt",      interviewReady: "✅ AI Bashir 已准备好生成 Master Prompt",              masterPromptTip: "基于访谈聊天生成完整的 Master Prompt" },
  ja: { open: "▶ ここにプロジェクトを書いてください",         close: "▼ ここにプロジェクトを書いてください",          active: "✓ カスタム プロジェクト有効 · クリックして編集",                  placeholder: "例: PIR センサー、ブザー、OLED ディスプレイを備えたモーション アラームを構築したい。すべて NanoKit Integrated ESP32 で動作します ...",                          generate: "🪄 16 ステップを生成",          refine: "🎯 AI プロジェクト インタビュー",       reset: "✕ リセット",voiceTip: "クリックして口述 — 音声入力",                               sendTip: "プロジェクト インタビューのために AI Bashir に送信",                  platformLabel: "プロジェクト タイプ:",       wordCount: "語",   masterPrompt: "🪄 Master Prompt を生成",   interviewReady: "✅ AI Bashir は Master Prompt を生成する準備ができました", masterPromptTip: "インタビュー チャットから完全な Master Prompt を生成" },
};

/* ═══ AI PROVIDER PLUGIN REGISTRY ═══
   Multi-provider architecture per the AI Voice Development System spec v1.0.
   Each provider declares its identity, endpoint, default model, and capability flags.
   The AI Bashir Engine selects which provider handles each request — providers are
   interchangeable behind a single contract (see /docs/Pro_AmineUMT_AI_Voice_System_Architecture_v1.md §5).

   To add a new provider:
     1. Append a new entry below
     2. Implement the provider plugin in providers/<id>Provider.ts
     3. (Optional) translate displayName in PROVIDER_LABELS
   No changes to L4 (Engine) or L5 (Assistant UI) are needed. */
const AI_PROVIDERS = {
  claude:   { id:"claude",   icon:"✱", displayName:"Anthropic Claude",   defaultModel:"claude-sonnet-4-6",    endpoint:"https://api.anthropic.com/v1/messages",                            maxTokens:1000, supportsStreaming:true,  notes:"Best for long-context engineering reasoning",
              models:[
                { id:"claude-opus-4",       label:"Claude Opus 4 (most capable)" },
                { id:"claude-sonnet-4-6",   label:"Claude Sonnet 4.6 (recommended)" },
                { id:"claude-haiku-4-5",    label:"Claude Haiku 4.5 (fastest)" },
                { id:"claude-3-5-sonnet",   label:"Claude 3.5 Sonnet (legacy)" },
              ] },
  openai:   { id:"openai",   icon:"◯", displayName:"OpenAI ChatGPT",       defaultModel:"gpt-4-turbo",          endpoint:"https://api.openai.com/v1/chat/completions",                       maxTokens:1000, supportsStreaming:true,  notes:"Strong on code generation",
              models:[
                { id:"gpt-4-turbo",         label:"GPT-4 Turbo (recommended)" },
                { id:"gpt-4o",              label:"GPT-4o (multimodal)" },
                { id:"gpt-4o-mini",         label:"GPT-4o mini (cost-efficient)" },
                { id:"o1-preview",          label:"o1-preview (deep reasoning)" },
              ] },
  gemini:   { id:"gemini",   icon:"◇", displayName:"Google Gemini",        defaultModel:"gemini-1.5-pro",       endpoint:"https://generativelanguage.googleapis.com/v1/models",              maxTokens:1000, supportsStreaming:true,  notes:"Strong multimodal context",
              models:[
                { id:"gemini-1.5-pro",      label:"Gemini 1.5 Pro (recommended)" },
                { id:"gemini-1.5-flash",    label:"Gemini 1.5 Flash (fast + cheap)" },
                { id:"gemini-2.0-flash",    label:"Gemini 2.0 Flash (experimental)" },
              ] },
  deepseek: { id:"deepseek", icon:"▶", displayName:"DeepSeek",             defaultModel:"deepseek-chat",        endpoint:"https://api.deepseek.com/v1/chat/completions",                     maxTokens:1000, supportsStreaming:true,  notes:"Cost-efficient",
              models:[
                { id:"deepseek-chat",       label:"DeepSeek Chat (recommended)" },
                { id:"deepseek-coder",      label:"DeepSeek Coder (code-focused)" },
                { id:"deepseek-reasoner",   label:"DeepSeek R1 Reasoner" },
              ] },
  kimi:     { id:"kimi",     icon:"⚙", displayName:"Moonshot Kimi",        defaultModel:"moonshot-v1-32k",      endpoint:"https://api.moonshot.cn/v1/chat/completions",                      maxTokens:1000, supportsStreaming:true,  notes:"Strong Chinese language",
              models:[
                { id:"moonshot-v1-8k",      label:"Kimi Moonshot v1 8k" },
                { id:"moonshot-v1-32k",     label:"Kimi Moonshot v1 32k (recommended)" },
                { id:"moonshot-v1-128k",    label:"Kimi Moonshot v1 128k (long-context)" },
              ] },
};

/* ═══ TARGET PLATFORMS (Embedded / Mobile / HMI) ═══
   The custom-project generator can produce three kinds of deliverables.
   Each platform changes the system prompt sent to Claude API so the 16 steps
   describe the right toolchain + workflow. NanoKit Integrated ESP32 is the
   FIXED hardware target in all three — only the host-side stack changes. */
const PLATFORM_CONFIGS = {
  embedded: {
    id: "embedded",
    icon: "🔌",
    en: "Embedded firmware",        ar: "برمجيات مدمجة",     ru: "Прошивка",          hi: "एम्बेडेड फ़र्मवेयर", es: "Firmware embebido",      de: "Embedded Firmware",        zh: "嵌入式固件",  ja: "組み込みファームウェア",
    desc_en: "Pure .umt firmware on NanoKit Integrated ESP32 (default)",
    desc_ar: "برمجية .umt مباشرة على NanoKit Integrated ESP32 (الافتراضي)",
  },
  mobile: {
    id: "mobile",
    icon: "📱",
    en: "Mobile app (Flutter)",     ar: "تطبيق جوّال (Flutter)", ru: "Моб. (Flutter)",    hi: "मोबाइल (Flutter)",  es: "Móvil (Flutter)",        de: "Mobile (Flutter)",          zh: "移动 (Flutter)", ja: "モバイル (Flutter)",
    desc_en: "Flutter app (iOS + Android) controlling NanoKit ESP32 over BLE / WiFi / MQTT",
    desc_ar: "تطبيق Flutter (iOS + Android) يتحكم في NanoKit ESP32 عبر BLE / WiFi / MQTT",
  },
  hmi: {
    id: "hmi",
    icon: "🖥",
    en: "Industrial HMI (C# / VS)", ar: "HMI صناعي (C# / VS)", ru: "Пром. HMI (C# / VS)", hi: "औद्योगिक HMI (C# / VS)", es: "HMI industrial (C# / VS)", de: "Industrie-HMI (C# / VS)",   zh: "工业 HMI (C# / VS)", ja: "産業 HMI (C# / VS)",
    desc_en: "C# WinForms/WPF HMI in Visual Studio bound to NanoKit ESP32 via Serial / Modbus / MQTT",
    desc_ar: "تطبيق C# WinForms/WPF HMI في Visual Studio مرتبط بـ NanoKit ESP32 عبر Serial / Modbus / MQTT",
  },
};

/* Step descriptions translated. Technical terms stay in English (VR_*, UMT, AIA, GPIO, ESP32, etc.) */
const STEP_I18N = {
  en: null, // null = use original DEMO[i].text
  ar: [
    "المطور (صوت/دردشة): \"أريد بناء مشروع كامل — تحكُّم في سرعة محرّك DC. المحرّك يعمل على 12V بتيار 1A. سأستخدم مقاومة متغيِّرة (potentiometer) للتحكُّم في السرعة، وحسّاس تشفير (encoder) لحساب عدد دورات المحرّك، وشاشة LCD مقاس 16×2 عبر I2C لعرض RPM المحرك ونسبة السرعة في الوقت الفعلي. اللوحة المستهدفة: NanoKit Integrated ESP32.\"\n\nالتدفق: المستخدم ↔ AI Bashir → UMT SDK (للسياق).\n\nملاحظة: المستخدم ↔ AI Bashir مرتبطان دائماً عند استخدام الذكاء الاصطناعي.\n\nAI Bashir يستعلم من Pro_AmineUMT UMT SDK / Framework ليعرف:\n  • اللوحات/الأهداف المتاحة\n  • فضاء VR للخمسة peripherals المطلوبة:\n      VR_ADC, VR_PWM_OUT0, VR_I2C0, VR_GPIO00→VR_INT0, VR_UART0\n  • قدرات NanoKit ESP32 لهذا المشروع متعدِّد الـ peripherals\n    (ADC1 12-bit, LEDC PWM, Wire I2C, attachInterrupt, Serial)\n\nAI Bashir هو الواجهة الحوارية (Claude/DeepSeek/ChatGPT/Gemini قابلة للاختيار).",
    "AI Bashir يستعلم من Pro_AmineUMT UMT SDK / Framework — الـ SDK هو المرجع الموثوق.\n\nالـ SDK يعرض كل الخيارات للمطور في وقت واحد:\n  → Target A — لوحات التطوير (NanoKit ESP32, Arduino, STM32, Pico, Jetson)\n  → Target B — UMT IC (أي MCU أو SoC على BGA 16×16)\n  → Target C — NanoKit-iM (وحدة MCU أو SoC قابلة للاختيار)\n  → UMT Simulator — تشغيل افتراضي (لأي من الأهداف الثلاثة)\n\nAI Bashir يرد على المطور:\n  \"أي لوحة، أي UMT IC، أو أي NanoKit-iM-SoC تريد استهدافه؟\n   أم تفضل الاختبار في المحاكي أولاً؟\"\n\nملاحظة: AI Bashir ↔ المطور (مرتبطان دائماً عند استخدام AI).\nAI Bashir لا يخترع أهدافاً — يعرض ما يوفّره UMT SDK.\nالـ SDK هو الأساس — Pro_AmineUMT IDE with AI مبني فوقه.",
    "المطور يختار: NanoKit Integrated ESP32 (Target A).\n\nالتدفق: المستخدم → AI Bashir → UMT SDK → Target A.\n\n  ① المطور يخبر AI Bashir باختياره (User ↔ AI Bashir دائماً مرتبطان)\n  ② AI Bashir يُخطر UMT SDK بالاختيار\n  ③ UMT SDK يقفل الهدف ويُحمّل ملف اللوحة\n     (nanokit-esp32.json: VR mappings, BGA addresses, MCU capabilities)\n  ④ UMT SDK يُضيء Pick Target A — NanoKit Integrated ESP32\n\nالاختيار مقفل لجلسة البناء هذه.\nUMT SDK يعرف الآن: target=A, board=nanokit-esp32, MCU=ESP32-D0WD.",
    "AI Bashir يُولّد كود مُتحكِّم سرعة المحرّك DC في الـ Code Editor مع typing animation واقعية:\nحرف → حرف → كلمة → كلمة → سطر → سطر.\n\n⚠ أربع اتصالات متزامنة نشطة:\n  ① User ↔ AI Bashir (مرتبطان دائماً عند استخدام AI)\n  ② AI Bashir → Editor (يكتب الكود)\n  ③ AI Bashir → UMT SDK (يستعلم عن أسماء VR الصحيحة للهدف المقفل)\n  ④ Editor → UMT SDK (تزامن مباشر — كل ضغطة مفتاح تُتحقّق)\n\nلماذا يجب أن يعرف SDK ما يكتبه AI Bashir:\n  • التحقق من وجود أسماء VR في ملف اللوحة (nanokit-esp32.json)\n  • توفير autocomplete مباشر لـ VR_ADC_IN0, VR_PWM_OUT0, VR_I2C_SDA0, etc.\n  • بناء سياق AIA مبكراً (قبل الـ compile النهائي)\n  • اكتشاف الأخطاء الإملائية/التضارب في الوقت الفعلي (Rule Engine pre-check)\n\nالكود النهائي يستخدم خمسة VR interfaces متزامنة (من فضاء VR في UMT SDK):\n  • VR_ADC مُفعَّل      → VR_ADC_IN0 يقرأ المقاومة المتغيِّرة (0..4095, 12-bit)\n  • VR_PWM_OUT0 مُفعَّل → التحكُّم في سرعة المحرّك عبر مُشغِّل L298N\n  • VR_I2C0 مُفعَّل     → شاشة LCD 16×2 عبر Wire bus (SDA0 + SCL0, addr 0x27)\n  • VR_GPIO00 → VR_INT0 → عدّاد نبضات الـ encoder (RISING-edge ISR)\n  • VR_UART0 مُفعَّل    → Serial monitor للتنقيح",
    "الكود الكامل ظاهر الآن في الـ editor.\n\nتظهر رسالة تحته:\n  \"إذا أردت إضافة شيء، يمكنك ذلك.\"\n  \"أو يمكن للمطور أن يكتب شيئاً مباشرة.\"\n\nالمطور يمكنه:\n  • قبول الكود كما هو\n  • تعديل أي سطر\n  • إضافة كود خاص به (User → Editor مباشر)",
    "الكود النهائي .umt يُرسل إلى UMT SDK / AIA Engine.\n\nAI Bashir + UMT SDK يعملان معاً (في كل خطوة مهمة):\n  • UMT SDK يُشغّل AIA Engine deterministic pipeline\n  • AI Bashir يسرد التقدم للمطور (\"الآن يحل تخصيصات VR...\")\n\nAIA Engine يُنفّذ:\n  • Parse VR intent (Digital أم Interface mode؟)\n  • Full MCU pin scan على ESP32-D0WD\n  • Symbolic token matching (VR_UART_TX2 → {UART|TX|2} → GPIO17)\n  • Functional cloning (ربط GPIO → VR)",
    "Rule Engine يعمل قبل أي AI inference (deterministic, قواعد صارمة):\n  ✓ GPIO6–11 (VR_GPIO04-09 = ESP32 flash) غير مُستخدم → PASS\n  ✓ لا OUTPUT على GPIO34/35/36/39 → PASS\n  ✓ GPIO0 (VR_BOOT 0x38) ليس مدفوعاً LOW → PASS\n  ✓ لا تضاربات في الـ peripherals (UART2 ↔ I2C0 ↔ DAC1) → PASS\n  ✓ كل الفحوصات GREEN → تابع إلى UMT-IR\n\nAI Bashir يُبلّغ حالة كل فحص للمطور في الوقت الفعلي.",
    "Framework يُولّد UMT Intermediate Representation لمُتحكِّم المحرّك:\n  UMT.Interface(VR_UART0).activate() → ActivateInterface(UART0)\n  UMT.Interface(VR_ADC).activate() → ActivateInterface(ADC)\n  UMT.Interface_Pin(VR_ADC_IN0).read() → ReadAnalog(VR_ADC_IN0)\n  UMT.Interface(VR_PWM_OUT0).activate() → ActivateInterface(PWM_OUT0)\n  UMT.Interface_Pin(VR_PWM_OUT0).write(duty) → WritePWM(VR_PWM_OUT0, duty)\n  UMT.Interface(VR_I2C0).activate() → ActivateInterface(I2C0)\n  UMT.Interface(VR_GPIO00).bindTo(VR_INT0).activate() → BindAndActivate(VR_GPIO00, VR_INT0)\n  UMT.Interface_Pin(VR_INT0).attach(h, RISING) → AttachInterrupt(VR_INT0, h, RISING)\n  UMT.LCD.init(0x27) → I2C_LCD_Init(VR_I2C0, 0x27)\n  UMT.LCD.print(str) → I2C_LCD_Print(VR_I2C0, str)\n\nUMT-IR هو محور النظام — تغييرات الـ backend لا تؤثر أبداً على كود المطور.\nAI Bashir يشرح طبقة التجريد للمطور.",
    "UMT SDK / Framework يستدعي AIA Engine لكتابة كود C++ الخاص بالـ backend حرفاً حرفاً — Arduino-ESP32 Core.\n\nAIA = Abstraction Intelligence Algorithm Engine\n\n⚠ مخفي عن المطور — هذا ما لا يراه المطور أبداً!\n\nتخصيصات VR محلولة إلى GPIO فيزيائي (هذا الـ build — ESP32):\n  • VR_ADC_IN0 → GPIO36 (ADC1_CH0, دقة 12-bit)\n  • VR_PWM_OUT0 → GPIO2 (LEDC channel 0, 5 kHz, duty 8-bit)\n  • VR_I2C_SDA0 → GPIO21 (Wire SDA)\n  • VR_I2C_SCL0 → GPIO22 (Wire SCL)\n  • VR_GPIO00 → GPIO4 (INPUT_PULLUP + attachInterrupt RISING, IRAM ISR)\n  • VR_UART0 → GPIO1 TX / GPIO3 RX (Serial @ 115200)\n\n  Platform: Espressif ESP32\n  SDK: Arduino-ESP32 Core\n  Backend: حصان تنفيذ خفي — المطور لا يلمسه أبداً\n\nAI Bashir يعمل بجانب SDK طوال عملية الـ codegen.",
    "UMT Platform يستعلم من Frameworks & SDKs و Platforms:\n  → Arduino-ESP32 Core مختار (ledcWrite, Serial, Wire libraries)\n  → Espressif ESP32 Platform مختار (xtensa-esp32-elf-gcc toolchain)\n\nArduino هو حصان تنفيذ خفي — المطور لا يراه أبداً.\nالمطور يرى فقط UMT VR API.\n\nعندما يكون UMT Platform نشطاً، UMT SDK + AI Bashir يبقيان مرتبطَين\n(SDK ينظّم الـ toolchain، AI Bashir يسرد التقدم للمطور).",
    "Build Ecosystem يُنظّم الـ codegen + compile:\n  ① UMT Platform → build config + toolchain path\n  ② Frameworks & SDKs → Arduino-ESP32 compiled libraries\n  ③ Platforms → xtensa linker scripts + startup code\n\nCodegen يُنتج C++ خفي من UMT-IR.\nCompile يعمل في sandboxed child process:\n  xtensa-esp32-elf-gcc → firmware.bin + firmware.elf\n\nAI Bashir يُبلّغ تقدم الـ compile للمطور.\nUMT SDK + AI Bashir = مرتبطان دائماً في الخطوات المهمة.",
    "Build يُنتج ملفات الـ firmware:\n  • firmware.bin — binary خام لـ ESP32 flash\n  • firmware.elf — مع رموز debug (GDB/JTAG)\n  • firmware.hex / firmware.uf2 — صيغ بديلة لكل هدف\n\nهدف واحد لكل جلسة بناء (multiplicity = 1).\nجاهز إما للـ Simulator أو للـ Flash.\n\nAI Bashir يؤكّد نجاح بناء الـ firmware للمطور.",
    "جديد في v4: UMT Simulator يُشغّل الـ firmware في بيئة افتراضية قبل flash الجهاز الحقيقي.\n\nلجلسة البناء هذه (Target A مقفل = NanoKit Integrated ESP32):\n  ✨ UMT Simulator → يُفعّل وضع 'Sim Target A: Dev Boards (virtual)'\n  ✨ Pick Target A → يُضيء NanoKit Integrated ESP32 تحديداً\n\nالـ Simulator يغطّي كل أصناف الـ Targets الثلاثة:\n  → Target A: NanoKit ESP32 / Arduino / STM32 / Pico افتراضي\n  → Target B: UMT IC افتراضي (MCU or SoC die)\n  → Target C: NanoKit-iM افتراضي مع module selector\n\nالمطور يرى: GPIO toggles, serial output, timing — كله مُحاكى.\nإذا تم اكتشاف bugs هنا، تُصلَح قبل لمس الـ hardware.\nAI Bashir يسرد مخرجات الـ simulator للمطور.",
    "binary الـ firmware ينتقل: Firmware Output → Flashing/Debug → Target A.\n\n  → رفع UART (Serial) عبر كابل USB إلى لوحة NanoKit\n  → esptool يكتب .bin إلى ESP32 flash عند 0x10000\n  → اللوحة تُعيد التشغيل تلقائياً بعد اكتمال الـ flash\n\nFlashing/Debug يتصل مباشرة بالـ hardware.\nAI Bashir يؤكّد نجاح الـ flash للمطور.",
    "ESP32 يُقلع ويُنفّذ الـ firmware. مخرج Serial ينتقل:\n  NanoKit ESP32 (Target A) → UART عند 115200 baud → Monitor\n  Flashing/Debug → debug logs → Monitor\n\n✨ Pick Target A → يُضيء NanoKit Integrated ESP32 (اللوحة الجارية).\n\nMonitor يعرض:\n  • Serial console (مخرج نصي)\n  • Serial plotter (رسوم بيانية حية)\n  • Log viewer مع تصفية\n  • Optional custom dashboard widgets\n\nAI Bashir ينبّه المطور عند حدوث logs مهمة.",
    "الخطوة النهائية — UMT SDK يستدعي Command Genius (يقرأ main.umt من الـ Editor عبر SDK).\n\nAI Bashir يقول للمطور:\n  💬 \"اذهب إلى Command — A Genius Guides You للحصول على دليل خطوة بخطوة\n      لمشروع مُتحكِّم سرعة المحرّك DC: مخطط الأسلاك، الخوارزمية،\n      flowchart، pseudocode، و System Architecture & Dependency Map\n      — كله بصيغة UMT VR. استخدم زر التبديل [📦 MODULE ↔ ⚙ PRO] في\n      أعلى يمين اللوحة لاختيار طريقة توصيل العتاد.\"\n\nالمطور يرد:\n  💬 \"أنا أتابع الخطوات. سأتواصل معك إذا احتجتك.\"\n\nلوحة Command Genius تُفتح (مثل cmd / output في VSCode &amp; Antigravity).\nتقرأ كود main.umt الخاص بالمطور (UMT VR syntax — ليس Arduino/Espressif!) وتشرح خمسة أقسام.\n\n★ جديد في v4.8 — وضع التوصيل المزدوج: زر تبديل في أعلى يمين اللوحة\n   يتيح للمطور الاختيار بين نمطين للعتاد. كود .umt متطابق تماماً\n   حرفاً بحرف في كلا الوضعين — فقط التوصيلات الفيزيائية بعد VR_PWM_OUT0\n   هي التي تتغيّر:\n\n  📦 MODULE MODE (تطبيق سريع — الافتراضي):\n     يستخدم لوحات Peripheral Modules الجاهزة المركّبة مباشرة على\n     NanoKit Integrated ESP32 — أقل لحام، مثالي للمبتدئين وللـ\n     prototyping السريع وللتعليم.\n     هذا المشروع يستخدم L298N Driver Board Module لمحرّك 12V/1A.\n     منظومة وحدات Peripheral كاملة مُصنَّفة حسب الوظيفة:\n        • Sensor Modules (وحدات الحساسات: حرارة، رطوبة، حركة، غاز، ضوء)\n        • Communication Modules (وحدات الاتصال: Wi-Fi، Bluetooth، LoRa،\n          NRF24L01، RF، GSM)\n        • Motor Driver Modules (وحدات قيادة المحركات: L298N، TB6612، DRV8825)\n        • Relay Modules (وحدات الريليه: 1ch، 2ch، 4ch، 8ch — مع عزل ضوئي)\n        • Display Modules (وحدات العرض: OLED، LCD 16×2، TFT، e-Paper)\n        • Power Modules (وحدات التغذية: buck/boost converters، LDO)\n        • Audio Modules (وحدات الصوت: MAX98357، DFPlayer، I2S DAC)\n        • Storage Modules (وحدات التخزين: SD Card breakout)\n        • Interface Modules (وحدات الواجهة: RS485، CAN Bus، USB-UART)\n        • Positioning Modules (وحدات تحديد الموقع: GPS، RTC)\n        • Identification Modules (وحدات التعرّف: RFID RC522، NFC)\n\n  ⚙ PRO MODE (إنتاج / تصميم PCB):\n     يستخدم مكوّنات إلكترونية فردية موضوعة على PCB حقيقي بمخطط Schematic،\n     تماماً كما يُصمِّم مهندس power electronics للإنتاج.\n     لهذا المشروع، يُستبدَل L298N module بسلسلة مكوّنات منفصلة:\n        • PC817 optocoupler (SOP-4 SMD) — عزل galvanic بين 3V3 و 12V\n        • IRLZ44N MOSFET قناة N منطقي (TO-220 THT — قابل للمشتت الحراري)\n        • SS34 Schottky flyback diode (SMC SMD) — تثبيت back-EMF\n        • شبكة gate: R3 10Ω على التوالي + R4 10kΩ pull-down (SMD)\n        • مقاومة LED للـ Optocoupler R1 220Ω + collector R2 4.7kΩ (SMD)\n        • Decoupling: C1 470µF/25V THT bulk + C2/C3/C4 100nF–10µF SMD\n        • مرشّح ذراع المقاومة C5 100nF SMD + pull-up للـ encoder R5 10kΩ SMD\n     الحزمة الافتراضية: SMD (0805/1206/SOP/SMC) للحصول على PCB مضغوط.\n     استثناء: THT (TO-220، electrolytics radial) للمكوّنات التي تتعامل\n     مع جهد عالٍ، تيار عالٍ، أو تبديد حراري كبير (MOSFET، مكثف bulk،\n     relay، طرفيات screw).\n     قائمة Bill of Materials كاملة في القسم 1 من دليل Pro Mode.\n\nالمطور يمكنه التبديل بين الوضعين بحرية — كود .umt، الـ C++ المُولَّد بواسطة\nAIA Engine، وكل الأقسام البرمجية الأربعة (Algorithm، Flowchart، Pseudocode،\nArchitecture Diagram) تبقى متطابقة تماماً. هذه قوة Pure VR Source:\nاختر مسار العتاد، والبرنامج واحد.\n\nالأقسام الخمسة التي يعرضها Command Genius:\n\n  1️⃣ HARDWARE WIRING — كيفية التوصيل على NanoKit Integrated ESP32:\n     • MODULE mode: لوحة L298N + وحدات LCD/encoder جاهزة\n     • PRO mode: optocoupler + MOSFET + flyback + مكثفات + مقاومات منفصلة\n\n  2️⃣ ALGORITHM (خطوات منطقية بأسماء VR — ليس GPIOs!)\n  3️⃣ FLOWCHART (شجرة قرارات بصرية باستخدام VR interfaces)\n  4️⃣ PSEUDOCODE (إنجليزية مبسّطة مع صيغة UMT VR)\n  5️⃣ ALGORITHM & SYSTEM ARCHITECTURE DIAGRAM & DEPENDENCY MAP\n     (تمثيل بصري على نمط Node-RED blocks يُظهر كل الـ 5 interfaces،\n      الدوال، المدخلات، المخرجات، توصيلات المكوّنات، والتبعيّات\n      — مع latency budget لحلقة التحكم الفورية والـ ISR)\n\nنص مكتوب حرفاً حرفاً مع typing animation واقعية.\nعندما يُبدّل المطور زر MODULE ↔ PRO، اللوحة تُعيد كتابة التوصيلات\nالجديدة فوراً — نفس البرنامج، عرض عتاد مختلف.\n\nكل شيء بلغة UMT VR — لا Arduino، لا أرقام GPIO من Espressif.\n\nالتدفق: User ↔ AI Bashir ↔ UMT SDK → Command Genius → المطور يكمل وحده\n\n✅ Pipeline كامل مؤكد: User ↔ AI Bashir ↔ Editor ↔ UMT SDK (BASE) →\n   AIA Codegen → Build → Sim/Flash → Monitor → Genius Guide (MODULE | PRO)",
  ],
  ru: [
    "Разработчик (голос/чат): «Я хочу построить проект. Пример blink-and-sense.»\n\nПоток: User ↔ AI Bashir → UMT SDK (для контекста).\n\nПримечание: User ↔ AI Bashir ВСЕГДА связаны, когда AI используется.\n\nAI Bashir запрашивает Pro_AmineUMT UMT SDK / Framework, чтобы узнать:\n  • Доступные платы / Targets\n  • VR namespace (VR_DAC1, VR_UART_TX2, ...)\n  • Возможности текущего чипа\n\nAI Bashir — это диалоговый front-end (Claude/DeepSeek/ChatGPT/Gemini выбираемые).",
    "AI Bashir запрашивает Pro_AmineUMT UMT SDK / Framework — SDK является АВТОРИТЕТНЫМ источником.\n\nSDK одновременно представляет разработчику ВСЕ варианты:\n  → Target A — Платы разработки (NanoKit ESP32, Arduino, STM32, Pico, Jetson)\n  → Target B — UMT IC (любой MCU или SoC die на BGA 16×16)\n  → Target C — NanoKit-iM (выбираемый модуль MCU или SoC)\n  → UMT Simulator — опция виртуального запуска\n\nAI Bashir отвечает разработчику:\n  «Какую плату, UMT IC, или NanoKit-iM-SoC вы хотите использовать?\n   Или вы предпочитаете сначала проверить в симуляторе?»\n\nПримечание: AI Bashir НЕ изобретает targets — он перечисляет то, что предоставляет UMT SDK.\nSDK — это БАЗА всего.",
    "Разработчик выбирает: NanoKit Integrated ESP32 (Target A).\n\nПоток: User → AI Bashir → UMT SDK → Target A.\n\n  ① Разработчик сообщает AI Bashir свой выбор\n  ② AI Bashir уведомляет UMT SDK о выборе\n  ③ UMT SDK блокирует target и загружает профиль платы\n     (nanokit-esp32.json: VR mappings, BGA адреса, возможности MCU)\n  ④ UMT SDK подсвечивает Pick Target A — NanoKit Integrated ESP32\n\nВыбор заблокирован для этой сессии сборки.\nUMT SDK теперь знает: target=A, board=nanokit-esp32, MCU=ESP32-D0WD.",
    "AI Bashir генерирует код в Code Editor с реалистичной анимацией набора:\nсимвол → символ → слово → слово → строка → строка.\n\n⚠ ЧЕТЫРЕ одновременных активных соединения:\n  ① User ↔ AI Bashir (всегда связаны при использовании AI)\n  ② AI Bashir → Editor (пишет код)\n  ③ AI Bashir → UMT SDK (запрашивает правильные VR имена для заблокированного target)\n  ④ Editor → UMT SDK (живая синхронизация — каждое нажатие проверяется)\n\nПочему SDK должен знать, что AI Bashir пишет:\n  • Проверка существования VR имён в файле платы (nanokit-esp32.json)\n  • Живое автодополнение для VR_DAC1, VR_UART_TX2 и т.д.\n  • Раннее построение AIA контекста (до финальной компиляции)\n  • Обнаружение опечаток/конфликтов в реальном времени (Rule Engine pre-check)\n\nФинальный код использует Pin Dual Roles:\n  • VR_DAC1 deactivated → Digital OUTPUT (LED)\n  • VR_I2C_SDA0 deactivated → Digital INPUT_PULLUP (sensor)\n  • VR_UART2 activated → Interface Pin TX (logging)",
    "Полный код теперь виден в editor.\n\nПод ним появляется сообщение:\n  «Если хотите что-то добавить, можете.»\n  «Или разработчик может написать что-то напрямую.»\n\nРазработчик может:\n  • Принять как есть\n  • Редактировать любую строку\n  • Добавить свой код (User → Editor напрямую)",
    "Финальный код .umt отправляется в UMT SDK / AIA Engine.\n\nAI Bashir + UMT SDK работают ВМЕСТЕ (на каждом важном шаге):\n  • UMT SDK запускает детерминистский pipeline AIA Engine\n  • AI Bashir сообщает прогресс разработчику («Сейчас разрешаются назначения VR...»)\n\nAIA Engine выполняет:\n  • Parse VR intent (Digital или Interface mode?)\n  • Full MCU pin scan на ESP32-D0WD\n  • Symbolic token matching (VR_UART_TX2 → {UART|TX|2} → GPIO17)\n  • Functional cloning (привязка GPIO → VR)",
    "Rule Engine работает ДО любого AI inference (детерминистский, строгие правила):\n  ✓ GPIO6–11 (VR_GPIO04-09 = ESP32 flash) не используется → PASS\n  ✓ Нет OUTPUT на GPIO34/35/36/39 → PASS\n  ✓ GPIO0 (VR_BOOT 0x38) не принудительно LOW → PASS\n  ✓ Нет конфликтов peripherals (UART2 ↔ I2C0 ↔ DAC1) → PASS\n  ✓ Все проверки GREEN → переход к UMT-IR\n\nAI Bashir сообщает разработчику статус каждой проверки в реальном времени.",
    "Framework генерирует UMT Intermediate Representation:\n  UMT.Interface(VR_DAC1).deactivate() → DeactivateInterface(DAC1)\n  UMT.Digital_Pin(VR_DAC1).setMode(OUTPUT) → SetPinMode(VR_DAC1, OUTPUT)\n  UMT.Interface(VR_UART2).activate() → ActivateInterface(UART2)\n  UMT.Interface_Pin(VR_UART_TX2).write(\"...\") → UARTWrite(UART2, str)\n\nUMT-IR — это ось системы — изменения backend никогда не влияют на код разработчика.\nAI Bashir объясняет слой абстракции разработчику.",
    "UMT SDK / Framework вызывает AIA Engine для написания BACKEND C++ кода символ за символом — Arduino-ESP32 Core.\n\nAIA = Abstraction Intelligence Algorithm Engine\n\n⚠ СКРЫТО от разработчика — это то, что разработчик НИКОГДА не видит!\n\nVR mappings разрешены в физические GPIO:\n  • VR_DAC1 → GPIO25 (deactivated → digitalWrite)\n  • VR_I2C_SDA0 → GPIO21 (digital INPUT_PULLUP, I2C off)\n  • VR_UART_TX2 → GPIO17 (Serial2 active)\n\n  Platform: Espressif ESP32\n  SDK: Arduino-ESP32 Core\n  Backend: скрытая пешка выполнения — разработчик к ней никогда не прикасается\n\nAI Bashir работает рядом с SDK на протяжении всего процесса codegen.",
    "UMT Platform запрашивает Frameworks & SDKs и Platforms:\n  → Arduino-ESP32 Core выбран (ledcWrite, Serial, Wire libraries)\n  → Espressif ESP32 Platform выбран (xtensa-esp32-elf-gcc toolchain)\n\nArduino — это скрытая пешка выполнения — разработчик её никогда не видит.\nРазработчик видит только UMT VR API.\n\nКогда UMT Platform активен, UMT SDK + AI Bashir остаются связанными\n(SDK организует toolchain, AI Bashir сообщает прогресс разработчику).",
    "Build Ecosystem организует codegen + compile:\n  ① UMT Platform → build config + путь toolchain\n  ② Frameworks & SDKs → скомпилированные библиотеки Arduino-ESP32\n  ③ Platforms → xtensa linker scripts + startup код\n\nCodegen производит скрытый C++ из UMT-IR.\nCompile работает в sandboxed child process:\n  xtensa-esp32-elf-gcc → firmware.bin + firmware.elf\n\nAI Bashir сообщает прогресс компиляции разработчику.\nUMT SDK + AI Bashir = всегда связаны на важных шагах.",
    "Build производит файлы firmware:\n  • firmware.bin — сырой binary для ESP32 flash\n  • firmware.elf — с debug символами (GDB/JTAG)\n  • firmware.hex / firmware.uf2 — альтернативные форматы\n\nОдин target на сессию сборки (multiplicity = 1).\nГотов либо для Simulator, либо для Flash.\n\nAI Bashir подтверждает успешную сборку firmware разработчику.",
    "НОВОЕ в v4: UMT Simulator запускает firmware виртуально ДО прошивки реального устройства.\n\nДля этой сборочной сессии (Target A заблокирован = NanoKit Integrated ESP32):\n  ✨ UMT Simulator → активирует режим 'Sim Target A: Dev Boards (virtual)'\n  ✨ Pick Target A → подсвечивает NanoKit Integrated ESP32 специально\n\nSimulator покрывает все три класса Targets:\n  → Target A: NanoKit ESP32 / Arduino / STM32 / Pico виртуальные\n  → Target B: UMT IC виртуальный (MCU or SoC die)\n  → Target C: NanoKit-iM виртуальный с module selector\n\nРазработчик видит: GPIO toggles, serial output, timing — всё симулировано.\nЕсли обнаружены баги здесь, исправляются до того, как трогать hardware.\nAI Bashir передаёт выводы simulator разработчику.",
    "Binary firmware течёт: Firmware Output → Flashing/Debug → Target A.\n\n  → загрузка UART (Serial) через USB кабель на плату NanoKit\n  → esptool записывает .bin в ESP32 flash по адресу 0x10000\n  → плата автоматически перезагружается после завершения прошивки\n\nFlashing/Debug подключается напрямую к hardware.\nAI Bashir подтверждает успешную прошивку разработчику.",
    "ESP32 загружается и выполняет firmware. Serial output течёт:\n  NanoKit ESP32 (Target A) → UART на 115200 baud → Monitor\n  Flashing/Debug → debug logs → Monitor\n\n✨ Pick Target A → подсвечивает NanoKit Integrated ESP32 (текущая плата).\n\nMonitor отображает:\n  • Serial console (текстовый вывод)\n  • Serial plotter (графики в реальном времени)\n  • Log viewer с фильтрацией\n  • Optional custom dashboard widgets\n\nAI Bashir предупреждает разработчика о важных logs.",
    "Финальный шаг — UMT SDK вызывает Command Genius (читает main.umt из Editor через SDK).\n\nAI Bashir говорит разработчику:\n  💬 «Перейдите к Command — A Genius Guides You для пошагового руководства\n      по вашему проекту: схема проводки, алгоритм, flowchart и pseudocode\n      — всё в синтаксисе UMT VR.»\n\nРазработчик отвечает:\n  💬 «Я следую шагам. Свяжусь, если понадобится.»\n\nПанель Command Genius открывается (как cmd / output в VSCode &amp; Antigravity).\nЧитает код main.umt разработчика (UMT VR syntax — НЕ Arduino/Espressif!) и объясняет:\n\n  1️⃣ HARDWARE WIRING — как подключить на NanoKit Integrated ESP32:\n     • VR_UART_RX0 → резистор 260Ω → LED → GND\n     • VR_I2C_SDA0 → кнопка + pull-up 10kΩ к 3V3 → GND\n     • VR_PWM_OUT0 → внешний экран/PC\n\n  2️⃣ ALGORITHM (логические шаги с именами VR — НЕ GPIOs!)\n  3️⃣ FLOWCHART (визуальное дерево решений с использованием VR interfaces)\n  4️⃣ PSEUDOCODE (упрощённый английский с UMT VR синтаксисом)\n\nТекст пишется символ за символом с реалистичной typing animation.\nВсё на языке UMT VR — нет Arduino, нет GPIO номеров от Espressif.\n\nПоток: User ↔ AI Bashir ↔ UMT SDK → Command Genius → разработчик заканчивает сам\n\n✅ Полный pipeline подтверждён: User ↔ AI Bashir ↔ Editor ↔ UMT SDK (BASE) →\n   AIA Codegen → Build → Sim/Flash → Monitor → Genius Guide",
  ],
  hi: [
    "डेवलपर (आवाज़/चैट): «मैं एक प्रोजेक्ट बनाना चाहता हूँ। एक blink-and-sense उदाहरण।»\n\nप्रवाह: User ↔ AI Bashir → UMT SDK (संदर्भ के लिए)।\n\nनोट: जब AI उपयोग में हो तो User ↔ AI Bashir हमेशा जुड़े रहते हैं।\n\nAI Bashir, Pro_AmineUMT UMT SDK / Framework से पूछता है ताकि जान सके:\n  • उपलब्ध बोर्ड / Targets\n  • VR namespace (VR_DAC1, VR_UART_TX2, ...)\n  • वर्तमान chip की क्षमताएँ\n\nAI Bashir संवाद-आधारित front-end है (Claude/DeepSeek/ChatGPT/Gemini चयन योग्य)।",
    "AI Bashir, Pro_AmineUMT UMT SDK / Framework से पूछताछ करता है — SDK ही आधिकारिक स्रोत है।\n\nSDK डेवलपर को एक साथ सभी विकल्प प्रस्तुत करता है:\n  → Target A — डेवलपमेंट बोर्ड्स (NanoKit ESP32, Arduino, STM32, Pico, Jetson)\n  → Target B — UMT IC (BGA 16×16 पर कोई भी MCU या SoC die)\n  → Target C — NanoKit-iM (चयन योग्य MCU या SoC मॉड्यूल)\n  → UMT Simulator — आभासी रन विकल्प\n\nAI Bashir डेवलपर को जवाब देता है:\n  «आप किस बोर्ड, UMT IC, या NanoKit-iM-SoC को लक्ष्य बनाना चाहते हैं?\n   या पहले simulator में परीक्षण करना चाहेंगे?»\n\nनोट: AI Bashir targets का आविष्कार नहीं करता — वह केवल वही सूचीबद्ध करता है जो UMT SDK प्रदान करता है।\nSDK ही सब कुछ का आधार है।",
    "डेवलपर चुनता है: NanoKit Integrated ESP32 (Target A)।\n\nप्रवाह: User → AI Bashir → UMT SDK → Target A।\n\n  ① डेवलपर AI Bashir को अपना चयन बताता है\n  ② AI Bashir, UMT SDK को चयन की सूचना देता है\n  ③ UMT SDK, target को लॉक करता है और बोर्ड प्रोफ़ाइल लोड करता है\n     (nanokit-esp32.json: VR mappings, BGA addresses, MCU क्षमताएँ)\n  ④ UMT SDK, Pick Target A — NanoKit Integrated ESP32 को हाइलाइट करता है\n\nयह चयन इस build सत्र के लिए लॉक है।\nUMT SDK अब जानता है: target=A, board=nanokit-esp32, MCU=ESP32-D0WD।",
    "AI Bashir, Code Editor में यथार्थवादी टाइपिंग एनिमेशन के साथ कोड उत्पन्न करता है:\nवर्ण → वर्ण → शब्द → शब्द → पंक्ति → पंक्ति।\n\n⚠ चार एक साथ सक्रिय कनेक्शन:\n  ① User ↔ AI Bashir (AI उपयोग में होने पर हमेशा जुड़े)\n  ② AI Bashir → Editor (कोड लिखता है)\n  ③ AI Bashir → UMT SDK (लॉक किए गए target के लिए सही VR नाम पूछता है)\n  ④ Editor → UMT SDK (लाइव सिंक — हर कीस्ट्रोक सत्यापित)\n\nSDK को क्यों जानना चाहिए कि AI Bashir क्या लिख रहा है:\n  • बोर्ड फ़ाइल (nanokit-esp32.json) में VR नामों के अस्तित्व की जाँच\n  • VR_DAC1, VR_UART_TX2 आदि के लिए लाइव autocomplete\n  • AIA संदर्भ का जल्दी निर्माण (अंतिम compile से पहले)\n  • वास्तविक समय में टाइपो/संघर्ष का पता लगाना (Rule Engine pre-check)\n\nअंतिम कोड Pin Dual Roles का उपयोग करता है:\n  • VR_DAC1 deactivated → Digital OUTPUT (LED)\n  • VR_I2C_SDA0 deactivated → Digital INPUT_PULLUP (sensor)\n  • VR_UART2 activated → Interface Pin TX (logging)",
    "पूरा कोड अब editor में दिखाई देता है।\n\nनीचे एक संदेश प्रकट होता है:\n  «यदि आप कुछ जोड़ना चाहते हैं, तो आप कर सकते हैं।»\n  «या डेवलपर सीधे कुछ लिख सकता है।»\n\nडेवलपर कर सकता है:\n  • जैसा है वैसा स्वीकार करना\n  • किसी भी पंक्ति को संपादित करना\n  • अपना कोड जोड़ना (User → Editor सीधे)",
    "अंतिम .umt कोड UMT SDK / AIA Engine को भेजा जाता है।\n\nAI Bashir + UMT SDK एक साथ काम करते हैं (हर महत्वपूर्ण चरण में):\n  • UMT SDK, AIA Engine deterministic pipeline चलाता है\n  • AI Bashir डेवलपर को प्रगति बताता है («अब VR assignments हल हो रहे हैं...»)\n\nAIA Engine निष्पादित करता है:\n  • Parse VR intent (Digital या Interface mode?)\n  • Full MCU pin scan ESP32-D0WD पर\n  • Symbolic token matching (VR_UART_TX2 → {UART|TX|2} → GPIO17)\n  • Functional cloning (GPIO → VR बाइंडिंग)",
    "Rule Engine किसी भी AI inference से पहले चलता है (deterministic, सख्त नियम):\n  ✓ GPIO6–11 (VR_GPIO04-09 = ESP32 flash) उपयोग नहीं किया गया → PASS\n  ✓ GPIO34/35/36/39 पर कोई OUTPUT नहीं → PASS\n  ✓ GPIO0 (VR_BOOT 0x38) को LOW पर बाध्य नहीं किया गया → PASS\n  ✓ peripherals में कोई संघर्ष नहीं (UART2 ↔ I2C0 ↔ DAC1) → PASS\n  ✓ सभी जाँचें GREEN → UMT-IR पर जारी रखें\n\nAI Bashir प्रत्येक जाँच की स्थिति डेवलपर को वास्तविक समय में रिपोर्ट करता है।",
    "Framework, UMT Intermediate Representation उत्पन्न करता है:\n  UMT.Interface(VR_DAC1).deactivate() → DeactivateInterface(DAC1)\n  UMT.Digital_Pin(VR_DAC1).setMode(OUTPUT) → SetPinMode(VR_DAC1, OUTPUT)\n  UMT.Interface(VR_UART2).activate() → ActivateInterface(UART2)\n  UMT.Interface_Pin(VR_UART_TX2).write(\"...\") → UARTWrite(UART2, str)\n\nUMT-IR सिस्टम का धुरी है — backend परिवर्तन कभी डेवलपर के कोड को प्रभावित नहीं करते।\nAI Bashir डेवलपर को abstraction layer समझाता है।",
    "UMT SDK / Framework, AIA Engine को आमंत्रित करता है ताकि BACKEND C++ कोड वर्ण-दर-वर्ण लिखे — Arduino-ESP32 Core।\n\nAIA = Abstraction Intelligence Algorithm Engine\n\n⚠ डेवलपर से छिपा हुआ — यह वह है जो डेवलपर कभी नहीं देखता!\n\nVR mappings भौतिक GPIO में हल किए गए:\n  • VR_DAC1 → GPIO25 (deactivated → digitalWrite)\n  • VR_I2C_SDA0 → GPIO21 (digital INPUT_PULLUP, I2C off)\n  • VR_UART_TX2 → GPIO17 (Serial2 active)\n\n  Platform: Espressif ESP32\n  SDK: Arduino-ESP32 Core\n  Backend: छिपा हुआ निष्पादन प्यादा — डेवलपर इसे कभी नहीं छूता\n\nAI Bashir पूरी codegen प्रक्रिया के दौरान SDK के साथ काम करता है।",
    "UMT Platform, Frameworks & SDKs और Platforms से पूछताछ करता है:\n  → Arduino-ESP32 Core चुना गया (ledcWrite, Serial, Wire libraries)\n  → Espressif ESP32 Platform चुना गया (xtensa-esp32-elf-gcc toolchain)\n\nArduino एक छिपा हुआ निष्पादन प्यादा है — डेवलपर इसे कभी नहीं देखता।\nडेवलपर केवल UMT VR API देखता है।\n\nजब UMT Platform सक्रिय हो, UMT SDK + AI Bashir जुड़े रहते हैं\n(SDK toolchain को व्यवस्थित करता है, AI Bashir डेवलपर को प्रगति बताता है)।",
    "Build Ecosystem, codegen + compile को व्यवस्थित करता है:\n  ① UMT Platform → build config + toolchain path\n  ② Frameworks & SDKs → संकलित Arduino-ESP32 libraries\n  ③ Platforms → xtensa linker scripts + startup code\n\nCodegen, UMT-IR से छिपा हुआ C++ उत्पन्न करता है।\nCompile sandboxed child process में चलता है:\n  xtensa-esp32-elf-gcc → firmware.bin + firmware.elf\n\nAI Bashir compile प्रगति डेवलपर को रिपोर्ट करता है।\nUMT SDK + AI Bashir = महत्वपूर्ण चरणों में हमेशा जुड़े।",
    "Build firmware फ़ाइलें उत्पन्न करता है:\n  • firmware.bin — ESP32 flash के लिए कच्चा binary\n  • firmware.elf — debug symbols (GDB/JTAG) के साथ\n  • firmware.hex / firmware.uf2 — वैकल्पिक प्रारूप\n\nप्रति build सत्र एक target (multiplicity = 1)।\nSimulator या Flash के लिए तैयार।\n\nAI Bashir डेवलपर को सफल firmware build की पुष्टि करता है।",
    "v4 में नया: UMT Simulator वास्तविक हार्डवेयर flash करने से पहले firmware को आभासी रूप से चलाता है।\n\nइस build सत्र के लिए (Target A लॉक = NanoKit Integrated ESP32):\n  ✨ UMT Simulator → 'Sim Target A: Dev Boards (virtual)' मोड सक्रिय करता है\n  ✨ Pick Target A → NanoKit Integrated ESP32 को विशेष रूप से हाइलाइट करता है\n\nSimulator तीनों Target वर्गों को कवर करता है:\n  → Target A: NanoKit ESP32 / Arduino / STM32 / Pico आभासी\n  → Target B: UMT IC आभासी (MCU या SoC die)\n  → Target C: NanoKit-iM आभासी module selector के साथ\n\nडेवलपर देखता है: GPIO toggles, serial output, timing — सब कुछ simulated।\nयदि यहाँ bugs मिले, तो हार्डवेयर छूने से पहले ठीक किए जाते हैं।\nAI Bashir simulator outputs डेवलपर को बताता है।",
    "Firmware binary बहती है: Firmware Output → Flashing/Debug → Target A।\n\n  → USB केबल के माध्यम से NanoKit बोर्ड पर UART (Serial) upload\n  → esptool, .bin को ESP32 flash में 0x10000 पर लिखता है\n  → flash पूरा होने के बाद बोर्ड स्वचालित रूप से रीसेट होता है\n\nFlashing/Debug सीधे हार्डवेयर से जुड़ता है।\nAI Bashir डेवलपर को सफल flash की पुष्टि करता है।",
    "ESP32 boot होता है और firmware निष्पादित करता है। Serial output बहता है:\n  NanoKit ESP32 (Target A) → UART 115200 baud पर → Monitor\n  Flashing/Debug → debug logs → Monitor\n\n✨ Pick Target A → NanoKit Integrated ESP32 को हाइलाइट करता है (वर्तमान बोर्ड)।\n\nMonitor दिखाता है:\n  • Serial console (टेक्स्ट आउटपुट)\n  • Serial plotter (वास्तविक समय ग्राफ़)\n  • Log viewer फ़िल्टरिंग के साथ\n  • वैकल्पिक custom dashboard widgets\n\nAI Bashir महत्वपूर्ण logs होने पर डेवलपर को सूचित करता है।",
    "अंतिम चरण — UMT SDK, Command Genius को आमंत्रित करता है (SDK के माध्यम से Editor से main.umt पढ़ता है)।\n\nAI Bashir डेवलपर से कहता है:\n  💬 «अपने प्रोजेक्ट के लिए चरण-दर-चरण मार्गदर्शिका के लिए Command — A Genius Guides You पर जाएँ:\n      wiring diagram, algorithm, flowchart, और pseudocode\n      — सब कुछ UMT VR syntax में।»\n\nडेवलपर जवाब देता है:\n  💬 «मैं चरणों का पालन कर रहा हूँ। यदि आवश्यकता हुई तो आपसे संपर्क करूँगा।»\n\nCommand Genius panel खुलता है (VSCode &amp; Antigravity में cmd / output की तरह)।\nडेवलपर का main.umt कोड पढ़ता है (UMT VR syntax — Arduino/Espressif नहीं!) और समझाता है:\n\n  1️⃣ HARDWARE WIRING — NanoKit Integrated ESP32 पर कैसे कनेक्ट करें:\n     • VR_UART_RX0 → 260Ω resistor → LED → GND\n     • VR_I2C_SDA0 → बटन + 10kΩ pull-up to 3V3 → GND\n     • VR_PWM_OUT0 → बाहरी स्क्रीन/PC\n\n  2️⃣ ALGORITHM (VR नामों के साथ तार्किक चरण — GPIOs नहीं!)\n  3️⃣ FLOWCHART (VR interfaces का उपयोग करके दृश्य निर्णय वृक्ष)\n  4️⃣ PSEUDOCODE (UMT VR syntax के साथ सरल अंग्रेज़ी)\n\nवास्तविक typing animation के साथ वर्ण-दर-वर्ण लिखा गया टेक्स्ट।\nसब कुछ UMT VR भाषा में — कोई Arduino नहीं, Espressif से कोई GPIO नंबर नहीं।\n\nप्रवाह: User ↔ AI Bashir ↔ UMT SDK → Command Genius → डेवलपर अकेले पूरा करता है\n\n✅ पूर्ण pipeline पुष्ट: User ↔ AI Bashir ↔ Editor ↔ UMT SDK (BASE) →\n   AIA Codegen → Build → Sim/Flash → Monitor → Genius Guide",
  ],
  es: [
    "Desarrollador (voz/chat): «Quiero construir un proyecto. Un ejemplo blink-and-sense.»\n\nFlujo: User ↔ AI Bashir → UMT SDK (para contexto).\n\nAviso: User ↔ AI Bashir SIEMPRE conectado cuando AI está en uso.\n\nAI Bashir consulta Pro_AmineUMT UMT SDK / Framework para saber:\n  • Placas / Targets disponibles\n  • Namespace VR (VR_DAC1, VR_UART_TX2, ...)\n  • Capacidades del chip actual",
    "AI Bashir consulta Pro_AmineUMT UMT SDK / Framework — el SDK es la fuente AUTORITATIVA.\n\nEl SDK presenta simultáneamente TODAS las opciones:\n  → Target A — Placas de desarrollo (NanoKit ESP32, Arduino, STM32, Pico, Jetson)\n  → Target B — UMT IC (cualquier die MCU o SoC en BGA 16×16)\n  → Target C — NanoKit-iM (módulo MCU o SoC seleccionable)\n  → UMT Simulator — opción de ejecución virtual\n\nAI Bashir NO inventa targets — lista lo que UMT SDK provee.",
    "Desarrollador selecciona: NanoKit Integrated ESP32 (Target A).\n\nFlujo: User → AI Bashir → UMT SDK → Target A.\n\n  ① Desarrollador comunica su elección a AI Bashir\n  ② AI Bashir notifica a UMT SDK\n  ③ UMT SDK bloquea el target y carga el perfil de placa\n  ④ UMT SDK enciende Pick Target A — NanoKit Integrated ESP32\n\nUMT SDK ahora sabe: target=A, board=nanokit-esp32, MCU=ESP32-D0WD.",
    "AI Bashir genera el código en Code Editor con animación de tipeo realista.\n\n⚠ CUATRO conexiones simultáneas activas:\n  ① User ↔ AI Bashir\n  ② AI Bashir → Editor (escribe código)\n  ③ AI Bashir → UMT SDK (consulta nombres VR)\n  ④ Editor → UMT SDK (sync vivo — cada pulsación validada)\n\nCódigo final usa Pin Dual Roles:\n  • VR_DAC1 deactivated → Digital OUTPUT (LED)\n  • VR_I2C_SDA0 deactivated → Digital INPUT_PULLUP (sensor)\n  • VR_UART2 activated → Interface Pin TX (logging)",
    "El código completo está ahora visible en el editor.\n\nAparece un mensaje debajo:\n  «Si quieres añadir algo, puedes.»\n  «O el desarrollador puede escribir algo directamente.»\n\nDesarrollador puede:\n  • Aceptar tal cual\n  • Editar cualquier línea\n  • Añadir su propio código (User → Editor directo)",
    "Código .umt final enviado a UMT SDK / AIA Engine.\n\nAI Bashir + UMT SDK trabajan JUNTOS:\n  • UMT SDK ejecuta el pipeline determinista de AIA Engine\n  • AI Bashir narra el progreso\n\nAIA Engine realiza:\n  • Parse VR intent\n  • Full MCU pin scan en ESP32-D0WD\n  • Symbolic token matching (VR_UART_TX2 → {UART|TX|2} → GPIO17)\n  • Functional cloning",
    "Rule Engine ejecuta ANTES de cualquier inferencia AI (determinista, reglas duras):\n  ✓ GPIO6–11 (flash) no referenciados → PASS\n  ✓ Ningún OUTPUT en GPIO34/35/36/39 → PASS\n  ✓ GPIO0 no forzado a LOW → PASS\n  ✓ Sin conflictos de peripherals → PASS\n  ✓ Todas verificaciones GREEN → PROCEDER a UMT-IR",
    "Framework genera UMT Intermediate Representation:\n  UMT.Interface(VR_DAC1).deactivate() → DeactivateInterface(DAC1)\n  UMT.Digital_Pin(VR_DAC1).setMode(OUTPUT) → SetPinMode(VR_DAC1, OUTPUT)\n\nUMT-IR es el pivote del sistema.",
    "UMT SDK / Framework invoca AIA Engine para escribir el código C++ BACKEND carácter por carácter — Arduino-ESP32 Core.\n\n⚠ OCULTO DEL DESARROLLADOR — ¡lo que el desarrollador NUNCA ve!\n\nMappings VR resueltos a GPIO físico:\n  • VR_DAC1 → GPIO25\n  • VR_I2C_SDA0 → GPIO21\n  • VR_UART_TX2 → GPIO17",
    "UMT Platform consulta Frameworks & SDKs y Platforms:\n  → Arduino-ESP32 Core seleccionado\n  → Espressif ESP32 Platform seleccionado (xtensa-esp32-elf-gcc toolchain)\n\nArduino es peón de ejecución OCULTO.\nDesarrollador ve solo UMT VR API.",
    "Build Ecosystem orquesta codegen + compile:\n  ① UMT Platform → build config + path toolchain\n  ② Frameworks & SDKs → libs compiladas Arduino-ESP32\n  ③ Platforms → linker scripts xtensa\n\nCompile en sandboxed child process:\n  xtensa-esp32-elf-gcc → firmware.bin + firmware.elf",
    "Build produce ficheros firmware:\n  • firmware.bin — binario crudo para flash ESP32\n  • firmware.elf — con símbolos debug\n  • firmware.hex / firmware.uf2 — formatos alternativos\n\nUn target por sesión de build.",
    "NUEVO en v4: UMT Simulator ejecuta el firmware virtualmente ANTES de flashear hardware real.\n\nPara esta sesión (Target A bloqueado):\n  ✨ UMT Simulator → activa modo 'Sim Target A'\n  ✨ Pick Target A → resalta NanoKit Integrated ESP32\n\nDesarrollador ve: GPIO toggles, serial output, timing — todo simulado.",
    "Binario firmware fluye: Firmware Output → Flashing/Debug → Target A.\n\n  → Upload UART (Serial) por cable USB a placa NanoKit\n  → esptool escribe .bin en flash ESP32 en 0x10000\n  → Placa reinicia automáticamente",
    "ESP32 arranca y ejecuta firmware. Salida Serial fluye:\n  NanoKit ESP32 → UART a 115200 baud → Monitor\n\nMonitor muestra:\n  • Serial console (salida texto)\n  • Serial plotter (gráficos tiempo real)\n  • Log viewer con filtrado",
    "PASO FINAL — UMT SDK invoca Command Genius (lee main.umt via SDK).\n\nAI Bashir dice al desarrollador:\n  💬 «Ve a Command — A Genius Guides You para un walkthrough paso a paso.»\n\nDesarrollador responde:\n  💬 «Estoy siguiendo los pasos. Te contacto si necesito.»\n\nPanel Command Genius se abre.\n\n  1️⃣ HARDWARE WIRING — Cómo conectar en NanoKit Integrated ESP32\n  2️⃣ ALGORITHM (pasos lógicos con nombres VR)\n  3️⃣ FLOWCHART (árbol de decisión con VR interfaces)\n  4️⃣ PSEUDOCODE (inglés simple + sintaxis UMT VR)\n\nTodo en lenguaje UMT VR — SIN Arduino, SIN números GPIO de Espressif.",
  ],
  de: [
    "Entwickler (Stimme/Chat): „Ich möchte ein Projekt bauen. Ein Blink-and-Sense-Beispiel.\"\n\nFluss: User ↔ AI Bashir → UMT SDK (für Kontext).\n\nHinweis: User ↔ AI Bashir sind IMMER verbunden, wenn AI im Einsatz ist.\n\nAI Bashir fragt Pro_AmineUMT UMT SDK / Framework ab, um zu wissen:\n  • Verfügbare Boards / Targets\n  • VR-Namespace (VR_DAC1, VR_UART_TX2, ...)\n  • Fähigkeiten des aktuellen Chips\n\nAI Bashir ist das Konversations-Front-End (Claude/DeepSeek/ChatGPT/Gemini auswählbar).",
    "AI Bashir fragt Pro_AmineUMT UMT SDK / Framework ab — das SDK ist die AUTORITÄRE Quelle.\n\nDas SDK präsentiert dem Entwickler gleichzeitig ALLE Optionen:\n  → Target A — Entwicklungs-Boards (NanoKit ESP32, Arduino, STM32, Pico, Jetson)\n  → Target B — UMT IC (beliebiges MCU- oder SoC-Die auf BGA 16×16)\n  → Target C — NanoKit-iM (auswählbares MCU- oder SoC-Modul)\n  → UMT Simulator — virtuelle Ausführungsoption\n\nAI Bashir antwortet dem Entwickler:\n  „Welches Board, UMT IC oder NanoKit-iM-SoC möchten Sie verwenden?\n   Oder möchten Sie zuerst im Simulator testen?\"\n\nAI Bashir erfindet KEINE Targets — er listet, was UMT SDK bereitstellt.\nDas SDK ist die BASIS von allem.",
    "Entwickler wählt: NanoKit Integrated ESP32 (Target A).\n\nFluss: User → AI Bashir → UMT SDK → Target A.\n\n  ① Entwickler teilt AI Bashir seine Wahl mit\n  ② AI Bashir benachrichtigt UMT SDK von der Wahl\n  ③ UMT SDK sperrt das Target und lädt das Board-Profil\n     (nanokit-esp32.json: VR mappings, BGA-Adressen, MCU-Fähigkeiten)\n  ④ UMT SDK hebt Pick Target A — NanoKit Integrated ESP32 hervor\n\nDie Auswahl ist für diese Build-Sitzung gesperrt.\nUMT SDK weiß jetzt: target=A, board=nanokit-esp32, MCU=ESP32-D0WD.",
    "AI Bashir generiert den Code im Code Editor mit realistischer Tipp-Animation:\nZeichen → Zeichen → Wort → Wort → Zeile → Zeile.\n\n⚠ VIER gleichzeitige aktive Verbindungen:\n  ① User ↔ AI Bashir (immer verbunden, wenn AI im Einsatz)\n  ② AI Bashir → Editor (schreibt Code)\n  ③ AI Bashir → UMT SDK (fragt gültige VR-Namen für gesperrtes Target ab)\n  ④ Editor → UMT SDK (Live-Sync — jeder Tastendruck validiert)\n\nFinaler Code verwendet Pin Dual Roles:\n  • VR_DAC1 deactivated → Digital OUTPUT (LED)\n  • VR_I2C_SDA0 deactivated → Digital INPUT_PULLUP (Sensor)\n  • VR_UART2 activated → Interface Pin TX (Logging)",
    "Der vollständige Code ist jetzt im Editor sichtbar.\n\nEine Nachricht erscheint darunter:\n  „Wenn Sie etwas hinzufügen möchten, können Sie das.\"\n  „Oder der Entwickler kann direkt etwas schreiben.\"\n\nEntwickler kann:\n  • Wie ist akzeptieren\n  • Jede Zeile bearbeiten\n  • Eigenen Code hinzufügen (User → Editor direkt)",
    "Finaler .umt-Code wird an UMT SDK / AIA Engine gesendet.\n\nAI Bashir + UMT SDK arbeiten ZUSAMMEN (bei jedem wichtigen Schritt):\n  • UMT SDK führt das deterministische Pipeline der AIA Engine aus\n  • AI Bashir erzählt dem Entwickler den Fortschritt\n\nAIA Engine führt aus:\n  • Parse VR intent (Digital oder Interface mode?)\n  • Full MCU pin scan auf ESP32-D0WD\n  • Symbolic token matching (VR_UART_TX2 → {UART|TX|2} → GPIO17)\n  • Functional cloning (Bindung GPIO → VR)",
    "Rule Engine läuft VOR jeder AI-Inferenz (deterministisch, harte Regeln):\n  ✓ GPIO6–11 (VR_GPIO04-09 = ESP32 flash) nicht referenziert → PASS\n  ✓ Keine OUTPUT auf GPIO34/35/36/39 → PASS\n  ✓ GPIO0 (VR_BOOT 0x38) nicht auf LOW gezwungen → PASS\n  ✓ Keine Peripheral-Konflikte (UART2 ↔ I2C0 ↔ DAC1) → PASS\n  ✓ Alle Prüfungen GREEN → Fortsetzen zu UMT-IR",
    "Framework generiert UMT Intermediate Representation:\n  UMT.Interface(VR_DAC1).deactivate() → DeactivateInterface(DAC1)\n  UMT.Digital_Pin(VR_DAC1).setMode(OUTPUT) → SetPinMode(VR_DAC1, OUTPUT)\n  UMT.Interface(VR_UART2).activate() → ActivateInterface(UART2)\n\nUMT-IR ist der Systemkern — Backend-Änderungen wirken sich niemals auf Entwicklercode aus.",
    "UMT SDK / Framework ruft AIA Engine auf, um BACKEND C++-Code Zeichen für Zeichen zu schreiben — Arduino-ESP32 Core.\n\nAIA = Abstraction Intelligence Algorithm Engine\n\n⚠ VERBORGEN vor dem Entwickler — das sieht der Entwickler NIEMALS!\n\nVR-Mappings aufgelöst zu physischen GPIO:\n  • VR_DAC1 → GPIO25 (deactivated → digitalWrite)\n  • VR_I2C_SDA0 → GPIO21 (digital INPUT_PULLUP, I2C off)\n  • VR_UART_TX2 → GPIO17 (Serial2 active)\n\nBackend = verborgener Ausführungs-Bauer — Entwickler berührt es NIE.",
    "UMT Platform fragt Frameworks & SDKs und Platforms ab:\n  → Arduino-ESP32 Core ausgewählt (ledcWrite, Serial, Wire libraries)\n  → Espressif ESP32 Platform ausgewählt (xtensa-esp32-elf-gcc toolchain)\n\nArduino ist ein verborgener Ausführungs-Bauer.\nEntwickler sieht nur UMT VR API.",
    "Build Ecosystem orchestriert codegen + compile:\n  ① UMT Platform → Build-Config + Toolchain-Pfad\n  ② Frameworks & SDKs → kompilierte Arduino-ESP32-Bibliotheken\n  ③ Platforms → xtensa Linker-Skripte + Startup-Code\n\nCompile läuft in sandboxed child process:\n  xtensa-esp32-elf-gcc → firmware.bin + firmware.elf",
    "Build produziert Firmware-Dateien:\n  • firmware.bin — rohes Binary für ESP32 Flash\n  • firmware.elf — mit Debug-Symbolen (GDB/JTAG)\n  • firmware.hex / firmware.uf2 — alternative Formate\n\nEin Target pro Build-Sitzung (multiplicity = 1).\nBereit für Simulator ODER Flash.",
    "NEU in v4: UMT Simulator führt Firmware virtuell aus, BEVOR echte Hardware geflashed wird.\n\nFür diese Build-Sitzung (Target A gesperrt):\n  ✨ UMT Simulator → aktiviert Modus 'Sim Target A: Dev Boards'\n  ✨ Pick Target A → hebt NanoKit Integrated ESP32 hervor\n\nEntwickler sieht: GPIO toggles, Serial Output, Timing — alles simuliert.\nWerden Bugs hier gefunden, werden sie korrigiert, bevor Hardware berührt wird.",
    "Firmware-Binary fließt: Firmware Output → Flashing/Debug → Target A.\n\n  → UART (Serial) Upload über USB-Kabel zum NanoKit Board\n  → esptool schreibt .bin in ESP32 Flash bei 0x10000\n  → Board startet automatisch neu nach abgeschlossenem Flash",
    "ESP32 bootet und führt Firmware aus. Serial-Ausgabe fließt:\n  NanoKit ESP32 → UART bei 115200 baud → Monitor\n\nMonitor zeigt:\n  • Serial console (Text-Ausgabe)\n  • Serial plotter (Echtzeit-Diagramme)\n  • Log viewer mit Filterung",
    "FINALER SCHRITT — UMT SDK ruft Command Genius auf (liest main.umt via SDK).\n\nAI Bashir sagt dem Entwickler:\n  💬 „Gehen Sie zu Command — A Genius Guides You für eine Schritt-für-Schritt-Anleitung.\"\n\nEntwickler antwortet:\n  💬 „Ich folge den Schritten. Ich melde mich, wenn ich Sie brauche.\"\n\nCommand Genius Panel öffnet sich (wie cmd / output in VSCode & Antigravity).\n\n  1️⃣ HARDWARE WIRING — Wie man auf NanoKit Integrated ESP32 verbindet\n  2️⃣ ALGORITHM (logische Schritte mit VR-Namen)\n  3️⃣ FLOWCHART (Entscheidungsbaum mit VR interfaces)\n  4️⃣ PSEUDOCODE (vereinfachtes Englisch + UMT VR Syntax)\n\nAlles in UMT VR Sprache — KEIN Arduino, KEINE GPIO-Nummern von Espressif.",
  ],
  zh: [
    "开发者（语音/聊天）：「我想构建一个项目。一个 blink-and-sense 示例。」\n\n流程：User ↔ AI Bashir → UMT SDK（用于上下文）。\n\n注意：使用 AI 时，User ↔ AI Bashir 始终相连。\n\nAI Bashir 查询 Pro_AmineUMT UMT SDK / Framework 以了解：\n  • 可用的开发板 / Targets\n  • VR 命名空间（VR_DAC1、VR_UART_TX2 等）\n  • 当前芯片的能力\n\nAI Bashir 是对话式前端（Claude/DeepSeek/ChatGPT/Gemini 可选）。",
    "AI Bashir 查询 Pro_AmineUMT UMT SDK / Framework — SDK 是权威来源。\n\nSDK 同时向开发者展示所有选项：\n  → Target A — 开发板（NanoKit ESP32、Arduino、STM32、Pico、Jetson）\n  → Target B — UMT IC（在 BGA 16×16 上的任何 MCU 或 SoC die）\n  → Target C — NanoKit-iM（可选 MCU 或 SoC 模块）\n  → UMT Simulator — 虚拟运行选项\n\nAI Bashir 回应开发者：\n  「你想以哪个开发板、UMT IC 或 NanoKit-iM-SoC 为目标？\n   或者你想先在模拟器中测试？」\n\nAI Bashir 不会发明 targets — 它列出 UMT SDK 提供的内容。\nSDK 是一切的基础。",
    "开发者选择：NanoKit Integrated ESP32（Target A）。\n\n流程：User → AI Bashir → UMT SDK → Target A。\n\n  ① 开发者向 AI Bashir 传达他的选择\n  ② AI Bashir 通知 UMT SDK 此选择\n  ③ UMT SDK 锁定 target 并加载板配置文件\n     （nanokit-esp32.json：VR mappings、BGA 地址、MCU 能力）\n  ④ UMT SDK 高亮 Pick Target A — NanoKit Integrated ESP32\n\n该选择已锁定到此构建会话。\nUMT SDK 现在知道：target=A、board=nanokit-esp32、MCU=ESP32-D0WD。",
    "AI Bashir 在 Code Editor 中以逼真的打字动画生成代码：\n字符 → 字符 → 单词 → 单词 → 行 → 行。\n\n⚠ 四个同时活动的连接：\n  ① User ↔ AI Bashir（使用 AI 时始终连接）\n  ② AI Bashir → Editor（编写代码）\n  ③ AI Bashir → UMT SDK（查询有效的 VR 名称）\n  ④ Editor → UMT SDK（实时同步 — 每次按键都验证）\n\n最终代码使用 Pin Dual Roles：\n  • VR_DAC1 deactivated → Digital OUTPUT (LED)\n  • VR_I2C_SDA0 deactivated → Digital INPUT_PULLUP (sensor)\n  • VR_UART2 activated → Interface Pin TX (logging)",
    "完整代码现在显示在 editor 中。\n\n下方出现一条消息：\n  「如果你想添加什么，可以的。」\n  「或者开发者可以直接写一些东西。」\n\n开发者可以：\n  • 按原样接受\n  • 编辑任何行\n  • 添加自己的代码（User → Editor 直接）",
    "最终 .umt 代码发送到 UMT SDK / AIA Engine。\n\nAI Bashir + UMT SDK 一起工作（在每个重要步骤）：\n  • UMT SDK 运行 AIA Engine 确定性 pipeline\n  • AI Bashir 向开发者讲述进度\n\nAIA Engine 执行：\n  • Parse VR intent（Digital 还是 Interface mode？）\n  • Full MCU pin scan 在 ESP32-D0WD 上\n  • Symbolic token matching（VR_UART_TX2 → {UART|TX|2} → GPIO17）\n  • Functional cloning（绑定 GPIO → VR）",
    "Rule Engine 在任何 AI inference 之前运行（确定性的硬规则）：\n  ✓ GPIO6–11（VR_GPIO04-09 = ESP32 flash）未引用 → PASS\n  ✓ GPIO34/35/36/39 上没有 OUTPUT → PASS\n  ✓ GPIO0（VR_BOOT 0x38）未被强制为 LOW → PASS\n  ✓ 没有 peripheral 冲突 → PASS\n  ✓ 所有检查 GREEN → 继续到 UMT-IR",
    "Framework 生成 UMT Intermediate Representation：\n  UMT.Interface(VR_DAC1).deactivate() → DeactivateInterface(DAC1)\n  UMT.Digital_Pin(VR_DAC1).setMode(OUTPUT) → SetPinMode(VR_DAC1, OUTPUT)\n  UMT.Interface(VR_UART2).activate() → ActivateInterface(UART2)\n\nUMT-IR 是系统枢轴 — backend 更改永远不会影响开发者代码。",
    "UMT SDK / Framework 调用 AIA Engine 逐字符编写 BACKEND C++ 代码 — Arduino-ESP32 Core。\n\nAIA = Abstraction Intelligence Algorithm Engine\n\n⚠ 对开发者隐藏 — 开发者永远看不到这个！\n\nVR mappings 解析到物理 GPIO：\n  • VR_DAC1 → GPIO25\n  • VR_I2C_SDA0 → GPIO21\n  • VR_UART_TX2 → GPIO17\n\nBackend = 隐藏的执行棋子 — 开发者永远不会触碰。",
    "UMT Platform 查询 Frameworks & SDKs 和 Platforms：\n  → 选择 Arduino-ESP32 Core（ledcWrite、Serial、Wire 库）\n  → 选择 Espressif ESP32 Platform（xtensa-esp32-elf-gcc toolchain）\n\nArduino 是隐藏的执行棋子。\n开发者只看到 UMT VR API。",
    "Build Ecosystem 编排 codegen + compile：\n  ① UMT Platform → 构建配置 + toolchain 路径\n  ② Frameworks & SDKs → 编译的 Arduino-ESP32 库\n  ③ Platforms → xtensa linker 脚本\n\nCompile 在 sandboxed child process 中运行：\n  xtensa-esp32-elf-gcc → firmware.bin + firmware.elf",
    "Build 生成 firmware 文件：\n  • firmware.bin — ESP32 flash 的原始二进制\n  • firmware.elf — 带 debug 符号\n  • firmware.hex / firmware.uf2 — 替代格式\n\n每个构建会话一个 target。\n准备好用于 Simulator 或 Flash。",
    "v4 新功能：UMT Simulator 在 flash 真实硬件之前虚拟运行 firmware。\n\n对于此构建会话（Target A 已锁定）：\n  ✨ UMT Simulator → 激活 'Sim Target A' 模式\n  ✨ Pick Target A → 高亮 NanoKit Integrated ESP32\n\n开发者看到：GPIO toggles、Serial Output、timing — 全部模拟。\n如果在这里发现 bugs，会在触碰硬件之前修复。",
    "Firmware 二进制流动：Firmware Output → Flashing/Debug → Target A。\n\n  → 通过 USB 线缆 UART（Serial）上传到 NanoKit 板\n  → esptool 在 0x10000 位置将 .bin 写入 ESP32 flash\n  → flash 完成后板自动重启",
    "ESP32 启动并执行 firmware。Serial 输出流动：\n  NanoKit ESP32 → UART 在 115200 baud → Monitor\n\nMonitor 显示：\n  • Serial console（文本输出）\n  • Serial plotter（实时图表）\n  • Log viewer 带过滤",
    "最终步骤 — UMT SDK 调用 Command Genius（通过 SDK 读取 main.umt）。\n\nAI Bashir 告诉开发者：\n  💬 「前往 Command — A Genius Guides You 获取分步演练。」\n\n开发者回答：\n  💬 「我正在按步骤进行。如果需要会联系你。」\n\nCommand Genius 面板打开（像 VSCode & Antigravity 中的 cmd / output）。\n\n  1️⃣ HARDWARE WIRING — 如何在 NanoKit Integrated ESP32 上连接\n  2️⃣ ALGORITHM（带 VR 名称的逻辑步骤）\n  3️⃣ FLOWCHART（带 VR interfaces 的决策树）\n  4️⃣ PSEUDOCODE（简化英语 + UMT VR 语法）\n\n全部使用 UMT VR 语言 — 没有 Arduino，没有 Espressif 的 GPIO 编号。",
  ],
  ja: [
    "開発者（音声/チャット）：「プロジェクトを構築したい。blink-and-senseの例です。」\n\nフロー：User ↔ AI Bashir → UMT SDK（コンテキスト用）。\n\n注意：AIが使用中の場合、User ↔ AI Bashirは常に接続されています。\n\nAI Bashirは、Pro_AmineUMT UMT SDK / Frameworkに問い合わせて以下を知ります：\n  • 利用可能なボード / Targets\n  • VR名前空間（VR_DAC1、VR_UART_TX2など）\n  • 現在のチップの機能\n\nAI Bashirは会話型フロントエンドです（Claude/DeepSeek/ChatGPT/Gemini選択可能）。",
    "AI BashirはPro_AmineUMT UMT SDK / Frameworkに問い合わせます — SDKが権威ある情報源です。\n\nSDKは開発者にすべてのオプションを同時に提示します：\n  → Target A — 開発ボード（NanoKit ESP32、Arduino、STM32、Pico、Jetson）\n  → Target B — UMT IC（BGA 16×16上の任意のMCUまたはSoC die）\n  → Target C — NanoKit-iM（選択可能なMCUまたはSoCモジュール）\n  → UMT Simulator — 仮想実行オプション\n\nAI Bashirは開発者に応答します：\n  「どのボード、UMT IC、またはNanoKit-iM-SoCをターゲットにしますか？\n   それとも先にシミュレーターでテストしますか？」\n\nAI Bashirはtargetsを発明しません — UMT SDKが提供するものをリストします。\nSDKはすべての基盤です。",
    "開発者が選択：NanoKit Integrated ESP32（Target A）。\n\nフロー：User → AI Bashir → UMT SDK → Target A。\n\n  ① 開発者がAI Bashirに選択を伝える\n  ② AI BashirがUMT SDKに選択を通知する\n  ③ UMT SDKがtargetをロックし、ボードプロファイルを読み込む\n     （nanokit-esp32.json：VR mappings、BGAアドレス、MCU機能）\n  ④ UMT SDKがPick Target A — NanoKit Integrated ESP32をハイライト\n\n選択はこのビルドセッションでロックされます。\nUMT SDKは現在知っています：target=A、board=nanokit-esp32、MCU=ESP32-D0WD。",
    "AI BashirはCode Editorでリアルなタイピングアニメーションでコードを生成します：\n文字 → 文字 → 単語 → 単語 → 行 → 行。\n\n⚠ 4つの同時アクティブ接続：\n  ① User ↔ AI Bashir（AI使用時は常に接続）\n  ② AI Bashir → Editor（コードを書く）\n  ③ AI Bashir → UMT SDK（有効なVR名を問い合わせる）\n  ④ Editor → UMT SDK（ライブ同期 — すべてのキーストロークが検証される）\n\n最終コードはPin Dual Rolesを使用：\n  • VR_DAC1 deactivated → Digital OUTPUT (LED)\n  • VR_I2C_SDA0 deactivated → Digital INPUT_PULLUP (sensor)\n  • VR_UART2 activated → Interface Pin TX (logging)",
    "完全なコードがeditorに表示されます。\n\n下にメッセージが表示されます：\n  「何か追加したい場合は、できます。」\n  「または、開発者が直接何かを書くことができます。」\n\n開発者は次のことができます：\n  • そのまま受け入れる\n  • 任意の行を編集する\n  • 独自のコードを追加する（User → Editor直接）",
    "最終.umtコードがUMT SDK / AIA Engineに送信されます。\n\nAI Bashir + UMT SDKが一緒に動作します（すべての重要なステップで）：\n  • UMT SDKがAIA Engine確定的パイプラインを実行\n  • AI Bashirが開発者に進捗を伝える\n\nAIA Engineが実行：\n  • Parse VR intent（DigitalまたはInterface mode？）\n  • Full MCU pin scan（ESP32-D0WD上）\n  • Symbolic token matching（VR_UART_TX2 → {UART|TX|2} → GPIO17）\n  • Functional cloning（GPIO → VRバインディング）",
    "Rule EngineはAI inferenceの前に実行されます（確定的、厳格なルール）：\n  ✓ GPIO6–11（VR_GPIO04-09 = ESP32 flash）参照されていない → PASS\n  ✓ GPIO34/35/36/39にOUTPUTなし → PASS\n  ✓ GPIO0（VR_BOOT 0x38）LOWに強制されていない → PASS\n  ✓ peripheralの競合なし → PASS\n  ✓ すべてのチェックGREEN → UMT-IRに進む",
    "FrameworkがUMT Intermediate Representationを生成：\n  UMT.Interface(VR_DAC1).deactivate() → DeactivateInterface(DAC1)\n  UMT.Digital_Pin(VR_DAC1).setMode(OUTPUT) → SetPinMode(VR_DAC1, OUTPUT)\n  UMT.Interface(VR_UART2).activate() → ActivateInterface(UART2)\n\nUMT-IRはシステムの軸 — backend変更は開発者コードに影響しません。",
    "UMT SDK / FrameworkがAIA Engineを呼び出し、BACKEND C++コードを文字ごとに書きます — Arduino-ESP32 Core。\n\nAIA = Abstraction Intelligence Algorithm Engine\n\n⚠ 開発者から隠されている — 開発者は決してこれを見ません！\n\nVR mappingsが物理GPIOに解決：\n  • VR_DAC1 → GPIO25\n  • VR_I2C_SDA0 → GPIO21\n  • VR_UART_TX2 → GPIO17\n\nBackend = 隠された実行ポーン — 開発者は決して触れません。",
    "UMT PlatformはFrameworks & SDKsとPlatformsに問い合わせます：\n  → Arduino-ESP32 Core選択（ledcWrite、Serial、Wireライブラリ）\n  → Espressif ESP32 Platform選択（xtensa-esp32-elf-gcc toolchain）\n\nArduinoは隠された実行ポーンです。\n開発者はUMT VR APIのみを見ます。",
    "Build Ecosystemがcodegen + compileをオーケストレーション：\n  ① UMT Platform → buildコンフィグ + toolchainパス\n  ② Frameworks & SDKs → コンパイル済みArduino-ESP32ライブラリ\n  ③ Platforms → xtensa linkerスクリプト\n\nCompileはsandboxed child processで実行：\n  xtensa-esp32-elf-gcc → firmware.bin + firmware.elf",
    "Buildがfirmwareファイルを生成：\n  • firmware.bin — ESP32 flash用の生バイナリ\n  • firmware.elf — debugシンボル付き\n  • firmware.hex / firmware.uf2 — 代替フォーマット\n\nビルドセッションごとに1つのtarget。\nSimulatorまたはFlashの準備完了。",
    "v4の新機能：UMT Simulatorは実際のハードウェアにflashする前にfirmwareを仮想的に実行します。\n\nこのビルドセッション（Target Aロック済み）：\n  ✨ UMT Simulator → 'Sim Target A'モードを有効化\n  ✨ Pick Target A → NanoKit Integrated ESP32をハイライト\n\n開発者は次のものを見ます：GPIO toggles、Serial Output、timing — すべてシミュレートされています。\nここでバグが発見された場合、ハードウェアに触れる前に修正されます。",
    "Firmwareバイナリが流れます：Firmware Output → Flashing/Debug → Target A。\n\n  → USBケーブル経由でNanoKitボードにUART（Serial）アップロード\n  → esptoolが0x10000のESP32 flashに.binを書き込み\n  → flash完了後、ボードが自動的に再起動",
    "ESP32が起動してfirmwareを実行します。Serial出力が流れます：\n  NanoKit ESP32 → UART 115200 baud → Monitor\n\nMonitorが表示：\n  • Serial console（テキスト出力）\n  • Serial plotter（リアルタイムグラフ）\n  • Log viewer（フィルタリング付き）",
    "最終ステップ — UMT SDKがCommand Geniusを呼び出します（SDK経由でmain.umtを読み取り）。\n\nAI Bashirが開発者に伝えます：\n  💬 「Command — A Genius Guides Youに行って段階的なウォークスルーを取得してください。」\n\n開発者は応答します：\n  💬 「ステップに従っています。必要なときに連絡します。」\n\nCommand Geniusパネルが開きます（VSCode & Antigravityのcmd / outputのように）。\n\n  1️⃣ HARDWARE WIRING — NanoKit Integrated ESP32での接続方法\n  2️⃣ ALGORITHM（VR名による論理的なステップ）\n  3️⃣ FLOWCHART（VR interfacesを使用した決定木）\n  4️⃣ PSEUDOCODE（簡単な英語 + UMT VR構文）\n\nすべてUMT VR言語で — Arduinoなし、EspressifのGPIO番号なし。",
  ],
};

/* ═══ 14-STEP DEMO ═══ */
const DEMO = [
  { title:"Step 1 — Developer asks AI Bashir",
    blocks:["user","aiChat","fw"], conns:["u-ai","ai-fw"], hl:{aiChat:"chat",fw:"context"},
    text:"Developer (voice or chat): \"I want to build a complete project — a DC motor speed controller. The motor runs on 12V at 1A. I'll use a potentiometer to control the speed, an encoder sensor to count motor rotations, and a 16×2 I2C LCD to display the motor RPM and the speed percentage in real time. Target board: NanoKit Integrated ESP32.\"\n\nFlow: User ↔ AI Bashir → UMT SDK (for context).\n\nNotice: User ↔ AI Bashir is ALWAYS connected when AI is in use.\n\nAI Bashir queries Pro_AmineUMT UMT SDK / Framework to know:\n  • Available boards / Targets\n  • VR namespace for the FIVE peripherals needed:\n      VR_ADC, VR_PWM_OUT0, VR_I2C0, VR_GPIO00→VR_INT0, VR_UART0\n  • Capabilities of NanoKit ESP32 for this multi-peripheral project\n    (ADC1 12-bit, LEDC PWM, Wire I2C, attachInterrupt, Serial)\n\nAI Bashir is the conversational front-end (Claude/DeepSeek/ChatGPT/Gemini selectable)." },

  { title:"Step 2 — AI Bashir asks for target (from UMT SDK)",
    blocks:["user","aiChat","fw","tgtA","tgtB","tgtC","sim"],
    conns:["u-ai","ai-fw","fw-tA","fw-tB","fw-tC","fw-sim"],
    hl:{aiChat:"reply",fw:"context",tgtA:"available",tgtB:"available",tgtC:"available",sim:"available"},
    text:"AI Bashir queries Pro_AmineUMT UMT SDK / Framework — the SDK is the AUTHORITATIVE source.\n\nThe SDK simultaneously presents ALL options to the developer:\n  → Target A — Development Boards (NanoKit ESP32, Arduino, STM32, Pico, Jetson)\n  → Target B — UMT IC (any MCU or SoC die on BGA 16×16)\n  → Target C — NanoKit-iM (selectable MCU or SoC module)\n  → UMT Simulator — virtual run option (any of the 3 targets)\n\nAI Bashir replies to the developer:\n  \"Which board, UMT IC, or NanoKit-iM-SoC do you want to target?\n   Or do you prefer to test in the Simulator first?\"\n\nNotice: AI Bashir ↔ Developer (always connected when AI is in use).\nAI Bashir does NOT invent targets — it lists what UMT SDK provides.\nThe SDK is the BASE of everything — Pro_AmineUMT IDE with AI is built on top." },

  { title:"Step 3 — Developer picks NanoKit ESP32 (via UMT SDK)",
    blocks:["user","aiChat","fw","tgtA"], conns:["u-ai","ai-fw","fw-tA"],
    hl:{fw:"target lock",tgtA:"NanoKit Integrated ESP32"},
    text:"Developer selects: NanoKit Integrated ESP32 (Target A).\n\nFlow: User → AI Bashir → UMT SDK → Target A.\n\n  ① Developer tells AI Bashir his choice (User ↔ AI Bashir always connected)\n  ② AI Bashir notifies UMT SDK of the choice\n  ③ UMT SDK locks the target & loads the board profile\n     (nanokit-esp32.json: VR mappings, BGA addresses, MCU capabilities)\n  ④ UMT SDK lights up Pick Target A — NanoKit Integrated ESP32\n\nThe selection is locked for this build session.\nUMT SDK now knows: target=A, board=nanokit-esp32, MCU=ESP32-D0WD." },

  { title:"Step 4 — AI Bashir writes code (live sync with UMT SDK)",
    blocks:["user","aiChat","editor","fw"],
    conns:["u-ai","ai-ed","ai-fw","ed-fw"],
    hl:{editor:"typing",aiChat:"writing",fw:"validate"},
    text:"AI Bashir generates the DC motor speed controller code in the Code Editor with realistic typing animation:\ncharacter → character → word → word → line → line.\n\n★ FOUNDATIONAL DECISION #1 — Pure VR Source / Hidden Native Backend (v4.1):\n  UMT IS a C++ DIALECT — not a new language. The .umt file is C++ with the UMT VR API library,\n  exactly like .ino is C++ with the Arduino API. Same syntax, same compile (gcc/clang).\n  Translation happens between API libraries — NOT between languages.\n  Parallels: TypeScript→JavaScript, Kotlin→bytecode, Dart→native, CUDA→PTX, UMT→platform C++.\n\n⚠ FOUR simultaneous connections active:\n  ① User ↔ AI Bashir (always connected when AI is in use)\n  ② AI Bashir → Editor (writes the code)\n  ③ AI Bashir → UMT SDK (queries valid VR names for the locked target)\n  ④ Editor → UMT SDK (live sync — every keystroke validated)\n\nWhy SDK must know what AI Bashir writes:\n  • Validate VR names exist in the board profile (nanokit-esp32.json)\n  • Provide live autocomplete for VR_ADC_IN0, VR_PWM_OUT0, VR_I2C_SDA0, etc.\n  • Build the AIA context EARLY (before final compile)\n  • Detect typos/conflicts in real-time (Rule Engine pre-check)\n\nThe final code uses FIVE simultaneous VR interfaces (from UMT SDK VR namespace):\n  • VR_ADC activated     → VR_ADC_IN0 reads the potentiometer (0..4095, 12-bit)\n  • VR_PWM_OUT0 activated → motor speed control via L298N driver IC\n  • VR_I2C0 activated    → 16×2 LCD over Wire bus (SDA0 + SCL0, addr 0x27)\n  • VR_GPIO00 bound to VR_INT0 → encoder pulse counter (RISING-edge ISR)\n  • VR_UART0 activated   → Serial monitor for debugging\n\nThe developer writes ONLY .umt VR API — never GPIO numbers, never Arduino/ESP-IDF calls." },

  { title:"Step 5 — Code Editor — developer review",
    blocks:["editor","user"], conns:["u-ed"], hl:{editor:"complete"},
    text:"The full code is now visible in the editor.\n\nA prompt appears below:\n  \"If you want to add something, you can.\"\n  \"Or developer can write something directly.\"\n\nDeveloper can:\n  • Accept as-is\n  • Edit any line\n  • Add their own code (direct User → Editor flow)" },

  { title:"Step 6 — Code → AIA Engine (UMT SDK + AI Bashir together)",
    blocks:["editor","fw","aiChat"], conns:["ed-fw","ai-fw"],
    hl:{fw:"AI Agent",aiChat:"reply"},
    text:"Final .umt code is sent to UMT SDK / AIA Engine.\n\nAI Bashir + UMT SDK work TOGETHER (every important step):\n  • UMT SDK runs the AIA Engine deterministic pipeline\n  • AI Bashir narrates progress to the developer (\"now resolving VR mappings...\")\n\nAIA Engine performs:\n  • Parse VR intent (Digital or Interface mode?)\n  • Full MCU pin scan on ESP32-D0WD\n  • Symbolic token matching (VR_UART_TX2 → {UART|TX|2} → GPIO17)\n  • Functional cloning (bind GPIO → VR)" },

  { title:"Step 7 — Rule Engine (Deterministic — UMT SDK + AI Bashir)",
    blocks:["fw","aiChat"], conns:["ai-fw"], hl:{fw:"Static Checks",aiChat:"reply"},
    text:"Rule Engine runs BEFORE any AI inference (deterministic, hard rules):\n  ✓ GPIO6–11 (VR_GPIO04-09 = ESP32 flash) NOT referenced → PASS\n  ✓ No OUTPUT on GPIO34/35/36/39 → PASS\n  ✓ GPIO0 (VR_BOOT 0x38) not driven LOW → PASS\n  ✓ No peripheral conflicts (UART2 ↔ I2C0 ↔ DAC1) → PASS\n  ✓ All checks GREEN → PROCEED to UMT-IR\n\nAI Bashir reports each check status to the developer in real-time." },

  { title:"Step 8 — UMT-IR Generated (UMT SDK + AI Bashir)",
    blocks:["fw","platform","aiChat"], conns:["fw-pl","ai-fw"],
    hl:{fw:"UMT-IR",aiChat:"reply"},
    text:"Framework generates UMT Intermediate Representation for the DC motor controller:\n  UMT.Interface(VR_UART0).activate() → ActivateInterface(UART0)\n  UMT.Interface(VR_ADC).activate() → ActivateInterface(ADC)\n  UMT.Interface_Pin(VR_ADC_IN0).read() → ReadAnalog(VR_ADC_IN0)\n  UMT.Interface(VR_PWM_OUT0).activate() → ActivateInterface(PWM_OUT0)\n  UMT.Interface_Pin(VR_PWM_OUT0).write(duty) → WritePWM(VR_PWM_OUT0, duty)\n  UMT.Interface(VR_I2C0).activate() → ActivateInterface(I2C0)\n  UMT.Interface(VR_GPIO00).bindTo(VR_INT0).activate() → BindAndActivate(VR_GPIO00, VR_INT0)\n  UMT.Interface_Pin(VR_INT0).attach(h, RISING) → AttachInterrupt(VR_INT0, h, RISING)\n  UMT.LCD.init(0x27) → I2C_LCD_Init(VR_I2C0, 0x27)\n  UMT.LCD.print(str) → I2C_LCD_Print(VR_I2C0, str)\n\nUMT-IR is the system pivot — backend changes never affect developer code.\nAI Bashir explains the abstraction layer to the developer." },

  { title:"Step 9 — UMT SDK invokes AIA Engine Codegen — Hidden C++ Generated",
    blocks:["fw","aiGen","aiChat"], conns:["fw-gen","ai-fw"],
    hl:{fw:"Code Gen",aiGen:"writing",aiChat:"reply"},
    text:"UMT SDK / Framework invokes AIA Engine to write the BACKEND C++ code character-by-character — Arduino-ESP32 Core.\n\nAIA = Abstraction Intelligence Algorithm Engine\n\n⚠ HIDDEN FROM DEVELOPER — this is what the developer NEVER sees!\n\nOutput path: .umt/generated/main_generated.cpp — auto-regenerated every build.\nNEVER edited. NEVER read. NEVER touched by the developer.\n\n★ THE 5 GUARANTEES — Pure VR Source / Hidden Native Backend (v4.1):\n  ① Developer NEVER sees a GPIO number — only VR identifiers\n  ② Developer NEVER picks Arduino vs ESP-IDF vs Zephyr — AIA selects backend invisibly\n  ③ Developer NEVER configures a toolchain — UMT Platform Layer handles it\n  ④ ONLY the .umt VR API appears in the editor — no platform code ever surfaces\n  ⑤ All mapping + backend selection + codegen done by AIA Engine — deterministic-first\n\nVR mappings resolved to physical GPIO (THIS BUILD — ESP32):\n  • VR_ADC_IN0 → GPIO36 (ADC1_CH0, 12-bit resolution)\n  • VR_PWM_OUT0 → GPIO2 (LEDC channel 0, 5 kHz, 8-bit duty)\n  • VR_I2C_SDA0 → GPIO21 (Wire SDA)\n  • VR_I2C_SCL0 → GPIO22 (Wire SCL)\n  • VR_GPIO00 → GPIO4 (INPUT_PULLUP + attachInterrupt RISING, IRAM ISR)\n  • VR_UART0 → GPIO1 TX / GPIO3 RX (Serial @ 115200)\n\nCross-arch: SAME .umt → 3 DIFFERENT C++ files:\n  → ESP32: ledcWrite() + Wire + attachInterrupt (Arduino-ESP32 Core)\n  → STM32: HAL_TIM_PWM_Start() + HAL_I2C_Master_Transmit + HAL_NVIC_EnableIRQ (STM32Cube HAL)\n  → RP2040: pwm_set_chan_level() + i2c_write_blocking + irq_set_enabled (Pico SDK)\n\nParallel: like TypeScript → JavaScript (per target), CUDA → PTX (per GPU arch), Flutter → native (per platform).\n\n  Platform: Espressif ESP32 (this build)\n  SDK: Arduino-ESP32 Core (hidden execution pawn)\n  Backend: developer NEVER touches it\n\nAI Bashir works alongside SDK throughout the codegen process." },

  { title:"Step 10 — UMT Platform: Framework + Platform Selected",
    blocks:["fw","platform","sdks","plats","aiChat"], conns:["fw-pl","pl-sdk","pl-plt","ai-fw"],
    hl:{sdks:"Arduino",plats:"Espressif",aiChat:"reply"},
    text:"UMT Platform queries Frameworks & SDKs and Platforms:\n  → Arduino-ESP32 Core selected (ledcWrite, Serial, Wire libraries)\n  → Espressif ESP32 Platform selected (xtensa-esp32-elf-gcc toolchain)\n\nArduino is a HIDDEN execution pawn — developer never sees it.\nDeveloper sees only UMT VR API.\n\nWhen UMT Platform is in use, UMT SDK + AI Bashir BOTH stay connected\n(SDK orchestrates the toolchain, AI Bashir narrates progress to developer)." },

  { title:"Step 11 — Codegen + Compile (UMT SDK + AI Bashir)",
    blocks:["build","platform","sdks","plats","fw","aiChat"],
    conns:["pl-bld","sk-bld","pt-bld","ai-fw"],
    hl:{build:"compile",aiChat:"reply"},
    text:"Build Ecosystem orchestrates codegen + compile:\n  ① UMT Platform → build config + toolchain path\n  ② Frameworks & SDKs → Arduino-ESP32 compiled libraries\n  ③ Platforms → xtensa linker scripts + startup code\n\nCodegen produces hidden C++ from UMT-IR.\nCompile runs in sandboxed child process:\n  xtensa-esp32-elf-gcc → firmware.bin + firmware.elf\n\nAI Bashir reports compile progress to developer.\nUMT SDK + AI Bashir = always connected on important steps." },

  { title:"Step 12 — Firmware Output (UMT SDK + AI Bashir)",
    blocks:["build","fwout","fw","aiChat"],
    conns:["bld-fw","ai-fw"],
    hl:{fwout:"binary",aiChat:"reply"},
    text:"Build produces firmware files:\n  • firmware.bin — raw binary for ESP32 flash\n  • firmware.elf — with debug symbols (GDB/JTAG)\n  • firmware.hex / firmware.uf2 — alternative formats per target\n\nOne target per build session (multiplicity = 1).\nReady for either Simulator OR Flash.\n\nAI Bashir confirms successful firmware build to the developer." },

  { title:"Step 13 — UMT Simulator (UMT SDK + AI Bashir)",
    blocks:["fw","sim","tgtA","aiChat"], conns:["fw-sim","sim-tA","ai-fw"],
    hl:{sim:"Sim Target A",tgtA:"NanoKit Integrated ESP32",aiChat:"reply"},
    text:"NEW IN v4: UMT Simulator runs the firmware in a virtual environment BEFORE flashing real hardware.\n\nFor this build session (Target A locked = NanoKit Integrated ESP32):\n  ✨ UMT Simulator → activates 'Sim Target A: Dev Boards (virtual)' mode\n  ✨ Pick Target A → highlights NanoKit Integrated ESP32 specifically\n\nSimulator covers all 3 Target classes:\n  → Target A: virtual NanoKit ESP32 / Arduino / STM32 / Pico\n  → Target B: virtual UMT IC (MCU or SoC die)\n  → Target C: virtual NanoKit-iM with module selector\n\nDeveloper sees: GPIO toggles, serial output, timing — all simulated.\nIf bugs are caught here, they are fixed before touching hardware.\nAI Bashir narrates simulator output to the developer." },

  { title:"Step 14 — Flash to NanoKit (UMT SDK + AI Bashir)",
    blocks:["fwout","flash","tgtA","fw","aiChat"],
    conns:["fw-fl","fl-tA","ai-fw"],
    hl:{flash:"UART",tgtA:"NanoKit Integrated ESP32",aiChat:"reply"},
    text:"Firmware binary flows: Firmware Output → Flashing/Debug → Target A.\n\n  → UART (Serial) upload via USB cable to NanoKit board\n  → esptool writes .bin to ESP32 flash at 0x10000\n  → Board resets automatically after flash complete\n\nFlashing/Debug connects DIRECTLY to the Target hardware.\nAI Bashir confirms flash success to the developer." },

  { title:"Step 15 — Monitor Serial Output (UMT SDK + AI Bashir)",
    blocks:["tgtA","monitor","flash","fw","aiChat"], conns:["tA-mn","fl-mn","ai-fw"],
    hl:{monitor:"serial",tgtA:"NanoKit Integrated ESP32",aiChat:"reply"},
    text:"ESP32 boots and executes firmware. Serial output flows:\n  NanoKit ESP32 (Target A) → UART at 115200 baud → Monitor\n  Flashing/Debug → debug logs → Monitor\n\n✨ Pick Target A → highlights NanoKit Integrated ESP32 (the running board).\n\nMonitor displays:\n  • Serial console (text output)\n  • Serial plotter (real-time graphs)\n  • Log viewer with filtering\n  • Optional custom dashboard widgets\n\nAI Bashir alerts the developer when significant log events occur." },

  { title:"Step 16 — Command: A Genius Guides You (FINAL — Educational Walkthrough)",
    blocks:["user","fw","aiChat","cmdGen"], conns:["u-ai","fw-cmd","cmd-ai","ai-fw"],
    hl:{fw:"invoke guide",aiChat:"redirect",cmdGen:"guide"},
    text:"FINAL STEP — UMT SDK invokes the Command Genius (it reads main.umt from the Editor through SDK).\n\nAI Bashir tells the developer:\n  💬 \"Go to Command — A Genius Guides You for a step-by-step walkthrough\n      of your DC motor speed controller project: wiring diagram, algorithm,\n      flowchart, pseudocode, and the system architecture & dependency map\n      — all in UMT VR syntax. Use the [📦 MODULE ↔ ⚙ PRO] switch at the\n      top-right of the panel to choose how the hardware is wired.\"\n\nThe developer replies:\n  💬 \"I'm following the steps. I'll reach out if I need you.\"\n\nThe Command Genius panel opens (like cmd / output in VSCode &amp; Antigravity).\nIt reads the developer's main.umt code (UMT VR syntax — NOT Arduino/Espressif!) and walks through 5 sections.\n\n★ NEW IN v4.8 — DUAL WIRING MODE: a switch button at the top-right of the\n   panel lets the developer choose between two hardware styles. The .umt\n   source code is BIT-FOR-BIT IDENTICAL in both modes — only the physical\n   wiring after VR_PWM_OUT0 changes:\n\n  📦 MODULE MODE (quick prototyping — DEFAULT):\n     Uses ready-made peripheral driver boards plugged directly to the\n     NanoKit Integrated ESP32 — minimal soldering, ideal for beginners,\n     rapid prototyping, and education.\n     This project uses the L298N Driver Board Module for the 12V/1A motor.\n     Full peripheral module ecosystem categorized by function:\n        • Sensor Modules (temperature, humidity, accel, gas, light, …)\n        • Communication Modules (Wi-Fi, Bluetooth, LoRa, NRF24L01, RF, GSM)\n        • Motor Driver Modules (L298N, TB6612, DRV8825)\n        • Relay Modules (1ch, 2ch, 4ch, 8ch — opto-isolated)\n        • Display Modules (OLED, 16×2 LCD, TFT, e-Paper)\n        • Power Modules (buck/boost converters, LDO breakouts)\n        • Audio Modules (MAX98357, DFPlayer, I2S DAC)\n        • Storage Modules (microSD card breakout)\n        • Interface Modules (RS485, CAN Bus, USB-UART bridges)\n        • Positioning Modules (GPS, RTC)\n        • Identification Modules (RFID RC522, NFC)\n\n  ⚙ PRO MODE (production / PCB design):\n     Uses individual electronic components placed on a real PCB schematic,\n     exactly as a power-electronics engineer would design for production.\n     For this project, the L298N module is replaced by a discrete chain:\n        • PC817 optocoupler (SOP-4 SMD) — galvanic isolation 3V3 ↔ 12V\n        • IRLZ44N logic-level N-channel MOSFET (TO-220 THT — heatsink-able)\n        • SS34 Schottky flyback diode (SMC SMD) — back-EMF clamp\n        • Gate network: R3 10Ω series + R4 10kΩ pull-down (SMD)\n        • Opto LED current limit R1 220Ω + collector R2 4.7kΩ (SMD)\n        • Decoupling: C1 470µF/25V THT bulk + C2/C3/C4 100nF–10µF SMD\n        • Pot wiper filter C5 100nF SMD + encoder pull-up R5 10kΩ SMD\n     Default package: SMD (0805/1206/SOP/SMC) for compact PCB layout.\n     Exception: THT (TO-220, radial electrolytics) for parts that handle\n     high voltage, high current, or significant heat dissipation\n     (MOSFET, bulk capacitor, relay, screw terminals).\n     Full Bill of Materials shown in Section 1 of the Pro Mode guide.\n\nThe developer can switch between modes freely — the .umt code, the AIA\nEngine's generated C++, and all 4 software sections (Algorithm, Flowchart,\nPseudocode, Architecture Diagram) stay exactly the same. This is the\npower of Pure VR Source: choose your hardware path, the software is one.\n\nThe 5 sections rendered by the Command Genius:\n\n  1️⃣ HARDWARE WIRING — How to connect on NanoKit Integrated ESP32:\n     • MODULE mode: L298N driver board + pre-built LCD/encoder modules\n     • PRO mode: discrete optocoupler + MOSFET + flyback + caps + resistors\n\n  2️⃣ ALGORITHM (logical steps with VR names — NOT GPIOs!)\n  3️⃣ FLOWCHART (visual decision tree using VR interfaces)\n  4️⃣ PSEUDOCODE (plain English with UMT VR syntax)\n  5️⃣ ALGORITHM & SYSTEM ARCHITECTURE DIAGRAM & DEPENDENCY MAP\n     (Node-RED-style block visualization showing all 5 interfaces, functions,\n      inputs, outputs, component connections, and dependencies — plus a\n      latency budget for the real-time control loop and ISR)\n\nText typed character-by-character with realistic typing animation.\nWhen the developer toggles the MODULE ↔ PRO switch, the panel re-types\nthe new wiring instantly — same software, different hardware view.\n\nEverything in UMT VR language — NO Arduino, NO Espressif GPIO numbers.\n\nFlow: User ↔ AI Bashir ↔ UMT SDK → Command Genius → Developer goes solo\n\n✅ Full pipeline confirmed: User ↔ AI Bashir ↔ Editor ↔ UMT SDK (BASE) →\n   AIA Codegen → Build → Sim/Flash → Monitor → Genius Guide (MODULE | PRO)" },
];

/* ═══ GEOMETRY ═══ */
function anc(id, s) {
  const b = BL[id]; if (!b) return [0,0];
  const cx=b.x+b.w/2, cy=b.y+b.h/2;
  if(s==="t") return [cx,b.y]; if(s==="b") return [cx,b.y+b.h];
  if(s==="l") return [b.x,cy]; if(s==="r") return [b.x+b.w,cy];
  return [cx,cy];
}
function sides(a,b) {
  const fa=BL[a],fb=BL[b]; if(!fa||!fb) return["r","l"];
  const dx=(fb.x+fb.w/2)-(fa.x+fa.w/2), dy=(fb.y+fb.h/2)-(fa.y+fa.h/2);
  if(Math.abs(dx)>Math.abs(dy)*0.6) return dx>0?["r","l"]:["l","r"];
  return dy>0?["b","t"]:["t","b"];
}

/* ═══ ARROWS SVG ═══ */
function Arrows({act,dmo}) {
  return (
    <svg style={{position:"absolute",inset:0,width:W,height:H,pointerEvents:"none",zIndex:1}} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <marker id="mf" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto"><path d="M0,0L7,2.5L0,5Z" fill="#b45309" opacity=".7"/></marker>
        <marker id="mb" markerWidth="7" markerHeight="5" refX="1" refY="2.5" orient="auto"><path d="M7,0L0,2.5L7,5Z" fill="#b45309" opacity=".7"/></marker>
        <marker id="hf" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0L8,3L0,6Z" fill="#fbbf24"/></marker>
        <marker id="hb" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto"><path d="M8,0L0,3L8,6Z" fill="#fbbf24"/></marker>
        <marker id="df" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path d="M0,0L9,3.5L0,7Z" fill="#22c55e"/></marker>
        <marker id="db" markerWidth="9" markerHeight="7" refX="1" refY="3.5" orient="auto"><path d="M9,0L0,3.5L9,7Z" fill="#22c55e"/></marker>
      </defs>
      {CN.map(c => {
        const [fs,ts] = sides(c.f,c.t);
        const [fx,fy] = anc(c.f,fs), [tx,ty] = anc(c.t,ts);
        const hz = fs==="r"||fs==="l";
        const isD = dmo.includes(c.id), isA = !isD && act.includes(c.id);
        const col = isD?"#22c55e":isA?"#fbbf24":"#92400e";
        const op = isD?0.92:isA?0.82:0.22;
        const sw = isD?2.5:isA?2:1;
        const da = isD||isA?"none":"5,4";
        const ef = isD?"url(#df)":isA?"url(#hf)":"url(#mf)";
        const eb = isD?"url(#db)":isA?"url(#hb)":"url(#mb)";
        const o = 3;
        let p1,p2;
        if(hz){
          const cx1=fx+(tx-fx)*.35, cx2=tx-(tx-fx)*.35;
          p1=`M${fx},${fy-o}C${cx1},${fy-o} ${cx2},${ty-o} ${tx},${ty-o}`;
          p2=`M${tx},${ty+o}C${cx2},${ty+o} ${cx1},${fy+o} ${fx},${fy+o}`;
        } else {
          const cy1=fy+(ty-fy)*.35, cy2=ty-(ty-fy)*.35;
          p1=`M${fx-o},${fy}C${fx-o},${cy1} ${tx-o},${cy2} ${tx-o},${ty}`;
          p2=`M${tx+o},${ty}C${tx+o},${cy2} ${fx+o},${cy1} ${fx+o},${fy}`;
        }
        const mx=(fx+tx)/2, my=(fy+ty)/2;
        return (
          <g key={c.id}>
            <path d={p1} fill="none" stroke={col} strokeWidth={sw} opacity={op} markerEnd={ef} strokeDasharray={da}/>
            <path d={p2} fill="none" stroke={col} strokeWidth={sw} opacity={op} markerEnd={eb} strokeDasharray={da}/>
            {c.m && <>
              <circle cx={mx} cy={my} r={isD?12:isA?10:8} fill="#0c0a09" stroke={col} strokeWidth={isD?2:1} opacity={Math.max(op,0.5)}>
                {isD && <animate attributeName="r" values="12;15;12" dur="1.2s" repeatCount="indefinite"/>}
              </circle>
              <text x={mx} y={my+4} textAnchor="middle" fontSize={isD?12:9} fontWeight="800" fill={col} fontFamily="monospace">{c.m}</text>
            </>}
          </g>
        );
      })}
    </svg>
  );
}

/* ═══ BLOCK ═══ */
function Bk({id,color,grad,glow,children,isA,isD,dl,onClick,onE,onL,floatOver,dy}) {
  const [v,setV]=useState(false);
  const b=BL[id];
  useEffect(()=>{const t=setTimeout(()=>setV(true),(dl||0)*55);return()=>clearTimeout(t);},[dl]);
  if(!b) return null;
  // floatOver now JUST boosts z-index — no backdrop, no big ring — because the blocks below
  // (Frameworks & SDKs + Platforms) are physically pushed down via dy when the panel opens.
  const ring = floatOver?`0 0 0 1px ${color}66,0 12px 32px rgba(0,0,0,.55)`:isD?`0 0 0 3px ${color}55,0 0 35px ${color}35`:isA?`0 0 22px ${color}28`:glow?`0 0 10px ${color}12`:"0 2px 6px rgba(0,0,0,.3)";
  const topY = b.y + (dy||0);
  return (
    <div onClick={onClick} onMouseEnter={onE} onMouseLeave={onL} style={{
      position:"absolute",left:b.x,top:topY,width:b.w,minHeight:b.h,
      background:grad||"#1c1917",border:`1.5px solid ${floatOver?color:isD?color:isA?color:color+"38"}`,
      borderRadius:10,overflow:"hidden",zIndex:floatOver?80:2,cursor:onClick?"pointer":"default",
      transition:"box-shadow .35s ease, top .35s cubic-bezier(.22,1,.36,1), z-index 0s",boxShadow:ring,
      transform:v?(isD?"scale(1.03)":"scale(1)"):"scale(.9) translateY(8px)",opacity:v?1:0,
    }}>
      {isD && <div style={{position:"absolute",inset:0,background:`${color}06`,pointerEvents:"none",animation:"gp 1.5s ease-in-out infinite"}}/>}
      {children}
    </div>
  );
}

function Hd({icon,title,sub,color,sm}) {
  return (<div style={{padding:sm?"5px 10px":"7px 11px",background:`linear-gradient(135deg,${color}1a,${color}06)`,borderBottom:`1px solid ${color}22`}}>
    <div style={{fontFamily:"'Georgia',serif",fontSize:sm?10.5:12.5,fontWeight:700,color:"#fef3c7",display:"flex",alignItems:"center",gap:5}}>
      {icon&&<span style={{fontSize:sm?10:12}}>{icon}</span>}{title}
    </div>
    {sub&&<div style={{fontSize:8,color:`${color}99`,marginTop:1,fontFamily:"monospace"}}>{sub}</div>}
  </div>);
}

function It({t,s,bold,hl}) {
  return (<div style={{padding:"2px 10px",background:hl?"#0a1a0e":"transparent",borderLeft:hl?"3px solid #22c55e":"3px solid transparent",transition:"all .3s"}}>
    <div style={{fontSize:10,color:hl?"#22c55e":bold?"#d6d3d1":"#7a7570",fontWeight:bold?700:400,fontFamily:"monospace",lineHeight:1.35}}>{t}</div>
    {s&&<div style={{fontSize:8,color:hl?"#16a34a88":"#78716c"}}>{s}</div>}
  </div>);
}

/* ═══ TYPING ANIMATION HOOK ═══ */
function useTypewriter(target, active, speed=18, charsPerTick=1) {
  const [shown,setShown] = useState("");
  const idx = useRef(0);
  const tm = useRef(null);
  useEffect(()=>{
    if(!active){ setShown(""); idx.current=0; clearInterval(tm.current); return; }
    setShown("");
    idx.current=0;
    tm.current = setInterval(()=>{
      idx.current += charsPerTick;
      if(idx.current >= target.length){ idx.current = target.length; clearInterval(tm.current); }
      setShown(target.slice(0, idx.current));
    }, speed);
    return ()=>clearInterval(tm.current);
  },[target,active,speed,charsPerTick]);
  return shown;
}

/* ═══ SYNTAX HIGHLIGHT ═══ */
function highlight(code) {
  // Color tokens for UMT code
  const tokens = [];
  let i = 0;
  while (i < code.length) {
    // ★ // comments — green italic (#6a9955), run to end of line. Functional comments
    //   (what the call DOES) live on the SAME LINE as their code — Amine's locked style.
    if (code[i] === '/' && code[i+1] === '/') {
      let j = i;
      while (j < code.length && code[j] !== '\n') j++;
      tokens.push({t: code.slice(i, j), c:"#6a9955", it:true}); i = j; continue;
    }
    // VR_ identifiers (cyan)
    if (code.slice(i).match(/^VR_[A-Z0-9_]+/)) {
      const m = code.slice(i).match(/^VR_[A-Z0-9_]+/)[0];
      tokens.push({t:m, c:"#4fc1ff"}); i += m.length; continue;
    }
    // UMT.X (yellow)
    if (code.slice(i).match(/^UMT\.[A-Za-z_]+/)) {
      const m = code.slice(i).match(/^UMT\.[A-Za-z_]+/)[0];
      tokens.push({t:m, c:"#dcdcaa"}); i += m.length; continue;
    }
    // .method() (light blue)
    if (code.slice(i).match(/^\.[a-zA-Z_]+/)) {
      const m = code.slice(i).match(/^\.[a-zA-Z_]+/)[0];
      tokens.push({t:m, c:"#9cdcfe"}); i += m.length; continue;
    }
    // keywords
    if (code.slice(i).match(/^(void|if|setup|loop|HIGH|LOW|OUTPUT|INPUT_PULLUP|INPUT)\b/)) {
      const m = code.slice(i).match(/^(void|if|setup|loop|HIGH|LOW|OUTPUT|INPUT_PULLUP|INPUT)\b/)[0];
      tokens.push({t:m, c:"#569cd6"}); i += m.length; continue;
    }
    // numbers
    if (code.slice(i).match(/^\d+/)) {
      const m = code.slice(i).match(/^\d+/)[0];
      tokens.push({t:m, c:"#b5cea8"}); i += m.length; continue;
    }
    // strings
    if (code[i] === '"') {
      let j = i+1;
      while (j < code.length && code[j] !== '"') j++;
      const s = code.slice(i, j+1);
      tokens.push({t:s, c:"#ce9178"}); i = j+1; continue;
    }
    // include
    if (code.slice(i).match(/^#include\s*<[^>]+>/)) {
      const m = code.slice(i).match(/^#include\s*<[^>]+>/)[0];
      tokens.push({t:m, c:"#c586c0"}); i += m.length; continue;
    }
    tokens.push({t: code[i], c:"#d4d4d4"}); i++;
  }
  return tokens;
}

/* ═══ VR ROLE SWITCH translations — 8 languages. Technical terms stay English ═══ */
const VRRS_I18N = {
  en: {
    header: "Pin Dual-Role Switch — Interactive",
    intro: "Every pin in the UMT 16×16 BGA Hybrid MCU / SoC Package Substrate Standard has TWO roles. Click the switch to flip.",
    panelA: "Any VR_Interface (45 total)",
    panelB: "★ Special VR_GPIOxx (Row 0x8)",
    chipzone: "CHIPMAKER ZONE",
    role1_a: "ROLE 1 — activate()", role2_a: "ROLE 2 — deactivate()",
    role1_b: "ROLE 1 — deactivate()", role2_b: "ROLE 2 — activate()",
    digA: "GPIO acts as plain digital pin (LED, switch)",
    gpioDig: "Standard digital I/O — LED, switch, button, generic input/output",
    gpioCustom: "VR_NewInterface — custom protocol DEFINED & DEVELOPED by the chip manufacturer",
    chipNote_b: "Chipmaker Extension:", 
    chipNote: "Row 0x8 (16 pins: VR_GPIO00–VR_GPIO0F) is intentionally left open for manufacturers (Espressif, STM, NXP, Texas Instruments, Broadcom, NVIDIA, Qualcomm, Apple, Samsung, HiSilicon Kirin (Huawei)...) to build their own proprietary interfaces via activate(). This enables competition while preserving one unified BGA standard. Every other interface (rows 0x0–0x7, 0x9–0xF) follows the inverse default: activate() = its named protocol, deactivate() = digital.",
    mcuTitle: "Architecture-Specific Interfaces (very important):",
    mcuNote: "MCU architectures differ — some interfaces exist on one chip but not another. The AVR ATmega328P (8-bit) on NanoKit Integrated has peripherals the ESP32 (32-bit Xtensa LX6) lacks, and vice-versa. Because the unified NanoKit Integrated board has limited pins with no room left for every function, the developer CHOOSES which MCU to design their own NanoKit Integrated around, AND chooses which protocol/interface to use on each pin. Example — NanoKit Integrated ESP32 Pinout: pin 19 = BGA coord VR_0x82 = slot VR_GPIO2, and you may pick VR_ADC2_IN7 OR VR_RTC_IO17 OR VR_TOUCH7. Always prefix VR_ to the real interface name — because some developers need a peripheral that exists on THIS MCU but not another. This is exactly when VR_GPIO interface activate() is used: UMT.Interface(VR_GPIO2).bindTo(VR_TOUCH7); UMT.Interface(VR_TOUCH7).activate();",
    keyTitle: "Key — What the Terms Mean",
    proto: { VR_UART0:"UART — transmits/receives serial data", VR_SPI0:"SPI — master-out serial data line", VR_I2C0:"I2C — bidirectional data line", VR_PWM0:"PWM — generates duty-cycle signal", VR_DAC1:"DAC — outputs analog voltage", VR_ADC0:"ADC — reads analog voltage", VR_CAN0:"CAN — vehicle/industrial bus frame", VR_I2S0:"I2S — digital audio stream" },
    glossary: [
      ["VR_","Virtual Register — a logical pin/peripheral name resolved by AIA to a physical GPIO"],
      ["UMT","Unified Microchip Technology — one code for any MCU or SoC"],
      ["AIA","Abstraction Intelligence Algorithm Engine — resolves VR names to real hardware"],
      ["BGA","Ball Grid Array — the 16×16 package substrate (256 balls)"],
      ["MCU","Microcontroller — e.g. ESP32, STM32, RP2040"],
      ["SoC","System-on-Chip Processor — e.g. Snapdragon, Apple A, Exynos"],
      ["GPIO","General-Purpose Input/Output — a raw digital pin"],
      ["VR_GPIOxx","Special Row 0x8 — 16 chipmaker-extensible pins"],
      ["activate()","Turns the VR into its Interface role (protocol active)"],
      ["deactivate()","Turns the VR into its Digital role (LED/switch)"],
      ["bindTo()","Links a VR_GPIOxx pin to a real/custom interface before activate()"],
      ["VR_NewInterface","A custom protocol a chipmaker builds on VR_GPIOxx"],
      ["Package Substrate","The layer the silicon die sits on — UMT's innovation frontier"],
      ["AI Bashir","Integrated AI assistant of Pro_AmineUMT IDE — writes UMT VR code, explains concepts, refines prompts, monitors Build/Debug/Runtime, and generates project knowledge"],
      [".CmdGenius","Project Intelligence Workspace — hidden AI-managed folder unifying Terminal/Build/Debug/Output with 10 auto-generated guide files (Hardware Wiring, Algorithm, Flowchart, Pseudocode, Architecture Map, IoT Guide, API Ref, Testing, Performance, Debug)"],
    ],
  },
  ar: {
    header: "مفتاح الدور المزدوج للـ Pin — تفاعلي",
    intro: "كل pin في معيار UMT 16×16 BGA Hybrid MCU / SoC Package Substrate له دوران. اضغط المفتاح للتبديل.",
    panelA: "أي VR_Interface (45 إجمالاً)",
    panelB: "★ VR_GPIOxx الخاص (الصف 0x8)",
    chipzone: "منطقة صانع الـ CHIP",
    role1_a: "الدور 1 — activate()", role2_a: "الدور 2 — deactivate()",
    role1_b: "الدور 1 — deactivate()", role2_b: "الدور 2 — activate()",
    digA: "الـ GPIO يعمل كـ pin رقمي عادي (LED، مفتاح)",
    gpioDig: "I/O رقمي قياسي — LED، مفتاح، زر، input/output عام",
    gpioCustom: "VR_NewInterface — بروتوكول مخصّص يُعرّفه ويُطوّره صانع الـ chip",
    chipNote_b: "توسعة صانع الـ Chip:",
    chipNote: "الصف 0x8 (16 pin: VR_GPIO00–VR_GPIO0F) مفتوح عمداً للمصنّعين (Espressif، STM، NXP، Texas Instruments، Broadcom، NVIDIA، Qualcomm، Apple، Samsung، HiSilicon Kirin (Huawei)...) لبناء interfaces خاصة بهم عبر activate(). هذا يُمكّن المنافسة مع الحفاظ على معيار BGA موحّد واحد. كل interface آخر (الصفوف 0x0–0x7، 0x9–0xF) يتبع الافتراضي العكسي: activate() = البروتوكول المُسمّى، deactivate() = رقمي.",
    mcuTitle: "واجهات خاصة بالمعمارية (مهم جداً):",
    mcuNote: "تختلف معماريات المتحكمات — بعض الواجهات توجد في chip ولا توجد في آخر. الـ AVR ATmega328P (8-bit) على NanoKit Integrated له peripherals لا يملكها ESP32 (32-bit Xtensa LX6) والعكس. ولأن لوحة NanoKit Integrated الموحّدة محدودة الـ pins ولا يوجد فراغ لكل الوظائف، يختار المطوّر أي MCU يصمّم عليه NanoKit Integrated الخاص به، ويختار أي protocol/interface يستخدمه على كل pin. مثال — Pinout NanoKit Integrated ESP32: pin 19 = إحداثية BGA VR_0x82 = خانة VR_GPIO2، ويمكنك اختيار VR_ADC2_IN7 أو VR_RTC_IO17 أو VR_TOUCH7. دائماً أضف بادئة VR_ لاسم الواجهة الحقيقية — لأن بعض المطورين يحتاجون peripheral موجود في هذا الـ MCU دون آخر. هذا بالضبط متى يُستخدم VR_GPIO interface activate(): UMT.Interface(VR_GPIO2).bindTo(VR_TOUCH7); UMT.Interface(VR_TOUCH7).activate();",
    keyTitle: "المفتاح — معاني المصطلحات",
    proto: { VR_UART0:"UART — يُرسل/يستقبل بيانات تسلسلية", VR_SPI0:"SPI — خط بيانات master-out", VR_I2C0:"I2C — خط بيانات ثنائي الاتجاه", VR_PWM0:"PWM — يولّد إشارة duty-cycle", VR_DAC1:"DAC — يُخرج جهداً تناظرياً", VR_ADC0:"ADC — يقرأ جهداً تناظرياً", VR_CAN0:"CAN — إطار bus للمركبات/الصناعة", VR_I2S0:"I2S — تدفق صوتي رقمي" },
    glossary: [
      ["VR_","Virtual Register — اسم منطقي لـ pin/peripheral يحلّه AIA إلى GPIO فعلي"],
      ["UMT","Unified Microchip Technology — كود واحد لأي MCU أو SoC"],
      ["AIA","Abstraction Intelligence Algorithm Engine — يحلّ أسماء VR إلى hardware فعلي"],
      ["BGA","Ball Grid Array — الـ package substrate 16×16 (256 ball)"],
      ["MCU","Microcontroller — مثل ESP32، STM32، RP2040"],
      ["SoC","System-on-Chip Processor — مثل Snapdragon، Apple A، Exynos"],
      ["GPIO","General-Purpose Input/Output — pin رقمي خام"],
      ["VR_GPIOxx","الصف الخاص 0x8 — 16 pin قابلة للتوسعة من صانع الـ chip"],
      ["activate()","يحوّل الـ VR إلى دور Interface (البروتوكول نشط)"],
      ["deactivate()","يحوّل الـ VR إلى دور Digital (LED/مفتاح)"],
      ["bindTo()","يربط pin من VR_GPIOxx بواجهة حقيقية/مخصّصة قبل activate()"],
      ["VR_NewInterface","بروتوكول مخصّص يبنيه صانع الـ chip على VR_GPIOxx"],
      ["Package Substrate","الطبقة التي يجلس عليها الـ silicon die — حدود ابتكار UMT"],
      ["AI Bashir","المساعد الذكي المدمج في Pro_AmineUMT IDE — يكتب كود UMT VR، يشرح المفاهيم، يُحسّن الـ prompts، يراقب Build/Debug/Runtime، ويُولّد معرفة المشروع"],
      [".CmdGenius","مساحة عمل ذكاء المشروع — مجلد مخفي يُديره AI Bashir تلقائياً، يوحّد Terminal/Build/Debug/Output مع 10 ملفات دليل مولّدة تلقائياً (Hardware Wiring، Algorithm، Flowchart، Pseudocode، Architecture Map، IoT Guide، API Ref، Testing، Performance، Debug)"],
    ],
  },
  ru: {
    header: "Переключатель двойной роли Pin — Интерактивно",
    intro: "Каждый pin в стандарте UMT 16×16 BGA Hybrid MCU / SoC Package Substrate имеет ДВЕ роли. Нажмите переключатель.",
    panelA: "Любой VR_Interface (всего 45)",
    panelB: "★ Специальный VR_GPIOxx (Ряд 0x8)",
    chipzone: "ЗОНА ПРОИЗВОДИТЕЛЯ",
    role1_a: "РОЛЬ 1 — activate()", role2_a: "РОЛЬ 2 — deactivate()",
    role1_b: "РОЛЬ 1 — deactivate()", role2_b: "РОЛЬ 2 — activate()",
    digA: "GPIO работает как обычный цифровой pin (LED, переключатель)",
    gpioDig: "Стандартный цифровой I/O — LED, переключатель, кнопка, обычный input/output",
    gpioCustom: "VR_NewInterface — пользовательский protocol, ОПРЕДЕЛЁННЫЙ и РАЗРАБОТАННЫЙ производителем chip",
    chipNote_b: "Расширение производителя:",
    chipNote: "Ряд 0x8 (16 pins: VR_GPIO00–VR_GPIO0F) намеренно оставлен открытым для производителей (Espressif, STM, NXP, Texas Instruments, Broadcom, NVIDIA, Qualcomm, Apple, Samsung, HiSilicon Kirin (Huawei)...) для создания собственных интерфейсов через activate(). Это обеспечивает конкуренцию при сохранении единого стандарта BGA. Все остальные интерфейсы (ряды 0x0–0x7, 0x9–0xF) следуют обратному правилу: activate() = его protocol, deactivate() = цифровой.",
    mcuTitle: "Интерфейсы, зависящие от архитектуры (очень важно):",
    mcuNote: "Архитектуры MCU различаются — некоторые интерфейсы есть на одном chip, но нет на другом. AVR ATmega328P (8-bit) на NanoKit Integrated имеет периферию, которой нет у ESP32 (32-bit Xtensa LX6), и наоборот. Поскольку единая плата NanoKit Integrated имеет ограниченные pins без места для всех функций, разработчик ВЫБИРАЕТ, на каком MCU строить свой NanoKit Integrated, и какой protocol/interface использовать на каждом pin. Пример — Pinout NanoKit Integrated ESP32: pin 19 = координата BGA VR_0x82 = слот VR_GPIO2, можно выбрать VR_ADC2_IN7 ИЛИ VR_RTC_IO17 ИЛИ VR_TOUCH7. Всегда добавляйте префикс VR_ к реальному имени интерфейса. Именно тогда используется VR_GPIO interface activate(): UMT.Interface(VR_GPIO2).bindTo(VR_TOUCH7); UMT.Interface(VR_TOUCH7).activate();",
    keyTitle: "Ключ — Значение терминов",
    proto: { VR_UART0:"UART — передаёт/принимает последовательные данные", VR_SPI0:"SPI — линия данных master-out", VR_I2C0:"I2C — двунаправленная линия данных", VR_PWM0:"PWM — генерирует сигнал duty-cycle", VR_DAC1:"DAC — выводит аналоговое напряжение", VR_ADC0:"ADC — читает аналоговое напряжение", VR_CAN0:"CAN — кадр шины транспорта/промышленности", VR_I2S0:"I2S — цифровой аудиопоток" },
    glossary: [
      ["VR_","Virtual Register — логическое имя pin/периферии, разрешаемое AIA в физический GPIO"],
      ["UMT","Unified Microchip Technology — один код для любого MCU или SoC"],
      ["AIA","Abstraction Intelligence Algorithm Engine — разрешает имена VR в реальное железо"],
      ["BGA","Ball Grid Array — package substrate 16×16 (256 balls)"],
      ["MCU","Microcontroller — напр. ESP32, STM32, RP2040"],
      ["SoC","System-on-Chip Processor — напр. Snapdragon, Apple A, Exynos"],
      ["GPIO","General-Purpose Input/Output — обычный цифровой pin"],
      ["VR_GPIOxx","Специальный Ряд 0x8 — 16 расширяемых производителем pins"],
      ["activate()","Переводит VR в роль Interface (protocol активен)"],
      ["deactivate()","Переводит VR в роль Digital (LED/переключатель)"],
      ["bindTo()","Связывает pin VR_GPIOxx с реальным/пользовательским интерфейсом перед activate()"],
      ["VR_NewInterface","Пользовательский protocol, создаваемый производителем на VR_GPIOxx"],
      ["Package Substrate","Слой, на котором сидит silicon die — граница инноваций UMT"],
      ["AI Bashir","Встроенный AI-ассистент Pro_AmineUMT IDE — пишет код UMT VR, объясняет концепции, уточняет промпты, отслеживает Build/Debug/Runtime и генерирует знания о проекте"],
      [".CmdGenius","Project Intelligence Workspace — скрытая папка, управляемая AI Bashir; объединяет Terminal/Build/Debug/Output с 10 автоматически создаваемыми файлами руководств (Hardware Wiring, Algorithm, Flowchart, Pseudocode, Architecture Map, IoT Guide, API Ref, Testing, Performance, Debug)"],
    ],
  },
  hi: {
    header: "Pin दोहरी-भूमिका स्विच — इंटरैक्टिव",
    intro: "UMT 16×16 BGA Hybrid MCU / SoC Package Substrate Standard में हर pin की दो भूमिकाएँ हैं। स्विच पर क्लिक करें।",
    panelA: "कोई भी VR_Interface (कुल 45)",
    panelB: "★ विशेष VR_GPIOxx (Row 0x8)",
    chipzone: "CHIPMAKER क्षेत्र",
    role1_a: "भूमिका 1 — activate()", role2_a: "भूमिका 2 — deactivate()",
    role1_b: "भूमिका 1 — deactivate()", role2_b: "भूमिका 2 — activate()",
    digA: "GPIO सामान्य digital pin के रूप में काम करता है (LED, switch)",
    gpioDig: "मानक digital I/O — LED, switch, button, सामान्य input/output",
    gpioCustom: "VR_NewInterface — custom protocol जो chip निर्माता द्वारा परिभाषित और विकसित किया गया",
    chipNote_b: "Chipmaker विस्तार:",
    chipNote: "Row 0x8 (16 pins: VR_GPIO00–VR_GPIO0F) जानबूझकर निर्माताओं (Espressif, STM, NXP, Texas Instruments, Broadcom, NVIDIA, Qualcomm, Apple, Samsung, HiSilicon Kirin (Huawei)...) के लिए खुला छोड़ा गया है ताकि वे activate() के माध्यम से अपने स्वयं के interfaces बना सकें। यह एकीकृत BGA standard को बनाए रखते हुए प्रतिस्पर्धा सक्षम करता है। हर दूसरा interface (rows 0x0–0x7, 0x9–0xF) उल्टे default का पालन करता है: activate() = इसका protocol, deactivate() = digital।",
    mcuTitle: "आर्किटेक्चर-विशिष्ट interfaces (बहुत महत्वपूर्ण):",
    mcuNote: "MCU आर्किटेक्चर भिन्न होते हैं — कुछ interfaces एक chip पर मौजूद हैं लेकिन दूसरे पर नहीं। NanoKit Integrated पर AVR ATmega328P (8-bit) में ऐसे peripherals हैं जो ESP32 (32-bit Xtensa LX6) में नहीं हैं, और इसके विपरीत। चूंकि एकीकृत NanoKit Integrated बोर्ड में सीमित pins हैं और हर function के लिए जगह नहीं है, developer चुनता है कि किस MCU पर अपना NanoKit Integrated डिज़ाइन करना है, और हर pin पर कौन सा protocol/interface उपयोग करना है। उदाहरण — NanoKit Integrated ESP32 Pinout: pin 19 = BGA निर्देशांक VR_0x82 = slot VR_GPIO2, और आप VR_ADC2_IN7 या VR_RTC_IO17 या VR_TOUCH7 चुन सकते हैं। हमेशा वास्तविक interface नाम में VR_ उपसर्ग जोड़ें। यही वह समय है जब VR_GPIO interface activate() उपयोग होता है: UMT.Interface(VR_GPIO2).bindTo(VR_TOUCH7); UMT.Interface(VR_TOUCH7).activate();",
    keyTitle: "कुंजी — शब्दों का अर्थ",
    proto: { VR_UART0:"UART — serial data भेजता/प्राप्त करता है", VR_SPI0:"SPI — master-out serial data लाइन", VR_I2C0:"I2C — द्विदिश data लाइन", VR_PWM0:"PWM — duty-cycle signal उत्पन्न करता है", VR_DAC1:"DAC — analog voltage आउटपुट करता है", VR_ADC0:"ADC — analog voltage पढ़ता है", VR_CAN0:"CAN — वाहन/औद्योगिक bus frame", VR_I2S0:"I2S — digital audio stream" },
    glossary: [
      ["VR_","Virtual Register — एक logical pin/peripheral नाम जिसे AIA भौतिक GPIO में हल करता है"],
      ["UMT","Unified Microchip Technology — किसी भी MCU या SoC के लिए एक code"],
      ["AIA","Abstraction Intelligence Algorithm Engine — VR नामों को वास्तविक hardware में हल करता है"],
      ["BGA","Ball Grid Array — 16×16 package substrate (256 balls)"],
      ["MCU","Microcontroller — जैसे ESP32, STM32, RP2040"],
      ["SoC","System-on-Chip Processor — जैसे Snapdragon, Apple A, Exynos"],
      ["GPIO","General-Purpose Input/Output — एक raw digital pin"],
      ["VR_GPIOxx","विशेष Row 0x8 — 16 chipmaker-विस्तार्य pins"],
      ["activate()","VR को इसकी Interface भूमिका में बदलता है (protocol सक्रिय)"],
      ["deactivate()","VR को इसकी Digital भूमिका में बदलता है (LED/switch)"],
      ["bindTo()","activate() से पहले VR_GPIOxx pin को वास्तविक/custom interface से जोड़ता है"],
      ["VR_NewInterface","एक custom protocol जो chipmaker VR_GPIOxx पर बनाता है"],
      ["Package Substrate","वह परत जिस पर silicon die बैठता है — UMT की नवाचार सीमा"],
      ["AI Bashir","Pro_AmineUMT IDE का एकीकृत AI सहायक — UMT VR कोड लिखता है, अवधारणाएँ समझाता है, prompts को परिष्कृत करता है, Build/Debug/Runtime की निगरानी करता है, और प्रोजेक्ट ज्ञान उत्पन्न करता है"],
      [".CmdGenius","Project Intelligence Workspace — AI Bashir द्वारा प्रबंधित छिपा हुआ फ़ोल्डर; Terminal/Build/Debug/Output को 10 स्वचालित-निर्मित गाइड फ़ाइलों के साथ एकीकृत करता है (Hardware Wiring, Algorithm, Flowchart, Pseudocode, Architecture Map, IoT Guide, API Ref, Testing, Performance, Debug)"],
    ],
  },
  es: {
    header: "Interruptor de Doble Rol del Pin — Interactivo",
    intro: "Cada pin en el estándar UMT 16×16 BGA Hybrid MCU / SoC Package Substrate tiene DOS roles. Haz clic en el interruptor.",
    panelA: "Cualquier VR_Interface (45 total)",
    panelB: "★ VR_GPIOxx Especial (Fila 0x8)",
    chipzone: "ZONA DEL FABRICANTE",
    role1_a: "ROL 1 — activate()", role2_a: "ROL 2 — deactivate()",
    role1_b: "ROL 1 — deactivate()", role2_b: "ROL 2 — activate()",
    digA: "GPIO funciona como pin digital simple (LED, switch)",
    gpioDig: "I/O digital estándar — LED, switch, button, input/output genérico",
    gpioCustom: "VR_NewInterface — protocol personalizado DEFINIDO y DESARROLLADO por el fabricante del chip",
    chipNote_b: "Extensión del Fabricante:",
    chipNote: "La fila 0x8 (16 pins: VR_GPIO00–VR_GPIO0F) se deja intencionalmente abierta para que los fabricantes (Espressif, STM, NXP, Texas Instruments, Broadcom, NVIDIA, Qualcomm, Apple, Samsung, HiSilicon Kirin (Huawei)...) construyan sus propias interfaces vía activate(). Esto permite competencia preservando un estándar BGA unificado. Toda otra interface (filas 0x0–0x7, 0x9–0xF) sigue el default inverso: activate() = su protocol, deactivate() = digital.",
    mcuTitle: "Interfaces específicas de la arquitectura (muy importante):",
    mcuNote: "Las arquitecturas MCU difieren — algunas interfaces existen en un chip pero no en otro. El AVR ATmega328P (8-bit) en NanoKit Integrated tiene peripherals que el ESP32 (32-bit Xtensa LX6) no tiene, y viceversa. Como la placa unificada NanoKit Integrated tiene pins limitados sin espacio para cada función, el developer ELIGE en qué MCU diseñar su propio NanoKit Integrated, y qué protocol/interface usar en cada pin. Ejemplo — Pinout NanoKit Integrated ESP32: pin 19 = coord BGA VR_0x82 = slot VR_GPIO2, y puedes elegir VR_ADC2_IN7 O VR_RTC_IO17 O VR_TOUCH7. Siempre agrega el prefijo VR_ al nombre real de la interface. Justo entonces se usa VR_GPIO interface activate(): UMT.Interface(VR_GPIO2).bindTo(VR_TOUCH7); UMT.Interface(VR_TOUCH7).activate();",
    keyTitle: "Clave — Qué Significan los Términos",
    proto: { VR_UART0:"UART — transmite/recibe datos serie", VR_SPI0:"SPI — línea de datos master-out", VR_I2C0:"I2C — línea de datos bidireccional", VR_PWM0:"PWM — genera señal de duty-cycle", VR_DAC1:"DAC — emite voltaje analógico", VR_ADC0:"ADC — lee voltaje analógico", VR_CAN0:"CAN — trama de bus vehicular/industrial", VR_I2S0:"I2S — flujo de audio digital" },
    glossary: [
      ["VR_","Virtual Register — un nombre lógico de pin/periférico resuelto por AIA a un GPIO físico"],
      ["UMT","Unified Microchip Technology — un código para cualquier MCU o SoC"],
      ["AIA","Abstraction Intelligence Algorithm Engine — resuelve nombres VR a hardware real"],
      ["BGA","Ball Grid Array — el package substrate 16×16 (256 balls)"],
      ["MCU","Microcontroller — p.ej. ESP32, STM32, RP2040"],
      ["SoC","System-on-Chip Processor — p.ej. Snapdragon, Apple A, Exynos"],
      ["GPIO","General-Purpose Input/Output — un pin digital crudo"],
      ["VR_GPIOxx","Fila Especial 0x8 — 16 pins extensibles por el fabricante"],
      ["activate()","Convierte el VR en su rol Interface (protocol activo)"],
      ["deactivate()","Convierte el VR en su rol Digital (LED/switch)"],
      ["bindTo()","Vincula un pin VR_GPIOxx a una interface real/personalizada antes de activate()"],
      ["VR_NewInterface","Un protocol personalizado que un fabricante construye en VR_GPIOxx"],
      ["Package Substrate","La capa donde se asienta el silicon die — la frontera de innovación de UMT"],
      ["AI Bashir","Asistente IA integrado de Pro_AmineUMT IDE — escribe código UMT VR, explica conceptos, refina prompts, monitoriza Build/Debug/Runtime y genera conocimiento del proyecto"],
      [".CmdGenius","Project Intelligence Workspace — carpeta oculta gestionada por AI Bashir; unifica Terminal/Build/Debug/Output con 10 archivos guía auto-generados (Hardware Wiring, Algorithm, Flowchart, Pseudocode, Architecture Map, IoT Guide, API Ref, Testing, Performance, Debug)"],
    ],
  },
  de: {
    header: "Pin-Doppelrollen-Schalter — Interaktiv",
    intro: "Jeder Pin im UMT 16×16 BGA Hybrid MCU / SoC Package Substrate Standard hat ZWEI Rollen. Klicken Sie auf den Schalter.",
    panelA: "Beliebige VR_Interface (45 gesamt)",
    panelB: "★ Spezielle VR_GPIOxx (Reihe 0x8)",
    chipzone: "HERSTELLER-ZONE",
    role1_a: "ROLLE 1 — activate()", role2_a: "ROLLE 2 — deactivate()",
    role1_b: "ROLLE 1 — deactivate()", role2_b: "ROLLE 2 — activate()",
    digA: "GPIO arbeitet als einfacher digitaler Pin (LED, Schalter)",
    gpioDig: "Standard digitales I/O — LED, Schalter, Taste, generisches input/output",
    gpioCustom: "VR_NewInterface — benutzerdefiniertes protocol DEFINIERT & ENTWICKELT vom Chiphersteller",
    chipNote_b: "Hersteller-Erweiterung:",
    chipNote: "Reihe 0x8 (16 pins: VR_GPIO00–VR_GPIO0F) wird absichtlich für Hersteller (Espressif, STM, NXP, Texas Instruments, Broadcom, NVIDIA, Qualcomm, Apple, Samsung, HiSilicon Kirin (Huawei)...) offen gelassen, um eigene Interfaces über activate() zu bauen. Dies ermöglicht Wettbewerb bei einheitlichem BGA-Standard. Jede andere Interface (Reihen 0x0–0x7, 0x9–0xF) folgt dem inversen Default: activate() = ihr protocol, deactivate() = digital.",
    mcuTitle: "Architekturspezifische Interfaces (sehr wichtig):",
    mcuNote: "MCU-Architekturen unterscheiden sich — manche Interfaces existieren auf einem Chip, aber nicht auf einem anderen. Der AVR ATmega328P (8-bit) auf NanoKit Integrated hat Peripherals, die dem ESP32 (32-bit Xtensa LX6) fehlen, und umgekehrt. Da das einheitliche NanoKit Integrated Board begrenzte Pins ohne Platz für jede Funktion hat, WÄHLT der Entwickler, auf welchem MCU er sein eigenes NanoKit Integrated baut, und welches protocol/interface er an jedem Pin nutzt. Beispiel — NanoKit Integrated ESP32 Pinout: Pin 19 = BGA-Koord VR_0x82 = Slot VR_GPIO2, und Sie können VR_ADC2_IN7 ODER VR_RTC_IO17 ODER VR_TOUCH7 wählen. Stellen Sie dem echten Interface-Namen immer VR_ voran. Genau dann wird VR_GPIO interface activate() verwendet: UMT.Interface(VR_GPIO2).bindTo(VR_TOUCH7); UMT.Interface(VR_TOUCH7).activate();",
    keyTitle: "Schlüssel — Was die Begriffe bedeuten",
    proto: { VR_UART0:"UART — sendet/empfängt serielle Daten", VR_SPI0:"SPI — Master-Out-Datenleitung", VR_I2C0:"I2C — bidirektionale Datenleitung", VR_PWM0:"PWM — erzeugt Duty-Cycle-Signal", VR_DAC1:"DAC — gibt analoge Spannung aus", VR_ADC0:"ADC — liest analoge Spannung", VR_CAN0:"CAN — Fahrzeug-/Industrie-Bus-Frame", VR_I2S0:"I2S — digitaler Audiostream" },
    glossary: [
      ["VR_","Virtual Register — ein logischer Pin-/Peripherie-Name, von AIA zu einem physischen GPIO aufgelöst"],
      ["UMT","Unified Microchip Technology — ein Code für jeden MCU oder SoC"],
      ["AIA","Abstraction Intelligence Algorithm Engine — löst VR-Namen zu echter Hardware auf"],
      ["BGA","Ball Grid Array — das 16×16 package substrate (256 balls)"],
      ["MCU","Microcontroller — z.B. ESP32, STM32, RP2040"],
      ["SoC","System-on-Chip Processor — z.B. Snapdragon, Apple A, Exynos"],
      ["GPIO","General-Purpose Input/Output — ein roher digitaler Pin"],
      ["VR_GPIOxx","Spezielle Reihe 0x8 — 16 herstellererweiterbare Pins"],
      ["activate()","Versetzt den VR in seine Interface-Rolle (protocol aktiv)"],
      ["deactivate()","Versetzt den VR in seine Digital-Rolle (LED/Schalter)"],
      ["bindTo()","Verknüpft einen VR_GPIOxx-Pin mit einer echten/eigenen Interface vor activate()"],
      ["VR_NewInterface","Ein benutzerdefiniertes protocol, das ein Hersteller auf VR_GPIOxx baut"],
      ["Package Substrate","Die Schicht, auf der das silicon die sitzt — UMTs Innovationsgrenze"],
      ["AI Bashir","Integrierter KI-Assistent von Pro_AmineUMT IDE — schreibt UMT-VR-Code, erklärt Konzepte, verfeinert Prompts, überwacht Build/Debug/Runtime und generiert Projektwissen"],
      [".CmdGenius","Project Intelligence Workspace — versteckter, von AI Bashir verwalteter Ordner; vereint Terminal/Build/Debug/Output mit 10 automatisch generierten Anleitungsdateien (Hardware Wiring, Algorithm, Flowchart, Pseudocode, Architecture Map, IoT Guide, API Ref, Testing, Performance, Debug)"],
    ],
  },
  zh: {
    header: "Pin 双角色开关 — 互动",
    intro: "UMT 16×16 BGA Hybrid MCU / SoC Package Substrate 标准中的每个 pin 都有两个角色。点击开关切换。",
    panelA: "任何 VR_Interface（共 45 个）",
    panelB: "★ 特殊 VR_GPIOxx（第 0x8 行）",
    chipzone: "芯片制造商专区",
    role1_a: "角色 1 — activate()", role2_a: "角色 2 — deactivate()",
    role1_b: "角色 1 — deactivate()", role2_b: "角色 2 — activate()",
    digA: "GPIO 作为普通数字 pin 工作（LED、开关）",
    gpioDig: "标准数字 I/O — LED、开关、按钮、通用 input/output",
    gpioCustom: "VR_NewInterface — 由芯片制造商定义和开发的自定义 protocol",
    chipNote_b: "芯片制造商扩展：",
    chipNote: "第 0x8 行（16 个 pins：VR_GPIO00–VR_GPIO0F）特意为制造商（Espressif、STM、NXP、Texas Instruments、Broadcom、NVIDIA、Qualcomm、Apple、Samsung、HiSilicon Kirin (Huawei)...）开放，以通过 activate() 构建自己的专有 interfaces。这在保持统一 BGA 标准的同时实现竞争。所有其他 interface（行 0x0–0x7、0x9–0xF）遵循相反的默认：activate() = 其 protocol，deactivate() = 数字。",
    mcuTitle: "架构特定 interfaces（非常重要）：",
    mcuNote: "MCU 架构各不相同 — 某些 interfaces 存在于一个 chip 而非另一个。NanoKit Integrated 上的 AVR ATmega328P（8-bit）拥有 ESP32（32-bit Xtensa LX6）所缺少的 peripherals，反之亦然。由于统一的 NanoKit Integrated 板 pins 有限且没有为每个功能留出空间，开发者选择在哪个 MCU 上设计自己的 NanoKit Integrated，并选择在每个 pin 上使用哪个 protocol/interface。示例 — NanoKit Integrated ESP32 Pinout：pin 19 = BGA 坐标 VR_0x82 = 槽位 VR_GPIO2，你可以选择 VR_ADC2_IN7 或 VR_RTC_IO17 或 VR_TOUCH7。始终在真实 interface 名称前加 VR_ 前缀。这正是使用 VR_GPIO interface activate() 的时候：UMT.Interface(VR_GPIO2).bindTo(VR_TOUCH7); UMT.Interface(VR_TOUCH7).activate();",
    keyTitle: "关键 — 术语含义",
    proto: { VR_UART0:"UART — 发送/接收串行数据", VR_SPI0:"SPI — master-out 串行数据线", VR_I2C0:"I2C — 双向数据线", VR_PWM0:"PWM — 生成占空比信号", VR_DAC1:"DAC — 输出模拟电压", VR_ADC0:"ADC — 读取模拟电压", VR_CAN0:"CAN — 车辆/工业总线帧", VR_I2S0:"I2S — 数字音频流" },
    glossary: [
      ["VR_","Virtual Register — 由 AIA 解析为物理 GPIO 的逻辑 pin/外设名称"],
      ["UMT","Unified Microchip Technology — 适用于任何 MCU 或 SoC 的一套代码"],
      ["AIA","Abstraction Intelligence Algorithm Engine — 将 VR 名称解析为真实硬件"],
      ["BGA","Ball Grid Array — 16×16 package substrate（256 个 balls）"],
      ["MCU","Microcontroller — 例如 ESP32、STM32、RP2040"],
      ["SoC","System-on-Chip Processor — 例如 Snapdragon、Apple A、Exynos"],
      ["GPIO","General-Purpose Input/Output — 原始数字 pin"],
      ["VR_GPIOxx","特殊第 0x8 行 — 16 个芯片制造商可扩展 pins"],
      ["activate()","将 VR 转为其 Interface 角色（protocol 激活）"],
      ["deactivate()","将 VR 转为其 Digital 角色（LED/开关）"],
      ["bindTo()","在 activate() 之前将 VR_GPIOxx pin 链接到真实/自定义 interface"],
      ["VR_NewInterface","芯片制造商在 VR_GPIOxx 上构建的自定义 protocol"],
      ["Package Substrate","silicon die 所在的层 — UMT 的创新前沿"],
      ["AI Bashir","Pro_AmineUMT IDE 集成的 AI 助手 — 编写 UMT VR 代码、解释概念、优化 prompts、监控 Build/Debug/Runtime 并生成项目知识"],
      [".CmdGenius","项目智能工作区 — 由 AI Bashir 管理的隐藏文件夹;统一 Terminal/Build/Debug/Output 与 10 个自动生成的指南文件 (Hardware Wiring, Algorithm, Flowchart, Pseudocode, Architecture Map, IoT Guide, API Ref, Testing, Performance, Debug)"],
    ],
  },
  ja: {
    header: "Pin デュアルロールスイッチ — インタラクティブ",
    intro: "UMT 16×16 BGA Hybrid MCU / SoC Package Substrate 標準のすべての pin には 2 つの役割があります。スイッチをクリック。",
    panelA: "任意の VR_Interface（合計 45）",
    panelB: "★ 特殊 VR_GPIOxx（行 0x8）",
    chipzone: "チップメーカーゾーン",
    role1_a: "役割 1 — activate()", role2_a: "役割 2 — deactivate()",
    role1_b: "役割 1 — deactivate()", role2_b: "役割 2 — activate()",
    digA: "GPIO は単純なデジタル pin として動作（LED、スイッチ）",
    gpioDig: "標準デジタル I/O — LED、スイッチ、ボタン、汎用 input/output",
    gpioCustom: "VR_NewInterface — チップメーカーが定義・開発したカスタム protocol",
    chipNote_b: "チップメーカー拡張：",
    chipNote: "行 0x8（16 個の pins：VR_GPIO00–VR_GPIO0F）は、メーカー（Espressif、STM、NXP、Texas Instruments、Broadcom、NVIDIA、Qualcomm、Apple、Samsung、HiSilicon Kirin (Huawei)...）が activate() を介して独自の interfaces を構築できるよう意図的に開放されています。これは統一 BGA 標準を維持しながら競争を可能にします。他のすべての interface（行 0x0–0x7、0x9–0xF）は逆のデフォルトに従います：activate() = その protocol、deactivate() = デジタル。",
    mcuTitle: "アーキテクチャ固有の interfaces（非常に重要）：",
    mcuNote: "MCU アーキテクチャは異なります — 一部の interfaces は1つの chip に存在しますが、別の chip には存在しません。NanoKit Integrated の AVR ATmega328P（8-bit）には ESP32（32-bit Xtensa LX6）にない peripherals があり、その逆もあります。統一された NanoKit Integrated ボードは pins が限られ、すべての機能のスペースがないため、開発者は自分の NanoKit Integrated をどの MCU で設計するか、各 pin でどの protocol/interface を使うかを選択します。例 — NanoKit Integrated ESP32 Pinout：pin 19 = BGA 座標 VR_0x82 = スロット VR_GPIO2、VR_ADC2_IN7 または VR_RTC_IO17 または VR_TOUCH7 を選べます。実際の interface 名には常に VR_ プレフィックスを付けます。これがまさに VR_GPIO interface activate() を使うときです：UMT.Interface(VR_GPIO2).bindTo(VR_TOUCH7); UMT.Interface(VR_TOUCH7).activate();",
    keyTitle: "キー — 用語の意味",
    proto: { VR_UART0:"UART — シリアルデータを送受信", VR_SPI0:"SPI — master-out シリアルデータライン", VR_I2C0:"I2C — 双方向データライン", VR_PWM0:"PWM — デューティ比信号を生成", VR_DAC1:"DAC — アナログ電圧を出力", VR_ADC0:"ADC — アナログ電圧を読み取り", VR_CAN0:"CAN — 車両/産業バスフレーム", VR_I2S0:"I2S — デジタルオーディオストリーム" },
    glossary: [
      ["VR_","Virtual Register — AIA が物理 GPIO に解決する論理 pin/周辺機器名"],
      ["UMT","Unified Microchip Technology — 任意の MCU または SoC 用の 1 つのコード"],
      ["AIA","Abstraction Intelligence Algorithm Engine — VR 名を実際のハードウェアに解決"],
      ["BGA","Ball Grid Array — 16×16 package substrate（256 個の balls）"],
      ["MCU","Microcontroller — 例：ESP32、STM32、RP2040"],
      ["SoC","System-on-Chip Processor — 例：Snapdragon、Apple A、Exynos"],
      ["GPIO","General-Purpose Input/Output — 生のデジタル pin"],
      ["VR_GPIOxx","特殊行 0x8 — 16 個のチップメーカー拡張可能 pins"],
      ["activate()","VR を Interface 役割に変える（protocol アクティブ）"],
      ["deactivate()","VR を Digital 役割に変える（LED/スイッチ）"],
      ["bindTo()","activate() の前に VR_GPIOxx pin を実際の/カスタム interface にリンク"],
      ["VR_NewInterface","チップメーカーが VR_GPIOxx 上に構築するカスタム protocol"],
      ["Package Substrate","silicon die が乗る層 — UMT のイノベーションフロンティア"],
      ["AI Bashir","Pro_AmineUMT IDE 統合 AI アシスタント — UMT VR コードを記述し、概念を説明し、prompts を洗練し、Build/Debug/Runtime を監視し、プロジェクト知識を生成"],
      [".CmdGenius","プロジェクト インテリジェンス ワークスペース — AI Bashir が管理する隠しフォルダ;Terminal/Build/Debug/Output を 10 個の自動生成ガイド ファイルと統合 (Hardware Wiring, Algorithm, Flowchart, Pseudocode, Architecture Map, IoT Guide, API Ref, Testing, Performance, Debug)"],
    ],
  },
};

/* ═══ VR ROLE SWITCH — Interactive dual-role demonstrator ═══
   Panel A: ANY VR_Interface (the 45 interfaces) — Role1=activate(Interface), Role2=deactivate(Digital)
   Panel B: SPECIAL VR_GPIOxx (Row 0x8) — Role1=deactivate(Digital), Role2=activate(custom by chipmaker) */
function VRRoleSwitch({ lang = "en", isRTL = false }) {
  const T = VRRS_I18N[lang] || VRRS_I18N.en;
  // Panel A: normal interface — default role is the protocol (activate)
  const [ifaceRole, setIfaceRole] = useState("role1"); // role1 = activate/Interface, role2 = deactivate/Digital
  const [ifaceAnim, setIfaceAnim] = useState(false);
  // Panel B: VR_GPIOxx — default role is digital (deactivate)
  const [gpioRole, setGpioRole] = useState("role1"); // role1 = deactivate/Digital, role2 = activate/custom
  const [gpioAnim, setGpioAnim] = useState(false);
  // Selectable example interface for Panel A
  const IFACES = ["VR_UART0","VR_SPI0","VR_I2C0","VR_PWM0","VR_DAC1","VR_ADC0","VR_CAN0","VR_I2S0"];
  const [pick, setPick] = useState("VR_UART0");

  const flip = (which) => {
    if (which === "iface") { setIfaceAnim(true); setTimeout(()=>{ setIfaceRole(r=>r==="role1"?"role2":"role1"); setIfaceAnim(false); }, 220); }
    else { setGpioAnim(true); setTimeout(()=>{ setGpioRole(r=>r==="role1"?"role2":"role1"); setGpioAnim(false); }, 220); }
  };

  // Pin name per picked interface (technical, stays English)
  const pinMap = { VR_UART0:"VR_UART_TX0", VR_SPI0:"VR_SPI_MOSI0", VR_I2C0:"VR_I2C_SDA0", VR_PWM0:"VR_PWM_OUT0", VR_DAC1:"VR_DAC_OUT1", VR_ADC0:"VR_ADC_IN0", VR_CAN0:"VR_CAN_TX0", VR_I2S0:"VR_I2S_SD0" };
  const pinName = pinMap[pick];
  const ifaceActive = ifaceRole === "role1"; // role1 = activate = Interface
  const iC = ifaceActive ? "#4a9eff" : "#22c55e"; // blue=interface, green=digital

  const gpioDigital = gpioRole === "role1"; // role1 = deactivate = Digital
  const gC = gpioDigital ? "#22c55e" : "#a855f7"; // green=digital, purple=custom interface

  const card = {background:"#0a0c10",borderRadius:9,padding:13,border:"1px solid #1c2028",minWidth:0,boxSizing:"border-box",overflow:"hidden"};
  const lbl = {fontSize:8,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase"};
  // Code box is ALWAYS LTR (it's code — technical, English)
  const codeBox = (txt,c)=>(<pre dir="ltr" style={{background:"#060708",borderRadius:6,padding:9,fontSize:9,color:c,lineHeight:1.7,margin:"7px 0 0",fontFamily:"ui-monospace,Menlo,monospace",border:`1px solid ${c}22`,textAlign:"left",overflowX:"auto",whiteSpace:"pre"}}>{txt}</pre>);

  return (
    <div dir={isRTL?"rtl":"ltr"} style={{maxWidth:920,width:"100%",margin:"0 auto 8px",padding:"12px 14px",background:"linear-gradient(135deg,#0e1117,#12151c)",border:"1px solid #ea580c33",borderRadius:9,boxSizing:"border-box",overflowX:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
        <span style={{fontSize:15}}>🔀</span>
        <b style={{fontSize:12,color:"#fbbf24"}}>{T.header}</b>
        <span style={{fontSize:8.5,color:"#a8a29e"}}>{T.intro}</span>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:8,minWidth:0}} className="vrrs-grid">

        {/* ═══ PANEL A — ANY VR_Interface ═══ */}
        <div style={card}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,gap:6,flexWrap:"wrap"}}>
            <span style={{...lbl,color:"#e07b39"}}>{T.panelA}</span>
            <select dir="ltr" value={pick} onChange={e=>setPick(e.target.value)} style={{background:"#1c1917",color:"#4fc1ff",border:"1px solid #2a2520",borderRadius:4,fontSize:9,padding:"2px 5px",fontFamily:"ui-monospace,monospace",cursor:"pointer"}}>
              {IFACES.map(x=><option key={x} value={x}>{x}</option>)}
            </select>
          </div>

          {/* The animated pin + switch */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14,margin:"4px 0 8px"}}>
            <div style={{width:62,height:62,borderRadius:"50%",background:`radial-gradient(circle at 35% 35%,${iC}45,${iC}12)`,border:`3px solid ${iC}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",transition:"all .35s",transform:ifaceAnim?"scale(0.82)":"scale(1)",boxShadow:`0 0 22px ${iC}33`,flexShrink:0}}>
              <span style={{fontSize:17}}>{ifaceActive?"📡":"⚡"}</span>
              <span dir="ltr" style={{fontSize:6,color:iC,fontWeight:700,marginTop:1}}>{pinName}</span>
            </div>

            {/* SWITCH */}
            <button onClick={()=>flip("iface")} aria-label="toggle interface role" style={{position:"relative",width:62,height:30,borderRadius:15,border:"none",cursor:"pointer",background:ifaceActive?"#1e3a5f":"#14401f",transition:"background .3s",flexShrink:0,padding:0}}>
              <span style={{position:"absolute",top:3,left:ifaceActive?35:3,width:24,height:24,borderRadius:"50%",background:iC,transition:"left .3s cubic-bezier(.4,1.4,.6,1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:"#000",boxShadow:"0 2px 6px rgba(0,0,0,.4)"}}>{ifaceActive?"1":"2"}</span>
            </button>
          </div>

          <div dir="ltr" style={{textAlign:"center",fontSize:11,fontWeight:800,color:iC,transition:"color .3s",marginBottom:2}}>
            {ifaceActive ? T.role1_a : T.role2_a}
          </div>
          <div style={{textAlign:"center",fontSize:8.5,color:"#a8a29e",lineHeight:1.5,minHeight:24}}>
            {ifaceActive ? T.proto[pick] : T.digA}
          </div>

          {ifaceActive
            ? codeBox(`UMT.Interface(${pick}).activate();\n// ${pinName} now works as ${pick.replace("VR_","")}\n// AIA Engine binds it to the right GPIO`, "#93c5fd")
            : codeBox(`UMT.Interface(${pick}).deactivate();\n// ${pinName} = plain digital pin\nUMT.Digital_Pin(${pinName}).write(HIGH); // LED ON`, "#86efac")
          }
        </div>

        {/* ═══ PANEL B — SPECIAL VR_GPIOxx ═══ */}
        <div style={{...card, border:"1px solid #22c55e35"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,gap:6,flexWrap:"wrap"}}>
            <span style={{...lbl,color:"#22c55e"}}>{T.panelB}</span>
            <span style={{fontSize:7.5,color:"#a855f7",fontWeight:700,border:"1px solid #a855f733",borderRadius:3,padding:"1px 5px"}}>{T.chipzone}</span>
          </div>

          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14,margin:"4px 0 8px"}}>
            <div style={{width:62,height:62,borderRadius:"50%",background:`radial-gradient(circle at 35% 35%,${gC}45,${gC}12)`,border:`3px solid ${gC}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",transition:"all .35s",transform:gpioAnim?"scale(0.82)":"scale(1)",boxShadow:`0 0 22px ${gC}33`,flexShrink:0}}>
              <span style={{fontSize:17}}>{gpioDigital?"⚡":"🏭"}</span>
              <span dir="ltr" style={{fontSize:6,color:gC,fontWeight:700,marginTop:1}}>VR_GPIO00</span>
            </div>

            <button onClick={()=>flip("gpio")} aria-label="toggle gpio role" style={{position:"relative",width:62,height:30,borderRadius:15,border:"none",cursor:"pointer",background:gpioDigital?"#14401f":"#3b1d54",transition:"background .3s",flexShrink:0,padding:0}}>
              <span style={{position:"absolute",top:3,left:gpioDigital?3:35,width:24,height:24,borderRadius:"50%",background:gC,transition:"left .3s cubic-bezier(.4,1.4,.6,1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:"#000",boxShadow:"0 2px 6px rgba(0,0,0,.4)"}}>{gpioDigital?"1":"2"}</span>
            </button>
          </div>

          <div dir="ltr" style={{textAlign:"center",fontSize:11,fontWeight:800,color:gC,transition:"color .3s",marginBottom:2}}>
            {gpioDigital ? T.role1_b : T.role2_b}
          </div>
          <div style={{textAlign:"center",fontSize:8.5,color:"#a8a29e",lineHeight:1.5,minHeight:24}}>
            {gpioDigital ? T.gpioDig : T.gpioCustom}
          </div>

          {gpioDigital
            ? codeBox(`UMT.Interface(VR_GPIO00).deactivate();\n// VR_GPIO00 = raw digital pin\nUMT.Digital_Pin(VR_GPIO00).write(HIGH);`, "#86efac")
            : codeBox(`UMT.Interface(VR_GPIO00).activate();\n// chipmaker's custom interface loads\n// e.g. VR_NewInterface (split 3-4 sub-ifaces)\nUMT.Interface_Pin(VR_NewInterface).enable();`, "#d8b4fe")
          }
        </div>
      </div>

      {/* Chipmaker note */}
      <div style={{marginTop:9,padding:"7px 11px",background:"#0a0c10",borderRadius:6,border:"1px solid #a855f725",fontSize:8.5,color:"#a8a29e",lineHeight:1.6}}>
        <b style={{color:"#a855f7"}}>🏭 {T.chipNote_b}</b> {T.chipNote}
      </div>

      {/* MCU architecture-specific note — important strategic insight */}
      <div style={{marginTop:7,padding:"8px 11px",background:"linear-gradient(135deg,#0a0c10,#0d1015)",borderRadius:6,border:"1px solid #4a9eff30",fontSize:8.5,color:"#a8a29e",lineHeight:1.65}}>
        <b style={{color:"#4fc1ff"}}>🧩 {T.mcuTitle}</b> {T.mcuNote}
        <pre dir="ltr" style={{background:"#060708",borderRadius:5,padding:8,fontSize:8.5,color:"#d8b4fe",lineHeight:1.6,margin:"6px 0 0",fontFamily:"ui-monospace,Menlo,monospace",border:"1px solid #a855f722",overflowX:"auto",whiteSpace:"pre",maxWidth:"100%"}}>{`// NanoKit Integrated ESP32 — pin 19 = VR_0x82 = VR_GPIO2
UMT.Interface(VR_GPIO2).bindTo(VR_TOUCH7);  // pick ESP32-only peripheral
UMT.Interface(VR_TOUCH7).activate();        // now pin acts as capacitive touch
// (AVR ATmega328P has NO touch — that's why VR_ prefix + choice matters)`}</pre>
      </div>

      {/* ═══ GLOSSARY / KEY ═══ */}
      <div style={{marginTop:9,padding:"9px 12px",background:"linear-gradient(90deg,#0e1117,#13100c,#0e1117)",borderRadius:7,border:"1px solid #ea580c30"}}>
        <div style={{fontSize:9,fontWeight:800,color:"#fbbf24",letterSpacing:1,marginBottom:6,textTransform:"uppercase"}}>🔑 {T.keyTitle}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3px 16px"}} className="vrrs-grid">
          {T.glossary.map(([k,v],i)=>(
            <div key={i} style={{display:"flex",gap:6,alignItems:"baseline",padding:"2px 0",borderBottom:"1px solid #1c202833"}}>
              <code dir="ltr" style={{color:"#4fc1ff",fontSize:8.5,fontWeight:700,minWidth:74,flexShrink:0,fontFamily:"ui-monospace,monospace"}}>{k}</code>
              <span style={{fontSize:8,color:"#a8a29e",lineHeight:1.45}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ macOS DOCK TOOLBAR ═══
   Floating horizontal dock with icon buttons, positioned ABOVE the Code Editor block.
   Replicates macOS Dock magnification: hovered icon scales to 1.5x, immediate neighbors
   to 1.22x, next neighbors to 1.07x, others stay at 1.0x. Each icon shifts upward
   proportionally. Tooltip below on hover. Active items show amber dot indicator.

   5 groups (separators '|' between):
     • Group 1 — File Operations:      New · Open · Save
     • Group 2 — Build & Flash:        Build · Upload/Flash
     • Group 3 — Debug Controls:       Debug · Run · Halt · Reset · StepOver · StepInto
     • Group 4 — Monitor:              Monitor
     • Group 5 — Target Selection:     Target A · Target B · Target C

   Each button: 28×28px (slightly smaller than spec'd 36×36 to fit above the 380px
   editor block), rounded 7px, bg #202020, border #2e2e2e. Active state: amber #d4891a
   background with black icon. SVG line-art icons (stroke-only).

   The component is driven by props from App() so clicking icons triggers real demo
   actions (Debug toggle, Run = Auto-play, Reset = step 0, Targets A/B/C, etc.). */
function MacDock({editorX, editorW, debugMode, onDebug, demoOn, onRun, onHalt, onReset, onTargetSelect, activeTarget}) {
  const [hoverIdx,setHoverIdx] = useState(-1);
  // SVG line-art icons (stroke only, no fill) — 14×14 viewBox
  const I = {
    newProj: (<svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 1.5h5l3 3v8H3z"/><path d="M8 1.5v3h3"/><line x1="6.5" y1="7" x2="6.5" y2="10"/><line x1="5" y1="8.5" x2="8" y2="8.5"/></svg>),
    open:    (<svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 4v7.5h11V5.5H7L5.5 4z"/></svg>),
    save:    (<svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 2h8l2 2v8H2z"/><path d="M4 2v3h5V2"/><rect x="4" y="8" width="6" height="3.5"/></svg>),
    build:   (<svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2l-1.5 1.5 2 2L10 4z"/><path d="M6.5 3.5l-4 4 2 2 4-4"/><path d="M2 12l1.5-1.5"/></svg>),
    upload:  (<svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 9.5V2.5"/><path d="M4 5.5l3-3 3 3"/><path d="M2 11.5h10"/></svg>),
    debug:   (<svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="7" cy="8" rx="3" ry="3.5"/><line x1="7" y1="4.5" x2="7" y2="3"/><line x1="4.5" y1="7" x2="2.5" y2="6"/><line x1="9.5" y1="7" x2="11.5" y2="6"/><line x1="4.5" y1="9.5" x2="2.5" y2="11"/><line x1="9.5" y1="9.5" x2="11.5" y2="11"/></svg>),
    run:     (<svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"><polygon points="4,2.5 11,7 4,11.5"/></svg>),
    halt:    (<svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><line x1="5" y1="3" x2="5" y2="11"/><line x1="9" y1="3" x2="9" y2="11"/></svg>),
    reset:   (<svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 7a4 4 0 1 1-1.2-2.8"/><polyline points="11,2.5 11,5 8.5,5"/></svg>),
    stepOver:(<svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 2v6"/><polyline points="4.5,5.5 7,8 9.5,5.5"/><line x1="2.5" y1="11" x2="11.5" y2="11"/></svg>),
    stepInto:(<svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 2v8"/><polyline points="4.5,7.5 7,10 9.5,7.5"/></svg>),
    monitor: (<svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1.5" y="2.5" width="11" height="7.5"/><line x1="5.5" y1="12" x2="8.5" y2="12"/><polyline points="3.5,5 5,6.5 3.5,8"/><line x1="6.5" y1="8" x2="9" y2="8"/></svg>),
    targetA: "A",
    targetB: "B",
    targetC: "C",
  };
  // Item list with metadata
  const items = [
    { key:"new",    icon:I.newProj,  label:"New Project",         action:null },
    { key:"open",   icon:I.open,     label:"Open File",           action:null },
    { key:"save",   icon:I.save,     label:"Save",                action:null },
    { sep:true },
    { key:"build",  icon:I.build,    label:"Build / Compile",     action:null },
    { key:"upload", icon:I.upload,   label:"Upload / Flash",      action:null },
    { sep:true },
    { key:"debug",  icon:I.debug,    label:debugMode?"Debug ON (click to disable)":"Debug",  action:onDebug, active:debugMode },
    { key:"run",    icon:I.run,      label:"Run (auto-step)",     action:onRun,    active:demoOn },
    { key:"halt",   icon:I.halt,     label:"Halt (pause)",        action:onHalt },
    { key:"reset",  icon:I.reset,    label:"Reset to step 0",     action:onReset },
    { key:"stepOver",icon:I.stepOver,label:"Step Over · F10",     action:null },
    { key:"stepInto",icon:I.stepInto,label:"Step Into · F11",     action:null },
    { sep:true },
    { key:"monitor",icon:I.monitor,  label:"Monitor",             action:null },
    { sep:true },
    { key:"tgtA",   icon:I.targetA,  label:"Target A — Dev Boards",       isText:true, action:()=>onTargetSelect&&onTargetSelect("A"), active:activeTarget==="A" },
    { key:"tgtB",   icon:I.targetB,  label:"Target B — UMT IC (BGA)",     isText:true, action:()=>onTargetSelect&&onTargetSelect("B"), active:activeTarget==="B" },
    { key:"tgtC",   icon:I.targetC,  label:"Target C — NanoKit-iM",       isText:true, action:()=>onTargetSelect&&onTargetSelect("C"), active:activeTarget==="C" },
  ];
  // Magnification: scale by distance from hovered index
  const magScale = (i) => {
    if (hoverIdx < 0) return { s:1, ty:0 };
    const d = Math.abs(i - hoverIdx);
    if (d === 0) return { s:1.5,  ty:-8 };
    if (d === 1) return { s:1.22, ty:-3 };
    if (d === 2) return { s:1.07, ty:-1 };
    return { s:1, ty:0 };
  };
  // Position above editor block
  const dockX = editorX + 6;
  const dockW = editorW - 12;
  return (
    <div style={{position:"absolute",left:dockX,top:6,width:dockW,height:38,display:"flex",alignItems:"center",justifyContent:"center",zIndex:30,pointerEvents:"none",animation:"dock-fade-in .35s ease-out"}}>
      <div style={{display:"inline-flex",alignItems:"center",gap:3,padding:"3px 6px",background:"linear-gradient(180deg,rgba(36,36,40,.92),rgba(20,20,22,.92))",border:"1px solid rgba(255,255,255,.07)",borderRadius:11,boxShadow:"0 6px 18px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.05)",backdropFilter:"blur(8px)",pointerEvents:"auto"}}>
        {items.map((it,i)=>{
          if (it.sep) return <div key={"sep-"+i} style={{width:1,height:18,background:"#3a3a3a",margin:"0 2px",opacity:.7}}/>;
          const m = magScale(i);
          const isActive = !!it.active;
          return (
            <div key={it.key} style={{position:"relative",transition:"transform .22s cubic-bezier(.22,1,.36,1)",transform:`translateY(${m.ty}px)`}}>
              <button
                onMouseEnter={()=>setHoverIdx(i)}
                onMouseLeave={()=>setHoverIdx(-1)}
                onClick={(e)=>{e.stopPropagation();if(it.action)it.action();}}
                title={it.label}
                style={{
                  width:24*m.s,height:24*m.s,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  background:isActive?"#d4891a":"#202020",
                  border:`1px solid ${isActive?"#d4891a":"#2e2e2e"}`,
                  borderRadius:7,color:isActive?"#000":"#cfcfcf",
                  cursor:"pointer",padding:0,fontSize:11*m.s,fontWeight:800,fontFamily:"'Inter',system-ui,sans-serif",
                  transition:"width .22s cubic-bezier(.22,1,.36,1), height .22s cubic-bezier(.22,1,.36,1), background .15s",
                  boxShadow:m.s>1?"0 4px 10px rgba(0,0,0,.5)":"none"
                }}>
                {it.isText ? it.icon : it.icon}
              </button>
              {/* Active-state dot indicator below */}
              {isActive && <div style={{position:"absolute",bottom:-5,left:"50%",transform:"translateX(-50%)",width:3,height:3,borderRadius:"50%",background:"#d4891a",boxShadow:"0 0 4px #d4891a"}}/>}
              {/* Tooltip on hover */}
              {hoverIdx===i && (
                <div style={{position:"absolute",top:"100%",left:"50%",transform:"translateX(-50%)",marginTop:6,padding:"2px 7px",background:"#1c1917",border:"1px solid #d4891a55",borderRadius:4,fontSize:8,color:"#fef3c7",whiteSpace:"nowrap",fontWeight:700,fontFamily:"'Inter',system-ui,sans-serif",letterSpacing:0.2,zIndex:31,animation:"dock-tooltip .15s ease-out",pointerEvents:"none"}}>
                  {it.label}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══ DIGITAL HUMAN HEAD ═══
   Stylized SVG face that appears when:
     • voiceListening = true  → developer is speaking to AI Bashir (red glow aura)
     • refining = true        → AI Bashir is speaking back (green glow aura, mouth talks)
   Eyes blink automatically. Mouth animates: idle (subtle), talking (fast oscillation).
   Inspired by Claude.ai "Use voice mode" experience — gives the developer a sense
   of conversing with a real entity rather than just a text panel. */
function DigitalHumanHead({listening, speaking}) {
  if (!listening && !speaking) return null;
  const active = listening || speaking;
  const auraAnim = listening ? "dh-aura-listen 1.4s ease-in-out infinite" : "dh-aura 1.8s ease-in-out infinite";
  const mouthAnim = speaking ? "dh-mouth-talk .42s ease-in-out infinite" : "dh-mouth-idle 2.4s ease-in-out infinite";
  const accent = listening ? "#ef4444" : "#22c55e";
  const accentSoft = listening ? "#fca5a5" : "#86efac";
  return (
    <div style={{display:"flex",justifyContent:"center",marginTop:6,marginBottom:4,animation:"drop-in .35s ease-out"}}>
      <div style={{position:"relative",width:88,height:88,borderRadius:"50%",overflow:"hidden",background:"radial-gradient(circle at 50% 35%, #0e1a14 0%, #060c0a 70%, #000 100%)",border:`1px solid ${accent}55`,animation:auraAnim}}>
        {/* Wireframe grid backdrop */}
        <svg viewBox="0 0 88 88" style={{position:"absolute",inset:0,width:"100%",height:"100%",animation:"dh-grid 3s ease-in-out infinite"}}>
          <defs>
            <radialGradient id="dh-face-grad" cx="50%" cy="38%" r="55%">
              <stop offset="0%" stopColor={accent} stopOpacity="0.15"/>
              <stop offset="60%" stopColor={accent} stopOpacity="0.04"/>
              <stop offset="100%" stopColor="#000" stopOpacity="0"/>
            </radialGradient>
          </defs>
          {/* Horizontal wireframe contour lines (head sphere illusion) */}
          {[20,30,40,50,60,70].map(y=>(
            <ellipse key={y} cx="44" cy={y} rx={38-Math.abs(y-45)*0.55} ry="2" fill="none" stroke={accent} strokeWidth="0.35" opacity="0.35"/>
          ))}
          {/* Vertical wireframe contour lines */}
          {[26,34,44,54,62].map(x=>(
            <ellipse key={x} cx={x} cy="44" rx="2" ry={36-Math.abs(x-44)*0.4} fill="none" stroke={accent} strokeWidth="0.35" opacity="0.3"/>
          ))}
          <circle cx="44" cy="44" r="40" fill="url(#dh-face-grad)"/>
        </svg>
        {/* Face features */}
        <svg viewBox="0 0 88 88" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
          {/* Left eye */}
          <g style={{transformOrigin:"31px 38px",animation:"dh-eye-blink 4.2s ease-in-out infinite"}}>
            <ellipse cx="31" cy="38" rx="4" ry="3" fill="#0a0f0c" stroke={accent} strokeWidth="0.6"/>
            <circle cx="31" cy="38" r="1.6" fill={accentSoft}/>
            <circle cx="31.5" cy="37.4" r="0.5" fill="#fff"/>
          </g>
          {/* Right eye */}
          <g style={{transformOrigin:"57px 38px",animation:"dh-eye-blink 4.2s ease-in-out infinite"}}>
            <ellipse cx="57" cy="38" rx="4" ry="3" fill="#0a0f0c" stroke={accent} strokeWidth="0.6"/>
            <circle cx="57" cy="38" r="1.6" fill={accentSoft}/>
            <circle cx="57.5" cy="37.4" r="0.5" fill="#fff"/>
          </g>
          {/* Nose bridge accent line */}
          <line x1="44" y1="40" x2="44" y2="50" stroke={accent} strokeWidth="0.4" opacity="0.55"/>
          {/* Mouth (animated open/close) */}
          <g style={{transformOrigin:"44px 60px",animation:mouthAnim}}>
            <ellipse cx="44" cy="60" rx="8" ry="3.2" fill="#0a0f0c" stroke={accent} strokeWidth="0.7"/>
            <ellipse cx="44" cy="60" rx="6.5" ry="2" fill={accent} opacity="0.32"/>
          </g>
          {/* Scan-line overlay */}
          <rect x="0" y="0" width="88" height="3" fill={accent} opacity="0.18" style={{animation:"dh-scan 2.4s linear infinite"}}/>
        </svg>
        {/* Status pill */}
        <div style={{position:"absolute",bottom:-3,left:"50%",transform:"translateX(-50%)",padding:"1.5px 7px",background:"#0a0f0c",border:`1px solid ${accent}88`,borderRadius:8,fontSize:6.5,fontWeight:800,color:accent,letterSpacing:0.3,whiteSpace:"nowrap",fontFamily:"'Inter',system-ui,sans-serif"}}>
          {listening ? "🎙 LISTENING" : "🗣 SPEAKING"}
        </div>
      </div>
    </div>
  );
}

/* ═══ APP ═══ */
export default function App() {
  const [hov,setHov]=useState(null);
  const [exp,setExp]=useState({});
  const [demoOn,setDemoOn]=useState(false);
  const [step,setStep]=useState(-1);
  const [zoom,setZoom]=useState(0.65);
  const [lang,setLang]=useState("en");
  const [langOpen,setLangOpen]=useState(false);
  const [debugMode,setDebugMode]=useState(false);
  // ★ Command Genius mode toggle: "module" (L298N driver board) ↔ "pro" (discrete schematic)
  //    Switch button lives inside the cmdGen block header. Default = "module" (beginner-friendly).
  const [cmdMode,setCmdMode]=useState("module");
  // ★ COPY-TO-CLIPBOARD: tracks which block was last copied (for ✓ feedback animation)
  //    Reset to null after 1.8s so the button label reverts to "Copy".
  const [copied,setCopied]=useState(null); // null | "editor" | "aia" | "cmdgen"
  // ★ CUSTOM PROJECT INPUT: developer can type their own project idea instead of DC motor
  //    When generated, customDemo replaces DEMO array → all 16 steps reflect the new project
  const [projectInputOpen,setProjectInputOpen]=useState(false);
  const [projectInput,setProjectInput]=useState("");
  const [generating,setGenerating]=useState(false);
  const [genError,setGenError]=useState("");
  const [customDemo,setCustomDemo]=useState(null); // null = use default DEMO (DC motor)
  const [customProjectTitle,setCustomProjectTitle]=useState("");
  // ★ PLATFORM TARGET: embedded (default) | mobile (Flutter) | hmi (C# Visual Studio)
  //    Changes the system prompt so Claude generates the right toolchain workflow.
  const [customPlatform,setCustomPlatform]=useState("embedded");
  // ★ VOICE INPUT: Web Speech API for dictation in any of the 8 supported languages
  const [voiceListening,setVoiceListening]=useState(false);
  const recognitionRef=useRef(null);
  // ★ TEXT-TO-SPEECH state — true while speechSynthesis is actually playing audio.
  //    Drives DigitalHumanHead.speaking so the mouth keeps animating for the FULL
  //    duration of the spoken reply, not just while the API call is in flight.
  const [ttsSpeaking,setTtsSpeaking]=useState(false);
  // ★ AI PROJECT INTERVIEW MODE — replaces simple "refine" with a structured interview
  //    where AI Bashir acts as a Senior Embedded Systems Architect / IoT Architect /
  //    Software Solution Architect. Asks ONE question at a time, gathers full project
  //    requirements, and when ready signals "Would you like me to generate the Master Prompt?"
  //    The Master Prompt is then produced by a separate API call and replaces projectInput.
  const [chatHistory,setChatHistory]=useState([]); // [{role:"user"|"assistant", content:"..."}]
  const [refining,setRefining]=useState(false);
  // True when AI Bashir's last reply contains the "ready to generate Master Prompt" signal.
  // Triggers the "🪄 Generate Master Prompt" button to appear in the panel.
  const [interviewReady,setInterviewReady]=useState(false);
  const [generatingMaster,setGeneratingMaster]=useState(false);
  // Holds the generated Master Prompt separately so the developer can review it before
  // committing to "Generate 16 Steps". Null until generated.
  const [masterPrompt,setMasterPrompt]=useState(null);
  // ★ macOS DOCK TOOLBAR — selected target (A/B/C). Default "A" = Dev Boards.
  // ★ AI PROVIDER CONFIGURATION (Phase 2 of the Voice System spec §5) —
  //    Developer picks a provider (Claude/OpenAI/Gemini/DeepSeek/Kimi), a model within
  //    that provider, and enters their personal API key. Multiple keys stored per-provider
  //    (never sent anywhere except the provider's own endpoint). AI Bashir stays the visible
  //    assistant; the selected provider works transparently in the background.
  const [providerConfigOpen,setProviderConfigOpen]=useState(false);
  const [selectedProvider,setSelectedProvider]=useState("claude");
  const [selectedModel,setSelectedModel]=useState("claude-sonnet-4-6");
  // Stored keys — one per provider. In production this is backed by keytar (Electron) /
  // SecretStorage (VSCode) / sessionStorage (web). In this artifact we keep them in-memory
  // only so nothing leaks between sessions.
  const [providerKeys,setProviderKeys]=useState({ claude:"", openai:"", gemini:"", deepseek:"", kimi:"" });
  const [rememberKey,setRememberKey]=useState(true);
  const [connectionStatus,setConnectionStatus]=useState({}); // { [providerId]: "unknown"|"testing"|"connected"|"failed" }
  const [testingConn,setTestingConn]=useState(false);
  const [providerSaved,setProviderSaved]=useState(false);
  const [activeTarget,setActiveTarget]=useState("A");
  const tmr=useRef(null);

  // ★ VALIDATE API KEY FORMAT — quick pre-flight check per provider's known key shape
  //    Real network validation happens in testConnection(); this just catches obvious typos.
  const validateApiKeyFormat = (provId, key) => {
    if (!key || !key.trim()) return { ok:false, reason:"Key is empty" };
    const k = key.trim();
    const shapes = {
      claude:   { prefix:"sk-ant-",  minLen:40, hint:"Claude keys start with 'sk-ant-' and are 40+ chars" },
      openai:   { prefix:"sk-",      minLen:40, hint:"OpenAI keys start with 'sk-' and are 40+ chars" },
      gemini:   { prefix:"",         minLen:20, hint:"Gemini API keys are typically 39 chars, alphanumeric" },
      deepseek: { prefix:"sk-",      minLen:32, hint:"DeepSeek keys start with 'sk-' and are 32+ chars" },
      kimi:     { prefix:"sk-",      minLen:32, hint:"Kimi keys start with 'sk-' and are 32+ chars" },
    };
    const s = shapes[provId] || { prefix:"", minLen:16, hint:"key should be at least 16 chars" };
    if (s.prefix && !k.startsWith(s.prefix)) return { ok:false, reason:`Wrong prefix — ${s.hint}` };
    if (k.length < s.minLen) return { ok:false, reason:`Too short — ${s.hint}` };
    return { ok:true };
  };

  // ★ TEST CONNECTION — probes the provider endpoint with a minimal request to confirm the
  //    key works. Currently only Claude has a live implementation; other providers are
  //    stubbed to demonstrate the UX flow (real endpoint calls would require CORS-friendly
  //    proxies or an Electron/native bridge).
  const testConnection = async () => {
    const key = (providerKeys[selectedProvider] || "").trim();
    const fmt = validateApiKeyFormat(selectedProvider, key);
    if (!fmt.ok) {
      setConnectionStatus(s => ({ ...s, [selectedProvider]:"failed" }));
      setGenError("Test failed: " + fmt.reason);
      return;
    }
    setTestingConn(true);
    setConnectionStatus(s => ({ ...s, [selectedProvider]:"testing" }));
    setGenError("");
    try {
      if (selectedProvider === "claude") {
        // Minimal 1-token ping to /v1/messages
        const resp = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": key,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: selectedModel || "claude-sonnet-4-6",
            max_tokens: 8,
            messages: [{ role: "user", content: "ping" }],
          }),
        });
        if (resp.ok) {
          setConnectionStatus(s => ({ ...s, claude:"connected" }));
        } else {
          const err = resp.status === 401 ? "Invalid API key" : `HTTP ${resp.status}`;
          setConnectionStatus(s => ({ ...s, claude:"failed" }));
          setGenError("Test failed: " + err);
        }
      } else {
        // Other providers — format-only validation for now (full network probe pending §5 impl)
        setConnectionStatus(s => ({ ...s, [selectedProvider]:"connected" }));
        setGenError("Format valid — full network probe for " + selectedProvider + " will be wired in Phase 2.2 (CORS proxy or native bridge needed).");
      }
    } catch (e) {
      setConnectionStatus(s => ({ ...s, [selectedProvider]:"failed" }));
      setGenError("Test failed: " + (e.message || String(e)));
    } finally {
      setTestingConn(false);
    }
  };

  // ★ SAVE PROVIDER CONFIG — commits the current provider + model + key to storage
  //    (in the artifact we just keep it in the existing state; in production this dispatches
  //    to the platform-specific secure store).
  const saveProviderConfig = () => {
    const key = (providerKeys[selectedProvider] || "").trim();
    if (key && rememberKey) {
      // In production: window.electronAPI.saveKey(selectedProvider, key)  ← via keytar
      // Or:            vscode.SecretStorage.store(`umt.${selectedProvider}Key`, key)
      // Or:            sessionStorage.setItem(`umt.${selectedProvider}Key`, key)
      // Artifact behaviour: already in state; nothing to persist.
    }
    setProviderSaved(true);
    setTimeout(() => setProviderSaved(false), 1800);
  };

  // i18n: get translated text for current step, fallback to English
  // ★ When customDemo is active (user typed their own project), use its localized text
  //    Otherwise use the static STEP_I18N translations or fallback to DEMO[idx].text
  const getStepText = (idx) => {
    if (customDemo && customDemo[idx]) return customDemo[idx].text;
    if (!STEP_I18N[lang] || !STEP_I18N[lang][idx]) return DEMO[idx].text;
    return STEP_I18N[lang][idx];
  };
  const curLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  // ★ Active demo array: customDemo (if developer generated one) OR default DEMO (DC motor)
  const activeDemoArr = customDemo || DEMO;

  // ★ COPY-TO-CLIPBOARD helper — copies given text and shows ✓ Copied feedback for 1.8s
  const copyToClipboard = async (text, key) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers / non-HTTPS contexts
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    } catch (err) {
      console.error("Copy failed:", err);
      setCopied("error");
      setTimeout(() => setCopied(null), 1800);
    }
  };

  // ★ CLAUDE API — generate custom 16-step demo from developer's project idea
  //    Uses Anthropic Claude Sonnet 4.6. Output is a JSON array of {title, text} for each step.
  //    Supports 3 target platforms: embedded (default), mobile (Flutter), hmi (C#/VS).
  //    NOTE: This feature requires Claude API access (token-based). Developer must be a
  //    Claude subscriber when used outside the architecture-map demo deployment.
  const generateCustomProject = async () => {
    if (!projectInput.trim() || generating) return;
    setGenerating(true);
    setGenError("");
    const projDesc = projectInput.trim();
    // Platform-specific narrative arcs — same 16-step skeleton, different toolchain
    const arcs = {
      embedded: `Platform: PURE EMBEDDED FIRMWARE on NanoKit Integrated ESP32 (no host app).
The 16-step narrative arc (KEEP this order, only change content):
1. Developer asks AI Bashir to build this firmware project
2. AI Bashir asks "Which board?" — answer: NanoKit Integrated ESP32
3. UMT SDK loads NanoKit ESP32 board profile + VR namespace
4. AI Bashir writes the .umt VR API code (live typing in editor)
5. Editor syncs every keystroke with UMT SDK (validates VR names)
6. UMT SDK confirms target = NanoKit ESP32 (locked)
7. AIA Engine receives the .umt source for processing
8. UMT-IR (Intermediate Representation) generated from VR calls
9. AIA Codegen produces hidden Arduino-ESP32 C++ (developer never sees)
10. AI Bashir explains what was generated, suggests verification
11. Build phase compiles firmware.bin
12. Simulator runs the firmware virtually (Wokwi-style)
13. Flash to physical NanoKit ESP32 board via USB
14. Serial Monitor shows real-time output
15. Project verified working on hardware
16. Command Genius opens 5-section educational walkthrough`,
      mobile: `Platform: FLUTTER MOBILE APP (iOS + Android) talking to NanoKit Integrated ESP32 over BLE/WiFi/MQTT.
The 16-step narrative arc (KEEP this order, only change content):
1. Developer asks AI Bashir to build this Flutter mobile IoT app
2. AI Bashir asks "Flutter SDK installed? Android Studio + Xcode ready? Target: iOS, Android, or both?"
3. Pro_AmineUMT IDE scaffolds Flutter project (lib/main.dart) + ESP32 firmware (main.umt) in parallel
4. AI Bashir writes BOTH: Flutter Dart UI/state + .umt VR firmware (live typing, two-pane editor)
5. Editor syncs both files with UMT SDK (validates VR names in .umt; lint Flutter widgets)
6. UMT SDK locks target = NanoKit ESP32; selects connectivity (BLE / WiFi+MQTT) per project needs
7. AIA Engine processes .umt firmware source
8. UMT-IR generated for the ESP32 side; Flutter side compiles via 'flutter build'
9. AIA Codegen emits hidden Arduino-ESP32 C++; Flutter side stays pure Dart
10. AI Bashir guides developer: "Run 'flutter pub get' then 'flutter run' on a physical device or emulator"
11. Build phase compiles both: firmware.bin (ESP32) + app.apk/app.ipa (Flutter)
12. Joint simulator: Wokwi (ESP32) linked to Flutter device-preview running the app
13. Flash NanoKit ESP32 via USB + install Flutter app on phone (USB-debug or TestFlight)
14. Phone app pairs with ESP32 over BLE/WiFi; live telemetry stream flows
15. Mobile UI shows real-time sensor data, control buttons send commands back to ESP32
16. Command Genius walks through Flutter widget tree + BLE characteristics + ESP32 firmware in one unified guide`,
      hmi: `Platform: INDUSTRIAL HMI DESKTOP APP in C# (WinForms or WPF) using Visual Studio, talking to NanoKit Integrated ESP32 over Serial / Modbus-RTU / MQTT.
The 16-step narrative arc (KEEP this order, only change content):
1. Developer asks AI Bashir to build this industrial HMI panel
2. AI Bashir asks "Visual Studio 2022 installed? .NET 8 SDK ready? HMI style: WinForms or WPF/XAML?"
3. Pro_AmineUMT IDE scaffolds C# solution (MainWindow.xaml + ViewModel) + ESP32 firmware (main.umt)
4. AI Bashir writes BOTH: C# XAML/Form HMI (gauges, charts, controls) + .umt VR firmware (live typing)
5. Editor syncs C# + .umt with UMT SDK; Roslyn lints C#, UMT SDK validates VR names
6. UMT SDK locks target = NanoKit ESP32; HMI selects transport (Serial / Modbus-RTU / MQTT)
7. AIA Engine receives .umt firmware
8. UMT-IR generated for ESP32; C# side compiles via MSBuild / dotnet build
9. AIA Codegen produces hidden Arduino-ESP32 C++; C# side stays pure .NET
10. AI Bashir guides: "dotnet restore && dotnet build && dotnet run for the HMI app"
11. Build: HMI .exe + ESP32 firmware.bin compile in one CI pipeline
12. HMI runs locally on dev PC; ESP32 runs in Wokwi sim; transport bridged via virtual COM
13. Flash physical NanoKit ESP32 via USB + launch HMI .exe on operator PC
14. HMI auto-binds to ESP32 (auto-detect COM port / Modbus slave ID / MQTT broker)
15. Real-time industrial dashboard: live tags, alarms, SCADA-style trends, control outputs
16. Command Genius shows HMI tag-binding map + ESP32 telemetry registers in one unified guide`,
    };
    const arc = arcs[customPlatform] || arcs.embedded;
    const sysPrompt = `You generate 16 demo-step descriptions for the Pro_AmineUMT IDE Architecture Map.

Project from developer: "${projDesc}"

${arc}

For each step, write a 2-3 sentence "text" field. For embedded steps, mention specific VR interfaces (VR_UART0, VR_ADC, VR_PWM_OUT0, VR_I2C0, VR_GPIO00, VR_SPI0, VR_INT0, etc.) that fit. For mobile, mention Flutter widgets / packages (flutter_blue, mqtt_client, provider). For HMI, mention C# libraries (System.IO.Ports, NModbus, MQTTnet, OxyPlot).

Return ONLY a valid JSON array of 16 objects. No markdown, no preamble, no code fence.
Format: [{"title":"Step 1 — ...","text":"..."},{"title":"Step 2 — ...","text":"..."}, ...]`;

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: sysPrompt }]
        })
      });
      if (!resp.ok) throw new Error(`API ${resp.status}`);
      const data = await resp.json();
      const raw = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
      const clean = raw.replace(/^```(json)?/gm, "").replace(/```$/gm, "").trim();
      // Extract JSON array — find first [ and last ]
      const a = clean.indexOf("["); const b = clean.lastIndexOf("]");
      if (a < 0 || b < 0) throw new Error("No JSON array in response");
      const arr = JSON.parse(clean.slice(a, b + 1));
      if (!Array.isArray(arr) || arr.length !== 16) throw new Error("Expected 16 steps, got " + (Array.isArray(arr) ? arr.length : "non-array"));
      // Merge generated text/title with existing DEMO blocks/conns/hl structure (preserves animation)
      const merged = DEMO.map((d, i) => ({
        ...d,
        title: arr[i].title || d.title,
        text: arr[i].text || d.text
      }));
      setCustomDemo(merged);
      const platformIcon = PLATFORM_CONFIGS[customPlatform]?.icon || "🔌";
      const titlePrefix = platformIcon + " ";
      setCustomProjectTitle(titlePrefix + (projDesc.length > 55 ? projDesc.slice(0, 52) + "..." : projDesc));
      setProjectInputOpen(false);
    } catch (e) {
      console.error("Generate failed:", e);
      setGenError(String(e.message || e));
    } finally {
      setGenerating(false);
    }
  };
  const resetCustomProject = () => {
    setCustomDemo(null);
    setCustomProjectTitle("");
    setProjectInput("");
    setGenError("");
    setChatHistory([]);
    setInterviewReady(false);
    setMasterPrompt(null);
    // ★ Silence any TTS that's still playing so AI Bashir stops mid-sentence on reset
    try { if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel(); } catch (_) {}
    setTtsSpeaking(false);
  };

  // ★ AI PROJECT INTERVIEW MODE — replaces simple "Refine".
  //    AI Bashir conducts a structured interview as a Senior Embedded Systems Architect /
  //    IoT Architect / Software Solution Architect. Asks ONE focused question at a time,
  //    builds full requirements over several turns, and when it has enough info, signals
  //    readiness with the EXACT phrase "I now have enough information to generate a
  //    complete Master Prompt for your project. Would you like me to generate it?"
  //
  //    Architecture (from the spec doc Amine sent):
  //        Developer
  //           │
  //           ▼
  //        AI Bashir Assistant (animated avatar + voice + chat panel)
  //           │
  //           ▼
  //        Claude / ChatGPT / Gemini / DeepSeek  ← developer's own API token
  //           │
  //           ▼
  //        AI Bashir Engine + AIA Engine
  //           │
  //           ▼
  //        Project (MyProject.umt)
  //
  //    This function handles the interview turn-by-turn. When ready, the dedicated
  //    "🪄 Generate Master Prompt" button (driven by interviewReady) calls generateMasterPrompt().
  const refineWithBashir = async () => {
    if (!projectInput.trim() || refining || generating || generatingMaster) return;
    setRefining(true);
    setGenError("");
    const platformDesc = PLATFORM_CONFIGS[customPlatform]?.desc_en || "embedded firmware on NanoKit Integrated ESP32";
    const newUserMsg = { role: "user", content: projectInput.trim() };
    const history = [...chatHistory, newUserMsg];
    const sysPrompt = `You are AI Bashir, the integrated AI assistant and intelligent engineering system of Pro_AmineUMT IDE with AI.

You are now in AI PROJECT INTERVIEW MODE.

Your mission is not only to answer questions, but to help developers design, analyze, plan, and build complete engineering projects from idea to implementation. Your role is NOT to immediately generate code — interview first, build second.

You are an expert across these domains:
  HARDWARE & EMBEDDED — Embedded Systems · Electronics · PCB Design · Firmware · UMT VR Language · NanoKit Integrated ESP32 · Arduino · ESP-IDF · STM32 · Raspberry Pi · Electrical Engineering · Mechanical Systems Integration
  SOFTWARE — C/C++ · Python · C# · Flutter · React · Linux · Mobile Apps · Web Apps · Cloud Platforms
  SYSTEMS & AI — IoT · Robotics · Industrial Automation · AI Systems · AI Integration · Computer Vision

You support project interviews for ANY size or type, including:
  Smart Home · Smart Factory · Industrial Automation · Drone Systems · Robotics · Medical Devices · Automotive Systems · Weather Stations · AI Cameras · Computer Vision · IoT Platforms · Agriculture Systems · Energy Monitoring · Security Systems · Fire Detection · Smart Buildings · GPS Tracking · LoRa Networks · Bluetooth Systems · Wi-Fi Systems · Home Automation · Mobile Applications · Web Dashboards · Cloud IoT Platforms · Industrial Control Systems · any custom engineering project

Target platform (host stack): ${platformDesc}
Firmware target: NanoKit Integrated ESP32 (the only supported board right now).

CONVERSATION RULES:
- Start a natural conversation.
- Ask ONE focused question at a time. Never multi-question batches.
- Reply in the same language as the developer's last message.
- Keep each reply under 150 words.
- Never invent peripherals the developer didn't mention.
- When suggesting an alternative, briefly state advantages and disadvantages.
- Until requirements are complete, keep asking — do not jump to code.

DURING THE INTERVIEW YOU MAY ANALYZE: MyProject.umt · umt.json · .CmdGenius · Build Output · Problems · Debug Console · Runtime · Hardware Wiring · Flowcharts · Project Architecture.

YOU MAY PROACTIVELY RECOMMEND: hardware components · sensors · communication protocols (BLE/Wi-Fi/LoRa/MQTT/CAN/Modbus) · software architecture · PCB architecture (single/multi-layer, SMD/THT) · algorithms (PID, Kalman, CV) · AI models (on-device vs cloud) · databases (SQLite/Firestore/InfluxDB) · cloud services (Firebase/AWS IoT/Azure) · security (TLS, secure boot, signed firmware) · performance optimizations (DMA, RTOS).

GATHER COMPLETE PROJECT INFORMATION about: project goal · problem · target users · success criteria · board/MCU · framework · sensors · displays · motors/actuators · communication · IoT · mobile app · web dashboard · cloud · AI features · database · security · power · PCB · performance · memory · budget · scalability · documentation · testing · deployment.

WHEN YOU ARE CONFIDENT THE REQUIREMENTS ARE COMPLETE, reply with EXACTLY this sentence as a separate paragraph (do not paraphrase it):
"I now have enough information to generate your complete engineering specification and Master Prompt. Would you like me to continue?"

Wait for the developer to confirm before generating anything. Until that point, keep asking ONE focused question per reply.`;
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: sysPrompt,
          messages: history.map(m => ({ role: m.role, content: m.content }))
        })
      });
      if (!resp.ok) throw new Error(`API ${resp.status}`);
      const data = await resp.json();
      const reply = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
      if (!reply) throw new Error("Empty reply from AI Bashir");
      setChatHistory([...history, { role: "assistant", content: reply }]);
      // ★ TTS — AI Bashir speaks the reply aloud (DigitalHumanHead mouth syncs via ttsSpeaking)
      speakWithBashir(reply);
      // Detect the "ready to generate Master Prompt" signal — matches the new canonical phrase
      // "I now have enough information to generate your complete engineering specification
      //  and Master Prompt. Would you like me to continue?" — plus legacy/translated variants.
      const readySignal = /I now have enough information.*(?:Master Prompt|specification).*Would you like me to (continue|generate)/is.test(reply)
                       || /لديّ الآن معلومات كافية.*Master Prompt/i.test(reply)
                       || /У меня теперь достаточно информации.*Master Prompt/i.test(reply)
                       || /我现在有足够的信息.*Master Prompt/i.test(reply)
                       || /Ahora tengo suficiente información.*Master Prompt/i.test(reply);
      setInterviewReady(readySignal);
      // Clear input so the developer can type the next answer
      setProjectInput("");
    } catch (e) {
      console.error("Interview turn failed:", e);
      setGenError(String(e.message || e));
    } finally {
      setRefining(false);
    }
  };

  // ★ GENERATE MASTER PROMPT — second-stage API call triggered AFTER the developer
  //    confirms they want the Master Prompt. Uses the entire chatHistory as context and
  //    asks Claude to emit a single, comprehensive specification document suitable for
  //    feeding into any downstream code-generation pipeline.
  //
  //    The result REPLACES projectInput so the developer can then click "🪄 Generate
  //    16 Steps" to see it visualized on the architecture map. The Master Prompt is also
  //    stored in masterPrompt state for review / copy.
  const generateMasterPrompt = async () => {
    if (chatHistory.length === 0 || generatingMaster || refining || generating) return;
    setGeneratingMaster(true);
    setGenError("");
    const platformDesc = PLATFORM_CONFIGS[customPlatform]?.desc_en || "embedded firmware on NanoKit Integrated ESP32";
    const sysPrompt = `You are AI Bashir, generating the FINAL Master Prompt for a UMT project based on the prior interview conversation.

Target platform (host stack): ${platformDesc}
Firmware target: NanoKit Integrated ESP32.

Produce ONE comprehensive Master Prompt that another AI coding model can use to build the complete project — across embedded, mobile, web, cloud, and AI domains — with minimal additional clarification.

THE MASTER PROMPT MUST INCLUDE THE FOLLOWING 16 SECTIONS (use the section headers verbatim, in this order):
1.  PROJECT OVERVIEW — goal, problem solved, target users, success criteria
2.  HARDWARE ARCHITECTURE — board, sensors, actuators, displays, motors, power
3.  PCB ARCHITECTURE — layer count, SMD/THT mix, BoM summary, key nets
4.  SOFTWARE ARCHITECTURE — modules, layers, threading, RTOS choice
5.  UMT VR IMPLEMENTATION — explicit list of VR_ interfaces this project uses (VR_UART0, VR_I2C0, VR_PWM_OUT0, VR_ADC, VR_GPIOxx, VR_INT0, VR_SPI0, etc.) with the role each plays
6.  FIRMWARE — drivers, ISRs, state machines, boot sequence
7.  APIs — REST / GraphQL / gRPC / custom protocol contracts
8.  LIBRARIES & DRIVERS — third-party + custom
9.  MOBILE APPLICATION — Flutter / React Native / native, screens, state management
10. WEB APPLICATION — React / Vue / Svelte, dashboard layout, routing
11. CLOUD INTEGRATION — provider, services, data flow, message bus
12. DATABASE — schema, indexing, retention, backup
13. AI FEATURES — on-device models, cloud inference, training pipeline
14. TESTING STRATEGY — unit, integration, hardware-in-the-loop
15. DEBUG STRATEGY — logging, traces, breakpoints, telemetry
16. DEPLOYMENT PLAN — flashing, OTA, CI/CD, rollout phases

THEN THREE APPENDICES:
A.  PERFORMANCE OPTIMIZATION GOALS — latency, throughput, memory, power budgets
B.  DOCUMENTATION REQUIREMENTS — explicit mapping of the 10 .CmdGenius/*.md files this project will own (Hardware Wiring, Algorithm, Flowchart, Pseudocode, Architecture & Dependency Map, IoT Application Guide, API Reference, Testing Guide, Performance Report, Debug Guide)
C.  SECURITY MODEL — threat model, mitigations, key management

Output as plain markdown. NO preamble. NO chat tone. NO follow-up questions. Just the specification, suitable for direct ingestion by another AI coding model. Reply in the same language the developer used in the interview.

The output will be loaded directly into the IDE's project-input field, so make it self-contained and build-ready. The specification should be detailed enough that an AI coding system can build the complete professional-grade project based on the UMT Platform with minimal additional clarification.`;
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: sysPrompt,
          messages: [
            ...chatHistory.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: "Yes, please generate the complete Master Prompt now." }
          ]
        })
      });
      if (!resp.ok) throw new Error(`API ${resp.status}`);
      const data = await resp.json();
      const reply = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
      if (!reply) throw new Error("Empty Master Prompt from AI Bashir");
      setMasterPrompt(reply);
      setProjectInput(reply);
      // Append a summary message to chat history so the user sees the handoff
      setChatHistory(h => [...h, { role: "user", content: "Yes, generate the Master Prompt." }, { role: "assistant", content: "✅ Master Prompt generated and loaded into the project input. You can now review it and click 🪄 Generate 16 Steps." }]);
      setInterviewReady(false);
    } catch (e) {
      console.error("Master Prompt generation failed:", e);
      setGenError(String(e.message || e));
    } finally {
      setGeneratingMaster(false);
    }
  };

  // ★ MIC PERMISSION GATE — runs BEFORE SpeechRecognition.start() so we get a real
  //    permission prompt + can distinguish iframe blocking from user denial from no-mic.
  //    Returns { ok, reason, hint } so the UI can show a precise error.
  const ensureMicPermission = async () => {
    // (1) Quick state check via Permissions API (Chrome/Edge — Firefox/Safari may throw)
    if (typeof navigator !== "undefined" && navigator.permissions) {
      try {
        const p = await navigator.permissions.query({ name: "microphone" });
        if (p.state === "denied")
          return { ok:false, reason:"browser_denied", hint:"Browser blocked the mic for this site. Open site settings and re-enable microphone." };
      } catch (_) { /* some browsers don't know 'microphone' — fall through */ }
    }
    // (2) Real probe via getUserMedia — opens the OS prompt if the user hasn't decided yet
    if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { ok:false, reason:"unsupported", hint:"Browser does not expose getUserMedia. Try Chrome, Edge, or Safari over HTTPS." };
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());   // close the test stream immediately
      return { ok:true };
    } catch (e) {
      if (e.name === "NotAllowedError" || e.name === "SecurityError")
        return { ok:false, reason:"blocked", hint:"Microphone blocked. On claude.ai the iframe sandbox prevents it — this works after deploying the IDE on your own domain or in Electron / VSCode webview." };
      if (e.name === "NotFoundError" || e.name === "DevicesNotFoundError")
        return { ok:false, reason:"no_mic", hint:"No microphone detected. Plug one in and retry." };
      if (e.name === "NotReadableError" || e.name === "TrackStartError")
        return { ok:false, reason:"mic_in_use", hint:"Another app is using the microphone. Close it and retry." };
      return { ok:false, reason:e.name||"unknown", hint:e.message||"Microphone access failed." };
    }
  };

  // ★ VOICE INPUT — Web Speech API dictation in the currently selected UI language.
  //    Now async: probes mic permission FIRST, gives a precise error if anything blocks it,
  //    then starts SpeechRecognition. Errors are prefixed "Voice input error:" so the UI
  //    layer can suppress the misleading "Falls back to default DC motor demo" hint.
  const toggleVoiceInput = async () => {
    if (voiceListening) {
      try { recognitionRef.current && recognitionRef.current.stop(); } catch (e) {}
      setVoiceListening(false);
      return;
    }
    const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) {
      setGenError("Voice input error: SpeechRecognition not supported in this browser. Try Chrome, Edge, or Safari.");
      return;
    }
    // Permission gate — distinguishes iframe blocking / user denial / no mic / mic in use
    const perm = await ensureMicPermission();
    if (!perm.ok) {
      setGenError(`Voice input error: ${perm.reason} — ${perm.hint}`);
      return;
    }
    const langMap = { en:"en-US", ar:"ar-SA", ru:"ru-RU", hi:"hi-IN", es:"es-ES", de:"de-DE", zh:"zh-CN", ja:"ja-JP" };
    const rec = new SR();
    rec.lang = langMap[lang] || "en-US";
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (ev) => {
      let txt = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        if (ev.results[i].isFinal) txt += ev.results[i][0].transcript;
      }
      if (txt) setProjectInput(prev => (prev ? prev + " " : "") + txt.trim());
    };
    rec.onerror = (e) => {
      setVoiceListening(false);
      const code = e.error || "unknown";
      // "not-allowed" can fire even after a successful getUserMedia if the iframe still blocks SR
      const hint = code === "not-allowed"
        ? "browser or iframe blocked SpeechRecognition. On claude.ai this is a sandbox restriction — works after deploying the IDE on your own domain or in Electron."
        : code === "no-speech" ? "no speech detected — try speaking closer to the mic."
        : code === "audio-capture" ? "no audio capture — check the microphone hardware."
        : code === "network" ? "network error — SpeechRecognition needs an internet connection on most browsers."
        : "unexpected — see console for details.";
      setGenError(`Voice input error: ${code} — ${hint}`);
    };
    rec.onend = () => setVoiceListening(false);
    try { rec.start(); recognitionRef.current = rec; setVoiceListening(true); }
    catch (e) { setGenError("Voice input error: could not start — " + (e.message || e)); }
  };

  // ★ TEXT-TO-SPEECH — AI Bashir actually speaks the reply aloud. Uses the browser's
  //    built-in speechSynthesis (no extra permissions, no external API key needed).
  //    Voice is chosen by current UI language (8-lang map). Sets ttsSpeaking state so the
  //    DigitalHumanHead mouth keeps animating for as long as audio plays — not just for
  //    as long as the API call is in flight.
  const ttsRef = useRef(null);
  // ★ Provider switch → auto-select its default model + clear stale error
  useEffect(()=>{
    const p = AI_PROVIDERS[selectedProvider];
    if (p && !p.models.find(m => m.id === selectedModel)) {
      setSelectedModel(p.defaultModel);
    }
  },[selectedProvider]);
  const speakWithBashir = (text) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      // Stop any utterance still playing — keeps DigitalHumanHead state clean
      window.speechSynthesis.cancel();
      const langMap = { en:"en-US", ar:"ar-SA", ru:"ru-RU", hi:"hi-IN", es:"es-ES", de:"de-DE", zh:"zh-CN", ja:"ja-JP" };
      // Strip markdown/emoji punctuation so TTS doesn't read "asterisk asterisk hardware asterisk asterisk"
      const clean = text.replace(/[#*_`~>\[\]\(\)]+/g, " ").replace(/\s+/g, " ").trim();
      // Cap length — most browsers choke past ~32k chars
      const u = new SpeechSynthesisUtterance(clean.slice(0, 4000));
      u.lang = langMap[lang] || "en-US";
      u.rate = 1.0; u.pitch = 1.0; u.volume = 1.0;
      u.onstart = () => setTtsSpeaking(true);
      u.onend   = () => setTtsSpeaking(false);
      u.onerror = () => setTtsSpeaking(false);
      ttsRef.current = u;
      window.speechSynthesis.speak(u);
    } catch (e) {
      console.warn("TTS failed:", e);
      setTtsSpeaking(false);
    }
  };

  // ★ Localized Command Genius guide — full translations supported for AR + RU;
  //    remaining 5 languages (HI/ES/DE/ZH/JA) fall back to English with a banner.
  //    PRO mode currently has AR fully translated; non-AR PRO falls back to English EN.
  const getActiveGuide = (mode, langCode) => {
    const tableModule = {
      en: CMDGEN_GUIDE,
      ar: CMDGEN_GUIDE_AR,
      ru: CMDGEN_GUIDE_RU,
      // hi/es/de/zh/ja → English fallback (translations pending)
    };
    const tablePro = {
      en: CMDGEN_GUIDE_PRO,
      ar: CMDGEN_GUIDE_PRO_AR,
      // ru/hi/es/de/zh/ja → English fallback (translations pending)
    };
    const tbl = mode === "pro" ? tablePro : tableModule;
    return tbl[langCode] || tbl.en;
  };

  const tog=useCallback(id=>setExp(p=>({...p,[id]:!p[id]})),[]);
  const cFor=bid=>CN.filter(c=>c.f===bid||c.t===bid).map(c=>c.id);
  const actC=hov&&!demoOn?cFor(hov):[];
  const ds=step>=0&&step<activeDemoArr.length?activeDemoArr[step]:null;
  const dBlk=ds?ds.blocks:[];
  const dCon=ds?ds.conns:[];

  // Editor typing animation: only active during step 4 (typing) onwards
  const editorTyping = demoOn && step >= 3;
  const typedCode = useTypewriter(EXAMPLE_CODE, editorTyping, 12);
  const codeToShow = !demoOn ? "" : (step >= 4 ? EXAMPLE_CODE : (step === 3 ? typedCode : ""));

  // AIA Codegen typing animation: active during step 9 (index 8) — typing the C++
  const genTyping = demoOn && step === 8;
  const typedGen = useTypewriter(GENERATED_CODE, genTyping, 8);
  const genToShow = !demoOn ? "" : (step >= 9 ? GENERATED_CODE : (step === 8 ? typedGen : ""));

  // Command Genius typing animation: ONLY at Step 16 (index 15 — final step)
  // Reads from main.umt, types char→word→line with realistic speed
  // ★ Toggles between CMDGEN_GUIDE (MODULE mode, L298N driver board)
  //    and CMDGEN_GUIDE_PRO (PRO mode, discrete schematic + BoM).
  //    ★ ALSO localized per current language (ar = Arabic full translation,
  //    other languages fall back to English).
  //    useTypewriter re-runs automatically when the target (guide) changes.
  const cmdTyping = demoOn && step === 15;
  const activeGuide = getActiveGuide(cmdMode, lang);
  // ★ 5× faster typing for Command Genius (was speed=6, 1 char/tick → now 5 chars/tick)
  const typedCmd = useTypewriter(activeGuide, cmdTyping, 6, 5);
  const cmdToShow = !demoOn ? "" : (step === 15 ? typedCmd : "");

  const go=()=>{setDemoOn(true);setStep(0);setHov(null);};
  const stop=()=>{setDemoOn(false);setStep(-1);clearTimeout(tmr.current);};
  const next=()=>{if(step<activeDemoArr.length-1)setStep(s=>s+1);else stop();};
  const prev=()=>{if(step>0)setStep(s=>s-1);};
  const auto=useCallback(()=>{
    setStep(s=>{
      if(s<activeDemoArr.length-1){tmr.current=setTimeout(auto,4500);return s+1;}
      setDemoOn(false);return -1;
    });
  },[]);

  return (
    <div style={{minHeight:"100vh",background:"#0c0a09",fontFamily:"'JetBrains Mono','Fira Code','SF Arabic','Geeza Pro','Segoe UI',Tahoma,'Noto Sans Arabic',system-ui,monospace",color:"#e7e5e4",padding:"8px 6px"}}>
      <style>{`
        @keyframes gp{0%,100%{opacity:.2}50%{opacity:.7}}
        @keyframes si{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pk{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
        @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
        @keyframes globe-spin{from{transform:rotateY(0deg)}to{transform:rotateY(360deg)}}
        @keyframes lang-pulse{0%,100%{box-shadow:0 0 0 0 rgba(234,88,12,.6)}50%{box-shadow:0 0 0 6px rgba(234,88,12,0)}}
        @keyframes drop-in{from{opacity:0;transform:translateY(-8px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes mic-pulse{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.7),0 0 0 0 rgba(239,68,68,.4)}50%{box-shadow:0 0 0 6px rgba(239,68,68,0),0 0 0 12px rgba(239,68,68,0)}}
        @keyframes send-fly{0%,100%{transform:translate(0,0) rotate(-20deg)}50%{transform:translate(2px,-2px) rotate(-10deg)}}
        @keyframes chat-fade-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin-slow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes dh-eye-blink{0%,46%,50%,96%,100%{transform:scaleY(1)}48%,98%{transform:scaleY(.1)}}
        @keyframes dh-mouth-talk{0%,100%{transform:scaleY(.35) scaleX(.85)}25%{transform:scaleY(1.15) scaleX(1)}50%{transform:scaleY(.55) scaleX(.9)}75%{transform:scaleY(1.3) scaleX(1.05)}}
        @keyframes dh-mouth-idle{0%,100%{transform:scaleY(.25) scaleX(.9)}50%{transform:scaleY(.35) scaleX(.92)}}
        @keyframes dh-grid{0%,100%{opacity:.18}50%{opacity:.45}}
        @keyframes dh-scan{0%{transform:translateY(-100%)}100%{transform:translateY(100%)}}
        @keyframes dh-aura{0%,100%{box-shadow:0 0 24px rgba(34,197,94,.3),0 0 48px rgba(34,197,94,.12)}50%{box-shadow:0 0 36px rgba(34,197,94,.55),0 0 72px rgba(34,197,94,.22)}}
        @keyframes dh-aura-listen{0%,100%{box-shadow:0 0 24px rgba(239,68,68,.35),0 0 48px rgba(239,68,68,.14)}50%{box-shadow:0 0 36px rgba(239,68,68,.6),0 0 72px rgba(239,68,68,.25)}}
        @keyframes dock-fade-in{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes dock-tooltip{from{opacity:0;transform:translate(-50%,-2px)}to{opacity:1;transform:translate(-50%,0)}}
        /* Flag emoji rendering — works on macOS/iOS natively; Windows/Linux fall back via Twemoji or system emoji fonts */
        .umt-flag {
          font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji",
                       "Twemoji Mozilla", "EmojiOne Color", "Android Emoji", sans-serif;
          font-style: normal;
          font-weight: normal;
          font-variant: normal;
          line-height: 1;
          display: inline-block;
        }
        .umt-flag-fallback {
          font-family: monospace;
          font-size: 0.78em;
          padding: 1px 4px;
          border: 1px solid currentColor;
          border-radius: 3px;
          letter-spacing: 0.5px;
          font-weight: 700;
          opacity: .85;
          display: inline-block;
          margin-right: 3px;
        }
        /* VR Role Switch — collapse to single column on phones + prevent overflow */
        @media (max-width: 700px) {
          .vrrs-grid { grid-template-columns: 1fr !important; }
          .vrrs-grid > * { min-width: 0 !important; }
        }
        .vrrs-grid > * { min-width: 0; }
        .vrrs-grid pre { max-width: 100% !important; }
      `}</style>

      {/* Title */}
      <div style={{maxWidth:760,margin:"0 auto 7px",background:"linear-gradient(135deg,#c2410c,#ea580c 40%,#d97706)",borderRadius:11,padding:"11px 18px",textAlign:"center",position:"relative",overflow:"hidden",boxShadow:"0 4px 25px rgba(194,65,12,.3)"}}>
        <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(135deg,transparent,transparent 3px,rgba(0,0,0,.04) 3px,rgba(0,0,0,.04) 6px)",pointerEvents:"none"}}/>
        <h1 style={{fontFamily:"'Georgia',serif",fontSize:18,fontWeight:700,color:"#fff",margin:0,position:"relative"}}>Pro_AmineUMT IDE with AI</h1>
        <div style={{display:"inline-block",background:"rgba(255,255,255,.17)",padding:"2px 13px",borderRadius:14,marginTop:4,fontSize:10.5,color:"#fef3c7",position:"relative"}}>Algorithm &amp; System Architecture Diagram &amp; Dependency Map — v4 (UMT 16×16 BGA Hybrid MCU (Microcontroller) / SoC (System-on-Chip Processor) Package Substrate Standard)</div>
        <div style={{fontSize:8,color:"#fed7aa77",marginTop:3,position:"relative"}}>Unified Microchip Technology · AI Bashir · Editor · AIA Engine Codegen · Command Genius · Simulator · MCU + SoC · 16-step demo</div>
      </div>

      {/* Controls */}
      <div style={{maxWidth:760,margin:"0 auto 5px",display:"flex",gap:5,justifyContent:"center",alignItems:"center",flexWrap:"wrap"}}>
        {!demoOn?
          <button onClick={go} style={{padding:"5px 16px",fontSize:10.5,borderRadius:5,cursor:"pointer",fontFamily:"inherit",fontWeight:700,background:"linear-gradient(135deg,#16a34a,#15803d)",color:"#fff",border:"none",boxShadow:"0 2px 10px rgba(22,163,74,.3)"}}>▶ Demo: AI Bashir → Genius Guide → NanoKit ESP32 — 16 Steps</button>
        :<button onClick={stop} style={{padding:"5px 16px",fontSize:10.5,borderRadius:5,cursor:"pointer",fontFamily:"inherit",fontWeight:700,background:"linear-gradient(135deg,#16a34a,#15803d)",color:"#fff",border:"none",boxShadow:"0 2px 10px rgba(22,163,74,.3)"}}>■ Stop Demo</button>}
        <div style={{width:1,height:18,background:"#2a2520",margin:"0 3px"}}/>
        {[.5,.6,.65,.75,.85,1].map(z=>(
          <button key={z} onClick={()=>setZoom(z)} style={{padding:"2px 7px",fontSize:8.5,borderRadius:3,cursor:"pointer",fontFamily:"monospace",border:`1px solid ${zoom===z?"#ea580c":"#1a1510"}`,background:zoom===z?"#ea580c":"transparent",color:zoom===z?"#fff":"#4a4540"}}>{Math.round(z*100)}%</button>
        ))}
        {/* Debug Mode Toggle — switches the entire pipeline between Run and Debug */}
        <div style={{width:1,height:18,background:"#2a2520",margin:"0 3px"}}/>
        <button
          onClick={()=>setDebugMode(d=>!d)}
          style={{
            padding:"3px 10px",fontSize:9.5,borderRadius:4,cursor:"pointer",fontFamily:"inherit",
            background:debugMode?"linear-gradient(135deg,#dc2626,#991b1b)":"linear-gradient(135deg,#16a34a,#15803d)",
            color:"#fff",border:"none",fontWeight:700,display:"flex",alignItems:"center",gap:5,
            boxShadow:debugMode?"0 0 0 2px rgba(220,38,38,.3)":"0 0 0 2px rgba(22,163,74,.3)",
            transition:"all .2s ease"
          }}
          title={debugMode?"Currently in DEBUG mode (compile with -g, JTAG/SWD flash, breakpoints active)":"Currently in RUN mode (release build, UART flash, no breakpoints)"}
        >
          <span style={{fontSize:11,animation:debugMode?"pk 1.4s ease-in-out infinite":"none"}}>{debugMode?"🐛":"▶"}</span>
          <span style={{fontSize:9}}>{debugMode?"DEBUG":"RUN"}</span>
          <span style={{fontSize:7,opacity:.7,marginLeft:2,letterSpacing:.5}}>MODE</span>
        </button>

        {/* Language Selector with rotating globe animation */}
        <div style={{position:"relative"}}>
          <button
            onClick={()=>setLangOpen(o=>!o)}
            style={{padding:"3px 10px",fontSize:9.5,borderRadius:4,cursor:"pointer",fontFamily:"inherit",background:langOpen?"#ea580c":"linear-gradient(135deg,#7c2d12,#9a3412)",color:"#fff",border:"none",fontWeight:700,display:"flex",alignItems:"center",gap:5,animation:langOpen?"none":"lang-pulse 2.5s ease-out infinite"}}
            title="Choose language for step explanations"
          >
            <span style={{display:"inline-block",animation:"globe-spin 3.5s linear infinite",transformStyle:"preserve-3d"}}>🌐</span>
            <span className="umt-flag" style={{fontSize:13}}>{curLang.flag}</span>
            <span className="umt-flag-fallback" style={{color:"#fff",borderColor:"#fff"}}>{curLang.code.toUpperCase()}</span>
            <span style={{fontSize:7,opacity:.7}}>{langOpen?"▲":"▼"}</span>
          </button>
          {langOpen && (
            <div style={{position:"absolute",top:"calc(100% + 4px)",right:0,background:"#1c1917",border:"1px solid #ea580c44",borderRadius:6,padding:4,minWidth:175,zIndex:50,boxShadow:"0 6px 20px rgba(0,0,0,.5)",animation:"drop-in .2s ease-out"}}>
              <div style={{fontSize:7.5,color:"#fbbf24",padding:"3px 8px 5px",borderBottom:"1px solid #2a2520",marginBottom:3,letterSpacing:.5,textTransform:"uppercase",fontWeight:700}}>
                Step Explanations Language
              </div>
              {LANGUAGES.map(L => (
                <button
                  key={L.code}
                  onClick={()=>{setLang(L.code);setLangOpen(false);}}
                  style={{
                    width:"100%",padding:"5px 8px",fontSize:10,borderRadius:3,cursor:"pointer",fontFamily:"inherit",
                    background:lang===L.code?"#ea580c":"transparent",
                    color:lang===L.code?"#fff":"#d6d3d1",
                    border:"none",textAlign:"left",display:"flex",alignItems:"center",gap:7,
                    direction:L.dir,
                    marginBottom:1
                  }}
                  onMouseOver={e=>{if(lang!==L.code)e.currentTarget.style.background="#292524";}}
                  onMouseOut={e=>{if(lang!==L.code)e.currentTarget.style.background="transparent";}}
                >
                  <span className="umt-flag" style={{fontSize:15,minWidth:18,textAlign:"center"}}>{L.flag}</span>
                  <span className="umt-flag-fallback" style={{
                    color:lang===L.code?"#fff":"#a8a29e",
                    borderColor:lang===L.code?"#fff":"#57534e",
                    fontSize:7.5
                  }}>{L.code.toUpperCase()}</span>
                  <span style={{flex:1,fontSize:10,fontWeight:lang===L.code?700:400}}>{L.name}</span>
                  {lang===L.code && <span style={{fontSize:10,fontWeight:700}}>✓</span>}
                </button>
              ))}
              <div style={{fontSize:7,color:"#a8a29e",padding:"6px 8px 2px",borderTop:"1px solid #2a2520",marginTop:3,lineHeight:1.4}}>
                Technical terms (VR_*, UMT, AIA, GPIO) <b style={{color:"#fbbf24"}}>always in English</b>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* DEBUG MODE INFO BANNER — only when debug is active, explains what changes */}
      {debugMode && (
        <div style={{maxWidth:760,margin:"0 auto 5px",padding:"7px 12px",background:"linear-gradient(90deg,#1a0a0a,#3a1010,#1a0a0a)",border:"1px solid #dc262644",borderRadius:6,fontSize:9,color:"#fca5a5",display:"flex",alignItems:"flex-start",gap:8,lineHeight:1.6,animation:"si .3s ease-out"}}>
          <span style={{fontSize:14}}>🐛</span>
          <div style={{flex:1}}>
            <b style={{color:"#fca5a5"}}>DEBUG MODE ACTIVE — Debug at Source, Run at Native</b>
            <span style={{color:"#a8a29e"}}> · Foundational Decision (v4.2): debugging happens at <code style={{color:"#4fc1ff",fontSize:8}}>.umt</code> source level, NEVER at generated C++. Mirrors TypeScript(.ts), CUDA(.cu), Flutter(.dart).</span>
            <div style={{marginTop:4,fontSize:8.5,color:"#a8a29e",lineHeight:1.7}}>
              <span style={{color:"#fca5a5"}}>① Source breakpoints:</span> clicks in <code style={{color:"#fbbf24",fontSize:8}}>.umt</code> gutter — <b>not</b> in <code style={{color:"#fbbf24",fontSize:8}}>main_generated.cpp</code> ·
              <span style={{color:"#fca5a5"}}> ② Source map:</span> <code style={{color:"#fbbf24",fontSize:8}}>.umt/cache/aia_map.json</code> maps .umt line → ELF symbol; reverse on halt ·
              <span style={{color:"#fca5a5"}}> ③ VR-level variables:</span> Watch shows <code style={{color:"#22c55e",fontSize:8}}>VR_PWM_OUT0.duty = 128</code> — NEVER <code style={{color:"#ef4444",fontSize:8}}>ledc_ch[0].duty = 0x80</code> ·
              <span style={{color:"#fca5a5"}}> ④ AIA Codegen:</span> compiles with <code style={{color:"#fbbf24",fontSize:8}}>-g</code> flag; embeds DWARF custom section <code style={{color:"#fbbf24",fontSize:8}}>.umt_vr_debug</code> ·
              <span style={{color:"#fca5a5"}}> ⑤ Flash via probe:</span> JTAG/SWD (not UART upload); openocd + gdb-multiarch ·
              <span style={{color:"#fca5a5"}}> ⑥ Monitor expands:</span> Variables · Watch · Call Stack · Step controls (Step Over / Step In / Continue) ·
              <span style={{color:"#fca5a5"}}> ⑦ Advanced View</span> (optional, read-only): inspect <code style={{color:"#fbbf24",fontSize:8}}>.umt/generated/main_generated.cpp</code> — like CUDA PTX viewer; cannot be edited
            </div>
            <div style={{marginTop:4,fontSize:7.5,color:"#78716c",fontStyle:"italic"}}>
              ⚠ Probe requirements: ESP32 (native USB-Serial JTAG, no extra probe), STM32 (ST-Link V2/V3), Pico (picoprobe SWD), UMT IC (BGA SWD pins 0xCB/0xCC), NanoKit-iM (connector pins 33-37). Without probe → Simulator debug only. 120× faster than Serial.print iteration (10 sec vs 20 min).
            </div>
          </div>
        </div>
      )}

      {/* DEMO SCOPE BANNER — explains that example uses 3 VRs but applies to all 45 interfaces */}
      <div style={{maxWidth:760,margin:"0 auto 5px",padding:"7px 12px",background:"linear-gradient(90deg,#1c1917,#2a1810,#1c1917)",border:"1px solid #ea580c33",borderRadius:6,fontSize:9,color:"#fbbf24",display:"flex",alignItems:"center",gap:8,lineHeight:1.5}}>
        <span style={{fontSize:13}}>💡</span>
        <div style={{flex:1}}>
          <b style={{color:"#fbbf24"}}>Demo Scope:</b>
          <span style={{color:"#a8a29e"}}> This walkthrough uses </span>
          <code style={{color:"#4fc1ff",background:"#0a0a0a",padding:"1px 4px",borderRadius:2,fontSize:8.5}}>VR_DAC1</code>
          <span style={{color:"#a8a29e"}}> · </span>
          <code style={{color:"#4fc1ff",background:"#0a0a0a",padding:"1px 4px",borderRadius:2,fontSize:8.5}}>VR_I2C_SDA0</code>
          <span style={{color:"#a8a29e"}}> · </span>
          <code style={{color:"#4fc1ff",background:"#0a0a0a",padding:"1px 4px",borderRadius:2,fontSize:8.5}}>VR_UART_TX2</code>
          <span style={{color:"#a8a29e"}}> as examples. The </span>
          <b style={{color:"#22c55e"}}>same ecosystem mechanism applies to ALL 45 UMT interfaces</b>
          <span style={{color:"#a8a29e"}}> across rows 0x0–0xF in the BGA 16×16 Hybrid v9 matrix (UART×4, SPI×2, I2C×2, USB×4, ADC×8, DAC×3, PWM×4, I2S×2, CAN, Ethernet, LPDDR, HDMI, PCIe, DisplayPort, MIPI CSI/DSI, LVDS, JTAG, SWD, VR_GPIO×16 ★, etc.).</span>
        </div>
      </div>

      {/* VR ROLE SWITCH — interactive dual-role demonstrator + glossary */}
      <VRRoleSwitch lang={lang} isRTL={curLang.dir==="rtl"}/>

      {/* ★ Demo running banner — relocated BELOW the Key container, ABOVE the step explanation ↓ */}
      {demoOn&&<div style={{maxWidth:760,margin:"0 auto 5px",textAlign:"center"}}>
        <div style={{display:"inline-block",fontSize:9.5,color:"#22c55e",fontWeight:700,padding:"4px 14px",background:"#0a0f0c",border:"1px solid #16a34a30",borderRadius:5}}>▶ Demo running — controls are below, above the step explanation ↓</div>
      </div>}

      {/* Step Navigation Controls — placed directly ABOVE the step explanation container */}
      {demoOn&&<div style={{maxWidth:760,margin:"0 auto 5px",display:"flex",gap:6,justifyContent:"center",alignItems:"center",flexWrap:"wrap",padding:"6px 8px",background:"#0a0f0c",border:"1px solid #16a34a25",borderRadius:7}}>
        <button onClick={prev} disabled={step<=0} style={{padding:"5px 14px",fontSize:10,borderRadius:5,cursor:step>0?"pointer":"default",fontFamily:"inherit",fontWeight:700,background:step>0?"#292524":"#1a1917",color:step>0?"#e7e5e4":"#57534e",border:"1px solid #33302a"}}>◀ Prev</button>
        <div style={{fontSize:11,color:"#22c55e",fontWeight:800,padding:"0 8px",minWidth:74,textAlign:"center"}}>{step+1} / {activeDemoArr.length}</div>
        <button onClick={next} style={{padding:"5px 16px",fontSize:10,borderRadius:5,cursor:"pointer",fontFamily:"inherit",fontWeight:700,background:"linear-gradient(135deg,#16a34a,#15803d)",color:"#fff",border:"none",boxShadow:"0 2px 8px rgba(22,163,74,.3)"}}>{step<activeDemoArr.length-1?"Next ▶":"✓ Done"}</button>
        <div style={{width:1,height:18,background:"#2a2520",margin:"0 2px"}}/>
        <button onClick={()=>{auto();}} style={{padding:"5px 12px",fontSize:10,borderRadius:5,cursor:"pointer",fontFamily:"inherit",fontWeight:700,background:"#292524",color:"#a8a29e",border:"1px solid #33302a"}}>▶▶ Auto</button>
        <button onClick={stop} style={{padding:"5px 12px",fontSize:10,borderRadius:5,cursor:"pointer",fontFamily:"inherit",fontWeight:700,background:"#292524",color:"#ef4444",border:"1px solid #33302a"}}>✕ Stop</button>
      </div>}

      {/* Step Info — uses translated text based on selected language */}
      {ds&&<div key={step+"-"+lang} style={{maxWidth:760,margin:"0 auto 5px",padding:"9px 13px",background:"#071210",border:"1px solid #16a34a35",borderRadius:7,animation:"si .3s ease-out",direction:curLang.dir}}>
        <div style={{fontSize:12,fontWeight:700,color:"#22c55e",marginBottom:3,direction:"ltr"}}>{ds.title}</div>
        <div style={{fontSize:9.5,color:"#6aaa80",lineHeight:1.7,whiteSpace:"pre-line"}}>{getStepText(step)}</div>
        {lang!=="en" && (
          <div style={{fontSize:7.5,color:"#78716c",marginTop:5,paddingTop:4,borderTop:"1px solid #16a34a15",direction:"ltr",fontStyle:"italic"}}>
            🌐 Translated to {curLang.name} — Technical terms (VR_*, UMT, AIA, GPIO, ESP32, ...) stay in English by design.
          </div>
        )}
      </div>}

      {/* Hover Info */}
      {hov&&!demoOn&&<div style={{maxWidth:760,margin:"0 auto 5px",padding:"5px 11px",background:"#1c1917",border:"1px solid #ea580c28",borderRadius:5,fontSize:9,color:"#6a6560",display:"flex",gap:5,flexWrap:"wrap"}}>
        <span style={{color:"#ea580c",fontWeight:700}}>{hov}:</span>
        {cFor(hov).map(cid=>{const c=CN.find(x=>x.id===cid);return c&&<span key={cid} style={{padding:"0 4px",background:"#0f0e0d",borderRadius:2}}>{c.d}</span>;})}
      </div>}

      {/* Canvas */}
      <div style={{overflow:"auto",maxHeight:"calc(100vh - 195px)",borderRadius:8,border:"1px solid #15120e"}}>
        <div style={{width:W*zoom,height:H*zoom,margin:"0 auto",position:"relative"}}>
          <div style={{position:"absolute",inset:0,width:W,height:H,transform:`scale(${zoom})`,transformOrigin:"top left"}}>

            <Arrows act={actC} dmo={dCon}/>

            {/* ★ macOS DOCK TOOLBAR — floats above the Code Editor block.
                Magnification on hover (1.5x / 1.22x / 1.07x cubic-bezier).
                Wires Debug toggle, Run/Auto, Halt/Stop, Reset, and Target A/B/C
                to the existing demo controls so the dock isn't just decorative. */}
            <MacDock
              editorX={BL.editor.x}
              editorW={BL.editor.w}
              debugMode={debugMode}
              demoOn={demoOn}
              activeTarget={activeTarget}
              onDebug={()=>setDebugMode(d=>!d)}
              onRun={()=>{ if(!demoOn) go(); else auto(); }}
              onHalt={stop}
              onReset={()=>{ stop(); setStep(0); }}
              onTargetSelect={(t)=>setActiveTarget(t)}
            />

            {/* ═══ USER ═══ */}
            <Bk id="user" color="#c2410c" grad="linear-gradient(160deg,#1c1917,#231a14)" dl={1}
              isA={hov==="user"} isD={dBlk.includes("user")}
              onE={()=>!demoOn&&setHov("user")} onL={()=>setHov(null)}>
              <Hd icon="👤" title="User / Developer" color="#c2410c" sm/>
              <It t="Pro_AmineUMT IDE UI" bold s="(Project · Code · Pins · Targets)"/>
              <It t="CLI / API" bold s="(automation, CI)"/>
            </Bk>

            {/* ═══ AI BASHIR CHAT (NEW) ═══ */}
            <Bk id="aiChat" color="#a78bfa" grad="linear-gradient(160deg,#1c1626,#1a1322)" glow dl={2}
              isA={hov==="aiChat"} isD={dBlk.includes("aiChat")}
              floatOver={projectInputOpen}
              onE={()=>!demoOn&&setHov("aiChat")} onL={()=>setHov(null)}>
              <Hd icon="🤖" title="AI Bashir" sub="AI Bashir Conversation with Developer" color="#a78bfa" sm/>

              {/* ★ AI PROVIDER CONFIGURATION — collapsible section per Voice System spec §5.
                   Developer selects provider + model, enters API key, tests connection, saves.
                   AI Bashir is always the visible assistant — the provider works transparently. */}
              <div style={{padding:"4px 10px 2px",borderBottom:"1px solid #2a2030"}}>
                <button onClick={(e)=>{e.stopPropagation();setProviderConfigOpen(o=>!o);setGenError("");}}
                        title="Configure which AI provider powers AI Bashir (Claude · ChatGPT · Gemini · DeepSeek · Kimi) and store your API key"
                        style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"3px 6px",fontSize:8,fontWeight:800,fontFamily:"'Inter',system-ui,sans-serif",letterSpacing:0.2,border:"1px solid "+(providerConfigOpen?"#a78bfa":"#a78bfa33"),borderRadius:5,background:providerConfigOpen?"linear-gradient(135deg,#1c1626,#2a1c3a)":"#150f1f",color:"#c4b5fd",cursor:"pointer",transition:"all .15s",userSelect:"none"}}>
                  <span>{providerConfigOpen ? "▼" : "▶"} 🔌 AI Provider</span>
                  <span style={{fontSize:7,color:"#8b7eb8",fontWeight:700}}>
                    {AI_PROVIDERS[selectedProvider]?.icon} {AI_PROVIDERS[selectedProvider]?.displayName}
                    {connectionStatus[selectedProvider]==="connected" && <span style={{color:"#22c55e",marginLeft:4}}>🟢</span>}
                    {connectionStatus[selectedProvider]==="failed"    && <span style={{color:"#ef4444",marginLeft:4}}>🔴</span>}
                    {connectionStatus[selectedProvider]==="testing"   && <span style={{color:"#fbbf24",marginLeft:4}}>⏳</span>}
                  </span>
                </button>

                {providerConfigOpen && (
                  <div style={{marginTop:5,padding:6,background:"#0e0a16",border:"1px solid #a78bfa33",borderRadius:5,animation:"drop-in .25s ease-out"}}>
                    {/* Provider selector */}
                    <div style={{fontSize:7,color:"#8b7eb8",fontWeight:700,letterSpacing:0.2,textTransform:"uppercase",marginBottom:3}}>Provider</div>
                    <select value={selectedProvider}
                            onChange={(e)=>{e.stopPropagation();setSelectedProvider(e.target.value);}}
                            style={{width:"100%",padding:"3px 5px",fontSize:8,fontFamily:"'Inter',system-ui,sans-serif",border:"1px solid #a78bfa44",borderRadius:4,background:"#0a0612",color:"#c4b5fd",outline:"none",cursor:"pointer",marginBottom:6}}>
                      {Object.values(AI_PROVIDERS).map(p=>(
                        <option key={p.id} value={p.id} style={{background:"#0e0a16"}}>{p.icon} {p.displayName}</option>
                      ))}
                    </select>

                    {/* Model selector — populates from selected provider's model list */}
                    <div style={{fontSize:7,color:"#8b7eb8",fontWeight:700,letterSpacing:0.2,textTransform:"uppercase",marginBottom:3}}>Model</div>
                    <select value={selectedModel}
                            onChange={(e)=>{e.stopPropagation();setSelectedModel(e.target.value);}}
                            style={{width:"100%",padding:"3px 5px",fontSize:8,fontFamily:"'Inter',system-ui,sans-serif",border:"1px solid #a78bfa44",borderRadius:4,background:"#0a0612",color:"#c4b5fd",outline:"none",cursor:"pointer",marginBottom:6}}>
                      {(AI_PROVIDERS[selectedProvider]?.models || []).map(m=>(
                        <option key={m.id} value={m.id} style={{background:"#0e0a16"}}>{m.label}</option>
                      ))}
                    </select>

                    {/* API Key input */}
                    <div style={{fontSize:7,color:"#8b7eb8",fontWeight:700,letterSpacing:0.2,textTransform:"uppercase",marginBottom:3}}>API Key</div>
                    <input type="password"
                           value={providerKeys[selectedProvider] || ""}
                           onChange={(e)=>{e.stopPropagation();setProviderKeys(k=>({...k, [selectedProvider]: e.target.value}));setConnectionStatus(s=>({...s, [selectedProvider]:"unknown"}));}}
                           placeholder={selectedProvider==="claude"?"sk-ant-...":selectedProvider==="openai"?"sk-...":selectedProvider==="gemini"?"AIza...":selectedProvider==="deepseek"?"sk-...":"sk-..."}
                           style={{width:"100%",padding:"3px 5px",fontSize:8,fontFamily:"'JetBrains Mono',ui-monospace,monospace",border:"1px solid #a78bfa44",borderRadius:4,background:"#0a0612",color:"#c4b5fd",outline:"none",boxSizing:"border-box",marginBottom:5}}
                    />

                    {/* Remember-key checkbox */}
                    <label style={{display:"flex",alignItems:"center",gap:4,fontSize:7.5,color:"#c4b5fd",cursor:"pointer",marginBottom:6}}>
                      <input type="checkbox" checked={rememberKey} onChange={(e)=>setRememberKey(e.target.checked)}
                             style={{cursor:"pointer",accentColor:"#a78bfa"}}/>
                      Remember API Key (encrypted local storage)
                    </label>

                    {/* Action buttons: Test / Save */}
                    <div style={{display:"flex",gap:4,marginBottom:5}}>
                      <button onClick={(e)=>{e.stopPropagation();testConnection();}}
                              disabled={testingConn||!(providerKeys[selectedProvider]||"").trim()}
                              style={{flex:1,padding:"4px 6px",fontSize:7.5,fontWeight:800,fontFamily:"inherit",border:"1px solid #fbbf2455",borderRadius:4,background:testingConn?"linear-gradient(135deg,#fbbf24,#d97706)":"#1a1408",color:testingConn?"#0a0805":"#fbbf24",cursor:(testingConn||!(providerKeys[selectedProvider]||"").trim())?"not-allowed":"pointer",transition:"all .15s",whiteSpace:"nowrap"}}>
                        {testingConn ? "⏳ Testing..." : "🔍 Test Connection"}
                      </button>
                      <button onClick={(e)=>{e.stopPropagation();saveProviderConfig();}}
                              disabled={!(providerKeys[selectedProvider]||"").trim()}
                              style={{flex:1,padding:"4px 6px",fontSize:7.5,fontWeight:800,fontFamily:"inherit",border:"none",borderRadius:4,background:providerSaved?"linear-gradient(135deg,#22c55e,#16a34a)":"linear-gradient(135deg,#a78bfa,#7c3aed)",color:"#fff",cursor:!(providerKeys[selectedProvider]||"").trim()?"not-allowed":"pointer",transition:"all .15s",whiteSpace:"nowrap"}}>
                        {providerSaved ? "✓ Saved" : "💾 Save"}
                      </button>
                    </div>

                    {/* Status line */}
                    <div style={{fontSize:7,color:"#8b7eb8",fontWeight:700,letterSpacing:0.2,textTransform:"uppercase",marginBottom:3}}>Status</div>
                    <div style={{padding:"3px 6px",fontSize:7.5,fontWeight:700,fontFamily:"'Inter',system-ui,sans-serif",borderRadius:4,background:"#0a0612",border:"1px solid #a78bfa22",color:
                        connectionStatus[selectedProvider]==="connected"?"#22c55e":
                        connectionStatus[selectedProvider]==="failed"?"#ef4444":
                        connectionStatus[selectedProvider]==="testing"?"#fbbf24":"#8b7eb8"}}>
                      {connectionStatus[selectedProvider]==="connected"?"🟢 Connected — key valid, ready to use":
                       connectionStatus[selectedProvider]==="failed"?"🔴 Connection failed — check key or endpoint":
                       connectionStatus[selectedProvider]==="testing"?"⏳ Testing connection...":
                       "⚪ Not tested yet — click Test Connection"}
                    </div>

                    {/* Info: multiple keys stored per provider */}
                    <div style={{marginTop:6,padding:4,fontSize:6.5,color:"#6a6080",lineHeight:1.4,fontStyle:"italic",background:"#0a0612",border:"1px solid #a78bfa22",borderRadius:3}}>
                      ★ Keys are stored <strong style={{color:"#a78bfa"}}>per-provider</strong> — you can save one for each and switch anytime without re-entering. In production: keytar (Electron), SecretStorage (VSCode), sessionStorage (Web).<br/>
                      ★ <strong style={{color:"#a78bfa"}}>AI Bashir remains the assistant</strong>. The selected provider ({AI_PROVIDERS[selectedProvider]?.displayName}) runs transparently in the background — the developer never talks to it directly.
                    </div>
                  </div>
                )}
              </div>

              <div style={{padding:"4px 10px"}}>
                <div style={{fontSize:9,fontWeight:700,color:ds?.hl?.aiChat==="chat"?"#22c55e":"#c4b5fd"}}>💬 Chat / 🎤 Voice Input</div>
                <div style={{fontSize:7.5,color:"#6a6080",marginTop:2}}>
                  {ds?.hl?.aiChat==="redirect"
                    ? "Developer: \"I'm following the steps. I'll reach out if I need you.\""
                    : (customDemo ? "Custom project: " + customProjectTitle : "Ask: \"I want to build a project...\"")}
                </div>
                {/* ★ NEW BUTTON: developer writes their own project idea instead of seeing the default DC motor demo */}
                <button onClick={(e)=>{e.stopPropagation();setProjectInputOpen(o=>!o);setGenError("");}}
                        title="Type your own project idea — the 16 demo steps will be regenerated by Claude API to describe YOUR project on NanoKit Integrated ESP32"
                        style={{marginTop:5,padding:"3px 7px",fontSize:8,fontWeight:800,fontFamily:"'Inter',system-ui,sans-serif",letterSpacing:0.2,border:"1px solid "+(projectInputOpen?"#22c55e":"#a78bfa55"),borderRadius:5,background:projectInputOpen?"linear-gradient(135deg,#22c55e,#16a34a)":(customDemo?"linear-gradient(135deg,#a78bfa,#7c3aed)":"#1c1626"),color:projectInputOpen?"#0a0a0a":(customDemo?"#fff":"#c4b5fd"),cursor:"pointer",transition:"all .15s",userSelect:"none",width:"100%",textAlign:curLang.dir==="rtl"?"right":"left",direction:curLang.dir}}>
                  {projectInputOpen
                    ? (WRITE_PROJECT_LABELS[lang]||WRITE_PROJECT_LABELS.en).close
                    : (customDemo
                       ? (WRITE_PROJECT_LABELS[lang]||WRITE_PROJECT_LABELS.en).active
                       : (WRITE_PROJECT_LABELS[lang]||WRITE_PROJECT_LABELS.en).open)}
                </button>
                {projectInputOpen && (
                  <div style={{marginTop:5,padding:6,background:"#0e0a16",border:"1px solid #a78bfa33",borderRadius:5,maxHeight:340,overflowY:"auto",animation:"drop-in .25s ease-out",direction:curLang.dir}}>
                    {/* ★ PLATFORM SELECTOR — 3 target platforms (Embedded / Mobile / HMI) */}
                    <div style={{fontSize:7,color:"#8b7eb8",fontWeight:700,marginBottom:3,letterSpacing:0.2,textTransform:"uppercase"}}>
                      {(WRITE_PROJECT_LABELS[lang]||WRITE_PROJECT_LABELS.en).platformLabel}
                    </div>
                    <div style={{display:"flex",gap:3,marginBottom:6,flexWrap:"wrap"}}>
                      {Object.values(PLATFORM_CONFIGS).map(p=>(
                        <button key={p.id}
                                onClick={(e)=>{e.stopPropagation();setCustomPlatform(p.id);}}
                                title={p.desc_en}
                                disabled={generating||refining}
                                style={{flex:"1 1 70px",minWidth:0,padding:"3px 5px",fontSize:7.5,fontWeight:800,fontFamily:"'Inter',system-ui,sans-serif",border:"1px solid "+(customPlatform===p.id?"#22c55e":"#a78bfa44"),borderRadius:4,background:customPlatform===p.id?"linear-gradient(135deg,#a78bfa,#7c3aed)":"#150f1f",color:customPlatform===p.id?"#fff":"#a78bfa99",cursor:(generating||refining)?"not-allowed":"pointer",transition:"all .15s",userSelect:"none",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                          {p.icon} {p[lang]||p.en}
                        </button>
                      ))}
                    </div>

                    {/* ★ CHAT HISTORY with AI Bashir (collapsible, scrollable) — shown only if any messages */}
                    {chatHistory.length > 0 && (
                      <div style={{marginBottom:6,maxHeight:130,overflowY:"auto",padding:5,background:"#0a0612",border:"1px solid #a78bfa22",borderRadius:4}}>
                        {chatHistory.map((m,i)=>(
                          <div key={i} style={{marginBottom:4,animation:"chat-fade-in .3s ease-out",direction:curLang.dir}}>
                            <div style={{fontSize:6.5,fontWeight:700,color:m.role==="user"?"#22c55e":"#a78bfa",marginBottom:1,letterSpacing:0.3,textTransform:"uppercase"}}>
                              {m.role==="user" ? "👤 You" : "🤖 AI Bashir"}
                            </div>
                            <div style={{fontSize:7.5,color:m.role==="user"?"#9aa0a6":"#c4b5fd",lineHeight:1.4,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
                              {m.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ★ DIGITAL HUMAN HEAD — appears when developer is speaking (voice mic active)
                         OR when AI Bashir is "speaking" back (refining via Claude API). Eyes blink,
                         mouth animates open/close, glowing aura colour-codes the state.
                         Mirrors Claude.ai's "Use voice mode" feel — gives the developer a sense of
                         conversing with a real entity instead of just typing into a textarea. */}
                    <DigitalHumanHead listening={voiceListening} speaking={refining||generatingMaster||ttsSpeaking}/>

                    {/* ★ TEXTAREA with animated mic + send icons (up to ~5000 words capacity) */}
                    <div style={{position:"relative"}}>
                      <textarea
                        value={projectInput}
                        onChange={(e)=>setProjectInput(e.target.value)}
                        placeholder={(WRITE_PROJECT_LABELS[lang]||WRITE_PROJECT_LABELS.en).placeholder}
                        dir={curLang.dir}
                        style={{width:"100%",minHeight:90,maxHeight:200,padding:"5px 38px 18px 5px",fontSize:8,fontFamily:"'Inter',system-ui,sans-serif",border:"1px solid "+(voiceListening?"#ef4444":"#a78bfa44"),borderRadius:4,background:"#0a0612",color:"#c4b5fd",resize:"vertical",outline:"none",boxSizing:"border-box",lineHeight:1.5,transition:"border-color .2s",direction:curLang.dir}}
                        disabled={generating||refining}
                      />
                      {/* ★ Animated MIC icon — Web Speech API voice input in current UI language */}
                      <button onClick={(e)=>{e.stopPropagation();toggleVoiceInput();}}
                              disabled={generating||refining}
                              title={(WRITE_PROJECT_LABELS[lang]||WRITE_PROJECT_LABELS.en).voiceTip}
                              style={{position:"absolute",top:4,right:4,width:24,height:24,padding:0,fontSize:11,border:"1px solid "+(voiceListening?"#ef4444":"#a78bfa55"),borderRadius:"50%",background:voiceListening?"linear-gradient(135deg,#ef4444,#b91c1c)":"#150f1f",color:voiceListening?"#fff":"#a78bfa",cursor:(generating||refining)?"not-allowed":"pointer",transition:"all .15s",animation:voiceListening?"mic-pulse 1.2s ease-in-out infinite":"none",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>
                        🎤
                      </button>
                      {/* ★ Animated SEND icon — sends current text to Claude for prompt refinement */}
                      <button onClick={(e)=>{e.stopPropagation();refineWithBashir();}}
                              disabled={generating||refining||!projectInput.trim()}
                              title={(WRITE_PROJECT_LABELS[lang]||WRITE_PROJECT_LABELS.en).sendTip}
                              style={{position:"absolute",top:32,right:4,width:24,height:24,padding:0,fontSize:11,border:"1px solid "+(refining?"#22c55e":"#a78bfa55"),borderRadius:"50%",background:refining?"linear-gradient(135deg,#22c55e,#16a34a)":(projectInput.trim()?"linear-gradient(135deg,#a78bfa,#7c3aed)":"#150f1f"),color:(refining||projectInput.trim())?"#fff":"#5a4070",cursor:(generating||refining||!projectInput.trim())?"not-allowed":"pointer",transition:"all .15s",animation:refining?"spin-slow 1.2s linear infinite":(projectInput.trim()?"send-fly 1.4s ease-in-out infinite":"none"),display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>
                        {refining ? "⏳" : "✈"}
                      </button>
                      {/* Word count indicator (bottom of textarea) */}
                      <div style={{position:"absolute",bottom:3,right:8,fontSize:6.5,color:"#5a4070",pointerEvents:"none",fontFamily:"'Inter',system-ui,sans-serif"}}>
                        {projectInput.trim().split(/\s+/).filter(Boolean).length} {(WRITE_PROJECT_LABELS[lang]||WRITE_PROJECT_LABELS.en).wordCount} / 5000
                      </div>
                    </div>

                    {/* ★ INTERVIEW READY BADGE — appears when AI Bashir signals it has
                         enough information to generate the Master Prompt. Animates in to
                         draw attention to the new "Generate Master Prompt" action below. */}
                    {interviewReady && !generatingMaster && (
                      <div style={{marginTop:5,padding:5,fontSize:7.5,fontWeight:700,color:"#86efac",background:"linear-gradient(135deg,#0a1a0e,#0e1f12)",border:"1px solid #22c55e55",borderRadius:4,lineHeight:1.4,animation:"drop-in .35s ease-out",direction:curLang.dir}}>
                        {(WRITE_PROJECT_LABELS[lang]||WRITE_PROJECT_LABELS.en).interviewReady}
                      </div>
                    )}

                    {/* ★ GENERATE MASTER PROMPT button — appears only when interviewReady is
                         true. Triggers the second-stage API call that synthesises the full
                         project specification from the interview chat. */}
                    {interviewReady && (
                      <button onClick={(e)=>{e.stopPropagation();generateMasterPrompt();}}
                              disabled={generating||refining||generatingMaster}
                              title={(WRITE_PROJECT_LABELS[lang]||WRITE_PROJECT_LABELS.en).masterPromptTip}
                              style={{marginTop:4,width:"100%",padding:"5px 8px",fontSize:8,fontWeight:800,fontFamily:"inherit",letterSpacing:0.2,border:"1px solid #22c55e88",borderRadius:4,background:generatingMaster?"linear-gradient(135deg,#22c55e,#15803d)":"linear-gradient(135deg,#0a1f0e,#15803d)",color:"#fff",cursor:(generating||refining||generatingMaster)?"not-allowed":"pointer",transition:"all .15s",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",animation:"drop-in .35s ease-out"}}>
                        {generatingMaster ? "⏳ ..." : (WRITE_PROJECT_LABELS[lang]||WRITE_PROJECT_LABELS.en).masterPrompt}
                      </button>
                    )}

                    {/* ★ ACTION BUTTONS row: Generate · Interview · Reset */}
                    <div style={{display:"flex",gap:4,marginTop:5,alignItems:"center",flexWrap:"wrap"}}>
                      <button onClick={(e)=>{e.stopPropagation();generateCustomProject();}}
                              disabled={generating||refining||generatingMaster||!projectInput.trim()}
                              style={{flex:"2 1 100px",minWidth:0,padding:"4px 8px",fontSize:8,fontWeight:800,fontFamily:"inherit",letterSpacing:0.2,border:"none",borderRadius:4,background:(generating||refining||generatingMaster||!projectInput.trim())?"#2a2030":"linear-gradient(135deg,#22c55e,#15803d)",color:(generating||refining||generatingMaster||!projectInput.trim())?"#5a4070":"#fff",cursor:(generating||refining||generatingMaster||!projectInput.trim())?"not-allowed":"pointer",transition:"all .15s",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                        {generating ? "⏳ ..." : (WRITE_PROJECT_LABELS[lang]||WRITE_PROJECT_LABELS.en).generate}
                      </button>
                      <button onClick={(e)=>{e.stopPropagation();refineWithBashir();}}
                              disabled={generating||refining||generatingMaster||!projectInput.trim()}
                              style={{flex:"1 1 80px",minWidth:0,padding:"4px 6px",fontSize:7.5,fontWeight:800,fontFamily:"inherit",border:"1px solid #a78bfa55",borderRadius:4,background:refining?"linear-gradient(135deg,#a78bfa,#7c3aed)":"#1c1626",color:refining?"#fff":"#c4b5fd",cursor:(generating||refining||generatingMaster||!projectInput.trim())?"not-allowed":"pointer",transition:"all .15s",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                        {refining ? "⏳ ..." : (WRITE_PROJECT_LABELS[lang]||WRITE_PROJECT_LABELS.en).refine}
                      </button>
                      {(customDemo || chatHistory.length>0 || masterPrompt) && (
                        <button onClick={(e)=>{e.stopPropagation();resetCustomProject();}}
                                disabled={generating||refining||generatingMaster}
                                title="Reset to default DC motor project and clear interview history"
                                style={{padding:"4px 6px",fontSize:7.5,fontWeight:800,fontFamily:"inherit",border:"1px solid #f43f5e55",borderRadius:4,background:"#1a0a14",color:"#fca5a5",cursor:(generating||refining||generatingMaster)?"not-allowed":"pointer",transition:"all .15s",whiteSpace:"nowrap"}}>
                          {(WRITE_PROJECT_LABELS[lang]||WRITE_PROJECT_LABELS.en).reset}
                        </button>
                      )}
                    </div>

                    {/* ★ ERROR display — context-aware:
                         • Voice errors get a "How to fix" hint (no misleading DC-motor fallback)
                         • Generation/Master-Prompt errors keep the fallback notice */}
                    {genError && (
                      <div style={{marginTop:4,padding:4,fontSize:7,color:"#fca5a5",background:"#1a0a14",border:"1px solid #f43f5e55",borderRadius:3,lineHeight:1.35}}>
                        ⚠ {genError}
                        {genError.toLowerCase().startsWith("voice input error") ? (
                          <div style={{color:"#fca5a566",fontStyle:"italic",marginTop:3,paddingTop:3,borderTop:"1px dashed #f43f5e33"}}>
                            <strong style={{color:"#fca5a5cc"}}>How to fix:</strong> On <strong>claude.ai</strong> the artifact iframe blocks the microphone — this is expected. Voice works after deploying Pro_AmineUMT IDE on your own HTTPS domain, inside Electron, or as a VSCode webview. You can keep typing in the textarea normally.
                          </div>
                        ) : (
                          <div style={{color:"#fca5a566",fontStyle:"italic",marginTop:2}}>Falls back to default DC motor demo.</div>
                        )}
                      </div>
                    )}

                    {/* ★ DISCLAIMER — NanoKit-only + Claude subscription required */}
                    <div style={{marginTop:5,padding:4,fontSize:6.5,color:"#6a6080",lineHeight:1.4,fontStyle:"italic",background:"#0a0612",border:"1px solid #a78bfa22",borderRadius:3}}>
                      ⚠ Only <strong style={{color:"#a78bfa"}}>NanoKit Integrated ESP32</strong> is supported as the firmware target at this time. The mobile (Flutter) and HMI (C# / VS) options describe a HOST app that connects to that same NanoKit ESP32.<br/>
                      ⚠ This feature uses <strong style={{color:"#a78bfa"}}>Claude API tokens</strong> — Claude subscription is required when deployed. Both 🪄 Generate and 💬 Refine consume tokens (Claude Sonnet 4.6, max 1000 tok / call).<br/>
                      ★ Your description is sent to Claude, which rewrites all 16 demo step descriptions to reflect YOUR project. Block diagram + animations remain identical — only the step text changes.
                    </div>
                  </div>
                )}
              </div>
              <div style={{padding:"3px 10px",borderTop:"1px solid #2a2030",background:ds?.hl?.aiChat==="redirect"?"#0a1a0e":"transparent",borderLeft:ds?.hl?.aiChat==="redirect"?"3px solid #22c55e":"3px solid transparent",transition:"all .3s"}}>
                <div style={{fontSize:9,fontWeight:700,color:ds?.hl?.aiChat==="reply"?"#22c55e":(ds?.hl?.aiChat==="writing"?"#22c55e":(ds?.hl?.aiChat==="redirect"?"#22c55e":"#a78bfa"))}}>🗨️ AI Reply / Writes Code</div>
                <div style={{fontSize:7.5,color:ds?.hl?.aiChat==="redirect"?"#16a34a88":"#6a6080",marginTop:2}}>
                  {ds?.hl?.aiChat==="redirect"
                    ? "\"Go to Command Genius for step-by-step guide\""
                    : "Asks: \"Which board?\" · Writes .umt code"}
                </div>
              </div>
              <div style={{padding:"3px 10px",borderTop:"1px solid #2a2030",fontSize:7,color:"#5a4070"}}>
                Active: <span style={{color:"#a78bfa",fontWeight:700}}>{AI_PROVIDERS[selectedProvider]?.displayName}</span> · <span style={{color:"#c4b5fd"}}>{selectedModel}</span>
                {connectionStatus[selectedProvider]==="connected" && <span style={{color:"#22c55e",marginLeft:4}}>🟢</span>}
              </div>
            </Bk>

            {/* ═══ CODE EDITOR (NEW) ═══ */}
            <Bk id="editor" color="#10b981" grad="linear-gradient(160deg,#0a1814,#0f1c18)" dl={3}
              isA={hov==="editor"} isD={dBlk.includes("editor")}
              onE={()=>!demoOn&&setHov("editor")} onL={()=>setHov(null)}>
              <div style={{padding:"5px 10px",background:"linear-gradient(135deg,#10b98115,#10b98106)",borderBottom:"1px solid #10b98122",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{fontSize:11}}>📝</span>
                  <div>
                    <div style={{fontFamily:"'Georgia',serif",fontSize:11,fontWeight:700,color:ds?.hl?.editor?"#22c55e":"#fef3c7"}}>Code Editor — main.umt</div>
                    <div style={{fontSize:7.5,color:"#10b98199"}}>Syntax: VR cyan · UMT.* yellow · methods light blue</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  {/* ★ Copy button — copies EXAMPLE_CODE (or current main.umt content) to clipboard */}
                  <button onClick={(e)=>{e.stopPropagation();copyToClipboard(EXAMPLE_CODE,"editor");}}
                          title="Copy main.umt code to clipboard"
                          style={{padding:"3px 7px",fontSize:8,fontWeight:800,fontFamily:"'Inter',system-ui,sans-serif",letterSpacing:0.2,border:"1px solid #10b98155",borderRadius:5,background:copied==="editor"?"linear-gradient(135deg,#22c55e,#16a34a)":"#0a1814",color:copied==="editor"?"#0a0a0a":"#10b981",cursor:"pointer",transition:"all .15s",userSelect:"none"}}>
                    {copied==="editor" ? "✓ Copied" : "📋 Copy"}
                  </button>
                  <div style={{display:"flex",gap:3}}>
                    <span style={{width:6,height:6,borderRadius:"50%",background:"#ef4444"}}/>
                    <span style={{width:6,height:6,borderRadius:"50%",background:"#fbbf24"}}/>
                    <span style={{width:6,height:6,borderRadius:"50%",background:"#22c55e"}}/>
                  </div>
                </div>
              </div>
              <div style={{padding:"6px 10px",fontSize:8,fontFamily:"'JetBrains Mono',monospace",lineHeight:1.5,color:"#9aa0a6",background:"#0a0a0a",minHeight:130,maxHeight:155,overflowY:"auto",whiteSpace:"pre-wrap",wordBreak:"break-all"}}>
                {!demoOn || step < 3
                  ? <span style={{color:"#78716c",fontStyle:"italic"}}>// Code will appear here when AI Bashir generates it...{"\n\n"}// Or you can write your own code directly.</span>
                  : <>
                      {highlight(codeToShow).map((tok,i)=>(
                        <span key={i} style={{color:tok.c,fontStyle:tok.it?"italic":"normal"}}>{tok.t}</span>
                      ))}
                      {step === 3 && codeToShow.length < EXAMPLE_CODE.length && (
                        <span style={{color:"#22c55e",animation:"blink 1s infinite",fontWeight:700}}>▎</span>
                      )}
                    </>
                }
              </div>
              {ds?.hl?.editor==="complete" && (
                <div style={{padding:"4px 10px",background:"#0a1a14",borderTop:"1px solid #10b98140",fontSize:8.5,color:"#22c55e",textAlign:"center",fontStyle:"italic"}}>
                  💡 If you want to add something, you can. Or developer can write something directly.
                </div>
              )}
            </Bk>

            {/* ═══ AIA ENGINE CODEGEN OUTPUT (v4) — Hidden C++ written by AIA Engine ═══ */}
            <Bk id="aiGen" color="#f43f5e" grad="linear-gradient(160deg,#1a0a14,#1f0f18)" dl={5}
              isA={hov==="aiGen"} isD={dBlk.includes("aiGen")}
              onE={()=>!demoOn&&setHov("aiGen")} onL={()=>setHov(null)}>
              <div style={{padding:"5px 10px",background:"linear-gradient(135deg,#f43f5e15,#f43f5e06)",borderBottom:"1px solid #f43f5e22",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{fontSize:11}}>🔒</span>
                  <div>
                    <div style={{fontFamily:"'Georgia',serif",fontSize:11,fontWeight:700,color:ds?.hl?.aiGen?"#22c55e":"#fef3c7"}}>
                      AIA Engine Codegen — main_generated.cpp
                    </div>
                    <div style={{fontSize:7.5,color:"#f43f5e99"}}>
                      AIA Engine = Abstraction Intelligence Algorithm Engine · Hidden from developer
                    </div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  {/* ★ Copy button — copies generated C++ (main_generated.cpp) to clipboard */}
                  <button onClick={(e)=>{e.stopPropagation();copyToClipboard(GENERATED_CODE,"aia");}}
                          title="Copy generated main_generated.cpp to clipboard"
                          style={{padding:"3px 7px",fontSize:8,fontWeight:800,fontFamily:"'Inter',system-ui,sans-serif",letterSpacing:0.2,border:"1px solid #f43f5e55",borderRadius:5,background:copied==="aia"?"linear-gradient(135deg,#22c55e,#16a34a)":"#1a0a14",color:copied==="aia"?"#0a0a0a":"#fca5a5",cursor:"pointer",transition:"all .15s",userSelect:"none"}}>
                    {copied==="aia" ? "✓ Copied" : "📋 Copy"}
                  </button>
                  <span style={{fontSize:8,padding:"2px 6px",background:"#f43f5e22",border:"1px solid #f43f5e44",borderRadius:3,color:"#fca5a5",fontWeight:700}}>HIDDEN</span>
                </div>
              </div>
              <div style={{padding:"4px 10px",background:"#1a0a14",borderBottom:"1px solid #f43f5e18",fontSize:7.5,color:"#fca5a588",display:"flex",gap:8,flexWrap:"wrap"}}>
                <span><strong style={{color:"#f43f5e"}}>Lang:</strong> C++ (Arduino-ESP32)</span>
                <span><strong style={{color:"#f43f5e"}}>SDK:</strong> Arduino Core</span>
                <span><strong style={{color:"#f43f5e"}}>Platform:</strong> Espressif ESP32</span>
              </div>
              <div style={{padding:"6px 10px",fontSize:8,fontFamily:"'JetBrains Mono',monospace",lineHeight:1.5,color:"#9aa0a6",background:"#0a0507",minHeight:118,maxHeight:138,overflowY:"auto",whiteSpace:"pre-wrap",wordBreak:"break-all"}}>
                {!demoOn || step < 8
                  ? <span style={{color:"#78716c",fontStyle:"italic"}}>// AIA Engine generates Arduino-ESP32 C++ here.{"\n"}// 🔒 Developer NEVER sees this in real Pro_AmineUMT IDE.{"\n"}// Shown here for educational purpose only.</span>
                  : <>
                      {highlight(genToShow).map((tok,i)=>(
                        <span key={i} style={{color:tok.c,fontStyle:tok.it?"italic":"normal"}}>{tok.t}</span>
                      ))}
                      {step === 8 && genToShow.length < GENERATED_CODE.length && (
                        <span style={{color:"#f43f5e",animation:"blink 1s infinite",fontWeight:700}}>▎</span>
                      )}
                    </>
                }
              </div>
              {ds?.hl?.aiGen==="writing" && (
                <div style={{padding:"4px 10px",background:"#1a0a14",borderTop:"1px solid #f43f5e40",fontSize:8.5,color:"#fca5a5",textAlign:"center",fontStyle:"italic"}}>
                  ⚠ Developer in real Pro_AmineUMT IDE NEVER sees this — Arduino is a hidden execution pawn
                </div>
              )}
            </Bk>

            {/* ═══ COMMAND — A GENIUS GUIDES YOU (FINAL STEP — Educational Walkthrough) ═══ */}
            <Bk id="cmdGen" color="#fbbf24" grad="linear-gradient(160deg,#1a1408,#1c1610)" dl={6}
              isA={hov==="cmdGen"} isD={dBlk.includes("cmdGen")}
              onE={()=>!demoOn&&setHov("cmdGen")} onL={()=>setHov(null)}>
              <div style={{padding:"5px 10px",background:"linear-gradient(135deg,#fbbf2418,#fbbf2406)",borderBottom:"1px solid #fbbf2433",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{fontSize:13}}>💡</span>
                  <div>
                    <div style={{fontFamily:"'Georgia',serif",fontSize:11.5,fontWeight:700,color:ds?.hl?.cmdGen?"#22c55e":"#fef3c7"}}>
                      Command — A Genius Guides You
                    </div>
                    <div style={{fontSize:7.5,color:"#fbbf2499"}}>
                      In-IDE panel (like unifying Terminal/Build/Debug Console/Output/cmd/Problem output in VSCode &amp; Antigravity) · reads main.umt · UMT VR syntax
                    </div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  {/* ★ Copy button — copies the current ACTIVE guide (mode + lang) to clipboard
                       AND pushes the same text into the AI Bashir projectInput (overlapping
                       container), opening the panel — so the developer can immediately hand
                       the guide to AI Bashir / Claude for follow-up questions or refinement. */}
                  <button onClick={(e)=>{e.stopPropagation();copyToClipboard(activeGuide,"cmdgen");setProjectInput(activeGuide);setProjectInputOpen(true);}}
                          title="Copy the active Command Genius guide to clipboard AND push it into the AI Bashir input box (so you can ask Claude follow-up questions about it)"
                          style={{padding:"3px 7px",fontSize:8,fontWeight:800,fontFamily:"'Inter',system-ui,sans-serif",letterSpacing:0.2,border:"1px solid #fbbf2455",borderRadius:5,background:copied==="cmdgen"?"linear-gradient(135deg,#22c55e,#16a34a)":"#1a1408",color:copied==="cmdgen"?"#0a0805":"#fbbf24",cursor:"pointer",transition:"all .15s",userSelect:"none"}}>
                    {copied==="cmdgen" ? "✓ Copied → AI Bashir" : "📋 Copy → AI Bashir"}
                  </button>
                  {/* ★ MODULE ↔ PRO mode switch (toggles wiring style: ready modules vs discrete schematic) */}
                  <div title="Switch wiring style: MODULE = ready peripheral boards (L298N, OLED, Relay, NRF24L01, LoRa, GPS, RFID, Motor/Servo Driver, CAN Bus, etc.) · PRO = discrete schematic with optocoupler + MOSFET + flyback diode + decoupling caps + resistors (SMD by default, THT for high-V/I parts)"
                       style={{display:"flex",alignItems:"center",gap:0,border:"1px solid #fbbf2455",borderRadius:9,overflow:"hidden",background:"#1a1408",fontSize:7.5,fontWeight:800,fontFamily:"'Inter',system-ui,sans-serif",letterSpacing:0.2,cursor:"pointer",userSelect:"none"}}>
                  <button onClick={(e)=>{e.stopPropagation();setCmdMode("module");}}
                          style={{padding:"3px 7px",border:"none",background:cmdMode==="module"?"linear-gradient(135deg,#fbbf24,#d97706)":"transparent",color:cmdMode==="module"?"#1a1408":"#fbbf2499",cursor:"pointer",fontWeight:800,fontFamily:"inherit",fontSize:"inherit",transition:"all .15s"}}>
                    📦 MODULE
                  </button>
                  <button onClick={(e)=>{e.stopPropagation();setCmdMode("pro");}}
                          style={{padding:"3px 7px",border:"none",background:cmdMode==="pro"?"linear-gradient(135deg,#22c55e,#15803d)":"transparent",color:cmdMode==="pro"?"#0a0805":"#fbbf2499",cursor:"pointer",fontWeight:800,fontFamily:"inherit",fontSize:"inherit",transition:"all .15s"}}>
                    ⚙ PRO
                  </button>
                  </div>
                </div>
              </div>
              <div style={{padding:"5px 10px",background:"#0a0805",borderBottom:"1px solid #fbbf2422",fontSize:8,color:"#fbbf2499",fontStyle:"italic",display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:10}}>🤖</span>
                <span>AI Bashir asks: "Do you need explanation? Or do you need more guidance on this code?"</span>
              </div>
              <div style={{padding:"6px 10px",fontSize:7.5,fontFamily:"'JetBrains Mono',monospace",lineHeight:1.55,background:"#0a0805",minHeight:130,maxHeight:148,overflowY:"auto",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
                {!demoOn || step < 15
                  ? <span style={{color:"#78716c",fontStyle:"italic"}}>// Command Genius Guide will appear at the FINAL step.{"\n"}// Reads from Code Editor — main.umt (UMT VR syntax){"\n"}// Wiring + Algorithm + Flowchart + Pseudocode</span>
                  : <>
                      {highlight(cmdToShow).map((tok,i)=>(
                        <span key={i} style={{color:tok.c,fontStyle:tok.it?"italic":"normal"}}>{tok.t}</span>
                      ))}
                      {step === 15 && cmdToShow.length < activeGuide.length && (
                        <span style={{color:"#fbbf24",animation:"blink 1s infinite",fontWeight:700}}>▎</span>
                      )}
                    </>
                }
              </div>
              {ds?.hl?.cmdGen==="guide" && (
                <div style={{padding:"4px 10px",background:"#1a1408",borderTop:"1px solid #fbbf2440",fontSize:8.5,color:"#fbbf24",textAlign:"center",fontStyle:"italic"}}>
                  ✨ Teaching the developer the CORRECT way — UMT VR syntax only, NO Arduino/Espressif
                </div>
              )}
            </Bk>

            {/* ═══ UMT SDK / FRAMEWORK / AIA ═══ */}
            <Bk id="fw" color="#ea580c" grad="linear-gradient(160deg,#2a1a0f,#1c1510 50%,#1a1208)" glow dl={4}
              isA={hov==="fw"} isD={dBlk.includes("fw")}
              onE={()=>!demoOn&&setHov("fw")} onL={()=>setHov(null)} onClick={()=>tog("aia")}>
              <div style={{padding:"7px 11px",background:"linear-gradient(135deg,#ea580c15,#c2410c06)",borderBottom:"1px solid #ea580c20",textAlign:"center"}}>
                <div style={{fontFamily:"'Georgia',serif",fontSize:14.5,fontWeight:800,color:"#fef3c7"}}>Pro_AmineUMT</div>
                <div style={{fontFamily:"'Georgia',serif",fontSize:12.5,fontWeight:700,color:"#fbbf24"}}>UMT SDK / Framework</div>
                <div style={{fontSize:8,color:"#ea580c88",marginTop:2,lineHeight:1.4}}>Smart Abstraction Layer — Interface() · Interface_Pin() · Digital_Pin()</div>
              </div>
              <div style={{padding:"2px 0"}}>
                <div style={{padding:"4px 10px",display:"flex",alignItems:"center",gap:6,borderBottom:"1px solid #2a201a",cursor:"pointer"}}>
                  <span style={{fontSize:13}}>🤖</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:10.5,fontWeight:700,color:ds?.hl?.fw==="AI Agent"?"#22c55e":"#fbbf24"}}>AIA Engine</div>
                    <div style={{fontSize:7.5,color:"#4a4540"}}>(7-step deterministic pipeline)</div>
                  </div>
                  <span style={{color:"#4a4540",fontSize:9,transition:"transform .2s",transform:exp.aia?"rotate(90deg)":""}}>▶</span>
                </div>
                {exp.aia&&<div style={{padding:"3px 10px 3px 32px",background:"#0f0e0d",animation:"si .2s"}}>
                  {["Parse VR intent (Digital or Interface?)","Full MCU pin scan (3 criteria match)","Symbolic token matching {UART|RX|0}","Functional cloning → bind GPIO→VR","Conflict check (Rule Engine DETERMINISTIC)","Backend codegen (Arduino/ESP-IDF/Zephyr — hidden)","Codegen + compile (sandboxed child process)"].map((s,i)=>(
                    <div key={i} style={{fontSize:8.5,color:"#8a8580",marginBottom:1}}><span style={{color:"#ea580c",fontWeight:700,marginRight:4}}>{i+1}</span>{s}</div>
                  ))}
                </div>}
                {[
                  {t:"Code & Config Generator",s:"(UMT-IR → C/C++ — hidden)",k:null},
                  {t:"Static checks + hints",s:"(flash-reserved, conflicts, Rule Engine)",k:"Static Checks"},
                  {t:"Unified Peripherals",s:"Interface() · Interface_Pin() · Digital_Pin()",k:null},
                  {t:"Virtual Pin/Function Mapper",s:"(VR_UART_RX0 → GPIO3)",k:"Pin Mapper"},
                ].map((it,i)=>(
                  <div key={i} style={{padding:"3px 10px",borderBottom:"1px solid #15120e",background:ds?.hl?.fw===it.k?"#0a1a0e":"transparent",transition:"background .3s"}}>
                    <div style={{fontSize:9.5,fontWeight:700,color:ds?.hl?.fw===it.k?"#22c55e":"#c8c4c0"}}>{it.t}</div>
                    <div style={{fontSize:7.5,color:"#78716c"}}>{it.s}</div>
                  </div>
                ))}
                <div style={{padding:"4px 10px",borderTop:"1px solid #2a201a",background:ds?.hl?.fw==="UMT-IR"?"#0a1a0e":"transparent",transition:"background .3s"}}>
                  <div style={{fontSize:9,color:ds?.hl?.fw==="UMT-IR"?"#22c55e":"#ea580c",fontWeight:700}}>+ UMT IC Packaging Spec Layer</div>
                  <div style={{fontSize:9,color:"#ea580c",fontWeight:700,marginTop:1}}>+ Functional Cloning & Mapping</div>
                  <div style={{fontSize:9,color:"#ea580c",fontWeight:700,marginTop:1}}>+ Package Substrate Awareness</div>
                </div>
              </div>
            </Bk>

            {/* ═══ UMT PLATFORM ═══ */}
            <Bk id="platform" color="#d97706" grad="linear-gradient(160deg,#1c1917,#1f1a10)" dl={6}
              isA={hov==="platform"} isD={dBlk.includes("platform")}
              onE={()=>!demoOn&&setHov("platform")} onL={()=>setHov(null)}>
              <Hd icon="🔧" title="UMT Platform" color="#d97706"/>
              <It t="Development BSP" bold s="(internal codegen + compile engine)"/>
              <It t="Toolchains" bold s="(GCC/Clang/Xtensa/ARM/RISC-V…)"/>
              <It t="Dependency Manager" bold s="(libs, drivers, packages)"/>
            </Bk>

            {/* ═══ FRAMEWORKS & SDKs ═══ */}
            {/* ★ dy: when AI Bashir's "Write Your Project" panel opens, this block slides DOWN
                 by ~380px so the expanded aiChat block (which can grow to ~490px) doesn't
                 overlap it. Smooth cubic-bezier transition (top .35s) — driven by Bk's CSS. */}
            <Bk id="sdks" color="#e11d48" grad="linear-gradient(160deg,#1c1917,#1a1218)" dl={5}
              isA={hov==="sdks"} isD={dBlk.includes("sdks")}
              dy={projectInputOpen ? 380 : (providerConfigOpen ? 320 : 0)}
              onE={()=>!demoOn&&setHov("sdks")} onL={()=>setHov(null)}>
              <Hd title="Frameworks & SDKs" color="#e11d48" sm/>
              {["Arduino Core / Libraries","ESP-IDF","STM32Cube","Atmel AVR Core","Pico SDK","Zephyr RTOS","Other SDKs (HAL, NFF…)"].map((f,i)=>(
                <It key={i} t={f} bold={i<2} hl={ds?.hl?.sdks==="Arduino"&&i===0}/>
              ))}
            </Bk>

            {/* ═══ PLATFORMS ═══ */}
            {/* ★ Same dy push-down — keeps Platforms aligned with Frameworks & SDKs (both slide
                 together as a pair so the 50px gap between them is preserved). */}
            <Bk id="plats" color="#c026d3" grad="linear-gradient(160deg,#1c1917,#1a1420)" dl={5}
              isA={hov==="plats"} isD={dBlk.includes("plats")}
              dy={projectInputOpen ? 380 : (providerConfigOpen ? 320 : 0)}
              onE={()=>!demoOn&&setHov("plats")} onL={()=>setHov(null)}>
              <Hd title="Platforms" color="#c026d3" sm/>
              {["Atmel AVR Platform","Espressif ESP32 Platform","STM32 Platform","ARM/RISC-V Platforms","Other Platforms"].map((p,i)=>(
                <It key={i} t={p} hl={ds?.hl?.plats==="Espressif"&&i===1}/>
              ))}
            </Bk>

            {/* ═══ BUILD ═══ */}
            <Bk id="build" color="#0891b2" grad="linear-gradient(160deg,#1c1917,#101a1f)" dl={7}
              isA={hov==="build"} isD={dBlk.includes("build")}
              onE={()=>!demoOn&&setHov("build")} onL={()=>setHov(null)}>
              <Hd title="Build Ecosystem — Codegen + Compile" color="#0891b2" sm/>
              <It t="Toolchains" bold hl={ds?.hl?.build==="compile"} s="(GCC/Clang/Xtensa/ARM/RISC-V…)"/>
              <It t="Dependency Manager" bold s="(libs, drivers, board packages)"/>
            </Bk>

            {/* ═══ FIRMWARE OUTPUT ═══ */}
            <Bk id="fwout" color="#2563eb" grad="linear-gradient(160deg,#1c1917,#10141f)" dl={8}
              isA={hov==="fwout"} isD={dBlk.includes("fwout")}
              onE={()=>!demoOn&&setHov("fwout")} onL={()=>setHov(null)}>
              <div style={{padding:"7px 10px",display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:12}}>📦</span>
                <div><div style={{fontSize:10,fontWeight:700,color:ds?.hl?.fwout?"#22c55e":"#93c5fd"}}>Firmware Output</div><div style={{fontSize:8,color:"#78716c"}}>(.bin / .hex / .elf / .uf2)</div></div>
              </div>
            </Bk>

            {/* ═══ FLASHING / DEBUG ═══ */}
            <Bk id="flash" color="#dc2626" grad="linear-gradient(160deg,#1c1917,#1f1214)" dl={9}
              isA={hov==="flash"} isD={dBlk.includes("flash")}
              onE={()=>!demoOn&&setHov("flash")} onL={()=>setHov(null)}>
              <div style={{padding:"7px 10px",display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:12}}>⚡</span>
                <div><div style={{fontSize:10,fontWeight:700,color:ds?.hl?.flash?"#22c55e":"#fca5a5"}}>Flashing / Debug</div><div style={{fontSize:8,color:"#78716c"}}>UART / JTAG / SWD / GFU → connects to ALL Targets</div></div>
              </div>
            </Bk>

            {/* ═══ MONITOR ═══ */}
            <Bk id="monitor" color="#7c3aed" grad="linear-gradient(160deg,#1c1917,#161020)" dl={10}
              isA={hov==="monitor"} isD={dBlk.includes("monitor")}
              onE={()=>!demoOn&&setHov("monitor")} onL={()=>setHov(null)}>
              <div style={{padding:"7px 10px",display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:11}}>📊</span>
                <div><div style={{fontSize:10,fontWeight:700,color:ds?.hl?.monitor?"#22c55e":"#c4b5fd"}}>Monitor / Logs / Serial Plot</div><div style={{fontSize:8,color:"#78716c"}}>+ optional dashboard · receives FROM all Targets</div></div>
              </div>
            </Bk>

            {/* ═══ UMT SIMULATOR (NEW) ═══ */}
            <Bk id="sim" color="#06b6d4" grad="linear-gradient(160deg,#0a1820,#10202a)" dl={3}
              isA={hov==="sim"} isD={dBlk.includes("sim")}
              onE={()=>!demoOn&&setHov("sim")} onL={()=>setHov(null)}>
              <div style={{padding:"6px 10px",background:"linear-gradient(135deg,#06b6d420,transparent)",borderBottom:"1px solid #06b6d425"}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:13}}>🖥️</span>
                  <div>
                    <div style={{fontFamily:"'Georgia',serif",fontSize:11.5,fontWeight:700,color:ds?.hl?.sim?"#22c55e":"#fef3c7"}}>UMT Simulator</div>
                    <div style={{fontSize:8,color:"#06b6d488"}}>Virtual run BEFORE flash — 3 target classes</div>
                  </div>
                </div>
              </div>
              <It t="Sim Target A: Dev Boards (virtual)" s="GPIO toggle, Serial, timing" hl={ds?.hl?.sim==="Sim Target A"}/>
              <It t="Sim Target B: UMT IC (virtual MCU/SoC)" s="BGA pin map, Package Substrate" hl={ds?.hl?.sim==="Sim Target B"}/>
              <It t="Sim Target C: NanoKit-iM (virtual)" s="Module selector + BGA combined" hl={ds?.hl?.sim==="Sim Target C"}/>
            </Bk>

            {/* Pick Target badges */}
            {[
              {x:BL.tgtA.x+BL.tgtA.w-72, y:BL.tgtA.y-14, label:"Pick Target A"},
              {x:BL.tgtB.x+BL.tgtB.w-72, y:BL.tgtB.y-14, label:"Pick Target B"},
              {x:BL.tgtC.x+BL.tgtC.w-72, y:BL.tgtC.y-14, label:"Pick Target C"},
            ].map((p,i)=>(
              <div key={i} style={{position:"absolute",left:p.x,top:p.y,zIndex:5,background:"linear-gradient(135deg,#dc2626,#b91c1c)",color:"#fff",fontSize:8,fontWeight:800,padding:"3px 10px",borderRadius:4,fontFamily:"monospace",letterSpacing:.5,boxShadow:"0 2px 8px rgba(220,38,38,.35)",animation:"pk 2s ease-in-out infinite",animationDelay:`${i*0.3}s`}}>{p.label}</div>
            ))}

            {/* ═══ TARGET A ═══ */}
            <Bk id="tgtA" color="#16a34a" grad="linear-gradient(160deg,#1c1917,#101a14)" dl={4}
              isA={hov==="tgtA"} isD={dBlk.includes("tgtA")}
              onE={()=>!demoOn&&setHov("tgtA")} onL={()=>setHov(null)} onClick={()=>tog("tA")}>
              <div style={{padding:"6px 10px",background:"linear-gradient(135deg,#16a34a10,transparent)",borderBottom:"1px solid #16a34a1a"}}>
                <div style={{fontSize:8,fontWeight:800,color:"#16a34a55",letterSpacing:1}}>Targets</div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
                  <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:20,height:20,borderRadius:"50%",background:"#16a34a",color:"#fff",fontSize:10,fontWeight:900}}>A</span>
                  <span style={{fontSize:11.5,fontWeight:700,color:"#fef3c7"}}>Development Boards</span>
                </div>
              </div>
              {["NanoKit Integrated ESP32","Arduino Boards (Uno/Nano/Mega)","STM32 Nucleo Boards","Pico & Raspberry Pi Boards","NVIDIA Jetson Nano (SoC dev kit)"].map((n,i)=>(
                <It key={i} t={n} bold hl={ds?.hl?.tgtA===n}/>
              ))}
              {exp.tA&&<div style={{padding:"5px 10px",background:"#0a120e",borderTop:"1px solid #16a34a1a",animation:"si .2s"}}>
                <div style={{fontSize:8.5,color:"#16a34a",fontWeight:700}}>VR addresses = VIRTUAL (logical Cloner mapping)</div>
                <div style={{fontSize:8.5,color:"#4a5540",marginTop:2}}>Flashing via UART/JTAG/SWD directly to board</div>
                <div style={{fontSize:8.5,color:"#4a5540",marginTop:1}}>Monitor receives serial FROM this board</div>
              </div>}
            </Bk>

            {/* ═══ TARGET B (now MCU + SoC) ═══ */}
            <Bk id="tgtB" color="#3b82f6" grad="linear-gradient(160deg,#1c1917,#10141f)" dl={5}
              isA={hov==="tgtB"} isD={dBlk.includes("tgtB")}
              onE={()=>!demoOn&&setHov("tgtB")} onL={()=>setHov(null)} onClick={()=>tog("tB")}>
              <div style={{padding:"7px 10px",background:"linear-gradient(135deg,#3b82f610,transparent)",borderBottom:"1px solid #3b82f61a"}}>
                <div style={{fontSize:8,fontWeight:800,color:"#3b82f655",letterSpacing:1}}>Targets</div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
                  <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:20,height:20,borderRadius:"50%",background:"#3b82f6",color:"#fff",fontSize:10,fontWeight:900}}>B</span>
                  <div><div style={{fontSize:11,fontWeight:700,color:"#fef3c7"}}>UMT IC — MCU or SoC Die</div><div style={{fontSize:8,color:"#78716c"}}>UMT 16×16 BGA Hybrid · MCU/SoC Package Substrate Standard</div></div>
                </div>
              </div>
              <div style={{padding:"5px 10px",display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:42,height:34,borderRadius:4,background:"linear-gradient(135deg,#3b82f620,#1e3a5f30)",border:"1px solid #3b82f630",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <div style={{width:18,height:18,background:"#3b82f640",borderRadius:2,border:"1px dashed #3b82f660"}}/>
                </div>
                <div>
                  <div style={{fontSize:9.5,color:"#3b82f6",fontWeight:700}}>+ UMT 16×16 BGA Hybrid</div>
                  <div style={{fontSize:8,color:"#78716c"}}>MCU (Microcontroller) / SoC (System-on-Chip Processor) Package Substrate Standard</div>
                </div>
              </div>
              {exp.tB&&<div style={{padding:"5px 10px",background:"#0a0e14",borderTop:"1px solid #3b82f61a",animation:"si .2s"}}>
                <div style={{fontSize:8.5,color:"#3b82f6",fontWeight:700}}>VR addresses = PHYSICAL (real BGA ball positions)</div>
                <div style={{fontSize:8.5,color:"#3a4a60",marginTop:2}}>MCU dies: Espressif ESP32, STM32, NXP, RP2040</div>
                <div style={{fontSize:8.5,color:"#3a4a60",marginTop:1}}>SoC dies: Snapdragon, Apple A-class, Exynos, Dimensity, Kirin</div>
                <div style={{fontSize:8.5,color:"#3a4a60",marginTop:1}}>Wire-bonded or flip-chipped onto BGA 16×16 substrate</div>
                <div style={{fontSize:8.5,color:"#3a4a60",marginTop:1}}>Flashing via JTAG/SWD · Monitor via serial</div>
              </div>}
            </Bk>

            {/* ═══ TARGET C (now MCU + SoC) ═══ */}
            <Bk id="tgtC" color="#a855f7" grad="linear-gradient(160deg,#1c1917,#161020)" dl={6}
              isA={hov==="tgtC"} isD={dBlk.includes("tgtC")}
              onE={()=>!demoOn&&setHov("tgtC")} onL={()=>setHov(null)} onClick={()=>tog("tC")}>
              <div style={{padding:"7px 10px",background:"linear-gradient(135deg,#a855f710,transparent)",borderBottom:"1px solid #a855f71a"}}>
                <div style={{fontSize:8,fontWeight:800,color:"#a855f755",letterSpacing:1}}>Targets</div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
                  <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:20,height:20,borderRadius:"50%",background:"#a855f7",color:"#fff",fontSize:10,fontWeight:900}}>C</span>
                  <div><div style={{fontSize:11,fontWeight:700,color:"#fef3c7"}}>NanoKit-iM (MCU or SoC)</div><div style={{fontSize:8,color:"#78716c"}}>UMT 16×16 BGA Hybrid · MCU/SoC Package Substrate Standard</div></div>
                </div>
              </div>
              <div style={{padding:"5px 10px",display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:42,height:34,borderRadius:4,background:"linear-gradient(135deg,#a855f720,#3d1f5f30)",border:"1px solid #a855f730",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <div style={{width:18,height:18,background:"#a855f740",borderRadius:2,border:"1px dashed #a855f760"}}/>
                </div>
                <div>
                  <div style={{fontSize:9.5,color:"#a855f7",fontWeight:700}}>+ UMT 16×16 BGA Hybrid</div>
                  <div style={{fontSize:8,color:"#78716c"}}>MCU (Microcontroller) / SoC (System-on-Chip Processor) Package Substrate Standard</div>
                </div>
              </div>
              {exp.tC&&<div style={{padding:"5px 10px",background:"#0e0a14",borderTop:"1px solid #a855f71a",animation:"si .2s"}}>
                <div style={{fontSize:8.5,color:"#a855f7",fontWeight:700}}>VR addresses = PHYSICAL (real BGA ball positions)</div>
                <div style={{fontSize:8.5,color:"#4a3a60",marginTop:2}}>MCU module: ESP32-D0WD (first), STM32, NXP</div>
                <div style={{fontSize:8.5,color:"#4a3a60",marginTop:1}}>SoC module: Snapdragon-class, Apple-class (future)</div>
                <div style={{fontSize:8.5,color:"#4a3a60",marginTop:1}}>Selectable: swap module on same BGA substrate</div>
                <div style={{fontSize:8.5,color:"#4a3a60",marginTop:1}}>Flashing via UART/JTAG/SWD · Monitor via serial</div>
              </div>}
            </Bk>

            {/* ═══ MANUFACTURING ═══ */}
            <div style={{position:"absolute",left:BL.mfg.x,top:BL.mfg.y,width:BL.mfg.w,minHeight:BL.mfg.h,background:"linear-gradient(160deg,#1c1917,#1a1818)",border:"1.5px solid #57534e28",borderRadius:10,overflow:"hidden",zIndex:2}}>
              <div style={{padding:"5px 12px",background:"linear-gradient(135deg,#57534e15,transparent)",borderBottom:"1px solid #57534e18",textAlign:"center"}}>
                <div style={{fontFamily:"'Georgia',serif",fontSize:11,fontWeight:700,color:"#7a7570"}}>Manufacturing & Packaging Partners (Conceptual)</div>
              </div>
              <div style={{padding:"8px 12px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:7}}>
                {[
                  {t:"Chip Manufacturer",s:"MCU/SoC Silicon Die — Espressif, STM, NXP, Texas Instruments, Broadcom, NVIDIA, Qualcomm, Apple, Samsung, HiSilicon Kirin (Huawei)"},
                  {t:"Foundry & OSAT",s:"TSMC, Samsung Foundry, Intel IFS · Wire-bond / flip-chip → UMT BGA"},
                  {t:"PCB/EMS Manufacturing",s:"(optional for Dev Boards Target A)"},
                  {t:"UMT BGA 16×16 Standard",s:"Package Substrate + pin-mapping spec (Hybrid v9)"},
                ].map((b,i)=>(
                  <div key={i} style={{border:"1px solid #22201a",borderRadius:5,padding:7}}>
                    <div style={{fontSize:9.5,fontWeight:700,color:"#a8a29e"}}>{b.t}</div>
                    <div style={{fontSize:7.5,color:"#78716c"}}>{b.s}</div>
                  </div>
                ))}
              </div>
              <div style={{padding:"3px 12px 7px",fontSize:8.5,color:"#78716c",textAlign:"center"}}>
                developed by <strong style={{color:"#7a7570"}}>Amine Saoud ibn al-Bashir</strong> · UMT BGA 16×16 adopted by chip vendors & OSAT to produce UMT-compatible MCUs, SoCs, and NanoKit-iM devices
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{maxWidth:760,margin:"6px auto 0",display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",fontSize:8.5,color:"#78716c"}}>
        <span><span style={{color:"#92400e"}}>━━▸◀━━</span> idle</span>
        <span><span style={{color:"#fbbf24"}}>━━▸◀━━</span> hover</span>
        <span><span style={{color:"#22c55e"}}>━━▸◀━━</span> demo flow</span>
        <span>⓵ = 1 per build</span>
        <span>31 connections · 18 blocks</span>
      </div>
      <div style={{textAlign:"center",marginTop:4,fontSize:8,color:"#78716c",fontFamily:"monospace"}}>© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe</div>
    </div>
  );
}
