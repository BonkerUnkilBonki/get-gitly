# Gitly — Website

The official landing page for **Gitly** (OneGit): your GitHub, beautifully yours.
Built with the app's own design system — `app.css` is the app's stylesheet,
unchanged, so the site's cards, pills, glows, themes and accents are identical
to the Android app and Gitly Web.

## What's on the page

- Frosted pill navigation and 32-point rounded cards, exactly like the app
- Phone mockups rendered with the app's real component styles
- A "Make it yours" section: theme (Light / Dark / Pitch), 8 accent colours
  and a glow switch — they restyle the whole page and are remembered on the
  device (same behaviour as the app's Settings)
- Automatic dark mode: with no saved choice, the site follows the system
  `prefers-color-scheme` in real time (and a `?theme=` URL param can
  pre-theme any link)
- Android home-screen widget showcase (Profile, Quick, Contributions 2x2 / 4x4 / 4x2)
- Download cards pointing at the GitHub releases page and the source repo

## File map

| File | Purpose |
|---|---|
| `index.html` | The landing page |
| `site.css` | Landing layout layer (loads after `app.css`) |
| `app.css` | The app's own stylesheet (unchanged) |
| `site.js` | Theme/accent/glow controls, heatmap mocks, reveals |
| `fonts/OneGitSans.ttf` | App typeface |
| `icon.svg`, `logo.jpg` | Icons |
| `.nojekyll` | Tells GitHub Pages to serve files as-is |

## Customising

- **Download links** — search `index.html` for `BonkerUnkilBonki/OneGit` and
  replace with your repo / deployment URLs if they ever move.
- **Hero avatar** — pulls `https://github.com/BonkerUnkilBonki.png` with a
  fallback to `logo.jpg`. Change the `src` in the hero phone to use another
  account.
- **Colours / copy** — everything is in `index.html` and `site.css`; the design
  tokens (accents, themes, glow) live in `app.css`.

## Run locally

Any static file server works:

    python3 -m http.server 8000

then open http://localhost:8000.

## Deploy on GitHub Pages

1. Create a repository (e.g. `gitly-site`), upload the contents of this folder
   (everything, including `.nojekyll`).
2. Settings → Pages → Build and deployment → Source: **Deploy from a branch**,
   branch `main`, folder `/(root)`.
3. Your site goes live at `https://<your-username>.github.io/gitly-site/`.

For a top-level site (`https://<your-username>.github.io/`), name the repo
exactly `<your-username>.github.io`. A custom domain works too: Settings →
Pages → Custom domain, and add a `CNAME` file with the domain.
