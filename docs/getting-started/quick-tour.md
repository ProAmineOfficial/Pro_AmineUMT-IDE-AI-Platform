# Quick Tour of the IDE

Five minutes to learn the essential surfaces of the Pro_AmineUMT IDE.

## The editor

Standard Visual Studio Code with `.umt` syntax highlighting. The UMT VR API
identifiers (`VR_ADC4`, `VR_UART0`, ...) are colored in cyan; the `UMT.`
namespace in yellow; comments in green italic.

## The Genius Guides panel

Open the "Genius Guides" tab in the sidebar. Every time you save your
`.umt` file, ten educational artifacts are auto-generated into
`.umt/Genius Guides/.CmdGenius/`:

1. Hardware Wiring.
2. Algorithm.
3. Flowchart.
4. Pseudocode.
5. Algorithm and System Architecture Diagram.
6. Connect App IoT / AdvancedHMI / Flutter Guide.
7. API Reference.
8. Testing Guide.
9. Performance Report.
10. Debug Guide.

## The Simulator

Open the Simulator tab. It renders the target board with all pins visible
and the components you have connected in code shown as attached blocks —
similar in style to Node-RED.

## AI Bashir

Open the AI Bashir sidebar (bottom-left). You can ask questions in natural
language about your code, the UMT VR API, or embedded systems in general.
AI Bashir is aware of the current project and can suggest changes.

## Debug at Source

Set a breakpoint in your `.umt` file. Click "Debug". Execution halts at the
`.umt` line. Variables are shown with VR names (`VR_ADC_IN4.value = 2048`),
never at framework level.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
