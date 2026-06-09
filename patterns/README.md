# Loop Patterns

Documented, reusable loop patterns that have been (or can be) run in real environments.

Each pattern answers:
- What problem it solves
- Recommended scheduling
- Required skills / state shape
- Verification approach
- Human hand-off strategy
- Tool-specific notes (Grok, Claude Code, Codex, GitHub Actions)

## Pattern Registry

| Pattern | Cadence | Risk | File |
|---------|---------|------|------|
| PR Babysitter | 5–15m | Medium | [pr-babysitter.md](./pr-babysitter.md) |
| Daily Triage | 1d–2h | Low | [daily-triage.md](./daily-triage.md) |
| CI Sweeper | 5–15m | Medium | [ci-sweeper.md](./ci-sweeper.md) |
| Post-Merge Cleanup | 1d–6h | Low | [post-merge-cleanup.md](./post-merge-cleanup.md) |
| Dependency Sweeper | 6h–1d | Medium | [dependency-sweeper.md](./dependency-sweeper.md) |

Machine-readable index: [registry.yaml](./registry.yaml)

## How to Use a Pattern

1. Pick a pattern: [pattern-picker.md](../docs/pattern-picker.md)
2. Scaffold with `npx @cobusgreyling/loop-init . --pattern <name> --tool grok` or copy from `starters/`
3. Copy skills from `templates/` if customizing beyond the starter
4. Set up scheduling (`/loop`, `scheduler_create`, GitHub Action, Codex Automation)
5. Create the initial state file (or let `loop-init` do it)
6. Start the loop — **report-only first** when the pattern supports phased rollout
7. Iterate on the loop definition based on what actually happens

Good loops are boring and reliable. Start with one that runs every few hours or daily before going to sub-minute cadences.

## Contributing a Pattern

See [CONTRIBUTING.md](../CONTRIBUTING.md) and [templates/pattern-template.md](../templates/pattern-template.md).