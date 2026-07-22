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