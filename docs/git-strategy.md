# Git Strategy

## Branches

### main

- Production only
- Protected
- No direct pushes

### develop

- Integration branch
- Must always pass CI

### feature/\*

- Created from develop
- Short-lived

### release/v*.*.\*

- Created from develop
- Used before production

### hotfix/\*

- Created from main
- Emergency fixes

## Rules

- Always use Pull Requests
- Never push directly to main
- CI must pass before merging
