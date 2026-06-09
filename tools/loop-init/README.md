# loop-init

Scaffold loop engineering starters into your project by pattern and tool.

## Install & Run

```bash
npx @cobusgreyling/loop-init . --pattern daily-triage --tool grok
npx @cobusgreyling/loop-init . -p pr-babysitter -t claude
npx @cobusgreyling/loop-init . -p dependency-sweeper --dry-run
```

## Patterns

| Pattern | Default state file |
|---------|-------------------|
| `daily-triage` | `STATE.md` |
| `pr-babysitter` | `pr-babysitter-state.md` |
| `ci-sweeper` | `ci-sweeper-state.md` |
| `dependency-sweeper` | `dependency-sweeper-state.md` |
| `post-merge-cleanup` | `post-merge-state.md` |

## Tools

- `grok` (default)
- `claude`
- `codex`

Falls back to Grok starter paths when a per-tool variant is not yet available.

## From this repo

```bash
cd tools/loop-init && npm install && npm run build
node dist/cli.js /path/to/project --pattern daily-triage --tool grok
```

Pair with `loop-audit` after scaffolding:

```bash
npx @cobusgreyling/loop-audit . --suggest
```