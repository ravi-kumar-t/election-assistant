require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 8080;

// ─── Security Middleware ────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        // Allowed inline attributes to support your logic engine if needed
        scriptSrcAttr: ["'unsafe-inline'"], 
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
      },
    },
  })
);

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "*", methods: ["GET", "POST"] }));
app.use(express.json({ limit: "10kb" }));

// Correctly point to the public folder from src/
app.use(express.static(path.join(__dirname, "../public")));

// ─── Rate Limiting ──────────────────────────────────────────────────────────
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { error: "Too many requests. Please wait a moment." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Gemini Setup ───────────────────────────────────────────────────────────
// Ensure your .env file has GEMINI_API_KEY=AIza...
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `You are ElectionIQ — a non-partisan, friendly civic guide whose mission is to move every user from "Uninformed" to "Ready to Vote."

YOUR CORE LOGIC:
- If a user mentions their age, registration status, or ID status, tailor ALL advice to their specific situation.
- If user is NOT registered → always lead with a 3-step registration guide.
- If user IS registered but lacks ID → prioritize Voter ID (EPIC card) steps.
- If user is under 18 → educate proactively so they're ready when eligible.
- If user seems fully prepared → explain advanced topics (how votes are counted, EVM, election observers, etc.)

RESPONSE FORMAT (always structured):
- Use **bold** for key terms and headings
- Number every process (1. 2. 3.)
- Keep responses under 220 words unless user asks for detail
- End each response with one follow-up prompt: "Next, you might ask: '[suggested question]'"

SCOPE: Only election topics — voter registration, voting process, timelines, types of elections, vote counting, EVMs, Model Code of Conduct, electoral systems, ID requirements, absentee/postal voting, results certification, Election Commission of India, constituency, ballot.

If asked anything outside elections: "I'm your election specialist! Ask me about voter registration, polling procedures, or how democracy works."

Be warm, precise, and never partisan.`;

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
});

// ─── Chat Endpoint ──────────────────────────────────────────────────────────
app.post("/api/chat", chatLimiter, async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Invalid message." });
  }
  if (message.length > 500) {
    return res.status(400).json({ error: "Message too long (max 500 characters)." });
  }
  if (!Array.isArray(history)) {
    return res.status(400).json({ error: "Invalid history format." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "AI service not configured. Please set GEMINI_API_KEY." });
  }

  try {
    const safeHistory = (history || [])
      .slice(-10)
      .filter((h) => h.role && h.parts)
      .map((h) => ({
        role: h.role === "assistant" ? "model" : "user",
        parts: [{ text: String(h.parts).substring(0, 1000) }],
      }));

    const chat = model.startChat({ 
      history: safeHistory,
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

    res.json({ reply: text });
  } catch (err) {
    res.status(500).json({ error: "AI service error. Please try again." });
  }
});

// ─── Quick Topics Endpoint ───────────────────────────────────────────────────
app.get("/api/topics", (req, res) => {
  res.json({
    topics: [
      { id: "register", label: "How do I register to vote?", icon: "📝" },
      { id: "process", label: "Walk me through the voting process", icon: "🗳️" },
      { id: "timeline", label: "What are key election timelines?", icon: "📅" },
      { id: "types", label: "What types of elections exist?", icon: "🏛️" },
      { id: "count", label: "How are votes counted?", icon: "🔢" },
      { id: "absentee", label: "How does mail-in / absentee voting work?", icon: "✉️" },
      { id: "id", label: "What ID do I need to vote?", icon: "🪪" },
      { id: "results", label: "How are election results certified?", icon: "✅" },
    ],
  });
});

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "election-assistant", timestamp: new Date().toISOString() });
});

// ─── Catch-all → index.html ──────────────────────────────────────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  // server running
});

module.exports = app;