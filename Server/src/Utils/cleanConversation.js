export const ALLOWED_MOODS = [
    "Positive","Exicted","Relaxed","Focused","Frustrated","Heated","Sad","Funny","Neutral"
];

const FILLER_WORDS = new Set([
  "ok", "k", "hi", "hey", "yo", "lol", "lmao", "haha",
  "hmm", "yes", "no", "sure", "cool", "nice", "yep", "nah",
]);

function looksLikeGibberish(word) {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  if (clean.length < 4) return false; // too short to judge reliably
  const vowels = (clean.match(/[aeiou]/g) || []).length;
  return vowels / clean.length < 0.15; // real words rarely fall this low
}

function isEmojiOnly(text) {
  const stripped = text.replace(/[\s\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "");
  return stripped.length === 0 && text.trim().length > 0;
}

export function isMeaningfulMessage(text) {
  if (!text) return false;
  const trimmed = text.trim();

  if (trimmed.length < 2) return false;
  if (FILLER_WORDS.has(trimmed.toLowerCase())) return false;
  if (isEmojiOnly(trimmed)) return false;
  if (looksLikeGibberish(trimmed)) return false;

  return true;
}