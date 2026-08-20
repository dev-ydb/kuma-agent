# ConoHa Deployment Plan

This project is developed locally and then deployed to the ConoHa VPS that already runs the Minecraft Bedrock Dedicated Server.

The goal on the VPS is to keep the bot lightweight, stable, and easy to restart without extra platform tooling.

## Recommended deployment model

- Develop and test locally
- Push only the bot source code and config files to the VPS
- Install production dependencies directly on the VPS
- Run the bot under `systemd`
- Keep the process as a single Node.js service

Avoid Docker, Redis, databases, process clusters, or heavy supervisors.

## VPS prerequisites

Install the smallest practical native build toolchain needed by `bedrock-protocol` and its transitive dependencies.

Suggested packages on Ubuntu:

- `nodejs` 22
- `npm`
- `git`
- `python3`
- `make`
- `g++`
- `cmake`

If the package manager provides a Node.js 22 build that is already acceptable for your VPS, use that instead of adding another Node source.

## Deployment steps

1. Copy the app to the VPS.
2. Create the `.env` file on the VPS from `.env.example`.
3. Set the Bedrock server connection values:
   - `MC_HOST=127.0.0.1`
   - `MC_PORT=19132`
   - `MC_USERNAME=Kuma`
   - `MC_OFFLINE=true`
   - `BOT_PREFIX=Kuma`
4. Install dependencies on the VPS with `npm install`.
5. Start the bot once in the foreground and confirm it connects.
6. Register a `systemd` service for automatic restart.
7. Enable and start the service.

## Suggested directory layout on the VPS

```text
/opt/kuma-agent/
├── src/
├── data/
├── package.json
├── package-lock.json
├── .env
└── deploy.md
```

## systemd service example

Create a service file such as `/etc/systemd/system/kuma-agent.service`:

```ini
[Unit]
Description=Kuma Minecraft Bedrock bot
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/kuma-agent
EnvironmentFile=/opt/kuma-agent/.env
ExecStart=/usr/bin/node /opt/kuma-agent/src/index.js
Restart=on-failure
RestartSec=5
User=ubuntu
Group=ubuntu

[Install]
WantedBy=multi-user.target
```

Adjust `User`, `Group`, and the Node path to match the actual VPS setup.

## Operational notes

- Keep `MC_HOST=127.0.0.1` so the bot connects locally to the Bedrock server on the same VPS.
- Keep `MC_OFFLINE=true` if the Bedrock server is operating in offline mode.
- Leave the reconnect delay conservative so the bot does not thrash the server during outages.
- Check `journalctl -u kuma-agent -f` when debugging startup or reconnect problems.
- Keep `data/state.json` writable by the service user.
- Keep `data/logs/` writable by the service user if you want daily Markdown action logs.
- This bot is constrained by `bedrock-protocol` version support. If the Bedrock Dedicated Server is newer than the latest supported protocol version, the bot may fail to stay connected even when the network and credentials are correct.
- For the current setup, a server on `1.26.42` is beyond the versions listed by `bedrock-protocol` at the time of writing, so the bot may not be able to remain connected until the library updates.

## Version watch

Watch for upstream support updates in `bedrock-protocol` when the Bedrock server version changes.

Useful checks:

- Review the `bedrock-protocol` README version list
- Scan recent releases or commit activity in the upstream repository
- Retry the bot after a dependency update only when the protocol version you need appears in the supported list

## Replacement checklist

Use this checklist when `bedrock-protocol` adds support for the Bedrock server version you are running:

1. Update `bedrock-protocol` in `package.json` if needed.
2. Run `npm install` on the development machine or VPS.
3. Confirm the supported version appears in the upstream README.
4. Set `MC_VERSION` to the exact supported Bedrock version only if you want to pin the client.
5. Restart the bot on ConoHa and verify `join` and `spawn` events.
6. Test a prefix command like `Kuma hello`.
7. Update this document if the deployment steps change.

## Update workflow

When code changes are ready:

1. Test locally.
2. Push the updated source to the VPS.
3. Re-run `npm install` only if dependencies changed.
4. Restart the `systemd` service.

## Notes on resource usage

The bot is intentionally small:

- One Node.js process
- One protocol client connection
- Minimal in-memory state
- No local model inference

That makes it suitable for a ~2 GB RAM VPS alongside the Bedrock server.
