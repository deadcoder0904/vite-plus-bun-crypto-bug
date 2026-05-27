# vite-plus-bun-crypto-bug

Tiny standalone Vite Plus repro for the `Bun is not defined` crypto hashing bug.

`bun run dev` launches `vp dev`. The `vp` binary runs Vite Plus config and middleware code under Node, so server-side code cannot reference the Bun global even when the command was started through Bun.

Run:

```sh
bun run dev
```

Then open the printed local URL, usually `http://localhost:5173/`.

Expected terminal output on startup:

```txt
[vite-plus-bun-crypto-bug] vite config runtime has Bun: false
[vite-plus-bun-crypto-bug] Bun.SHA256 failed: Bun is not defined
```

Expected homepage output:

```json
{
  "runtimeHasBun": false,
  "bunSha256": "Bun.SHA256 failed: Bun is not defined",
  "nodeCrypto": "..."
}
```

This mirrors the original bug: `Bun.SHA256.hash(...)` fails inside Vite Plus server code, while `node:crypto` works.
