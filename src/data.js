/**
 * Every claim on this page is traceable to the FusionCut KMP codebase.
 * See README.md in this folder for the source-of-truth notes.
 */

/**
 * Where the installers are actually hosted.
 *
 * They deliberately do NOT live in `public/downloads/`: the MSI is 107 MB and
 * git refuses any blob over 100 MB, so keeping it in the repo breaks the push.
 * They are published as GitHub Release assets instead, and the site points at
 * those absolute URLs. GitHub allows 2 GB per asset and serves them with a
 * correct `Content-Disposition: attachment`, so the browser downloads the real
 * binary rather than whatever the static host returns for a missing path.
 */
const REPO = 'devacc2402/FusionCut-website'
export const RELEASE_TAG = 'v1.1.0'
const releaseUrl = (asset) =>
  `https://github.com/${REPO}/releases/download/${RELEASE_TAG}/${asset}`

export const RELEASES_PAGE = `https://github.com/${REPO}/releases/tag/${RELEASE_TAG}`

export const APP = {
  name: 'FusionCut KMP',
  version: '1.1.0',
  tagline: 'A motion graphics editor that speaks directly to your GPU.',
  blurb:
    'Multi-track timeline, magnetic snapping, a full transform inspector and a hand-written C++ render engine — on Windows and Android from a single Kotlin codebase.',
}

/**
 * Shown in the site-wide banner, in the download section and in the FAQ.
 * FusionCut KMP is an experiment, not a supported product, and the page has to
 * say so before anyone installs it.
 */
export const EXPERIMENT_WARNING = {
  headline: 'FusionCut KMP was an experiment',
  banner:
    'FusionCut KMP was an experiment and is not recommended for everyday or professional use.',
  body:
    'FusionCut KMP was a one-off experiment to see how far Kotlin Multiplatform could be pushed with a hand-written native render engine. It was never finished, never security-audited and never intended for production work. Expect rough edges, crashes and missing features. Use it to poke at, not to deliver client work or irreplaceable footage with.',
  points: [
    'No support, no bug fixes and no roadmap',
    'Video export from Android still writes a zero-byte file',
    'Signed with a self-signed certificate, so SmartScreen will block it',
    'Your projects live in a local database with no migration path out',
  ],
}

/** Shown as the first item of `STATUS_NOTES` so the warning is unmissable. */
export const EXPERIMENT_NOTE = {
  tone: 'danger',
  title: 'This is an experiment, not a product',
  body: EXPERIMENT_WARNING.body,
}

export const DOWNLOADS = {
  windows: {
    label: 'Download for Windows',
    short: 'Windows',
    file: releaseUrl('FusionCut-KMP-1.1.0.msi'),
    filename: 'FusionCut-KMP-1.1.0.msi',
    size: '107 MB',
    platform: 'Windows 10/11',
    note: 'Machine-wide MSI · Start menu + desktop shortcut · JRE bundled',
    sha256: 'a6a906532a0260080492dd5a2b25fa5e6992f9673e0006f55d2c0fb1930ac53c',
  },
  android: {
    label: 'Download for Android',
    short: 'Android',
    file: releaseUrl('FusionCut-KMP-1.1.0.apk'),
    filename: 'FusionCut-KMP-1.1.0.apk',
    size: '16.6 MB',
    platform: 'Android 7.0+',
    note: 'Signed release build · sideload to install',
    sha256: 'a50062af2b1b2da794b4b054940cd6e02cb8ac920d55fe68f73a434f7165f0a8',
  },
}

export const STATS = [
  { value: '6', label: 'Layer types', sub: 'composited in layer order' },
  { value: '60', label: 'Frames per second', sub: '24 / 30 / 60 timeline options' },
  { value: '8', label: 'Vector shapes', sub: 'rasterised natively, not bitmaps' },
  { value: '0', label: 'External dependencies', sub: 'no FFmpeg, no Python, no Java' },
]

/* ------------------------------------------------------------------ */
/* Headline differentiators                                            */
/* ------------------------------------------------------------------ */
export const WHY = [
  {
    icon: 'chip',
    accent: 'cyan',
    title: 'A render engine we actually wrote',
    body: 'No FFmpeg subprocess, no 80 MB library, no waiting on a download. FusionCut KMP links straight against the operating system’s own hardware codecs — Media Foundation on Windows, MediaCodec on Android — through a hand-written C++ core compiled with AVX2.',
    tag: 'C++20 · AVX2 · Media Foundation',
  },
  {
    icon: 'magnet',
    accent: 'emerald',
    title: 'A timeline that snaps like it’s magnetic',
    body: 'Drag a clip and it locks onto the playhead, the project edges, and the start and end of every other layer. Cyan guides appear the instant something catches, so cuts land exactly where you meant them.',
    tag: 'Multi-track · drag · trim · pinch-zoom',
  },
  {
    icon: 'layers',
    accent: 'magenta',
    title: 'Precision, not guesswork',
    body: 'Every layer exposes the full transform set: independent position, linked or per-axis scale up to 15×, rotation, opacity, and flip on both axes. Centre it, reset it, nudge it by exact amounts.',
    tag: 'Pos · Scale · Rotate · Flip · Opacity',
  },
  {
    icon: 'globe',
    accent: 'amber',
    title: 'One codebase, two very different devices',
    body: 'The same Kotlin Multiplatform source drives a 4K desktop editor and a phone app. The layout genuinely adapts — sidebars on desktop, bottom sheets on mobile — instead of being a shrunken desktop UI.',
    tag: 'Kotlin Multiplatform · Compose',
  },
  {
    icon: 'shield',
    accent: 'violet',
    title: 'Your footage never leaves the machine',
    body: 'Projects live in a local SQLite database through Room. There is no account to create, no project to upload, and no render farm in another country doing your work for you.',
    tag: 'Local-first · no account',
  },
  {
    icon: 'bolt',
    accent: 'cyan',
    title: 'Nothing to install first',
    body: 'The Java runtime ships inside the MSI. You download one file, run it, and you’re editing — no JDK, no JRE, no PATH variables, no codec packs.',
    tag: 'Bundled JRE · single installer',
  },
]

/* ------------------------------------------------------------------ */
/* Feature breakdown                                                   */
/* ------------------------------------------------------------------ */
export const FEATURES = [
  {
    tab: 'Timeline',
    accent: 'cyan',
    headline: 'Built like a motion designer expects',
    body: 'The playhead stays locked to the centre while the timeline pans beneath it — the same mental model as After Effects and Premiere, so your hands already know where to go.',
    bullets: [
      'Unlimited multi-track rows, each colour-coded by layer type',
      'Drag a clip body to move it, drag its edges to trim',
      'Magnetic snapping to playhead, project edges and neighbouring layers',
      'Pinch to zoom from a whole-project fit down to fine detail',
      'Adaptive time ruler with major and minor ticks',
      'Green render-cache bar showing exactly which ranges are pre-rendered',
    ],
  },
  {
    tab: 'Layers',
    accent: 'emerald',
    headline: 'Six kinds of layer, one compositing model',
    body: 'Mix generated vector art with real footage. Layers composite in order, and you can reorder, duplicate, hide or lock any of them at any point.',
    bullets: [
      'Six layer types: shape, image, video, text, solid, audio',
      'Eight true vector shapes — rounded box, rectangle, circle, star, triangle, heart, hexagon, capsule',
      'Seven fill and stroke colour presets, from neon cyan to solid black',
      'Import images, video, and audio, or extract the audio straight out of a video',
      'Reorder, duplicate, hide, lock, centre or reset any layer',
      'Full undo and redo history',
    ],
  },
  {
    tab: 'Inspector',
    accent: 'magenta',
    headline: 'Every number is a slider, not a guess',
    body: 'Three focused tabs keep the controls close to the timeline without burying you. Audio layers get their own volume and mute controls, because mixing is part of editing.',
    bullets: [
      'Position on X and Y, from −1000 to 1000 px',
      'Scale from 0.05× to 15× with a link toggle for per-axis control',
      'Rotation across a full ±180°, plus horizontal and vertical flip',
      'Opacity from fully transparent to solid',
      'Audio layers: volume up to 150% with mute',
      'Timing tools — trim to playhead, split at playhead, extend, or match project duration',
    ],
  },
  {
    tab: 'Export',
    accent: 'amber',
    headline: 'Straight to a real MP4',
    body: 'Hardware-accelerated H.264 encoding through the same native engine that draws the preview, so what you see is what lands in the file.',
    bullets: [
      'MP4 / H.264 export written by the native encoder',
      'Export resolution follows the project canvas, up to 2560×1080',
      'Frame rates of 24, 30 or 60 fps',
      'PNG still snapshots of the current frame',
      'Windows export writes straight to your Downloads folder',
    ],
  },
]

export const ASPECTS = [
  { ratio: '16:9', res: '1920×1080', use: 'YouTube & web' },
  { ratio: '9:16', res: '1080×1920', use: 'Reels, Shorts, TikTok' },
  { ratio: '1:1', res: '1080×1080', use: 'Feed posts' },
  { ratio: '4:5', res: '1080×1350', use: 'Portrait feed' },
  { ratio: '4:3', res: '1440×1080', use: 'Classic & webcams' },
  { ratio: '21:9', res: '2560×1080', use: 'Ultrawide & cinematic' },
]

export const FORMATS = [
  {
    kind: 'Video',
    accent: 'magenta',
    exts: ['mp4', 'mkv', 'mov', 'avi', 'webm', 'm4v'],
    note: 'Decoded with hardware acceleration',
  },
  {
    kind: 'Images',
    accent: 'emerald',
    exts: ['jpg', 'jpeg', 'png', 'webp'],
    note: 'Cached for instant scrubbing',
  },
  {
    kind: 'Audio',
    accent: 'cyan',
    exts: ['mp3', 'wav', 'aac', 'm4a'],
    note: 'Or extract the track from any video',
  },
]

export const ENGINE = [
  {
    title: 'Hardware decode',
    body: 'Source frames come off the GPU via Media Foundation on Windows and MediaCodec on Android, then land straight in the compositor.',
  },
  {
    title: 'Native rasteriser',
    body: 'Circles, rounded rects, triangles, stars, hearts, hexagons and capsules are drawn with real path maths — not stretched bitmaps.',
  },
  {
    title: 'AVX2 compositing',
    body: 'The C++ compositor is multithreaded and compiled with AVX2, compositing every layer in a single pass over the framebuffer.',
  },
  {
    title: 'Hardware encode',
    body: 'Windows export pushes RGB32 frames into a Media Foundation SinkWriter that emits H.264 directly.',
  },
]

export const STACK = [
  { k: 'Language', v: 'Kotlin 2.2 + C++17/20' },
  { k: 'UI', v: 'Compose Multiplatform 1.7' },
  { k: 'Desktop render', v: 'Windows Media Foundation' },
  { k: 'Mobile render', v: 'OpenGL ES 3.0 + EGL' },
  { k: 'Storage', v: 'Room 2.7 / SQLite' },
  { k: 'Minimum Android', v: '7.0 (API 24)' },
  { k: 'Bundled runtime', v: 'JetBrains Runtime 21' },
  { k: 'Targets', v: 'Java 11 bytecode' },
]

/* ------------------------------------------------------------------ */
/* Honest status notes. Keeping these visible builds trust.            */
/* ------------------------------------------------------------------ */
export const STATUS_NOTES = [
  EXPERIMENT_NOTE,
  {
    tone: 'warn',
    title: 'Windows shows a SmartScreen warning',
    body: 'v1.1.0 is signed with a self-signed developer certificate, not a commercial code-signing certificate. Windows will warn on first launch — choose More info → Run anyway.',
  },
  {
    tone: 'info',
    title: 'Android is the preview build',
    body: 'Editing, the timeline and the preview canvas are fully working on Android. Video export from the phone is still being finished, so treat the APK as an early look at the mobile editor.',
  },
  {
    tone: 'info',
    title: 'The desktop build is Windows-only for now',
    body: 'The native engine is built on Media Foundation, which makes it Windows-specific. macOS and Linux targets are configured in the build, but the native engine has to be ported before those installers are real.',
  },
]

export const FAQ = [
  {
    q: 'Should I actually use FusionCut KMP?',
    a: `Probably not. ${EXPERIMENT_WARNING.body} If you just want to try it, install it on a machine you can wipe, and keep a copy of anything you care about.`,
  },
  {
    q: 'Do I need to install Java or FFmpeg first?',
    a: 'No. The Java runtime is bundled inside the Windows installer, and the render engine talks to codecs that ship with Windows itself. There is nothing to install before or after FusionCut KMP.',
  },
  {
    q: 'Which video formats can I import?',
    a: 'MP4, MKV, MOV, AVI, WebM and M4V for video; JPG, JPEG, PNG and WebP for images; MP3, WAV, AAC and M4A for audio. You can also pull the audio track out of any imported video as its own layer.',
  },
  {
    q: 'Why does Windows warn me about the installer?',
    a: 'The build is signed with a self-signed developer certificate rather than a purchased commercial one, so SmartScreen has never seen it before. Choose More info → Run anyway. The signature is still there — it just is not chained to a known publisher.',
  },
  {
    q: 'How do I install the Android APK?',
    a: 'Download the APK, then open it on your phone and allow installs from your file manager when prompted. You will need “Install unknown apps” permission for whichever app you open the APK with. Requires Android 7.0 or newer.',
  },
  {
    q: 'Is my footage uploaded anywhere?',
    a: 'No. Projects are stored in a local SQLite database on your own machine and media is read from disk in place. There is no account system and no server component.',
  },
  {
    q: 'How do I report a bug or request a feature?',
    a: 'FusionCut KMP is finished as an experiment, so there is no active development to file against. If you hit something genuinely interesting, the project repository is still worth a look.',
  },
]