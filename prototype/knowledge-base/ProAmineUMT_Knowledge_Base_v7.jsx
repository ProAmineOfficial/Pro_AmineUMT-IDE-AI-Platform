import { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   ProAmineUMT Knowledge Base v7 — canonical reference documentation
   Updated from the Architecture Map v5.9 canonical block (single source of truth).
   ═══════════════════════════════════════════════════════════════════════════

   ─── AI BASHIR (Integrated AI Assistant) ───
   AI Bashir is the integrated AI assistant of Pro_AmineUMT IDE with AI. It is
   the developer-facing intelligence (L5) of the platform — distinct from the
   hidden AIA Engine (L4) that performs deterministic VR→GPIO resolution.
   AI Bashir writes UMT VR API code in .umt files on the developer's behalf,
   explains UMT concepts, refines developer prompts into build-ready specs,
   monitors Build / Debug / Simulation / Runtime, and generates and maintains
   the .CmdGenius workspace for every project. Reachable via chat, voice
   (Web Speech API), or the Refine pipeline. Backend model is configurable
   (Claude Sonnet 4.6 default; DeepSeek R1 / ChatGPT / Gemini / Kimi via the
   developer's own API token).

   ─── .CmdGenius (Project Intelligence Workspace) — OFFICIAL v2 ───
   .CmdGenius is the Project Intelligence Workspace of every UMT project. It is
   automatically created and managed by Pro_AmineUMT IDE with AI, serving as the
   project's intelligent command, guidance, and knowledge center.

   Unlike a traditional Terminal or a simple documentation folder, .CmdGenius
   provides a unified AI-powered workspace that brings together AI Bashir, the
   Terminal, Build Output, Debug Information, Runtime Information, and
   automatically generated engineering documentation into a single intelligent
   environment.

   Powered by AI Bashir, .CmdGenius continuously analyzes the entire project,
   understands the UMT VR API source code, monitors Build / Debug / Simulation
   / Runtime processes, and provides intelligent assistance throughout the
   complete software development lifecycle.

   Deep integration with the IDE's Problems, Output, Debug Console, Terminal,
   and Ports panels: AI Bashir continuously interprets compiler diagnostics,
   runtime logs, debugging sessions, serial communication, and system
   diagnostics into clear explanations, actionable recommendations, and
   AI-powered guidance.

   By analyzing MyProject.umt with the complete project context, AI Bashir
   automatically generates engineering knowledge that helps developers:
   understand architecture, wire hardware correctly, analyze algorithms and
   execution flow, generate flowcharts and pseudocode, create Architecture and
   Dependency Maps, explain compiler/terminal/debugger messages, diagnose
   Build/Runtime/hardware issues, improve performance and code quality, answer
   project-specific questions with full context, and guide developers step by
   step without leaving the IDE.

   .CmdGenius ALWAYS contains the following engineering knowledge files
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

   The leading dot (.) marks .CmdGenius as a hidden system workspace auto-
   managed by the UMT Platform. Developers do not edit or manage it manually.
   It continuously evolves alongside the project, acting as the intelligent
   bridge between source code, AI Bashir, the AIA Engine, the Build System,
   the Debugger, the Terminal, and the IDE's Problems / Output / Debug Console
   / Ports panels.

   Together, these components provide a unified, intelligent, context-aware,
   and AI-driven software development experience inside Pro_AmineUMT IDE with AI.

   ─── CANONICAL EXAMPLE UPDATE (v7.1) ───
   Primary demonstrated interface changed from VR_UART0 to VR_ADC4 across all
   PinVis + Case 1 + Case 2 + 8-language code_comments. Rationale: VR_ADC4
   showcases both roles more clearly (analog input as Interface, digital
   output as Digital reuse) and covers the ADC family that most embedded
   projects touch first. VR_ADC4 = ADC channel 4 of the MCU; VR_ADC_IN4 = its
   dedicated input pin (VR_0x54 on the BGA matrix; GPIO32 on NanoKit ESP32).
   ═══════════════════════════════════════════════════════════════════════════*/

const KEY = "proamineumt-kb-v7";

/* ═══ LANGUAGE TRANSLATIONS — 8 LANGUAGES (same as Architecture Map v4) ═══
   Technical terms (VR_*, UMT, AIA, GPIO, ESP32, BGA, MCU, SoC) ALWAYS stay in English.
   Only explanation prose is translated. */
const LANGUAGES = [
  { code:"en", flag:"🇬🇧", name:"English",   dir:"ltr" },
  { code:"ar", flag:"🇩🇿", name:"العربية",   dir:"rtl" },  // 🇩🇿 Algeria (Amine's country)
  { code:"ru", flag:"🇷🇺", name:"Русский",   dir:"ltr" },
  { code:"hi", flag:"🇮🇳", name:"हिन्दी",      dir:"ltr" },
  { code:"es", flag:"🇪🇸", name:"Español",   dir:"ltr" },
  { code:"de", flag:"🇩🇪", name:"Deutsch",   dir:"ltr" },
  { code:"zh", flag:"🇨🇳", name:"中文",       dir:"ltr" },
  { code:"ja", flag:"🇯🇵", name:"日本語",     dir:"ltr" },
];

/* Demo Scope explanation translations — applies to ALL 45 UMT interfaces note */
const DEMO_SCOPE_I18N = {
  en: {
    title: "Demo Scope",
    body: "This walkthrough uses",
    middle: "as examples. The same ecosystem mechanism applies to",
    emphasis: "ALL 45 UMT interfaces",
    tail: "across rows 0x0–0xF in the BGA 16×16 Hybrid v9 matrix (UART×4, SPI×2, I2C×2, USB×4, ADC×8, DAC×3, PWM×4, I2S×2, CAN, Ethernet, LPDDR, HDMI, PCIe, DisplayPort, MIPI CSI/DSI, LVDS, JTAG, SWD, VR_GPIO×16 ★, etc.)."
  },
  ar: {
    title: "نطاق العرض التوضيحي",
    body: "هذا العرض التوضيحي يستخدم",
    middle: "كأمثلة. نفس آلية النظام البيئي تنطبق على",
    emphasis: "جميع الواجهات الـ 45 في UMT",
    tail: "عبر الصفوف 0x0–0xF في مصفوفة BGA 16×16 Hybrid v9 (UART×4، SPI×2، I2C×2، USB×4، ADC×8، DAC×3، PWM×4، I2S×2، CAN، Ethernet، LPDDR، HDMI، PCIe، DisplayPort، MIPI CSI/DSI، LVDS، JTAG، SWD، VR_GPIO×16 ★، إلخ)."
  },
  ru: {
    title: "Объём демонстрации",
    body: "Этот обзор использует",
    middle: "в качестве примеров. Тот же механизм экосистемы применяется ко",
    emphasis: "ВСЕМ 45 интерфейсам UMT",
    tail: "в рядах 0x0–0xF матрицы BGA 16×16 Hybrid v9 (UART×4, SPI×2, I2C×2, USB×4, ADC×8, DAC×3, PWM×4, I2S×2, CAN, Ethernet, LPDDR, HDMI, PCIe, DisplayPort, MIPI CSI/DSI, LVDS, JTAG, SWD, VR_GPIO×16 ★, и т.д.)."
  },
  hi: {
    title: "डेमो दायरा",
    body: "यह वॉकथ्रू उपयोग करता है",
    middle: "उदाहरण के रूप में। समान ecosystem तंत्र लागू होता है",
    emphasis: "सभी 45 UMT interfaces पर",
    tail: "BGA 16×16 Hybrid v9 matrix में rows 0x0–0xF के पार (UART×4, SPI×2, I2C×2, USB×4, ADC×8, DAC×3, PWM×4, I2S×2, CAN, Ethernet, LPDDR, HDMI, PCIe, DisplayPort, MIPI CSI/DSI, LVDS, JTAG, SWD, VR_GPIO×16 ★, आदि)।"
  },
  es: {
    title: "Alcance del Demo",
    body: "Este recorrido utiliza",
    middle: "como ejemplos. El mismo mecanismo del ecosistema se aplica a",
    emphasis: "TODAS las 45 interfaces UMT",
    tail: "en las filas 0x0–0xF de la matriz BGA 16×16 Hybrid v9 (UART×4, SPI×2, I2C×2, USB×4, ADC×8, DAC×3, PWM×4, I2S×2, CAN, Ethernet, LPDDR, HDMI, PCIe, DisplayPort, MIPI CSI/DSI, LVDS, JTAG, SWD, VR_GPIO×16 ★, etc.)."
  },
  de: {
    title: "Demo-Umfang",
    body: "Diese Übersicht verwendet",
    middle: "als Beispiele. Der gleiche Ökosystem-Mechanismus gilt für",
    emphasis: "ALLE 45 UMT-Schnittstellen",
    tail: "in den Reihen 0x0–0xF der BGA 16×16 Hybrid v9-Matrix (UART×4, SPI×2, I2C×2, USB×4, ADC×8, DAC×3, PWM×4, I2S×2, CAN, Ethernet, LPDDR, HDMI, PCIe, DisplayPort, MIPI CSI/DSI, LVDS, JTAG, SWD, VR_GPIO×16 ★, usw.)."
  },
  zh: {
    title: "演示范围",
    body: "本演练使用",
    middle: "作为示例。相同的生态系统机制适用于",
    emphasis: "所有 45 个 UMT 接口",
    tail: "在 BGA 16×16 Hybrid v9 矩阵的 0x0–0xF 行中（UART×4、SPI×2、I2C×2、USB×4、ADC×8、DAC×3、PWM×4、I2S×2、CAN、Ethernet、LPDDR、HDMI、PCIe、DisplayPort、MIPI CSI/DSI、LVDS、JTAG、SWD、VR_GPIO×16 ★ 等）。"
  },
  ja: {
    title: "デモ範囲",
    body: "このウォークスルーでは",
    middle: "を例として使用します。同じエコシステムのメカニズムが",
    emphasis: "すべての 45 個の UMT インターフェース",
    tail: "BGA 16×16 Hybrid v9 マトリックスの 0x0–0xF 行全体に適用されます（UART×4、SPI×2、I2C×2、USB×4、ADC×8、DAC×3、PWM×4、I2S×2、CAN、Ethernet、LPDDR、HDMI、PCIe、DisplayPort、MIPI CSI/DSI、LVDS、JTAG、SWD、VR_GPIO×16 ★ など）。"
  },
};

/* Demos tab step explanations (C1, C2 examples) — translatable across 8 languages */
const DEMOS_STEPS_I18N = {
  en: null, // null = use original text
  ar: {
    c1_title: "C1 — Deactivate Interface (Pin → Digital)",
    c1_desc: "كل pin ينتمي افتراضياً إلى الـ interface الخاص به. لاستخدامه كـ Digital I/O، نُلغّي تفعيل الـ interface:",
    c2_title: "C2 — Activate Interface (Pin → Protocol)",
    c2_desc: "لاستخدام الـ pin لوظيفة protocol الخاصة به (UART, SPI, I2C, PWM...)، نُفعّل الـ interface:",
    sees_note: "هذه الأمثلة تستخدم VR_ADC4 / VR_PWM0 — لكن نفس المبدأ يعمل لكل الـ 45 واجهة في UMT BGA 16×16."
  },
  ru: {
    c1_title: "C1 — Деактивировать Interface (Pin → Digital)",
    c1_desc: "Каждый pin по умолчанию принадлежит своему interface. Чтобы использовать его как Digital I/O, деактивируем interface:",
    c2_title: "C2 — Активировать Interface (Pin → Protocol)",
    c2_desc: "Чтобы использовать pin для его protocol-функции (UART, SPI, I2C, PWM...), активируем interface:",
    sees_note: "Эти примеры используют VR_ADC4 / VR_PWM0 — но тот же принцип работает для всех 45 интерфейсов в UMT BGA 16×16."
  },
  hi: {
    c1_title: "C1 — Interface निष्क्रिय करें (Pin → Digital)",
    c1_desc: "हर pin डिफ़ॉल्ट रूप से अपने interface से संबंधित है। इसे Digital I/O के रूप में उपयोग करने के लिए, interface को निष्क्रिय करें:",
    c2_title: "C2 — Interface सक्रिय करें (Pin → Protocol)",
    c2_desc: "Pin को उसके protocol फ़ंक्शन (UART, SPI, I2C, PWM...) के लिए उपयोग करने हेतु, interface सक्रिय करें:",
    sees_note: "ये उदाहरण VR_ADC4 / VR_PWM0 का उपयोग करते हैं — लेकिन वही सिद्धांत UMT BGA 16×16 में सभी 45 interfaces के लिए काम करता है।"
  },
  es: {
    c1_title: "C1 — Desactivar Interface (Pin → Digital)",
    c1_desc: "Cada pin pertenece por defecto a su interface. Para usarlo como Digital I/O, desactivamos la interface:",
    c2_title: "C2 — Activar Interface (Pin → Protocol)",
    c2_desc: "Para usar el pin para su función de protocol (UART, SPI, I2C, PWM...), activamos la interface:",
    sees_note: "Estos ejemplos usan VR_ADC4 / VR_PWM0 — pero el mismo principio funciona para las 45 interfaces en UMT BGA 16×16."
  },
  de: {
    c1_title: "C1 — Interface deaktivieren (Pin → Digital)",
    c1_desc: "Jeder Pin gehört standardmäßig zu seiner Schnittstelle. Um ihn als Digital I/O zu verwenden, deaktivieren wir die Schnittstelle:",
    c2_title: "C2 — Interface aktivieren (Pin → Protocol)",
    c2_desc: "Um den Pin für seine Protocol-Funktion (UART, SPI, I2C, PWM...) zu verwenden, aktivieren wir die Schnittstelle:",
    sees_note: "Diese Beispiele verwenden VR_ADC4 / VR_PWM0 — aber das gleiche Prinzip funktioniert für alle 45 Schnittstellen in UMT BGA 16×16."
  },
  zh: {
    c1_title: "C1 — 停用 Interface（Pin → Digital）",
    c1_desc: "每个 pin 默认属于其 interface。要将其用作 Digital I/O，我们停用 interface：",
    c2_title: "C2 — 激活 Interface（Pin → Protocol）",
    c2_desc: "要将 pin 用于其 protocol 功能（UART、SPI、I2C、PWM...），我们激活 interface：",
    sees_note: "这些示例使用 VR_ADC4 / VR_PWM0 — 但相同的原理适用于 UMT BGA 16×16 中的所有 45 个 interfaces。"
  },
  ja: {
    c1_title: "C1 — Interface を無効化（Pin → Digital）",
    c1_desc: "各 pin はデフォルトでその interface に属します。Digital I/O として使用するには、interface を無効化します：",
    c2_title: "C2 — Interface を有効化（Pin → Protocol）",
    c2_desc: "Pin をその protocol 機能（UART、SPI、I2C、PWM...）に使用するには、interface を有効化します：",
    sees_note: "これらの例は VR_ADC4 / VR_PWM0 を使用しています — しかし同じ原則が UMT BGA 16×16 の全 45 interfaces に適用されます。"
  },
};

/* ═══ COMPREHENSIVE KB LABELS — translates section headers across ALL tabs ═══
   Tab names, section titles, table headers, and key explanations.
   Technical terms (VR_*, UMT, AIA, GPIO, BGA, ESP32, MCU, SoC, Pin, Interface) stay English. */
const KB_LABELS = {
  en: {
    // Tab names
    tabs: { concept:"🎯 Pin Concept", gpio:"🔧 VR_GPIOxx Special", demos:"▶ Demos", bga:"🔲 UMT 16×16 BGA", substrate:"📦 Package Substrate", prompt:"📋 Prompt", hw:"🔌 Hardware" },
    // CONCEPT tab
    concept_h: "Pin Dual Roles — Universal Rule",
    concept_main: "Every pin on a chip — whether MCU (microcontroller) or SoC (system-on-chip with built-in processor) — has a primary digital function: input (switch) or output (LED). That same pin may also carry one or more interface/protocol functions (UART, PWM, ADC, SPI, I2C, etc.).\n\nIn the UMT Platform (Unified Microchip Technology), each pin is limited to only two possible roles: either Digital or Interface — not both at the same time. UMT applies uniformly to MCUs and SoCs that mount on the UMT 16×16 BGA Hybrid MCU (Microcontroller) / SoC (System-on-Chip Processor) Package Substrate Standard.",
    concept_card1: "Digital (deactivate)",
    concept_card2: "Interface (activate)",
    concept_genrule: "General Rule — All Interfaces",
    concept_th_iface: "Interface",
    concept_th_deact: "deactivate() → Digital",
    concept_th_act: "activate() → Interface",
    // GPIO tab
    gpio_h: "VR_GPIOxx Special Case — Manufacturer Extension",
    gpio_intro: "Row 0x8 (16 pins: VR_GPIO00–VR_GPIO0F) is reserved for manufacturer-defined custom interfaces. This enables chipmakers to add their proprietary peripherals while preserving the unified BGA standard.",
    gpio_role1: "Role 1 — Standard Digital",
    gpio_role2: "Role 2 — Custom Interface",
    gpio_role1_desc: "Deactivate → 16 pins behave as raw I/O (LED, switch, button, generic input/output)",
    gpio_role2_desc: "Activate VR_NewInterface → manufacturer-defined custom protocol. Splittable into 3-4 sub-interfaces.",
    gpio_arch_h: "Architecture-Specific Interfaces (Very Important)",
    gpio_arch_intro: "MCU architectures differ — some interfaces exist on one chip but not another. The AVR ATmega328P (8-bit) on NanoKit Integrated has peripherals the ESP32 (32-bit Xtensa LX6) lacks, and vice-versa. Because the unified NanoKit Integrated board has limited pins with no room for every function, the developer CHOOSES which MCU to build their own NanoKit Integrated around, and which protocol/interface to use on each pin.",
    gpio_example_h: "Real Example — NanoKit Integrated ESP32 pin 19",
    gpio_example_desc: "pin 19 maps to BGA coordinate VR_0x82, which holds slot VR_GPIO2. On ESP32 you may choose VR_ADC2_IN7, VR_RTC_IO17, or VR_TOUCH7 — one real peripheral per pin.",
    gpio_example_note: "Always prefix VR_ to the real interface name — some developers need a peripheral that exists on THIS MCU but not another. This is exactly when VR_GPIO interface activate() is used.",
    gpio_r1_title: "ROLE 1 — Digital I/O",
    gpio_r1_desc: "Used as standard digital input or output. LED, switches, buttons, basic GPIO.",
    gpio_r2_title: "ROLE 2 — Manufacturer Interface",
    gpio_r2_desc: "Bound to a custom interface defined by the chip manufacturer. UMT SDK loads vendor library.",
    gpio_split_title: "Splitting 16 Pins Into Multiple Interfaces",
    gpio_split_intro: "Manufacturers have FREEDOM to divide the 16 VR_GPIO pins into multiple custom interfaces:",
    gpio_benefits_title: "Benefits to Engineers",
    // DEMOS tab
    demos_hint: "Click ▶ Animate or click step numbers · Green = Digital · Blue = Interface",
    // BGA tab
    bga_h: "16×16 BGA Hybrid MCU (Microcontroller) / SoC (System-on-Chip Processor) Package Substrate Standard (256 balls + 4 external pads)",
    bga_intro: "VR_0x[Row][Column] · Rows 0x0–0xF · Hover any cell to see address",
    bga_yellow: "Yellow = NanoKit Locked",
    bga_intro_hover: "Hover any cell to see address",
    bga_red: "Red = ESP32 Flash",
    bga_green: "Green = VR_GPIO Special",
    // SUBSTRATE tab
    sub_h: "📦 Package Substrate — The Innovation Frontier",
    sub_intro: "Chip manufacturers treat the package substrate as a routine packaging step — a primitive way of handling the most important manufacturing stage. Amine sees this as a fissure to be exploited: the substrate itself can become the next major innovation surface.",
    sub_vision: "Amine's Vision",
    sub_quantum: "Quantum I/O Bottleneck",
    sub_quantum_desc: "Traditional packages route signals through PCB tracks → bandwidth bottleneck at the package edge. UMT routes signals through the substrate itself → bandwidth scales with the number of slaves, not lane width.",
    ms_title: "Master/Slave Parallel Architecture (Amine's Innovation)",
    ms_desc: "UMT IC acts as Master with many specialized slave driver ICs on the same substrate. They communicate in parallel at the same time over a hybrid bus mixing SPI + I2C + PCIe characteristics.",
    ms_how: "How it solves the bottleneck:",
    ms_b1: "Instead of single PCIe x4 link to one device → dozens of slave ICs each with dedicated path to master",
    ms_b2: "All running concurrently inside the substrate",
    ms_b3: "Result: aggregate bandwidth scales with #slaves, NOT with PCIe lane width",
    ft_title: "Future Substrate Technologies",
    qb_title: "The Quantum Bottleneck — Amine's Discovery",
    qb_desc: "Amine asks: If a quantum chip is instantaneously fast but data transfer is slow, what is the use? Quantum solves complexity, not bandwidth.",
    why_title: "Why This Matters for UMT",
    why_p1: "The UMT architecture is designed so future substrate technologies can be swapped in without changing the developer-facing layer. The VR_ namespace abstracts away the physical interconnect: a developer's UMT code remains identical whether the substrate uses copper, optical, or wireless.",
    why_p2: "This is the same approach that made the Internet successful: developers don't care whether their data travels over WiFi, Fiber, or 4G — the protocol is the same. UMT applies this principle to chip-level interconnect.",
    hw_locked_title: "NanoKit ESP32 — 34 Locked BGA Coordinates (v9)",
    hw_locked_desc: "These coordinates are PERMANENTLY locked to match NanoKit Integrated ESP32 V2020. v9 added VR_GND at 0xD0 (NanoKit pins 12 & 31).",
    hw_restrict_title: "ESP32 Restrictions (AIA Rule Engine)",
    // PROMPT tab
    prompt_h: "📋 Master Context Prompt — for AI agents (Claude/GPT/Gemini)",
    prompt_copy: "Copy to Clipboard",
    prompt_copied: "✓ Copied!",
    prompt_sub: "Copy full context (v7) and paste at the start of any new conversation.",
    project_label: "Project",
    bga_extpads: "External Power Pads (Outside BGA Matrix)",
    sub_8func: "The 8 Critical Functions of Package Substrate",
    hw_targets_title: "Hardware Targets",
    hw_target_a_name: "Development Boards",
    hw_target_b_name: "UMT IC — MCU Die on BGA 16×16",
    hw_target_c_name: "NanoKit-iM — Selectable MCU",
    hw_target_a_ex: "NanoKit ESP32 · Arduino · STM32 Nucleo · Pico · Jetson Nano",
    hw_target_c_ex: "ESP32-D0WD first MCU · BGA 16×16 substrate",
    hw_virtual: "VIRTUAL",
    hw_physical: "PHYSICAL",
    hw_r1: "GPIO6–11 (VR_GPIO04-09) = internal SPI flash — HARD ABORT",
    hw_r2: "GPIO34,35,36,39 = INPUT ONLY",
    hw_r3: "GPIO0 (VR_BOOT 0x38) HIGH at boot",
    hw_r4: "UART0 (G1/G3) USB-Serial shared",
    sub_quote: "\"Chipmakers treat Package Substrate as just routine — a primitive way of handling the most important manufacturing stage. I see this as a fissure that can be exploited to develop the substrate itself, using VR_GPIOxx to enable wireless interconnect inside the substrate.\" — Amine Saoud ibn al-Bashir",
    sub_ai_quote: "\"AI servers stack thousands of GPUs because PCIe and NVLink have hard limits. The most important conclusion: I linked processing speed and the transmission problem. The solution is a new interface on VR_GPIO mixed between SPI, I2C, and PCIe — connecting UMT IC Master to many slave drivers in parallel inside the Package Substrate.\"",
    sf_titles: ["Signal Routing","Power Distribution Network (PDN)","Thermal Management","EMI / Signal Integrity","Memory Integration","Multi-die / Chiplet Interconnect","Mechanical Protection","Testing Interface"],
    sf_descs: ["Connects CPU/GPU/MCU inside the chip with external Pins/BGA via multiple copper layers (like a miniature PCB). Foundation of PCIe, USB, GPIO.","Distributes voltages: Core (1V), I/O (1.8V/3.3V). Reduces noise. Maintains voltage stability. Critical in AMD CPUs and Apple SoCs.","Conducts heat from silicon to heat spreader/heatsink via thermal vias, copper planes, and exposed pads. UMT's 4 external pads serve this purpose.","Prevents crosstalk and signal distortion. Maintains signal quality for PCIe, DDR, USB3 — where small degradation causes huge data errors.","Connects LPDDR/DDR. Sometimes memory placed on top of processor (PoP). Examples: Snapdragon, Apple A, Exynos, NVIDIA, HiSilicon Kirin (Huawei). UMT supports this via Rows 0x9+0xA.","Connects CPU+GPU+NPU as separate chiplets, or links multiple chiplets. Examples: Intel Foveros, NVIDIA HBM+GPU.","Protects silicon from shocks and moisture. Anchors BGA balls in place during reflow soldering and field use.","Provides points to test JTAG/Debug during manufacturing. UMT's JTAG (Row 0x4) and SWD (Row 0xC) live here."],
    code_comment_uart_regular: "VR_ADC_IN4 = plain digital pin (peripheral released)",
    code_comment_led_on: "LED ON",
    code_comment_led_off: "LED OFF",
    code_comment_uart_receiver: "VR_ADC_IN4 = ADC analog input channel",
    // HARDWARE tab
    hw_h: "🔌 Hardware Constraints — ESP32 Flash-Reserved Pins",
    hw_rules: "AIA Rule Engine Hard Rules",
    hw_table_pin: "Pin",
    hw_table_constraint: "Constraint",
    hw_table_severity: "Severity",
    // Translation footer note (shown when language ≠ EN)
    translation_note: "🌐 Translated — Technical terms (VR_*, UMT, AIA, GPIO, BGA, ESP32, ...) stay in English by design.",
    // Pin Concept interactive block UI
    pin_role_label: "THE RULE — ONE LINE DETERMINES THE PIN'S ROLE",
    pin_role_desc1: "deactivate() → Digital (LED, Switch)",
    pin_role_desc2: "activate() → Interface (UART, PWM, ADC, SPI, I2C)",
    interactive_label: "INTERACTIVE — CLICK TO SWITCH PIN ROLE",
    digital_mode: "DIGITAL MODE",
    interface_mode: "INTERFACE MODE",
    select_mode: "SELECT A MODE",
    digital_mode_desc: "Pin behaves as raw digital I/O\\nOnly read/write HIGH/LOW",
    interface_mode_desc: "Pin operates within its protocol\\nUART, PWM, ADC, SPI, I2C, ...",
    none_mode_desc: "Pin can be Digital OR Interface\\nNever both simultaneously",
    btn_deactivate: "deactivate() → Digital",
    btn_activate: "activate() → Interface",
  },
  ar: {
    tabs: { concept:"🎯 مفهوم الـ Pin", gpio:"🔧 VR_GPIOxx الخاص", demos:"▶ عروض توضيحية", bga:"🔲 UMT 16×16 BGA", substrate:"📦 Package Substrate", prompt:"📋 Prompt", hw:"🔌 الـ Hardware" },
    concept_h: "الأدوار المزدوجة للـ Pin — القاعدة العامة",
    concept_main: "كل pin على الـ chip — سواء كان MCU (microcontroller) أو SoC (system-on-chip بمعالج مدمج) — له وظيفة رقمية أساسية: input (مفتاح) أو output (LED). ونفس الـ pin قد يحمل أيضاً واحدة أو أكثر من وظائف الـ interface/protocol (UART, PWM, ADC, SPI, I2C، إلخ).\n\nفي الـ UMT Platform (Unified Microchip Technology)، كل pin محصور في دورين فقط: إمّا Digital أو Interface — وليس كلاهما في نفس الوقت. ينطبق UMT بشكل موحّد على الـ MCUs والـ SoCs التي تُركّب على معيار UMT 16×16 BGA Hybrid MCU (Microcontroller) / SoC (System-on-Chip Processor) Package Substrate Standard.",
    concept_card1: "Digital (deactivate)",
    concept_card2: "Interface (activate)",
    concept_genrule: "القاعدة العامة — جميع الـ Interfaces",
    concept_th_iface: "Interface",
    concept_th_deact: "deactivate() → Digital",
    concept_th_act: "activate() → Interface",
    gpio_h: "VR_GPIOxx حالة خاصة — توسعة المُصنّع",
    gpio_intro: "الصف 0x8 (16 pins: VR_GPIO00–VR_GPIO0F) محجوز لـ interfaces مخصّصة من المُصنّع. هذا يُمكّن صانعي الـ chips من إضافة peripherals خاصة بهم مع الحفاظ على معيار BGA الموحّد.",
    gpio_role1: "الدور 1 — Digital قياسي",
    gpio_role2: "الدور 2 — Interface مخصّص",
    gpio_role1_desc: "Deactivate → 16 pins تعمل كـ I/O خام (LED، زر، input/output عادي)",
    gpio_role2_desc: "Activate VR_NewInterface → protocol مخصّص من المُصنّع. قابل للتقسيم إلى 3-4 sub-interfaces.",
    gpio_arch_h: "واجهات خاصة بالمعمارية (مهم جداً)",
    gpio_arch_intro: "تختلف معماريات المتحكمات — بعض الواجهات توجد في chip ولا توجد في آخر. الـ AVR ATmega328P (8-bit) على NanoKit Integrated له peripherals لا يملكها ESP32 (32-bit Xtensa LX6) والعكس. ولأن لوحة NanoKit Integrated الموحّدة محدودة الـ pins ولا فراغ لكل وظيفة، يختار المطوّر أي MCU يصمّم عليه NanoKit Integrated الخاص به، وأي protocol/interface يستخدمه على كل pin.",
    gpio_example_h: "مثال حقيقي — NanoKit Integrated ESP32 pin 19",
    gpio_example_desc: "الـ pin 19 يقابل إحداثية BGA المسماة VR_0x82، التي تحمل خانة VR_GPIO2. على ESP32 يمكنك اختيار VR_ADC2_IN7 أو VR_RTC_IO17 أو VR_TOUCH7 — peripheral حقيقي واحد لكل pin.",
    gpio_example_note: "دائماً أضف بادئة VR_ لاسم الواجهة الحقيقية — بعض المطورين يحتاجون peripheral موجود في هذا الـ MCU دون آخر. هذا بالضبط متى يُستخدم VR_GPIO interface activate().",
    gpio_r1_title: "الدور 1 — Digital I/O",
    gpio_r1_desc: "يُستخدم كمدخل أو مخرج رقمي قياسي. LED، مفاتيح، أزرار، GPIO أساسي.",
    gpio_r2_title: "الدور 2 — واجهة المُصنّع",
    gpio_r2_desc: "مرتبط بواجهة مخصّصة يحدّدها صانع الـ chip. الـ UMT SDK يحمّل مكتبة المورّد.",
    gpio_split_title: "تقسيم الـ 16 pin إلى عدة interfaces",
    gpio_split_intro: "المصنّعون لديهم الحرية لتقسيم الـ 16 pin من VR_GPIO إلى عدة interfaces مخصّصة:",
    gpio_benefits_title: "الفوائد للمهندسين",
    demos_hint: "اضغط ▶ Animate أو اضغط على أرقام الخطوات · أخضر = Digital · أزرق = Interface",
    bga_h: "16×16 BGA Hybrid MCU (Microcontroller) / SoC (System-on-Chip Processor) Package Substrate Standard (256 ball + 4 external pads)",
    bga_intro: "VR_0x[Row][Column] · الصفوف 0x0–0xF · مرّر فوق أي خلية لرؤية العنوان",
    bga_yellow: "أصفر = NanoKit مقفل",
    bga_intro_hover: "مرّر فوق أي خلية لرؤية العنوان",
    bga_red: "أحمر = ESP32 Flash",
    bga_green: "أخضر = VR_GPIO خاص",
    sub_h: "📦 الـ Package Substrate — حدود الابتكار",
    sub_intro: "صانعو الـ chips يتعاملون مع الـ package substrate كخطوة تغليف روتينية — طريقة بدائية للتعامل مع أهم مرحلة في التصنيع. Amine يرى هذا كصدع يمكن استغلاله: الـ substrate نفسه يمكن أن يصبح سطح الابتكار الكبير القادم.",
    sub_vision: "رؤية Amine",
    sub_quantum: "اختناق Quantum I/O",
    sub_quantum_desc: "الـ packages التقليدية تُمرّر الإشارات عبر مسارات PCB → اختناق bandwidth عند حافة الـ package. UMT يُمرّر الإشارات عبر الـ substrate نفسه → الـ bandwidth يتزايد مع عدد الـ slaves، ليس مع عرض المسار.",
    ms_title: "بنية Master/Slave المتوازية (ابتكار Amine)",
    ms_desc: "الـ UMT IC يعمل كـ Master مع العديد من الـ slave driver ICs المتخصّصة على نفس الـ substrate. تتواصل بالتوازي في نفس الوقت عبر hybrid bus يمزج خصائص SPI + I2C + PCIe.",
    ms_how: "كيف يحلّ الاختناق:",
    ms_b1: "بدلاً من رابط PCIe x4 واحد لجهاز واحد → عشرات الـ slave ICs لكلٍّ مسار مخصّص إلى الـ master",
    ms_b2: "كلها تعمل بالتزامن داخل الـ substrate",
    ms_b3: "النتيجة: الـ bandwidth الإجمالي يتزايد مع عدد الـ slaves، وليس مع عرض مسار PCIe",
    ft_title: "تقنيات الـ Substrate المستقبلية",
    qb_title: "اختناق الـ Quantum — اكتشاف Amine",
    qb_desc: "يسأل Amine: إذا كان الـ quantum chip سريعاً فورياً لكن نقل البيانات بطيء، فما الفائدة؟ الـ quantum يحلّ التعقيد، لا الـ bandwidth.",
    why_title: "لماذا هذا مهم لـ UMT",
    why_p1: "بنية UMT مصمّمة بحيث يمكن استبدال تقنيات الـ substrate المستقبلية دون تغيير الطبقة التي يراها المطوّر. الـ VR_ namespace يُجرّد الربط الفيزيائي: كود UMT للمطوّر يبقى متطابقاً سواء استخدم الـ substrate نحاساً أو ضوئياً أو لاسلكياً.",
    why_p2: "هذا نفس النهج الذي جعل الإنترنت ناجحاً: المطورون لا يهتمّون إن كانت بياناتهم تنتقل عبر WiFi أو Fiber أو 4G — البروتوكول واحد. UMT يطبّق هذا المبدأ على الربط على مستوى الـ chip.",
    hw_locked_title: "NanoKit ESP32 — 34 إحداثية BGA مقفلة (v9)",
    hw_locked_desc: "هذه الإحداثيات مقفلة بشكل دائم لتطابق NanoKit Integrated ESP32 V2020. v9 أضاف VR_GND عند 0xD0 (NanoKit pins 12 و 31).",
    hw_restrict_title: "قيود ESP32 (AIA Rule Engine)",
    prompt_h: "📋 Prompt السياق الرئيسي — لـ AI agents (Claude/GPT/Gemini)",
    prompt_copy: "نسخ إلى الحافظة",
    prompt_copied: "✓ تم النسخ!",
    prompt_sub: "انسخ السياق الكامل (v7) والصقه في بداية أي محادثة جديدة.",
    project_label: "المشروع",
    bga_extpads: "External Power Pads (خارج مصفوفة الـ BGA)",
    sub_8func: "الوظائف الـ 8 الحرجة لـ Package Substrate",
    hw_targets_title: "أهداف الـ Hardware",
    hw_target_a_name: "لوحات التطوير",
    hw_target_b_name: "UMT IC — die الـ MCU على BGA 16×16",
    hw_target_c_name: "NanoKit-iM — MCU قابل للاختيار",
    hw_target_a_ex: "NanoKit ESP32 · Arduino · STM32 Nucleo · Pico · Jetson Nano",
    hw_target_c_ex: "ESP32-D0WD أول MCU · BGA 16×16 substrate",
    hw_virtual: "افتراضي",
    hw_physical: "فيزيائي",
    hw_r1: "GPIO6–11 (VR_GPIO04-09) = SPI flash داخلي — توقّف فوري",
    hw_r2: "GPIO34,35,36,39 = إدخال فقط",
    hw_r3: "GPIO0 (VR_BOOT 0x38) HIGH عند الإقلاع",
    hw_r4: "UART0 (G1/G3) مشترك مع USB-Serial",
    sub_quote: "\"صانعو الـ chips يتعاملون مع Package Substrate كروتين — طريقة بدائية للتعامل مع أهم مرحلة تصنيع. أرى هذا كصدع يمكن استغلاله لتطوير الـ substrate نفسه، باستخدام VR_GPIOxx لتمكين توصيل لاسلكي داخل الـ substrate.\" — Amine Saoud ibn al-Bashir",
    sub_ai_quote: "\"خوادم AI تكدّس آلاف الـ GPUs لأن PCIe و NVLink لهما حدود صارمة. الاستنتاج الأهم: ربطت سرعة المعالجة بمشكلة النقل. الحل: واجهة جديدة على VR_GPIO تمزج بين SPI و I2C و PCIe — تربط UMT IC Master بـ slave drivers كثيرة بالتوازي داخل الـ Package Substrate.\"",
    sf_titles: ["توجيه الإشارات (Signal Routing)","شبكة توزيع الطاقة (PDN)","الإدارة الحرارية","EMI / سلامة الإشارة","تكامل الذاكرة","ربط Multi-die / Chiplet","الحماية الميكانيكية","واجهة الاختبار"],
    sf_descs: ["يربط CPU/GPU/MCU داخل الـ chip بـ Pins/BGA الخارجية عبر طبقات نحاسية متعددة (مثل PCB مصغّر). أساس PCIe و USB و GPIO.","يوزّع الجهود: Core (1V)، I/O (1.8V/3.3V). يقلّل الضوضاء. يحافظ على استقرار الجهد. حرج في AMD CPUs و Apple SoCs.","ينقل الحرارة من الـ silicon إلى heat spreader/heatsink عبر thermal vias و طبقات نحاسية و exposed pads. الـ 4 external pads في UMT تخدم هذا الغرض.","يمنع crosstalk وتشويه الإشارة. يحافظ على جودة الإشارة لـ PCIe و DDR و USB3 — حيث التدهور البسيط يسبب أخطاء بيانات هائلة.","يربط LPDDR/DDR. أحياناً توضع الذاكرة فوق المعالج (PoP). أمثلة: Snapdragon، Apple A، Exynos، NVIDIA، HiSilicon Kirin (Huawei). UMT يدعم هذا عبر Rows 0x9+0xA.","يربط CPU+GPU+NPU كـ chiplets منفصلة، أو يربط chiplets متعددة. أمثلة: Intel Foveros، NVIDIA HBM+GPU.","يحمي الـ silicon من الصدمات والرطوبة. يثبّت كرات الـ BGA في مكانها أثناء reflow soldering والاستخدام الميداني.","يوفّر نقاطاً لاختبار JTAG/Debug أثناء التصنيع. JTAG (Row 0x4) و SWD (Row 0xC) في UMT يوجدان هنا."],
    code_comment_uart_regular: "VR_ADC_IN4 = pin رقمي عادي (تمّ تحرير الـ peripheral)",
    code_comment_led_on: "LED مضيء",
    code_comment_led_off: "LED مطفأ",
    code_comment_uart_receiver: "VR_ADC_IN4 = قناة إدخال تناظرية ADC",
    hw_h: "🔌 قيود الـ Hardware — Pins محجوزة لـ ESP32 Flash",
    hw_rules: "قواعد صارمة لـ AIA Rule Engine",
    hw_table_pin: "Pin",
    hw_table_constraint: "القيد",
    hw_table_severity: "الخطورة",
    translation_note: "🌐 مُترجَم — المصطلحات التقنية (VR_*, UMT, AIA, GPIO, BGA, ESP32, ...) تبقى بالإنجليزية عن قصد.",
    pin_role_label: "القاعدة — سطر واحد يحدّد دور الـ Pin",
    pin_role_desc1: "deactivate() → Digital (LED، Switch)",
    pin_role_desc2: "activate() → Interface (UART، PWM، ADC، SPI، I2C)",
    interactive_label: "تفاعلي — اضغط لتبديل دور الـ Pin",
    digital_mode: "وضع Digital",
    interface_mode: "وضع Interface",
    select_mode: "اختر وضعاً",
    digital_mode_desc: "الـ Pin يعمل كـ I/O رقمي خام\\nقراءة/كتابة HIGH/LOW فقط",
    interface_mode_desc: "الـ Pin يعمل ضمن protocol الخاص به\\nUART، PWM، ADC، SPI، I2C، ...",
    none_mode_desc: "الـ Pin إما Digital أو Interface\\nأبداً ليس كلاهما معاً",
    btn_deactivate: "deactivate() → Digital",
    btn_activate: "activate() → Interface",
  },
  ru: {
    tabs: { concept:"🎯 Концепция Pin", gpio:"🔧 VR_GPIOxx Спец.", demos:"▶ Демо", bga:"🔲 UMT 16×16 BGA", substrate:"📦 Package Substrate", prompt:"📋 Prompt", hw:"🔌 Hardware" },
    concept_h: "Двойные роли Pin — универсальное правило",
    concept_main: "Каждый pin на chip — будь то MCU (microcontroller) или SoC (system-on-chip со встроенным процессором) — имеет основную цифровую функцию: input (переключатель) или output (LED). Тот же pin может также нести одну или несколько функций interface/protocol (UART, PWM, ADC, SPI, I2C и т.д.).\n\nВ UMT Platform (Unified Microchip Technology) каждый pin ограничен только двумя ролями: либо Digital, либо Interface — не обеими одновременно. UMT применяется одинаково к MCUs и SoCs, монтируемым на стандарт UMT 16×16 BGA Hybrid MCU (Microcontroller) / SoC (System-on-Chip Processor) Package Substrate Standard.",
    concept_card1: "Digital (deactivate)",
    concept_card2: "Interface (activate)",
    concept_genrule: "Общее правило — все интерфейсы",
    concept_th_iface: "Interface",
    concept_th_deact: "deactivate() → Digital",
    concept_th_act: "activate() → Interface",
    gpio_h: "VR_GPIOxx — особый случай — расширение производителя",
    gpio_intro: "Ряд 0x8 (16 pins: VR_GPIO00–VR_GPIO0F) зарезервирован для пользовательских интерфейсов производителя. Это позволяет производителям chips добавлять свои peripherals, сохраняя единый стандарт BGA.",
    gpio_role1: "Роль 1 — Стандартный Digital",
    gpio_role2: "Роль 2 — Пользовательский Interface",
    gpio_role1_desc: "Deactivate → 16 pins работают как обычные I/O (LED, кнопка, input/output)",
    gpio_role2_desc: "Activate VR_NewInterface → пользовательский protocol производителя. Разделяемый на 3-4 sub-interfaces.",
    gpio_arch_h: "Интерфейсы, зависящие от архитектуры (Очень важно)",
    gpio_arch_intro: "Архитектуры MCU различаются — некоторые интерфейсы есть на одном chip, но нет на другом. AVR ATmega328P (8-bit) на NanoKit Integrated имеет периферию, которой нет у ESP32 (32-bit Xtensa LX6), и наоборот. Поскольку единая плата NanoKit Integrated имеет ограниченные pins без места для всех функций, разработчик ВЫБИРАЕТ, на каком MCU строить свой NanoKit Integrated, и какой protocol/interface использовать на каждом pin.",
    gpio_example_h: "Реальный пример — NanoKit Integrated ESP32 pin 19",
    gpio_example_desc: "pin 19 соответствует координате BGA VR_0x82, содержащей слот VR_GPIO2. На ESP32 можно выбрать VR_ADC2_IN7, VR_RTC_IO17 или VR_TOUCH7 — одна реальная периферия на pin.",
    gpio_example_note: "Всегда добавляйте префикс VR_ к реальному имени интерфейса — некоторым разработчикам нужна периферия, которая есть на ЭТОМ MCU, но нет на другом. Именно тогда используется VR_GPIO interface activate().",
    gpio_r1_title: "РОЛЬ 1 — Digital I/O",
    gpio_r1_desc: "Используется как стандартный цифровой вход или выход. LED, переключатели, кнопки, базовый GPIO.",
    gpio_r2_title: "РОЛЬ 2 — Interface производителя",
    gpio_r2_desc: "Привязан к пользовательскому интерфейсу, определённому производителем chip. UMT SDK загружает библиотеку вендора.",
    gpio_split_title: "Разделение 16 pins на несколько interfaces",
    gpio_split_intro: "Производители имеют СВОБОДУ делить 16 pins VR_GPIO на несколько пользовательских interfaces:",
    gpio_benefits_title: "Преимущества для инженеров",
    demos_hint: "Нажмите ▶ Animate или номера шагов · Зелёный = Digital · Синий = Interface",
    bga_h: "16×16 BGA Hybrid MCU (Microcontroller) / SoC (System-on-Chip Processor) Package Substrate Standard (256 balls + 4 external pads)",
    bga_intro: "VR_0x[Row][Column] · Ряды 0x0–0xF · Наведите на ячейку для адреса",
    bga_yellow: "Жёлтый = NanoKit Locked",
    bga_intro_hover: "Наведите на ячейку для адреса",
    bga_red: "Красный = ESP32 Flash",
    bga_green: "Зелёный = VR_GPIO Особый",
    sub_h: "📦 Package Substrate — граница инноваций",
    sub_intro: "Производители chips относятся к package substrate как к рутинному этапу упаковки — примитивный подход к важнейшему этапу производства. Amine видит здесь возможность: сам substrate может стать следующей поверхностью больших инноваций.",
    sub_vision: "Видение Amine",
    sub_quantum: "Quantum I/O — узкое место",
    sub_quantum_desc: "Традиционные packages маршрутизируют сигналы через дорожки PCB → узкое место пропускной способности на краю package. UMT маршрутизирует через сам substrate → пропускная способность масштабируется с числом slaves, а не шириной шины.",
    ms_title: "Параллельная архитектура Master/Slave (Инновация Amine)",
    ms_desc: "UMT IC работает как Master со многими специализированными slave driver ICs на одном substrate. Они общаются параллельно одновременно через hybrid bus, сочетающий характеристики SPI + I2C + PCIe.",
    ms_how: "Как это решает узкое место:",
    ms_b1: "Вместо одной линии PCIe x4 к одному устройству → десятки slave ICs, каждый с выделенным путём к master",
    ms_b2: "Все работают одновременно внутри substrate",
    ms_b3: "Результат: совокупная пропускная способность масштабируется с числом slaves, а НЕ с шириной линии PCIe",
    ft_title: "Будущие технологии Substrate",
    qb_title: "Quantum-узкое место — Открытие Amine",
    qb_desc: "Amine спрашивает: Если quantum chip мгновенно быстр, но передача данных медленная, какой смысл? Quantum решает сложность, а не пропускную способность.",
    why_title: "Почему это важно для UMT",
    why_p1: "Архитектура UMT спроектирована так, что будущие технологии substrate можно заменить без изменения слоя, видимого разработчику. Пространство имён VR_ абстрагирует физическое соединение: код UMT разработчика остаётся идентичным, использует ли substrate медь, оптику или беспроводную связь.",
    why_p2: "Это тот же подход, что сделал Интернет успешным: разработчикам неважно, идут ли данные по WiFi, Fiber или 4G — protocol тот же. UMT применяет этот принцип к соединению на уровне chip.",
    hw_locked_title: "NanoKit ESP32 — 34 заблокированные координаты BGA (v9)",
    hw_locked_desc: "Эти координаты ПОСТОЯННО заблокированы для соответствия NanoKit Integrated ESP32 V2020. v9 добавил VR_GND на 0xD0 (NanoKit pins 12 и 31).",
    hw_restrict_title: "Ограничения ESP32 (AIA Rule Engine)",
    prompt_h: "📋 Главный контекст Prompt — для AI agents (Claude/GPT/Gemini)",
    prompt_copy: "Копировать",
    prompt_copied: "✓ Скопировано!",
    prompt_sub: "Скопируйте полный контекст (v7) и вставьте в начало любого нового разговора.",
    project_label: "Проект",
    bga_extpads: "External Power Pads (вне матрицы BGA)",
    sub_8func: "8 критических функций Package Substrate",
    hw_targets_title: "Аппаратные Цели",
    hw_target_a_name: "Платы для разработки",
    hw_target_b_name: "UMT IC — MCU Die на BGA 16×16",
    hw_target_c_name: "NanoKit-iM — Выбираемый MCU",
    hw_target_a_ex: "NanoKit ESP32 · Arduino · STM32 Nucleo · Pico · Jetson Nano",
    hw_target_c_ex: "ESP32-D0WD первый MCU · BGA 16×16 substrate",
    hw_virtual: "ВИРТУАЛЬНЫЙ",
    hw_physical: "ФИЗИЧЕСКИЙ",
    hw_r1: "GPIO6–11 (VR_GPIO04-09) = внутренний SPI flash — HARD ABORT",
    hw_r2: "GPIO34,35,36,39 = ТОЛЬКО ВВОД",
    hw_r3: "GPIO0 (VR_BOOT 0x38) HIGH при загрузке",
    hw_r4: "UART0 (G1/G3) общий с USB-Serial",
    sub_quote: "\"Производители chip относятся к Package Substrate как к рутине — примитивный подход к важнейшему этапу производства. Я вижу это как трещину, которую можно использовать для развития самого substrate, применяя VR_GPIOxx для беспроводного соединения внутри substrate.\" — Amine Saoud ibn al-Bashir",
    sub_ai_quote: "\"AI-серверы устанавливают тысячи GPU, потому что PCIe и NVLink имеют жёсткие ограничения. Важнейший вывод: я связал скорость обработки и проблему передачи. Решение — новый interface на VR_GPIO, смешанный между SPI, I2C и PCIe — соединяющий UMT IC Master со многими slave drivers параллельно внутри Package Substrate.\"",
    sf_titles: ["Маршрутизация сигналов","Сеть распределения питания (PDN)","Управление теплом","EMI / Целостность сигнала","Интеграция памяти","Связь Multi-die / Chiplet","Механическая защита","Тестовый интерфейс"],
    sf_descs: ["Соединяет CPU/GPU/MCU внутри chip с внешними Pins/BGA через несколько медных слоёв (как миниатюрный PCB). Основа PCIe, USB, GPIO.","Распределяет напряжения: Core (1V), I/O (1.8V/3.3V). Уменьшает шум. Поддерживает стабильность напряжения. Критично в AMD CPUs и Apple SoCs.","Отводит тепло от silicon к heat spreader/heatsink через thermal vias, медные плоскости и exposed pads. 4 external pads UMT служат этой цели.","Предотвращает crosstalk и искажение сигнала. Поддерживает качество сигнала для PCIe, DDR, USB3 — где малая деградация вызывает огромные ошибки данных.","Соединяет LPDDR/DDR. Иногда память размещается над процессором (PoP). Примеры: Snapdragon, Apple A, Exynos, NVIDIA, HiSilicon Kirin (Huawei). UMT поддерживает через Rows 0x9+0xA.","Соединяет CPU+GPU+NPU как отдельные chiplets, или связывает несколько chiplets. Примеры: Intel Foveros, NVIDIA HBM+GPU.","Защищает silicon от ударов и влаги. Фиксирует BGA balls во время reflow soldering и полевого использования.","Предоставляет точки для тестирования JTAG/Debug во время производства. JTAG (Row 0x4) и SWD (Row 0xC) в UMT находятся здесь."],
    code_comment_uart_regular: "VR_ADC_IN4 = обычный цифровой pin (peripheral освобождён)",
    code_comment_led_on: "LED ВКЛ",
    code_comment_led_off: "LED ВЫКЛ",
    code_comment_uart_receiver: "VR_ADC_IN4 = аналоговый входной канал ADC",
    hw_h: "🔌 Аппаратные ограничения — Pins зарезервированные для ESP32 Flash",
    hw_rules: "Жёсткие правила AIA Rule Engine",
    hw_table_pin: "Pin",
    hw_table_constraint: "Ограничение",
    hw_table_severity: "Серьёзность",
    translation_note: "🌐 Переведено — Технические термины (VR_*, UMT, AIA, GPIO, BGA, ESP32, ...) намеренно остаются на английском.",
    pin_role_label: "ПРАВИЛО — ОДНА СТРОКА ОПРЕДЕЛЯЕТ РОЛЬ PIN",
    pin_role_desc1: "deactivate() → Digital (LED, Switch)",
    pin_role_desc2: "activate() → Interface (UART, PWM, ADC, SPI, I2C)",
    interactive_label: "ИНТЕРАКТИВНО — НАЖМИТЕ ДЛЯ СМЕНЫ РОЛИ PIN",
    digital_mode: "РЕЖИМ DIGITAL",
    interface_mode: "РЕЖИМ INTERFACE",
    select_mode: "ВЫБЕРИТЕ РЕЖИМ",
    digital_mode_desc: "Pin работает как raw digital I/O\\nТолько чтение/запись HIGH/LOW",
    interface_mode_desc: "Pin работает в рамках своего protocol\\nUART, PWM, ADC, SPI, I2C, ...",
    none_mode_desc: "Pin может быть Digital ИЛИ Interface\\nНикогда оба одновременно",
    btn_deactivate: "deactivate() → Digital",
    btn_activate: "activate() → Interface",
  },
  hi: {
    tabs: { concept:"🎯 Pin अवधारणा", gpio:"🔧 VR_GPIOxx विशेष", demos:"▶ डेमो", bga:"🔲 UMT 16×16 BGA", substrate:"📦 Package Substrate", prompt:"📋 Prompt", hw:"🔌 Hardware" },
    concept_h: "Pin दोहरी भूमिकाएँ — सार्वभौमिक नियम",
    concept_main: "chip पर हर pin — चाहे MCU (microcontroller) हो या SoC (अंतर्निहित processor वाला system-on-chip) — की एक प्राथमिक digital फ़ंक्शन होती है: input (switch) या output (LED)। वही pin एक या अधिक interface/protocol फ़ंक्शन भी ले जा सकता है (UART, PWM, ADC, SPI, I2C, आदि)।\n\nUMT Platform (Unified Microchip Technology) में, हर pin केवल दो भूमिकाओं तक सीमित है: या तो Digital या Interface — एक साथ दोनों नहीं। UMT समान रूप से उन MCUs और SoCs पर लागू होता है जो UMT 16×16 BGA Hybrid MCU (Microcontroller) / SoC (System-on-Chip Processor) Package Substrate Standard पर माउंट होते हैं।",
    concept_card1: "Digital (deactivate)",
    concept_card2: "Interface (activate)",
    concept_genrule: "सामान्य नियम — सभी Interfaces",
    concept_th_iface: "Interface",
    concept_th_deact: "deactivate() → Digital",
    concept_th_act: "activate() → Interface",
    gpio_h: "VR_GPIOxx विशेष मामला — निर्माता विस्तार",
    gpio_intro: "Row 0x8 (16 pins: VR_GPIO00–VR_GPIO0F) निर्माता-परिभाषित custom interfaces के लिए आरक्षित है। यह chip निर्माताओं को unified BGA standard को बनाए रखते हुए अपने proprietary peripherals जोड़ने में सक्षम बनाता है।",
    gpio_role1: "भूमिका 1 — मानक Digital",
    gpio_role2: "भूमिका 2 — Custom Interface",
    gpio_role1_desc: "Deactivate → 16 pins raw I/O के रूप में काम करते हैं (LED, switch, button)",
    gpio_role2_desc: "Activate VR_NewInterface → निर्माता-परिभाषित custom protocol। 3-4 sub-interfaces में विभाज्य।",
    gpio_arch_h: "आर्किटेक्चर-विशिष्ट Interfaces (बहुत महत्वपूर्ण)",
    gpio_arch_intro: "MCU आर्किटेक्चर भिन्न होते हैं — कुछ interfaces एक chip पर हैं लेकिन दूसरे पर नहीं। NanoKit Integrated पर AVR ATmega328P (8-bit) में ऐसे peripherals हैं जो ESP32 (32-bit Xtensa LX6) में नहीं, और इसके विपरीत। चूंकि एकीकृत NanoKit Integrated बोर्ड में सीमित pins हैं, developer चुनता है कि किस MCU पर अपना NanoKit Integrated बनाना है, और हर pin पर कौन सा protocol/interface उपयोग करना है।",
    gpio_example_h: "वास्तविक उदाहरण — NanoKit Integrated ESP32 pin 19",
    gpio_example_desc: "pin 19 BGA निर्देशांक VR_0x82 से मैप होता है, जिसमें slot VR_GPIO2 है। ESP32 पर आप VR_ADC2_IN7, VR_RTC_IO17, या VR_TOUCH7 चुन सकते हैं — प्रति pin एक वास्तविक peripheral।",
    gpio_example_note: "हमेशा वास्तविक interface नाम में VR_ उपसर्ग जोड़ें — कुछ developers को ऐसा peripheral चाहिए जो इस MCU पर है पर दूसरे पर नहीं। यही वह समय है जब VR_GPIO interface activate() उपयोग होता है।",
    gpio_r1_title: "भूमिका 1 — Digital I/O",
    gpio_r1_desc: "मानक digital input या output के रूप में उपयोग। LED, switches, buttons, बुनियादी GPIO।",
    gpio_r2_title: "भूमिका 2 — निर्माता Interface",
    gpio_r2_desc: "chip निर्माता द्वारा परिभाषित custom interface से बंधा। UMT SDK वेंडर लाइब्रेरी लोड करता है।",
    gpio_split_title: "16 pins को कई interfaces में विभाजित करना",
    gpio_split_intro: "निर्माताओं को 16 VR_GPIO pins को कई custom interfaces में विभाजित करने की स्वतंत्रता है:",
    gpio_benefits_title: "इंजीनियरों के लिए लाभ",
    demos_hint: "▶ Animate पर क्लिक करें या step नंबरों पर क्लिक करें · हरा = Digital · नीला = Interface",
    bga_h: "16×16 BGA Hybrid MCU (Microcontroller) / SoC (System-on-Chip Processor) Package Substrate Standard (256 balls + 4 external pads)",
    bga_intro: "VR_0x[Row][Column] · Rows 0x0–0xF · address देखने के लिए किसी भी cell पर hover करें",
    bga_yellow: "पीला = NanoKit Locked",
    bga_intro_hover: "address देखने के लिए किसी भी cell पर hover करें",
    bga_red: "लाल = ESP32 Flash",
    bga_green: "हरा = VR_GPIO विशेष",
    sub_h: "📦 Package Substrate — नवाचार की सीमा",
    sub_intro: "Chip निर्माता package substrate को एक नियमित packaging चरण के रूप में मानते हैं — सबसे महत्वपूर्ण निर्माण चरण को संभालने का एक आदिम तरीका। Amine इसे एक दरार के रूप में देखते हैं जिसका उपयोग किया जा सकता है: substrate स्वयं अगला प्रमुख नवाचार सतह बन सकता है।",
    sub_vision: "Amine का दृष्टिकोण",
    sub_quantum: "Quantum I/O अवरोध",
    sub_quantum_desc: "पारंपरिक packages संकेतों को PCB tracks के माध्यम से route करते हैं → package किनारे पर bandwidth अवरोध। UMT signals को substrate के माध्यम से route करता है → bandwidth slaves की संख्या के साथ scale होता है, lane width के साथ नहीं।",
    ms_title: "Master/Slave समानांतर आर्किटेक्चर (Amine का नवाचार)",
    ms_desc: "UMT IC एक ही substrate पर कई विशेष slave driver ICs के साथ Master के रूप में काम करता है। वे SPI + I2C + PCIe विशेषताओं को मिलाने वाले hybrid bus पर एक साथ समानांतर में संवाद करते हैं।",
    ms_how: "यह अवरोध को कैसे हल करता है:",
    ms_b1: "एक डिवाइस के लिए एकल PCIe x4 लिंक के बजाय → दर्जनों slave ICs प्रत्येक का master तक समर्पित पथ",
    ms_b2: "सभी substrate के अंदर एक साथ चल रहे हैं",
    ms_b3: "परिणाम: कुल bandwidth slaves की संख्या के साथ scale होता है, PCIe lane width के साथ नहीं",
    ft_title: "भविष्य की Substrate तकनीकें",
    qb_title: "Quantum अवरोध — Amine की खोज",
    qb_desc: "Amine पूछते हैं: यदि quantum chip तुरंत तेज़ है लेकिन data transfer धीमा है, तो क्या उपयोग? Quantum जटिलता हल करता है, bandwidth नहीं।",
    why_title: "यह UMT के लिए क्यों महत्वपूर्ण है",
    why_p1: "UMT आर्किटेक्चर इस तरह डिज़ाइन किया गया है कि भविष्य की substrate तकनीकों को developer-facing layer बदले बिना स्वैप किया जा सके। VR_ namespace भौतिक interconnect को abstract करता है: developer का UMT code समान रहता है चाहे substrate copper, optical, या wireless उपयोग करे।",
    why_p2: "यह वही दृष्टिकोण है जिसने Internet को सफल बनाया: developers को परवाह नहीं कि उनका data WiFi, Fiber, या 4G पर जाता है — protocol समान है। UMT इस सिद्धांत को chip-level interconnect पर लागू करता है।",
    hw_locked_title: "NanoKit ESP32 — 34 Locked BGA निर्देशांक (v9)",
    hw_locked_desc: "ये निर्देशांक NanoKit Integrated ESP32 V2020 से मेल खाने के लिए स्थायी रूप से locked हैं। v9 ने 0xD0 पर VR_GND जोड़ा (NanoKit pins 12 और 31)।",
    hw_restrict_title: "ESP32 प्रतिबंध (AIA Rule Engine)",
    prompt_h: "📋 Master Context Prompt — AI agents के लिए (Claude/GPT/Gemini)",
    prompt_copy: "Clipboard पर copy करें",
    prompt_copied: "✓ Copy किया गया!",
    prompt_sub: "पूरा context (v7) कॉपी करें और किसी भी नई बातचीत की शुरुआत में पेस्ट करें।",
    project_label: "प्रोजेक्ट",
    bga_extpads: "External Power Pads (BGA Matrix के बाहर)",
    sub_8func: "Package Substrate के 8 महत्वपूर्ण कार्य",
    hw_targets_title: "Hardware लक्ष्य",
    hw_target_a_name: "विकास बोर्ड",
    hw_target_b_name: "UMT IC — BGA 16×16 पर MCU Die",
    hw_target_c_name: "NanoKit-iM — चुनने योग्य MCU",
    hw_target_a_ex: "NanoKit ESP32 · Arduino · STM32 Nucleo · Pico · Jetson Nano",
    hw_target_c_ex: "ESP32-D0WD पहला MCU · BGA 16×16 substrate",
    hw_virtual: "वर्चुअल",
    hw_physical: "भौतिक",
    hw_r1: "GPIO6–11 (VR_GPIO04-09) = आंतरिक SPI flash — HARD ABORT",
    hw_r2: "GPIO34,35,36,39 = केवल INPUT",
    hw_r3: "GPIO0 (VR_BOOT 0x38) बूट पर HIGH",
    hw_r4: "UART0 (G1/G3) USB-Serial साझा",
    sub_quote: "\"Chip निर्माता Package Substrate को रूटीन मानते हैं — सबसे महत्वपूर्ण निर्माण चरण को संभालने का आदिम तरीका। मैं इसे एक दरार के रूप में देखता हूँ जिसे substrate को विकसित करने के लिए उपयोग किया जा सकता है, VR_GPIOxx का उपयोग करके substrate के अंदर वायरलेस इंटरकनेक्ट सक्षम करना।\" — Amine Saoud ibn al-Bashir",
    sub_ai_quote: "\"AI सर्वर हजारों GPUs को स्टैक करते हैं क्योंकि PCIe और NVLink की कठोर सीमाएं हैं। सबसे महत्वपूर्ण निष्कर्ष: मैंने प्रोसेसिंग गति और ट्रांसमिशन समस्या को जोड़ा। समाधान VR_GPIO पर एक नया interface है जो SPI, I2C, और PCIe के बीच मिश्रित है — UMT IC Master को Package Substrate के अंदर समानांतर में कई slave drivers से जोड़ता है।\"",
    sf_titles: ["सिग्नल रूटिंग","पावर डिस्ट्रिब्यूशन नेटवर्क (PDN)","थर्मल प्रबंधन","EMI / सिग्नल इंटिग्रिटी","मेमोरी एकीकरण","Multi-die / Chiplet इंटरकनेक्ट","यांत्रिक सुरक्षा","परीक्षण Interface"],
    sf_descs: ["chip के अंदर CPU/GPU/MCU को बाहरी Pins/BGA से कई तांबे की परतों के माध्यम से जोड़ता है (एक miniature PCB की तरह)। PCIe, USB, GPIO की नींव।","वोल्टेज वितरित करता है: Core (1V), I/O (1.8V/3.3V)। शोर कम करता है। वोल्टेज स्थिरता बनाए रखता है। AMD CPUs और Apple SoCs में महत्वपूर्ण।","thermal vias, तांबे की प्लेन्स, और exposed pads के माध्यम से silicon से heat spreader/heatsink तक गर्मी का संचालन करता है। UMT के 4 external pads इस उद्देश्य की सेवा करते हैं।","crosstalk और सिग्नल विरूपण को रोकता है। PCIe, DDR, USB3 के लिए सिग्नल गुणवत्ता बनाए रखता है — जहाँ छोटी गिरावट बड़ी डेटा त्रुटियाँ पैदा करती है।","LPDDR/DDR को जोड़ता है। कभी-कभी memory प्रोसेसर के ऊपर रखी जाती है (PoP)। उदाहरण: Snapdragon, Apple A, Exynos, NVIDIA, HiSilicon Kirin (Huawei)। UMT Rows 0x9+0xA के माध्यम से समर्थन करता है।","CPU+GPU+NPU को अलग chiplets के रूप में जोड़ता है, या कई chiplets को लिंक करता है। उदाहरण: Intel Foveros, NVIDIA HBM+GPU।","silicon को झटकों और नमी से बचाता है। reflow soldering और फील्ड उपयोग के दौरान BGA balls को अपनी जगह पर एंकर करता है।","निर्माण के दौरान JTAG/Debug का परीक्षण करने के लिए बिंदु प्रदान करता है। UMT के JTAG (Row 0x4) और SWD (Row 0xC) यहाँ हैं।"],
    code_comment_uart_regular: "VR_ADC_IN4 = सामान्य digital pin (peripheral रिलीज़ हो गया)",
    code_comment_led_on: "LED ON",
    code_comment_led_off: "LED OFF",
    code_comment_uart_receiver: "VR_ADC_IN4 = ADC एनालॉग इनपुट चैनल",
    hw_h: "🔌 Hardware बाधाएँ — ESP32 Flash-Reserved Pins",
    hw_rules: "AIA Rule Engine कठोर नियम",
    hw_table_pin: "Pin",
    hw_table_constraint: "बाधा",
    hw_table_severity: "गंभीरता",
    translation_note: "🌐 अनुवादित — तकनीकी शब्द (VR_*, UMT, AIA, GPIO, BGA, ESP32, ...) उद्देश्यपूर्ण रूप से अंग्रेज़ी में रहते हैं।",
    pin_role_label: "नियम — एक पंक्ति Pin की भूमिका निर्धारित करती है",
    pin_role_desc1: "deactivate() → Digital (LED, Switch)",
    pin_role_desc2: "activate() → Interface (UART, PWM, ADC, SPI, I2C)",
    interactive_label: "इंटरैक्टिव — Pin भूमिका बदलने के लिए क्लिक करें",
    digital_mode: "DIGITAL मोड",
    interface_mode: "INTERFACE मोड",
    select_mode: "एक मोड चुनें",
    digital_mode_desc: "Pin raw digital I/O के रूप में काम करता है\\nकेवल HIGH/LOW पढ़ें/लिखें",
    interface_mode_desc: "Pin अपने protocol के भीतर काम करता है\\nUART, PWM, ADC, SPI, I2C, ...",
    none_mode_desc: "Pin Digital या Interface हो सकता है\\nएक साथ कभी दोनों नहीं",
    btn_deactivate: "deactivate() → Digital",
    btn_activate: "activate() → Interface",
  },
  es: {
    tabs: { concept:"🎯 Concepto Pin", gpio:"🔧 VR_GPIOxx Especial", demos:"▶ Demos", bga:"🔲 UMT 16×16 BGA", substrate:"📦 Package Substrate", prompt:"📋 Prompt", hw:"🔌 Hardware" },
    concept_h: "Roles duales del Pin — Regla universal",
    concept_main: "Cada pin de un chip — ya sea MCU (microcontroller) o SoC (system-on-chip con processor integrado) — tiene una función digital primaria: input (switch) o output (LED). Ese mismo pin también puede tener una o más funciones de interface/protocol (UART, PWM, ADC, SPI, I2C, etc.).\n\nEn la UMT Platform (Unified Microchip Technology), cada pin se limita a solo dos roles posibles: Digital o Interface — no ambos al mismo tiempo. UMT se aplica uniformemente a MCUs y SoCs que se montan en el estándar UMT 16×16 BGA Hybrid MCU (Microcontroller) / SoC (System-on-Chip Processor) Package Substrate Standard.",
    concept_card1: "Digital (deactivate)",
    concept_card2: "Interface (activate)",
    concept_genrule: "Regla General — Todas las Interfaces",
    concept_th_iface: "Interface",
    concept_th_deact: "deactivate() → Digital",
    concept_th_act: "activate() → Interface",
    gpio_h: "VR_GPIOxx Caso Especial — Extensión del Fabricante",
    gpio_intro: "La fila 0x8 (16 pins: VR_GPIO00–VR_GPIO0F) está reservada para interfaces personalizadas definidas por el fabricante. Esto permite a los fabricantes de chips agregar sus peripherals propietarios mientras preservan el estándar BGA unificado.",
    gpio_role1: "Rol 1 — Digital Estándar",
    gpio_role2: "Rol 2 — Interface Personalizada",
    gpio_role1_desc: "Deactivate → 16 pins funcionan como I/O básico (LED, switch, button)",
    gpio_role2_desc: "Activate VR_NewInterface → protocol personalizado del fabricante. Divisible en 3-4 sub-interfaces.",
    gpio_arch_h: "Interfaces Específicas de la Arquitectura (Muy Importante)",
    gpio_arch_intro: "Las arquitecturas MCU difieren — algunas interfaces existen en un chip pero no en otro. El AVR ATmega328P (8-bit) en NanoKit Integrated tiene peripherals que el ESP32 (32-bit Xtensa LX6) no tiene, y viceversa. Como la placa unificada NanoKit Integrated tiene pins limitados sin espacio para cada función, el developer ELIGE en qué MCU diseñar su propio NanoKit Integrated, y qué protocol/interface usar en cada pin.",
    gpio_example_h: "Ejemplo Real — NanoKit Integrated ESP32 pin 19",
    gpio_example_desc: "pin 19 mapea a la coordenada BGA VR_0x82, que contiene el slot VR_GPIO2. En ESP32 puedes elegir VR_ADC2_IN7, VR_RTC_IO17, o VR_TOUCH7 — un peripheral real por pin.",
    gpio_example_note: "Siempre agrega el prefijo VR_ al nombre real de la interface — algunos developers necesitan un peripheral que existe en ESTE MCU pero no en otro. Justo entonces se usa VR_GPIO interface activate().",
    gpio_r1_title: "ROL 1 — Digital I/O",
    gpio_r1_desc: "Usado como entrada o salida digital estándar. LED, switches, botones, GPIO básico.",
    gpio_r2_title: "ROL 2 — Interface del Fabricante",
    gpio_r2_desc: "Vinculado a una interface personalizada definida por el fabricante del chip. UMT SDK carga la librería del proveedor.",
    gpio_split_title: "Dividir 16 Pins en Múltiples Interfaces",
    gpio_split_intro: "Los fabricantes tienen LIBERTAD para dividir los 16 pins VR_GPIO en múltiples interfaces personalizadas:",
    gpio_benefits_title: "Beneficios para Ingenieros",
    demos_hint: "Haz clic en ▶ Animate o en números de paso · Verde = Digital · Azul = Interface",
    bga_h: "16×16 BGA Hybrid MCU (Microcontroller) / SoC (System-on-Chip Processor) Package Substrate Standard (256 balls + 4 external pads)",
    bga_intro: "VR_0x[Fila][Columna] · Filas 0x0–0xF · Pasa el cursor sobre cualquier celda para ver la dirección",
    bga_yellow: "Amarillo = NanoKit Locked",
    bga_intro_hover: "Pasa el cursor sobre cualquier celda para ver la dirección",
    bga_red: "Rojo = ESP32 Flash",
    bga_green: "Verde = VR_GPIO Especial",
    sub_h: "📦 Package Substrate — La Frontera de la Innovación",
    sub_intro: "Los fabricantes de chips tratan el package substrate como un paso de empaquetado rutinario — una forma primitiva de manejar la etapa más importante de fabricación. Amine ve esto como una fisura para explotar: el substrate mismo puede convertirse en la próxima gran superficie de innovación.",
    sub_vision: "Visión de Amine",
    sub_quantum: "Cuello de botella Quantum I/O",
    sub_quantum_desc: "Los packages tradicionales enrutan señales a través de pistas PCB → cuello de botella de bandwidth en el borde del package. UMT enruta señales a través del substrate mismo → bandwidth escala con el número de slaves, no con el ancho del lane.",
    ms_title: "Arquitectura Paralela Master/Slave (Innovación de Amine)",
    ms_desc: "El UMT IC actúa como Master con muchos slave driver ICs especializados en el mismo substrate. Se comunican en paralelo al mismo tiempo sobre un hybrid bus que mezcla características de SPI + I2C + PCIe.",
    ms_how: "Cómo resuelve el cuello de botella:",
    ms_b1: "En lugar de un solo enlace PCIe x4 a un dispositivo → docenas de slave ICs cada uno con ruta dedicada al master",
    ms_b2: "Todos ejecutándose concurrentemente dentro del substrate",
    ms_b3: "Resultado: el bandwidth agregado escala con #slaves, NO con el ancho del lane PCIe",
    ft_title: "Tecnologías Futuras de Substrate",
    qb_title: "El Cuello de Botella Quantum — Descubrimiento de Amine",
    qb_desc: "Amine pregunta: Si un quantum chip es instantáneamente rápido pero la transferencia de datos es lenta, ¿de qué sirve? Quantum resuelve complejidad, no bandwidth.",
    why_title: "Por Qué Esto Importa para UMT",
    why_p1: "La arquitectura UMT está diseñada para que las futuras tecnologías de substrate puedan intercambiarse sin cambiar la capa que ve el developer. El namespace VR_ abstrae la interconexión física: el código UMT de un developer permanece idéntico ya sea que el substrate use cobre, óptico o inalámbrico.",
    why_p2: "Este es el mismo enfoque que hizo exitoso a Internet: a los developers no les importa si sus datos viajan por WiFi, Fiber o 4G — el protocol es el mismo. UMT aplica este principio a la interconexión a nivel de chip.",
    hw_locked_title: "NanoKit ESP32 — 34 Coordenadas BGA Bloqueadas (v9)",
    hw_locked_desc: "Estas coordenadas están PERMANENTEMENTE bloqueadas para coincidir con NanoKit Integrated ESP32 V2020. v9 agregó VR_GND en 0xD0 (NanoKit pins 12 y 31).",
    hw_restrict_title: "Restricciones ESP32 (AIA Rule Engine)",
    prompt_h: "📋 Prompt de Contexto Maestro — para agentes AI (Claude/GPT/Gemini)",
    prompt_copy: "Copiar al Portapapeles",
    prompt_copied: "✓ ¡Copiado!",
    prompt_sub: "Copia el contexto completo (v7) y pégalo al inicio de cualquier conversación nueva.",
    project_label: "Proyecto",
    bga_extpads: "External Power Pads (Fuera de la Matriz BGA)",
    sub_8func: "Las 8 Funciones Críticas del Package Substrate",
    hw_targets_title: "Objetivos de Hardware",
    hw_target_a_name: "Placas de Desarrollo",
    hw_target_b_name: "UMT IC — Die MCU en BGA 16×16",
    hw_target_c_name: "NanoKit-iM — MCU Seleccionable",
    hw_target_a_ex: "NanoKit ESP32 · Arduino · STM32 Nucleo · Pico · Jetson Nano",
    hw_target_c_ex: "ESP32-D0WD primer MCU · BGA 16×16 substrate",
    hw_virtual: "VIRTUAL",
    hw_physical: "FÍSICO",
    hw_r1: "GPIO6–11 (VR_GPIO04-09) = SPI flash interno — HARD ABORT",
    hw_r2: "GPIO34,35,36,39 = SOLO ENTRADA",
    hw_r3: "GPIO0 (VR_BOOT 0x38) HIGH al arrancar",
    hw_r4: "UART0 (G1/G3) compartido con USB-Serial",
    sub_quote: "\"Los fabricantes de chips tratan el Package Substrate como rutina — una forma primitiva de manejar la etapa de fabricación más importante. Veo esto como una fisura que puede explotarse para desarrollar el substrate mismo, usando VR_GPIOxx para permitir interconexión inalámbrica dentro del substrate.\" — Amine Saoud ibn al-Bashir",
    sub_ai_quote: "\"Los servidores AI apilan miles de GPUs porque PCIe y NVLink tienen límites duros. La conclusión más importante: vinculé la velocidad de procesamiento y el problema de transmisión. La solución es una nueva interface en VR_GPIO mezclada entre SPI, I2C y PCIe — conectando UMT IC Master a muchos slave drivers en paralelo dentro del Package Substrate.\"",
    sf_titles: ["Enrutamiento de Señales","Red de Distribución de Energía (PDN)","Gestión Térmica","EMI / Integridad de Señal","Integración de Memoria","Interconexión Multi-die / Chiplet","Protección Mecánica","Interface de Pruebas"],
    sf_descs: ["Conecta CPU/GPU/MCU dentro del chip con Pins/BGA externos a través de múltiples capas de cobre (como un PCB miniatura). Base de PCIe, USB, GPIO.","Distribuye voltajes: Core (1V), I/O (1.8V/3.3V). Reduce ruido. Mantiene estabilidad de voltaje. Crítico en AMD CPUs y Apple SoCs.","Conduce calor desde silicon a heat spreader/heatsink mediante thermal vias, planos de cobre y exposed pads. Los 4 external pads de UMT sirven a este propósito.","Previene crosstalk y distorsión de señal. Mantiene calidad de señal para PCIe, DDR, USB3 — donde pequeña degradación causa enormes errores de datos.","Conecta LPDDR/DDR. A veces memoria sobre procesador (PoP). Ejemplos: Snapdragon, Apple A, Exynos, NVIDIA, HiSilicon Kirin (Huawei). UMT soporta vía Rows 0x9+0xA.","Conecta CPU+GPU+NPU como chiplets separados, o enlaza múltiples chiplets. Ejemplos: Intel Foveros, NVIDIA HBM+GPU.","Protege silicon de golpes y humedad. Ancla bolas BGA en su lugar durante reflow soldering y uso en campo.","Proporciona puntos para probar JTAG/Debug durante fabricación. JTAG (Row 0x4) y SWD (Row 0xC) de UMT viven aquí."],
    code_comment_uart_regular: "VR_ADC_IN4 = pin digital regular (periférico liberado)",
    code_comment_led_on: "LED ENCENDIDO",
    code_comment_led_off: "LED APAGADO",
    code_comment_uart_receiver: "VR_ADC_IN4 = canal de entrada analógica ADC",
    hw_h: "🔌 Restricciones de Hardware — Pins Reservados de ESP32 Flash",
    hw_rules: "Reglas Duras del AIA Rule Engine",
    hw_table_pin: "Pin",
    hw_table_constraint: "Restricción",
    hw_table_severity: "Severidad",
    translation_note: "🌐 Traducido — Los términos técnicos (VR_*, UMT, AIA, GPIO, BGA, ESP32, ...) permanecen en inglés intencionalmente.",
    pin_role_label: "LA REGLA — UNA LÍNEA DETERMINA EL ROL DEL PIN",
    pin_role_desc1: "deactivate() → Digital (LED, Switch)",
    pin_role_desc2: "activate() → Interface (UART, PWM, ADC, SPI, I2C)",
    interactive_label: "INTERACTIVO — HAZ CLIC PARA CAMBIAR EL ROL DEL PIN",
    digital_mode: "MODO DIGITAL",
    interface_mode: "MODO INTERFACE",
    select_mode: "SELECCIONA UN MODO",
    digital_mode_desc: "Pin funciona como I/O digital crudo\\nSolo leer/escribir HIGH/LOW",
    interface_mode_desc: "Pin opera dentro de su protocol\\nUART, PWM, ADC, SPI, I2C, ...",
    none_mode_desc: "Pin puede ser Digital O Interface\\nNunca ambos simultáneamente",
    btn_deactivate: "deactivate() → Digital",
    btn_activate: "activate() → Interface",
  },
  de: {
    tabs: { concept:"🎯 Pin-Konzept", gpio:"🔧 VR_GPIOxx Speziell", demos:"▶ Demos", bga:"🔲 UMT 16×16 BGA", substrate:"📦 Package Substrate", prompt:"📋 Prompt", hw:"🔌 Hardware" },
    concept_h: "Pin-Doppelrollen — Universelle Regel",
    concept_main: "Jeder Pin auf einem Chip — ob MCU (microcontroller) oder SoC (system-on-chip mit integriertem Processor) — hat eine primäre digitale Funktion: input (Schalter) oder output (LED). Derselbe Pin kann auch eine oder mehrere interface/protocol-Funktionen tragen (UART, PWM, ADC, SPI, I2C usw.).\n\nIn der UMT Platform (Unified Microchip Technology) ist jeder Pin auf nur zwei mögliche Rollen beschränkt: entweder Digital oder Interface — nicht beide gleichzeitig. UMT gilt einheitlich für MCUs und SoCs, die auf dem UMT 16×16 BGA Hybrid MCU (Microcontroller) / SoC (System-on-Chip Processor) Package Substrate Standard montiert werden.",
    concept_card1: "Digital (deactivate)",
    concept_card2: "Interface (activate)",
    concept_genrule: "Allgemeine Regel — Alle Interfaces",
    concept_th_iface: "Interface",
    concept_th_deact: "deactivate() → Digital",
    concept_th_act: "activate() → Interface",
    gpio_h: "VR_GPIOxx Sonderfall — Hersteller-Erweiterung",
    gpio_intro: "Reihe 0x8 (16 pins: VR_GPIO00–VR_GPIO0F) ist für herstellerdefinierte benutzerdefinierte Interfaces reserviert. Dies ermöglicht es Chipherstellern, ihre proprietären Peripherals hinzuzufügen, während der einheitliche BGA-Standard erhalten bleibt.",
    gpio_role1: "Rolle 1 — Standard-Digital",
    gpio_role2: "Rolle 2 — Benutzerdefinierte Interface",
    gpio_role1_desc: "Deactivate → 16 pins verhalten sich wie rohe I/O (LED, Schalter, Taste)",
    gpio_role2_desc: "Activate VR_NewInterface → herstellerdefiniertes benutzerdefiniertes protocol. In 3-4 sub-interfaces aufteilbar.",
    gpio_arch_h: "Architekturspezifische Interfaces (Sehr Wichtig)",
    gpio_arch_intro: "MCU-Architekturen unterscheiden sich — manche Interfaces existieren auf einem Chip, aber nicht auf einem anderen. Der AVR ATmega328P (8-bit) auf NanoKit Integrated hat Peripherals, die dem ESP32 (32-bit Xtensa LX6) fehlen, und umgekehrt. Da das einheitliche NanoKit Integrated Board begrenzte Pins ohne Platz für jede Funktion hat, WÄHLT der Entwickler, auf welchem MCU er sein eigenes NanoKit Integrated baut, und welches protocol/interface er an jedem Pin nutzt.",
    gpio_example_h: "Echtes Beispiel — NanoKit Integrated ESP32 Pin 19",
    gpio_example_desc: "Pin 19 entspricht der BGA-Koordinate VR_0x82, die Slot VR_GPIO2 enthält. Auf ESP32 können Sie VR_ADC2_IN7, VR_RTC_IO17 oder VR_TOUCH7 wählen — ein echtes Peripheral pro Pin.",
    gpio_example_note: "Stellen Sie dem echten Interface-Namen immer VR_ voran — manche Entwickler brauchen ein Peripheral, das auf DIESEM MCU existiert, aber nicht auf einem anderen. Genau dann wird VR_GPIO interface activate() verwendet.",
    gpio_r1_title: "ROLLE 1 — Digital I/O",
    gpio_r1_desc: "Wird als Standard-Digital-Eingang oder -Ausgang verwendet. LED, Schalter, Tasten, einfaches GPIO.",
    gpio_r2_title: "ROLLE 2 — Hersteller-Interface",
    gpio_r2_desc: "Gebunden an eine vom Chiphersteller definierte benutzerdefinierte Interface. UMT SDK lädt die Hersteller-Bibliothek.",
    gpio_split_title: "16 Pins in mehrere Interfaces aufteilen",
    gpio_split_intro: "Hersteller haben die FREIHEIT, die 16 VR_GPIO-Pins in mehrere benutzerdefinierte Interfaces aufzuteilen:",
    gpio_benefits_title: "Vorteile für Ingenieure",
    demos_hint: "Klicken Sie auf ▶ Animate oder Schrittnummern · Grün = Digital · Blau = Interface",
    bga_h: "16×16 BGA Hybrid MCU (Microcontroller) / SoC (System-on-Chip Processor) Package Substrate Standard (256 balls + 4 external pads)",
    bga_intro: "VR_0x[Reihe][Spalte] · Reihen 0x0–0xF · Bewegen Sie den Cursor über eine Zelle, um die Adresse zu sehen",
    bga_yellow: "Gelb = NanoKit Locked",
    bga_intro_hover: "Bewegen Sie den Cursor über eine Zelle für die Adresse",
    bga_red: "Rot = ESP32 Flash",
    bga_green: "Grün = VR_GPIO Speziell",
    sub_h: "📦 Package Substrate — Die Innovationsgrenze",
    sub_intro: "Chiphersteller behandeln das Package Substrate als routinemäßigen Verpackungsschritt — eine primitive Art, mit dem wichtigsten Fertigungsschritt umzugehen. Amine sieht dies als Spalt, den man ausnutzen kann: Das Substrate selbst kann zur nächsten großen Innovationsoberfläche werden.",
    sub_vision: "Amines Vision",
    sub_quantum: "Quantum I/O-Engpass",
    sub_quantum_desc: "Traditionelle Packages leiten Signale über PCB-Leiterbahnen → Bandbreiten-Engpass am Package-Rand. UMT leitet Signale durch das Substrate selbst → Bandbreite skaliert mit der Anzahl der Slaves, nicht mit der Lane-Breite.",
    ms_title: "Master/Slave Parallel-Architektur (Amines Innovation)",
    ms_desc: "Der UMT IC fungiert als Master mit vielen spezialisierten Slave-Driver-ICs auf demselben Substrate. Sie kommunizieren parallel zur gleichen Zeit über einen Hybrid-Bus, der SPI- + I2C- + PCIe-Eigenschaften mischt.",
    ms_how: "Wie es den Engpass löst:",
    ms_b1: "Statt einer einzelnen PCIe-x4-Verbindung zu einem Gerät → Dutzende Slave-ICs mit jeweils dediziertem Pfad zum Master",
    ms_b2: "Alle laufen gleichzeitig innerhalb des Substrate",
    ms_b3: "Ergebnis: Die aggregierte Bandbreite skaliert mit #Slaves, NICHT mit der PCIe-Lane-Breite",
    ft_title: "Zukünftige Substrate-Technologien",
    qb_title: "Der Quantum-Engpass — Amines Entdeckung",
    qb_desc: "Amine fragt: Wenn ein Quantum-Chip augenblicklich schnell ist, aber die Datenübertragung langsam, was nützt es? Quantum löst Komplexität, nicht Bandbreite.",
    why_title: "Warum das für UMT wichtig ist",
    why_p1: "Die UMT-Architektur ist so konzipiert, dass zukünftige Substrate-Technologien ausgetauscht werden können, ohne die entwicklerseitige Schicht zu ändern. Der VR_-Namespace abstrahiert die physische Verbindung: Der UMT-Code eines Entwicklers bleibt identisch, ob das Substrate Kupfer, Optik oder Funk verwendet.",
    why_p2: "Dies ist derselbe Ansatz, der das Internet erfolgreich machte: Entwickler kümmert es nicht, ob ihre Daten über WiFi, Fiber oder 4G reisen — das protocol ist dasselbe. UMT wendet dieses Prinzip auf die Verbindung auf Chip-Ebene an.",
    hw_locked_title: "NanoKit ESP32 — 34 gesperrte BGA-Koordinaten (v9)",
    hw_locked_desc: "Diese Koordinaten sind DAUERHAFT gesperrt, um NanoKit Integrated ESP32 V2020 zu entsprechen. v9 fügte VR_GND bei 0xD0 hinzu (NanoKit pins 12 & 31).",
    hw_restrict_title: "ESP32-Einschränkungen (AIA Rule Engine)",
    prompt_h: "📋 Master-Kontext-Prompt — für AI Agents (Claude/GPT/Gemini)",
    prompt_copy: "In Zwischenablage kopieren",
    prompt_copied: "✓ Kopiert!",
    prompt_sub: "Kopieren Sie den vollständigen Kontext (v7) und fügen Sie ihn am Anfang jedes neuen Gesprächs ein.",
    project_label: "Projekt",
    bga_extpads: "External Power Pads (außerhalb der BGA-Matrix)",
    sub_8func: "Die 8 kritischen Funktionen des Package Substrate",
    hw_targets_title: "Hardware-Ziele",
    hw_target_a_name: "Entwicklungsboards",
    hw_target_b_name: "UMT IC — MCU Die auf BGA 16×16",
    hw_target_c_name: "NanoKit-iM — Wählbarer MCU",
    hw_target_a_ex: "NanoKit ESP32 · Arduino · STM32 Nucleo · Pico · Jetson Nano",
    hw_target_c_ex: "ESP32-D0WD erster MCU · BGA 16×16 substrate",
    hw_virtual: "VIRTUELL",
    hw_physical: "PHYSISCH",
    hw_r1: "GPIO6–11 (VR_GPIO04-09) = interner SPI flash — HARD ABORT",
    hw_r2: "GPIO34,35,36,39 = NUR EINGANG",
    hw_r3: "GPIO0 (VR_BOOT 0x38) HIGH beim Booten",
    hw_r4: "UART0 (G1/G3) USB-Serial geteilt",
    sub_quote: "\"Chiphersteller behandeln Package Substrate als Routine — eine primitive Art, mit der wichtigsten Fertigungsstufe umzugehen. Ich sehe das als Spalt, den man nutzen kann, um das Substrate selbst zu entwickeln, mit VR_GPIOxx für drahtlose Verbindungen innerhalb des Substrate.\" — Amine Saoud ibn al-Bashir",
    sub_ai_quote: "\"AI-Server stapeln Tausende von GPUs, weil PCIe und NVLink harte Grenzen haben. Die wichtigste Schlussfolgerung: Ich verband Verarbeitungsgeschwindigkeit und Übertragungsproblem. Die Lösung ist eine neue Interface auf VR_GPIO, gemischt zwischen SPI, I2C und PCIe — UMT IC Master verbindet sich mit vielen Slave Drivers parallel innerhalb des Package Substrate.\"",
    sf_titles: ["Signalführung","Stromverteilungsnetzwerk (PDN)","Thermisches Management","EMI / Signalintegrität","Speicherintegration","Multi-die / Chiplet Verbindung","Mechanischer Schutz","Test-Interface"],
    sf_descs: ["Verbindet CPU/GPU/MCU im Chip mit externen Pins/BGA über mehrere Kupferschichten (wie eine Miniatur-PCB). Grundlage von PCIe, USB, GPIO.","Verteilt Spannungen: Core (1V), I/O (1.8V/3.3V). Reduziert Rauschen. Hält Spannungsstabilität. Kritisch in AMD CPUs und Apple SoCs.","Leitet Wärme vom Silicon zum Heat Spreader/Heatsink über Thermal Vias, Kupferebenen und Exposed Pads. UMTs 4 External Pads dienen diesem Zweck.","Verhindert Crosstalk und Signalverzerrung. Hält Signalqualität für PCIe, DDR, USB3 — wo geringe Degradation riesige Datenfehler verursacht.","Verbindet LPDDR/DDR. Manchmal Speicher über Prozessor (PoP). Beispiele: Snapdragon, Apple A, Exynos, NVIDIA, HiSilicon Kirin (Huawei). UMT unterstützt über Rows 0x9+0xA.","Verbindet CPU+GPU+NPU als separate Chiplets, oder verknüpft mehrere Chiplets. Beispiele: Intel Foveros, NVIDIA HBM+GPU.","Schützt Silicon vor Stößen und Feuchtigkeit. Verankert BGA-Kugeln während Reflow-Lötens und Feldeinsatz.","Bietet Punkte zum Testen von JTAG/Debug während Fertigung. UMTs JTAG (Row 0x4) und SWD (Row 0xC) leben hier."],
    code_comment_uart_regular: "VR_ADC_IN4 = normaler digitaler Pin (Peripherie freigegeben)",
    code_comment_led_on: "LED AN",
    code_comment_led_off: "LED AUS",
    code_comment_uart_receiver: "VR_ADC_IN4 = ADC-Analogeingangskanal",
    hw_h: "🔌 Hardware-Einschränkungen — ESP32 Flash-reservierte Pins",
    hw_rules: "AIA Rule Engine Strenge Regeln",
    hw_table_pin: "Pin",
    hw_table_constraint: "Einschränkung",
    hw_table_severity: "Schweregrad",
    translation_note: "🌐 Übersetzt — Technische Begriffe (VR_*, UMT, AIA, GPIO, BGA, ESP32, ...) bleiben absichtlich auf Englisch.",
    pin_role_label: "DIE REGEL — EINE ZEILE BESTIMMT DIE ROLLE DES PIN",
    pin_role_desc1: "deactivate() → Digital (LED, Switch)",
    pin_role_desc2: "activate() → Interface (UART, PWM, ADC, SPI, I2C)",
    interactive_label: "INTERAKTIV — KLICKEN, UM PIN-ROLLE ZU WECHSELN",
    digital_mode: "DIGITAL-MODUS",
    interface_mode: "INTERFACE-MODUS",
    select_mode: "MODUS WÄHLEN",
    digital_mode_desc: "Pin verhält sich wie rohes digitales I/O\\nNur HIGH/LOW lesen/schreiben",
    interface_mode_desc: "Pin arbeitet innerhalb seines protocol\\nUART, PWM, ADC, SPI, I2C, ...",
    none_mode_desc: "Pin kann Digital ODER Interface sein\\nNiemals beides gleichzeitig",
    btn_deactivate: "deactivate() → Digital",
    btn_activate: "activate() → Interface",
  },
  zh: {
    tabs: { concept:"🎯 Pin 概念", gpio:"🔧 VR_GPIOxx 特殊", demos:"▶ 演示", bga:"🔲 UMT 16×16 BGA", substrate:"📦 Package Substrate", prompt:"📋 Prompt", hw:"🔌 Hardware" },
    concept_h: "Pin 双重角色 — 通用规则",
    concept_main: "chip 上的每个 pin — 无论是 MCU (microcontroller) 还是 SoC (内置 processor 的 system-on-chip) — 都有一个主要的 digital 功能：input (开关) 或 output (LED)。同一个 pin 也可以承载一个或多个 interface/protocol 功能 (UART, PWM, ADC, SPI, I2C 等)。\n\n在 UMT Platform (Unified Microchip Technology) 中，每个 pin 仅限于两种可能的角色：Digital 或 Interface — 不能同时两者。UMT 统一适用于安装在 UMT 16×16 BGA Hybrid MCU (Microcontroller) / SoC (System-on-Chip Processor) Package Substrate Standard 上的 MCUs 和 SoCs。",
    concept_card1: "Digital (deactivate)",
    concept_card2: "Interface (activate)",
    concept_genrule: "通用规则 — 所有 Interfaces",
    concept_th_iface: "Interface",
    concept_th_deact: "deactivate() → Digital",
    concept_th_act: "activate() → Interface",
    gpio_h: "VR_GPIOxx 特殊情况 — 制造商扩展",
    gpio_intro: "第 0x8 行（16 个 pins：VR_GPIO00–VR_GPIO0F）保留给制造商定义的自定义 interfaces。这使 chip 制造商能够添加其专有 peripherals，同时保留统一的 BGA 标准。",
    gpio_role1: "角色 1 — 标准 Digital",
    gpio_role2: "角色 2 — 自定义 Interface",
    gpio_role1_desc: "Deactivate → 16 个 pins 作为原始 I/O（LED、开关、按钮）",
    gpio_role2_desc: "Activate VR_NewInterface → 制造商定义的自定义 protocol。可分为 3-4 个 sub-interfaces。",
    gpio_arch_h: "架构特定 Interfaces（非常重要）",
    gpio_arch_intro: "MCU 架构各不相同 — 某些 interfaces 存在于一个 chip 而非另一个。NanoKit Integrated 上的 AVR ATmega328P（8-bit）拥有 ESP32（32-bit Xtensa LX6）所缺少的 peripherals，反之亦然。由于统一的 NanoKit Integrated 板 pins 有限且没有为每个功能留出空间，开发者选择在哪个 MCU 上设计自己的 NanoKit Integrated，并选择在每个 pin 上使用哪个 protocol/interface。",
    gpio_example_h: "真实示例 — NanoKit Integrated ESP32 pin 19",
    gpio_example_desc: "pin 19 映射到 BGA 坐标 VR_0x82，其中包含槽位 VR_GPIO2。在 ESP32 上你可以选择 VR_ADC2_IN7、VR_RTC_IO17 或 VR_TOUCH7 — 每个 pin 一个真实 peripheral。",
    gpio_example_note: "始终在真实 interface 名称前加 VR_ 前缀 — 某些开发者需要一个存在于此 MCU 但不存在于另一个的 peripheral。这正是使用 VR_GPIO interface activate() 的时候。",
    gpio_r1_title: "角色 1 — Digital I/O",
    gpio_r1_desc: "用作标准数字输入或输出。LED、开关、按钮、基本 GPIO。",
    gpio_r2_title: "角色 2 — 制造商 Interface",
    gpio_r2_desc: "绑定到 chip 制造商定义的自定义 interface。UMT SDK 加载供应商库。",
    gpio_split_title: "将 16 个 Pins 拆分为多个 Interfaces",
    gpio_split_intro: "制造商可以自由地将 16 个 VR_GPIO pins 拆分为多个自定义 interfaces：",
    gpio_benefits_title: "对工程师的好处",
    demos_hint: "点击 ▶ Animate 或步骤编号 · 绿色 = Digital · 蓝色 = Interface",
    bga_h: "16×16 BGA Hybrid MCU (Microcontroller) / SoC (System-on-Chip Processor) Package Substrate Standard（256 balls + 4 external pads）",
    bga_intro: "VR_0x[行][列] · 行 0x0–0xF · 悬停任何单元格以查看地址",
    bga_yellow: "黄色 = NanoKit Locked",
    bga_intro_hover: "悬停任何单元格以查看地址",
    bga_red: "红色 = ESP32 Flash",
    bga_green: "绿色 = VR_GPIO 特殊",
    sub_h: "📦 Package Substrate — 创新前沿",
    sub_intro: "Chip 制造商将 package substrate 视为常规封装步骤 — 一种处理最重要制造阶段的原始方式。Amine 将此视为可利用的裂缝：substrate 本身可以成为下一个主要创新表面。",
    sub_vision: "Amine 的愿景",
    sub_quantum: "Quantum I/O 瓶颈",
    sub_quantum_desc: "传统 packages 通过 PCB 走线路由信号 → package 边缘的带宽瓶颈。UMT 通过 substrate 本身路由信号 → 带宽随 slaves 数量扩展，而非 lane 宽度。",
    ms_title: "Master/Slave 并行架构（Amine 的创新）",
    ms_desc: "UMT IC 作为 Master，在同一 substrate 上有许多专用 slave driver ICs。它们通过混合 SPI + I2C + PCIe 特性的 hybrid bus 同时并行通信。",
    ms_how: "它如何解决瓶颈：",
    ms_b1: "不是到一个设备的单条 PCIe x4 链路 → 而是数十个 slave ICs，每个都有到 master 的专用路径",
    ms_b2: "全部在 substrate 内部并发运行",
    ms_b3: "结果：总带宽随 slaves 数量扩展，而非 PCIe lane 宽度",
    ft_title: "未来 Substrate 技术",
    qb_title: "Quantum 瓶颈 — Amine 的发现",
    qb_desc: "Amine 问：如果 quantum chip 即时快速但数据传输缓慢，有什么用？Quantum 解决复杂性，而非带宽。",
    why_title: "为什么这对 UMT 重要",
    why_p1: "UMT 架构的设计使得未来的 substrate 技术可以在不改变面向开发者层的情况下替换。VR_ namespace 抽象了物理互连：无论 substrate 使用铜、光学还是无线，开发者的 UMT code 都保持相同。",
    why_p2: "这与使 Internet 成功的方法相同：开发者不在乎他们的数据是通过 WiFi、Fiber 还是 4G 传输 — protocol 是相同的。UMT 将此原理应用于 chip 级互连。",
    hw_locked_title: "NanoKit ESP32 — 34 个锁定的 BGA 坐标 (v9)",
    hw_locked_desc: "这些坐标被永久锁定以匹配 NanoKit Integrated ESP32 V2020。v9 在 0xD0 添加了 VR_GND (NanoKit pins 12 和 31)。",
    hw_restrict_title: "ESP32 限制 (AIA Rule Engine)",
    prompt_h: "📋 主上下文 Prompt — 用于 AI agents（Claude/GPT/Gemini）",
    prompt_copy: "复制到剪贴板",
    prompt_copied: "✓ 已复制！",
    prompt_sub: "复制完整上下文 (v7) 并粘贴到任何新对话的开头。",
    project_label: "项目",
    bga_extpads: "External Power Pads（BGA 矩阵之外）",
    sub_8func: "Package Substrate 的 8 个关键功能",
    hw_targets_title: "Hardware 目标",
    hw_target_a_name: "开发板",
    hw_target_b_name: "UMT IC — BGA 16×16 上的 MCU Die",
    hw_target_c_name: "NanoKit-iM — 可选 MCU",
    hw_target_a_ex: "NanoKit ESP32 · Arduino · STM32 Nucleo · Pico · Jetson Nano",
    hw_target_c_ex: "ESP32-D0WD 首个 MCU · BGA 16×16 substrate",
    hw_virtual: "虚拟",
    hw_physical: "物理",
    hw_r1: "GPIO6–11 (VR_GPIO04-09) = 内部 SPI flash — HARD ABORT",
    hw_r2: "GPIO34,35,36,39 = 仅输入",
    hw_r3: "GPIO0 (VR_BOOT 0x38) 启动时为 HIGH",
    hw_r4: "UART0 (G1/G3) 与 USB-Serial 共享",
    sub_quote: "\"芯片制造商将 Package Substrate 视为例行公事 — 处理最重要制造阶段的原始方式。我将此视为可利用的裂缝，可使用 VR_GPIOxx 在 substrate 内实现无线互连，从而开发 substrate 本身。\" — Amine Saoud ibn al-Bashir",
    sub_ai_quote: "\"AI 服务器堆叠数千个 GPU，因为 PCIe 和 NVLink 有硬性限制。最重要的结论：我将处理速度与传输问题联系起来。解决方案是 VR_GPIO 上的新 interface，混合 SPI、I2C 和 PCIe — 在 Package Substrate 内将 UMT IC Master 并行连接到许多 slave drivers。\"",
    sf_titles: ["信号路由","电源分配网络 (PDN)","热管理","EMI / 信号完整性","内存集成","Multi-die / Chiplet 互连","机械保护","测试 Interface"],
    sf_descs: ["通过多个铜层（如微型 PCB）将 chip 内的 CPU/GPU/MCU 与外部 Pins/BGA 连接。PCIe、USB、GPIO 的基础。","分配电压：Core (1V)、I/O (1.8V/3.3V)。减少噪声。保持电压稳定性。在 AMD CPUs 和 Apple SoCs 中至关重要。","通过 thermal vias、铜平面和 exposed pads 将热量从 silicon 传导到 heat spreader/heatsink。UMT 的 4 个 external pads 服务于此目的。","防止 crosstalk 和信号失真。保持 PCIe、DDR、USB3 的信号质量 — 微小的退化会导致巨大的数据错误。","连接 LPDDR/DDR。有时内存放置在处理器顶部 (PoP)。示例：Snapdragon、Apple A、Exynos、NVIDIA、HiSilicon Kirin (Huawei)。UMT 通过 Rows 0x9+0xA 支持。","将 CPU+GPU+NPU 作为独立 chiplets 连接，或链接多个 chiplets。示例：Intel Foveros、NVIDIA HBM+GPU。","保护 silicon 免受冲击和潮湿。在 reflow soldering 和现场使用期间将 BGA balls 锚定到位。","在制造过程中提供 JTAG/Debug 测试点。UMT 的 JTAG (Row 0x4) 和 SWD (Row 0xC) 位于此处。"],
    code_comment_uart_regular: "VR_ADC_IN4 = 普通数字 pin (外设已释放)",
    code_comment_led_on: "LED 开",
    code_comment_led_off: "LED 关",
    code_comment_uart_receiver: "VR_ADC_IN4 = ADC 模拟输入通道",
    hw_h: "🔌 Hardware 约束 — ESP32 Flash 保留 Pins",
    hw_rules: "AIA Rule Engine 硬规则",
    hw_table_pin: "Pin",
    hw_table_constraint: "约束",
    hw_table_severity: "严重性",
    translation_note: "🌐 已翻译 — 技术术语（VR_*、UMT、AIA、GPIO、BGA、ESP32、...）有意保留为英语。",
    pin_role_label: "规则 — 一行决定 Pin 的角色",
    pin_role_desc1: "deactivate() → Digital（LED、Switch）",
    pin_role_desc2: "activate() → Interface（UART、PWM、ADC、SPI、I2C）",
    interactive_label: "互动 — 点击切换 Pin 角色",
    digital_mode: "DIGITAL 模式",
    interface_mode: "INTERFACE 模式",
    select_mode: "选择模式",
    digital_mode_desc: "Pin 作为原始数字 I/O 工作\\n只能读/写 HIGH/LOW",
    interface_mode_desc: "Pin 在其 protocol 内运行\\nUART、PWM、ADC、SPI、I2C、...",
    none_mode_desc: "Pin 可以是 Digital 或 Interface\\n永远不会同时是两者",
    btn_deactivate: "deactivate() → Digital",
    btn_activate: "activate() → Interface",
  },
  ja: {
    tabs: { concept:"🎯 Pin コンセプト", gpio:"🔧 VR_GPIOxx 特殊", demos:"▶ デモ", bga:"🔲 UMT 16×16 BGA", substrate:"📦 Package Substrate", prompt:"📋 Prompt", hw:"🔌 Hardware" },
    concept_h: "Pin の二重の役割 — 普遍的なルール",
    concept_main: "chip 上のすべての pin は — MCU (microcontroller) であれ SoC (processor 内蔵の system-on-chip) であれ — 主要な digital 機能を持ちます：input (スイッチ) または output (LED)。同じ pin は1つ以上の interface/protocol 機能も持つことができます (UART, PWM, ADC, SPI, I2C など)。\n\nUMT Platform (Unified Microchip Technology) では、各 pin は2つの役割のみに制限されます：Digital または Interface — 同時に両方ではありません。UMT は UMT 16×16 BGA Hybrid MCU (Microcontroller) / SoC (System-on-Chip Processor) Package Substrate Standard に搭載される MCUs と SoCs に均一に適用されます。",
    concept_card1: "Digital (deactivate)",
    concept_card2: "Interface (activate)",
    concept_genrule: "一般ルール — すべての Interfaces",
    concept_th_iface: "Interface",
    concept_th_deact: "deactivate() → Digital",
    concept_th_act: "activate() → Interface",
    gpio_h: "VR_GPIOxx 特殊ケース — 製造業者拡張",
    gpio_intro: "行 0x8（16 個の pins：VR_GPIO00–VR_GPIO0F）は製造業者定義のカスタム interfaces 用に予約されています。これにより、chip 製造業者は統一された BGA 標準を維持しながら、独自の peripherals を追加できます。",
    gpio_role1: "役割 1 — 標準 Digital",
    gpio_role2: "役割 2 — カスタム Interface",
    gpio_role1_desc: "Deactivate → 16 個の pins が raw I/O（LED、スイッチ、ボタン）として動作",
    gpio_role2_desc: "Activate VR_NewInterface → 製造業者定義のカスタム protocol。3-4 個の sub-interfaces に分割可能。",
    gpio_arch_h: "アーキテクチャ固有の Interfaces（非常に重要）",
    gpio_arch_intro: "MCU アーキテクチャは異なります — 一部の interfaces は1つの chip に存在しますが別の chip には存在しません。NanoKit Integrated の AVR ATmega328P（8-bit）には ESP32（32-bit Xtensa LX6）にない peripherals があり、その逆もあります。統一された NanoKit Integrated ボードは pins が限られ、すべての機能のスペースがないため、開発者は自分の NanoKit Integrated をどの MCU で設計するか、各 pin でどの protocol/interface を使うかを選択します。",
    gpio_example_h: "実例 — NanoKit Integrated ESP32 pin 19",
    gpio_example_desc: "pin 19 は BGA 座標 VR_0x82 にマップされ、スロット VR_GPIO2 を保持します。ESP32 では VR_ADC2_IN7、VR_RTC_IO17、または VR_TOUCH7 を選べます — pin ごとに1つの実際の peripheral。",
    gpio_example_note: "実際の interface 名には常に VR_ プレフィックスを付けます — 一部の開発者はこの MCU には存在するが別の MCU には存在しない peripheral を必要とします。これがまさに VR_GPIO interface activate() を使うときです。",
    gpio_r1_title: "役割 1 — Digital I/O",
    gpio_r1_desc: "標準デジタル入力または出力として使用。LED、スイッチ、ボタン、基本 GPIO。",
    gpio_r2_title: "役割 2 — 製造業者 Interface",
    gpio_r2_desc: "chip 製造業者が定義したカスタム interface にバインド。UMT SDK がベンダーライブラリをロード。",
    gpio_split_title: "16 個の Pins を複数の Interfaces に分割",
    gpio_split_intro: "製造業者は 16 個の VR_GPIO pins を複数のカスタム interfaces に分割する自由があります：",
    gpio_benefits_title: "エンジニアへの利点",
    demos_hint: "▶ Animate またはステップ番号をクリック · 緑 = Digital · 青 = Interface",
    bga_h: "16×16 BGA Hybrid MCU (Microcontroller) / SoC (System-on-Chip Processor) Package Substrate Standard（256 balls + 4 external pads）",
    bga_intro: "VR_0x[行][列] · 行 0x0–0xF · セルにカーソルを合わせるとアドレスが表示されます",
    bga_yellow: "黄 = NanoKit Locked",
    bga_intro_hover: "セルにカーソルを合わせるとアドレスが表示されます",
    bga_red: "赤 = ESP32 Flash",
    bga_green: "緑 = VR_GPIO 特殊",
    sub_h: "📦 Package Substrate — イノベーションのフロンティア",
    sub_intro: "Chip 製造業者は package substrate を日常的なパッケージング工程として扱っています — 最も重要な製造段階を処理する原始的な方法。Amine はこれを利用できる亀裂と見ています：substrate 自体が次の主要なイノベーション表面になる可能性があります。",
    sub_vision: "Amine のビジョン",
    sub_quantum: "Quantum I/O ボトルネック",
    sub_quantum_desc: "従来の packages は PCB トラックを介して信号を route → package エッジでの帯域幅ボトルネック。UMT は substrate 自体を介して信号を route → 帯域幅は slaves の数に応じて拡張し、レーン幅ではない。",
    ms_title: "Master/Slave 並列アーキテクチャ（Amine のイノベーション）",
    ms_desc: "UMT IC は Master として、同じ substrate 上の多くの専用 slave driver ICs と動作します。SPI + I2C + PCIe の特性を組み合わせた hybrid bus 上で同時に並列通信します。",
    ms_how: "ボトルネックを解決する方法：",
    ms_b1: "1つのデバイスへの単一 PCIe x4 リンクの代わりに → master への専用パスを持つ数十の slave ICs",
    ms_b2: "すべて substrate 内部で同時実行",
    ms_b3: "結果：総帯域幅は slaves の数に応じて拡張し、PCIe lane 幅ではない",
    ft_title: "将来の Substrate 技術",
    qb_title: "Quantum ボトルネック — Amine の発見",
    qb_desc: "Amine は問います：quantum chip が瞬時に高速でもデータ転送が遅ければ、何の意味があるか？Quantum は複雑さを解決し、帯域幅ではない。",
    why_title: "これが UMT に重要な理由",
    why_p1: "UMT アーキテクチャは、将来の substrate 技術を開発者向けレイヤーを変更せずに交換できるよう設計されています。VR_ namespace は物理的相互接続を抽象化します：substrate が銅、光学、無線のいずれを使用しても、開発者の UMT code は同一のままです。",
    why_p2: "これは Internet を成功させたのと同じアプローチです：開発者はデータが WiFi、Fiber、4G のどれで移動するか気にしません — protocol は同じです。UMT はこの原理を chip レベルの相互接続に適用します。",
    hw_locked_title: "NanoKit ESP32 — 34 個のロックされた BGA 座標 (v9)",
    hw_locked_desc: "これらの座標は NanoKit Integrated ESP32 V2020 に一致するよう永久にロックされています。v9 は 0xD0 に VR_GND を追加しました (NanoKit pins 12 と 31)。",
    hw_restrict_title: "ESP32 制約 (AIA Rule Engine)",
    prompt_h: "📋 マスターコンテキスト Prompt — AI agents 用（Claude/GPT/Gemini）",
    prompt_copy: "クリップボードにコピー",
    prompt_copied: "✓ コピー済み！",
    prompt_sub: "完全なコンテキスト (v7) をコピーして、新しい会話の最初に貼り付けます。",
    project_label: "プロジェクト",
    bga_extpads: "External Power Pads（BGA マトリックス外）",
    sub_8func: "Package Substrate の 8 つの重要な機能",
    hw_targets_title: "Hardware ターゲット",
    hw_target_a_name: "開発ボード",
    hw_target_b_name: "UMT IC — BGA 16×16 上の MCU Die",
    hw_target_c_name: "NanoKit-iM — 選択可能な MCU",
    hw_target_a_ex: "NanoKit ESP32 · Arduino · STM32 Nucleo · Pico · Jetson Nano",
    hw_target_c_ex: "ESP32-D0WD 最初の MCU · BGA 16×16 substrate",
    hw_virtual: "仮想",
    hw_physical: "物理",
    hw_r1: "GPIO6–11 (VR_GPIO04-09) = 内部 SPI flash — HARD ABORT",
    hw_r2: "GPIO34,35,36,39 = INPUT のみ",
    hw_r3: "GPIO0 (VR_BOOT 0x38) ブート時に HIGH",
    hw_r4: "UART0 (G1/G3) USB-Serial 共有",
    sub_quote: "\"チップメーカーは Package Substrate をルーチン作業として扱います — 最も重要な製造段階を扱う原始的な方法。私はこれを利用できる亀裂と見ています — VR_GPIOxx を使用して substrate 内でワイヤレス相互接続を可能にし、substrate 自体を開発します。\" — Amine Saoud ibn al-Bashir",
    sub_ai_quote: "\"AI サーバーは何千もの GPU を積み重ねます。PCIe と NVLink には厳しい制限があるためです。最も重要な結論：処理速度と伝送問題を結びつけました。解決策は VR_GPIO 上の新しい interface で、SPI、I2C、PCIe を混合し、UMT IC Master を Package Substrate 内で多くの slave drivers と並列に接続します。\"",
    sf_titles: ["信号ルーティング","電源分配ネットワーク (PDN)","熱管理","EMI / 信号完全性","メモリ統合","Multi-die / Chiplet 相互接続","機械的保護","テスト Interface"],
    sf_descs: ["複数の銅層（小型 PCB のような）を介して chip 内の CPU/GPU/MCU を外部 Pins/BGA に接続します。PCIe、USB、GPIO の基盤。","電圧を分配：Core (1V)、I/O (1.8V/3.3V)。ノイズを低減。電圧安定性を維持。AMD CPUs と Apple SoCs で重要。","thermal vias、銅プレーン、exposed pads を介して silicon から heat spreader/heatsink に熱を伝導。UMT の 4 つの external pads がこの目的を果たします。","crosstalk と信号歪みを防止。PCIe、DDR、USB3 の信号品質を維持 — 小さな劣化が巨大なデータエラーを引き起こします。","LPDDR/DDR を接続。プロセッサの上にメモリを配置することもあります (PoP)。例：Snapdragon、Apple A、Exynos、NVIDIA、HiSilicon Kirin (Huawei)。UMT は Rows 0x9+0xA を介してサポート。","CPU+GPU+NPU を別個の chiplets として接続、または複数の chiplets をリンク。例：Intel Foveros、NVIDIA HBM+GPU。","silicon を衝撃と湿気から保護。reflow soldering と現場使用中に BGA balls を所定位置に固定。","製造中に JTAG/Debug をテストするポイントを提供。UMT の JTAG (Row 0x4) と SWD (Row 0xC) はここに存在します。"],
    code_comment_uart_regular: "VR_ADC_IN4 = 通常のデジタル pin (周辺機器解放済み)",
    code_comment_led_on: "LED オン",
    code_comment_led_off: "LED オフ",
    code_comment_uart_receiver: "VR_ADC_IN4 = ADC アナログ入力チャネル",
    hw_h: "🔌 Hardware 制約 — ESP32 Flash 予約 Pins",
    hw_rules: "AIA Rule Engine ハードルール",
    hw_table_pin: "Pin",
    hw_table_constraint: "制約",
    hw_table_severity: "重大度",
    translation_note: "🌐 翻訳済み — 技術用語（VR_*、UMT、AIA、GPIO、BGA、ESP32、...）は意図的に英語のまま残されています。",
    pin_role_label: "ルール — 1 行が Pin の役割を決定する",
    pin_role_desc1: "deactivate() → Digital（LED、Switch）",
    pin_role_desc2: "activate() → Interface（UART、PWM、ADC、SPI、I2C）",
    interactive_label: "インタラクティブ — クリックで Pin の役割を切替",
    digital_mode: "DIGITAL モード",
    interface_mode: "INTERFACE モード",
    select_mode: "モードを選択",
    digital_mode_desc: "Pin は raw digital I/O として動作\\nHIGH/LOW の読み書きのみ",
    interface_mode_desc: "Pin はその protocol 内で動作\\nUART、PWM、ADC、SPI、I2C、...",
    none_mode_desc: "Pin は Digital または Interface\\n同時に両方になることはない",
    btn_deactivate: "deactivate() → Digital",
    btn_activate: "activate() → Interface",
  },
};

/* ═══ PIN CONCEPT ═══ */
const CONCEPT = {
  main: `Every pin on a chip — whether MCU (microcontroller) or SoC (system-on-chip with built-in processor) — has a primary digital function: input (switch) or output (LED). That same pin may also carry one or more interface/protocol functions (UART, PWM, ADC, SPI, I2C, etc.).

In the UMT Platform (Unified Microchip Technology), each pin is limited to only two possible roles: either Digital or Interface — not both at the same time. UMT applies uniformly to MCUs and SoCs that mount on the UMT 16×16 BGA Hybrid MCU (Microcontroller) / SoC (System-on-Chip Processor) Package Substrate Standard.`,
  digitalEx: `When we need to use a pin as digital I/O, regardless of which interface it belongs to, we simply deactivate that interface:
UMT.Interface(VR_ADC4).deactivate();
// deactivate() releases the ADC4 peripheral. GPIO32 is unclaimed and no analogRead() init is generated.
Now VR_ADC_IN4 becomes a regular digital pin — we can drive an LED. This applies to ALL interfaces: UART, PWM, SPI, I2C.`,
  interfaceEx: `To use the same pin for its protocol function, we activate the interface:
UMT.Interface(VR_ADC4).activate();
// activate() turns the ADC4 peripheral ON. GPIO32 is claimed as analog input, 12-bit sampling is armed, pin state → RESERVED.
Now VR_ADC_IN4 samples analog voltage on every read(). Same principle applies to all interfaces.`,
  table: [
    { i: "UART", d: "Pin → Digital I/O", a: "Pin transmits/receives UART data" },
    { i: "PWM", d: "Pin → Digital I/O", a: "Pin generates PWM signal" },
    { i: "Analog", d: "Pin → Digital I/O", a: "Pin reads ADC value" },
    { i: "SPI", d: "Pin → Digital I/O", a: "Pin operates within SPI bus" },
    { i: "I2C", d: "Pin → Digital I/O", a: "Pin operates within I2C bus" },
  ],
};

/* ═══ NanoKit ESP32 LOCKED Coordinates (v9 — 34 pins) ═══ */
const NANOKIT_LOCKED = new Set([
  "00","01","04","05",                          // UART
  "10","11","12","13","14","15","16","17",      // SPI ×2
  "30","31",                                    // I2C0
  "38",                                         // BOOT
  "50","53","54","56",                          // ADC (re-addressed v8)
  "71",                                         // DAC_OUT1
  "80","81","82","83","84","85","86","87","88","89","8A",  // GPIO00-10
  "C0",                                         // PWM_OUT0
  "D0",                                         // VR_GND (v9 NEW yellow lock)
  "FF",                                         // RST
]);
const FLASH_ADDRS = new Set(["84","85","86","87","88","89"]);

/* ═══ BGA 16×16 HYBRID v9 MATRIX (Package Substrate Edition) ═══ */
const BGA = [
  { row:"0x0", color:"#ef4444", label:"UART ×4 + Interrupts + Timers",
    names:["UART_RX0","UART_TX0","UART_RX1","UART_TX1","UART_RX2","UART_TX2","UART_RX3","UART_TX3","INT0","INT1","INT2","INT3","TMR0","TMR1","UART_CTS0","UART_RTS0"] },
  { row:"0x1", color:"#3b82f6", label:"SPI ×2 + QSPI + USART",
    names:["SPI_MOSI0","SPI_MISO0","SPI_SCLK0","SPI_CS0","SPI_MOSI1","SPI_MISO1","SPI_SCLK1","SPI_CS1","QSPI_D0","QSPI_D1","QSPI_D2","QSPI_D3","QSPI_SCLK","QSPI_CS","USART_RX0","USART_TX0"] },
  { row:"0x2", color:"#0d9488", label:"USB 2.0 ×2 + USB 3.0 ×2 + CAN",
    names:["USB2_DM0","USB2_DP0","USB2_DM1","USB2_DP1","USB3_TXP0","USB3_TXN0","USB3_RXP0","USB3_RXN0","USB3_TXP1","USB3_TXN1","USB3_RXP1","USB3_RXN1","USART_CTS","USART_RTS","CAN_TX","CAN_RX"] },
  { row:"0x3", color:"#a855f7", label:"I2C ×2 (I2C1=PMIC) + I3C + PDM + BOOT + Storage",
    names:["I2C_SDA0","I2C_SCL0","I2C_SDA1","I2C_SCL1","I3C_SDA","I3C_SCL","PDM_CLK","PDM_DAT","BOOT","STOR_CLK","STOR_CMD","STOR_D0","STOR_D1","STOR_D2","STOR_D3","STOR_RST"] },
  { row:"0x4", color:"#6366f1", label:"JTAG + MIPI CSI Camera 1 + Touch",
    names:["JTAG_TDI","JTAG_TDO","JTAG_TCK","JTAG_TMS","JTAG_TRST","CSI_D0P","CSI_D0N","CSI_D1P","CSI_D1N","CSI_CLKP","CSI_CLKN","CSI_MCLK0","CSI_RST","TOUCH_INT","TOUCH_RST","CSI_PWDN"] },
  { row:"0x5", color:"#0891b2", label:"ADC ×8 (0x50-0x57) + Ethernet RMII (0x58-0x5F)",
    names:["ADC_IN0","ADC_IN1","ADC_IN2","ADC_IN3","ADC_IN4","ADC_IN5","ADC_IN6","ADC_IN7","ETH_TX0","ETH_TX1","ETH_TX_EN","ETH_RX0","ETH_RX1","ETH_CRS_DV","ETH_REFCLK","ETH_MDIO"] },
  { row:"0x6", color:"#10b981", label:"I2S ×2 + MIPI DSI + PWM Audio",
    names:["I2S_BCLK0","I2S_LRCLK0","I2S_DOUT0","I2S_DIN0","I2S_BCLK1","I2S_LRCLK1","I2S_DOUT1","I2S_DIN1","DSI_D0P","DSI_D0N","DSI_D1P","DSI_D1N","DSI_CLKP","DSI_CLKN","PWM_AUD_L","PWM_AUD_R"] },
  { row:"0x7", color:"#eab308", label:"DAC ×3 + HDMI 2.0 + PCIe x1",
    names:["DAC_OUT0","DAC_OUT1","DAC_OUT2","HDMI_D0P","HDMI_D0N","HDMI_D1P","HDMI_D1N","HDMI_D2P","HDMI_D2N","HDMI_CLKP","HDMI_CLKN","PCIE_TXP","PCIE_TXN","PCIE_RXP","PCIE_RXN","PCIE_REFCLK"] },
  { row:"0x8", color:"#22c55e", label:"GPIO ×16 — SPECIAL CASE (Manufacturer-Defined)",
    names:["GPIO00","GPIO01","GPIO02","GPIO03","GPIO04","GPIO05","GPIO06","GPIO07","GPIO08","GPIO09","GPIO10","GPIO11","GPIO12","GPIO13","GPIO14","GPIO15"] },
  { row:"0x9", color:"#06b6d4", label:"LPDDR Data Bus D0-D15",
    names:["MEM_D0","MEM_D1","MEM_D2","MEM_D3","MEM_D4","MEM_D5","MEM_D6","MEM_D7","MEM_D8","MEM_D9","MEM_D10","MEM_D11","MEM_D12","MEM_D13","MEM_D14","MEM_D15"] },
  { row:"0xA", color:"#0ea5e9", label:"LPDDR Control + ODT + RST_n (JEDEC)",
    names:["MEM_CA0","MEM_CA1","MEM_CA2","MEM_CA3","MEM_CA4","MEM_CA5","MEM_CKP","MEM_CKN","MEM_CKE","MEM_CS","MEM_DQS0P","MEM_DQS0N","MEM_DQS1P","MEM_DQS1N","MEM_ODT","MEM_RST_n"] },
  { row:"0xB", color:"#14b8a6", label:"Camera 2 CSI + LVDS ×2 + SPDIF",
    names:["CSI2_D0P","CSI2_D0N","CSI2_D1P","CSI2_D1N","CSI2_CLKP","CSI2_CLKN","CSI2_MCLK1","CSI2_RST","LVDS_D0P","LVDS_D0N","LVDS_D1P","LVDS_D1N","LVDS_CLKP","LVDS_CLKN","SPDIF_IN","SPDIF_OUT"] },
  { row:"0xC", color:"#f97316", label:"PWM ×4 + SWD + TRACE + DMA + RTC + FlexIO",
    names:["PWM_OUT0","PWM_OUT1","PWM_OUT2","PWM_OUT3","SWDIO","SWCLK","TRACE_CLK","TRACE_D0","DMA_REQ0","DMA_REQ1","WDT","RTC_CLK","FLEXIO_D0","FLEXIO_D1","FLEXIO_D2","FLEXIO_D3"] },
  { row:"0xD", color:"#fbbf24", label:"GND + VCC + System Power/Clock/References",
    names:["GND","VCC","VREF_ADC","VREF_DAC","MEM_VDDQ","XTAL_IN","XTAL_OUT","PLL_FB","USB_VBUS","USB_ID","HDMI_CEC","HDMI_HPD","ETH_NRST","ETH_MDC","SYS_WAKE","SYS_SLEEP"] },
  { row:"0xE", color:"#ec4899", label:"DisplayPort + Wireless + Audio I/O",
    names:["DP_TXP0","DP_TXN0","DP_TXP1","DP_TXN1","DP_AUX_P","DP_AUX_N","DP_HPD","DSI_RST","WLAN_ANT","WLAN_EN","CELL_ANT","CELL_EN","MIC_INP","MIC_INN","SPK_OUTP","SPK_OUTN"] },
  { row:"0xF", color:"#78716c", label:"NFC + IR + PCIe Mgmt + Display Ctrl + RST",
    names:["NFC_D0","NFC_CLK","IR_TX","IR_RX","PCIE_PERST","PCIE_CLKREQ","PWR_GOOD","DSI_TE","BL_PWM","HP_DET","AMP_EN","RSVD0","RSVD1","RSVD2","RSVD3","RST"] },
];

/* ═══ External Power Pads ═══ */
const PADS = [
  { id:"PAD_A", vr:"VR_GND_PAD1", type:"Ground", note:"Main thermal ground pad" },
  { id:"PAD_B", vr:"VR_GND_PAD2", type:"Ground", note:"Secondary ground pad" },
  { id:"PAD_C", vr:"VR_VCC_PAD1", type:"Power",  note:"Main 1.2V/1.8V/3.3V configurable" },
  { id:"PAD_D", vr:"VR_VCC_PAD2", type:"Power",  note:"LPDDR/USB3/HDMI high-current" },
];

/* ═══ Package Substrate Functions (Amine's Vision) ═══ */
const SUBSTRATE_FUNCS_ICONS = ["🔌","⚡","🌡️","🧲","🧩","🔗","🛡️","🧪"];
const SUBSTRATE_FUNCS = [
  { icon:"🔌", title:"Signal Routing", desc:"Connects CPU/GPU/MCU inside the chip with external Pins/BGA via multiple copper layers (like a miniature PCB). Foundation of PCIe, USB, GPIO." },
  { icon:"⚡", title:"Power Distribution Network (PDN)", desc:"Distributes voltages: Core (1V), I/O (1.8V/3.3V). Reduces noise. Maintains voltage stability. Critical in AMD CPUs and Apple SoCs." },
  { icon:"🌡️", title:"Thermal Management", desc:"Conducts heat from silicon to heat spreader/heatsink via thermal vias, copper planes, and exposed pads. UMT's 4 external pads serve this purpose." },
  { icon:"🧲", title:"EMI / Signal Integrity", desc:"Prevents crosstalk and signal distortion. Maintains signal quality for PCIe, DDR, USB3 — where small degradation causes huge data errors." },
  { icon:"🧩", title:"Memory Integration", desc:"Connects LPDDR/DDR. Sometimes memory placed on top of processor (PoP). Examples: Snapdragon, Apple A, Exynos, NVIDIA, HiSilicon Kirin (Huawei). UMT supports this via Rows 0x9+0xA." },
  { icon:"🔗", title:"Multi-die / Chiplet Interconnect", desc:"Connects CPU+GPU+NPU as separate chiplets, or links multiple chiplets. Examples: Intel Foveros, NVIDIA HBM+GPU." },
  { icon:"🛡️", title:"Mechanical Protection", desc:"Protects silicon from shocks and moisture. Anchors BGA balls in place during reflow soldering and field use." },
  { icon:"🧪", title:"Testing Interface", desc:"Provides points to test JTAG/Debug during manufacturing. UMT's JTAG (Row 0x4) and SWD (Row 0xC) live here." },
];

/* ═══ Future Substrate Technologies ═══ */
const FUTURE_TECH = [
  { name:"Silicon Photonics", status:"In Industry", color:"#10b981",
    desc:"VCSEL lasers + waveguides embedded in substrate. Used by Intel, IBM, TSMC in research and data centers." },
  { name:"3D Stacking with TSV", status:"Commercial", color:"#10b981",
    desc:"Chips physically stacked using Through-Silicon Vias. Used in NVIDIA H100 (HBM+GPU integration)." },
  { name:"Wireless On-Chip", status:"Research", color:"#eab308",
    desc:"On-chip antennas using mmWave/sub-THz frequencies. Today research-only. Amine's bet: practical when integrated INSIDE the substrate." },
];

/* ═══ CASE STEPS — canonical example uses VR_ADC4 (analog input channel 4) ═══
   Each step's `d` (description) explains LINE BY LINE what happens the moment
   the call executes: what the AIA Engine resolves, what the peripheral does,
   which GPIO gets claimed or freed, and how the state transitions.
   Every activate() / deactivate() call is documented for its side effects. */
const C1 = [
  { t:"activate() — ADC4 peripheral ON",
    u:"UMT.Interface(VR_ADC4).activate();",
    g:"analogReadResolution(12);\nanalogSetPinAttenuation(32, ADC_11db);",
    p:"VR_ADC_IN4", r:"interface", s:"RESERVED",
    d:"activate() turns the ADC4 peripheral ON. AIA claims GPIO32 as the analog input, configures 12-bit resolution and 0-3.3V range, and marks the pin RESERVED (nothing else may touch it). No sample is taken yet — the hardware is only prepared.\nFREE → RESERVED" },
  { t:"enable() — ADC IN4 channel ready",
    u:"UMT.Interface_Pin(VR_ADC_IN4).enable();",
    g:"// channel 4 armed",
    p:"VR_ADC_IN4", r:"interface", s:"BOUND",
    d:"enable() binds the specific channel (VR_ADC_IN4 → GPIO32) to the running peripheral. The ADC now samples this pin whenever read() is called. State moves to BOUND (peripheral + channel both live).\nRESERVED → BOUND" },
  { t:"activate() — PWM peripheral ON",
    u:"UMT.Interface(VR_PWM0).activate();",
    g:"ledcSetup(0,5000,8);\nledcAttachPin(2,0);",
    p:"VR_PWM_OUT0", r:"interface", s:"RESERVED",
    d:"activate() spins up PWM channel 0: 5 kHz frequency, 8-bit duty (0-255), attached to GPIO2. This will drive an LED whose brightness follows the ADC reading — a classic analog-in → analog-out loop.\nFREE → RESERVED" },
  { t:"enable() — PWM OUT ready",
    u:"UMT.Interface_Pin(VR_PWM_OUT0).enable();",
    g:"ledcWrite(0,0);",
    p:"VR_PWM_OUT0", r:"interface", s:"BOUND",
    d:"enable() binds the PWM output channel. Duty starts at 0 (LED off). The peripheral is armed and waiting for a write() value.\nRESERVED → BOUND" },
  { t:"read() — sample the ADC",
    u:"int v = UMT.Interface_Pin(VR_ADC_IN4).read();",
    g:"int v = analogRead(32);",
    p:"VR_ADC_IN4", r:"interface", s:"BOUND",
    d:"read() triggers one ADC conversion on channel 4. The sample-and-hold captures the GPIO32 voltage, the SAR converter produces a 12-bit result (0..4095), and the value is returned. Non-blocking, ~10 µs on ESP32." },
  { t:"write() — LED brightness = ADC scaled",
    u:"UMT.Interface_Pin(VR_PWM_OUT0).write(v >> 4);",
    g:"ledcWrite(0, v >> 4);",
    p:"VR_PWM_OUT0", r:"interface", s:"BOUND",
    d:"write() updates the PWM duty. v>>4 scales the 12-bit ADC value (0..4095) down to 8-bit PWM range (0..255). LED brightness now tracks the analog input in real time." },
  { t:"disable() — PWM standby",
    u:"UMT.Interface_Pin(VR_PWM_OUT0).disable();",
    g:"ledcWrite(0,0);",
    p:"VR_PWM_OUT0", r:"interface", s:"RESERVED",
    d:"disable() stops the PWM output (duty forced to 0, LED off) but keeps the hardware channel allocated for instant re-enable. State drops back to RESERVED — pin still owned by the peripheral, no other code can grab it.\nBOUND → RESERVED" },
  { t:"deactivate() — release ADC4 completely",
    u:"UMT.Interface(VR_ADC4).deactivate();",
    g:"// analog subsystem released",
    p:"VR_ADC_IN4", r:"free", s:"FREE",
    d:"deactivate() is the mirror of activate(). It powers the ADC4 peripheral OFF, unclaims GPIO32, and returns the pin to the FREE pool. Any code (including Digital_Pin below) can now grab it for a totally different role.\nBOUND → FREE" },
];
const C2 = [
  { t:"deactivate() — release ADC4",
    u:"UMT.Interface(VR_ADC4).deactivate();",
    g:"// no ADC init generated",
    p:"VR_ADC_IN4", r:"free", s:"FREE",
    d:"deactivate() releases the ADC4 peripheral BEFORE we try to repurpose its pin. AIA verifies no other code depends on the sampler, drops the channel binding, and marks GPIO32 FREE. The AIA Engine also removes any analogRead()/analogReadResolution() calls from the generated C++.\n(any) → FREE" },
  { t:"setMode(OUTPUT) — pin becomes digital output",
    u:"UMT.Digital_Pin(VR_ADC_IN4).setMode(OUTPUT);",
    g:"pinMode(32, OUTPUT);",
    p:"VR_ADC_IN4", r:"digital", s:"BOUND",
    d:"Same physical pin — new role. We keep the VR_ADC_IN4 label because the developer already knows which pin they mean, but we access it through Digital_Pin() so the pin acts as a plain digital I/O. AIA emits pinMode(32, OUTPUT).\nFREE → BOUND (digital)" },
  { t:"write(HIGH) — LED ON",
    u:"UMT.Digital_Pin(VR_ADC_IN4).write(HIGH);",
    g:"digitalWrite(32, HIGH);",
    p:"VR_ADC_IN4", r:"digital", s:"BOUND",
    d:"write(HIGH) drives GPIO32 to 3.3 V. Current flows through the series resistor into the LED anode. LED lights up. No PWM, no analog — pure digital." },
  { t:"delay(500) — hold half a second",
    u:"delay(500);",
    g:"delay(500);",
    p:"—", r:"—", s:"—",
    d:"Blocking pause. Simple demo. In production, replace with millis()-based scheduling to keep the CPU free." },
  { t:"write(LOW) — LED OFF",
    u:"UMT.Digital_Pin(VR_ADC_IN4).write(LOW);",
    g:"digitalWrite(32, LOW);",
    p:"VR_ADC_IN4", r:"digital", s:"BOUND",
    d:"write(LOW) drives GPIO32 to 0 V. LED goes dark. Loop back to write(HIGH) for a classic blink." },
];

const K={bg:"#08090a",sf:"#0e1012",sa:"#12151a",bd:"#1c2028",or:"#e07b39",bl:"#4a9eff",gr:"#3ddc84",rd:"#ff5252",pu:"#b388ff",yl:"#ffd740",sub:"#d97706",tx:"#e7e5e4",mt:"#a8a29e"};
const fn="'JetBrains Mono','Fira Code','SF Arabic','Geeza Pro','Segoe UI',Tahoma,'Noto Sans Arabic',system-ui,monospace";

/* ═══ INTERACTIVE PIN VISUAL ═══ */
function PinVis({L, isRTL}){
  const [m,setM]=useState("none");
  const [an,setAn]=useState(false);
  const sw=(v)=>{setAn(true);setTimeout(()=>{setM(v);setAn(false);},250);};
  const c=m==="digital"?K.gr:m==="interface"?K.bl:K.mt;
  return(
    <div dir="ltr" style={{background:"#060708",borderRadius:8,padding:16,border:`1px solid ${K.bd}`,textAlign:"center",boxSizing:"border-box",minWidth:0,width:"100%",overflow:"hidden",maxWidth:"100%"}}>
      <div style={{fontSize:9,fontWeight:700,color:K.mt,letterSpacing:1.5,marginBottom:10,direction:isRTL?"rtl":"ltr"}}>{L.interactive_label}</div>
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:20,marginBottom:14,flexWrap:"wrap",minWidth:0}}>
        <div style={{width:85,height:85,borderRadius:"50%",background:`radial-gradient(circle at 35% 35%,${c}40,${c}10)`,border:`3px solid ${c}`,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",transition:"all 0.4s",transform:an?"scale(0.8)":"scale(1)",boxShadow:m!=="none"?`0 0 30px ${c}30`:"none",flexShrink:0,boxSizing:"border-box"}}>
          <div style={{fontSize:22}}>{m==="digital"?"⚡":m==="interface"?"📡":"📌"}</div>
          <div style={{fontSize:7.5,color:c,fontWeight:700,marginTop:2}}>VR_ADC_IN4</div>
        </div>
        <div style={{textAlign:"center",maxWidth:220,flex:"0 1 220px",minWidth:0,direction:isRTL?"rtl":"ltr"}}>
          <div style={{fontSize:13,fontWeight:700,color:c,transition:"color 0.3s",textAlign:"center"}}>{m==="digital"?L.digital_mode:m==="interface"?L.interface_mode:L.select_mode}</div>
          <div style={{fontSize:9.5,color:K.mt,marginTop:4,lineHeight:1.5,whiteSpace:"pre-line",textAlign:"center",wordBreak:"break-word"}}>
            {m==="digital" && L.digital_mode_desc.replace(/\\n/g,"\n")}
            {m==="interface" && L.interface_mode_desc.replace(/\\n/g,"\n")}
            {m==="none" && L.none_mode_desc.replace(/\\n/g,"\n")}
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",minWidth:0}}>
        <button onClick={()=>sw("digital")} dir="ltr" style={{padding:"8px 16px",fontSize:10,borderRadius:6,cursor:"pointer",fontFamily:fn,fontWeight:700,background:m==="digital"?K.gr:"transparent",color:m==="digital"?"#000":K.gr,border:`1.5px solid ${K.gr}`,transition:"all 0.2s",textAlign:"center",display:"inline-flex",alignItems:"center",justifyContent:"center",whiteSpace:"nowrap"}}>{L.btn_deactivate}</button>
        <button onClick={()=>sw("interface")} dir="ltr" style={{padding:"8px 16px",fontSize:10,borderRadius:6,cursor:"pointer",fontFamily:fn,fontWeight:700,background:m==="interface"?K.bl:"transparent",color:m==="interface"?"#000":K.bl,border:`1.5px solid ${K.bl}`,transition:"all 0.2s",textAlign:"center",display:"inline-flex",alignItems:"center",justifyContent:"center",whiteSpace:"nowrap"}}>{L.btn_activate}</button>
      </div>
      {m!=="none"&&<div style={{marginTop:12,animation:"si 0.3s",minWidth:0}}>
        <CC base={m==="digital"?"#8aaa90":"#8a9aaa"} style={{background:K.sf,fontSize:10,lineHeight:1.7,border:`1px solid ${c}20`,overflowX:"auto",maxWidth:"100%",boxSizing:"border-box"}}
          code={m==="digital"?`UMT.Interface(VR_ADC4).deactivate();          // ${L.code_comment_deactivate || "ADC4 OFF — GPIO32 freed, no analog init generated"}
UMT.Digital_Pin(VR_ADC_IN4).setMode(OUTPUT);  // ${L.code_comment_adc_as_digital || "same pin, new role — plain digital I/O"}
UMT.Digital_Pin(VR_ADC_IN4).write(HIGH);      // ${L.code_comment_led_on || "GPIO32 → 3.3V → LED ON"}
UMT.Digital_Pin(VR_ADC_IN4).write(LOW);       // ${L.code_comment_led_off || "GPIO32 → 0V → LED OFF"}`:`UMT.Interface(VR_ADC4).activate();            // ${L.code_comment_activate || "ADC4 ON — GPIO32 claimed as analog input, 12-bit armed"}
UMT.Interface_Pin(VR_ADC_IN4).enable();       // ${L.code_comment_adc_channel || "channel bound — every read() samples GPIO32"}
int value = UMT.Interface_Pin(VR_ADC_IN4).read();   // ${L.code_comment_adc_read || "one conversion → 0..4095 (12-bit)"}`}/>
      </div>}
    </div>);
}

/* ═══ STEP DEMO ═══ */
/* ═══ CC — COLORED CODE RENDERER (v7.2) ═══
   Three-tone syntax coloring for every UMT / generated-C++ code panel:
     • code          → base color (green-ish for UMT VR panels, red-ish for generated)
     • // comments   → green italic #6a9955 (VSCode comment tone) — ALWAYS on the
                       SAME LINE as the code they explain (Amine's locked style)
     • VR_ tokens    → cyan bold #4fc1ff so Virtual Register names pop instantly
   Comments must be FUNCTIONAL (what the call DOES) — never meta-comments. */
function CC({code,base,com="#6a9955",vr="#4fc1ff",style}){
  return(<pre dir="ltr" style={{background:"#050607",borderRadius:6,padding:10,margin:0,fontFamily:fn,whiteSpace:"pre-wrap",wordBreak:"break-word",lineHeight:1.65,textAlign:"left",...style}}>
    {code.split("\n").map((ln,i)=>{
      if(!ln) return <div key={i}>{"\u00A0"}</div>;
      const ci=ln.indexOf("//");
      const cp=ci<0?ln:ln.slice(0,ci);
      const cm=ci<0?"":ln.slice(ci);
      const segs=cp.split(/(VR_[A-Za-z0-9_]+)/g);
      return(<div key={i}>
        {segs.map((s,j)=>/^VR_/.test(s)
          ?<span key={j} style={{color:vr,fontWeight:700}}>{s}</span>
          :<span key={j} style={{color:base}}>{s}</span>)}
        {cm&&<span style={{color:com,fontStyle:"italic"}}>{cm}</span>}
      </div>);
    })}
  </pre>);
}

function Demo({steps,caseId,title,uFull,gFull}){
  const [a,setA]=useState(-1);const [pl,setPl]=useState(false);const tm=useRef(null);
  const play=()=>{setPl(true);setA(0);let i=0;const tk=()=>{i++;if(i<steps.length){setA(i);tm.current=setTimeout(tk,2600);}else setPl(false);};tm.current=setTimeout(tk,2600);};
  const stop=()=>{clearTimeout(tm.current);setPl(false);setA(-1);};
  const st=a>=0?steps[a]:null;
  const rc=st?.r==="digital"?K.gr:st?.r==="interface"?K.bl:st?.r==="free"?K.yl:K.mt;
  const sc=st?.s==="FREE"?K.gr:st?.s==="RESERVED"?K.yl:st?.s==="BOUND"?K.bl:K.mt;
  return(<div style={{marginBottom:20}}>
    <div style={{padding:"10px 14px",background:K.sf,border:`1px solid ${K.or}33`,borderRadius:"8px 8px 0 0",display:"flex",alignItems:"center",gap:10}}>
      <span style={{fontSize:16}}>{caseId===1?"📡":"⚡"}</span>
      <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:K.or}}>{title}</div><div style={{fontSize:9,color:K.mt}}>{caseId===1?"activate() → Interface":"deactivate() → Digital"}</div></div>
      {!pl?<button onClick={play} style={{padding:"6px 16px",fontSize:10,borderRadius:5,cursor:"pointer",fontFamily:fn,fontWeight:700,background:`linear-gradient(135deg,${K.gr},#15803d)`,color:"#fff",border:"none"}}>▶ Animate</button>
      :<button onClick={stop} style={{padding:"6px 16px",fontSize:10,borderRadius:5,cursor:"pointer",fontFamily:fn,background:K.sf,color:K.rd,border:`1px solid ${K.rd}44`}}>✕ Stop</button>}
    </div>
    <div style={{background:K.sa,border:`1px solid ${K.or}33`,borderTop:"none",borderRadius:"0 0 8px 8px",padding:14}}>
      <div style={{display:"flex",gap:3,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
        {steps.map((s,i)=>{const ac=i===a;const dn=i<a;const cl=s.r==="digital"?K.gr:s.r==="interface"?K.bl:s.r==="free"?K.yl:K.mt;return(
          <div key={i} style={{display:"flex",alignItems:"center"}}>
            <div onClick={()=>{if(!pl)setA(i);}} style={{width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,cursor:pl?"default":"pointer",background:ac?cl:dn?`${K.or}33`:K.sf,color:ac?"#fff":dn?K.or:K.mt,border:`2px solid ${ac?cl:dn?K.or:K.bd}`,transition:"all 0.35s cubic-bezier(.22,1,.36,1)",transform:ac?"scale(1.2)":"scale(1)",boxShadow:ac?`0 0 16px ${cl}50`:"none"}}>{i+1}</div>
            {i<steps.length-1&&<div style={{width:10,height:2,background:dn?K.or:K.bd,transition:"background 0.3s"}}/>}
          </div>);
        })}
      </div>
      {st&&<div key={a} style={{animation:"si 0.3s"}}>
        <div style={{fontSize:12,fontWeight:700,color:rc,marginBottom:8}}>Step {a+1}: {st.t}</div>
        <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
          {st.p!=="—"&&<span style={{fontSize:9,padding:"3px 10px",borderRadius:4,background:`${rc}12`,border:`1px solid ${rc}30`,color:rc,fontWeight:700}}>{st.r==="digital"?"⚡":st.r==="interface"?"📡":"🔓"} {st.p}: {st.r==="digital"?"DIGITAL":st.r==="interface"?"INTERFACE":"FREED"}</span>}
          {st.s!=="—"&&<span style={{fontSize:9,padding:"3px 10px",borderRadius:4,background:`${sc}12`,border:`1px solid ${sc}30`,color:sc,fontWeight:700}}>State: {st.s}</span>}
        </div>
        <div className="umt-2col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          <div><div style={{fontSize:8.5,fontWeight:700,color:K.gr,marginBottom:4}}>● UMT VR CODE</div>
            <CC code={st.u} base="#86efac" style={{fontSize:10.5,border:`1px solid ${K.gr}18`}}/></div>
          <div><div style={{fontSize:8.5,fontWeight:700,color:K.rd,marginBottom:4}}>● GENERATED (hidden)</div>
            <CC code={st.g} base="#aa8a8a" style={{fontSize:10.5,border:`1px solid ${K.rd}18`}}/></div>
        </div>
        <div style={{fontSize:10,color:"#a8a29e",lineHeight:1.7,padding:"10px 12px",background:K.sf,borderRadius:6,border:`1px solid ${K.bd}`,whiteSpace:"pre-line"}}>{st.d}</div>
      </div>}
      {a===-1&&<div className="umt-2col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div><div style={{fontSize:9,fontWeight:700,color:K.gr,marginBottom:4}}>✅ DEVELOPER WRITES</div>
          <CC code={uFull} base="#86efac" style={{fontSize:9.5,lineHeight:1.6,maxHeight:220,overflow:"auto",border:`1px solid ${K.bd}`}}/></div>
        <div><div style={{fontSize:9,fontWeight:700,color:K.rd,marginBottom:4}}>🔒 GENERATED</div>
          <CC code={gFull} base="#aa8a8a" style={{fontSize:9.5,lineHeight:1.6,maxHeight:220,overflow:"auto",border:`1px solid ${K.bd}`}}/></div>
      </div>}
    </div>
  </div>);
}

const Bg=({c,children})=><span style={{fontSize:8.5,fontWeight:700,color:c,background:c+"14",border:`1px solid ${c}25`,padding:"2px 8px",borderRadius:3,fontFamily:fn}}>{children}</span>;

/* ═══ APP ═══ */
export default function App(){
  const [tab,setTab]=useState("concept");
  const [copied,setCopied]=useState(false);
  const [bgaHover,setBgaHover]=useState(null);
  const [lang,setLang]=useState("en");
  const [langOpen,setLangOpen]=useState(false);

  // i18n helpers
  const curLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const scope = DEMO_SCOPE_I18N[lang] || DEMO_SCOPE_I18N.en;
  const demoSteps = DEMOS_STEPS_I18N[lang]; // null for English, fallback inline
  const L = KB_LABELS[lang] || KB_LABELS.en;  // Full KB labels for current language
  const isRTL = curLang.dir === "rtl";

  const TABS=[
    {id:"concept",l:L.tabs.concept},
    {id:"gpio",l:L.tabs.gpio},
    {id:"demos",l:L.tabs.demos},
    {id:"bga",l:L.tabs.bga},
    {id:"substrate",l:L.tabs.substrate},
    {id:"prompt",l:L.tabs.prompt},
    {id:"hw",l:L.tabs.hw},
  ];

  const PROMPT=`🔷 MASTER CONTEXT — Pro_AmineUMT IDE with AI (KB v7.2 — Package Substrate + Pure VR + Debug at Source)
© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir
Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025
Rising Star in Microchip Technology Solutions in Europe
Platform: UMT Platform — Unified Microchip Technology (covers both MCUs and SoCs)
Standard: UMT 16×16 BGA Hybrid MCU (Microcontroller) / SoC (System-on-Chip Processor) Package Substrate Standard

════════════════════════════════════════
FOUNDATIONAL DECISION #1 — Pure VR Source / Hidden Native Backend (v4.1)
════════════════════════════════════════
UMT IS a C++ DIALECT — not a new language. The .umt file is C++ with the UMT VR API library, exactly like .ino is C++ with the Arduino API. Same syntax, same compile (gcc/clang). Translation happens between API libraries — NOT between languages.

Developer writes ONLY .umt VR API. AIA Engine generates platform-specific C++ INVISIBLY into .umt/generated/main_generated.cpp — auto-regenerated every build, NEVER edited/read/touched by the developer.

THE 5 GUARANTEES:
  ① Developer NEVER sees a GPIO number — only VR identifiers
  ② Developer NEVER picks Arduino vs ESP-IDF vs Zephyr — AIA selects backend invisibly
  ③ Developer NEVER configures a toolchain — UMT Platform Layer handles it
  ④ ONLY the .umt VR API appears in the editor — no platform code ever surfaces
  ⑤ All mapping + backend selection + codegen done by AIA Engine — deterministic-first

Cross-architecture proof — SAME .umt → 3 DIFFERENT C++ files:
  → ESP32:   ledcWrite() + Serial2 (Arduino-ESP32 Core)
  → STM32:   HAL_TIM_PWM_Start() + HAL_UART_Transmit (STM32Cube HAL)
  → RP2040:  pwm_set_chan_level() + uart_write_blocking (Pico SDK)

Parallels established in the industry:
  TypeScript → JavaScript (per target)
  Kotlin     → JVM bytecode
  Dart       → native (Flutter)
  CUDA       → PTX (per GPU architecture)
  UMT        → platform C++ (per MCU/SoC)

════════════════════════════════════════
FOUNDATIONAL DECISION #2 — Debug at Source, Run at Native (v4.2)
════════════════════════════════════════
UMT debug operates at the .umt SOURCE level — NEVER at the generated C++ level. Mirrors how TypeScript(.ts), CUDA(.cu), and Flutter(.dart) debug at source while running at native binary.

Mechanism:
  1. Source map file: .umt/cache/aia_map.json — maps every .umt line → ELF symbol → physical pin
  2. IDE sets breakpoint in .umt source (red gutter dot)
  3. AIA Codegen compiles with -g flag; embeds DWARF custom section ".umt_vr_debug"
  4. Flash via JTAG/SWD probe (openocd + gdb-multiarch); UART upload is run-mode only
  5. On hardware halt: GDB reports ELF symbol → reverse map → IDE highlights matching .umt line
  6. Variables window shows VR-LEVEL state: VR_PWM_OUT0.duty = 128
     NEVER framework-level: ledc_ch[0].duty = 0x80 (this is leaked abstraction — forbidden)
  7. Advanced View (optional, read-only): inspect .umt/generated/main_generated.cpp — like CUDA PTX viewer; cannot be edited

Probe requirements per target:
  ESP32        — native USB-Serial JTAG (no extra probe needed)
  STM32        — ST-Link V2/V3
  Raspberry Pi Pico — picoprobe SWD
  UMT IC       — BGA SWD pins 0xCB / 0xCC
  NanoKit-iM   — connector pins 33–37

Without a probe → Simulator debug only (still source-level).
Debug at Source is 120× faster than Serial.print iteration (10 sec halt+inspect vs 20 min recompile-cycle).

════════════════════════════════════════
CORE CONCEPT — Pin Dual Roles
════════════════════════════════════════
Every pin on an MCU has a primary digital function — input (switch) or output (LED). That same pin may also carry interface/protocol functions (UART, PWM, ADC, SPI, I2C, etc.).

In the UMT Platform, each pin is limited to only two possible roles: either Digital or Interface — not both at the same time.

THE RULE:
  deactivate() → Pin = Digital (LED, Switch, basic I/O)
  activate()   → Pin = Interface (UART, PWM, ADC, SPI, I2C)

One single line of code determines the Pin's role.

Interface Table:
  UART    — deactivate→Digital I/O | activate→transmits/receives UART data
  PWM     — deactivate→Digital I/O | activate→generates PWM signal
  Analog  — deactivate→Digital I/O | activate→reads ADC value
  SPI     — deactivate→Digital I/O | activate→operates within SPI bus
  I2C     — deactivate→Digital I/O | activate→operates within I2C bus

════════════════════════════════════════
SPECIAL CASE — VR_GPIOxx (Row 0x8: 0x80-0x8F, 16 pins)
════════════════════════════════════════
Intentionally left open for chip manufacturers to assign their own custom interfaces.
Each manufacturer maps their proprietary interfaces onto these 16 pins during the Package Substrate stage, then ships a UMT-compliant library inside UMT SDK Framework.

ROLE 1 — Standard Digital I/O (deactivate):
  UMT.Interface(VR_GPIO).deactivate();
  UMT.Digital_Pin(VR_GPIO00).setMode(OUTPUT);
  UMT.Digital_Pin(VR_GPIO00).write(HIGH);

ROLE 2 — Manufacturer-Defined Custom Interface (activate):
  UMT.Interface(VR_GPIO).bindTo(VR_NewInterface);
  UMT.Interface(VR_NewInterface).activate();

Manufacturers can split 16 pins into 3-4 custom interfaces.
• HW engineers: unified PCB routing regardless of manufacturer
• SW engineers: single codebase across chips
• Performance: high-speed non-traditional data transfer via Package Substrate

════════════════════════════════════════
API REFERENCE
════════════════════════════════════════
UMT.Interface(VR_xxx).activate()           — Switch to Interface mode (peripheral)
UMT.Interface(VR_xxx).deactivate()         — Switch to Digital mode (free pins)
UMT.Interface(VR_GPIO).bindTo(VR_NewIf)    — Bind GPIO row to manufacturer interface

UMT.Interface_Pin(VR_xxx).enable()         — Enable channel (RX, PWM output)
UMT.Interface_Pin(VR_xxx).disable()        — Disable channel (standby)
UMT.Interface_Pin(VR_xxx).write(val)       — Write value (PWM duty, etc.)
UMT.Interface_Pin(VR_xxx).read()           — Read value
UMT.Interface_Pin(VR_xxx).hasLine()        — Check if UART has incoming line
UMT.Interface_Pin(VR_xxx).readLine()       — Read line from UART

UMT.Digital_Pin(VR_xxx).setMode(mode)      — OUTPUT | INPUT | INPUT_PULLUP
UMT.Digital_Pin(VR_xxx).write(val)         — HIGH | LOW
UMT.Digital_Pin(VR_xxx).read()             — Read digital value

UMT.UART(VR_xxx).read()                    — Shortcut: Read UART data
UMT.PWM(VR_xxx).write(val)                 — Shortcut: Set PWM duty cycle

════════════════════════════════════════
5 GUARANTEES (non-negotiable)
════════════════════════════════════════
1. Developer NEVER sees GPIO numbers (GPIO3, GPIO17, etc.)
2. Developer NEVER manually selects Arduino, ESP-IDF, Zephyr
3. Developer NEVER configures platform toolchains
4. Developer writes ONLY UMT Virtual Register (VR) code
5. All mapping, backend selection, firmware gen → handled by AIA Engine

════════════════════════════════════════
AIA ENGINE — 7-Step Pipeline
════════════════════════════════════════
1. Parse intent — Digital mode (deactivate) or Interface mode (activate)?
2. Full-pin scan — Scan ALL MCU pins. Match: Type + Direction + Index
3. Symbolic tokens — VR_ADC_IN4 → {ADC|IN|4} → ADC1_CH4 → GPIO32
4. Functional clone — Clone capability from GPIO32 → bind to VR
5. Conflict check — Pin free? Interface state? Flash-reserved? BOOT?
6. Backend codegen — Hidden C++ for Arduino/ESP-IDF/Zephyr (never shown)
7. Compile & flash — Toolchain → Flash (UART/JTAG/SWD/GFU) → Monitor

Cross-Architecture: VR_ADC_IN4 → ESP32:GPIO32 | STM32:PA4 | RP2040:GPIO28

════════════════════════════════════════
HARDWARE TARGETS
════════════════════════════════════════
A: Development Boards (VIRTUAL VR) — NanoKit ESP32, Arduino, STM32 Nucleo, Pico, Jetson Nano
B: UMT IC — Any MCU Die on BGA 16×16 (PHYSICAL VR) — Espressif, STM, NXP, Texas Instruments, Broadcom, NVIDIA, Qualcomm Snapdragon, Apple, Samsung, HiSilicon Kirin (Huawei)
C: NanoKit-iM — Selectable MCU Module (PHYSICAL VR) — ESP32-D0WD first MCU

════════════════════════════════════════
UMT BGA 16×16 HYBRID v9 (256 balls + 4 external pads)
════════════════════════════════════════
0x0 = UART×4 + INT0-3 + TMR0/1 + UART_CTS/RTS
0x1 = SPI×2 + QSPI + USART_RX/TX
0x2 = USB 2.0×2 + USB 3.0×2 + USART_CTS/RTS + CAN
0x3 = I2C×2 (I2C1=PMIC) + I3C + PDM + BOOT(0x38) + Storage(SDIO/eMMC/UFS)
0x4 = JTAG×5 + MIPI CSI Camera 1 (4K) + Touch INT/RST + CSI_PWDN
0x5 = ADC×8 (0x50-0x57, re-addressed v8) + Ethernet GbE RMII (0x58-0x5F)
0x6 = I2S×2 + MIPI DSI + PWM Audio L/R
0x7 = DAC×3 + HDMI 2.0 + PCIe x1 Gen3
0x8 = VR_GPIO×16 — SPECIAL CASE (Manufacturer-Defined)
0x9 = LPDDR Data Bus D0-D15
0xA = LPDDR Control + ODT + RST_n (JEDEC-compliant)
0xB = Camera 2 CSI + LVDS×2 + SPDIF
0xC = PWM×4 + SWD + TRACE + DMA + WDT + RTC + FlexIO×4
0xD = GND(0xD0)+VCC(0xD1) + VREF + XTAL + PLL + USB_VBUS + HDMI ctrl + WAKE/SLEEP
0xE = DisplayPort×2 + WLAN_ANT/EN + CELL_ANT/EN + MIC/SPK differential
0xF = NFC + IR + PCIe_PERST(0xF4) + CLKREQ(0xF5) + PWR_GOOD(0xF6) + Display Ctrl + RST(0xFF)

External Power Pads (outside matrix): PAD_A=GND_PAD1, PAD_B=GND_PAD2, PAD_C=VCC_PAD1, PAD_D=VCC_PAD2

════════════════════════════════════════
NANOKIT ESP32 LOCKED COORDINATES (34 pins, v9)
════════════════════════════════════════
UART: TX0=0x01, RX0=0x00, TX2=0x05, RX2=0x04
SPI:  MOSI0=0x10, MISO0=0x11, SCLK0=0x12, CS0=0x13
      MOSI1=0x14, MISO1=0x15, SCLK1=0x16, CS1=0x17
I2C:  SDA0=0x30, SCL0=0x31
ADC (re-addressed v8): IN0=0x50, IN3=0x53, IN4=0x54, IN6=0x56
DAC:  OUT1=0x71
GPIO: GPIO00-10 = 0x80-0x8A (GPIO04-09 = ESP32 internal flash, DO NOT USE)
PWM:  OUT0=0xC0 (built-in LED on ESP32 GPIO2)
GND:  0xD0 (NanoKit pins 12 & 31 — v9 ADDED to lock list)
SYS:  BOOT=0x38, RST=0xFF

════════════════════════════════════════
ESP32 RESTRICTIONS (AIA Rule Engine)
════════════════════════════════════════
[HARD ABORT] GPIO6–11 (VR_GPIO04–09) = internal SPI flash — MUST NOT be used
[CONSTRAINT] GPIO34,35,36,39 = INPUT ONLY — no digital output
[CONSTRAINT] GPIO0 (VR_BOOT 0x38) must be HIGH at boot
[WARNING]    UART0 (G1/G3) shared with USB-Serial

════════════════════════════════════════
PACKAGE SUBSTRATE — Amine's Vision (NEW in v7)
════════════════════════════════════════
Amine sees Package Substrate as the next innovation frontier. Chipmakers treat it as routine.
By integrating wireless/optical interconnect inside the substrate during manufacturing,
the bandwidth bottleneck of PCB copper traces can be eliminated.

Master/Slave Parallel Architecture:
  UMT IC (Master) ↔ many slave driver ICs in parallel inside substrate
  Hybrid SPI+I2C+PCIe-style bus
  Bandwidth scales with #slaves, not PCIe lane width

Future Substrate Technologies:
  • Silicon Photonics (VCSEL + waveguides) — Intel/IBM/TSMC research
  • 3D Stacking with TSV — NVIDIA H100 (HBM+GPU)
  • Wireless On-Chip — research stage, Amine's bet for future

Quantum Bottleneck Insight:
  Speed of computation is useless without matching bandwidth of data transfer.
  Solving interconnect problem at substrate level benefits CPUs, AI, quantum-classical hybrids.

════════════════════════════════════════
SYSTEM LAYERS
════════════════════════════════════════
L5 — IDE / CLI / API (Full developer access)
L4 — AIA Engine (Transparent)
L3 — UMT SDK / VR API ★ THE ONLY LAYER DEVELOPER TOUCHES
L2 — Framework Layer (Hidden — Arduino/ESP-IDF/Zephyr)
L1 — Platform Layer (Hidden — toolchains, linker, HAL)
L0 — Hardware / Silicon (Hidden — physical MCU)

════════════════════════════════════════
UMT SDK OVERVIEW — 45 Interfaces (from UMT SDK README)
════════════════════════════════════════
UMT SDK v1.0.0 covers 45 distinct interface types spanning the entire BGA 16×16 Hybrid v9 matrix:
  • Serial buses:        UART×4, SPI×2, I2C×2, CAN, I2S×2, SPDIF
  • USB family:          USB2×2, USB3×2
  • Memory & storage:    LPDDR, SDIO, eMMC, UFS
  • Analog:              ADC×8, DAC×3
  • Display & video:     DisplayPort×2, HDMI, MIPI DSI, LVDS×2, MIPI CSI×2 (Camera)
  • Networking:          Ethernet (RMII), WLAN, Cellular
  • PWM & audio:         PWM×4, PWM Audio
  • Debug & test:        JTAG×5, SWD, TRACE
  • System:              RTC, WDT, FlexIO×4, DMA
  • Power & clocks:      VR_GND (0xD0), VCC, XTAL, PLL, VR_RST (0xFF)
  • Chipmaker zone ★:    VR_GPIO×16 (Row 0x8) — manufacturer-defined custom interfaces

Naming clarification (from UMT SDK README):
  "Microchip" = generic noun (any integrated circuit), part of "Unified Microchip Technology" expansion
  "Microcontroller" (MCU) = specific 8/16/32-bit embedded processor (ESP32, STM32, AVR, etc.)
  "System-on-Chip Processor" (SoC) = high-end integrated processor (Snapdragon, Apple A, Exynos, NVIDIA, Kirin)
  UMT covers BOTH MCUs and SoCs uniformly via the same VR API and 16×16 BGA standard.

The developer imports a single header:
  #include "UMT.h"  // Pulls in VRTypes.h (260 VR identifiers) + UMTConfig.h (auto-generated)
That is the entire surface of the SDK — every interface is reachable through the three API tiers:
  UMT.Interface(VR_xxx)       — peripheral level (activate/deactivate)
  UMT.Interface_Pin(VR_xxx)   — interface-pin level (enable/write/read)
  UMT.Digital_Pin(VR_xxx)     — digital-pin level (setMode/write/read)

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
🔷 END OF CONTEXT`;

  const copy=()=>{navigator.clipboard.writeText(PROMPT).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);});};

  /* Determine cell category for BGA matrix coloring */
  const cellCategory=(rowHex,col,name)=>{
    const addr=`${rowHex}${col.toString(16).toUpperCase()}`;
    const isLocked=NANOKIT_LOCKED.has(addr);
    const isFlash=FLASH_ADDRS.has(addr);
    const isReserved=name.startsWith("RSVD");
    const isGpio=name.startsWith("GPIO");
    return { isLocked, isFlash, isReserved, isGpio };
  };

  return(
    <div style={{fontFamily:fn,background:K.bg,minHeight:"100vh",color:K.tx,padding:"12px 8px",overflowX:"hidden",width:"100%"}}>
      <style>{`
        /* GLOBAL FIX — prevent overflow from padding/borders */
        * { box-sizing: border-box; }
        @keyframes si{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes globe-spin{from{transform:rotateY(0deg)}to{transform:rotateY(360deg)}}
        @keyframes lang-pulse{0%,100%{box-shadow:0 0 0 0 rgba(234,88,12,.6)}50%{box-shadow:0 0 0 6px rgba(234,88,12,0)}}
        @keyframes drop-in{from{opacity:0;transform:translateY(-8px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
        /* Cross-platform flag rendering — Windows/Linux fallback */
        .umt-flag {
          font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji",
                       "Twemoji Mozilla", "EmojiOne Color", "Android Emoji", sans-serif;
          font-style: normal; font-weight: normal; line-height: 1; display: inline-block;
        }
        .umt-flag-fallback {
          font-family: monospace; font-size: 0.78em; padding: 1px 4px;
          border: 1px solid currentColor; border-radius: 3px;
          letter-spacing: 0.5px; font-weight: 700; opacity: .85; display: inline-block;
        }
        /* TAB BAR — ensure complete frames + center orphan last tab (7th alone on row 3) */
        .umt-tab-bar { box-sizing: border-box; }
        .umt-tab-btn { box-sizing: border-box; overflow: hidden; }
        /* When there are 7 children, last child sits alone — center it in the middle column */
        .umt-tab-bar > :nth-last-child(1):nth-child(7) { grid-column: 2 / 3; }
        /* PADS grid — 4 cols desktop, 2x2 on mobile so PAD_D fits */
        @media (max-width: 768px) {
          .umt-pads-grid { grid-template-columns: 1fr 1fr !important; }
        }

        /* MOBILE RESPONSIVE — single column, scrollable tables, no horizontal overflow */
        @media (max-width: 768px) {
          .umt-2col { grid-template-columns: 1fr !important; }
          .umt-2col > * { min-width: 0 !important; }
          .umt-scroll-x { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .umt-bga-grid { min-width: 100% !important; }
          .umt-tab-bar { gap: 5px !important; }
          .umt-tab-btn { font-size: 9px !important; padding: 7px 4px !important; min-height: 42px !important; }
          .umt-lang-btn-mobile { top: 6px !important; right: 6px !important; }
          .umt-h1 { font-size: 14px !important; }
          .umt-subtitle { font-size: 8.5px !important; line-height: 1.5 !important; }
          .umt-eyebrow { padding-right: 110px !important; padding-left: 110px !important; font-size: 7.5px !important; letter-spacing: 2.5px !important; }
          /* prevent any block from overflowing on phones */
          .umt-container { padding-left: 8px !important; padding-right: 8px !important; }
          table { width: 100% !important; table-layout: fixed !important; word-wrap: break-word; }
          pre { max-width: 100% !important; overflow-x: auto !important; }
        }
        @media (max-width: 480px) {
          .umt-h1 { font-size: 12px !important; }
          .umt-subtitle { font-size: 8px !important; }
          .umt-eyebrow { padding-right: 95px !important; padding-left: 95px !important; font-size: 6.5px !important; letter-spacing: 1.5px !important; }
          .umt-container { padding-left: 4px !important; padding-right: 4px !important; }
          .umt-tab-btn { font-size: 8px !important; padding: 6px 2px !important; gap: 3px !important; min-height: 40px !important; }
        }
      `}</style>
      <div className="umt-container" style={{maxWidth:1100,margin:"0 auto",width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:14,paddingBottom:10,borderBottom:`1px solid ${K.bd}`,position:"relative",paddingTop:6}}>
          <div className="umt-eyebrow" style={{fontSize:8.5,letterSpacing:4,color:K.mt,marginBottom:4,paddingRight:90,paddingLeft:90}}>PROJECT KNOWLEDGE BASE v7 — PACKAGE SUBSTRATE EDITION</div>
          <h1 className="umt-h1" style={{fontSize:17,fontWeight:900,color:K.or,margin:0}}>Pro_AmineUMT IDE with AI</h1>
          <div className="umt-subtitle" style={{fontSize:9.5,color:K.mt,marginTop:3}}>UMT Platform — Unified Microchip Technology · Algorithm &amp; System Architecture Diagram &amp; Dependency Map · UMT 16×16 BGA Hybrid MCU (Microcontroller) / SoC (System-on-Chip Processor) Package Substrate Standard</div>

          {/* Language Selector — rotating globe + flag + ISO code badge */}
          <div className="umt-lang-btn-mobile" style={{position:"absolute",top:0,right:0}}>
            <button
              onClick={()=>setLangOpen(o=>!o)}
              style={{
                padding:"4px 10px",fontSize:10,borderRadius:5,cursor:"pointer",fontFamily:"inherit",
                background:langOpen?"#ea580c":"linear-gradient(135deg,#7c2d12,#9a3412)",
                color:"#fff",border:"none",fontWeight:700,display:"flex",alignItems:"center",gap:5,
                animation:langOpen?"none":"lang-pulse 2.5s ease-out infinite"
              }}
              title="Choose translation language for explanations"
            >
              <span style={{display:"inline-block",animation:"globe-spin 3.5s linear infinite"}}>🌐</span>
              <span className="umt-flag" style={{fontSize:13}}>{curLang.flag}</span>
              <span className="umt-flag-fallback" style={{color:"#fff",borderColor:"#fff"}}>{curLang.code.toUpperCase()}</span>
              <span style={{fontSize:7,opacity:.7}}>{langOpen?"▲":"▼"}</span>
            </button>
            {langOpen && (
              <div style={{position:"absolute",top:"calc(100% + 4px)",right:0,background:"#1c1917",border:"1px solid #ea580c44",borderRadius:6,padding:4,minWidth:200,zIndex:50,boxShadow:"0 6px 20px rgba(0,0,0,.5)",animation:"drop-in .2s ease-out"}}>
                <div style={{fontSize:8,color:"#fbbf24",padding:"3px 8px 5px",borderBottom:"1px solid #2a2520",marginBottom:3,letterSpacing:.5,textTransform:"uppercase",fontWeight:700}}>
                  Translation Language
                </div>
                {LANGUAGES.map(L => (
                  <button
                    key={L.code}
                    onClick={()=>{setLang(L.code);setLangOpen(false);}}
                    style={{
                      width:"100%",padding:"6px 8px",fontSize:11,borderRadius:3,cursor:"pointer",fontFamily:"inherit",
                      background:lang===L.code?"#ea580c":"transparent",
                      color:lang===L.code?"#fff":"#d6d3d1",
                      border:"none",textAlign:"left",display:"flex",alignItems:"center",gap:7,
                      direction:L.dir,marginBottom:1
                    }}
                    onMouseOver={e=>{if(lang!==L.code)e.currentTarget.style.background="#292524";}}
                    onMouseOut={e=>{if(lang!==L.code)e.currentTarget.style.background="transparent";}}
                  >
                    <span className="umt-flag" style={{fontSize:16,minWidth:20,textAlign:"center"}}>{L.flag}</span>
                    <span className="umt-flag-fallback" style={{color:lang===L.code?"#fff":"#a8a29e",borderColor:lang===L.code?"#fff":"#57534e",fontSize:8}}>{L.code.toUpperCase()}</span>
                    <span style={{flex:1,fontSize:11,fontWeight:lang===L.code?700:400}}>{L.name}</span>
                    {lang===L.code && <span style={{fontSize:10,fontWeight:700}}>✓</span>}
                  </button>
                ))}
                <div style={{fontSize:7.5,color:"#a8a29e",padding:"6px 8px 2px",borderTop:"1px solid #2a2520",marginTop:3,lineHeight:1.4}}>
                  Technical terms (VR_*, UMT, AIA, GPIO) <b style={{color:"#fbbf24"}}>always English</b>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="umt-tab-bar" style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:6,marginBottom:14,maxWidth:760,marginLeft:"auto",marginRight:"auto"}}>
          {TABS.map(t=><button key={t.id} className="umt-tab-btn" onClick={()=>setTab(t.id)} style={{padding:"8px 6px",fontSize:10,borderRadius:6,cursor:"pointer",fontFamily:fn,fontWeight:700,background:tab===t.id?K.or:"transparent",color:tab===t.id?"#fff":K.mt,border:`1px solid ${tab===t.id?K.or:K.bd}`,transition:"all 0.15s",display:"flex",alignItems:"center",justifyContent:"center",gap:5,lineHeight:1.25,textAlign:"center",minWidth:0,minHeight:38,wordBreak:"break-word"}}>{t.l}</button>)}
        </div>

        {/* ═══ GLOBAL TRANSLATION NOTE — shown across all tabs when language ≠ English ═══ */}
        {lang !== "en" && (
          <div key={"i18n-note-"+lang} style={{marginBottom:14,padding:"8px 12px",background:"linear-gradient(90deg,#1c1917,#1a1410,#1c1917)",border:`1px solid ${K.or}40`,borderRadius:6,fontSize:10,color:"#fbbf24",display:"flex",alignItems:"center",gap:8,animation:"si .25s ease-out",direction:isRTL?"rtl":"ltr"}}>
            <span style={{fontSize:14,display:"inline-block",animation:"globe-spin 4s linear infinite"}}>🌐</span>
            <span className="umt-flag" style={{fontSize:16}}>{curLang.flag}</span>
            <span className="umt-flag-fallback" style={{color:"#fbbf24",borderColor:"#fbbf24",fontSize:9}}>{curLang.code.toUpperCase()}</span>
            <span style={{flex:1,fontSize:9.5,color:"#d6d3d1",lineHeight:1.5}}>{L.translation_note}</span>
          </div>
        )}

        {/* ═══ CONCEPT ═══ */}
        {tab==="concept"&&<div style={{display:"grid",gap:12}}>
          <div style={{background:K.sf,borderRadius:8,border:`1px solid ${K.or}30`,padding:16,boxSizing:"border-box",minWidth:0,overflow:"hidden",width:"100%"}}>
            <div style={{fontSize:13,fontWeight:700,color:K.or,marginBottom:10,direction:isRTL?"rtl":"ltr",textAlign:"center",wordBreak:"break-word"}}>🎯 {L.concept_h}</div>
            <div style={{fontSize:10.5,color:"#a8a29e",lineHeight:1.8,whiteSpace:"pre-line",marginBottom:14,textAlign:"center",direction:isRTL?"rtl":"ltr",wordBreak:"break-word"}}>{(L.concept_main||CONCEPT.main).replace(/\\n/g,"\n")}</div>
            <div className="umt-2col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14,minWidth:0}}>
              {[{icon:"⚡",label:"Role 1 — Digital I/O",desc:"Input (Switch) / Output (LED)",api:"UMT.Digital_Pin(VR_xxx)",color:K.gr},
                {icon:"📡",label:"Role 2 — Interface",desc:"UART, PWM, ADC, SPI, I2C…",api:"UMT.Interface() + Interface_Pin()",color:K.bl}].map(r=>
                <div key={r.label} style={{background:"#060708",borderRadius:8,padding:14,border:`1px solid ${r.color}22`,borderLeft:`3px solid ${r.color}`,display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:6}}><span style={{fontSize:18}}>{r.icon}</span><div style={{fontSize:11.5,fontWeight:700,color:r.color}}>{r.label}</div></div>
                  <div style={{fontSize:10,color:"#a8a29e",marginBottom:6}}>{r.desc}</div>
                  <div style={{fontSize:10,color:r.color,fontWeight:700,background:`${r.color}10`,padding:"3px 8px",borderRadius:3,display:"inline-block"}}>{r.api}</div>
                </div>
              )}
            </div>
            <div style={{background:"#060708",borderRadius:8,padding:14,border:`1px solid ${K.yl}20`,textAlign:"center",direction:isRTL?"rtl":"ltr"}}>
              <div style={{fontSize:10,fontWeight:700,color:K.yl,letterSpacing:1.5,marginBottom:8}}>{L.pin_role_label}</div>
              <div style={{fontSize:13,lineHeight:2,direction:"ltr"}}><span style={{color:K.rd,fontWeight:700}}>deactivate()</span> → <span style={{color:K.gr,fontWeight:700}}>Digital</span> <span style={{color:K.mt}}>(LED, Switch)</span><br/><span style={{color:K.bl,fontWeight:700}}>activate()</span>{"    "} → <span style={{color:K.bl,fontWeight:700}}>Interface</span> <span style={{color:K.mt}}>(UART, PWM, ADC, SPI, I2C)</span></div>
            </div>
          </div>

          <PinVis L={L} isRTL={isRTL}/>

          <div style={{background:K.sf,borderRadius:8,border:`1px solid ${K.bd}`,padding:16}}>
            <div style={{fontSize:11,fontWeight:700,color:K.pu,marginBottom:10,direction:isRTL?"rtl":"ltr"}}>📋 {L.concept_genrule}</div>
            <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}><thead><tr>
              {[L.concept_th_iface,L.concept_th_deact,L.concept_th_act].map((h,i)=><th key={i} style={{padding:"8px 10px",background:"#060708",color:i===0?K.or:i===1?K.gr:K.bl,fontWeight:700,textAlign:"left",borderBottom:`1px solid ${K.bd}`}}>{h}</th>)}
            </tr></thead><tbody>{CONCEPT.table.map((r,i)=><tr key={i} style={{background:i%2===0?K.sf:"#0a0c0f"}}>
              <td style={{padding:"7px 10px",color:K.or,fontWeight:700,borderBottom:`1px solid ${K.bd}`}}>{r.i}</td>
              <td style={{padding:"7px 10px",color:"#a8a29e",borderBottom:`1px solid ${K.bd}`}}>{r.d}</td>
              <td style={{padding:"7px 10px",color:"#a8a29e",borderBottom:`1px solid ${K.bd}`}}>{r.a}</td>
            </tr>)}</tbody></table></div>
          </div>
        </div>}

        {/* ═══ VR_GPIOxx SPECIAL CASE (NEW TAB v7) ═══ */}
        {tab==="gpio"&&<div style={{display:"grid",gap:12}}>
          <div style={{background:K.sf,borderRadius:8,border:`2px solid #22c55e40`,padding:16,boxSizing:"border-box",minWidth:0,overflow:"hidden",width:"100%"}}>
            <div style={{fontSize:14,fontWeight:800,color:"#22c55e",marginBottom:8,direction:isRTL?"rtl":"ltr",textAlign:isRTL?"right":"left",wordBreak:"break-word"}}>🔧 {L.gpio_h}</div>
            <div style={{fontSize:10.5,color:"#a8a29e",lineHeight:1.8,marginBottom:12,direction:isRTL?"rtl":"ltr",textAlign:isRTL?"right":"left",wordBreak:"break-word"}}>{L.gpio_intro}</div>

            <div className="umt-2col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12,minWidth:0}}>
              <div style={{background:"#060708",borderRadius:8,padding:12,border:`1px solid ${K.gr}30`,borderLeft:`3px solid ${K.gr}`,boxSizing:"border-box",minWidth:0,overflow:"hidden"}}>
                <div style={{fontSize:11,fontWeight:700,color:K.gr,marginBottom:6,direction:isRTL?"rtl":"ltr",textAlign:isRTL?"right":"left"}}>⚡ {L.gpio_r1_title}</div>
                <div style={{fontSize:9.5,color:"#a8a29e",marginBottom:8,lineHeight:1.6,direction:isRTL?"rtl":"ltr",textAlign:isRTL?"right":"left",wordBreak:"break-word"}}>{L.gpio_r1_desc}</div>
                <pre dir="ltr" style={{background:"#050607",borderRadius:5,padding:9,fontSize:10,color:"#86efac",lineHeight:1.65,margin:0,fontFamily:fn,whiteSpace:"pre-wrap",overflowX:"auto",maxWidth:"100%",boxSizing:"border-box"}}>{`UMT.Interface(VR_GPIO).deactivate();
UMT.Digital_Pin(VR_GPIO00)
   .setMode(OUTPUT);
UMT.Digital_Pin(VR_GPIO00)
   .write(HIGH);  // LED ON`}</pre>
              </div>
              <div style={{background:"#060708",borderRadius:8,padding:12,border:`1px solid ${K.sub}40`,borderLeft:`3px solid ${K.sub}`,boxSizing:"border-box",minWidth:0,overflow:"hidden"}}>
                <div style={{fontSize:11,fontWeight:700,color:K.sub,marginBottom:6,direction:isRTL?"rtl":"ltr",textAlign:isRTL?"right":"left"}}>📡 {L.gpio_r2_title}</div>
                <div style={{fontSize:9.5,color:"#a8a29e",marginBottom:8,lineHeight:1.6,direction:isRTL?"rtl":"ltr",textAlign:isRTL?"right":"left",wordBreak:"break-word"}}>{L.gpio_r2_desc}</div>
                <pre dir="ltr" style={{background:"#050607",borderRadius:5,padding:9,fontSize:10,color:"#aa9580",lineHeight:1.65,margin:0,fontFamily:fn,whiteSpace:"pre-wrap",overflowX:"auto",maxWidth:"100%",boxSizing:"border-box"}}>{`UMT.Interface(VR_GPIO)
   .bindTo(VR_NewInterface);
UMT.Interface(VR_NewInterface)
   .activate();
// Pin = manufacturer-defined`}</pre>
              </div>
            </div>

            <div style={{background:"#060708",borderRadius:8,padding:12,border:`1px solid ${K.yl}25`}}>
              <div style={{fontSize:11,fontWeight:700,color:K.yl,marginBottom:8,direction:isRTL?"rtl":"ltr"}}>💡 {L.gpio_split_title}</div>
              <div style={{fontSize:9.5,color:"#a8a29e",lineHeight:1.7,marginBottom:8,direction:isRTL?"rtl":"ltr"}}>{L.gpio_split_intro}</div>
              {[
                { name:"Manufacturer A", split:"8 pins → VR_HighSpeedBus + 4 pins → VR_SecureChannel + 4 pins → digital I/O" },
                { name:"Manufacturer B", split:"4 pins → VR_MotionSensor + 4 pins → VR_HapticOut + 8 pins → VR_DSPLink" },
                { name:"Manufacturer C", split:"16 pins → VR_ParallelDataLink (single ultra-high-speed bus)" },
              ].map(m=>(
                <div key={m.name} style={{padding:"6px 10px",marginBottom:4,background:K.sa,borderRadius:5,border:`1px solid ${K.bd}`,fontSize:9.5}}>
                  <span style={{color:K.or,fontWeight:700}}>{m.name}:</span> <span style={{color:"#a8a29e"}}>{m.split}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{background:K.sf,borderRadius:8,border:`2px solid ${K.bl}40`,padding:16}}>
            <div style={{fontSize:13,fontWeight:800,color:K.bl,marginBottom:8,direction:isRTL?"rtl":"ltr"}}>🧩 {L.gpio_arch_h}</div>
            <div style={{fontSize:10,color:"#a8a29e",lineHeight:1.8,marginBottom:12,direction:isRTL?"rtl":"ltr"}}>{L.gpio_arch_intro}</div>

            {/* AVR vs ESP32 comparison */}
            <div className="umt-2col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              <div style={{background:"#060708",borderRadius:8,padding:11,border:`1px solid ${K.or}30`}}>
                <div style={{fontSize:10.5,fontWeight:700,color:K.or,marginBottom:4}}>NanoKit Integrated — AVR ATmega328P</div>
                <div style={{fontSize:8.5,color:"#a8a29e",lineHeight:1.6}}>8-bit · SMD · limited peripherals. Has interfaces ESP32 lacks (and vice-versa). No room to leave free pins for every function.</div>
              </div>
              <div style={{background:"#060708",borderRadius:8,padding:11,border:`1px solid ${K.gr}30`}}>
                <div style={{fontSize:10.5,fontWeight:700,color:K.gr,marginBottom:4}}>NanoKit Integrated — ESP32</div>
                <div style={{fontSize:8.5,color:"#a8a29e",lineHeight:1.6}}>32-bit · Xtensa LX6 · rich peripherals (TOUCH, RTC_IO, ADC2...). Developer picks the MCU to design their own NanoKit Integrated around.</div>
              </div>
            </div>

            {/* The pin19 / VR_0x82 multi-function example */}
            <div style={{background:"#060708",borderRadius:8,padding:12,border:`1px solid ${K.pu}30`}}>
              <div style={{fontSize:10.5,fontWeight:700,color:K.pu,marginBottom:6,direction:isRTL?"rtl":"ltr"}}>🔬 {L.gpio_example_h}</div>
              <div style={{fontSize:9.5,color:"#a8a29e",lineHeight:1.7,marginBottom:8,direction:isRTL?"rtl":"ltr"}}>{L.gpio_example_desc}</div>
              {/* Multi-function pin row (like the datasheet strip) */}
              <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8,direction:"ltr"}}>
                {[["pin 19","#a8a29e","#1c2028"],["VR_0x82","#fbbf24","#3a2a0a"],["VR_GPIO2","#22c55e","#0a2a14"],["VR_ADC2_IN7","#ff5252","#2a0a0a"],["VR_RTC_IO17","#e07b39","#2a1505"],["VR_TOUCH7","#4fc1ff","#0a1a2a"]].map(([t,c,bg])=>(
                  <span key={t} style={{fontSize:9,fontWeight:700,color:c,background:bg,border:`1px solid ${c}40`,borderRadius:4,padding:"3px 7px",fontFamily:fn}}>{t}</span>
                ))}
              </div>
              <pre dir="ltr" style={{background:"#050607",borderRadius:5,padding:9,fontSize:9.5,color:"#d8b4fe",lineHeight:1.65,margin:0,fontFamily:fn,whiteSpace:"pre-wrap",border:`1px solid ${K.pu}22`}}>{`// pin 19 = BGA coord VR_0x82 = slot VR_GPIO2
// ESP32 lets you pick ONE of these real peripherals:
UMT.Interface(VR_GPIO2).bindTo(VR_TOUCH7);   // or VR_ADC2_IN7 / VR_RTC_IO17
UMT.Interface(VR_TOUCH7).activate();
// Always prefix VR_ — the peripheral exists on ESP32, NOT on AVR ATmega328P`}</pre>
              <div style={{fontSize:8.5,color:"#fbbf24",marginTop:8,lineHeight:1.6,direction:isRTL?"rtl":"ltr",fontStyle:"italic"}}>★ {L.gpio_example_note}</div>
            </div>
          </div>

          <div style={{background:K.sf,borderRadius:8,border:`1px solid ${K.bl}30`,padding:14}}>
            <div style={{fontSize:11,fontWeight:700,color:K.bl,marginBottom:10,direction:isRTL?"rtl":"ltr"}}>✨ {L.gpio_benefits_title}</div>
            {[
              { who:"HW Engineers", benefit:"Unified PCB routing regardless of manufacturer — BGA coordinates of every UMT IC are identical, only VR_GPIOxx function changes per chip", color:K.bl },
              { who:"SW Engineers", benefit:"Single codebase across chips — developer writes UMT.Interface(VR_NewInterface).activate() and AIA Engine resolves the rest", color:K.gr },
              { who:"PCB Designers", benefit:"Easy memorization — all UMT chips use VR_0x[Row][Column] addressing. Learn one map, apply to every chip family", color:K.pu },
              { who:"System Integrators", benefit:"Datasheet uniformity — manufacturers publish UMT-compliant pinout in standardized format. UMT IC datasheet is instantly readable", color:K.or },
            ].map(b=>(
              <div key={b.who} style={{padding:"8px 12px",marginBottom:6,background:"#060708",borderRadius:6,border:`1px solid ${b.color}22`,borderLeft:`3px solid ${b.color}`}}>
                <div style={{fontSize:10.5,fontWeight:700,color:b.color,marginBottom:3}}>{b.who}</div>
                <div style={{fontSize:9.5,color:"#a8a29e",lineHeight:1.6}}>{b.benefit}</div>
              </div>
            ))}
          </div>
        </div>}

        {/* ═══ DEMOS ═══ */}
        {tab==="demos"&&<div>
          {/* ═══ DEMO SCOPE BANNER — translatable to 8 languages ═══ */}
          <div key={"scope-"+lang} style={{maxWidth:920,margin:"0 auto 14px",padding:"10px 14px",background:"linear-gradient(90deg,#1c1917,#2a1810,#1c1917)",border:`1px solid ${K.or}33`,borderRadius:7,fontSize:11,color:"#fbbf24",direction:curLang.dir,animation:"si 0.3s ease-out"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:8,lineHeight:1.6}}>
              <span style={{fontSize:16,direction:"ltr"}}>💡</span>
              <div style={{flex:1}}>
                <b style={{color:"#fbbf24"}}>{scope.title}:</b>
                <span style={{color:"#a8a29e"}}> {scope.body} </span>
                <code style={{color:"#4fc1ff",background:"#0a0a0a",padding:"1px 5px",borderRadius:3,fontSize:10,direction:"ltr",display:"inline-block",margin:"0 2px"}}>VR_ADC4</code>
                <span style={{color:"#a8a29e",direction:"ltr",display:"inline-block"}}> · </span>
                <code style={{color:"#4fc1ff",background:"#0a0a0a",padding:"1px 5px",borderRadius:3,fontSize:10,direction:"ltr",display:"inline-block",margin:"0 2px"}}>VR_PWM0</code>
                <span style={{color:"#a8a29e"}}> {scope.middle} </span>
                <b style={{color:"#22c55e"}}>{scope.emphasis}</b>
                <span style={{color:"#a8a29e"}}> {scope.tail}</span>
              </div>
            </div>
            {lang!=="en" && (
              <div style={{fontSize:8,color:"#78716c",marginTop:6,paddingTop:5,borderTop:`1px solid ${K.or}15`,direction:"ltr",fontStyle:"italic"}}>
                🌐 Translated to {curLang.name} — Technical terms (VR_*, UMT, AIA, GPIO, BGA, ESP32, ...) stay in English by design.
              </div>
            )}
          </div>

          <div style={{fontSize:10,color:K.mt,marginBottom:14,textAlign:"center"}}>Click <strong style={{color:K.gr}}>▶ Animate</strong> or click step numbers · <span style={{color:K.gr}}>Green</span>=Digital · <span style={{color:K.bl}}>Blue</span>=Interface</div>

          {/* Translated step explanations (C1 / C2) — only when language ≠ English */}
          {demoSteps && (
            <div key={"demosteps-"+lang} style={{maxWidth:920,margin:"0 auto 14px",padding:"10px 14px",background:"#071210",border:"1px solid #16a34a35",borderRadius:7,fontSize:10.5,color:"#6aaa80",direction:curLang.dir,animation:"si 0.3s ease-out"}}>
              <div style={{marginBottom:8,paddingBottom:6,borderBottom:"1px solid #16a34a15"}}>
                <b style={{color:"#22c55e"}}>{demoSteps.c1_title}</b>
                <div style={{marginTop:3,lineHeight:1.6}}>{demoSteps.c1_desc}</div>
              </div>
              <div style={{marginBottom:8}}>
                <b style={{color:"#22c55e"}}>{demoSteps.c2_title}</b>
                <div style={{marginTop:3,lineHeight:1.6}}>{demoSteps.c2_desc}</div>
              </div>
              <div style={{fontSize:9,color:"#fbbf24",paddingTop:6,borderTop:"1px solid #16a34a15",fontStyle:"italic"}}>
                ★ {demoSteps.sees_note}
              </div>
            </div>
          )}

          <Demo steps={C1} caseId={1} title="Case 1 — ADC + PWM (Interface Mode)"
            uFull={`void setup() {\n  UMT.Interface(VR_ADC4).activate();         // ADC4 ON — AIA claims GPIO32 as analog input, 12-bit armed, FREE → RESERVED\n  UMT.Interface_Pin(VR_ADC_IN4).enable();    // channel bound — every read() now samples GPIO32, RESERVED → BOUND\n  UMT.Interface(VR_PWM0).activate();         // PWM ch0 ON — 5 kHz, 8-bit duty attached to GPIO2\n  UMT.Interface_Pin(VR_PWM_OUT0).enable();   // output bound — duty starts at 0 (LED off)\n}\nvoid loop() {\n  int v = UMT.Interface_Pin(VR_ADC_IN4).read();   // one conversion → 0..4095 (12-bit), ~10 µs on ESP32\n  UMT.Interface_Pin(VR_PWM_OUT0).write(v >> 4);   // duty = v>>4 — LED brightness tracks the pot in real time\n  delay(20);\n}`}
            gFull={`void setup() {\n  analogReadResolution(12);\n  analogSetPinAttenuation(32, ADC_11db);\n  ledcSetup(0,5000,8);\n  ledcAttachPin(2,0);\n  ledcWrite(0,0);\n}\nvoid loop() {\n  int v = analogRead(32);\n  ledcWrite(0, v >> 4);\n  delay(20);\n}`}
          />
          <Demo steps={C2} caseId={2} title="Case 2 — Deactivation → Digital (LED Blink)"
            uFull={`void setup() {\n  UMT.Interface(VR_ADC4).deactivate();           // mirror of activate() — ADC4 OFF, GPIO32 freed, no analog init generated\n  UMT.Digital_Pin(VR_ADC_IN4).setMode(OUTPUT);   // same pin, new role — plain digital I/O, AIA emits pinMode(32, OUTPUT)\n}\nvoid loop() {\n  UMT.Digital_Pin(VR_ADC_IN4).write(HIGH);       // GPIO32 → 3.3 V — LED ON\n  delay(500);\n  UMT.Digital_Pin(VR_ADC_IN4).write(LOW);        // GPIO32 → 0 V — LED OFF\n  delay(500);\n}`}
            gFull={`void setup() {\n  // No analogRead() init generated\n  pinMode(32, OUTPUT);\n}\nvoid loop() {\n  digitalWrite(32, HIGH);\n  delay(500);\n  digitalWrite(32, LOW);\n  delay(500);\n}`}
          />
        </div>}

        {/* ═══ BGA 16×16 (HYBRID v9) ═══ */}
        {tab==="bga"&&<div>
          <div style={{fontSize:11,fontWeight:700,color:K.or,marginBottom:8,direction:isRTL?"rtl":"ltr"}}>🔲 {L.bga_h}</div>
          <div style={{fontSize:9,color:K.mt,marginBottom:10,direction:isRTL?"rtl":"ltr"}}><span dir="ltr">VR_0x[Row][Column] · Rows 0x0–0xF</span> · {L.bga_intro_hover} · <span style={{color:K.yl,fontWeight:700}}>{L.bga_yellow}</span> · <span style={{color:K.rd,fontWeight:700}}>{L.bga_red}</span> · <span style={{color:"#22c55e",fontWeight:700}}>{L.bga_green}</span></div>

          {bgaHover&&<div style={{padding:"8px 14px",background:"#0a0c10",border:`1px solid ${K.or}50`,borderRadius:6,marginBottom:10,fontSize:11,display:"flex",alignItems:"center",gap:12,animation:"si 0.2s",flexWrap:"wrap"}}>
            <span style={{color:K.or,fontWeight:800,fontSize:13}}>VR_0x{bgaHover.row}{bgaHover.col.toString(16).toUpperCase()}</span>
            <span style={{color:K.tx,fontWeight:700}}>→ VR_{bgaHover.name}</span>
            {bgaHover.locked&&<span style={{color:K.yl,fontSize:9,padding:"2px 8px",background:`${K.yl}15`,border:`1px solid ${K.yl}40`,borderRadius:3,fontWeight:700}}>NANOKIT LOCKED</span>}
            {bgaHover.flash&&<span style={{color:K.rd,fontSize:9,padding:"2px 8px",background:`${K.rd}15`,border:`1px solid ${K.rd}40`,borderRadius:3,fontWeight:700}}>⚠ ESP32 FLASH</span>}
            {bgaHover.gpio&&<span style={{color:"#22c55e",fontSize:9,padding:"2px 8px",background:"#22c55e15",border:`1px solid #22c55e40`,borderRadius:3,fontWeight:700}}>VR_GPIO SPECIAL</span>}
            <span style={{color:K.mt,fontSize:9,marginLeft:"auto"}}>Row {bgaHover.row} · Col {bgaHover.col.toString(16).toUpperCase()}</span>
          </div>}

          <div style={{overflowX:"auto",borderRadius:10,border:`1px solid ${K.bd}`,background:"#060708"}}>
            <div style={{display:"grid",gridTemplateColumns:"54px repeat(16, 1fr)",minWidth:1100}}>
              <div style={{padding:"8px 4px",background:"#0a0c10",borderBottom:`2px solid ${K.or}30`,borderRight:`1px solid ${K.bd}`,display:"flex",alignItems:"center",justifyContent:"center",position:"sticky",left:0,zIndex:2}}>
                <span style={{fontSize:8,color:K.mt,fontWeight:700}}>ROW\\COL</span>
              </div>
              {Array.from({length:16},(_,i)=>(
                <div key={i} style={{padding:"8px 2px",background:"#0a0c10",borderBottom:`2px solid ${K.or}30`,borderRight:`1px solid #111`,textAlign:"center"}}>
                  <span style={{fontSize:10,color:K.or,fontWeight:800}}>{i.toString(16).toUpperCase()}</span>
                </div>
              ))}

              {BGA.map((r,ri)=>{
                const rowHex=r.row.slice(2);
                return [
                  <div key={`r${ri}`} style={{padding:"6px 4px",background:`${r.color}18`,borderBottom:`1px solid ${K.bd}`,borderRight:`1px solid ${K.bd}`,display:"flex",alignItems:"center",justifyContent:"center",position:"sticky",left:0,zIndex:2}}>
                    <span style={{fontSize:10,color:r.color,fontWeight:800}}>{r.row}</span>
                  </div>,
                  ...r.names.map((n,ci)=>{
                    const cat=cellCategory(rowHex,ci,n);
                    const isReserved=cat.isReserved;
                    let bg, tc, borderC;
                    if(cat.isLocked){
                      bg=`${K.yl}30`; tc=K.yl; borderC=`${K.yl}50`;
                    } else if(cat.isFlash){
                      bg=`${K.rd}25`; tc=K.rd; borderC=`${K.rd}40`;
                    } else if(cat.isGpio){
                      bg="#22c55e10"; tc="#22c55e"; borderC="#22c55e25";
                    } else if(isReserved){
                      bg="#0a0a0c"; tc="#3a3a3a"; borderC="#151515";
                    } else {
                      bg=`${r.color}0a`; tc=r.color; borderC=`${r.color}15`;
                    }
                    const hovered=bgaHover?.row===rowHex&&bgaHover?.col===ci;
                    return(
                      <div key={`c${ri}-${ci}`}
                        onMouseEnter={()=>setBgaHover({row:rowHex,col:ci,name:n,locked:cat.isLocked,flash:cat.isFlash,gpio:cat.isGpio})}
                        onMouseLeave={()=>setBgaHover(null)}
                        style={{
                          padding:"4px 2px",
                          background:hovered?`${tc}30`:bg,
                          borderBottom:`1px solid ${K.bd}`,
                          borderRight:`1px solid #111`,
                          textAlign:"center",
                          cursor:"pointer",
                          transition:"all 0.15s",
                          display:"flex",alignItems:"center",justifyContent:"center",
                          minHeight:38,
                          outline:hovered?`2px solid ${tc}80`:cat.isLocked?`1px solid ${K.yl}50`:"none",
                          outlineOffset:"-2px",
                          borderRadius:hovered?3:0,
                        }}>
                        <div style={{
                          fontSize:7,
                          color:hovered?"#fff":tc,
                          fontWeight:hovered||cat.isLocked?800:600,
                          lineHeight:1.25,
                          whiteSpace:"pre-line",
                          wordBreak:"break-all",
                          letterSpacing:0,
                        }}>
                          {`VR_\n${n}`}
                        </div>
                      </div>
                    );
                  })
                ];
              })}
            </div>
          </div>

          {/* External Pads */}
          <div style={{marginTop:14,background:K.sf,borderRadius:8,border:`1px solid ${K.bd}`,padding:12}}>
            <div style={{fontSize:11,fontWeight:700,color:K.or,marginBottom:8,direction:isRTL?"rtl":"ltr"}}>📍 {L.bga_extpads}</div>
            <div style={{fontSize:9,color:K.mt,marginBottom:8,lineHeight:1.6}}>4 large exposed pads outside the 16×16 grid provide high-current paths required by SoC-class chips. In-matrix VR_GND (0xD0) and VR_VCC (0xD1) serve as signal-level references only.</div>
            <div className="umt-pads-grid" style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:6}}>
              {PADS.map(p=>(
                <div key={p.id} style={{padding:"8px 10px",background:"#060708",borderRadius:6,border:`1px solid ${p.type==="Ground"?"#4a5060":K.yl+"40"}`,borderLeft:`3px solid ${p.type==="Ground"?"#4a5060":K.yl}`,minWidth:0,boxSizing:"border-box",overflow:"hidden"}}>
                  <div style={{fontSize:11,fontWeight:800,color:p.type==="Ground"?"#9aa0b0":K.yl,marginBottom:3}}>{p.id}</div>
                  <div style={{fontSize:9.5,color:K.tx,fontWeight:700,marginBottom:2,wordBreak:"break-word"}}>{p.vr}</div>
                  <div style={{fontSize:8.5,color:K.mt,lineHeight:1.4}}>{p.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Row summary */}
          <div style={{marginTop:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
            {BGA.map(r=>(
              <div key={r.row} style={{padding:"5px 10px",borderRadius:4,background:K.sf,border:`1px solid ${K.bd}`,display:"flex",gap:8,alignItems:"center"}}>
                <span style={{color:r.color,fontWeight:800,fontSize:10,width:28,flexShrink:0}}>{r.row}</span>
                <span style={{color:"#a8a29e",fontSize:9}}>{r.label}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{marginTop:12,display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:6}}>
            {[
              {l:"Total Balls",v:"256",c:K.or},
              {l:"NanoKit Locked",v:"34",c:K.yl},
              {l:"Interfaces",v:"45",c:K.bl},
              {l:"External Pads",v:"4",c:K.gr},
            ].map(s=>(
              <div key={s.l} style={{padding:"8px 10px",background:K.sf,borderRadius:6,border:`1px solid ${s.c}30`,textAlign:"center"}}>
                <div style={{fontSize:14,fontWeight:800,color:s.c}}>{s.v}</div>
                <div style={{fontSize:8.5,color:K.mt,letterSpacing:1.2,marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>}

        {/* ═══ PACKAGE SUBSTRATE (NEW TAB v7) ═══ */}
        {tab==="substrate"&&<div style={{display:"grid",gap:12}}>
          <div style={{background:`linear-gradient(135deg,${K.sub}15,${K.sf})`,borderRadius:8,border:`2px solid ${K.sub}40`,padding:16}}>
            <div style={{fontSize:14,fontWeight:800,color:K.sub,marginBottom:8,direction:isRTL?"rtl":"ltr"}}>{L.sub_h}</div>
            <div style={{fontSize:10.5,color:"#a8a29e",lineHeight:1.8,marginBottom:10,direction:isRTL?"rtl":"ltr"}}>{L.sub_intro}</div>
            <div style={{padding:"10px 14px",background:"#060708",borderRadius:6,border:`1px solid ${K.sub}30`,borderLeft:`4px solid ${K.sub}`,fontSize:10.5,color:"#d4a574",lineHeight:1.7,fontStyle:"italic",direction:isRTL?"rtl":"ltr",textAlign:isRTL?"right":"left"}}>
              {L.sub_quote}
            </div>
          </div>

          <div style={{background:K.sf,borderRadius:8,border:`1px solid ${K.bd}`,padding:14}}>
            <div style={{fontSize:11,fontWeight:700,color:K.or,marginBottom:10,direction:isRTL?"rtl":"ltr"}}>🔧 {L.sub_8func}</div>
            <div className="umt-2col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {SUBSTRATE_FUNCS_ICONS.map((icon,i)=>(
                <div key={i} style={{padding:"10px 12px",background:"#060708",borderRadius:6,border:`1px solid ${K.bd}`,borderLeft:`3px solid ${K.or}80`,minWidth:0,boxSizing:"border-box",overflow:"hidden"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,direction:isRTL?"rtl":"ltr"}}>
                    <span style={{fontSize:14,flexShrink:0}}>{icon}</span>
                    <span style={{fontSize:10.5,fontWeight:700,color:K.or,wordBreak:"break-word"}}>{(L.sf_titles||SUBSTRATE_FUNCS.map(f=>f.title))[i]}</span>
                  </div>
                  <div style={{fontSize:9,color:"#a8a29e",lineHeight:1.6,direction:isRTL?"rtl":"ltr",textAlign:isRTL?"right":"left",wordBreak:"break-word"}}>{(L.sf_descs||SUBSTRATE_FUNCS.map(f=>f.desc))[i]}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{background:K.sf,borderRadius:8,border:`1px solid ${K.bl}30`,padding:14}}>
            <div style={{fontSize:11,fontWeight:700,color:K.bl,marginBottom:10,direction:isRTL?"rtl":"ltr"}}>🚀 {L.ms_title}</div>
            <div style={{fontSize:10,color:"#a8a29e",lineHeight:1.7,marginBottom:10,direction:isRTL?"rtl":"ltr"}}>{L.ms_desc}</div>
            <div style={{padding:"12px 14px",background:"#060708",borderRadius:6,border:`1px solid ${K.bl}30`,fontSize:10,color:"#a8a29e",lineHeight:1.7,direction:isRTL?"rtl":"ltr"}}>
              <div style={{color:K.or,fontWeight:700,marginBottom:6}}>{L.ms_how}</div>
              <div>• {L.ms_b1}</div>
              <div>• {L.ms_b2}</div>
              <div style={{color:K.gr,fontWeight:700,marginTop:6}}>• {L.ms_b3}</div>
            </div>
          </div>

          <div style={{background:K.sf,borderRadius:8,border:`1px solid ${K.bd}`,padding:14}}>
            <div style={{fontSize:11,fontWeight:700,color:K.pu,marginBottom:10,direction:isRTL?"rtl":"ltr"}}>🔮 {L.ft_title}</div>
            {FUTURE_TECH.map((t,i)=>(
              <div key={i} style={{padding:"10px 12px",marginBottom:6,background:"#060708",borderRadius:6,border:`1px solid ${t.color}30`,borderLeft:`3px solid ${t.color}`}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:11,fontWeight:700,color:t.color}}>{t.name}</span>
                  <span style={{fontSize:8.5,padding:"2px 8px",background:`${t.color}15`,border:`1px solid ${t.color}40`,borderRadius:3,color:t.color,fontWeight:700}}>{t.status}</span>
                </div>
                <div style={{fontSize:9,color:"#a8a29e",lineHeight:1.6}}>{t.desc}</div>
              </div>
            ))}
          </div>

          <div style={{background:`linear-gradient(135deg,${K.pu}15,${K.sf})`,borderRadius:8,border:`1px solid ${K.pu}30`,padding:14}}>
            <div style={{fontSize:11,fontWeight:700,color:K.pu,marginBottom:8,direction:isRTL?"rtl":"ltr"}}>⚛️ {L.qb_title}</div>
            <div style={{fontSize:10,color:"#a8a29e",lineHeight:1.7,marginBottom:8,direction:isRTL?"rtl":"ltr"}}>{L.qb_desc}</div>
            <div style={{padding:"10px 12px",background:"#060708",borderRadius:6,border:`1px solid ${K.pu}25`,fontSize:9.5,color:"#a8a29e",lineHeight:1.7,fontStyle:"italic",direction:isRTL?"rtl":"ltr",textAlign:isRTL?"right":"left"}}>
              {L.sub_ai_quote}
            </div>
          </div>

          <div style={{background:K.sf,borderRadius:8,border:`1px solid ${K.gr}30`,padding:14}}>
            <div style={{fontSize:11,fontWeight:700,color:K.gr,marginBottom:8,direction:isRTL?"rtl":"ltr"}}>💡 {L.why_title}</div>
            <div style={{fontSize:10,color:"#a8a29e",lineHeight:1.8,direction:isRTL?"rtl":"ltr"}}>
              {L.why_p1}
              <br/><br/>
              {L.why_p2}
            </div>
          </div>
        </div>}

        {/* ═══ PROMPT ═══ */}
        {tab==="prompt"&&<div>
          <div style={{fontSize:13,fontWeight:700,color:K.or,marginBottom:10,direction:isRTL?"rtl":"ltr"}}>{L.prompt_h}</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:8}}>
            <div style={{fontSize:10,color:K.mt,direction:isRTL?"rtl":"ltr"}}>{L.prompt_sub}</div>
            <button onClick={copy} style={{padding:"7px 18px",fontSize:11,borderRadius:6,cursor:"pointer",fontFamily:fn,fontWeight:700,border:"none",background:copied?K.gr:K.or,color:"#fff",transition:"background 0.2s",flexShrink:0}}>
              {copied?L.prompt_copied:`📋 ${L.prompt_copy}`}
            </button>
          </div>
          <div style={{position:"relative"}}>
            <div style={{position:"absolute",top:6,right:8,fontSize:9,color:K.mt,background:K.sf,padding:"2px 6px",borderRadius:3,zIndex:1}}>{PROMPT.length.toLocaleString()} chars</div>
            <pre style={{background:K.sf,border:`1px solid ${K.bd}`,borderRadius:8,padding:14,fontSize:9,color:"#a8a29e",lineHeight:1.7,whiteSpace:"pre-wrap",maxHeight:500,overflowY:"auto",fontFamily:fn}}>{PROMPT}</pre>
          </div>
        </div>}

        {/* ═══ HARDWARE ═══ */}
        {tab==="hw"&&<div style={{display:"grid",gap:10}}>
          <div style={{fontSize:13,fontWeight:700,color:K.or,marginBottom:6,direction:isRTL?"rtl":"ltr"}}>{L.hw_h}</div>
          <div style={{background:K.sf,borderRadius:8,border:`1px solid ${K.bd}`,padding:14}}>
            <div style={{fontSize:11,fontWeight:700,color:K.gr,marginBottom:8,direction:isRTL?"rtl":"ltr"}}>{L.hw_targets_title}</div>
            {[{k:"A",n:L.hw_target_a_name,vr:L.hw_virtual,ex:L.hw_target_a_ex,c:K.gr},
              {k:"B",n:L.hw_target_b_name,vr:L.hw_physical,ex:"Espressif, STM, NXP, Texas Instruments, Broadcom, NVIDIA, Qualcomm Snapdragon, Apple, Samsung, HiSilicon Kirin (Huawei)",c:K.bl},
              {k:"C",n:L.hw_target_c_name,vr:L.hw_physical,ex:L.hw_target_c_ex,c:K.pu}].map(t=>
              <div key={t.k} style={{background:"#060708",borderRadius:6,padding:10,marginBottom:5,border:`1px solid ${K.bd}`,borderLeft:`3px solid ${t.c}`}}>
                <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}><Bg c={t.c}>TARGET {t.k}</Bg><span style={{fontSize:10.5,fontWeight:700}}>{t.n}</span><Bg c={t.vr===L.hw_physical?K.rd:K.yl}>{t.vr}</Bg></div>
                <div style={{fontSize:9,color:"#a8a29e",marginTop:4,direction:isRTL?"rtl":"ltr"}}>{t.ex}</div>
              </div>
            )}
          </div>
          <div style={{background:K.sf,borderRadius:8,border:`1px solid ${K.yl}25`,padding:14}}>
            <div style={{fontSize:11,fontWeight:700,color:K.yl,marginBottom:8,direction:isRTL?"rtl":"ltr"}}>{L.hw_locked_title}</div>
            <div style={{fontSize:9.5,color:"#a8a29e",lineHeight:1.7,marginBottom:8,direction:isRTL?"rtl":"ltr"}}>{L.hw_locked_desc}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:4,fontSize:9}}>
              {[
                ["UART","TX0=0x01, RX0=0x00, TX2=0x05, RX2=0x04"],
                ["SPI ×2","MOSI/MISO/SCLK/CS = 0x10-0x17"],
                ["I2C0","SDA=0x30, SCL=0x31"],
                ["BOOT","0x38 (must be HIGH at boot)"],
                ["ADC v8","IN0=0x50, IN3=0x53, IN4=0x54, IN6=0x56"],
                ["DAC","OUT1=0x71"],
                ["GPIO00-10","0x80-0x8A (GPIO04-09 = flash)"],
                ["PWM","OUT0=0xC0 (built-in LED)"],
                ["GND v9","0xD0 (NanoKit pins 12 & 31)"],
                ["RST","0xFF"],
              ].map(([k,v],i)=>(
                <div key={i} style={{padding:"4px 8px",background:"#060708",borderRadius:4,border:`1px solid ${K.bd}`}}>
                  <span style={{color:K.yl,fontWeight:700}}>{k}:</span> <span style={{color:"#a8a29e"}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:K.sf,borderRadius:8,border:`1px solid ${K.rd}22`,padding:14}}>
            <div style={{fontSize:11,fontWeight:700,color:K.rd,marginBottom:8,direction:isRTL?"rtl":"ltr"}}>{L.hw_restrict_title}</div>
            {[{r:L.hw_r1,s:"HARD"},{r:L.hw_r2,s:"WARN"},{r:L.hw_r3,s:"WARN"},{r:L.hw_r4,s:"INFO"}].map((x,i)=>
              <div key={i} style={{fontSize:10,color:"#a8a29e",marginBottom:4,display:"flex",gap:6,alignItems:"center",direction:isRTL?"rtl":"ltr"}}><Bg c={x.s==="HARD"?K.rd:x.s==="WARN"?K.yl:K.bl}>{x.s}</Bg><span>{x.r}</span></div>
            )}
          </div>
          <div style={{background:K.sf,borderRadius:8,border:`1px solid ${K.bd}`,padding:14}}>
            <div style={{fontSize:11,fontWeight:700,color:K.pu,marginBottom:6,direction:isRTL?"rtl":"ltr"}}>{L.project_label}</div>
            <div style={{fontSize:10,color:"#a8a29e",lineHeight:1.6}}>© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe</div>
          </div>
        </div>}

        <div style={{marginTop:16,padding:10,background:K.sf,borderRadius:8,border:`1px solid ${K.bd}`,fontSize:8.5,color:"#78716c",textAlign:"center",lineHeight:1.7}}>
          © Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
        </div>
      </div>
    </div>);
}
