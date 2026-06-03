// Step 3 "AI" scaffolding — controlled hint engine.
//
// The brief asks for AI-style scaffolding that, when the child picks the WRONG
// taonga, replies with a patient hint tailored to *that specific wrong choice*
// (e.g. "That's a basket — we need something long for battle!"). The same brief
// is strict about safety: no free-text input, and the model must never generate
// cultural content at runtime.
//
// So this "AI" is implemented as a curated, deterministic response table: the
// child can only ever pick one of five fixed taonga, and each wrong pick maps
// to a pre-written, teacher-reviewable hint. This gives the adaptive,
// per-mistake feel of AI scaffolding with zero risk of unsafe or culturally
// inappropriate output. `getHint` is the single seam — a controlled backend
// could later sit behind it without changing any callers.

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
 * Return a patient, child-friendly hint for picking `wrongId` when the answer
 * was `correctId`. Always names what the wrong taonga actually is (so the child
 * still learns the kupu), then nudges them back toward the correct one.
 */
export function getHint(correctId: PropId, wrongId: PropId): string {
  const targeted = TARGETED_HINTS[correctId]?.[wrongId]
  if (targeted) return targeted

  // Generic, still-safe fallback composed from the fixed prop data.
  const wrong = propById(wrongId)
  const right = propById(correctId)
  return `That's the ${wrong.name} — ${wrong.en}. That's not the one we need right now. We're looking for the ${right.name}: ${right.en}. Have another look!`
}
