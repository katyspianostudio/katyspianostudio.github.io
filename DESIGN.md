# Design System — Yang Chen Piano Studio

## Character

Conservatory-trained restraint. The site should read like a printed concert program or a museum wall card, not a marketing landing page. Weight comes from typography and considered whitespace, never from ornament. When in doubt, remove rather than add.

---

## Palette

| Token | Hex | Role |
|---|---|---|
| `--ivory` | `#faf7f2` | Primary page background |
| `--cream` | `#f3ede2` | Alternate section background |
| `--warm-bg` | `#ece4d4` | Hero gradient warmth |
| `--charcoal` | `#1f1b16` | Body text, dark-section background |
| `--charcoal-soft` | `#3a342d` | Prose copy |
| `--muted` | `#7a7268` | Captions, fine print, role labels |
| `--line` | `#d9d2c5` | Hairline rules, section borders |
| `--burgundy` | `#7a1f2b` | Primary accent — eyebrows, links, primary buttons |
| `--burgundy-dark` | `#5a141d` | Hover states |
| `--gold` | `#b8860b` | Used very sparingly — caption rule, eyebrows on dark sections, links on dark sections |

Burgundy carries the brand. Gold is the accent **of the accent** — never a primary surface, only one decorative beat per region.

---

## Typography

- **Serif**: `Cormorant Garamond` → `Noto Serif SC` → `Songti SC` → Georgia. Used for hero title, section titles, portrait name.
- **Sans**: `Inter` → system → `PingFang SC` / `Microsoft YaHei`. Used for body copy, nav, buttons, eyebrows, small-caps roles.

### Hierarchy

| Element | Family | Size | Weight | Tracking | Case | Color |
|---|---|---|---|---|---|---|
| Hero title | serif | `clamp(36, 5vw, 60)px` | 500 | `-.01em` | Sentence | `--charcoal` |
| Section title | serif | `clamp(30, 4vw, 44)px` | 500 | `-.005em` | Sentence | `--charcoal` |
| Section eyebrow | sans | 12px | 600 | `.25em` | UPPER | `--burgundy` (on dark: `--gold`) |
| Sub-section eyebrow | sans | 11px | 600 | `.22em` | UPPER | `--muted` |
| Body / prose | sans | 16–17px | 400 | normal | Sentence | `--charcoal-soft` |
| Caption role | sans | 11px | 500 | `.28em` | UPPER | `--muted` |

Chinese serif (`Noto Serif SC` / `Songti SC`) takes weight 600 in the hero title for visual parity with the heavier English serif.

**Eyebrow hierarchy:** Section eyebrows (one per section) carry brand color — `--burgundy` on light, `--gold` on dark. Sub-section eyebrows inside a section (e.g. *Education / Performance / Affiliations* groups in the About bio) step down to `--muted` so burgundy stays precious and the section heading remains the loudest mark.

---

## Portrait Treatment (canonical)

The hero headshot is the marquee design moment. Treat it as a concert-artist roster card.

**Three locked-in decisions:**

1. **No frame line.** Do not surround the image with an offset rectangle, double rule, gilt frame, or ornamental border. The portrait stands on its own.
2. **Layered shadow only.** Four stacked drop shadows provide depth:
   ```
   0  1px   2px rgba(31,27,22,.05)
   0  8px  18px rgba(31,27,22,.08)
   0 28px  56px rgba(31,27,22,.16)
   0 52px 100px rgba(31,27,22,.12)
   ```
3. **Caption is engraved, not handwritten.** Three-line structure:
   - Name — serif, 22px, weight 500, charcoal, near-zero letter-spacing
   - Gold rule with center diamond — two 32px hairlines (`--gold` at ~55% opacity) flanking a `⋄` glyph
   - Role — sans, 11px, weight 500, `.28em` tracking, uppercase, `--muted`
   - Chinese fallback for the role line: serif italic, 14px, `.15em` tracking (CJK doesn't accept `text-transform: uppercase`)

**Image specs:** 4:5 vertical aspect ratio, cropped tight enough to lead with the face. Source lives at `assets/portrait.jpg`.

---

## Recital Sections (canonical)

Each recital lives in one `<article class="recital">` inside `#performances`. Recitals with a flyer use **two stacked galleries**, not a single mixed grid:

1. **Flyer banner** — `<div class="gallery gallery-banner">`, single item, centered, natural aspect ratio preserved. This is the only place a poster shows full art.
2. **Photo grid** — `<div class="gallery">` with the candids. Every cell is **locked to 4:3** via `aspect-ratio: 4 / 3` on the `<picture>` wrapper. Mixed-orientation originals (portrait + landscape) center-crop to 4:3 with `object-fit: cover`. The full image opens in the lightbox on click.

**Why aspect-ratio belongs on `<picture>`, not `<img>`:** the `width`/`height` HTML attributes on an `<img>` set intrinsic ratio. With CSS `aspect-ratio` also on the img, browsers honor the HTML attrs and portrait cells render too tall, leaving ivory bands above and below landscape neighbors. Hoisting the rule to the wrapper element wins unambiguously.

### Asset layout

Folder convention: `assets/recitals/<year>/`. For each photo, ship four files:

| Suffix | Purpose | Width |
|---|---|---|
| `name.jpg` + `.webp` | Full size — referenced by lightbox `data-img` | ~1280px |
| `name-480.jpg` + `.webp` | Grid thumbnail | 480px |

Unprocessed source files (raw camera JPGs, anything wider than ~1280px) go in `assets/recitals/<year>/_originals/` and are **not** referenced by the page. The folder is kept for archival, not deployment.

---

## Layout

- **Container:** `1180px` max width, `24px` horizontal gutters
- **Hero grid:** `1.3fr / 1fr` (copy / portrait). Do not narrow the portrait column further — this ratio is balanced and was chosen deliberately.
- **Section vertical padding:** `100px`
- **Section background rhythm:** *hero (ivory→cream gradient)* → about (cream) → teaching (dark) → services (ivory) → performances (cream) → policy (cream) → contact (dark). The hero's gradient flows into a cream About so the dark Teaching section lands with full contrast; alternation supplies rhythm and no extra dividers are needed.
- **Radii:** `2–4px` only. Never pill-shaped or heavily rounded.

---

## What to avoid

These directions have been tried and rejected — they fight the design's character. Don't reintroduce them without an explicit ask:

- Offset / asymmetric decorative frame lines around the portrait
- Double-line "gilt frame" treatments (burgundy + gold combined rules)
- Ornamental section dividers (gold fleurons centered between sections)
- Narrowing the hero portrait column below `1.3fr / 1fr`
- "Vintage" / "aged paper" / sepia treatments — target is **restrained modern classic**, not antique

---

## What to lean into

- Refine typography before adding any visual element
- Spend hierarchy on whitespace, not ornament
- Keep gold precious — one beat per region, never structural
- Bilingual parity: every visible label, button, and caption must have an `.lang-en` and `.lang-zh` span
- Hairlines (`1px`, `--line` or `--gold @ 55%`) over thick rules

---

## Files

- `index.html` — primary site, loads `styles.css` and `script.js`.
