# FusionCut — landing page

Marketing / download page for **FusionCut 1.1.0**, the Kotlin Multiplatform motion
graphics editor at `C:\Users\Erik1\Desktop\FusionCut\FusionCut`.

Vite + React 19 + Tailwind CSS v4. No UI libraries, no icon package — the icons in
`src/components/Icons.jsx` are hand-drawn inline SVG.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
```

> On Windows, if PowerShell blocks `npm.ps1`, use `npm.cmd` (e.g. `npm.cmd run dev`).
> This is the default script-execution policy on many machines; nothing needs to be
> changed globally.

## Download files

Both installers live in `public/downloads/` and are served from the site root:

| Button | Path | Size |
|---|---|---|
| Download for Windows | `/downloads/FusionCut-1.1.0.msi` | 107.4 MB |
| Download for Android | `/downloads/FusionCut-1.1.0.apk` | 16.6 MB |

They were copied from:

- `…\FusionCut\composeApp\build\compose\binaries\main\msi\FusionCut-1.1.0.msi`
- `…\FusionCut\composeApp\release\composeApp-release.apk` (renamed to `FusionCut-1.1.0.apk`)

When you ship a new build, replace those two files. **The buttons need no code change**
— filenames are versioned in `src/data.js` if you want to bump them.

---

## Source of truth for every claim

All copy lives in `src/data.js`. Nothing there is invented. What is safe to claim, and
why:

### Claimed, and verified in the code

| Claim | Where in the app |
|---|---|
| Multi-track timeline, fixed centre playhead, drag + trim | `composeApp/…/ui/editor/TimelineView.kt` |
| Magnetic snapping to playhead/edges/layer bounds | `TimelineView.kt` (~L454–624) |
| 6 layer types: shape, image, video, text, solid, audio | `shared/…/model/Enums.kt` |
| 8 vector shapes | `fusion_engine_win.cpp` rasteriser (~L466–611) |
| 6 aspect ratios, max 2560×1080 | `Enums.kt` |
| 24 / 30 / 60 fps | `CreateProjectSheet.kt` |
| Transform inspector: pos, scale+link, rotate, flip, opacity | `TransformInspector.kt` |
| Audio volume 0–150 % + mute | `TransformInspector.kt` |
| Undo / redo | `EditorViewModel.kt` (~L239–289) |
| Import formats (mp4/mkv/mov/avi/webm/m4v, jpg/png/webp, mp3/wav/aac/m4a) | `shared/src/jvmMain/…/FilePicker.kt` |
| Extract audio from video | `AddLayerPanel.kt` |
| MP4 / H.264 export via native encoder | `ExportDialog.kt` → `fusion_engine_win.cpp` (~L248–284) |
| PNG still snapshot | `shared/src/jvmMain/…/PlatformExporter.kt` |
| **No FFmpeg** — Media Foundation on Windows, MediaCodec on Android | `fusion_engine_win.cpp`, `fusion_engine_android.cpp` |
| AVX2 + multithreaded compositor | `fusion_engine_win.cpp` (`/arch:AVX2`, `immintrin.h`) |
| Bundled JRE — user installs nothing first | jpackage image in `build/compose/binaries/main/app/FusionCut/runtime` |
| Local SQLite via Room, no account | `shared/…/data/db/`, `ProjectRepository.kt` |
| Android 7.0+ (minSdk 24) | `gradle/libs.versions.toml` |

### Deliberately **not** claimed

These exist in the data model or ViewModel but have **no UI**, so the page says nothing
about them. If you wire them up later, they are free marketing:

- **AI / Gemini.** `metadata.json` mentions `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`
  and `.env.example` has a commented-out key, but there is no AI code or UI at all.
- **17 layer effects** (RGB split, bloom, glitch, film grain, camera shake, …) —
  `Enums.kt` L46–75 and `EditorViewModel.addEffectToLayer()`. No `EffectsPanel` exists.
- **Keyframe animation** — `toggleKeyframe` / easing / jump-to-keyframe are all in the
  ViewModel, but no panel renders them.
- **Blend modes** (multiply, screen, overlay, add) — declared in `BlendMode`, no selector.
- **Built-in sample textures & soundtracks** — the cards are `sample://` URI stubs.

### Disclosed honestly on the page (`STATUS_NOTES` in `src/data.js`)

1. **SmartScreen warning.** The MSI/EXEs are Authenticode-signed with a *self-signed*
   cert (`CN=FusionCut Developer`, see `build.gradle.kts` `signWindowsBinary`). Windows
   will warn on first run.
2. **Android export is unfinished.** `VideoExportService.kt` L117–119 is literally
   `// Stub export file creation` and writes a zero-byte `.mp4`. The page presents the
   APK as a preview build rather than a feature-complete one.
3. **Desktop is Windows-only.** The engine is built on Media Foundation + a `.dll`.
   `Dmg`/`Deb` are configured in `build.gradle.kts` but no engine exists for them.

Also worth knowing: the C++ text renderer draws a **placeholder card**, not real glyphs
(`fusion_engine_win.cpp` ~L687–705) — so text looks right in the live preview but does
not rasterise with true typography into an exported file. The page does not claim
otherwise.

---

## Verification tooling

`scripts/` holds three dependency-free Node scripts that drive headless Edge over the
Chrome DevTools Protocol. They exist because `msedge --headless --screenshot
--window-size=N` **lays out at a different width than it captures**, which produced
phantom "content is clipped" bugs on mobile that did not exist.

```bash
npm run audit:layout      # reports scrollWidth vs clientWidth + any overflowing element
npm run audit:behaviour   # clicks every tab + accordion, HEADs every download link, traps JS errors
npm run shoot -- http://127.0.0.1:5173/ shot.png 390 844 true "#download"
```

`audit:behaviour` currently passes 13/13. It caught one genuine crash: `ICONS` was
missing a `download` entry, so clicking the **Export** tab threw and took the page down.

## Deploying

`npm run build` emits a fully static `dist/`. Note that `public/downloads/` is copied
into `dist/` verbatim, so the output is ~124 MB. On GitHub Pages a 100 MB file exceeds
the hard per-file limit — host the MSI and APK on GitHub Releases and point
`DOWNLOADS.*.file` in `src/data.js` at those URLs instead.