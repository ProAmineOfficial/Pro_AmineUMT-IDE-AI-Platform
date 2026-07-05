# Installation

## Prerequisites

- A recent 64-bit operating system: Ubuntu 22.04+, macOS 12+, Windows 10+.
- Visual Studio Code 1.85 or later.
- At least 2 GB of free disk space (toolchains + SDK).
- A supported target board (see `boards/`).

## Install the IDE

The Pro_AmineUMT IDE ships as a Visual Studio Code extension.

1. Open Visual Studio Code.
2. Open the Extensions view (`Ctrl+Shift+X` on Linux/Windows, `Cmd+Shift+X` on macOS).
3. Search for "Pro_AmineUMT IDE with AI".
4. Click Install.

On first launch, the extension will download and install the UMT SDK to
`~/.umt/sdk/`, and per-target toolchains to `~/.umt/toolchains/`.

## Verify installation

Open a terminal in Visual Studio Code and run:

```sh
umt --version
```

You should see the current SDK version, matching the `VERSION` file in this
repository.

## Next

Continue to `first-project.md`.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
