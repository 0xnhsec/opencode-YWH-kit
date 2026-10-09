/**
 * opencode-YWH-kit — mandatory enforcement plugin.
 *
 * Loaded automatically from `.opencode/plugins/` at startup (project
 * scope). Copy it to `~/.config/opencode/plugins/` for global scope.
 *
 * It injects the YWH mandatory directive into the system prompt so the
 * `ywh-bughunt` orchestrator is loaded on every YesWeHack session even
 * if the model skips AGENTS.md. AGENTS.md remains the source of truth;
 * this plugin is a backstop, not a replacement.
 *
 * Type-only import: erased at runtime, no dependency to install.
 */
import type { Plugin } from "@opencode-ai/plugin";

const YWH_MANDATORY_DIRECTIVE = [
  "<ywh-mandatory>",
  "You have the opencode-YWH-kit available. Whenever the task touches",
  "YesWeHack / bug bounty hunting (recon, investigating a finding,",
  "drafting or triaging a report, program scope):",
  '1. Call skill({ name: "ywh-bughunt" }) FIRST, before any other work.',
  "2. Follow its routing table for the whole session:",
  "   investigate in ywh-bughunt, draft via ywh-write,",
  "   finalize via ywh-triage (+ ywh-gotchas for the claimed class).",
  "3. Never improvise those skills' checks from memory — load them.",
  "</ywh-mandatory>",
].join("\n");

export const YwhMandatory: Plugin = async () => {
  return {
    "experimental.chat.system.transform": async (_input: unknown, output: any) => {
      try {
        if (output && Array.isArray(output.system)) {
          output.system.push(YWH_MANDATORY_DIRECTIVE);
        }
      } catch {
        // Older runtime without system.transform — AGENTS.md still enforces.
      }
    },
  };
};

export default YwhMandatory;
