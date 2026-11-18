# Hostlinku Claude Code Setup

[![CI](https://github.com/dyocodes/hostlinku-claude-code-setup/actions/workflows/ci.yml/badge.svg)](https://github.com/dyocodes/hostlinku-claude-code-setup/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**English** | [Bahasa Indonesia](README.id.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

Ready-to-use configuration templates and a connection verifier for running **Claude Code** (CLI, VS Code, and JetBrains) on [Hostlinku](https://hostlinku.com) via `POST /v1/messages` and `/v1/messages/count_tokens`.

## Quick setup (CLI)

1. If you previously logged into Claude Code with an Anthropic/Claude OAuth account, run `claude` and type `/logout` so saved OAuth credentials do not override your gateway settings.
2. Put your key into `~/.claude/settings.json` (global) or `.claude/settings.local.json` (project-only, gitignored). Ready-made templates are in [`configs/`](configs/):

   - [`configs/settings.economy.json`](configs/settings.economy.json) — Economy Service Mode (`claude-sonnet-4-6`, `claude-opus-4-6`, `claude-haiku-4-5`)
   - [`configs/settings.performance.json`](configs/settings.performance.json) — Performance Service Mode (`claude-sonnet-5-5`, `claude-opus-4-8`, `claude-haiku-5-5`)

   Or export in your shell using [`scripts/export-env.sh`](scripts/export-env.sh):

   ```bash
   export ANTHROPIC_BASE_URL=https://api.hostlinku.com
   export ANTHROPIC_AUTH_TOKEN=sk-your-api-key
   export ANTHROPIC_DEFAULT_SONNET_MODEL=claude-sonnet-4-6
   export ANTHROPIC_DEFAULT_OPUS_MODEL=claude-opus-4-6
   export ANTHROPIC_DEFAULT_HAIKU_MODEL=claude-haiku-4-5
   claude
   ```

   **Important:** `ANTHROPIC_BASE_URL` has **no `/v1` suffix** (`settings.json` values take precedence over shell exports).

3. Verify your key before starting a coding session (no dependencies, Node.js ≥ 18):

   ```bash
   HOSTLINKU_API_KEY=sk-your-api-key node scripts/verify-claude-code.mjs
   ```

4. Inside `claude`, run `/status` and confirm the API Base URL shows `https://api.hostlinku.com`.

## VS Code & JetBrains extensions

The IDE extensions check environment settings independently. Copy [`configs/vscode-settings.json`](configs/vscode-settings.json) into your VS Code User/Workspace `settings.json` under `claudeCode.environmentVariables`. For JetBrains, add the same environment variables in **Settings → Tools → Claude Code → Environment variables**.

## Prompt caching, 1M context auto-compact & Service Modes

- **Prompt caching & auto-compact:** Hostlinku passes `cache_control` blocks transparently and supports free token counting via `POST /v1/messages/count_tokens`, keeping Claude Code's prompt caching and 1M context auto-compact working out of the box.
- **Service Mode compatibility:**
  - **Economy** keys support Claude models (`claude-sonnet-4-6`, `claude-opus-4-6`, `claude-haiku-4-5`, etc.).
  - **Performance** and **Dedicated** keys support Claude models as well as compatible domestic models (such as `deepseek-v4-1-flash-hyper`, `deepseek-v4-1-flash`).
  - GPT models are not supported in Claude Code — use Codex CLI or `/v1/responses` instead.
- **Check exact slugs for your key:** `curl -H "Authorization: Bearer $HOSTLINKU_API_KEY" https://api.hostlinku.com/v1/models`

## Troubleshooting

| Symptom | Cause & Fix |
|---|---|
| `401 authentication_error` with valid key | Saved Claude OAuth session overrides `ANTHROPIC_AUTH_TOKEN`. Run `/logout` in `claude` and restart. |
| `404 MODEL_NOT_FOUND` | One of `ANTHROPIC_DEFAULT_{SONNET,OPUS,HAIKU}_MODEL` is unset or uses a slug not in your key's Service Mode. |
| `400 max_tokens exceeds limit` | Set `CLAUDE_CODE_MAX_OUTPUT_TOKENS=32000` (or match the model's `maxOutputTokens` from `/v1/models`). |
| `unrecognized_model` warning on domestic models | Normal when mapping aliases to non-Claude models (e.g. DeepSeek V4); Claude Code assumes a 200k window. |

## Links

- Claude Code Integration Guide: <https://docs.hostlinku.com/en/integrations/claude-code>
- Prompt Caching Guide: <https://docs.hostlinku.com/en/prompt-caching>
- API Examples: <https://github.com/dyocodes/hostlinku-api-examples>
- Console: <https://console.hostlinku.com>

## License

[MIT](LICENSE). Templates contain no secrets; never commit real API keys.
