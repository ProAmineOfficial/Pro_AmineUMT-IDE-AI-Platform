# Standard S-009 — Toolchain Integration

- **Status**: Draft (v1.0)
- **Derived from**: ADR-0001
- **Editors**: Amine Saoud ibn al-Bashir (Pro_Amine LLC)

## Scope

Defines how the AIA Engine invokes underlying toolchains (arduino-cli, xtensa-esp32-elf-gcc, arm-none-eabi-gcc, rp2040-pico-sdk) and how they are installed under `~/.umt/`.

## Terminology

The key words MUST, MUST NOT, SHOULD, SHOULD NOT, MAY, and OPTIONAL in this
document are to be interpreted as described in RFC 2119 and RFC 8174.

## Normative content

The normative text of this standard is under active drafting. The final
version will be published as an immutable, versioned document. Until then,
implementations MUST track the current draft and update against every
merged pull request that modifies this directory.

## Conformance

An implementation conforms to Standard S-009 if and only if:
1. It implements the normative content in its entirety.
2. It passes every test vector in `test-vectors/`.
3. It matches every schema in `schema/`.

## Errata

Errata against this standard are tracked as GitHub issues with the labels
`errata` and `s-009`. Errata that require a normative change trigger
a new revision (v1.1, v1.2, ...) via a Standards RFC.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
