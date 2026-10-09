/**
 * Publish the installers as GitHub Release assets.
 *
 *   gh auth login
 *   node scripts/publish-downloads.mjs
 *
 * Why this exists: the MSI is 107 MB and git hard-rejects any blob over
 * 100 MB, so the installers cannot live in the repository. They are release
 * assets instead, and `DOWNLOADS.*.file` in src/data.js points at them.
 *
 * The repo must be PUBLIC. Release assets on a private repo require a
 * GitHub login, so visitors hit a 404 and the site looks broken — which is
 * the exact bug this setup exists to avoid.
 *
 * Idempotent: re-running replaces the assets in place.
 */
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { createReadStream, closeSync, existsSync, openSync, readdirSync, readSync, statSync } from 'node:fs'
import { join } from 'node:path'

const REPO = 'devacc2402/FusionCut-website'
const TAG = 'v1.1.0'
const SRC = join(process.cwd(), 'public', 'downloads')

/** These must match DOWNLOADS.*.filename in src/data.js. */
const ASSETS = ['FusionCut-KMP-1.1.0.msi', 'FusionCut-KMP-1.1.0.apk']

/** MSI is an OLE2 compound file, APK is a zip. Both have known magic bytes. */
const SIGNATURES = {
  '.msi': Buffer.from('d0cf11e0a1b11ae1', 'hex'),
  '.apk': Buffer.from('504b0304', 'hex'),
}

function gh(...args) {
  const r = spawnSync('gh', args, { stdio: 'inherit' })
  if (r.status !== 0) {
    console.error(`\ngh ${args.join(' ')} exited ${r.status}`)
    process.exit(r.status ?? 1)
  }
}

function sha256(path) {
  return new Promise((res, rej) => {
    const h = createHash('sha256')
    createReadStream(path)
      .on('data', (c) => h.update(c))
      .on('end', () => res(h.digest('hex')))
      .on('error', rej)
  })
}

/**
 * Refuse to publish anything that is not a plausible installer. Catching a
 * truncated or substituted file here beats discovering it from a user's
 * "the download is corrupt" report.
 */
function verify(file) {
  const path = join(SRC, file)
  const size = statSync(path).size
  const ext = file.slice(file.lastIndexOf('.')).toLowerCase()
  const fd = openSync(path, 'r')
  const header = Buffer.alloc(SIGNATURES[ext].length)
  readSync(fd, header, 0, header.length, 0)
  closeSync(fd)

  if (!header.equals(SIGNATURES[ext])) {
    throw new Error(
      `${file}: expected ${SIGNATURES[ext].toString('hex')} header, got ${header.toString('hex')} — not a real ${ext.slice(1)}`,
    )
  }
  if (size < 1_000_000) {
    throw new Error(`${file} is only ${size} bytes — that is an error page, not an installer`)
  }
  return size
}

const missing = ASSETS.filter((f) => !existsSync(join(SRC, f)))
if (missing.length) {
  console.error(`Missing from public/downloads: ${missing.join(', ')}`)
  process.exit(1)
}

console.log('Verifying installers before upload')
const digests = {}
for (const f of ASSETS) {
  const path = join(SRC, f)
  const size = verify(f)
  digests[f] = await sha256(path)
  console.log(`  ok  ${f}  ${(size / 1048576).toFixed(1)} MB  sha256=${digests[f]}`)
}

const extra = readdirSync(SRC).filter(
  (f) => /\.(msi|apk|exe|zip)$/i.test(f) && !ASSETS.includes(f),
)
if (extra.length) console.warn(`\nNot publishing (not listed in ASSETS): ${extra.join(', ')}`)

const notes = [
  'Experimental Kotlin Multiplatform motion graphics editor — not recommended for use.',
  '',
  '### SHA-256',
  '',
  ...Object.entries(digests).flatMap(([f, h]) => [`\`${f}\``, `\`${h}\``, '']),
].join('\n')

const alreadyThere = spawnSync(
  'gh', ['release', 'view', TAG, '--repo', REPO, '--json', 'tagName'],
  { encoding: 'utf8' },
)

if (alreadyThere.status !== 0) {
  console.log(`\nCreating release ${TAG}`)
  gh('release', 'create', TAG, '--repo', REPO,
    '--title', 'FusionCut KMP 1.1.0 (experimental)', '--notes', notes)
} else {
  console.log(`\nRelease ${TAG} already exists, editing notes`)
  gh('release', 'edit', TAG, '--repo', REPO,
    '--title', 'FusionCut KMP 1.1.0 (experimental)', '--notes', notes)
}

console.log('\nUploading assets (107 MB, this takes a while)')
for (const f of ASSETS) gh('release', 'upload', TAG, join(SRC, f), '--repo', REPO, '--clobber')

console.log('\nChecking the public URLs actually serve the files')
let bad = 0
for (const f of ASSETS) {
  const url = `https://github.com/${REPO}/releases/download/${TAG}/${f}`
  const r = spawnSync(
    'curl',
    ['-sIL', '-o', 'NUL', '-w', '%{http_code} %{content_type} %{size_download}', url],
    { encoding: 'utf8' },
  )
  const [code, type] = (r.stdout ?? '').trim().split(' ')
  const ok = code === '200'
  if (!ok) bad++
  console.log(`  ${ok ? 'ok  ' : 'BAD '} ${code} ${type ?? '?'}  ${url}`)
}

if (bad) {
  console.error('\nAssets are not publicly reachable. If the repo is still PRIVATE,')
  console.error('release assets 404 for anonymous visitors — set it to Public and re-run.')
  process.exit(1)
}

console.log('\nDone. src/data.js already points at these URLs.')
console.log('Remember to rebuild and redeploy so the site picks up the new assets.')