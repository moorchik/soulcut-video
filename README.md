# Soulcut Video — Wedding Film Editing

A modern, cinematic one-page website for a wedding video editing service.

## Publish online (GitHub Pages)

See **[GITHUB_DEPLOY.md](GITHUB_DEPLOY.md)** for step-by-step instructions in Ukrainian to host this site for free on GitHub Pages.

## Run locally

Open `index.html` in a browser, or use a local server:

```bash
npx serve .
# or: python -m http.server 8000
```

## Replacing videos and images

- **Hero background:** Edit the `<video>` and `<source>` inside `.hero-video-wrap` in `index.html`. Update the `poster` attribute for the fallback image.
- **Portfolio:** Each `.portfolio-thumb` has:
  - `data-video-src` — URL used for the modal player and hover preview
  - Optional `<video class="portfolio-thumb-video">` — hover preview (same URL as `data-video-src`)
  - `<img>` — thumbnail image (replace `src` and `alt`)
- **Contact:** Update the email in the form section and in `script.js` (mailto fallback). Replace WhatsApp/Telegram links with your real URLs.

## Structure

- `index.html` — All sections (hero, portfolio, services, about, contact)
- `styles.css` — Dark theme, animations, glow effects, responsive layout
- `script.js` — Nav scroll, mobile menu, video modal, portfolio filters, hover preview, form

## Customization

- **Colors:** Edit CSS variables in `:root` in `styles.css` (e.g. `--accent`, `--bg`).
- **Fonts:** Swap the Google Fonts link in `index.html`; adjust `--font-display` and `--font-body` in CSS.
