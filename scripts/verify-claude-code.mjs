#!/usr/bin/env node
// Verifies Hostlinku Anthropic Messages compatibility for Claude Code:
//   1. POST /v1/messages/count_tokens (free; required for 1M context auto-compact)
//   2. POST /v1/messages (live completion + usage + hostlinku.cost)
// Zero dependencies, Node >= 18.

const token = process.env.ANTHROPIC_AUTH_TOKEN || process.env.HOSTLINKU_API_KEY;
if (!token) {
  console.error("Set ANTHROPIC_AUTH_TOKEN or HOSTLINKU_API_KEY before running.");
  process.exit(1);
}

const base = (process.env.ANTHROPIC_BASE_URL ?? "https://api.hostlinku.com")
  .replace(/\/+$/, "")
  .replace(/\/v1$/, "");
const model = process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL || process.env.HOSTLINKU_MODEL || "claude-haiku-4-5";

const headers = {
  "Content-Type": "application/json",
  "x-api-key": token,
  Authorization: `Bearer ${token}`,
  "anthropic-version": "2023-06-01",
  "User-Agent": "hostlinku-claude-code-setup/0.1.0",
};

const sampleMessages = [
  { role: "user", content: "Reply with exactly two words: connection ok." },
];

// 1. Token counter check (no credit deduction)
const countRes = await fetch(`${base}/v1/messages/count_tokens`, {
  method: "POST",
  headers,
  body: JSON.stringify({ model, messages: sampleMessages }),
});

if (!countRes.ok) {
  console.error(`count_tokens failed HTTP ${countRes.status}: ${await countRes.text()}`);
  process.exit(1);
}
const countData = await countRes.json();
console.log("count_tokens OK:", countData);

// 2. Live /v1/messages check
const msgRes = await fetch(`${base}/v1/messages`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    model,
    max_tokens: 64,
    messages: sampleMessages,
  }),
});

if (!msgRes.ok) {
  console.error(`/v1/messages failed HTTP ${msgRes.status}: ${await msgRes.text()}`);
  process.exit(1);
}

const msgData = await msgRes.json();
const text = msgData.content?.find((block) => block.type === "text")?.text ?? "";
console.log("messages OK:", text.trim());
console.log("usage:", msgData.usage, "| hostlinku:", msgData.hostlinku);
