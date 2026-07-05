# Applications (`apps/`)

End-user applications built on `core/`.

- `ide/` — the Pro_AmineUMT IDE, a Visual Studio Code extension.
- `cli/` — the `umt` command-line interface.
- `simulator/` — the visual block simulator (Node-RED style canvas).
- `dashboard/` — the web dashboard for IoT / HMI integrations.

Every application depends on `core/aia-engine`, `core/kernel`, and
`core/source-map`. Applications never call into MCU-specific SDKs
directly; that path is reserved for the AIA Engine.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
