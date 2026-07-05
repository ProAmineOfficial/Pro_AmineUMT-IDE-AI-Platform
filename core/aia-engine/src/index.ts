/**
 * AIA Engine — public entry point.
 *
 * Orchestrates the seven-step pipeline for a single build.
 */

export { run as parseIntent }     from "./pipeline/01-parse-intent.js";
export { run as pinScan }         from "./pipeline/02-pin-scan.js";
export { run as symbolicMatch }   from "./pipeline/03-symbolic-match.js";
export { run as functionalClone } from "./pipeline/04-functional-clone.js";
export { run as conflictCheck }   from "./pipeline/05-conflict-check.js";
export { run as codegen }         from "./pipeline/06-codegen.js";
export { run as compileFlash }    from "./pipeline/07-compile-flash.js";
