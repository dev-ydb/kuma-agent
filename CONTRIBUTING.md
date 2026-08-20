# Contributing

This repository is managed with a lightweight GitHub-first workflow so Codex and humans can work from the same source of truth.

## Core principles

- Keep one task per branch.
- Keep one branch per pull request.
- Keep pull requests small and reviewable.
- Prefer deterministic local logic before adding AI behavior.
- Do not commit secrets, `.env` files, or VPS credentials.

## Recommended workflow

1. Create an issue or write a clear task description.
2. Create a branch for that work.
3. Make the change in focused commits.
4. Run the relevant checks locally.
5. Open a pull request with a short summary and validation notes.
6. Review and merge after confirming the expected behavior.

## Branch naming

Use names like:

- `feature/chat-parser`
- `fix/reconnect-loop`
- `docs/deploy-notes`

## What to include in a pull request

- What changed
- Why it changed
- How it was tested
- Any follow-up work

## What Codex should optimize for

- Small, targeted diffs
- Clear commit messages
- Updated docs when behavior changes
- No unnecessary dependency additions

## Good task format for Codex

Use this shape when assigning work:

- Goal: what outcome you want
- Constraints: what must not change
- Acceptance: how you will know it is done
- Context: any files or behavior to preserve

Example:

> Goal: add a local command for greeting in Japanese.
> Constraints: keep the action schema unchanged and avoid new dependencies.
> Acceptance: `Kuma こんにちは` maps to a structured `say` action and tests pass.

