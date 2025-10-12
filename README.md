This is a [Next.js](https://nextjs.org) project bootstrapped with [
`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically
optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions
are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use
the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for
more details.

```javascript
    (async function () {
    try {
        const genre = '99';
        const base = 'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=' + encodeURIComponent(genre) + '&diff=';
        const diffs = [0, 1, 2, 3, 4];
        const difficultyClasses = {
            0: 'music_basic_score_back',
            1: 'music_advanced_score_back',
            2: 'music_expert_score_back',
            3: 'music_master_score_back',
            4: 'music_remaster_score_back'
        };
        const difficultyLabels = {0: 'basic', 1: 'advanced', 2: 'expert', 3: 'master', 4: 'remaster'};

        const aggregated = [];

        for (const d of diffs) {
            const url = base + d;
            let html = null;

            try {
                const r = await fetch(url, {mode: 'cors'});
                if (!r.ok) throw new Error('HTTP ' + r.status);
                html = await r.text();
            } catch (e) {
                try {
                    const proxy = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url);
                    const r2 = await fetch(proxy);
                    if (!r2.ok) throw new Error('Proxy HTTP ' + r2.status);
                    html = await r2.text();
                } catch (e2) {
                    console.error('Failed to fetch', url, e2);
                    continue;
                }
            }

            try {
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const className = '.' + (difficultyClasses[d] || 'music_remaster_score_back');
                const nodes = Array.from(doc.querySelectorAll(className));

                for (const node of nodes) {
                    const level = node.querySelector('.music_lv_block')?.textContent.trim() || '';
                    const name = node.querySelector('.music_name_block')?.textContent.trim() || '';
                    const scoreBlocks = node.querySelectorAll('.music_score_block');

                    const score = scoreBlocks[0]?.textContent.trim() || '';
                    const dx_score = scoreBlocks[1]?.textContent?.replace(/\s+/g, ' ').trim() || '';

                    if (!score && !dx_score) continue;

                    aggregated.push({
                        level,
                        name,
                        score,
                        dx_score,
                        diff: d,
                        difficulty: difficultyLabels[d] || 'unknown'
                    });
                }
            } catch (e) {
                console.error('Parsing failed for diff', d, e);
            }
        }

        const blob = new Blob([JSON.stringify(aggregated, null, 2)], {type: 'application/json'});
        const dlUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = dlUrl;
        a.download = 'maimai_genre_' + genre + '_all_diffs.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(dlUrl);

        console.log('Downloaded with played songs only (items: ' + aggregated.length + ')');
    } catch (err) {
        alert('Bookmarklet error: ' + (err && err.message ? err.message : err));
        console.error(err);
    }
})();
```

https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/cover/imgid.png
https://dp4p6x0xfi5o9.cloudfront.net/maimai/data.json