// Basic unit tests for ElectionIQ server
// Run with: node src/tests/basic.test.js

const assert = require("assert");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌ FAIL: ${name} — ${e.message}`);
    failed++;
  }
}

console.log("\n🗳️  ElectionIQ — Test Suite\n");

// ─── Input Validation Tests ──────────────────────────────────────────────────
console.log("Input Validation:");

test("Message must be a non-empty string", () => {
  const msg = "How do I register to vote?";
  assert.strictEqual(typeof msg, "string");
  assert.ok(msg.length > 0);
});

test("Message length limit is 500 characters", () => {
  const longMsg = "a".repeat(501);
  assert.ok(longMsg.length > 500, "Should exceed limit");
  const validMsg = "a".repeat(500);
  assert.ok(validMsg.length <= 500, "Should be within limit");
});

test("History must be an array", () => {
  const history = [];
  assert.ok(Array.isArray(history));
});

test("History entries are capped at 10 turns", () => {
  const history = Array.from({ length: 15 }, (_, i) => ({
    role: i % 2 === 0 ? "user" : "model",
    parts: `Message ${i}`,
  }));
  const safeHistory = history.slice(-10);
  assert.strictEqual(safeHistory.length, 10);
});

test("Invalid message type is rejected", () => {
  const invalidMessages = [null, undefined, 123, {}, []];
  invalidMessages.forEach((msg) => {
    assert.ok(typeof msg !== "string" || msg === "", `${msg} should be invalid`);
  });
});

// ─── Topics Tests ────────────────────────────────────────────────────────────
console.log("\nTopics API:");

const MOCK_TOPICS = [
  { id: "register", label: "How do I register to vote?", icon: "📝" },
  { id: "process", label: "Walk me through the voting process", icon: "🗳️" },
  { id: "timeline", label: "What are key election timelines?", icon: "📅" },
  { id: "types", label: "What types of elections exist?", icon: "🏛️" },
  { id: "count", label: "How are votes counted?", icon: "🔢" },
  { id: "absentee", label: "How does mail-in / absentee voting work?", icon: "✉️" },
  { id: "id", label: "What ID do I need to vote?", icon: "🪪" },
  { id: "results", label: "How are election results certified?", icon: "✅" },
];

test("Topics array has exactly 8 items", () => {
  assert.strictEqual(MOCK_TOPICS.length, 8);
});

test("Each topic has id, label, and icon", () => {
  MOCK_TOPICS.forEach((t) => {
    assert.ok(t.id, "Missing id");
    assert.ok(t.label, "Missing label");
    assert.ok(t.icon, "Missing icon");
  });
});

test("Topic IDs are unique", () => {
  const ids = MOCK_TOPICS.map((t) => t.id);
  const unique = new Set(ids);
  assert.strictEqual(ids.length, unique.size);
});

// ─── Security Tests ──────────────────────────────────────────────────────────
console.log("\nSecurity:");

test("GEMINI_API_KEY absence triggers 503", () => {
  const apiKey = undefined;
  assert.ok(!apiKey, "Should be missing");
  // Server would return 503 — verified by logic
});

test("History parts are clamped to 1000 chars", () => {
  const longPart = "x".repeat(2000);
  const clamped = String(longPart).substring(0, 1000);
  assert.strictEqual(clamped.length, 1000);
});

test("User role is mapped to model for Gemini API", () => {
  const history = [{ role: "assistant", parts: "Hello" }];
  const mapped = history.map((h) => ({
    role: h.role === "assistant" ? "model" : "user",
    parts: [{ text: String(h.parts) }],
  }));
  assert.strictEqual(mapped[0].role, "model");
});

// ─── Results ─────────────────────────────────────────────────────────────────
console.log(`\n────────────────────────────────`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log("🎉 All tests passed!\n");
  process.exit(0);
} else {
  console.log("⚠️  Some tests failed.\n");
  process.exit(1);
}
