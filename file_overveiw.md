# Arabic Wedding Invitation — File Overview

## Purpose

This project is a single-page Arabic wedding invitation built with Next.js and exported as a static site for GitHub Pages.

The page keeps the established botanical artwork, background, composition, colors, and typography system. The animated writing effect is limited to the two couple names on the bride/groom scene.

## Correct family names

The family scene now displays these exact lines, with no slash character:

1. `دكتور محمد محروس حسب`
2. `دكتور مهندس محمد عثمان إبراهيم`

## Main project structure

- `src/app/page.tsx` — application entry point.
- `src/components/invitation/InvitationExperience.tsx` — invitation scene orchestration, envelope interaction, scene transitions, and writing-animation timing.
- `src/components/invitation/scenes.tsx` — the Arabic invitation content and scene markup, including the family names above.
- `src/styles/invitation.css` — layout, responsive styling, typography, animation styles, colors, and stage sizing.
- `src/lib/assets.ts` — centralized asset paths with the `/awedding` production prefix.
- `public/textures/` — botanical and invitation artwork assets, including the refined burgundy quill asset.
- `public/fonts/` — locally bundled Arabic font files.
- `.github/workflows/deploy-pages.yml` — GitHub Pages build and deployment workflow.

## Scene sequence

1. The invitation envelope appears.
2. After opening, the invitation scenes transition at the deliberately slowed timeline speed.
3. Supporting labels remain static or fade in softly.
4. `عبدالرحمن` is revealed first.
5. After a short pause, `ريم` is revealed.
6. The final invitation composition remains visible.

Arabic words are rendered as complete, properly shaped text. They are not split into individual Arabic characters. The pen position and ink reveal use the same progress source so the nib remains connected to the writing edge.

## Fonts and typography

The project uses local Arabic fonts first, followed by compatible system fallbacks.

### Local font faces

- `ArabicText` — loaded from `public/fonts/arabtype.ttf`.
- `ArabicDisplay` — loaded from `public/fonts/aldhabi.ttf`.

In production, the browser requests these fonts through `/awedding/fonts/...`; during local development, the same files are available through `/fonts/...`.

### CSS font roles

- Body and supporting text: `ArabicText`, `Arabic Typesetting`, `Amiri`, `Noto Naskh Arabic`, `Times New Roman`, serif.
- Display and large names: `ArabicDisplay`, `ArabicText`, `Arabic Typesetting`, `Amiri`, `Noto Naskh Arabic`, serif.
- UI and utility fallback text: `Tahoma`, Arial, sans-serif where appropriate.

Arabic layout uses right-to-left direction. The text rendering settings preserve Arabic ligatures, contextual shaping, kerning, and standard character alternates. The names remain complete text nodes so browser Arabic shaping is never broken by character-by-character animation.

## Literal viewport and stage sizing

The invitation is designed as a portrait 9:16 stage inside the available browser viewport.

The outer invitation uses:

```css
.invitation {
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
}
```

The inner stage uses:

```css
.stage {
  width: min(100vw, calc(100dvh * 9 / 16));
  height: min(100dvh, calc(100vw * 16 / 9));
  aspect-ratio: 9 / 16;
}
```

This means:

- `100vw` is the literal viewport width in CSS pixels.
- `100dvh` is the dynamic viewport height in CSS pixels, adapting to mobile browser chrome.
- The stage never exceeds the viewport.
- The stage keeps an exact 9:16 portrait ratio.
- `cqw` means 1% of the stage width.
- `cqh` means 1% of the stage height.

### Literal examples

| Browser viewport | Calculated stage size |
| --- | --- |
| `390 × 844 px` mobile portrait | `390 × 693.33 px` |
| `768 × 1024 px` tablet | `576 × 1024 px` |
| `1440 × 900 px` desktop | `506.25 × 900 px` |

The stage is centered inside `.stage-frame`. Desktop adds presentation shadowing at the existing breakpoint, while the stage dimensions and composition remain unchanged.

## Responsive typography

The larger text sizing is responsive rather than a fixed desktop-only enlargement. Important invitation copy uses `clamp(...)` together with stage container units (`cqw` and `cqh`) so the names and family lines scale with the portrait card on desktop, tablet, and mobile.

The two couple names remain deep burgundy, large, and balanced against each other. Supporting labels stay visually secondary.

## Deployment

The project uses Next.js static export and is deployed by GitHub Actions to GitHub Pages:

- Repository: `https://github.com/imahrous13/awedding`
- Live site: `https://imahrous13.github.io/awedding/`
- Production base path: `/awedding`
- Export directory: `out/`

## Verification

The production build is verified with:

```text
npm run build
```

The build must compile successfully, generate the static `/` route, and export the site into `out/` before deployment.
