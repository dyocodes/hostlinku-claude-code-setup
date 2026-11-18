# Hostlinku Claude Code セットアップ

[![CI](https://github.com/dyocodes/hostlinku-claude-code-setup/actions/workflows/ci.yml/badge.svg)](https://github.com/dyocodes/hostlinku-claude-code-setup/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[English](README.md) | [Bahasa Indonesia](README.id.md) | **日本語** | [简体中文](README.zh-CN.md)

[Hostlinku](https://hostlinku.com)（`POST /v1/messages` および `/v1/messages/count_tokens`）経由で **Claude Code**（CLI、VS Code、JetBrains）を動かすための設定テンプレートと接続確認スクリプトです。

## クイックセットアップ（CLI）

1. 以前に Anthropic/Claude アカウントで OAuth ログインしていた場合は、`claude` を起動して `/logout` を実行し、保存済みの認証情報が優先されないようにします。
2. `~/.claude/settings.json`（全体）または `.claude/settings.local.json`（プロジェクト専用、gitignore 推奨）に API キーを設定します。テンプレートは [`configs/`](configs/) にあります。

   - [`configs/settings.economy.json`](configs/settings.economy.json) — Economy モード用（`claude-sonnet-4-6`、`claude-opus-4-6`、`claude-haiku-4-5`）
   - [`configs/settings.performance.json`](configs/settings.performance.json) — Performance モード用（`claude-sonnet-5-5`、`claude-opus-4-8`、`claude-haiku-5-5`）

   または [`scripts/export-env.sh`](scripts/export-env.sh) のように環境変数で指定します。

   ```bash
   export ANTHROPIC_BASE_URL=https://api.hostlinku.com
   export ANTHROPIC_AUTH_TOKEN=sk-your-api-key
   export ANTHROPIC_DEFAULT_SONNET_MODEL=claude-sonnet-4-6
   export ANTHROPIC_DEFAULT_OPUS_MODEL=claude-opus-4-6
   export ANTHROPIC_DEFAULT_HAIKU_MODEL=claude-haiku-4-5
   claude
   ```

   **重要:** `ANTHROPIC_BASE_URL` の末尾に **`/v1` は付けません**（`settings.json` の設定がシェル変数より優先されます）。

3. セッション開始前に接続を確認します（依存関係なし、Node.js ≥ 18）。

   ```bash
   HOSTLINKU_API_KEY=sk-your-api-key node scripts/verify-claude-code.mjs
   ```

4. `claude` 内で `/status` を実行し、API Base URL が `https://api.hostlinku.com` になっていることを確認してください。

## VS Code・JetBrains 拡張機能

IDE 拡張機能は環境設定を個別に参照します。VS Code の場合は [`configs/vscode-settings.json`](configs/vscode-settings.json) の `claudeCode.environmentVariables` を `settings.json` に追加してください。JetBrains の場合は **Settings → Tools → Claude Code → Environment variables** に同じ変数を設定します。

## プロンプトキャッシュ・1M コンテキスト自動圧縮・Service Mode

- **キャッシュと自動圧縮:** Hostlinku は `cache_control` ブロックを透過的に転送し、`POST /v1/messages/count_tokens` を課金なしでサポートしているため、プロンプトキャッシュや 1M コンテキストの auto-compact がそのまま動作します。
- **Service Mode の互換性:**
  - **Economy** キーでは Claude 系モデル（`claude-sonnet-4-6`、`claude-opus-4-6`、`claude-haiku-4-5` など）が利用できます。
  - **Performance** / **Dedicated** キーでは Claude 系に加えて対応するモデル（`deepseek-v4-1-flash-hyper`、`deepseek-v4-1-flash` など）も指定できます。
  - GPT 系モデルは Claude Code では利用できません（Codex CLI または `/v1/responses` をご利用ください）。
- **利用可能な slug の確認:** `curl -H "Authorization: Bearer $HOSTLINKU_API_KEY" https://api.hostlinku.com/v1/models`

## トラブルシューティング

| 症状 | 原因と対処 |
|---|---|
| 正しいキーでも `401 authentication_error` | 古い OAuth セッションが残っています。`claude` で `/logout` を実行して再起動してください。 |
| `404 MODEL_NOT_FOUND` | `ANTHROPIC_DEFAULT_{SONNET,OPUS,HAIKU}_MODEL` が未設定か、キーの Service Mode にない slug です。 |
| `400 max_tokens exceeds limit` | `CLAUDE_CODE_MAX_OUTPUT_TOKENS=32000` などを設定してモデルの出力上限に合わせます。 |
| 非 Claude モデルで `unrecognized_model` 警告 | DeepSeek V4 などへ割り当てた際の仕様上の警告です（200k コンテキストとして扱われます）。 |

## リンク

- Claude Code 連携ガイド: <https://docs.hostlinku.com/ja/integrations/claude-code>
- プロンプトキャッシュガイド: <https://docs.hostlinku.com/ja/prompt-caching>
- API サンプル集: <https://github.com/dyocodes/hostlinku-api-examples>
- Console: <https://console.hostlinku.com>

## ライセンス

[MIT](LICENSE)。テンプレートに認証情報は含まれていません。実際の API キーをコミットしないでください。
