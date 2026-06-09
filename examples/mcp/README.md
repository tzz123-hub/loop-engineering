# MCP Connector Cookbook

Minimal MCP setups for loop patterns. Start **read-only** (L1); expand scope only after trust.

## GitHub MCP (L1 — read)

**Use in**: Daily Triage, PR Babysitter (discovery)

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**Scopes**: `repo:status`, `read:org`, `read:user` — no `repo` write until L2.

**Loop prompt snippet**:
```
Read open PRs and recent CI conclusions via GitHub MCP. Do not comment or merge. Update STATE.md only.
```

## GitHub MCP (L2 — comment)

**Use in**: PR Babysitter, CI Sweeper

Add scope: `public_repo` or fine-grained **Pull requests: Read and write** (comments only).

**Gate**: Bot signs comments: `🤖 Loop Engineering — PR Babysitter`

## Linear MCP (L1 — read)

**Use in**: Daily Triage

```
Connect Linear MCP with read-only API key. Triage assigned issues into STATE.md High Priority. No ticket creation in week one.
```

## Slack MCP (L1 — read)

**Use in**: Daily Triage

```
Read #engineering channel last 24h for incident threads. Summarize in Watch Items. Never post to Slack unattended in L1.
```

## Scope matrix

| Pattern | L1 MCP | L2 MCP |
|---------|--------|--------|
| Daily Triage | GitHub read, Linear read | — |
| PR Babysitter | GitHub read | GitHub PR comments |
| CI Sweeper | GitHub Actions read | PR comments on fix branches |
| Dependency Sweeper | — | GitHub PR create (no auto-merge) |
| Post-Merge Cleanup | GitHub read (recent merges) | Small PR propose |

## Not required

MCP is optional for L1 daily triage on small repos. Git + local STATE.md is enough for week one.

See [docs/safety.md](../../docs/safety.md) for denylist and least-privilege rules.