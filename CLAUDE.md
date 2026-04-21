# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

This is a **learning project** for exploring Electron. It is not a production application. The goal is to understand Electron's architecture, build tooling, IPC patterns, and packaging — not to ship a product. Treat it as an experiment/sandbox.

## Commands

```sh
# First-time setup (creates renderer package, integrates it, installs deps)
npm run init

# Development mode with hot-reload
npm start

# Build all workspace packages
npm run build

# Type-check all packages
npm run typecheck

# Compile distributable executable
npm run compile

# Compile without asar archive (useful for debugging compiled app)
npm run compile -- --dir -c.asar=false

# End-to-end tests (requires compiled app in dist/)
npm run test
```

Node.js >= 23.0.0 is required.

## Architecture

This is an Electron monorepo using npm workspaces. All internal packages are prefixed `@app/*`.

### Process model

```
renderer  ←→  preload  ←→  main
```

- **`packages/main`** (`@app/main`) — Electron main process. Structured as a module system: each feature is an `AppModule` registered via `ModuleRunner`. Modules include window management, auto-updater, security policies, single-instance enforcement, and hardware acceleration.
- **`packages/preload`** (`@app/preload`) — Preload script. Exports functions/values from `src/index.ts`; `exposed.ts` automatically exposes all exports to the renderer via `contextBridge.exposeInMainWorld(btoa(key), value)`. Keys are base64-encoded for security.
- **`packages/renderer`** (`@app/renderer`) — Not included in the repo by default. Created via `npm run init` (any Vite-based framework). Must export as `@app/renderer`. The renderer cannot use Node.js APIs directly.
- **`packages/electron-versions`** (`@app/electron-versions`) — Helper to read Electron's bundled component versions.
- **`packages/integrate-renderer`** — Build-time helper used during `npm run init` to configure the renderer package for use in this template.
- **`packages/entry-point.mjs`** — The actual Electron entry point. Resolves renderer/preload paths and calls `initApp()`. In development, uses `VITE_DEV_SERVER_URL` for the renderer; in production, resolves the built file from `@app/renderer`.
- **`packages/dev-mode.js`** — Development orchestrator: starts the Vite dev server for the renderer, then builds `preload` and `main` packages in watch mode.

### Preload ↔ Renderer communication

Renderer imports from `@app/preload` directly as if it were a normal ESM module. At build time this is rewritten so calls transparently go through `contextBridge`. The preload's `exposed.ts` iterates exports and calls `contextBridge.exposeInMainWorld(btoa(key), value)` for each — renderer accesses them via `globalThis[btoa('functionName')]` (though the import rewrite handles this automatically).

### Main process module system

`ModuleRunner` chains `AppModule.enable(context)` calls sequentially. Each module in `packages/main/src/modules/` is a self-contained feature. Security modules (`BlockNotAllowdOrigins`, `ExternalUrls`) control which origins/URLs BrowserWindows can navigate to.

### Build and packaging

Each workspace is built with Vite individually. `electron-builder.mjs` uses each package's `files` field from its `package.json` to include only `dist/` output (not source) in the compiled executable. Output goes to `dist/`.

### Tests

End-to-end tests in `tests/e2e.spec.ts` use Playwright and launch the **compiled** executable from `dist/`. Run `npm run compile` before `npm run test`. Tests verify window state, renderer content, and that preload exports are correctly exposed via `contextBridge`.

### Environment variables

Accessed via `import.meta.env`. Only `VITE_`-prefixed variables are exposed to renderer/preload code. Add new env variable types to `types/env.d.ts` (`ImportMetaEnv`). Two modes: `development` (set by `npm start`) and `production` (default).
