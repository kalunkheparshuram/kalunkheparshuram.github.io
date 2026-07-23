/* ===================== skills + projects + gallery ===================== */

(function () {
  const SKILLS = {
    "Security Domains": ["Web Application Security", "Bug Bounty Hunting", "Security Research", "Vulnerability Assessment", "Penetration Testing", "OWASP Top 10", "API Security", "Responsible Disclosure"],
    "Bug Bounty Platforms": ["HackerOne", "Bugcrowd", "OpenBugBounty"],
    "Security Tools": ["Burp Suite", "Nmap", "OWASP ZAP", "ffuf", "nuclei", "subfinder", "httpx", "amass"],
    "Development & Utilities": ["Python", "Linux", "Git", "GitHub"]
  };
  const grid = document.getElementById("skills-grid");
  Object.entries(SKILLS).forEach(([category, skills]) => {
    skills.forEach(skill => {
      const c = document.createElement("div");
      c.className = "skill-cell";
      c.innerHTML = `<div class="k">${category}</div><div class="v">${skill}</div>`;
      grid.appendChild(c);
    });
  });

  const PROJECTS = [
    // https://cdn.jsdelivr.net/gh/<user>/<repo>@<branch>/<path>
    { title: "media-dl", desc: 'Small self-hosted Flask app around yt-dlp (video/audio) and gallery-dl (images/galleries) for downloading from various platforms.', tech: ["python", "ffmpeg", "yt-dlp","galley-dl"], repo: "https://github.com/kalunkheparshuram/media-dl", demo: "#", imgURL:"https://cdn.jsdelivr.net/gh/kalunkheparshuram/media-dl@main/screenshots/media-dl.png" },
    { title: "i3wm - rice", desc: "A lightweight Linux environment built around one principle: the computer should adapt to the operator, never the other way around.", tech: ["linux", "bash", "c"], repo: "https://github.com/kalunkheparshuram/i3wm", demo: "#", imgURL:"https://cdn.jsdelivr.net/gh/kalunkheparshuram/i3wm@main/assets/screenshots/debian_linux.png" }
  ];
  const pgrid = document.getElementById('proj-grid');
  PROJECTS.forEach(p => {
    const el = document.createElement('div');
    el.className = 'proj-card';
    const imgHTML = p.imgURL ? `<img alt="${p.title}">` : `[ IMAGE PLACEHOLDER ]`;
    el.innerHTML = `
      <div class="proj-img${p.imgURL ? ' loading img-skeleton' : ''}">${imgHTML}</div>
      <div class="proj-body">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="tech-row">${p.tech.map(t => `<span>${t}</span>`).join('')}</div>
        <div class="proj-links"><a href="${p.repo}" target="_blank" rel="noopener noreferrer">GitHub →</a> ${p.demo && p.demo !== "#" ? `<a href="${p.demo}" target="_blank" rel="noopener noreferrer">Live Demo →</a>`: ""}</div>
      </div>`;

    if (p.imgURL) {
      const imgEl = el.querySelector('.proj-img img');
      const wrapEl = el.querySelector('.proj-img');
      imgEl.addEventListener('load', () => {
        imgEl.classList.add('loaded');
        wrapEl.classList.remove('loading', 'img-skeleton');
      });
      imgEl.addEventListener('error', () => {
        wrapEl.classList.remove('loading', 'img-skeleton');
        wrapEl.textContent = '[ IMAGE UNAVAILABLE ]';
      });
      imgEl.src = p.imgURL; // set after listeners are attached so 'load' can't fire first
    }

    pgrid.appendChild(el);
  });

})();