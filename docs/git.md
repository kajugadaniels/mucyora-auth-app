# app/auth Git Rules

Codex must never run Git commands automatically. Present commands for the developer to copy and run.

## Path Rule

All paths must be relative to the `app/auth` project root.

Correct:

```bash
git add "src/components/ui/Button/Button.tsx"
git commit -m "feat(ui): add reusable button component"
```

Wrong:

```bash
git add "app/auth/src/components/ui/Button/Button.tsx"
```

## Commit Rules

- One file per `git add`.
- Never use `git add .`.
- Never use `git add -A`.
- Never include `cd app/auth`.
- Never run `git push`.
- Use Conventional Commits.
- Keep one logical change per commit.

## Recommended Scopes

- `auth`, `identity`, `session`, `security`, `docs`
- `ui`, `layout`, `validation`, `seo`, `a11y`, `performance`, `testing`, `mock`