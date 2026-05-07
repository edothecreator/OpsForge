# Git Strategy

## Branching Model

### `main`

- **Production only** — every commit here is a release
- Protected: no direct pushes, no force pushes, no deletions
- Tags on this branch trigger automated releases (`v*.*.*`)
- Merges only via PR from `release/*` or `hotfix/*`

### `develop`

- **Integration branch** — CI must always stay green here
- Protected: no direct pushes, CI must pass before merge
- All feature work merges back here via PR

### Short-lived branches (branch from `develop`)

| Prefix       | Purpose                                   |
| ------------ | ----------------------------------------- |
| `feature/*`  | New features and enhancements             |
| `infra/*`    | Infrastructure-as-code changes            |
| `ci/*`       | CI/CD pipeline changes                    |
| `obs/*`      | Observability (metrics, logging, tracing) |
| `sre/*`      | Reliability and operational improvements  |
| `security/*` | Security patches and hardening            |
| `k8s/*`      | Kubernetes manifests and Helm charts      |

Rules:

- Branch from `develop`, merge back to `develop`
- Keep short-lived (days, not weeks)
- Delete after merge

### `release/v*.*.*`

- Cut from `develop` when ready to ship
- Only bug fixes and release prep commits allowed here
- Merges into both `main` (tagged) and `develop`

### `hotfix/*`

- Branch from `main` only — emergency production fixes
- Merges into both `main` (tagged) and `develop`
- Bypass the normal release cycle

---

## Commit Convention

All commits must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`

Enforced by `commitlint` on every commit via the `commit-msg` husky hook.

---

## Branch Protection Rules (GitHub Settings → Branches)

### `main`

- ✅ Require pull request before merging
- ✅ Require at least 1 approving review
- ✅ Require status checks to pass (CI workflow)
- ✅ Require branches to be up to date before merging
- ✅ No force pushes
- ✅ No deletions

### `develop`

- ✅ Require pull request before merging
- ✅ Require status checks to pass (CI workflow)
- ✅ No force pushes

---

## Local Git Hooks (Husky)

| Hook         | Trigger                      | Action                                             |
| ------------ | ---------------------------- | -------------------------------------------------- |
| `pre-commit` | Before every commit          | `lint-staged` (ESLint + Prettier on staged files)  |
| `commit-msg` | After writing commit message | `commitlint` validates conventional commit format  |
| `pre-push`   | Before pushing               | `nx affected:test` runs tests for changed projects |
