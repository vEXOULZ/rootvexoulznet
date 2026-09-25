# vexoulz.net

The root site: links, socials, stream status and the OBS browser sources. Vue 3 + TypeScript on the shared
[`@vexoulz/ui`](https://github.com/vEXOULZ/vexoulz-ui) design ("Deep Field").

```bash
npm install
npm run dev         # http://localhost:5173
npm run typecheck   # vue-tsc
npm run build       # → dist/
git config core.hooksPath .githooks   # once per clone: branch-name rules, see CONTRIBUTING.md
```

`main` is merge-only and branches follow [Conventional Branch](https://conventional-branch.github.io/)
(`feature/…`, `bugfix/…`, `hotfix/…`, `release/…`, `chore/…`). See [CONTRIBUTING.md](CONTRIBUTING.md).

## Pages

| path | what |
|---|---|
| `/` | links, and a stream card from the archive API: the live stream (`/streams?is_live=true`) or, offline, the latest VOD; both link to the past streams |
| `/obs_sources` | list of the OBS browser sources |
| `/obs_sources/countdown?h=&m=&s=&text=` | transparent countdown for OBS; no site chrome |
| anything else | 404 |

Logos and images are placeholders (`VxPlaceholder`) until real assets exist.

## Config

`VITE_ARCHIVE_API` sets the archive API base URL (see `.env.example`). It defaults to the public one that
vods.vexoulz.net uses.

## Publishing

`.github/workflows/publish.yml` runs the checks, builds, and pushes `dist/` to the `deploy` branch on every
merge to `main`. The shared design is pinned to a vexoulz-ui tag in `package.json`; Renovate opens the bumps.

## Infrastructure

This repo is host-agnostic: it builds and publishes, nothing more. Details about where or how the site is
hosted (machines, addresses, proxy or tunnel config, server paths, deploy scripts) belong in the private
`homelab-docs` repo and must never be committed here. `.gitignore` blocks `.env*` (except `.env.example`),
`*.local.*` and `/deploy.local/` so local host files can't slip in.
