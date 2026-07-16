import ai from "../Utils/geminiClient.js"; // same client already built for the mood feature

const TESTIMONIAL_MODEL = "gemini-3.5-flash";

const SYSTEM_PROMPT = `You are analyzing a single piece of user feedback about a chat application called Relay.

Rules:
- Determine the sentiment: "positive", "neutral", or "negative".
- Determine a confidence score (0.0-1.0) for that sentiment classification.
- Identify the main topic in a few words (e.g. "Temporary Rooms", "UI Design", "Performance", "Admin Controls").
- Score the overall quality of the feedback from 0.0 to 1.0. A high score means the feedback is specific and descriptive — it explains WHAT they liked and WHY. Generic one-word comments like "good" or "nice" should score low quality even if positive.
- Return JSON only, matching this exact shape.`;

const responseSchema = {
  type: "object",
  properties: {
    sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
    confidence: { type: "number" },
    topic: { type: "string" },
    quality: { type: "number" },
  },
  required: ["sentiment", "confidence", "topic", "quality"],
};

export async function analyzeTestimonial(message) {
  try {
    const response = await ai.models.generateContent({
      model: TESTIMONIAL_MODEL,
      contents: `${SYSTEM_PROMPT}\n\nFeedback:\n"${message}"`,
      config: { responseMimeType: "application/json", responseSchema },
    });

    const parsed = JSON.parse(response.text);
    return {
      sentiment: parsed.sentiment,
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0,
      topic: parsed.topic || "",
      quality: typeof parsed.quality === "number" ? parsed.quality : 0,
    };
  } catch (error) {
    console.error("aiTestimonial.service: Gemini analysis failed:", error.message);
    return null;
  }
}