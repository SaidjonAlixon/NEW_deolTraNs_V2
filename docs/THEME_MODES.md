# Theme modes (Day / Night)

## Overview

The site supports **two** appearance modes, selected via the toggle in the header (sun / moon):

| Mode | Description |
|------|-------------|
| **Day** | Light backgrounds, dark body text on sections outside the hero video; header and UI tuned for contrast. |
| **Night** | Dark navy shell and light text (original Delo Trans dark look). |

Choice is stored in `localStorage` under key `delo-theme` (`day` or `night`). A small inline script in `index.html` applies `data-theme` on `<html>` before React loads to reduce flash. Older saved value `default` is treated as `night`.

## Technical

- **CSS:** `src/index.css` — `:root`, `html[data-theme="night"]`, and `html:not([data-theme])` share the dark tokens; `html[data-theme="day"]` defines the light palette.
- **Tailwind:** `app`, `app-deep`, `surface`, `header-bar` map to those variables (`tailwind.config.js`).
- **React:** `ThemeProvider` + `useTheme()` in `src/context/ThemeContext.tsx`; `ThemeModeToggle` in the header (two buttons).
- **Sections:** Semantic `bg-app` / `bg-surface` / gradients so both themes apply site-wide.
- **Hero:** `data-hero-section` — day-mode text overrides skip this section.
- **Driver Application modal:** Uses the same CSS variables as the rest of the site.

## Uzbek (qisqa)

- **Kunduzgi:** yorug‘ fon, qora matn (hero videoda oq yozuv saqlanadi).
- **Kechki:** qorong‘i sayt ko‘rinishi (asosiy tema).

---

## English (short)

Two `data-theme` values: `day` | `night`. Default when unset or invalid is **night**.
