import { isMeaningfulMessage } from "../Utils/cleanConversation.js";

// removes noise and collapses immediate repeated spam before it ever
// reaches the AI — keeps the conversation context clean and cheap to analyze
export function filterNoise(messages) {
  const meaningful = [];
  let lastText = null;

  for (const msg of messages) {
    const text = (msg.content || "").trim();
    if (!isMeaningfulMessage(text)) continue;
    if (text === lastText) continue;

    meaningful.push(text);
    lastText = text;
  }

  return meaningful;
}