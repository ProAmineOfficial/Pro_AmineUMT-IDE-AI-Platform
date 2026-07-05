/**
 * Pipeline step: 01-parse-intent
 *
 * Parses the .umt source and extracts VR API calls with their intent (interface, method, mode).
 *
 * Normative reference: Standard S-003 (AIA Engine Protocol).
 * See docs/architecture/aia-engine.md for the full pipeline description.
 */

export interface StepInput {}
export interface StepOutput {}

export async function run(_input: StepInput): Promise<StepOutput> {
  throw new Error("01-parse-intent is not yet implemented");
}
