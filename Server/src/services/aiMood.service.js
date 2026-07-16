import ai from "../Utils/geminiClient.js";
import { ALLOWED_MOODS } from "../Utils/cleanConversation.js";

const MOOD_EMOJI = {
  Positive: "😊", Excited: "😄", Relaxed: "😌", Focused: "🤔",
  Frustrated: "😩", Heated: "😠", Sad: "😢", Funny: "😂", Neutral: "😐",
};

const MOOD_MODEL = "gemini-3.5-flash"; // fast + low-cost, good fit for frequent background analysis

const SYSTEM_PROMPT = `Analyze the overall atmosphere of this chat room conversation.

Rules:
- Analyze the conversation as a whole, not individual users.
- Ignore individual personalities or isolated messages that don't reflect the overall tone.
- Ignore isolated negative messages if the overall conversation is positive, and vice versa.
- Determine the single dominant mood of the room.
- "description" must be a short, neutral, one-sentence summary of the vibe (max 15 words).
- Never mention or describe any individual user by name.`;

// enforced at the API level via responseSchema — the model literally cannot
// return a mood outside this list, rather than us hoping it follows instructions
const responseSchema = {
  type: "object",
  properties: {
    mood: { type: "string", enum: ALLOWED_MOODS },
    emoji: { type: "string" },
    confidence: { type: "number" },
    description: { type: "string" },
  },
  required: ["mood", "emoji", "confidence", "description"],
};

export async function analyzeMoodWithAI(messages) {
  if (!messages || messages.length === 0) return null;

  const conversationText = messages.join("\n");

  try {
    const response = await ai.models.generateContent({
      model: MOOD_MODEL,
      contents: `${SYSTEM_PROMPT}\n\nConversation:\n${conversationText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const parsed = JSON.parse(response.text);

    if (!ALLOWED_MOODS.includes(parsed.mood)) return null; // defensive — should never trigger given the schema

    return {
      label: parsed.mood,
      emoji: parsed.emoji || MOOD_EMOJI[parsed.mood] || "😐",
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.5,
      description: parsed.description || "",
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("aiMood.service: Gemini analysis failed:", error.message);
    return null; // caller falls back to preserving the previous mood
  }
}