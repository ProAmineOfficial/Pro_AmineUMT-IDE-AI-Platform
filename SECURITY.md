# Security Policy

## Supported Versions

The Pro_AmineUMT IDE with AI Platform is currently in alpha. Security fixes
are applied to the `main` branch and the most recent minor release only.

| Version    | Supported |
|------------|-----------|
| 0.1.x      | Yes       |
| < 0.1.0    | No        |

## Reporting a Vulnerability

Please report security vulnerabilities privately by email to:

**security@pro-amine.com**

Do **not** open a public GitHub issue for security-sensitive reports.

Include:
1. A description of the vulnerability and its impact.
2. Steps to reproduce, including affected version, target board, and MCU.
3. Any proof-of-concept code or firmware images (as attachments, not inline).
4. Your contact information and whether you wish to be credited in the CVE.

## Response Timeline

- **Acknowledgement** — within 3 business days.
- **Triage and severity classification** — within 10 business days.
- **Fix or mitigation** — target 30 days for high-severity, 90 days for medium.
- **Disclosure** — coordinated with reporter; public advisory after fix ships.

## Scope

In scope:
- The core/, apps/, packages/, boards/, and standards/ directories.
- AIA Engine code-generation paths that produce or consume untrusted input.
- Any tool that flashes firmware to a target board.

Out of scope:
- Vulnerabilities in third-party toolchains (report upstream).
- Denial-of-service by resource exhaustion in local development tools.
- Social-engineering attacks against maintainers.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
