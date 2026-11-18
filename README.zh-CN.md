# Hostlinku Claude Code 配置指南

[![CI](https://github.com/dyocodes/hostlinku-claude-code-setup/actions/workflows/ci.yml/badge.svg)](https://github.com/dyocodes/hostlinku-claude-code-setup/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[English](README.md) | [Bahasa Indonesia](README.id.md) | [日本語](README.ja.md) | **简体中文**

开箱即用的配置模板与连通性验证脚本，用于通过 [Hostlinku](https://hostlinku.com) 的 `POST /v1/messages` 和 `/v1/messages/count_tokens` 运行 **Claude Code**（CLI、VS Code 和 JetBrains）。

## 快速配置（CLI）

1. 如果此前曾使用 Anthropic/Claude OAuth 账号登录过 Claude Code，请先运行 `claude` 并输入 `/logout`，避免旧凭证覆盖网关配置。
2. 将配置写入 `~/.claude/settings.json`（全局）或项目根目录 `.claude/settings.local.json`（仅当前项目，建议加入 gitignore）。模板位于 [`configs/`](configs/)：

   - [`configs/settings.economy.json`](configs/settings.economy.json) — Economy 模式（`claude-sonnet-4-6`、`claude-opus-4-6`、`claude-haiku-4-5`）
   - [`configs/settings.performance.json`](configs/settings.performance.json) — Performance 模式（`claude-sonnet-5-5`、`claude-opus-4-8`、`claude-haiku-5-5`）

   也可以通过 Shell 导出变量（详见 [`scripts/export-env.sh`](scripts/export-env.sh)）：

   ```bash
   export ANTHROPIC_BASE_URL=https://api.hostlinku.com
   export ANTHROPIC_AUTH_TOKEN=sk-your-api-key
   export ANTHROPIC_DEFAULT_SONNET_MODEL=claude-sonnet-4-6
   export ANTHROPIC_DEFAULT_OPUS_MODEL=claude-opus-4-6
   export ANTHROPIC_DEFAULT_HAIKU_MODEL=claude-haiku-4-5
   claude
   ```

   **注意：** `ANTHROPIC_BASE_URL` **不要加 `/v1` 后缀**（`settings.json` 的优先级高于 Shell 环境变量）。

3. 启动编码前验证连通性（零依赖，需要 Node.js ≥ 18）：

   ```bash
   HOSTLINKU_API_KEY=sk-your-api-key node scripts/verify-claude-code.mjs
   ```

4. 在 `claude` 会话中输入 `/status`，确认 API Base URL 显示为 `https://api.hostlinku.com`。

## VS Code 与 JetBrains 插件

IDE 插件会独立检查配置。VS Code 可复制 [`configs/vscode-settings.json`](configs/vscode-settings.json) 中的 `claudeCode.environmentVariables` 到 `settings.json`。JetBrains 请在 **Settings → Tools → Claude Code → Environment variables** 中填入相同变量。

## Prompt Caching、1M 上下文自动压缩与 Service Mode

- **Prompt Caching 与自动压缩：** Hostlinku 透传 `cache_control` 标记，并免费支持 `POST /v1/messages/count_tokens`，因此 Claude Code 的提示词缓存和 1M 上下文自动压缩可直接使用。
- **Service Mode 兼容性：**
  - **Economy** 密钥支持 Claude 系列模型（`claude-sonnet-4-6`、`claude-opus-4-6`、`claude-haiku-4-5` 等）。
  - **Performance** 与 **Dedicated** 密钥除 Claude 外还支持兼容模型（例如 `deepseek-v4-1-flash-hyper`、`deepseek-v4-1-flash`）。
  - GPT 系列模型不支持在 Claude Code 中使用，请改用 Codex CLI 或 `/v1/responses`。
- **查看当前密钥可用模型 slug：** `curl -H "Authorization: Bearer $HOSTLINKU_API_KEY" https://api.hostlinku.com/v1/models`

## 常见问题排查

| 现象 | 原因与解决方法 |
|---|---|
| Key 正确却返回 `401 authentication_error` | 旧的 OAuth 登录会话仍在生效，在 `claude` 中执行 `/logout` 后重开。 |
| `404 MODEL_NOT_FOUND` | 未固定 `ANTHROPIC_DEFAULT_{SONNET,OPUS,HAIKU}_MODEL`，或该 slug 不在当前密钥的 Service Mode 内。 |
| `400 max_tokens exceeds limit` | 设置 `CLAUDE_CODE_MAX_OUTPUT_TOKENS=32000` 以适配目标模型的输出上限。 |
| 使用非 Claude 模型时提示 `unrecognized_model` | 将别名指向 DeepSeek V4 等模型时的正常提示，客户端会按 200k 窗口处理。 |

## 链接

- Claude Code 集成文档：<https://docs.hostlinku.com/zh/integrations/claude-code>
- Prompt Caching 指南：<https://docs.hostlinku.com/zh/prompt-caching>
- API 示例仓库：<https://github.com/dyocodes/hostlinku-api-examples>
- Console：<https://console.hostlinku.com>

## 许可证

[MIT](LICENSE)。模板中不含任何密钥，切勿提交真实 API Key。
