# Ten Normative Standards

This directory contains the ten normative standards that define the
Pro_AmineUMT IDE with AI Platform. Every standard is versioned; every
revision requires a Standards RFC issue and a founder decision (see the
Standards RFC template in `.github/ISSUE_TEMPLATE/`).

## Index

| ID     | Title                            | Derived from    | Version |
|--------|----------------------------------|-----------------|---------|
| S-001  | UMT VR API Naming                | ADR-0005        | 1.0     |
| S-002  | BGA 16×16 Package Substrate      | ADR-0006        | 1.0     |
| S-003  | AIA Engine Protocol              | ADR-0003        | 1.0     |
| S-004  | Pure VR Source Contract          | ADR-0003        | 1.0     |
| S-005  | Debug at Source Contract         | ADR-0004        | 1.0     |
| S-006  | Board Profile Format             | ADR-0001        | 1.0     |
| S-007  | Genius Guides Format             | ADR-0001        | 1.0     |
| S-008  | UMT SDK Interface                | ADR-0005        | 1.0     |
| S-009  | Toolchain Integration            | ADR-0001        | 1.0     |
| S-010  | Simulation Contract              | ADR-0001        | 1.0     |


## Structure

Every standard has its own subdirectory containing:
- `README.md` — the standard text, in the form of an RFC.
- `schema/` — machine-readable schemas (JSON Schema, Protobuf, etc.).
- `examples/` — canonical examples.
- `test-vectors/` — conformance test vectors.

## Conformance

A conforming implementation of a standard must pass all test vectors in
that standard's `test-vectors/` directory. Conformance is verified in CI
before every release.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
