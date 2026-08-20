# Kuma Agent

`kuma-agent` is a lightweight Minecraft Bedrock bot scaffold for a VPS with very limited RAM.

## What it does

- Connects to a Bedrock Dedicated Server with `bedrock-protocol` when the server version is supported
- Listens to chat messages
- Processes only messages that start with the configured bot prefix
- Converts commands into structured actions first
- Executes deterministic local actions
- Keeps a stubbed AI provider interface for later external API integration
- Uses a lightweight reconnect loop instead of a heavy process manager

## Requirements

- Node.js 22
- npm
- Minecraft Bedrock Dedicated Server

## Version support note

This bot currently depends on `bedrock-protocol`.

At the moment, the project is limited by the protocol versions that `bedrock-protocol` supports. If your Bedrock server is newer than the latest supported version in the library, the bot may connect and then be immediately disconnected during login.

For the current repository state, that means a server on `1.26.42` may not be reachable until `bedrock-protocol` adds support for it.

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` if needed, then start the bot:

```bash
npm start
```

## Environment

- `MC_HOST`: Bedrock server host, default `127.0.0.1`
- `MC_PORT`: Bedrock server port, default `19132`
- `MC_USERNAME`: Bot username, default `Kuma`
- `MC_OFFLINE`: Use offline auth, default `true`
- `MC_VERSION`: Optional Bedrock protocol version override
- `BOT_PREFIX`: Chat prefix to watch for, default `Kuma`
- `RECONNECT_DELAY_MS`: Base reconnect delay, default `5000`
- `RECONNECT_MAX_DELAY_MS`: Max reconnect delay, default `60000`
- `STATE_FILE`: JSON file used for lightweight persisted state
- `ACTION_LOG_DIR`: Directory for daily Markdown action logs, default `data/logs`

## Action logs

The bot appends a Markdown table for each day under `data/logs/YYYY-MM-DD.md`.

Each row records:

- Timestamp
- Whether the entry came from chat processing
- Source player
- Raw chat message
- Parsed input
- Structured action
- Result details
- Target, if any
- Notes such as skipped actions

## Architecture

See [architecture.md](./architecture.md) for the full system map, runtime flow, and file-by-file responsibilities.

## Example chat commands

- `Kuma 안녕`
- `Kuma hello`
- `Kuma こんにちは`
- `Kuma 멈춰`
- `Kuma stop`
- `Kuma 따라와`
- `Kuma follow me`

The AI provider is currently a stub that always returns `null`.

## GitHub workflow

If you want Codex to help manage the repository, use the GitHub-first workflow described in [CONTRIBUTING.md](./CONTRIBUTING.md).

Suggested pattern:

- Create one issue per task
- Ask Codex to work on one branch at a time
- Review the PR diff and validation notes before merging
