# Personal Portfolio

A minimalist, performance-focused personal portfolio showcasing my work, projects, technical writing, and continuous learning journey in cybersecurity and technology.

**Live Website:** https://kalunkheparshuram.github.io/

---

## About

This portfolio serves as a central hub for everything I build and learn.

Instead of using a traditional CMS, the website is designed around simplicity and maintainability. Blog posts, galleries, and projects are managed through GitHub repositories, allowing content to be updated without modifying the site's core structure.

The project reflects my interest in cybersecurity, Linux, networking, automation, and modern web development while maintaining a clean, lightweight user experience.

---

## Features

- Responsive minimalist design
- Dynamic Markdown blog system
- GitHub-powered content management
- Photography gallery loaded from GitHub
- Project showcase
- Skills and certifications
- Fast-loading static website
- Mobile-friendly layout
- Lightweight vanilla JavaScript implementation
- CDN-powered image delivery using jsDelivr

---

## Technology Stack

### Frontend

- HTML5
- CSS3
- JavaScript (Vanilla)

### Hosting

- GitHub Pages
- GitHub API
- jsDelivr CDN

### Content

- Markdown
- GitHub Repositories

---

## Repository Structure

```
.
├── assets/
├   ├── css/
├   ├── js/
├── gallery/
├── index.html
└── README.md
```

---

## Blog System

The website automatically loads Markdown blog posts directly from GitHub.

Each blog follows the format:

```
---
slug: blog-name
title: Blog Title
date: YYYY-MM-DD
tags: tag1, tag2, tag3
---

# Blog Title

Content goes here...
```

Publishing a new article is as simple as adding another `.md` file to the blog repository.

---

## Gallery

Images are organized by category inside a GitHub repository.

Example:

```
gallery/
├── nature/
├── linux/
├── photography/
├── sky/
└── motorcycle/
```

The website retrieves the folder structure using the GitHub API and serves images through the jsDelivr CDN.

---

## Security & Rate Limits

**Content Security Policy (CSP)**
A `Content-Security-Policy` meta tag in `index.html` (this is the main lever available on GitHub Pages, since it can't set real HTTP response headers):
- `script-src 'self'` — only your own JS files can run; no inline `<script>` tags, no third-party scripts, no injected script execution even if something got XSS'd in
- `style-src 'self' 'unsafe-inline'` — your CSS plus the handful of inline `style=""` attributes already in the HTML
- `img-src 'self' https://cdn.jsdelivr.net data:` — images only from your own site or the jsDelivr CDN
- `connect-src 'self' https://data.jsdelivr.com https://cdn.jsdelivr.net https://formsubmit.co` — `fetch()` calls restricted to exactly the three hosts the site actually talks to
- `form-action https://formsubmit.co` — even if the JS failed and the form fell back to a native submit, it could only go to FormSubmit
- `object-src 'none'` — no Flash/plugin embeds
- `frame-ancestors 'none'` — your site can't be iframed by someone else (clickjacking protection)
- `base-uri 'self'` — blocks a classic injection trick of rewriting `<base href>` to hijack relative URLs

**Referrer policy**
`strict-origin-when-cross-origin` meta tag — external sites you link to don't get your full URL path in their referrer logs, just the origin.

**No direct third-party API exposure**
Both `gallery.js` and `post.js` talk only to jsDelivr, never `api.github.com`. Besides fixing the rate-limit problem, this also means your site has one fewer external API surface with its own auth/abuse considerations.

Why: `api.github.com`'s unauthenticated REST API is capped at 60 requests/hour *per visitor IP*, shared across every site that visitor's IP touches that day (offices, campuses, VPNs, coffee shops). The old approach made one request per gallery category folder, so it was easy to exhaust. jsDelivr's Data API (`data.jsdelivr.com`) returns a repo's entire file tree in a single cached request and isn't subject to that limit, and `cdn.jsdelivr.net` serves the actual file bytes (images and raw Markdown) from the CDN edge instead of GitHub's raw file server.

- Listing: `https://data.jsdelivr.com/v1/packages/gh/<user>/<repo>@<branch>`
- Content: `https://cdn.jsdelivr.net/gh/<user>/<repo>@<branch>/<path>`

**Output escaping (XSS prevention)**
- Gallery: filenames get run through `escapeHTML()` before being dropped into `innerHTML` as captions/alt text — so a maliciously named file (`<img src=x onerror=alert(1)>.jpg`) can't inject markup.
- Blog: the markdown renderer escapes `< > &` from the raw file *before* converting markdown syntax to HTML, so post content can't smuggle in arbitrary tags.

**Link safety**
Every external link (GitHub, LinkedIn, Instagram, project repos, demos) uses `target="_blank" rel="noopener noreferrer"` — prevents the linked page from getting a handle on `window.opener` (a real, exploitable bug class) and strips referrer leakage. The `mailto:` link had `target="_blank"` removed since it doesn't apply there.

**Contact form hardening**
- Client-side validation blocks obvious HTML/`javascript:` payloads in name/message before submission
- Submission goes through `fetch()` with `e.preventDefault()` always set — never a real page navigation — which also happens to fix the double-submit-on-refresh issue from earlier
- A honeypot field (`_honey`) is included for basic bot filtering (FormSubmit convention)
- Server-side, FormSubmit still does its own spam/captcha handling — client-side checks are UX, not the real security boundary

**What's *not* covered (worth knowing)**
- CSP via `<meta>` can't set `X-Frame-Options`, `X-Content-Type-Options`, or `Strict-Transport-Security` — those need real headers, which GitHub Pages doesn't support. If you ever move to Cloudflare Pages, Netlify, or put Cloudflare in front of GitHub Pages, you could add those.
- FormSubmit itself is a third-party service — your form data passes through their servers before reaching your inbox. That's an inherent trust dependency, not something fixable from your side.
- No server-side validation exists (it's a static site) — all form/content validation is client-side, so it's a UX safeguard, not a hard security boundary.

**Cache note:** jsDelivr caches aggressively at the edge, so a freshly-pushed post or photo may take a moment to appear. Force it immediately by opening `https://purge.jsdelivr.net/gh/<user>/<repo>@<branch>/` once after pushing.

---

## Projects

Projects are managed inside a JavaScript array and support:

- Project screenshots
- GitHub repository links
- Live demo links
- Technology tags
- Responsive project cards

---

## Design Philosophy

The website follows a simple philosophy:

> Remove unnecessary complexity and let the work speak for itself.

Rather than relying on heavy frameworks or excessive animations, the focus is on readability, performance, and maintainability.

---

## Future Improvements

- Searchable blog archive
- Project filtering
- Dark/light theme switcher
- RSS feed
- Better Markdown rendering
- Automatic GitHub project sync
- Interactive cybersecurity write-ups
- Homelab documentation
- Security research archive

---

## Local Development

Clone the repository:

```
git clone https://github.com/kalunkheparshuram/kalunkheparshuram.github.io.git
```

Open the project with your preferred editor and run a local development server.

Example using VS Code Live Server.

---

## License

This project is licensed under the GNU GPL v3.0 License.

---

## Connect

- GitHub: https://github.com/kalunkheparshuram
- LinkedIn: https://www.linkedin.com/in/parshuramkalunkhe
- Email: parshuramkalunkhe@proton.me

---

> "A portfolio is never finished. It evolves with every project, every lesson, and every challenge solved."