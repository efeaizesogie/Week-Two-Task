import type { Prompt } from './registry';

export interface RetrievedChunk {
  id: string;
  documentId: string;
  page?: number | null;
  content: string;
}

export interface DraftAnswerVars {
  question: string;
  chunks: RetrievedChunk[];
  instructions?: string;
}

/**
 * RAG draft. The model MUST only use provided chunks and MUST cite chunk IDs.
 * If it has no evidence, it says so and returns confidence <= 0.3.
 */
export const draftAnswerPrompt: Prompt<DraftAnswerVars> = {
  name: 'draft-answer',
  version: '2026-05-11.1',
  temperature: 0.2,
  render: ({ question, chunks, instructions }) => {
    const context = chunks
      .map(
        (c, i) =>
          `[CHUNK ${i + 1}] id=${c.id} document=${c.documentId}${
            c.page ? ` page=${c.page}` : ''
          }\n${c.content}`,
      )
      .join('\n\n---\n\n');

    return [
      {
        role: 'system',
        content: [
          'You are RFPilot, drafting an answer to a question in a customer RFP.',
          'Use ONLY information present in the provided CHUNKS. Do not invent facts.',
          'If the chunks do not contain sufficient information, say so explicitly and return low confidence.',
          'Cite the chunks you used by their id.',
          'Keep the tone professional and concise (1–4 short paragraphs or a short list).',
          'Return STRICT JSON matching:',
          '{ "answer": string, "confidence": number (0..1), "citedChunkIds": string[] }',
          instructions
            ? `User instructions (follow when compatible with the above): ${instructions}`
            : '',
        ]
          .filter(Boolean)
          .join(' '),
      },
      {
        role: 'user',
        content: `QUESTION:\n${question}\n\nCHUNKS:\n${context || '(none)'}`,
      },
    ];
  },
};
