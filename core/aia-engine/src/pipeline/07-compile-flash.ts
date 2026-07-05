/**
 * Pipeline step: 07-compile-flash
 *
 * Invokes the toolchain, produces firmware artifacts, and flashes to the target.
 *
 * Normative reference: Standard S-003 (AIA Engine Protocol).
 * See docs/architecture/aia-engine.md for the full pipeline description.
 */

export interface StepInput {}
export interface StepOutput {}

export async function run(_input: StepInput): Promise<StepOutput> {
  throw new Error("07-compile-flash is not yet implemented");
}
