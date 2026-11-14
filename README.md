# Ahmed Abdullateef — Portfolio

Static site, no build step. The deployable folder is `public/`
(`vercel.json` and `netlify.toml` already point at it).

## What to edit
- `public/config.js`   — all text content: about, experience, skills, interests, contact, links.
- `public/projects.js` — projects. Empty on purpose; the section shows an empty state until you add entries.
  Put project images in `public/assets/projects/`.
- **CV** — place your PDF at `public/assets/Ahmed-Abdullateef-CV.pdf` (exact name).
  The site checks the file exists: if yes, the CV buttons download it; if not, they read "Request CV" and open an email.
- **Contact form** — set `contact.formEndpoint` in `config.js` (e.g. a Formspree URL) for in-page sending.
  While empty, the form opens the visitor's email app.
