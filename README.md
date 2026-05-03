# 🗳️ ElectionIQ — Interactive Election Process Assistant

> An AI-powered assistant that helps users understand election processes, voter registration, timelines, and democratic participation — built with **Google Gemini** and deployed on **Google Cloud Run**.

---

## 📌 Challenge Vertical

**Election Education Assistant** — Helps users understand the end-to-end election process including voter registration, polling procedures, vote counting, result certification, and key timelines. Non-partisan, accessible, and grounded in factual civic information.

---

## 🚀 Live Demo

[Deployed on Google Cloud Run](https://your-cloud-run-url)

---

## 🧠 Approach & Logic

### How It Works

1. **User asks a question** about elections via the chat interface
2. **Express backend** validates and sanitizes the input
3. **Google Gemini 1.5 Flash** processes the question with a carefully crafted system prompt that keeps responses non-partisan, factual, and election-focused
4. **Conversation history** (last 10 turns) is maintained client-side and sent with each request to preserve context
5. **Response** is formatted and rendered in the chat interface

### Architecture

```
Browser (HTML/CSS/JS)
       │
       ▼
Express.js Server (Node.js)
       │
       ├── /api/chat   → Google Gemini 1.5 Flash API
       ├── /api/topics → Static quick-topic list
       └── /health     → Health check endpoint
```

### Key Design Decisions

- **System Prompt Engineering**: Gemini is instructed to act as a non-partisan election educator, redirect off-topic questions, and format answers as step-by-step lists for clarity.
- **Stateless Backend**: Conversation history is managed client-side (last 10 turns) and sent with each API call — no database needed, scales infinitely on Cloud Run.
- **No Framework Bloat**: Pure HTML/CSS/JS frontend for fast load times and maximum accessibility.
- **Rate Limiting**: 20 requests/minute per IP to prevent abuse.

---

## 📁 Project Structure

```
election-assistant/
├── public/
│   └── index.html          # Full frontend (single-file SPA)
├── src/
│   ├── server.js           # Express backend + Gemini integration
│   └── tests/
│       └── basic.test.js   # Unit tests (no external deps)
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile              # Cloud Run deployment
├── package.json
└── README.md
```

---

## 🔑 Google Services Used

| Service | Usage |
|---|---|
| **Google Gemini 1.5 Flash** | Core AI — processes election questions, maintains context, generates structured answers |
| **Google Cloud Run** | Serverless deployment — auto-scales, HTTPS, pay-per-use |
| **Google Fonts** | Typography (Playfair Display + DM Sans) |

---

## 🛠️ Local Setup

### Prerequisites
- Node.js 18+
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Run Locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/election-assistant.git
cd election-assistant

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start the server
npm start

# Open http://localhost:8080
```

### Run Tests

```bash
npm test
```

---

## ☁️ Deploy to Google Cloud Run

### Using Google Cloud Console (Recommended)

1. Push your code to GitHub
2. Go to [Cloud Run Console](https://console.cloud.google.com/run)
3. Click **"Create Service"** → **"Continuously deploy from a repository"**
4. Connect your GitHub repo
5. Set build type to **Dockerfile**
6. Add environment variable: `GEMINI_API_KEY` = your key
7. Click **Deploy**

### Using gcloud CLI

```bash
# Build and push to Artifact Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/election-assistant

# Deploy to Cloud Run
gcloud run deploy election-assistant \
  --image gcr.io/YOUR_PROJECT_ID/election-assistant \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key_here
```

---

## 🔒 Security Features

- **Helmet.js** — Sets secure HTTP headers (CSP, X-Frame-Options, etc.)
- **Rate Limiting** — 20 req/min per IP via `express-rate-limit`
- **Input Validation** — Message length capped at 500 chars, type-checked
- **History Sanitization** — History clamped to 10 turns, 1000 chars/turn
- **Non-root Docker User** — Container runs as unprivileged user
- **CORS** — Configurable via `ALLOWED_ORIGIN` env var
- **No API Key in Frontend** — Gemini key stays server-side only

---

## ♿ Accessibility

- Full semantic HTML (`<main>`, `<aside>`, `<header>`, `role` attributes)
- ARIA live regions for chat messages and error alerts
- All interactive elements have `aria-label`
- Keyboard navigable (Tab, Enter to send)
- Color contrast meets WCAG AA standards
- Responsive design works on mobile

---

## 🧪 Testing

Tests cover input validation, history management, topic structure, security edge cases, and role mapping — all run with zero external dependencies.

```
✅ PASS: Message must be a non-empty string
✅ PASS: Message length limit is 500 characters
✅ PASS: History must be an array
✅ PASS: History entries are capped at 10 turns
✅ PASS: Invalid message type is rejected
✅ PASS: Topics array has exactly 8 items
✅ PASS: Each topic has id, label, and icon
✅ PASS: Topic IDs are unique
✅ PASS: GEMINI_API_KEY absence triggers 503
✅ PASS: History parts are clamped to 1000 chars
✅ PASS: User role is mapped to model for Gemini API
```

---

## 💡 Assumptions

- The assistant defaults to Indian election context when no country is specified (relevant for the challenge's regional context)
- Conversation history is not persisted (by design — privacy-first, no database)
- The assistant is not a legal resource — it redirects users to official election authorities for jurisdiction-specific rules
- Gemini 1.5 Flash is used for cost-efficiency and speed; can be swapped for Gemini 1.5 Pro for complex queries

---

## 👤 Author

**Ravi Kumar Tekkali**  
B.Tech CSE, LPU | Reg: 12316665  
GitHub: [github.com/ravi-kumar-t](https://github.com/ravi-kumar-t)  
Portfolio: [ravikumartekkali-portfolio.vercel.app](https://ravikumartekkali-portfolio.vercel.app)
