/* ---- Gallery: GitHub repo for storage, jsDelivr for BOTH listing and images ----

     Setup:
     1. Compress your photos first (see command below) — web resolution,
        not camera-original. ~150-300KB per photo at ~1920px wide is plenty.
     2. Commit them into your repo under gallery/<category>/photo.jpg
     3. Set GH_USER, GH_REPO, GH_BRANCH below.
     4. That's it.

     WHY jsDelivr FOR THE LISTING TOO (not just the images):
     The previous version listed folders/files via api.github.com, which is
     capped at 60 requests/hour PER VISITOR IP — and it made one request per
     category folder (root + N subfolders), so a page with 5-6 categories
     could burn through a visitor's quota fast, especially if they're on a
     shared IP (office wifi, VPN, campus network) with other GitHub API users.
     jsDelivr's Data API (data.jsdelivr.com) returns the ENTIRE repo file
     tree in a single cached request and isn't subject to that per-IP limit,
     so this version uses it for discovery, then serves the actual image
     bytes through the jsDelivr CDN as before.

     jsDelivr URL patterns (built automatically below):
       Listing:  https://data.jsdelivr.com/v1/packages/gh/<user>/<repo>@<branch>
       Image:    https://cdn.jsdelivr.net/gh/<user>/<repo>@<branch>/<path>

     FILENAME NOTE: filenames with spaces, emoji, or other non-ASCII/reserved
     characters (e.g. "✨ Emerald Dreamscape.jpg") MUST be percent-encoded
     per path segment before being used in a URL, or the request 404s /
     silently fails. toJsDelivrUrl() below does this automatically, but the
     safest long-term fix is to just not use spaces/emoji in filenames —
     rename them to something like "emerald-dreamscape.jpg" in the repo.

     CACHING NOTE: jsDelivr caches aggressively at the edge. New commits can
     take a while to show up. If you need changes to appear immediately,
     purge the cache after pushing:
       https://purge.jsdelivr.net/gh/<user>/<repo>@<branch>/
     (open that URL once in a browser after each gallery update)

     One-time image compression (run before committing, needs imagemagick):
       for f in gallery/*.jpg; do
         magick "$f" -resize 1920x1920\> -quality 82 "$f"
       done
     (mac without imagemagick: use `sips -Z 1920 file.jpg`)
*/

(function () {
    const GH_USER = "kalunkheparshuram";
    const GH_REPO = "gallery";
    const GH_BRANCH = "main";
    const GALLERY_PATH = ""; // subfolder inside the repo, if your categories aren't at the root
    const IMG_EXT = /\.(jpe?g|png|gif|webp)$/i;
    const RANDOM_SAMPLE_PER_CATEGORY = 3; // how many images per category to show in the "all" tab

    const PLACEHOLDER_ITEMS = [
        { cat: 'nature', label: 'Nature shot #1', url: "./gallery/nature/nature1.jpg" },
        { cat: 'nature', label: 'Nature shot #6', url: "./gallery/nature/nature6.jpg" },
        { cat: 'motorcycle', label: 'Motorcycle shot #1', url: "./gallery/motorcycle/motorcycle1.jpg" },
        { cat: 'clouds', label: 'Cloud photo #1', url: "./gallery/clouds/cloud1.jpg" },
        { cat: 'clouds', label: 'Cloud photo #3', url: "./gallery/clouds/cloud3.jpg" },
        { cat: 'sky', label: 'Sky session #1', url: "./gallery/sky/sky1.jpg" }
    ];

    const masonry = document.getElementById('masonry');
    const galleryStatus = document.getElementById('gallery-status');
    let GALLERY_ITEMS = [];

    // Escapes text before it's dropped into innerHTML (filenames become
    // alt text / captions, so treat them as untrusted input, same as blog content).
    function escapeHTML(text) {
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    // Fisher-Yates shuffle, doesn't mutate the input
    function shuffled(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // For the "all" view: N random images per category instead of everything
    function buildAllViewSample() {
        const byCat = {};
        GALLERY_ITEMS.forEach(i => {
            (byCat[i.cat] = byCat[i.cat] || []).push(i);
        });
        return Object.keys(byCat).flatMap(cat =>
            shuffled(byCat[cat]).slice(0, RANDOM_SAMPLE_PER_CATEGORY)
        );
    }

    function renderGallery(cat) {
        masonry.innerHTML = '';
        const items = cat === 'all'
            ? buildAllViewSample()
            : GALLERY_ITEMS.filter(i => i.cat === cat);

        items.forEach(i => {
            const d = document.createElement('div');
            const safeLabel = escapeHTML(i.label);

            if (i.url) {
                d.className = 'tile loading img-skeleton';
                d.style.minHeight = (150 + Math.floor(Math.random() * 70)) + 'px';

                const img = document.createElement('img');
                img.src = i.url;
                img.alt = safeLabel;
                img.loading = 'lazy';
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                    d.classList.remove('loading', 'img-skeleton');
                    d.style.minHeight = '';
                });
                img.addEventListener('error', () => {
                    d.classList.remove('loading', 'img-skeleton');
                    d.className = 'tile placeholder';
                    d.textContent = safeLabel + ' (image unavailable)';
                    // Uncomment while debugging a specific file to see the exact URL that failed:
                    // console.warn('Image failed to load:', i.url);
                });

                const cap = document.createElement('div');
                cap.className = 'cap';
                cap.textContent = i.label;

                d.appendChild(img);
                d.appendChild(cap);
            } else {
                d.className = 'tile placeholder';
                d.style.height = (150 + Math.floor(Math.random() * 70)) + 'px';
                d.textContent = i.label;
            }

            d.addEventListener('click', () => {
                const lb = document.getElementById('lb-img');
                lb.innerHTML = '';
                if (i.url) {
                    lb.classList.add('img-skeleton');
                    const bigImg = document.createElement('img');
                    bigImg.src = i.url;
                    bigImg.alt = safeLabel;
                    bigImg.addEventListener('load', () => {
                        bigImg.classList.add('loaded');
                        lb.classList.remove('img-skeleton');
                    });
                    bigImg.addEventListener('error', () => {
                        lb.classList.remove('img-skeleton');
                        lb.textContent = safeLabel + ' (image unavailable)';
                    });
                    lb.appendChild(bigImg);
                } else {
                    lb.textContent = safeLabel;
                }
                document.getElementById('lightbox').classList.add('open');
            });
            masonry.appendChild(d);
        });
    }

    function openCategory(cat) {
        document.querySelectorAll('#gallery-tabs button').forEach(x => x.classList.remove('active'));
        const match = document.querySelector(`#gallery-tabs button[data-cat="${cat}"]`);
        if (match) match.classList.add('active');
        renderGallery(cat);
    }

    function wireTabs() {
        document.querySelectorAll('#gallery-tabs button').forEach(b => {
            b.addEventListener('click', () => openCategory(b.dataset.cat));
        });
    }

    function useLocalPlaceholders(note) {
        GALLERY_ITEMS = PLACEHOLDER_ITEMS;
        openCategory('all');
        galleryStatus.textContent = note;
    }

    // Converts a repo-relative path to a jsDelivr CDN URL.
    // FIX: percent-encode each path segment individually. Filenames with
    // spaces, emoji, or other reserved/non-ASCII characters (e.g.
    // "✨ Emerald Dreamscape.jpg") will otherwise produce a malformed URL
    // that 404s or gets silently dropped by the browser/CDN. We encode
    // segment-by-segment (not the whole path with one encodeURIComponent
    // call) so the "/" separators between folder/file names are preserved.
    function toJsDelivrUrl(path) {
        const encodedPath = path
            .split('/')
            .map(segment => encodeURIComponent(segment))
            .join('/');
        return `https://cdn.jsdelivr.net/gh/${GH_USER}/${GH_REPO}@${GH_BRANCH}/${encodedPath}`;
    }

    /* ------------------------------------------------------------
       jsDelivr Data API — single request, whole-repo file tree.
       Response shape: { files: [ {type:'file'|'directory', name, files?} ] }
       `files` is only present (and nested) on directory entries.
    ------------------------------------------------------------ */
    async function fetchJsDelivrTree() {
        const res = await fetch(`https://data.jsdelivr.com/v1/packages/gh/${GH_USER}/${GH_REPO}@${GH_BRANCH}`);
        if (!res.ok) throw new Error('jsDelivr listing failed: ' + res.status);
        const data = await res.json();
        return data.files || [];
    }

    // Walks the tree down a slash-separated path, returning that directory's children
    function resolvePath(tree, pathStr) {
        if (!pathStr) return tree;
        let node = tree;
        for (const part of pathStr.split('/').filter(Boolean)) {
            const match = node.find(f => f.name === part && f.type === 'directory');
            if (!match) return [];
            node = match.files || [];
        }
        return node;
    }

    async function loadGalleryFromGitHub() {
        try {
            const tree = await fetchJsDelivrTree();
            const root = resolvePath(tree, GALLERY_PATH);
            const folders = root.filter(f => f.type === 'directory');
            if (!folders.length) throw new Error('no category folders in /gallery');

            const basePath = GALLERY_PATH ? GALLERY_PATH.replace(/\/$/, '') + '/' : '';

            const items = folders.flatMap(folder => {
                const files = (folder.files || []).filter(f => f.type === 'file' && IMG_EXT.test(f.name));
                return files.map(f => ({
                    cat: folder.name,
                    label: f.name.replace(IMG_EXT, ''),
                    url: toJsDelivrUrl(`${basePath}${folder.name}/${f.name}`)
                }));
            });

            if (!items.length) throw new Error('no images found in /gallery/*');

            GALLERY_ITEMS = items;
            openCategory('all');
            galleryStatus.textContent = items.length + ' photos loaded from github (via jsDelivr).';
        } catch (err) {
            console.error('Gallery load failed:', err);
            useLocalPlaceholders('Showing placeholder photos');
        }
    }

    wireTabs();
    document.getElementById('lb-close').addEventListener('click', () => document.getElementById('lightbox').classList.remove('open'));

    loadGalleryFromGitHub();
})();