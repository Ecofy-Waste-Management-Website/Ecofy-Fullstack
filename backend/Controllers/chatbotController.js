const { GoogleGenerativeAI } = require("@google/generative-ai");
const ChatSession = require("../Model/ChatSession");

// ── Initialise Gemini ────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ── Ecofy system prompt ──────────────────────────────
const SYSTEM_PROMPT = `You are **EcoBot**, the friendly AI assistant for **Ecofy** — a waste management platform in Sri Lanka.

## Your Personality
- Warm, professional, and concise.
- Use emojis sparingly (1-2 per message max).
- Keep responses SHORT (2-4 sentences unless the user asks for detail).
- Always be helpful and solution-oriented.

## Ecofy Services & Pricing
| Service          | Price (LKR) | Description                              |
|------------------|-------------|------------------------------------------|
| Household        | 1,500       | Regular home waste collection             |
| Commercial       | 3,500       | Office & business waste management        |
| Bulk             | 2,500       | Large-volume one-time pickups             |
| Garden           | 1,200       | Garden/yard waste & green debris          |
| Drain Cleaning   | 2,000       | Drain & gutter cleaning services          |

## Waste Categories
General, Recyclable, Hazardous, Electronic, Garden

## Booking Flow
1. Customer selects service type & waste category
2. Enters pickup location (with map picker)
3. Chooses preferred date
4. Adds optional notes
5. Confirms booking → proceeds to Stripe payment

## Service Status Flow
Pending → Assigned → In Progress → En Route → Completed (or Delayed)

## What You Can Do
1. **Answer questions** about Ecofy services, pricing, and how things work.
2. **Guide users through booking** — recommend the right service type based on their description. When a user wants to book, respond naturally AND include the JSON action tag.
3. **Triage complaints** — if a user reports a problem (late pickup, missing collection, damaged property, etc.), empathise first, then offer to file a formal inquiry. Include the inquiry action tag.
4. **Track status** — if a user asks about their pickup status, direct them to the tracking feature.
5. **General waste management tips** — recycling guidance, waste reduction, environmental awareness.

## Action Tags (IMPORTANT)
When your response should trigger a UI action, include ONE of these JSON blocks at the END of your message, on its own line. The frontend will parse and remove it before displaying:

To open the booking/pickup modal:
\`\`\`action
{"action": "OPEN_BOOKING"}
\`\`\`

To navigate the user to a page:
\`\`\`action
{"action": "NAVIGATE", "target": "/service-history"}
\`\`\`
Valid targets: /service-history, /payment-history, /notifications, /contact, /about, /blogs

To auto-create a complaint inquiry:
\`\`\`action
{"action": "CREATE_INQUIRY", "subject": "Brief subject", "message": "Detailed description of the issue"}
\`\`\`

## Rules
- NEVER make up information. If you don't know something about Ecofy, say so.
- NEVER share pricing that differs from the table above.
- If a question is completely unrelated to waste management or Ecofy, politely redirect.
- Do NOT include action tags unless the user has clearly expressed intent to perform that action.
- Respond in the same language the user writes in (English or Sinhala or Tamil).
`;

// ── Chat endpoint ────────────────────────────────────
const chatMessage = async (req, res) => {
  try {
    const { message, conversationHistory = [], userContext = {} } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required." });
    }

    // Build the conversation for Gemini
    const contents = [];

    // Add prior conversation turns
    for (const turn of conversationHistory) {
      contents.push({
        role: turn.role === "user" ? "user" : "model",
        parts: [{ text: turn.text }],
      });
    }

    // Add current user message (with optional context)
    let userMessage = message;
    if (userContext.name || userContext.email) {
      userMessage = `[User context: name="${userContext.name || "Guest"}", email="${userContext.email || "N/A"}", loggedIn=${!!userContext.isLoggedIn}]\n\n${message}`;
    }
    contents.push({ role: "user", parts: [{ text: userMessage }] });

    // Call Gemini
    const result = await model.generateContent({
      contents,
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 512,
      },
    });

    const responseText = result.response.text();

    // Extract action tag if present
    let reply = responseText;
    let action = null;

    const actionMatch = responseText.match(/```action\s*\n([\s\S]*?)\n```/);
    if (actionMatch) {
      try {
        action = JSON.parse(actionMatch[1].trim());
        // Remove the action block from the displayed reply
        reply = responseText.replace(/```action\s*\n[\s\S]*?\n```/, "").trim();
      } catch {
        // If JSON parsing fails, just ignore the action
      }
    }

    // Persist session to DB (create a new session for this exchange)
    try {
      const msgs = [];
      for (const turn of conversationHistory) {
        msgs.push({ role: turn.role === 'user' ? 'user' : (turn.role === 'model' ? 'model' : 'bot'), text: turn.text, time: turn.time || turn.timestamp || Date.now() });
      }
      // current user message and bot reply
      msgs.push({ role: 'user', text: message, time: Date.now() });
      msgs.push({ role: 'model', text: reply, time: Date.now() });

      const sessionDoc = new ChatSession({
        user: {
          clerkId: userContext?.id || null,
          name: userContext?.name || null,
          email: userContext?.email || null,
        },
        messages: msgs,
        lastUpdated: new Date(),
      });

      await sessionDoc.save();
      return res.status(200).json({ reply, action, sessionId: sessionDoc._id });
    } catch (saveErr) {
      console.error('Failed to save chat session:', saveErr);
      return res.status(200).json({ reply, action });
    }
  } catch (error) {
    console.error("Chatbot error:", error);

    // Handle rate limiting — retry once after the suggested delay
    if (error.status === 429) {
      const retryDelay = error.errorDetails
        ?.find((d) => d["@type"]?.includes("RetryInfo"))
        ?.retryDelay;
      const waitMs = retryDelay ? parseInt(retryDelay) * 1000 : 5000;

      // Wait and retry once
      await new Promise((resolve) => setTimeout(resolve, Math.min(waitMs, 15000)));
      try {
        const { message, conversationHistory = [], userContext = {} } = req.body;
        const contents = [];
        for (const turn of conversationHistory) {
          contents.push({
            role: turn.role === "user" ? "user" : "model",
            parts: [{ text: turn.text }],
          });
        }
        let userMessage = message;
        if (userContext.name || userContext.email) {
          userMessage = `[User context: name="${userContext.name || "Guest"}", email="${userContext.email || "N/A"}", loggedIn=${!!userContext.isLoggedIn}]\n\n${message}`;
        }
        contents.push({ role: "user", parts: [{ text: userMessage }] });

        const retryResult = await model.generateContent({
          contents,
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 512 },
        });

        const retryText = retryResult.response.text();
        let retryReply = retryText;
        let retryAction = null;
        const retryMatch = retryText.match(/```action\s*\n([\s\S]*?)\n```/);
        if (retryMatch) {
          try {
            retryAction = JSON.parse(retryMatch[1].trim());
            retryReply = retryText.replace(/```action\s*\n[\s\S]*?\n```/, "").trim();
          } catch { /* ignore */ }
        }
        return res.status(200).json({ reply: retryReply, action: retryAction });
      } catch {
        return res.status(200).json({
          reply: "I'm a bit busy right now! 🕐 Please try again in a few seconds.",
          action: null,
        });
      }
    }

    // Handle API key errors
    if (error.message?.includes("API key")) {
      return res.status(200).json({
        reply: "I'm having trouble connecting right now. Please try again in a moment. 🔧",
        action: null,
      });
    }

    return res.status(200).json({
      reply: "Sorry, I encountered an unexpected error. Please try again. 🔧",
      action: null,
    });
  }
};

// GET /sessions - list recent chat sessions
const getSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.find().sort({ lastUpdated: -1 }).limit(500).lean();
    return res.status(200).json({ sessions });
  } catch (err) {
    console.error('Failed to list chat sessions:', err);
    return res.status(500).json({ message: 'Failed to list sessions' });
  }
};

// GET /sessions/:id - return a single session
const getSessionById = async (req, res) => {
  try {
    const s = await ChatSession.findById(req.params.id).lean();
    if (!s) return res.status(404).json({ message: 'Session not found' });
    return res.status(200).json(s);
  } catch (err) {
    console.error('Failed to fetch session:', err);
    return res.status(500).json({ message: 'Failed to fetch session' });
  }
};

module.exports = { chatMessage, getSessions, getSessionById };

