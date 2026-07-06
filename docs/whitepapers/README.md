# Whitepapers

External-facing, standalone technical papers that formalize the foundational
architectural decisions of the Pro_AmineUMT IDE with AI Platform. Each
whitepaper stands on its own — a reader who has never seen the repository
can follow the argument end-to-end from the paper alone.

## What qualifies as a whitepaper

- A single, self-contained document (not a chapter of a larger manual).
- Publishable outside the repository — investor briefings, academic
  citations, chipmaker technical review, standards-body submissions.
- Ships in **both formats** side-by-side: Markdown for GitHub rendering
  and diff-friendly review; PDF for offline distribution and citation.
- Ordinary developer reference material lives in `docs/architecture/` or
  `docs/guides/`, not here.

## Current whitepapers

### Foundational Decision #1 — Pure VR Source / Hidden Native Backend

- Markdown: [`Pro_AmineUMT_Architecture_v4_Supplement_PureVR.md`](Pro_AmineUMT_Architecture_v4_Supplement_PureVR.md)
- PDF: [`Pro_AmineUMT_Architecture_v4_Supplement_PureVR.pdf`](Pro_AmineUMT_Architecture_v4_Supplement_PureVR.pdf)

Establishes the strict source-target separation of the platform. The
developer writes only `.umt` VR API. The Abstraction Intelligence
Algorithm Engine generates the platform-specific C++ invisibly into
`.umt/generated/main_generated.cpp`, which is never edited, never read,
never touched. Draws parallels to TypeScript → JavaScript, Kotlin → JVM
bytecode, Dart → native ARM/x86, and CUDA → PTX.

### Foundational Decision #2 — Debug at Source, Run at Native

- Markdown: [`Pro_AmineUMT_Architecture_v4_Supplement_DebugAtSource.md`](Pro_AmineUMT_Architecture_v4_Supplement_DebugAtSource.md)
- PDF: [`Pro_AmineUMT_Architecture_v4_Supplement_DebugAtSource.pdf`](Pro_AmineUMT_Architecture_v4_Supplement_DebugAtSource.pdf)

Formalizes that all debugging operates at the `.umt` source level, never
at the generated C++ level. Specifies the `aia_map.json` source map as
the enabling mechanism. Preserves the Pure VR Source contract during the
debug lifecycle — the abstraction never breaks.

## Reading order

Read Pure VR Source first, then Debug at Source. The second paper builds
on the guarantees established in the first.

## Related normative material

- **Architecture Decision Records** — `adr/0003` and `adr/0004` capture
  the same decisions in ADR form, with locked implications and
  alternatives-considered sections.
- **Standards** — `standards/s-004-pure-vr-source-contract/` and
  `standards/s-005-debug-at-source-contract/` provide the normative
  conformance requirements for implementations.

Whitepapers explain **why**; ADRs record **what and when**; standards
define **how conforming implementations must behave**.

## Citation

To cite in academic or industry publications, use the PDF version and
reference the document title, author, and publication date exactly as
they appear on the paper's title page.

## Contributing new whitepapers

Whitepapers are additive. New papers require:
1. Author submits a draft as a pull request.
2. 14-day public review period.
3. Founder approval.
4. Once merged, the paper is versioned and its filename is immutable —
   subsequent revisions bump the version suffix.

See `CONTRIBUTING.md` at the repository root.

---

© Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir · Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025 — Rising Star in Microchip Technology Solutions in Europe
