# Clarity v2 — GitHub Repository Setup Guide

This guide sets up GitHub version history for Clarity.

---

## Recommended Repository

Repository name:

```text
clarity
```

Recommended visibility:

```text
private
```

Recommended first commit:

```text
docs: add Clarity Product Spec v2
```

---

## Option A: Using GitHub CLI

```bash
mkdir clarity
cd clarity

git init
mkdir -p docs/decisions

cp /path/to/clarity-product-spec-v2.md docs/product-spec-v2.md
cp /path/to/clarity-codex-initial-build-prompt.md docs/codex-initial-build-prompt.md

cat > docs/changelog.md <<'EOF'
# Changelog

## v0.1.0-spec
- Added Clarity Product Spec v2.
- Added Codex initial build prompt.
EOF

cat > docs/decisions/0001-use-design-md.md <<'EOF'
# Decision 0001: Use DESIGN.md as Clarity's design-system source of truth

Clarity v2 will compile project inputs into DESIGN.md files. These files will be versioned, linted, exported, and used by generation agents.
EOF

cat > docs/decisions/0002-private-reference-storage.md <<'EOF'
# Decision 0002: Store references and exports privately

User-uploaded references and generated exports may contain client work, unreleased ideas, or proprietary assets. Storage must be private by default and accessed through signed URLs.
EOF

git add .
git commit -m "docs: add Clarity Product Spec v2"

gh repo create clarity --private --source=. --remote=origin --push
```

---

## Option B: Without GitHub CLI

Create a new private repository named `clarity` in GitHub, then run:

```bash
mkdir clarity
cd clarity

git init
mkdir -p docs/decisions

cp /path/to/clarity-product-spec-v2.md docs/product-spec-v2.md
cp /path/to/clarity-codex-initial-build-prompt.md docs/codex-initial-build-prompt.md

git add .
git commit -m "docs: add Clarity Product Spec v2"

git branch -M main
git remote add origin git@github.com:<your-username>/clarity.git
git push -u origin main
```

Replace `<your-username>` with your GitHub username.

---

## Branch Strategy

Use lightweight trunk-based development:

```text
main          stable branch
feat/*        feature work
fix/*         bug fixes
docs/*        documentation
codex/*       Codex task branches
```

Examples:

```text
docs/product-spec-v2
codex/phase-1-foundation
feat/palette-picker
feat/design-md-compiler
```

---

## Tags

Use tags as milestones:

```bash
git tag v0.1.0-spec
git push origin v0.1.0-spec
```

Recommended future tags:

```text
v0.1.0-spec
v0.2.0-foundation
v0.3.0-brief-archetype
v0.4.0-palette-picker
v0.5.0-design-md
v0.6.0-generation-preview
v0.7.0-beta
```

---

## Codex Workflow

1. Create a branch for the phase.
2. Paste the relevant Codex prompt.
3. Let Codex make changes.
4. Review files.
5. Run tests/build.
6. Commit.
7. Open a PR or merge when stable.

Example:

```bash
git checkout -b codex/phase-1-foundation
```

Prompt Codex with:

```text
Read docs/product-spec-v2.md and docs/codex-initial-build-prompt.md. Implement Phase 1 only.
```

---

## Suggested Project Board Columns

```text
Backlog
Ready for Codex
In Progress
Review
Testing
Done
```

## Suggested First Issues

1. Phase 1: Modern foundation
2. Phase 2: Conversational brief
3. Phase 3: Archetype selector
4. Phase 4: Color Palette Picker
5. Phase 5: Reference board
6. Phase 6: DESIGN.md compiler
7. Phase 7: Generation and preview
8. Phase 8: Export and beta polish
