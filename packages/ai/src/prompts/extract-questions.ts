import type { Prompt } from './registry';

/**
 * Extracts a flat list of questions from an RFP document's concatenated text.
 * The model returns JSON; we validate it in the caller before persistence.
 */
export const extractQuestionsPrompt: Prompt<{ rfpText: string }> = {
  name: 'extract-questions',
  version: '2026-05-11.1',
  temperature: 0,
  render: ({ rfpText }) => [
    {
      role: 'system',
      content: [
        'You are RFPilot, an assistant that parses RFP / RFI / security-questionnaire documents.',
        'Extract every question or required statement the vendor must answer.',
        'Do NOT invent questions. Do NOT include instructions, table-of-contents entries, or cover letters.',
        'Group by section when the document provides one (e.g. "Security", "Pricing"); omit if absent.',
        'Return STRICT JSON matching:',
        '{ "questions": [{ "ordinal": number, "section": string | null, "text": string }] }',
        'Ordinals are 1-indexed across the whole document.',
      ].join(' '),
    },
    {
      role: 'user',
      content: `RFP TEXT:\n<<<\n${rfpText}\n>>>`,
    },
  ],
};
