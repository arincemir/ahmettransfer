# Ahmet Transfer — Website

Premium, multi-language (EN/TR/NO/DE/RU) static website for an Alanya airport-transfer,
rent-a-car and boat-trip business. Plain HTML + CSS + vanilla JS — no build step.
Just open any `.html` file in a browser.

## File map
- `index.html` … `contact.html` — the 9 pages (each is standalone, full HTML).
- `assets/style.css` — all styling + design tokens (colors, fonts) at the top in `:root`.
- `assets/i18n-data.js` — ALL website text, in 5 languages. Edit text here, not in the HTML.
- `assets/main.js` — behaviour. **Business details (phone, WhatsApp, email) live in `CONFIG` at the top.**
- `assets/logo.svg` — the logo.
- `sitemap.xml`, `robots.txt` — SEO.

## How to change things
- **Phone / WhatsApp / email** → `assets/main.js`, the `CONFIG` object (one place, used everywhere).
- **Any visible text** → `assets/i18n-data.js`. Find the key (e.g. `"hero.title"`) and edit it
  in each language block (`en`, `tr`, `no`, `de`, `ru`). Missing keys fall back to English.
- **Colors / fonts** → `assets/style.css`, the `:root` variables (e.g. `--gold`, `--navy-900`,
  `--f-display`).
- **Prices** → text lives in `i18n-data.js` under the `price.*` keys.
- **Add a real photo** → replace any `<div class="ph">…</div>` placeholder with
  `<img src="assets/your-photo.jpg" alt="…">`. Put images in `assets/`.

## Notes
- The booking & contact forms open a pre-filled WhatsApp chat (no backend needed).
- Default language is English; change `CONFIG.defaultLang` to `"tr"` etc. if you prefer.
- Replace `ahmettransfer@hotmail.com` in `CONFIG` if the address is different.
