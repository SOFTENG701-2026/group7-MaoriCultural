// Step 3 "AI" scaffolding — controlled hint engine.
//
// The brief asks for AI-style scaffolding that, when the child picks the WRONG
// taonga, replies with a patient hint tailored to *that specific wrong choice*.
// The same brief is strict about safety: no free-text input, and the model must
// never invent cultural content at runtime.
//
// Design: the child can only ever tap one of five fixed taonga, and every wrong
// pick has a pre-written, teacher-reviewable hint (`getHint`). When a DeepSeek
// key is configured we ALSO ask the model to warmly rephrase that approved hint
// for the child — grounded by the curated text, capped short, forbidden from
// adding new facts — and fall back to the curated hint on any error, timeout,
// or missing key. So the curated table is both the grounding and the safety net.

import { propById, type PropId } from './stories'

// Targeted hints keyed by [correct taonga][wrong pick]. Authored for the
// fish-hook task; other tasks fall back to the generic composer below.
const TARGETED_HINTS: Partial<Record<PropId, Partial<Record<PropId, string>>>> = {
  matau: {
    taiaha:
      "That's a taiaha — a long staff for standing brave. But it can't catch a fish! Look for something with a sharp, curved point.",
    patu: "That's a patu — a flat hand club. It's strong, but it has no hook to hold a big fish. Try the curved bone one!",
    raukura:
      'Those are raukura — beautiful feathers. They look lovely, but feathers can\'t catch a fish. We need something sharp and curved!',
    wahaika:
      "That's a wahaika — a carved club for close fighting. There's no hook on it, though. Find the one made of bone that curves like a hook!",
  },
}

/**
 * The curated, always-safe hint for picking `wrongId` when the answer was
 * `correctId`. Names what the wrong taonga actually is (so the child still
 * learns the kupu), then nudges them back toward the correct one. This is the
 * grounding for the AI rephrase and the fallback when AI is unavailable.
 */
export function getHint(correctId: PropId, wrongId: PropId): string {
  const targeted = TARGETED_HINTS[correctId]?.[wrongId]
  if (targeted) return targeted

  const wrong = propById(wrongId)
  const right = propById(correctId)
  return `That's the ${wrong.name} — ${wrong.en}. That's not the one we need right now. We're looking for the ${right.name}: ${right.en}. Have another look!`
}

// ── DeepSeek (optional, controlled) ──────────────────────────────────────────
const DEEPSEEK_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY as string | undefined
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions'

const SYSTEM_PROMPT = `You are Kiki, a warm, gentle kiwi-bird guide in a children's Māori story game for 5–7 year olds.
A child is helping the hero Māui by tapping the correct taonga (tool), but tapped the wrong one.
Reply with a short, kind hint in ENGLISH, 1–2 sentences, under 30 words.
STRICT RULES:
- Never say "wrong", "no", or anything discouraging. Be encouraging.
- Use very simple words a young child knows.
- Do NOT invent any Māori words, cultural facts, history, or story details. Only use what is given to you.
- Do NOT ask the child to type or say anything (they can only tap pictures).
- Base your reply on the "approved hint" you are given; just say it more warmly.
- Output ONLY the hint sentence(s), no quotes, no name prefix.`

function sanitize(text: string): string {
  let t = text.trim().replace(/^["'`]+|["'`]+$/g, '').replace(/\s+/g, ' ')
  if (t.toLowerCase().startsWith('kiki:')) t = t.slice(5).trim()
  // Reject anything implausible (too long, or a refusal) — fall back instead.
  if (t.length < 6 || t.length > 240) return ''
  if (/\b(as an ai|i cannot|i can't help|language model)\b/i.test(t)) return ''
  return t
}

/**
 * Return a scaffolding hint for the wrong pick. Tries DeepSeek to warmly
 * rephrase the curated hint; always resolves to a safe string (the curated
 * hint) on missing key, error, timeout, or an implausible response.
 */
export async function requestHint(correctId: PropId, wrongId: PropId): Promise<string> {
  const curated = getHint(correctId, wrongId)
  if (!DEEPSEEK_KEY) return curated

  const wrong = propById(wrongId)
  const right = propById(correctId)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 6000)
  try {
    const res = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        temperature: 0.7,
        max_tokens: 80,
        stream: false,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content:
              `The child tapped: ${wrong.name} (${wrong.en}).\n` +
              `The correct taonga is: ${right.name} (${right.en}).\n` +
              `Approved hint to rephrase warmly: "${curated}"`,
          },
        ],
      }),
    })
    if (!res.ok) return curated
    const data = await res.json()
    const text: unknown = data?.choices?.[0]?.message?.content
    if (typeof text !== 'string') return curated
    return sanitize(text) || curated
  } catch {
    return curated // network/CORS/timeout — stay safe
  } finally {
    clearTimeout(timer)
  }
}
