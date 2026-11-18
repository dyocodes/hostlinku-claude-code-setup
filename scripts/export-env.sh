#!/usr/bin/env bash
# Source this file before running `claude`:
#   HOSTLINKU_API_KEY=sk-your-api-key source scripts/export-env.sh
#
# Note: ANTHROPIC_BASE_URL must NOT include a trailing /v1 suffix.

if [ -z "${HOSTLINKU_API_KEY:-}" ] && [ -z "${ANTHROPIC_AUTH_TOKEN:-}" ]; then
  echo "Set HOSTLINKU_API_KEY (or ANTHROPIC_AUTH_TOKEN) first." >&2
  return 1 2>/dev/null || exit 1
fi

export ANTHROPIC_BASE_URL="${ANTHROPIC_BASE_URL:-https://api.hostlinku.com}"
export ANTHROPIC_AUTH_TOKEN="${ANTHROPIC_AUTH_TOKEN:-$HOSTLINKU_API_KEY}"
export ANTHROPIC_DEFAULT_SONNET_MODEL="${ANTHROPIC_DEFAULT_SONNET_MODEL:-claude-sonnet-4-6}"
export ANTHROPIC_DEFAULT_OPUS_MODEL="${ANTHROPIC_DEFAULT_OPUS_MODEL:-claude-opus-4-6}"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="${ANTHROPIC_DEFAULT_HAIKU_MODEL:-claude-haiku-4-5}"

echo "Configured Claude Code environment -> $ANTHROPIC_BASE_URL (sonnet=$ANTHROPIC_DEFAULT_SONNET_MODEL, haiku=$ANTHROPIC_DEFAULT_HAIKU_MODEL)"
