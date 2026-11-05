# Pradeep Singh — Portfolio

A static single-page website. No build step and no dependencies: plain HTML, CSS and JavaScript.

```
index.html              Page content
styles.css              All styling (light + dark mode)
script.js               Animations: gradient, marquee, counters, chat, menu
assets/
  pradeep-singh.jpg     Profile photo
  og-image.jpg          Preview image shown when the link is shared
  favicon.svg           Browser tab icon
  apple-touch-icon.png  iPhone home-screen icon
  fonts/                Anton + Inter (self-hosted, no Google Fonts call)
```

## Preview on your computer
Double-click `index.html`, or run this inside the folder and open http://localhost:8000
```
python3 -m http.server 8000
```

## Deploy (all free)

### Option 1: Netlify Drop (easiest, about 1 minute)
1. Unzip this folder.
2. Go to https://app.netlify.com/drop and sign in.
3. Drag the unzipped folder onto the page. You get a live link immediately.
4. Under Site configuration → Change site name, pick something like `pradeepsingh` → `pradeepsingh.netlify.app`.

### Option 2: GitHub Pages
1. Create a GitHub repository named `<your-username>.github.io`.
2. Upload all files (keep the `assets` folder).
3. Settings → Pages → Deploy from branch → `main` / root → Save.
4. Live at `https://<your-username>.github.io` within a couple of minutes.

### Option 3: Vercel
1. Put the files in a GitHub repository.
2. On https://vercel.com: Add New → Project → import the repo → Deploy.

## After deploying
- In `index.html`, change `og:image` to the full address, for example
  `https://pradeepsingh.netlify.app/assets/og-image.jpg`, so LinkedIn and WhatsApp previews show the image.
- Optional: buy a domain (e.g. `pradeepsingh.in`) and connect it in your host's domain settings. HTTPS is free on all three hosts.

## Editing
- Photo: replace `assets/pradeep-singh.jpg` (portrait, about 2:3).
- Text: edit `index.html`.
- Colours: change `--brand`, `--brand-2`, `--pink` and `--amber` at the top of `styles.css`.
