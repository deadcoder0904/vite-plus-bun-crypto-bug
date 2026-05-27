import { createHash } from 'node:crypto'
import { defineConfig } from 'vite-plus'

const content = 'vite plus bun crypto repro'

function nodeCryptoHash(value) {
  return createHash('sha256').update(value).digest('hex')
}

function tryBunSha256(value) {
  try {
    return Bun.SHA256.hash(value, 'hex')
  } catch (error) {
    return `Bun.SHA256 failed: ${error instanceof Error ? error.message : String(error)}`
  }
}

function getReproResult() {
  return {
    runtimeHasBun: typeof globalThis.Bun !== 'undefined',
    bunSha256: tryBunSha256(content),
    nodeCrypto: nodeCryptoHash(content),
  }
}

const reproResult = getReproResult()

console.log(`[vite-plus-bun-crypto-bug] vite config runtime has Bun: ${reproResult.runtimeHasBun}`)
console.log(`[vite-plus-bun-crypto-bug] ${reproResult.bunSha256}`)

export default defineConfig({
  plugins: [
    {
      name: 'vite-plus-bun-crypto-bug-homepage',
      transformIndexHtml(html) {
        return html.replace(
          '<div id="repro-result"></div>',
          `<pre id="repro-result">${escapeHtml(JSON.stringify(reproResult, null, 2))}</pre>`
        )
      },
      configureServer(server) {
        server.middlewares.use('/api/crypto-hash', (_req, res) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(getReproResult(), null, 2))
        })
      },
    },
  ],
})

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}
