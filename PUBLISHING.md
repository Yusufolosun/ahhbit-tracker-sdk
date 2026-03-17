# Publishing Guide

Step-by-step instructions for publishing `@yusufolosun/ahhbit-tracker-sdk` to **npmjs** and **GitHub Packages**.

---

## Accounts

| Registry          | Username     | Scope             |
| ----------------- | ------------ | ----------------- |
| npmjs.org         | rexaors      | @yusufolosun      |
| GitHub Packages   | Yusufolosun  | @yusufolosun      |

---

## Pre-publish Checklist

Run these every time before publishing:

```bash
# 1. Make sure working tree is clean
git status

# 2. Type-check
npm run lint

# 3. Run tests
npm test

# 4. Build
npm run build

# 5. Inspect what will be published (no secrets, no source)
npm pack --dry-run
```

You should see exactly these files in the tarball:

```
LICENSE
README.md
dist/index.cjs
dist/index.cjs.map
dist/index.d.cts
dist/index.d.ts
dist/index.js
dist/index.js.map
package.json
```

If anything unexpected appears, check the `files` field in `package.json`.

---

## Publish to npmjs

### First-time setup (already done for v1.1.0)

```bash
npm login --registry https://registry.npmjs.org/
# Username: rexaors
# Follow the browser/OTP prompt
```

Verify you're logged in:

```bash
npm whoami --registry https://registry.npmjs.org/
# Should print: rexaors
```

### Publish

```bash
# Push commits and tags to GitHub first
git push origin main

# Publish to npmjs (prepublishOnly rebuilds automatically)
npm publish
```

> `publishConfig.access` is set to `"public"` in package.json, so scoped
> package `@yusufolosun/...` will be public by default.

Verify on https://www.npmjs.com/package/@yusufolosun/ahhbit-tracker-sdk

---

## Publish to GitHub Packages

### First-time setup

1. Generate a GitHub Personal Access Token (classic) at https://github.com/settings/tokens  
   Required scopes: `read:packages`, `write:packages`

2. Log in to the GitHub npm registry:

```bash
npm login --registry https://npm.pkg.github.com/
# Username: Yusufolosun
# Password: <paste your GitHub PAT>
# Email: <your email>
```

Verify you're logged in:

```bash
npm whoami --registry https://npm.pkg.github.com/
# Should print: Yusufolosun (or yusufolosun)
```

### Publish

```bash
npm publish --registry https://npm.pkg.github.com/
```

Verify on https://github.com/Yusufolosun/ahhbit-tracker-sdk/packages

---

## After Publishing (both registries)

Tag the release in git:

```bash
git tag v1.1.1
git push origin v1.1.1
```

Optionally create a GitHub Release at:  
https://github.com/Yusufolosun/ahhbit-tracker-sdk/releases/new?tag=v1.1.1

---

## Publishing a New Version (future releases)

```bash
# 1. Bump version (pick one)
npm version patch   # 1.1.1 → 1.1.2  (bug fixes)
npm version minor   # 1.1.1 → 1.2.0  (new features)
npm version major   # 1.1.1 → 2.0.0  (breaking changes)

# This updates package.json, creates a git commit, and tags it.

# 2. Push commit + tag
git push origin main --follow-tags

# 3. Publish to both registries
npm publish
npm publish --registry https://npm.pkg.github.com/
```

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `npm ERR! 402 Payment Required` | Scoped packages are private by default. Already handled by `publishConfig.access: "public"` |
| `npm ERR! 403 Forbidden` | Check `npm whoami` — you may be logged into the wrong account |
| `npm ERR! 404 Not Found` (GitHub) | The repo name must match the package scope. Ours does: `@yusufolosun` ↔ `Yusufolosun` |
| `npm ERR! ENEEDAUTH` | Run `npm login` for the target registry |
| Stale build in tarball | Delete `dist/` and run `npm run build` before publish |
