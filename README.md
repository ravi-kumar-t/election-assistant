# 🗳️ ElectionIQ — Interactive Election Process Assistant

> A state-driven AI assistant that transitions users from **"Uninformed" to "Ready to Vote"** using structured logic and AI guidance.  
Built with **Google Gemini 2.5 Flash** and deployed on **Google Cloud Run**.

---

## 🚀 Live Demo

https://election-assistant-548605678663.us-central1.run.app/

---

## 📌 Challenge Vertical

**Election Education Assistant** — A non-partisan tool designed to help users understand the complete election lifecycle including voter registration, eligibility, polling procedures, vote counting, result certification, and election timelines.

---

## 🧠 Approach & Logic

ElectionIQ combines a **deterministic logic engine** with **AI reasoning** to deliver **context-aware, step-by-step election guidance**.

---

### 🔹 Core Logic System

- **Age** — Determines eligibility (18+ rule)
- **Registration Status** — Checks voter roll inclusion
- **Voter ID Availability** — Required for casting vote
- **AI Interaction** — Tracks engagement and awareness level

---

### 🔹 Voter Readiness Score (0–100%)

- **Age ≥ 18** → +25 → Eligible to vote  
- **Registered** → +25 → Listed in electoral roll  
- **Has Voter ID** → +25 → Ready for polling  
- **Used AI Assistant** → +25 → Gained civic awareness  

---

### 🔹 Logical Decision Flow

age < 18          → Not eligible → educate user  
age ≥ 18  
  registered = no → Priority: registration steps  
  registered = yes  
    id = no       → Priority: voter ID steps  
    id = yes  
      chat used   → Advanced election topics  

---

## ⚙️ How the Solution Works

1. User fills **Eligibility Wizard**
2. System calculates **Readiness Score**
3. A **Next Step recommendation** is generated
4. User interacts with chatbot
5. Backend validates and rate-limits input
6. **Gemini 2.5 Flash** processes query
7. Response is structured and displayed

---

## 🧩 Key Design Decisions

- **Prompt Engineering** — Gemini is instructed to act as a non-partisan assistant
- **State + AI Hybrid Model** — Logic decides priority, AI explains steps
- **Stateless Backend** — No DB required, scalable on Cloud Run
- **Lightweight Frontend** — Fast load, accessible

---

## 🏗️ Architecture

Browser (HTML/CSS/JS)  
→ Eligibility Wizard → Logic Engine → Score  
→ Express Backend → Gemini API  

---

## 🔑 Google Services

- **Google Gemini 2.5 Flash** — Core AI reasoning  
- **Google Cloud Run** — Serverless deployment  
- **Google Antigravity** — Workflow optimization  
- **Google Fonts** — UI improvement  

---

## ⚡ Key Features

- **Context-aware AI assistant** — adapts responses based on user data  
- **Voter Readiness Score** — tracks progress toward voting eligibility  
- **Eligibility Wizard** — collects structured user input  
- **Next-step recommendations** — guides user journey  
- **Election timeline support** — explains phases of elections  
- **Lightweight frontend** — fast loading, no heavy frameworks  
- **Secure backend** — protects API and user data   

---

## 🔒 Security Features

- **Helmet.js** — Secure headers (CSP, XSS protection)  
- **Rate Limiting** — 20 req/min via express-rate-limit  
- **Input Validation** — Prevents invalid/malicious input  
- **History Sanitization** — Limits stored conversation  
- **CORS Control** — Configurable access  
- **API Key Protection** — Stored server-side only  

---

## ♿ Accessibility

- **Semantic HTML** — Improves screen reader compatibility  
- **ARIA Roles** — Enables assistive technologies  
- **Keyboard Navigation** — Fully usable without mouse  
- **High Contrast UI** — Better visibility for all users  
- **Responsive Design** — Works on mobile, tablet, desktop   

---

## 🧪 Testing

Run:
npm test  

---

## 📁 Project Structure

election-assistant/
├── public/index.html  
├── src/server.js  
├── src/tests/basic.test.js  
├── Dockerfile  
├── package.json  
└── README.md  

---

## 🛠️ Setup

git clone https://github.com/ravi-kumar-t/election-assistant.git  
cd files  
npm install  

Create .env:  
GEMINI_API_KEY=your_api_key_here  

Run:  
npm start  

---

## 👤 Author

**Ravi Kumar Tekkali**  
B.Tech CSE, LPU | Reg: 12316665  
GitHub: [github.com/ravi-kumar-t](https://github.com/ravi-kumar-t)  
Portfolio: [ravikumartekkali-portfolio.vercel.app](https://ravikumartekkali-portfolio.vercel.app)
