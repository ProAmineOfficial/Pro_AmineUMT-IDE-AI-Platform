/**
 * Pipeline step: 03-symbolic-match
 *
 * Decomposes each VR name into semantic tokens and matches it against the pin-capability table.
 *
 * Normative reference: Standard S-003 (AIA Engine Protocol).
 * See docs/architecture/aia-engine.md for the full pipeline description.
 */

export interface StepInput {}
export interface StepOutput {}

export async function run(_input: StepInput): Promise<StepOutput> {
  throw new Error("03-symbolic-match is not yet implemented");
}
