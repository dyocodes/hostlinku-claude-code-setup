# Setup Claude Code di Hostlinku

[![CI](https://github.com/dyocodes/hostlinku-claude-code-setup/actions/workflows/ci.yml/badge.svg)](https://github.com/dyocodes/hostlinku-claude-code-setup/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[English](README.md) | **Bahasa Indonesia** | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

Template konfigurasi siap pakai dan skrip verifikasi koneksi untuk menjalankan **Claude Code** (CLI, VS Code, dan JetBrains) melalui [Hostlinku](https://hostlinku.com) lewat `POST /v1/messages` dan `/v1/messages/count_tokens`.

## Setup cepat (CLI)

1. Jika sebelumnya pernah login Claude Code memakai akun OAuth Anthropic/Claude, jalankan `claude` lalu ketik `/logout` agar kredensial lama tidak menimpa konfigurasi gateway.
2. Masukkan key ke `~/.claude/settings.json` (global) atau `.claude/settings.local.json` (khusus project, di-gitignore). Template siap pakai ada di [`configs/`](configs/):

   - [`configs/settings.economy.json`](configs/settings.economy.json) — Service Mode Economy (`claude-sonnet-4-6`, `claude-opus-4-6`, `claude-haiku-4-5`)
   - [`configs/settings.performance.json`](configs/settings.performance.json) — Service Mode Performance (`claude-sonnet-5-5`, `claude-opus-4-8`, `claude-haiku-5-5`)

   Atau ekspor langsung lewat shell memakai [`scripts/export-env.sh`](scripts/export-env.sh):

   ```bash
   export ANTHROPIC_BASE_URL=https://api.hostlinku.com
   export ANTHROPIC_AUTH_TOKEN=sk-your-api-key
   export ANTHROPIC_DEFAULT_SONNET_MODEL=claude-sonnet-4-6
   export ANTHROPIC_DEFAULT_OPUS_MODEL=claude-opus-4-6
   export ANTHROPIC_DEFAULT_HAIKU_MODEL=claude-haiku-4-5
   claude
   ```

   **Penting:** `ANTHROPIC_BASE_URL` **tidak memakai akhiran `/v1`** (nilai di `settings.json` mengalahkan export shell).

3. Verifikasi key sebelum mulai sesi coding (tanpa dependensi, Node.js ≥ 18):

   ```bash
   HOSTLINKU_API_KEY=sk-your-api-key node scripts/verify-claude-code.mjs
   ```

4. Di dalam sesi `claude`, ketik `/status` dan pastikan *API Base URL* menampilkan `https://api.hostlinku.com`.

## Ekstensi VS Code & JetBrains

Ekstensi IDE memeriksa variabel lingkungan secara terpisah. Salin [`configs/vscode-settings.json`](configs/vscode-settings.json) ke `settings.json` VS Code di bagian `claudeCode.environmentVariables`. Untuk JetBrains, isi variabel yang sama di **Settings → Tools → Claude Code → Environment variables**.

## Prompt caching, auto-compact 1M context & Service Mode

- **Prompt caching & auto-compact:** Hostlinku meneruskan blok `cache_control` secara transparan dan menyediakan `POST /v1/messages/count_tokens` tanpa memotong saldo, sehingga prompt caching dan fitur *auto-compact* 1 juta context di Claude Code tetap berjalan normal.
- **Kompatibilitas Service Mode:**
  - Key **Economy** mendukung model Claude (`claude-sonnet-4-6`, `claude-opus-4-6`, `claude-haiku-4-5`, dll).
  - Key **Performance** dan **Dedicated** mendukung model Claude serta model domestik yang kompatibel (seperti `deepseek-v4-1-flash-hyper`, `deepseek-v4-1-flash`).
  - Model GPT tidak didukung di Claude Code — gunakan Codex CLI atau `/v1/responses`.
- **Cek slug persis untuk key Anda:** `curl -H "Authorization: Bearer $HOSTLINKU_API_KEY" https://api.hostlinku.com/v1/models`

## Troubleshooting

| Gejala | Penyebab & Solusi |
|---|---|
| `401 authentication_error` padahal key benar | Sesi OAuth Claude lama masih tersimpan. Jalankan `/logout` di `claude` lalu buka ulang. |
| `404 MODEL_NOT_FOUND` | `ANTHROPIC_DEFAULT_{SONNET,OPUS,HAIKU}_MODEL` belum diisi atau memakai slug di luar Service Mode key Anda. |
| `400 max_tokens exceeds limit` | Set `CLAUDE_CODE_MAX_OUTPUT_TOKENS=32000` (atau sesuaikan dengan `maxOutputTokens` model di `/v1/models`). |
| Peringatan `unrecognized_model` pada model domestik | Normal saat alias dipetakan ke model non-Claude (mis. DeepSeek V4); Claude Code mengasumsikan batas 200k. |

## Tautan

- Panduan Claude Code: <https://docs.hostlinku.com/integrations/claude-code>
- Panduan Prompt Caching: <https://docs.hostlinku.com/prompt-caching>
- Contoh API: <https://github.com/dyocodes/hostlinku-api-examples>
- Console: <https://console.hostlinku.com>

## Lisensi

[MIT](LICENSE). Template tidak memuat secret; jangan pernah commit API key asli.
