# Portfolio Hà Vi — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A 9-page React portfolio for Vương Thị Hà Vi themed "Tập nhạc mùa phượng" (piano), built from `content/`, ready for Netlify, pushed to GitHub.

**Architecture:** Vite SPA with React Router. Source markdown in `content/pages/*.md` is converted once by a script into JSON blocks (`src/content/generated/*.json`) so the text stays verbatim; each page component lays those blocks out its own way. A small Web Audio piano engine powers the hero keyboard and the 9-key "scale" navigation.

**Tech Stack:** Vite (react-ts template), React 19, TypeScript, react-router, motion (`motion/react`), lenis, marked (script only), sharp (script only), @fontsource-variable/unbounded, @fontsource/be-vietnam-pro, Vitest + @testing-library/react + jsdom.

**Spec:** `docs/superpowers/specs/2026-11-21-portfolio-design.md`

## Global Constraints

- Lesson text is **verbatim**: no spelling fixes, no spacing fixes, no merging repeated sections, Bài 4 contradictions kept. Only presentation may change.
- Images used as-is (no cropping, Bài 3 and Bài 4 screenshots included); Bài 4 offers download of `Bao_cao_Bai_tap_4_Hoan_chinh.docx`.
- Course: "Nhập môn Công nghệ số và ứng dụng trí tuệ nhân tạo", lecturer "Vũ Việt Hoàng", class empty → hidden.
- Palette: Giấy `#F4F6F9`, Phím trắng `#FFFFFF`, Mực chàm `#1C2140`, Phượng `#E5432D`, Cột trường `#2B6BE0`, Chì `#6A7090`. Light theme only.
- Fonts: Unbounded (display), Be Vietnam Pro (body), self-hosted. Body 17–18px, line ≤ 72ch, line-height 1.65, scale ratio 1.25.
- Routes: `/`, `/du-an`, `/du-an/bai-1` … `/du-an/bai-6`, `/tong-ket`. Scale notes in that order: C4 D4 E4 F4 G4 A4 B4 C5 D5.
- Copy rules: no all-caps labels, no "A · B · C" meta strings, no "→" appended to links, no monospace labels, numbering only for real sequences.
- Motion: one home intro (~1.2s, once per session), page transition ≈350ms, interaction feedback; no fade-in on every section. `prefers-reduced-motion` → no Lenis, no intro, no flying notes, transitions fade only.
- Sound: never before a user gesture; mute toggle persisted in `localStorage` key `havi-sound` (`"on"`/`"off"`).
- New copy written by Claude ("Mục tiêu của Portfolio", project summaries, lesson summaries where missing, inferred Chương 4/6) lives in `src/data/` and is flagged with `// VIẾT MỚI` comments.
- Works at 360px wide; no horizontal page scroll; visible keyboard focus.

## Review Focus

1. Refresh or deep-link on `/du-an/bai-3` on Netlify must load the page → `public/_redirects` test (Task 1).
2. Vietnamese diacritics (ỗ, ữ, ặ…) must render in Unbounded headings, no fallback glyph mixing → font subset test + visual check (Task 1, Task 12).
3. Phone width 360px: hero keyboard and Bài 2 wide table must not cause page-level horizontal scroll → layout test at 360px (Task 6, Task 9, Task 12).
4. Typing shortcuts (Ctrl+L, Alt+Tab, Cmd+R) or holding a key must not play notes or retrigger endlessly → keyboard mapping tests (Task 6).
5. If JS animation fails or reduced motion is on, content must still be visible (nothing stuck at opacity 0) → reduced-motion render test (Task 5).

---

## File structure

```
index.html
netlify.toml, public/_redirects, public/files/Bao_cao_Bai_tap_4_Hoan_chinh.docx
scripts/optimize-images.mjs      content/assets/** → src/assets/img/**.webp
scripts/md-to-blocks.ts          content/pages/*.md → src/content/generated/<slug>.json
src/main.tsx, src/App.tsx         router + layout + page transitions
src/styles/tokens.css, base.css
src/data/site.ts                  profile, course, portfolio goals (VIẾT MỚI)
src/data/pages.ts                 page registry + scale notes
src/data/lessons.ts               per-lesson summary, chapter, cover image
src/content/types.ts              Block / Inline types
src/content/load.ts               getBlocks(slug), sections helpers
src/content/Blocks.tsx            generic block renderer
src/content/images.ts             asset key → webp URL (import.meta.glob)
src/audio/piano.ts                Web Audio engine
src/audio/useSound.ts             React hook (mute state)
src/components/…                  ScaleNav, Header, Footer, PianoKeyboard, Staff,
                                  LessonLayout, Figure, Lightbox, PageTransition
src/pages/Home.tsx, Projects.tsx, Lesson1.tsx … Lesson6.tsx, Conclusion.tsx
src/test/…                        vitest tests
```

---

### Task 1: Scaffold, deploy config, tokens, fonts

**Files:**
- Create: Vite react-ts project at repo root (scaffold in a temp dir, then move files in; keep `content/` and `docs/`), `netlify.toml`, `public/_redirects`, `src/styles/tokens.css`, `src/styles/base.css`, `vitest.config.ts` (or `test` block in `vite.config.ts`), `src/test/setup.ts`, `.gitignore` (node_modules, dist)
- Test: `src/test/deploy.test.ts`, `src/test/fonts.test.ts`

**Interfaces:**
- Produces: CSS variables `--paper --key-white --ink --phuong --pillar --graphite`, `--font-display` (Unbounded), `--font-body` (Be Vietnam Pro), type steps `--step--1 … --step-5`; `npm test`, `npm run build`, `npm run dev` scripts.

- [ ] **Step 1:** Scaffold with `npm create vite@latest <tmp> -- --template react-ts`, move into repo root, `npm i react-router motion lenis @fontsource-variable/unbounded @fontsource/be-vietnam-pro`, `npm i -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom marked sharp`.
- [ ] **Step 2: Write failing tests**
  - `deploy.test.ts`: `public/_redirects` contains a line matching `/^\/\*\s+\/index\.html\s+200$/m`; `netlify.toml` contains `command = "npm run build"` and `publish = "dist"`.
  - `fonts.test.ts`: `src/main.tsx` imports `@fontsource-variable/unbounded` and the Be Vietnam Pro weights 400/600 including the `vietnamese` subset (assert the import strings exist, and that `node_modules/@fontsource-variable/unbounded` ships a file whose name contains `vietnamese`).
- [ ] **Step 3:** Run `npx vitest run` → both FAIL.
- [ ] **Step 4:** Add `_redirects`, `netlify.toml` (`[build] command = "npm run build"`, `publish = "dist"`), font imports in `main.tsx`, tokens from Global Constraints, base styles (body bg `--paper`, color `--ink`, focus ring 3px `--pillar`, `@media (prefers-reduced-motion)` kills CSS animations).
- [ ] **Step 5:** `npx vitest run` → PASS; `npm run build` → succeeds.
- [ ] **Step 6:** `git init`, `git remote add origin https://github.com/NaynCantDev/Huong_Thi_Ha_Vi.git`, commit `chore: scaffold vite react app with netlify config`.

### Task 2: Image pipeline

**Files:**
- Create: `scripts/optimize-images.mjs`, `src/content/images.ts`, copy docx to `public/files/`
- Test: `src/test/images.test.ts`

**Interfaces:**
- Produces: `imageUrl(key: string): string` where key is `"<folder>/<basename-without-ext>"`, e.g. `"bai-1/01-buoc-01"`; throws `Error("Missing image: <key>")` if absent. `imageSize(key): { width: number; height: number }` from a generated `src/assets/img/manifest.json`.

- [ ] **Step 1: Failing test** `images.test.ts`: every file in `content/assets/**` (except `gioi-thieu/03-site-logo.png` and `bai-4/01-drive-thumbnail-bao-cao.png`) has a `src/assets/img/<folder>/<name>.webp`; `manifest.json` has width/height for each; `imageUrl("bai-1/01-buoc-01")` returns a string; `imageUrl("nope")` throws.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Script: sharp, max width 1920 (infographic `bai-5/02-*` max 1600), WebP quality 82, writes manifest. `images.ts` uses `import.meta.glob('../assets/img/**/*.webp', { eager: true, query: '?url', import: 'default' })`. Add `"images": "node scripts/optimize-images.mjs"` script; run it; commit outputs.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: optimized webp images and lookup`.

### Task 3: Content pipeline (verbatim blocks)

**Files:**
- Create: `src/content/types.ts`, `scripts/md-to-blocks.ts`, `src/content/generated/*.json`, `src/content/load.ts`, `src/content/Blocks.tsx`
- Test: `src/test/md-to-blocks.test.ts`, `src/test/blocks.test.tsx`

**Interfaces:**
- Produces:
  ```ts
  type Inline = { t: 'text'; v: string } | { t: 'strong' | 'em'; c: Inline[] } | { t: 'link'; href: string; c: Inline[] } | { t: 'br' };
  type Block =
    | { type: 'heading'; level: 1|2|3|4; id: string; c: Inline[]; align?: 'center' }
    | { type: 'p'; c: Inline[]; align?: 'center' }
    | { type: 'list'; ordered: boolean; start?: number; items: Block[][] }
    | { type: 'image'; key: string; alt: string }
    | { type: 'table'; head: Inline[][]; rows: Inline[][][] };
  convertMarkdown(md: string): Block[]          // in scripts/md-to-blocks.ts, exported for tests
  getBlocks(slug: PageSlug): Block[]           // load.ts
  splitByHeading(blocks: Block[], level: number): { heading: Block | null; blocks: Block[] }[]
  blockText(blocks: Block[]): string           // plain text, for tests and TOC
  <Blocks blocks={Block[]} />                  // renders semantic HTML; tables wrapped in scroll container
  ```
- Rules: HTML comments dropped except `<!-- align: center -->` which sets `align` on the adjacent block; image `../assets/<folder>/<file>.<ext>` → key `<folder>/<file>`; `<br>` in table cells → `{t:'br'}`; escaped `1\.` stays literal text `1.`; heading `id` = slugified text (Vietnamese diacritics stripped, spaces → `-`).

- [ ] **Step 1: Failing tests** (`md-to-blocks.test.ts`): 
  - `convertMarkdown("**Mục tiêu học tập :**")` → `[{type:'p', c:[{t:'strong', c:[{t:'text', v:'Mục tiêu học tập :'}]}]}]` (spacing before colon preserved).
  - `"<!-- align: center -->\n**BÁO CÁO**"` → p with `align:'center'`.
  - `"![](../assets/bai-1/01-buoc-01.png)"` → `{type:'image', key:'bai-1/01-buoc-01', alt:''}`.
  - `"1\\. Mở File Explorer"` → p text `"1. Mở File Explorer"`, not a list.
  - table with `a <br> b` cell → inline contains `{t:'br'}`.
  - Verbatim check for all 9 files: normalized text (collapse whitespace) of `blockText(convertMarkdown(md))` equals normalized text of the md with comments, markdown syntax and image lines stripped.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement with `marked.lexer`; script writes `src/content/generated/<slug>.json` for the 9 slugs; npm script `"content": "node scripts/md-to-blocks.ts"`; run it.
- [ ] **Step 4: Failing test** (`blocks.test.tsx`): rendering `<Blocks>` for each generated page yields `textContent` (whitespace-normalized) equal to `blockText` of those blocks; tables render `<table>` inside an element with `data-scroll-x`.
- [ ] **Step 5:** Implement `Blocks.tsx`, `load.ts`. Run all → PASS.
- [ ] **Step 6:** Commit `feat: verbatim markdown to block pipeline`.

### Task 4: Audio engine

**Files:**
- Create: `src/audio/piano.ts`, `src/audio/useSound.ts`
- Test: `src/test/piano.test.ts`

**Interfaces:**
- Produces:
  ```ts
  noteToMidi(note: string): number          // "C4"→60, "A4"→69, "F#4"→66
  midiToFrequency(midi: number): number     // 69→440
  playNote(note: string, opts?: { velocity?: number; duration?: number }): void
  playChord(notes: string[], opts?: { arpeggio?: number }): void
  isSoundOn(): boolean; setSoundOn(on: boolean): void; subscribeSound(fn: (on: boolean) => void): () => void
  useSound(): { on: boolean; toggle(): void; play: typeof playNote; chord: typeof playChord }
  ```
- AudioContext created lazily on first `playNote`; if sound is off, `playNote` is a no-op and creates nothing. Tone: sum of 3–4 harmonics (sine/triangle), fast attack (~5ms), exponential decay ~1.6s, gentle lowpass ~3.5kHz; master gain ≤ 0.35.

- [ ] **Step 1: Failing tests:** `noteToMidi("C4")===60`, `noteToMidi("F#4")===66`, `midiToFrequency(69)===440`, `midiToFrequency(60)` ≈ 261.63 (2 dp); with a mocked `window.AudioContext` constructor spy: no construction before `playNote`, one construction after two `playNote` calls; `setSoundOn(false)` → `localStorage.getItem('havi-sound')==='off'` and subsequent `playNote` doesn't call oscillator start; default when key missing is on.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: web audio piano engine`.

### Task 5: Page registry, router, shell, transitions

**Files:**
- Create: `src/data/pages.ts`, `src/data/site.ts`, `src/App.tsx`, `src/components/ScaleNav.tsx`, `Header.tsx`, `Footer.tsx`, `PageTransition.tsx`, `src/hooks/useReducedMotion.ts`, `src/hooks/useLenis.ts`, page stubs in `src/pages/*`
- Test: `src/test/pages.test.ts`, `src/test/shell.test.tsx`

**Interfaces:**
- Produces:
  ```ts
  type PageSlug = 'gioi-thieu'|'du-an'|'bai-1'|'bai-2'|'bai-3'|'bai-4'|'bai-5'|'bai-6'|'tong-ket';
  interface PageMeta { slug: PageSlug; path: string; title: string; navLabel: string; note: string; description: string }
  PAGES: PageMeta[]                       // order = Global Constraints routes; notes C4…D5
  getPageByPath(path: string): PageMeta | undefined
  getNeighbors(slug: PageSlug): { prev?: PageMeta; next?: PageMeta }
  SITE: { name; studentId: '2552210219'; major; school; course; lecturer; className?: string; portfolioGoals: { title: string; text: string }[] } // portfolioGoals VIẾT MỚI
  ```
- ScaleNav: 9 small keys (white/black visual rhythm), each a `<Link>` with `aria-label` = page title, `aria-current="page"` on active (filled `--phuong`); clicking plays its note. Header: name "Hà Vi" left, ScaleNav center, sound toggle right (`aria-pressed`). On ≤ 720px ScaleNav stays, labels move to a sheet menu.
- Transitions: `AnimatePresence mode="wait"` keyed by pathname; exit opacity→0, enter y 16→0 + opacity, 350ms; reduced motion → opacity only. Scroll to top on route change. Document title from `PageMeta.title` + " — Vương Thị Hà Vi" via React 19 `<title>`.

- [ ] **Step 1: Failing tests:** `PAGES.length===9`; notes in order `['C4','D4','E4','F4','G4','A4','B4','C5','D5']`; `getNeighbors('bai-1')` → prev `du-an`, next `bai-2`; `getNeighbors('gioi-thieu').prev` undefined; shell render at `/du-an/bai-3` has exactly 9 nav links and the `bai-3` one has `aria-current="page"`; with `matchMedia('(prefers-reduced-motion: reduce)')` mocked true, the page heading is in the document and its computed/inline opacity is not `0`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: router, scale navigation and page transitions`.

### Task 6: Home page (hero keyboard, about, goals)

**Files:**
- Create: `src/components/PianoKeyboard.tsx`, `src/components/Staff.tsx`, `src/pages/Home.tsx` (+ `.module.css`)
- Test: `src/test/keyboard.test.tsx`

**Interfaces:**
- Consumes: `useSound()`, `getBlocks('gioi-thieu')`, `SITE`, `imageUrl`.
- Produces: `<PianoKeyboard from="C4" octaves={2} onNote?={(note) => void} />` with computer keys `a w s e d f t g y h u j k o l p ;` → C4…E5; ignores events with ctrl/meta/alt or `event.repeat`, and when focus is in an input/textarea/contenteditable. Each key is a `<button>` with `aria-label` (e.g. "Đô 4"). On ≤ 480px shows 1 octave.
- Hero: Staff (5 lines `--ink` at 20% opacity) drawn left→right; "Hà Vi" in Unbounded sits on the lines; full name + "Sinh viên Sư phạm Âm nhạc" line; portrait right; keyboard below spanning the content width. Each press: key depresses (scaleY .97 + shade), a note glyph rises from the key onto the staff and fades (skipped under reduced motion). Intro sequence once per session (`sessionStorage` flag).
- Below hero: banner strip (parallax ±40px via `useScroll`, off under reduced motion) opening "Về mình" (verbatim intro paragraphs + facts: Ngành, Trường, MSV, Học phần, Giảng viên; Lớp hidden if empty); "Mục tiêu học tập" and "Định hướng phát triển" (verbatim); "Mục tiêu của Portfolio" (SITE.portfolioGoals); entry to Dự án listing the 6 lessons (titles from `lessons.ts` of Task 7 — stub import fine if Task 7 not done; order Task 7 before 6 if preferred).

- [ ] **Step 1: Failing tests:** pressing `a` calls `onNote('C4')`; `k` → `'C5'`; `ctrl+a` and a repeated `a` (repeat: true) don't call it; clicking the "Đô 4" button calls `onNote('C4')`; Home render contains every paragraph of `blockText(getBlocks('gioi-thieu'))` (normalized) and the course "Nhập môn Công nghệ số và ứng dụng trí tuệ nhân tạo".
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5:** Visual check via dev server in the browser pane at 1440px and 360px: no horizontal scroll (`document.documentElement.scrollWidth <= innerWidth`), Vietnamese diacritics intact in the hero. Fix, then commit `feat: home page with playable keyboard`.

### Task 7: Lesson data, LessonLayout, Figure/Lightbox, Projects page

**Files:**
- Create: `src/data/lessons.ts`, `src/components/LessonLayout.tsx`, `Figure.tsx`, `Lightbox.tsx`, `src/pages/Projects.tsx`
- Test: `src/test/lessons.test.tsx`

**Interfaces:**
- Produces:
  ```ts
  interface LessonMeta { slug: `bai-${1|2|3|4|5|6}`; number: number; chapter: string; chapterInferred?: boolean; title: string;
    summary: string; goal?: string; tools?: string; result?: string; cover?: string /* image key */; newCopy: Array<'summary'|'goal'|'tools'|'result'> }
  LESSONS: LessonMeta[]
  <LessonLayout slug>{children}</LessonLayout>   // header (Bài n + chapter, title, goal/tools/result if present), children, prev/next lesson links labelled with lesson titles
  <Figure imageKey caption? /> // lazy img with width/height from manifest; click opens Lightbox (shared layoutId animation), Esc/close button/backdrop closes, focus returns to the figure
  ```
- Chapters: Bài 1 "Chương 1", Bài 2 "Chương 2", Bài 3 "Chương 3", Bài 5 "Chương 5" (from content); Bài 4 "Chương 4", Bài 6 "Chương 6" with `chapterInferred: true`. Titles/goals taken from each page's own heading/"Mục tiêu" text where present; otherwise written new and listed in `newCopy`.
- Projects ("Tập bản nhạc"): 6 rows, each a staff-like row with lesson number, chapter, title, summary, cover thumbnail; hover/focus plays the lesson's scale note and slides the thumbnail in; whole row is one link.

- [ ] **Step 1: Failing tests:** `LESSONS.length===6` and numbers 1–6; Bài 4/6 `chapterInferred===true`; Projects renders 6 links to `/du-an/bai-1..6`; Lightbox opens on figure click, closes on Escape, and focus returns to the figure button.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: lesson layout, lightbox and projects page`.

### Task 8: Bài 1 and Bài 3

**Files:**
- Create: `src/pages/Lesson1.tsx`, `src/pages/Lesson3.tsx`, `src/components/DynamicsSwitch.tsx`
- Test: `src/test/lesson-1-3.test.tsx`

**Interfaces:**
- Consumes: `getBlocks`, `Blocks`, `Figure`, `LessonLayout`.
- Bài 1: group blocks into steps (each step = text blocks preceding an image + that image). Desktop ≥ 1024px: text column scrolls, image column sticky and crossfades to the active step's image (IntersectionObserver); mobile: text then image inline.
- Bài 3: render all blocks verbatim in order; the 9 screenshots are grouped per task (3 per task) into `<DynamicsSwitch levels={[{mark:'p', label:'Cơ bản'}, {mark:'mf', label:'Cải tiến'}, {mark:'f', label:'Nâng cao'}]}>`; the switch is a radiogroup, arrow keys move, content animates with `layout`. Text blocks around each screenshot stay in source order (the switch shows the image + the prompt text block attached to it; nothing removed).

- [ ] **Step 1: Failing tests:** both pages' normalized textContent contains every normalized paragraph of their `blockText` (verbatim); Bài 1 renders 12 images; Bài 3 renders 3 radiogroups each with 3 radios labelled "p"/"mf"/"f" (accessible names include Cơ bản/Cải tiến/Nâng cao); ArrowRight moves selection.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS. **Step 5:** Commit `feat: lesson 1 steps and lesson 3 dynamics switch`.

### Task 9: Bài 2 and Bài 5

**Files:**
- Create: `src/pages/Lesson2.tsx`, `src/pages/Lesson5.tsx`
- Test: `src/test/lesson-2-5.test.tsx`

- Bài 2: blocks verbatim; tables in horizontal scroll containers with a fade edge; cells whose text is exactly "Cao" or "Khá" get a pill (Cao = `--pillar` tint, Khá = `--graphite` tint) without changing the text; first column sticky on scroll.
- Bài 5: verbatim text; 2 figures with captions; the infographic opens in Lightbox with pan/zoom (pinch on touch, wheel/drag on desktop, reset button).

- [ ] **Step 1: Failing tests:** verbatim text check for both; Bài 2 has 2 tables, each with 10 body rows; Bài 2 has 10+ links with `target="_blank"` and `rel` containing `noopener`; at a 360px container the page root has no element wider than viewport except inside `[data-scroll-x]` (assert table wrapper has `overflow-x: auto`).
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS. **Step 5:** Commit `feat: lessons 2 and 5`.

### Task 10: Bài 4 and Bài 6

**Files:**
- Create: `src/pages/Lesson4.tsx`, `src/pages/Lesson6.tsx`, `src/components/ReadingStaff.tsx`, `src/components/Toc.tsx`
- Test: `src/test/lesson-4-6.test.tsx`

- Bài 4: verbatim report; agenda table also rendered as a vertical timeline (time on the left) on ≥ 768px while the table remains for mobile — text must appear (no duplication in the accessible tree: timeline is the only rendering on desktop, table on mobile via CSS + `aria-hidden` on the hidden one); evidence images as a 3-up gallery with Lightbox; download link `href="/files/Bao_cao_Bai_tap_4_Hoan_chinh.docx"` with `download` attribute and file size label "1,2 MB".
- Bài 6: verbatim essay; sticky TOC (≥ 1024px) from level-2 headings, active section highlighted; `ReadingStaff`: a thin 5-line staff fixed under the header whose filled length = scroll progress (`useScroll`), static under reduced motion.

- [ ] **Step 1: Failing tests:** verbatim checks; Bài 4 download link has `download` attr and correct href; `public/files/Bao_cao_Bai_tap_4_Hoan_chinh.docx` exists; Bài 6 TOC lists the 6 level-2 headings (I–VI) linking to their ids.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS. **Step 5:** Commit `feat: lessons 4 and 6`.

### Task 11: Tổng kết and SEO

**Files:**
- Create: `src/pages/Conclusion.tsx`; Modify: `index.html` (lang="vi", meta description, og:image from banner webp, favicon = a small piano-key SVG)
- Test: `src/test/conclusion.test.tsx`

- Verbatim conclusion text; closing "hợp âm kết": a button "Nghe hợp âm kết" plays `playChord(['C4','E4','G4','C5'], { arpeggio: 0.06 })` and the scale nav lights all 9 keys briefly.
- Each page sets `<title>` and `<meta name="description">` from `PageMeta`.

- [ ] **Step 1: Failing tests:** verbatim check; clicking the chord button calls `playChord` with those notes (mock module); `index.html` has `lang="vi"`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS. **Step 5:** Commit `feat: conclusion page and seo`.

### Task 12: Full review, README, push

**Files:**
- Create: `README.md` (how to run, edit content: re-run `npm run content` / `npm run images`, where new copy lives, deploy settings for Netlify)
- Test: `src/test/verbatim-all.test.tsx`

- [ ] **Step 1:** `verbatim-all.test.tsx`: render every route via `MemoryRouter`; for each of the 9 md sources, every normalized paragraph/list item/table cell text appears in the rendered page text.
- [ ] **Step 2:** `npx vitest run` → all PASS; `npm run build` → PASS; `npx tsc --noEmit` → no errors.
- [ ] **Step 3:** Browser pane, all 9 routes at 1440px and 360px: screenshots, check no horizontal scroll, diacritics, focus ring visible on Tab, sound off until first press, mute persists after reload, reduced-motion emulation leaves content visible. Fix issues.
- [ ] **Step 4:** Commit `docs: readme`; `git branch -M main`; `git push -u origin main`.
