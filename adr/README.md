# Architecture Decision Records

This directory contains the Architecture Decision Records (ADRs) for the
Pro_AmineUMT IDE with AI Platform.

An ADR captures a significant architectural decision, the context that led
to it, and the consequences of adopting it. ADRs are immutable once
accepted — a later ADR may supersede an earlier one, but the earlier one
is preserved for historical record.

## Index

| ID       | Title                                                                | Status   |
|----------|----------------------------------------------------------------------|----------|
| 0001     | Repository Architecture v3.1                                         | Accepted |
| 0002     | Apache-2.0 License Selection                                         | Accepted |
| 0003     | Foundational Decision #1 — Pure VR Source / Hidden Native Backend    | Accepted |
| 0004     | Foundational Decision #2 — Debug at Source, Run at Native            | Accepted |
| 0005     | UMT VR API Naming Rule                                               | Accepted |
| 0006     | UMT BGA 16×16 Package Substrate Standard                             | Accepted |

## Format

Every ADR follows the template in `TEMPLATE.md`, adapted from Michael Nygard's
"Documenting Architecture Decisions" (2011) with a UMT-specific "Locked
implications" section.

## Process

1. Author drafts an ADR in a topic branch, using the next available number.
2. Pull request opened with the label `adr`.
3. 14-day public comment period.
4. Founder decision. Status set to Accepted, Rejected, or Superseded.
5. Once accepted, the ADR text is immutable. Related normative documents
   (standards, README files, code) are updated in the same or a follow-up PR.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
