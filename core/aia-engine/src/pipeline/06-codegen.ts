/**
 * Pipeline step: 06-codegen
 *
 * Emits the platform-specific C++ into .umt/generated/main_generated.cpp and the source map into .umt/cache/aia_map.json.
 *
 * Normative reference: Standard S-003 (AIA Engine Protocol).
 * See docs/architecture/aia-engine.md for the full pipeline description.
 */

export interface StepInput {}
export interface StepOutput {}

export async function run(_input: StepInput): Promise<StepOutput> {
  throw new Error("06-codegen is not yet implemented");
}
