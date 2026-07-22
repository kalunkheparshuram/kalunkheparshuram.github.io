/* ---- Gallery: GitHub repo for storage, jsDelivr as the CDN ----

     Setup:
     1. Compress your photos first (see command below) — web resolution,
        not camera-original. ~150-300KB per photo at ~1920px wide is plenty.
     2. Commit them into your repo under gallery/<category>/photo.jpg
     3. Set GH_USER, GH_REPO, GH_BRANCH below.
     4. That's it — this script lists files via the GitHub API, then
        serves the actual images through jsDelivr instead of raw GitHub,
        so visitors get real CDN edges instead of GitHub's raw file server.

     jsDelivr URL pattern (built automatically below):
       https://cdn.jsdelivr.net/gh/<user>/<repo>@<branch>/<path>

     Note on the GitHub listing call: unauthenticated GitHub API is capped
     at 60 requests/hour PER VISITOR IP, not per site — fine for a personal
     portfolio's traffic levels. If that ever becomes a problem, swap
     loadGalleryFromGitHub() for a static manifest.json instead (same
     jsDelivr URLs, just listed by hand once instead of fetched live).

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
    const GALLERY_PATH = "";
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
            if (i.url) {
                d.className = 'tile';
                d.innerHTML = `<img src="${i.url}" alt="${i.label}" loading="lazy"><div class="cap">${i.label}</div>`;
            } else {
                d.className = 'tile placeholder';
                d.style.height = (150 + Math.floor(Math.random() * 70)) + 'px';
                d.textContent = i.label;
            }
            d.addEventListener('click', () => {
                const lb = document.getElementById('lb-img');
                lb.innerHTML = i.url ? `<img src="${i.url}" alt="${i.label}">` : i.label;
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

    // Converts a repo-relative path to a jsDelivr CDN URL
    function toJsDelivrUrl(path) {
        return `https://cdn.jsdelivr.net/gh/${GH_USER}/${GH_REPO}@${GH_BRANCH}/${path}`;
    }

    async function loadGalleryFromGitHub() {
        try {
            const res = await fetch(`https://api.github.com/repos/${GH_USER}/${GH_REPO}/contents/${GALLERY_PATH}?ref=${GH_BRANCH}`);
            if (!res.ok) throw new Error('gallery folder not found: ' + res.status);
            const folders = (await res.json()).filter(f => f.type === 'dir');
            if (!folders.length) throw new Error('no category folders in /gallery');

            const perFolder = await Promise.all(folders.map(async folder => {
                const r = await fetch(folder.url);
                const files = await r.json();
                return files
                    .filter(f => f.type === 'file' && IMG_EXT.test(f.name))
                    .map(f => ({
                        cat: folder.name,
                        label: f.name.replace(IMG_EXT, ''),
                        url: toJsDelivrUrl(f.path)
                    }));
            }));

            const items = perFolder.flat();
            if (!items.length) throw new Error('no images found in /gallery/*');

            GALLERY_ITEMS = items;
            openCategory('all');
            galleryStatus.textContent = items.length + ' photos loaded from github.';
        } catch (err) {
            useLocalPlaceholders('Showing placeholder photos');
        }
    }

    wireTabs();
    document.getElementById('lb-close').addEventListener('click', () => document.getElementById('lightbox').classList.remove('open'));

    loadGalleryFromGitHub();
})();