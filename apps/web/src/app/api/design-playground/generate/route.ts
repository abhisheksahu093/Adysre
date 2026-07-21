import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { AI_SECTION_SCHEMA, type AiSection } from '@/lib/design-playground/ai-template';

/**
 * Design Playground - generate a section from a prompt.
 *
 * Server-side because the model key must never reach the browser (PRD §7.10).
 * The response is a DESIGN, not code: structured JSON matching
 * `AI_SECTION_SCHEMA`, which the client re-validates before it becomes nodes -
 * so a bad or hostile generation can only produce a dull section, never an
 * instruction the editor obeys.
 *
 * Every generation is undoable, because the client turns it into the same
 * insert command a manual placement uses.
 */

/** The model's brief. It designs; it never returns prose or code. */
const SYSTEM_PROMPT = `You design website sections as structured layout data.

Return a single section: a frame with absolutely-positioned children (rectangles, ellipses and text).

Rules:
- Compose real, specific copy for text elements - never placeholder like "Lorem ipsum" or "Your headline here".
- Lay elements out on a sensible grid with generous whitespace. Nothing may overflow the section bounds.
- Children are positioned relative to the section's top-left corner.
- Use a coherent palette: a background, one accent, and readable text colours. Contrast must pass WCAG AA.
- Headlines are text with fontWeight 700 and a larger fontSize; body copy is 400.
- Buttons are a rectangle with a radius plus a separate text element centred on it.
- A typical desktop section is 1440 wide and 400-800 tall.`;

const MAX_PROMPT_LENGTH = 600;

export async function POST(request: Request): Promise<NextResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // A missing key is a deployment state, not a bug: the panel shows how to
    // configure it rather than failing like an outage.
    return NextResponse.json({ error: 'not-configured' }, { status: 503 });
  }

  let prompt: unknown;
  try {
    prompt = ((await request.json()) as { prompt?: unknown }).prompt;
  } catch {
    return NextResponse.json({ error: 'invalid-request' }, { status: 400 });
  }

  if (typeof prompt !== 'string' || prompt.trim().length === 0) {
    return NextResponse.json({ error: 'invalid-request' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      // Layout is a judgement call, not a hard reasoning problem; medium keeps
      // generation responsive enough to iterate on.
      output_config: {
        effort: 'medium',
        format: { type: 'json_schema', schema: AI_SECTION_SCHEMA },
      },
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt.slice(0, MAX_PROMPT_LENGTH) }],
    });

    if (response.stop_reason === 'refusal') {
      return NextResponse.json({ error: 'refused' }, { status: 422 });
    }

    const block = response.content.find((entry) => entry.type === 'text');
    if (!block || block.type !== 'text') {
      return NextResponse.json({ error: 'empty' }, { status: 502 });
    }

    // Structured outputs guarantee the shape; the client still re-validates and
    // clamps every value before anything reaches the document.
    const section = JSON.parse(block.text) as AiSection;
    return NextResponse.json({ section });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: 'rate-limited' }, { status: 429 });
    }
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: 'not-configured' }, { status: 503 });
    }
    // Anything else is ours to own, and must not leak provider internals.
    return NextResponse.json({ error: 'failed' }, { status: 502 });
  }
}
