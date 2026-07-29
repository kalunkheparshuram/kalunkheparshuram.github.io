/* ===================== posts.js =====================
   Ships with local sample posts. Loads posts.json (metadata only,
   1 request) on page load, then fetches each post's Markdown only
   when the visitor actually opens it. Falls back to SAMPLE_POSTS if
   posts.json is missing or malformed.
================================================================= */

(function () {

  /* ============================================================
     GITHUB CONFIGURATION
  ============================================================ */

  const GITHUB_USER = "kalunkheparshuram";
  const GITHUB_REPO = "blogs";
  const GITHUB_BRANCH = "main";

  /*
     Set this to match your ACTUAL repo layout. Check
     https://github.com/kalunkheparshuram/blogs before deploying —
     the two possible structures are:

     blogs/
     ├── first-post.md          <-- files in root
     └── another-post.md

     GITHUB_BLOG_PATH = ""

     OR:

     blogs/
     └── content/
         ├── first-post.md      <-- files in a subfolder
         └── another-post.md

     GITHUB_BLOG_PATH = "content"

     Whichever it is, this is the ONLY place you need to set it —
     BLOG_BASE below is built from this once and used everywhere.
  */
  const GITHUB_BLOG_PATH = "content";

  const BLOG_BASE = GITHUB_BLOG_PATH
    ? `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${GITHUB_REPO}@${GITHUB_BRANCH}/${GITHUB_BLOG_PATH}/`
    : `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${GITHUB_REPO}@${GITHUB_BRANCH}/`;

  /* ============================================================
     LOCAL SAMPLE POSTS
     Used only if posts.json can't be loaded.
  ============================================================ */

  const SAMPLE_POSTS = [
    {
      slug: "portfolio-journey", title: "Building My Digital Workspace", date: "2026-07-22", tags: ["portfolio", "web-development", "cybersecurity", "personal"],
      body: `
# Building My Digital Workspace
Every professional needs a place that represents not only *what they have done*, but also *how they think*.
This website is my personal portfolio—a space where I document my work, showcase projects, publish technical blogs, and continuously share my learning journey in cybersecurity and technology.
Rather than building another generic portfolio, I wanted to create something that reflects my personality, workflow, and appreciation for minimalist design.

## Why I Built This Website
This portfolio serves as a central place to showcase:
- Cybersecurity research
- Bug bounty write-ups
- Personal projects
- Linux customizations
- Technical blogs
- Photography gallery
- Skills and certifications
- Professional journey
Every section has a purpose and will continue to evolve as I gain more experience.

## Technologies Used
Current stack:
- HTML5
- CSS3
- Vanilla JavaScript
- Git
- GitHub
- GitHub Pages
- jsDelivr CDN
No heavy frameworks or unnecessary dependencies—just fast, maintainable code.

---

*Thanks for visiting my portfolio. More projects, research, and technical articles will be added as the journey continues.*
      `.trim()
    }
  ];

  /* ============================================================
     GLOBAL BLOG STATE
  ============================================================ */
  let posts = [];
  let idx = 0;

  /* ============================================================
     ESCAPE HTML — protects against raw HTML in Markdown files
  ============================================================ */
  function escapeHTML(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /* ============================================================
     MINI MARKDOWN RENDERER
  ============================================================ */
  function miniMarkdown(md) {
    let html = escapeHTML(md);

    html = html.replace(
      /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g,
      function (match, language, code) {
        const languageClass = language ? ` class="language-${language}"` : "";
        return `<pre><code${languageClass}>${code.trim()}</code></pre>`;
      }
    );

    html = html.replace(/^### (.*)$/gim, "<h4>$1</h4>");
    html = html.replace(/^## (.*)$/gim, "<h3>$1</h3>");
    html = html.replace(/^# (.*)$/gim, "<h2>$1</h2>");

    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/(^|[^\*])\*([^\*\n]+)\*/g, "$1<em>$2</em>");
    html = html.replace(/`([^`\n]+)`/g, "<code>$1</code>");
    html = html.replace(/^---$/gim, "<hr>");

    html = html.replace(/(?:^\d+\.\s+.*(?:\n|$))+/gim, function (block) {
      const items = block.trim().split("\n").map(function (line) {
        return line.replace(/^\d+\.\s+(.*)$/, "<li>$1</li>");
      }).join("");
      return `<ol>${items}</ol>`;
    });

    html = html.replace(/(?:^-\s+.*(?:\n|$))+/gim, function (block) {
      const items = block.trim().split("\n").map(function (line) {
        return line.replace(/^-\s+(.*)$/, "<li>$1</li>");
      }).join("");
      return `<ul>${items}</ul>`;
    });

    html = html.replace(/\n\n+/g, "<br><br>");
    return html;
  }

  /* ============================================================
     READING TIME (~200 words/min)
  ============================================================ */
  function readingTime(md) {
    const words = md.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  /* ============================================================
     FRONT MATTER PARSER
     Only used as a fallback if a post lacks metadata in posts.json,
     or to strip front matter out of the body before rendering.
  ============================================================ */
  function parseFrontMatter(raw, filename) {
    const post = {
      slug: filename.replace(/\.md$/i, ""),
      title: filename.replace(/\.md$/i, ""),
      date: "—",
      tags: [],
      body: raw
    };

    const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n)?/);

    if (!match) {
      const headingMatch = raw.match(/^#\s+(.+)$/m);
      if (headingMatch) { post.title = headingMatch[1].trim(); }
      return post;
    }

    const metadata = match[1];

    const slugMatch = metadata.match(/^slug:\s*(.+)$/mi);
    if (slugMatch) { post.slug = slugMatch[1].trim().replace(/^["']|["']$/g, ""); }

    const titleMatch = metadata.match(/^title:\s*(.+)$/mi);
    if (titleMatch) { post.title = titleMatch[1].trim().replace(/^["']|["']$/g, ""); }

    const dateMatch = metadata.match(/^date:\s*(.+)$/mi);
    if (dateMatch) { post.date = dateMatch[1].trim().replace(/^["']|["']$/g, ""); }

    const tagsMatch = metadata.match(/^tags:\s*(.+)$/mi);
    if (tagsMatch) {
      post.tags = tagsMatch[1].split(",").map(function (tag) { return tag.trim(); }).filter(Boolean);
    }

    post.body = raw.replace(match[0], "").trim();
    return post;
  }

  /* ============================================================
     FORMAT BLOG META
  ============================================================ */
  function getPostMeta(post) {
    let meta = `${post.date} · ${post.body ? readingTime(post.body) + " min read" : "…"}`;
    if (Array.isArray(post.tags) && post.tags.length > 0) { meta += ` · ${post.tags.join(", ")}`; }
    return meta;
  }

  /* ============================================================
     SORT POSTS — newest first, posts without a real date sink
     to the bottom instead of sorting unpredictably.
  ============================================================ */
  function sortPosts(list) {
    list.sort(function (a, b) {
      if (a.date === "—" && b.date === "—") return 0;
      if (a.date === "—") return 1;
      if (b.date === "—") return -1;
      return b.date.localeCompare(a.date);
    });
    return list;
  }

  /* ============================================================
     RENDER BLOG LIST
  ============================================================ */
  function renderList(filter = "") {
    const wrap = document.getElementById("blog-list");
    if (!wrap) { console.error('Element with id="blog-list" was not found.'); return; }
    wrap.innerHTML = "";
    const searchTerm = filter.trim().toLowerCase();

    const filteredPosts = posts.filter(function (post) {
      if (!searchTerm) return true;
      const searchableContent = [post.title, post.body || "", post.tags.join(" ")].join(" ").toLowerCase();
      return searchableContent.includes(searchTerm);
    });

    if (filteredPosts.length === 0) {
      wrap.innerHTML = `<div class="blog-empty">No blog posts found.</div>`;
      return;
    }

    filteredPosts.forEach(function (post) {
      const row = document.createElement("div");
      row.className = "blog-row";
      row.innerHTML = `
        <div>
          <h3>${escapeHTML(post.title)}</h3>
          <div class="meta">${escapeHTML(getPostMeta(post))}</div>
        </div>
        <span class="arrow">→</span>
      `;
      row.addEventListener("click", function () { openPost(post.slug); });
      wrap.appendChild(row);
    });
  }

  /* ============================================================
     OPEN BLOG POST
     Lazy-loads the Markdown body on first open only. Subsequent
     opens of the same post reuse the cached post.body.
  ============================================================ */
  async function openPost(slug) {
    const foundIndex = posts.findIndex(function (post) { return post.slug === slug; });
    if (foundIndex === -1) {
      console.error("Blog post not found:", slug);
      return;
    }
    idx = foundIndex;
    const post = posts[idx];

    const blogList = document.getElementById("blog-list");
    const blogReader = document.getElementById("blog-reader");
    const readerBody = document.getElementById("reader-body");
    if (!blogList || !blogReader || !readerBody) {
      console.error("Required blog reader elements were not found.");
      return;
    }

    blogList.classList.add("hidden");
    blogReader.classList.add("open");
    readerBody.innerHTML = `<div class="loading">Loading article…</div>`;
    blogReader.scrollIntoView({ behavior: "smooth", block: "start" });

    if (!post.body) {
      try {
        const response = await fetch(`${BLOG_BASE}${encodeURIComponent(post.file)}?v=${Date.now()}`);
        if (!response.ok) {
          throw new Error(`Failed to load ${post.file}: HTTP ${response.status}`);
        }
        const raw = await response.text();
        const parsed = parseFrontMatter(raw, post.file);
        // Keep metadata from posts.json as the source of truth;
        // only take the parsed body (avoids parsing metadata twice).
        post.body = parsed.body;
      } catch (err) {
        console.error(err);
        readerBody.innerHTML = `<div class="blog-empty">Couldn't load this article. ${escapeHTML(err.message)}</div>`;
        return;
      }
    }

    readerBody.innerHTML = `
      <div class="meta" style="color:var(--text-dim); font-size:12px; margin-bottom:10px;">
        ${escapeHTML(getPostMeta(post))}
      </div>
      ${miniMarkdown(post.body)}
    `;
  }

  /* ============================================================
     BACK BUTTON
  ============================================================ */
  const readerBack = document.getElementById("reader-back");
  if (readerBack) {
    readerBack.addEventListener("click", function () {
      const blogReader = document.getElementById("blog-reader");
      const blogList = document.getElementById("blog-list");
      if (blogReader) { blogReader.classList.remove("open"); }
      if (blogList) { blogList.classList.remove("hidden"); }
    });
  }

  /* ============================================================
     PREVIOUS / NEXT POST
  ============================================================ */
  const readerPrev = document.getElementById("reader-prev");
  if (readerPrev) {
    readerPrev.addEventListener("click", function () {
      if (posts.length === 0) return;
      idx = (idx - 1 + posts.length) % posts.length;
      openPost(posts[idx].slug);
    });
  }

  const readerNext = document.getElementById("reader-next");
  if (readerNext) {
    readerNext.addEventListener("click", function () {
      if (posts.length === 0) return;
      idx = (idx + 1) % posts.length;
      openPost(posts[idx].slug);
    });
  }

  /* ============================================================
     BLOG SEARCH
  ============================================================ */
  const blogSearch = document.getElementById("blog-search");
  if (blogSearch) {
    blogSearch.addEventListener("input", function (event) { renderList(event.target.value); });
  }

  /* ============================================================
     LOCAL FALLBACK
  ============================================================ */
  function loadLocalSamples() {
    posts = sortPosts(SAMPLE_POSTS.slice());
    renderList();
  }

  /* ============================================================
     LOAD POSTS — metadata only (1 request). Markdown bodies are
     fetched lazily by openPost() when a visitor actually clicks
     a post, not here.
  ============================================================ */
  async function loadFromGitHub() {
    const wrap = document.getElementById("blog-list");
    if (wrap) { wrap.innerHTML = `<div class="loading">Loading articles…</div>`; }

    try {
      const response = await fetch("./posts.json?v=" + Date.now());
      if (!response.ok) {
        throw new Error(`posts.json: HTTP ${response.status}`);
      }
      const manifest = await response.json();
      if (!manifest || !Array.isArray(manifest.posts)) {
        throw new Error("posts.json is malformed: expected a 'posts' array");
      }

      // post.body is intentionally absent here — lazy-loaded on open.
      posts = sortPosts(manifest.posts.slice());
      renderList();
    } catch (err) {
      console.error("Blog loading failed, falling back to local samples:", err);
      loadLocalSamples();
    }
  }

  /* ============================================================
     START BLOG
  ============================================================ */
  loadFromGitHub();
})();