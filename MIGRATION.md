Migration notes — TypeScript → JavaScript conversion

What I changed

- Converted TypeScript/TSX sources to JavaScript/JSX and placed them into `src/`.
- Original TypeScript files were preserved under a backup tree (look for `original_ts_backup_*` and `*.bak` files).
- Updated `package.json` scripts to run `node server.js` for dev and production instead of `tsx server.ts`.
- Moved `@types/*` packages from `dependencies` into `devDependencies`.
- Removed the `@babel/preset-typescript` entry (TypeScript-only preset) from devDependencies.

Why

- The repo was converted to plain JavaScript to remove runtime TypeScript dependency. Keeping `@types/*` as devDependencies preserves typings for development and editor tooling but avoids shipping them in production.

Where backups are

- Full backup of original TypeScript sources: `original_ts_backup_20251031215424/`
- Many original files were also preserved as `*.bak` alongside converted files in `src/`.

Consolidated backups

- All `*.bak` files have been moved into `original_ts_backup_final_cleanup_20251031/` and the original `*.bak` copies were removed from `src/` to keep the repo clean. The `original_ts_backup_20251031215424/` folder is still present (full backup tree).

Recommended next steps

1. Inspect the `converted/` tree and `src/` to confirm behavior and run the app locally.
2. Optionally remove `*.bak` files and the `original_ts_backup_*` folder once you're comfortable with the conversion.
3. Remove `typescript` from `devDependencies` if you no longer need type checking in CI — I left it for now in case you want to keep local checks.
4. Consider adding `"type": "module"` to `package.json` if you want Node to parse top-level ESM without overhead warning (not required for Next.js).

How to run

- Dev (Windows PowerShell):

```powershell
npm run dev:win
```

- Build (production):

```powershell
npm run build
npm run start:win
```
