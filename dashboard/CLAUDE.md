# CLAUDE.md

Guidance for Claude Code (and other contributors) working in this project.

## What this is

A content management dashboard with five sections: YouTube channel manager,
analytics, content calendar, competitor tracking, and a news consolidator.
**YouTube channel manager is real** (public channel stats + recent videos,
pulled live from the YouTube Data API v3 — see **YouTube integration**
below). The other four sections are still **placeholder pages** — the
shared shell (sidebar, routing, theme, UI kit) is built out; their data
layer is not.

> **Note on repo location:** this project lives in `/dashboard` inside the
> `single-page-login` repository, not at the repo root. The repo root holds
> an unrelated, pre-existing Meteor package (`client/`, `shared/`,
> `package.js`, its own `README.md`) that predates this project and was
> left untouched. Always `cd dashboard` before running any command below.

## Tech stack

- **Next.js 16** (App Router, React 19, TypeScript, `src/` layout)
- **Tailwind CSS v4** (CSS-first config via `@theme inline` in
  `globals.css` — there is no `tailwind.config.ts`)
- **shadcn/ui** components (New York style, "neutral" base color, Radix
  primitives) — hand-authored, see **Decisions** below for why
- **lucide-react** for icons
- Plain system font stack (no `next/font/google`) — see **Decisions**
- **YouTube Data API v3** for the one real section, via a server-only
  fetch client (`src/lib/youtube.ts`) — no SDK, no OAuth (see **YouTube
  integration**)
- Charts are **hand-built HTML/CSS** (`components/dataviz/`), not a
  charting library — see **Charts**

No backend, database, or state management library is wired up yet. Adding
one is expected future work once a section moves past its placeholder.

## Folder structure

```
dashboard/
├── CLAUDE.md
├── components.json          # shadcn/ui config (style, aliases, base color)
├── src/
│   ├── app/
│   │   ├── layout.tsx        # root layout: <html class="dark">, metadata
│   │   ├── page.tsx           # "/" — redirects to /youtube
│   │   ├── globals.css        # Tailwind v4 theme tokens (dark-only)
│   │   └── (dashboard)/       # route group: pages that share the sidebar shell
│   │       ├── layout.tsx     # renders <Sidebar> + <MobileHeader> + children
│   │       ├── youtube/page.tsx
│   │       ├── analytics/page.tsx
│   │       ├── calendar/page.tsx
│   │       ├── competitors/page.tsx
│   │       └── news/page.tsx
│   ├── components/
│   │   ├── ui/                # shadcn/ui primitives (button, card, sheet, ...)
│   │   ├── layout/             # app chrome: sidebar, mobile header, nav config
│   │   │   ├── nav-items.ts    # single source of truth for sidebar links
│   │   │   ├── sidebar.tsx     # desktop (md+) static sidebar
│   │   │   ├── mobile-header.tsx  # top bar + Sheet-based nav for small screens
│   │   │   └── sidebar-nav.tsx    # shared link list used by both of the above
│   │   ├── dataviz/             # hand-built chart primitives (see "Charts")
│   │   │   └── bar-chart.tsx    # horizontal bar chart, 1 or 2 series
│   │   └── dashboard/          # page-level building blocks for section pages
│   │       ├── page-header.tsx        # icon + title + description row
│   │       ├── placeholder-section.tsx # standard "not built yet" page body
│   │       ├── stat-tile.tsx           # icon + label + value KPI card
│   │       └── youtube/                # components specific to the YouTube page
│   │           ├── channel-header.tsx  # banner + avatar + title card
│   │           ├── video-grid.tsx      # recent-videos thumbnail grid
│   │           ├── setup-notice.tsx    # shown when env vars aren't set
│   │           └── error-notice.tsx    # shown when the API call fails
│   └── lib/
│       ├── utils.ts            # cn() — clsx + tailwind-merge, shadcn convention
│       ├── format.ts           # number/date formatting (compact, full, es locale)
│       └── youtube.ts          # server-only YouTube Data API v3 client
```

The `(dashboard)` route group exists purely to scope the sidebar layout to
the five section pages without adding a URL segment. `/app/page.tsx` sits
outside the group and just redirects to `/youtube`, so a stray top-level
route never needs the sidebar chrome.

## Component conventions

- **`components/ui/`** is shadcn/ui territory: generated-style primitives
  (`Button`, `Card`, `Sheet`, `Badge`, `Avatar`, `Tooltip`, `Separator`,
  `Skeleton`). Treat them as vendor code — prefer composing them over
  editing them, and keep new primitives in this same style (Radix
  primitive + `cva` variants + `cn()`, `data-slot` attributes, forwardless
  function components) if more are added by hand.
- **`components/layout/`** is the app chrome — sidebar, mobile nav, and the
  nav config. It doesn't know about any individual section's content.
- **`components/dashboard/`** is shared UI *for section pages*
  (`PageHeader`, `PlaceholderSection`, `StatTile`). When a section moves
  from placeholder to real, its page-specific components live in their own
  subfolder (e.g. `components/dashboard/youtube/`, following the YouTube
  section's example) rather than growing this shared folder indefinitely.
- **`components/dataviz/`** holds chart primitives shared across sections
  (currently just `BarChart`). See **Charts** below before adding another
  chart type or another charting approach.
- Section pages under `app/(dashboard)/*/page.tsx` stay thin: they set
  `metadata.title` and render one shared component with copy specific to
  that section. Keep that pattern — it's what makes the five pages
  consistent.
- Path alias `@/*` maps to `src/*` (see `tsconfig.json` / `components.json`).
- Use the `cn()` helper from `@/lib/utils` for conditional/merged class
  names instead of manual string concatenation.

### Adding a new section

1. Add an entry to `navItems` in `components/layout/nav-items.ts` (title,
   href, icon, description) — the sidebar (desktop + mobile) picks it up
   automatically.
2. Create `app/(dashboard)/<route>/page.tsx`, export `metadata.title`, and
   render `<PlaceholderSection icon=... title=... description=...
   plannedFeatures={[...]} />` (or real content, once it exists).

## Theming

The dashboard is **dark-mode only, globally, with no toggle**: `<html>` in
`src/app/layout.tsx` hard-codes `className="dark"`. `globals.css` still
defines a full light-mode token set under `:root` for completeness/forward
compatibility, but nothing currently switches to it. If a light/dark toggle
is ever wanted, the token setup already supports it — the work is adding a
theme provider (e.g. `next-themes`) and a toggle control, not touching the
color tokens.

## YouTube integration

The "Canal de YouTube" page (`app/(dashboard)/youtube/page.tsx`) is a real,
data-backed section — everything else is still a placeholder. It reads
**public** channel data only (subscribers, total views, video count, recent
uploads with per-video views/likes/comments) via the **YouTube Data API
v3** using a plain API key. Deliberately **not** OAuth: no Google sign-in,
no consent screen, no token storage — see the "Tipo de datos" decision this
was built against.

- **Config:** two env vars, `YOUTUBE_API_KEY` and `YOUTUBE_CHANNEL_ID` (see
  `.env.example`). Neither is exposed to the client — they're only read
  inside `src/lib/youtube.ts`, which imports the `server-only` package so
  an accidental client-side import fails at build time instead of leaking
  the key into a browser bundle.
- **Data flow:** `getYouTubeChannelData()` calls `channels.list` for the
  channel snippet/statistics/branding, then `playlistItems.list` on the
  channel's uploads playlist, then `videos.list` for per-video statistics
  (view/like/comment counts) — three small requests, well inside the free
  daily quota. Results are typed as a discriminated union
  (`YouTubeFetchResult`: `ok: true` / `not-configured` /
  `api-error`) so the page can render a distinct state for "not set up yet"
  vs. "the API call failed" vs. real data, instead of throwing.
- **Caching:** every request uses `fetch(..., { next: { revalidate: 3600 }
  })` — this is Next's ISR cache, not a database. Per the "solo estado
  actual" decision, there's no historical persistence; the page always
  shows a snapshot that's at most an hour stale.
- **Images:** channel avatars/banners and video thumbnails are served
  straight from YouTube's CDN through `next/image`, so their hostnames
  (`yt3.googleusercontent.com`, `yt3.ggpht.com`, `i.ytimg.com`) are
  allow-listed in `next.config.ts`'s `images.remotePatterns`. Adding
  another Google-hosted image source later means adding its hostname
  there.
- **Empty/error states are first-class**, not afterthoughts:
  `YouTubeSetupNotice` (no env vars — walks through getting an API key and
  channel ID) and `YouTubeErrorNotice` (API call failed — shows the actual
  error message) live next to `ChannelHeader`/`VideoGrid` in
  `components/dashboard/youtube/`. Keep that pattern for any future section
  that calls a real external API.

## Charts

The two YouTube charts ("Vistas por video", "Interacción por video") are
built with `components/dataviz/BarChart` — plain HTML/CSS bar rows, not a
charting library (no Recharts/Chart.js/etc. dependency). Follows this
repo's [dataviz skill] conventions:

- **Colors are the validated palette**, not chosen by eye: series use the
  reference categorical palette's dark-mode slot 1 (blue `#3987e5`) and
  slot 2 (orange `#d95926`), confirmed with the skill's
  `validate_palette.js` script against this app's dark card surface before
  use. If you add a third series anywhere, re-run the validator rather
  than picking a color that "looks fine."
- **One hue for magnitude, color for identity.** The single-series views
  chart uses one flat hue (comparing magnitude); the 2-series
  likes-vs-comments chart uses the two colors specifically to distinguish
  the two series, with a legend (required at 2+ series) and a shared
  0–domainMax axis — never two different scales on one chart.
- **Mark spec:** bars ≤24px thick, 4px rounded corner at the value end and
  square at the baseline, a 2px gap between grouped bars, hairline
  gridlines.
- **Interaction:** each row is focusable/hoverable and shows one tooltip
  with every series' value (not per-bar-segment tooltips) — same content on
  keyboard focus as on mouse hover. A screen-reader-only `<table>` mirrors
  every chart's data so nothing depends on hover to be reachable.
- **RSC boundary gotcha:** `BarChart` is a Client Component
  (`"use client"`) because it needs interaction state. Its parent page is a
  Server Component (it does the YouTube fetch). A Server Component **cannot
  pass a function prop to a Client Component** — React throws at runtime
  ("Functions cannot be passed directly to Client Components"). That's why
  `BarChart` imports `formatCompactNumber` itself instead of taking a
  `valueFormatter` prop from the page — keep that in mind before adding a
  formatter/callback prop to any chart or other client component that a
  server component renders.

[dataviz skill]: this repo doesn't vendor the skill's docs; if you have
Claude Code with the `dataviz` skill available, load it before adding a
new chart type — it covers form selection, the color validator, mark
specs, interaction, and an anti-pattern checklist.

## Decisions made during setup

A few choices here were forced by this sandbox's network policy, which
blocks arbitrary outbound hosts (only npm/PyPI/etc. registries and a short
allowlist are reachable) — worth knowing so they aren't "fixed" by mistake
later in an environment without that restriction:

- **shadcn/ui components are hand-written, not CLI-generated.**
  `npx shadcn init` / `add` calls out to `ui.shadcn.com`, which this
  sandbox's proxy rejected (403). `components.json` is configured as if the
  CLI had run (style `new-york`, base color `neutral`, same aliases), and
  every file under `components/ui/` matches upstream shadcn/ui source for
  that style/version. If the CLI is reachable in your environment, `npx
  shadcn add <component>` should still work normally and land in the same
  place — just check the result against the existing hand-written style
  (`data-slot` attributes, `cva` variant patterns) for consistency.
- **No `next/font/google` (Geist).** `create-next-app` defaults to loading
  Geist from Google Fonts at build time, which also isn't reachable here.
  The layout uses Tailwind's default system font stack via a plain
  `font-sans` class instead. Swap in `next/font/google` or `next/font/local`
  later if you have network access and want a custom typeface.
- **`SquarePlay` instead of a `Youtube` icon.** The installed `lucide-react`
  version (1.34) ships no brand icons (`Youtube`, etc. were removed
  upstream). `SquarePlay` is used as a stand-in for the YouTube nav item;
  swap in an actual brand asset (SVG/PNG) if brand accuracy matters more
  than staying icon-font-only.
- **Route group for shared layout, not a top-level `dashboard/` segment.**
  `(dashboard)` was chosen so the five sections live at `/youtube`,
  `/analytics`, etc. instead of `/dashboard/youtube` — shorter URLs, same
  shared-layout behavior.
- **Mobile nav uses a `Sheet` (Radix Dialog) instead of the shadcn
  `Sidebar` block.** The full shadcn "sidebar" block (collapsible,
  cookie-persisted state, keyboard shortcut) was more machinery than a
  placeholder-stage dashboard needs. `Sidebar` + `MobileHeader` +
  `SidebarNav` give the same visual result (fixed desktop sidebar,
  slide-over on mobile) with far less code. Revisit if collapse/persist
  behavior becomes a real requirement.
- **YouTube: public API-key data, no historical persistence.** Two scope
  decisions made explicitly, not defaults: (1) public channel/video stats
  via an API key rather than the YouTube Analytics API via OAuth — much
  less setup (no consent screen, no token storage) at the cost of not
  having private metrics like watch time or traffic sources; (2) charts
  show the current snapshot only, no day-over-day trend — avoids needing a
  database and a scheduled job to collect daily snapshots. If either
  requirement shows up later, both are addable without re-architecting:
  OAuth would replace `src/lib/youtube.ts`'s API-key fetch with a token
  flow, and historical charts would add a small persistence layer that
  writes a snapshot on a cron/route-handler hit.

## Commands

Run from inside `dashboard/`:

```
npm run dev      # start dev server
npm run build    # production build (also runs the TypeScript check)
npm run start    # serve the production build
npm run lint     # eslint
```
