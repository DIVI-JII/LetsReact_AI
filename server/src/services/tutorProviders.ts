import { config } from '../config.js';
import { log } from '../lib/logger.js';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const GEMINI_TIMEOUT_MS = 25_000;
const NVIDIA_TIMEOUT_MS = 12_000;
/** Pulls the first {...} block out of a model reply, tolerating code fences and stray prose. */
export function extractJson(text: string): unknown {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) throw new Error('no JSON in model reply');
  return JSON.parse(text.slice(start, end + 1));
}

/** First 200 chars of a provider's error body, so the log says why (retired model, bad key, ...). */
async function errorDetail(res: Response): Promise<string> {
  try {
    return (await res.text()).replace(/\s+/g, ' ').slice(0, 200);
  } catch {
    return '';
  }
}

async function callNvidia(system: string, messages: ChatMessage[]): Promise<string> {
  const res = await fetch(`${config.NVIDIA_BASE_URL.replace(/\/+$/, '')}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.NVIDIA_API_KEY}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      model: config.NVIDIA_MODEL,
      messages: [{ role: 'system', content: system }, ...messages],
      temperature: 0.3,
      top_p: 0.9,
      max_tokens: 900,
      stream: false,
    }),
    signal: AbortSignal.timeout(NVIDIA_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`nvidia http ${res.status} (model ${config.NVIDIA_MODEL}): ${await errorDetail(res)}`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('nvidia empty reply');
  return text;
}

async function callGemini(system: string, messages: ChatMessage[]): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.GEMINI_MODEL)}:generateContent`;
  const res = await fetch(url, {
    method: 'POST',
    // The key goes in a header, not the URL, so it never lands in access logs.
    headers: { 'x-goog-api-key': config.GEMINI_API_KEY!, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
      generationConfig: { temperature: 0.3, maxOutputTokens: 900, responseMimeType: 'application/json' },
    }),
    signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`gemini http ${res.status} (model ${config.GEMINI_MODEL}): ${await errorDetail(res)}`);
  const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('');
  if (!text) throw new Error('gemini empty reply');
  return text;
}

export interface ProviderResult {
  provider: 'nvidia' | 'gemini';
  json: unknown;
}

/** Tries NVIDIA first, then Gemini. A provider that errors, times out or returns unparseable output is skipped. */
export async function askModel(system: string, messages: ChatMessage[]): Promise<ProviderResult | null> {
  const providers: { name: 'gemini' | 'nvidia'; enabled: boolean; call: () => Promise<string> }[] = [
    { name: 'gemini', enabled: Boolean(config.GEMINI_API_KEY), call: () => callGemini(system, messages) },
    { name: 'nvidia', enabled: Boolean(config.NVIDIA_API_KEY), call: () => callNvidia(system, messages) },

  ];
  for (const p of providers) {
    if (!p.enabled) continue;
    try {
      return { provider: p.name, json: extractJson(await p.call()) };
    } catch (err) {
      // Log the reason, never the key or the learner's message.
      log.warn('tutor provider failed', { provider: p.name, reason: err instanceof Error ? err.message : 'unknown' });
    }
  }
  return null;
}
