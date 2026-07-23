/* ===================== blog.js + github.js =====================
   Ships with local sample posts. To go live: set GITHUB_USER/REPO
   and swap loadLocalSamples() for loadFromGitHub() at the bottom.
================================================================= */

(function () {

  /* ============================================================
     GITHUB CONFIGURATION
  ============================================================ */

  const GITHUB_USER = "kalunkheparshuram";
  const GITHUB_REPO = "blogs";
  const GITHUB_BRANCH = "main";
  const GITHUB_BLOG_PATH = "content";

  /*
     Leave empty "" because your .md files are currently
     stored in the ROOT of the repository.

     Repository structure:

     blogs/
     ├── README.md
     ├── LICENSE
     ├── first-post.md
     └── another-post.md

     If you later create:

     blogs/
     └── blogs/
         ├── first-post.md
         └── another-post.md

     then change this to:

     const GITHUB_BLOG_PATH = "blogs";
  */

  /* ============================================================
     LOCAL SAMPLE POSTS

     These are only used if loading from GitHub fails.
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
This website is intentionally lightweight and built using modern web fundamentals.
    
Current stack:
- HTML5
- CSS3
- Vanilla JavaScript
- Git
- GitHub
- GitHub Pages
- jsDelivr CDN
No heavy frameworks or unnecessary dependencies—just fast, maintainable code.
    
## Dynamic Content
One of the goals for this website was to make content management simple.
    
Instead of editing HTML every time I publish something new:
- Blog posts are written in Markdown.
- Images are hosted in GitHub repositories.
- Projects are managed through JavaScript.
- GitHub APIs fetch content dynamically.
- jsDelivr serves static assets through a global CDN.
This allows the website to grow without becoming difficult to maintain.
    
## Sections of the Portfolio
The website currently includes:
1. About Me
2. Skills
3. Projects
4. Blog
5. Gallery
6. Contact
    
## Design Philosophy
The design follows a simple principle:
> Remove everything that distracts from the content.
Instead of excessive animations or complex interfaces, I focused on:
- Clean typography
- Fast loading
- Responsive layout
- Minimal distractions
- Easy navigation
- Readable content
The goal is to let the work speak for itself.
    
## What's Next?
This portfolio is not a finished product.
    
Future improvements include:
- More technical blog posts
- Bug bounty write-ups
- Security research articles
- Interactive project demonstrations
- Better search and filtering
- Dark mode enhancements
- Performance optimizations
Like every good project, it will continue to evolve over time.
    
## Final Thoughts
This website represents more than a collection of projects—it represents continuous learning.
Every blog post, every project, every experiment, and every improvement is another step forward.
The best portfolios are never truly finished. They simply become a better reflection of the person building them.
    
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
     ESCAPE HTML Protects against raw HTML being interpreted directly.
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
    /*
       First escape HTML.
       This prevents Markdown files from injecting arbitrary
       HTML directly into the page.
    */
    let html = escapeHTML(md);
    /* ------------------------------------------------------------
       CODE BLOCKS
       Example:
       ```bash
       whoami
       uname -a
       ```
    ------------------------------------------------------------ */
    html = html.replace(
      /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g,
      function (match, language, code) {
        const languageClass = language
          ? ` class="language-${language}"`
          : "";
        return `<pre><code${languageClass}>${code.trim()}</code></pre>`;
      }
    );

    /* ------------------------------------------------------------
       HEADINGS
    ------------------------------------------------------------ */
    html = html.replace(/^### (.*)$/gim, "<h4>$1</h4>");
    html = html.replace(/^## (.*)$/gim, "<h3>$1</h3>");
    html = html.replace(/^# (.*)$/gim, "<h2>$1</h2>");

    /* ------------------------------------------------------------
       BOLD
       **text**
    ------------------------------------------------------------ */
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    /* ------------------------------------------------------------
       ITALIC
       *text*
    ------------------------------------------------------------ */
    html = html.replace(/(^|[^\*])\*([^\*\n]+)\*/g, "$1<em>$2</em>");

    /* ------------------------------------------------------------
       INLINE CODE
       `whoami`
    ------------------------------------------------------------ */
    html = html.replace(/`([^`\n]+)`/g, "<code>$1</code>");

    /* ------------------------------------------------------------
       HORIZONTAL RULE
       ---
    ------------------------------------------------------------ */
    html = html.replace(/^---$/gim, "<hr>");

    /* ------------------------------------------------------------
        NUMBERED LISTS
        1. First
        2. Second
        3. Third
     ------------------------------------------------------------ */
    html = html.replace(/(?:^\d+\.\s+.*(?:\n|$))+/gim, function (block) {
      const items = block.trim().split("\n").map(function (line) {
        return line.replace(/^\d+\.\s+(.*)$/, "<li>$1</li>");
      }).join("");
      return `<ol>${items}</ol>`;
    }
    );

    /* ------------------------------------------------------------
       BULLET LISTS
       - Cybersecurity
       - Linux
       - Networking
    ------------------------------------------------------------ */
    html = html.replace(/(?:^-\s+.*(?:\n|$))+/gim, function (block) {
      const items = block.trim().split("\n").map(function (line) {
        return line.replace(/^-\s+(.*)$/, "<li>$1</li>");
      }).join("");
      return `<ul>${items}</ul>`;
    }
    );

    /* ------------------------------------------------------------
       PARAGRAPH SPACING
    ------------------------------------------------------------ */
    html = html.replace(/\n\n+/g, "<br><br>");

    return html;

  }

  /* ============================================================
     READING TIME
     Average reading speed:
     approximately 200 words per minute.
  ============================================================ */
  function readingTime(md) {
    const words = md.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  /* ============================================================
     FRONT MATTER PARSER
     Expected Markdown:
     ---
     slug: first-post
     title: First Post
     date: 2026-01-01
     tags: meta, cybersecurity, blog
     ---
     # First Post
     Article...
  ============================================================ */
  function parseFrontMatter(raw, filename) {
    /*
       Default values.
       These are used if metadata is missing.
    */
    const post = {
      slug: filename.replace(/\.md$/i, ""),
      title: filename.replace(/\.md$/i, ""),
      date: "—",
      tags: [],
      body: raw
    };

    /*
       Match content between the first:
       ---
       and
       ---
    */
    const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n)?/);

    /* ------------------------------------------------------------
       NO FRONT MATTER
       If front matter doesn't exist,
       use the first # heading as the title.
    ------------------------------------------------------------ */

    if (!match) {
      const headingMatch = raw.match(/^#\s+(.+)$/m);

      if (headingMatch) {
        post.title =
          headingMatch[1].trim();
      }
      return post;
    }

    /* ------------------------------------------------------------
       METADATA CONTENT
    ------------------------------------------------------------ */
    const metadata = match[1];

    /* ------------------------------------------------------------
       SLUG
    ------------------------------------------------------------ */
    const slugMatch = metadata.match(/^slug:\s*(.+)$/mi);
    if (slugMatch) { post.slug = slugMatch[1].trim().replace(/^["']|["']$/g, ""); }

    /* ------------------------------------------------------------
       TITLE
    ------------------------------------------------------------ */
    const titleMatch = metadata.match(/^title:\s*(.+)$/mi);
    if (titleMatch) { post.title = titleMatch[1].trim().replace(/^["']|["']$/g, ""); }

    /* ------------------------------------------------------------
       DATE
    ------------------------------------------------------------ */
    const dateMatch = metadata.match(/^date:\s*(.+)$/mi);
    if (dateMatch) { post.date = dateMatch[1].trim().replace(/^["']|["']$/g, ""); }


    /* ------------------------------------------------------------
       TAGS
       Expected:
       tags: cybersecurity, linux, bug-bounty
       Converted into:
       [         
         "cybersecurity",
         "linux",
         "bug-bounty"
       ]
    ------------------------------------------------------------ */

    const tagsMatch = metadata.match(/^tags:\s*(.+)$/mi);
    if (tagsMatch) { post.tags = tagsMatch[1].split(",").map(function (tag) { return tag.trim(); }).filter(Boolean); }

    /* ------------------------------------------------------------
       REMOVE FRONT MATTER FROM BODY
       Visitors won't see:
       ---
       slug: ...
       title: ...
       ---
       They only see the article.
    ------------------------------------------------------------ */
    post.body = raw.replace(match[0], "").trim();
    return post;
  }

  /* ============================================================
     FORMAT BLOG META
     Prevents an unnecessary trailing separator when
     there are no tags.
  ============================================================ */
  function getPostMeta(post) {
    let meta = `${post.date} · ${readingTime(post.body)} min read`;
    if (Array.isArray(post.tags) && post.tags.length > 0) { meta += ` · ${post.tags.join(", ")}`; }
    return meta;
  }

  /* ============================================================
     RENDER BLOG LIST
  ============================================================ */
  function renderList(filter = "") {
    const wrap = document.getElementById("blog-list");
    if (!wrap) { console.error('Element with id="blog-list" was not found.'); return; }
    wrap.innerHTML = "";
    const searchTerm = filter.trim().toLowerCase();
    /* Search title, article body and tags.*/
    const filteredPosts = posts.filter(
      function (post) {
        if (!searchTerm) {
          return true;
        }
        const searchableContent = [post.title, post.body, post.tags.join(" ")].join(" ").toLowerCase();
        return searchableContent.includes(searchTerm);
      }
    );

    /* ------------------------------------------------------------
       NO RESULTS
    ------------------------------------------------------------ */
    if (filteredPosts.length === 0) {
      wrap.innerHTML = `
        <div class="blog-empty">
          No blog posts found.
        </div>
      `;
      return;
    }

    /* ------------------------------------------------------------
       CREATE BLOG CARDS / ROWS
    ------------------------------------------------------------ */
    filteredPosts.forEach(
      function (post) {
        const row = document.createElement("div");
        row.className = "blog-row";
        row.innerHTML = `
          <div>
            <h3>
              ${escapeHTML(post.title)}
            </h3>
            <div class="meta">
              ${escapeHTML(getPostMeta(post))}
            </div>
          </div>
          <span class="arrow">
            →
          </span>
        `;

        row.addEventListener("click", function () { openPost(post.slug); });
        wrap.appendChild(row);
      }
    );
  }

  /* ============================================================
     OPEN BLOG POST
  ============================================================ */
  function openPost(slug) {
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

    /* Hide blog list */
    blogList.classList.add("hidden");

    /* Open reader */
    blogReader.classList.add("open");

    /* Render article */
    readerBody.innerHTML = `
      <div class="meta" style=" color:var(--text-dim); font-size:12px; margin-bottom:10px;">
        ${escapeHTML(getPostMeta(post))}
      </div>
        ${miniMarkdown(post.body)}
    `;

    /*Scroll to reader after opening.*/
    blogReader.scrollIntoView({ behavior: "smooth", block: "start" });
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
     PREVIOUS POST
  =========================================================== */
  const readerPrev = document.getElementById("reader-prev");

  if (readerPrev) {
    readerPrev.addEventListener("click", function () {
      if (posts.length === 0) { return; }
      idx = (idx - 1 + posts.length) % posts.length;
      openPost(posts[idx].slug);
    });
  }

  /* ============================================================
     NEXT POST
  ============================================================ */
  const readerNext = document.getElementById("reader-next");

  if (readerNext) {
    readerNext.addEventListener("click", function () {
      if (posts.length === 0) { return; }
      idx = (idx + 1) % posts.length;
      openPost(posts[idx].slug);
    });
  }

  /* ============================================================
     BLOG SEARCH
  ============================================================ */
  const blogSearch = document.getElementById("blog-search");

  if (blogSearch) { blogSearch.addEventListener("input", function (event) { renderList(event.target.value); }); }

  /* ============================================================
     LOCAL FALLBACK
  ============================================================ */
  function loadLocalSamples() {
    posts = SAMPLE_POSTS;
    /* Newest posts first. */
    posts.sort(function (a, b) { return b.date.localeCompare(a.date); });
    renderList();
  }

  /* ============================================================
     LOAD BLOG POSTS — via jsDelivr instead of api.github.com

     WHY: api.github.com is capped at 60 requests/hour PER VISITOR IP.
     That's shared across every site the visitor's IP hits that day —
     easy to blow through on a shared/office/campus IP. jsDelivr's
     Data API returns the whole repo's file tree in one cached request
     and isn't subject to that limit, and the CDN also serves the raw
     .md content, so no api.github.com or raw.githubusercontent.com
     calls happen at all.

     CACHING NOTE: jsDelivr caches at the edge. If a freshly-pushed post
     doesn't show up right away, purge it once:
       https://purge.jsdelivr.net/gh/<user>/<repo>@<branch>/
  ============================================================ */

  function toJsDelivrRawUrl(path) {
    return `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${GITHUB_REPO}@${GITHUB_BRANCH}/${path}`;
  }

  async function fetchJsDelivrTree() {
    const res = await fetch(`https://data.jsdelivr.com/v1/packages/gh/${GITHUB_USER}/${GITHUB_REPO}@${GITHUB_BRANCH}`);
    if (!res.ok) throw new Error('jsDelivr listing failed: ' + res.status);
    const data = await res.json();
    return data.files || [];
  }

  // Walks the tree down a slash-separated path, returning that directory's children
  function resolvePath(tree, pathStr) {
    if (!pathStr) return tree;
    let node = tree;
    for (const part of pathStr.split('/').filter(Boolean)) {
      const match = node.find(function (f) { return f.name === part && f.type === 'directory'; });
      if (!match) return [];
      node = match.files || [];
    }
    return node;
  }

  async function loadFromGitHub() {
    try {
      /* ----------------------------------------------------------
         ONE cached request for the whole repo's file tree.
      ---------------------------------------------------------- */
      const tree = await fetchJsDelivrTree();
      const dirFiles = resolvePath(tree, GITHUB_BLOG_PATH);

      /* ----------------------------------------------------------
         FIND MARKDOWN FILES

         Include:
         first-post.md
         command-injection.md
         linux-notes.md

         Ignore:
         README.md
         LICENSE
         images
         other files
      ---------------------------------------------------------- */
      const mdFiles = dirFiles.filter(
        function (file) { return (file.type === "file" && file.name.toLowerCase().endsWith(".md") && file.name.toLowerCase() !== "readme.md"); }
      );

      if (!mdFiles.length) { throw new Error("No markdown posts found."); }

      const basePath = GITHUB_BLOG_PATH ? GITHUB_BLOG_PATH.replace(/\/$/, "") + "/" : "";

      /* ----------------------------------------------------------
         DOWNLOAD AND PARSE EACH MARKDOWN FILE, through the CDN
      ---------------------------------------------------------- */
      posts = await Promise.all(mdFiles.map(
        async function (file) {
          const url = toJsDelivrRawUrl(basePath + file.name);
          const markdownResponse = await fetch(url);
          if (!markdownResponse.ok) {
            throw new Error(`Failed to load ${file.name}`);
          }

          const raw = await markdownResponse.text();

          /*
             Parse:
             slug
             title
             date
             tags
             body
          */

          return parseFrontMatter(raw, file.name);
        }
      )
      );

      /* ----------------------------------------------------------
         SORT BLOG POSTS
         Newest date first.
         Example:
         2026-07-20
         2026-07-10
         2026-06-21
         2026-01-01
      ---------------------------------------------------------- */

      posts.sort(
        function (a, b) {
          /* Posts without dates are placed below dated posts. */
          if (a.date === "—" && b.date !== "—") { return 1; }
          if (b.date === "—" && a.date !== "—") { return -1; }
          return b.date.localeCompare(a.date);
        }
      );

      /* ----------------------------------------------------------
         RENDER BLOG
      ---------------------------------------------------------- */
      renderList();
    }

    /* ============================================================
       GITHUB / JSDELIVR FAILED
    ===+======================================================== */
    catch (error) {
      console.error("Failed to load blogs via jsDelivr:", error);
      console.warn("Loading local sample posts instead.");
      loadLocalSamples();
    }
  }

  /* ============================================================
     START BLOG
  ============================================================ */
  loadFromGitHub();
})();