/**
 * RAG helpers: pure functions kept framework-free so they can be unit tested.
 * The actual DB query (`pgvector <=> $1::vector`) lives in the API's
 * KnowledgeService, since Prisma does not model vector operators.
 */

/** Cosine similarity between two equal-length vectors. */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) throw new Error('Vector length mismatch');
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    const ai = a[i] ?? 0;
    const bi = b[i] ?? 0;
    dot += ai * bi;
    na += ai * ai;
    nb += bi * bi;
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Split text into ~maxTokens chunks, approximating tokens as words * 1.3.
 * Uses paragraph boundaries where possible to keep chunks semantically whole.
 */
export function chunkText(input: string, maxTokens = 500, overlapTokens = 50): string[] {
  const wordsPerChunk = Math.floor(maxTokens / 1.3);
  const overlapWords = Math.floor(overlapTokens / 1.3);
  const paragraphs = input.split(/\n{2,}/);

  const chunks: string[] = [];
  let buf: string[] = [];
  let bufWordCount = 0;

  const flush = () => {
    if (buf.length === 0) return;
    chunks.push(buf.join('\n\n').trim());
    buf = [];
    bufWordCount = 0;
  };

  for (const para of paragraphs) {
    const words = para.split(/\s+/).filter(Boolean);
    if (bufWordCount + words.length > wordsPerChunk && buf.length) {
      flush();
      // Carry overlap from the end of the previous chunk
      const prev = chunks[chunks.length - 1]?.split(/\s+/) ?? [];
      const carry = prev.slice(Math.max(0, prev.length - overlapWords)).join(' ');
      if (carry) {
        buf.push(carry);
        bufWordCount += overlapWords;
      }
    }
    buf.push(para);
    bufWordCount += words.length;
  }
  flush();
  return chunks.filter((c) => c.length > 0);
}
