# CLAUDE.md

Guidance for Claude Code (and other contributors) working in this project.

## What this is

A content management dashboard with five sections: YouTube channel manager,
analytics, content calendar, competitor tracking, and a news consolidator.
Every section is currently a **placeholder page** — the shared shell
(sidebar, routing, theme, UI kit) is built out; the data layer for each
section is not.

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
│   │   └── dashboard/          # page-level building blocks for section pages
│   │       ├── page-header.tsx        # icon + title + description row
│   │       └── placeholder-section.tsx # standard "not built yet" page body
│   └── lib/
│       └── utils.ts            # cn() — clsx + tailwind-merge, shadcn convention
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
  (`PageHeader`, `PlaceholderSection`). When a section moves from
  placeholder to real, its page-specific components should live next to it
  (e.g. `components/dashboard/youtube/`) rather than growing this shared
  folder indefinitely.
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

## Commands

Run from inside `dashboard/`:

```
npm run dev      # start dev server
npm run build    # production build (also runs the TypeScript check)
npm run start    # serve the production build
npm run lint     # eslint
```
