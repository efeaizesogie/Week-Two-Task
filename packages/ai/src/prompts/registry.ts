/**
 * Prompt registry: every LLM call goes through a named, versioned Prompt.
 * Versioning is critical so we can (a) correlate outputs to the prompt that
 * produced them, (b) A/B prompts, and (c) roll back bad changes.
 */

import type { ChatMessage } from '../openai';

export interface Prompt<V> {
  /** Stable short name, e.g. "draft-answer". */
  name: string;
  /** Date-based version, e.g. "2026-05-11.1". Bump on any change. */
  version: string;
  /** Default model temperature. */
  temperature: number;
  /** Render the prompt from typed variables. */
  render: (vars: V) => ChatMessage[];
}

export function promptId(p: Prompt<unknown>): string {
  return `${p.name}@${p.version}`;
}
