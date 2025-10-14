```javascript
javascript: (async function () {
    try {
        const genre = '99';
        const base =
            'https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=' +
            encodeURIComponent(genre) +
            '&diff=';
        const diffs = [0, 1, 2, 3, 4];
        const difficultyClasses = {
            0: 'music_basic_score_back',
            1: 'music_advanced_score_back',
            2: 'music_expert_score_back',
            3: 'music_master_score_back',
            4: 'music_remaster_score_back',
        };
        const difficultyLabels = {
            0: 'basic',
            1: 'advanced',
            2: 'expert',
            3: 'master',
            4: 'remaster',
        };
        const normalize = (s) =>
            String(s || '')
                .normalize('NFKC')
                .replace(/\s+/g, ' ')
                .trim()
                .toLowerCase();
        const aggregated = [];
        for (const d of diffs) {
            const url = base + d;
            let html = null;
            try {
                const r = await fetch(url, { mode: 'cors' });
                if (!r.ok) throw new Error('HTTP ' + r.status);
                html = await r.text();
            } catch (e) {
                try {
                    const proxy =
                        'https://api.allorigins.win/raw?url=' +
                        encodeURIComponent(url);
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
                const className =
                    '.' + (difficultyClasses[d] || 'music_remaster_score_back');
                const nodes = Array.from(doc.querySelectorAll(className));
                for (const node of nodes) {
                    const level =
                        node
                            .querySelector('.music_lv_block')
                            ?.textContent.trim() || '';
                    const name =
                        node
                            .querySelector('.music_name_block')
                            ?.textContent.trim() || '';
                    const scoreBlocks =
                        node.querySelectorAll('.music_score_block');
                    const rawScore = scoreBlocks[0]?.textContent.trim() || '';
                    const scoreNum =
                        rawScore.replace('%', '').replace(/\s+/g, ' ').trim() ||
                        '';
                    const dx_score =
                        scoreBlocks[1]?.textContent
                            ?.replace(/\s+/g, ' ')
                            .trim() || '';
                    if (!rawScore && !dx_score) continue;
                    let outer = node.closest('.w_450') || node.parentElement;
                    let iconEl =
                        outer?.querySelector('.music_kind_icon') ||
                        node.querySelector('.music_kind_icon') ||
                        null;
                    let iconSrc = iconEl?.getAttribute('src') || '';
                    const isDX = /music_dx/i.test(iconSrc);
                    aggregated.push({
                        name,
                        name_norm: normalize(name),
                        level,
                        score: scoreNum,
                        rawScore,
                        dx_score,
                        isDX,
                        diff: d,
                        difficulty: difficultyLabels[d] || 'unknown',
                    });
                }
            } catch (e) {
                console.error('Parsing failed for diff', d, e);
            }
        }
        const ratingUrl =
            'https://maimaidx-eng.com/maimai-mobile/home/ratingTargetMusic/';
        let ratingHtml = null;
        try {
            const r = await fetch(ratingUrl, { mode: 'cors' });
            if (!r.ok) throw new Error('HTTP ' + r.status);
            ratingHtml = await r.text();
        } catch (e) {
            try {
                const proxy =
                    'https://api.allorigins.win/raw?url=' +
                    encodeURIComponent(ratingUrl);
                const r2 = await fetch(proxy);
                if (!r2.ok) throw new Error('Proxy HTTP ' + r2.status);
                ratingHtml = await r2.text();
            } catch (e2) {
                throw new Error('Failed to fetch rating page: ' + e2.message);
            }
        }
        const ratingDoc = new DOMParser().parseFromString(
            ratingHtml,
            'text/html'
        );
        const screws = Array.from(ratingDoc.querySelectorAll('.screw_block'));
        let startIdx = screws.findIndex(
            (sb) =>
                /Songs for Rating/i.test(sb.textContent || '') &&
                /New/i.test(sb.textContent || '')
        );
        let endIdx = screws.findIndex(
            (sb) =>
                /Songs for Rating Selection/i.test(sb.textContent || '') &&
                /New/i.test(sb.textContent || '')
        );
        if (startIdx === -1) {
            startIdx = screws.findIndex((sb) =>
                /Songs for Rating/i.test(sb.textContent || '')
            );
        }
        if (startIdx === -1)
            throw new Error('Start section not found on rating page');
        if (endIdx === -1) {
            endIdx = screws.findIndex(
                (sb, i) =>
                    i > startIdx &&
                    /Songs for Rating Selection/i.test(sb.textContent || '')
            );
        }
        if (endIdx === -1)
            throw new Error('End section (Selection) not found on rating page');
        const startNode = screws[startIdx];
        const endNode = screws[endIdx];
        const ratingSongs = [];
        for (
            let n = startNode.nextElementSibling;
            n && n !== endNode;
            n = n.nextElementSibling
        ) {
            if (!n.querySelector) continue;
            const nmEl = n.querySelector('.music_name_block');
            if (!nmEl) continue;
            const rawName = nmEl.textContent.trim();
            const nameNorm = normalize(rawName);
            let diffFound = null;
            const cls = n.className || '';
            if (cls.includes('music_basic_score_back')) diffFound = 0;
            else if (cls.includes('music_advanced_score_back')) diffFound = 1;
            else if (cls.includes('music_expert_score_back')) diffFound = 2;
            else if (cls.includes('music_master_score_back')) diffFound = 3;
            else if (cls.includes('music_remaster_score_back')) diffFound = 4;
            const diffLbl =
                diffFound != null ? difficultyLabels[diffFound] : 'unknown';
            const scBlock = n.querySelector('.music_score_block');
            let achievementRaw = '';
            let rScore = '';
            if (scBlock) {
                achievementRaw = scBlock.textContent
                    .replace(/\s+/g, ' ')
                    .trim();
                rScore = achievementRaw.replace('%', '').trim();
            }
            const lvlEl = n.querySelector('.music_lv_block');
            const rLevel = lvlEl ? lvlEl.textContent.trim() : '';
            let outer = n.closest('.w_450') || n.parentElement;
            let iconEl =
                outer?.querySelector('.music_kind_icon') ||
                n.querySelector('.music_kind_icon') ||
                null;
            let iconSrc = iconEl?.getAttribute('src') || '';
            const isDX = /music_dx/i.test(iconSrc);
            ratingSongs.push({
                name: rawName,
                name_norm: nameNorm,
                level: rLevel,
                score: rScore,
                achievement: achievementRaw,
                dx_score: '',
                isDX,
                diff: diffFound,
                difficulty: diffLbl,
            });
        }
        if (!ratingSongs.length) throw new Error('No rating songs found');
        const finalList = ratingSongs.map((rn) => {
            const gMatchExact = aggregated.find(
                (a) => a.name_norm === rn.name_norm && a.diff === rn.diff
            );
            const gMatchNameOnly = aggregated.find(
                (a) => a.name_norm === rn.name_norm
            );
            let base = gMatchExact || gMatchNameOnly;
            let out = {
                name: rn.name,
                level: rn.level || base?.level || '',
                score: rn.score || base?.score || '',
                achievement: rn.achievement || base?.rawScore || '',
                dx_score: base?.dx_score || '',
                isDX:
                    typeof rn.isDX !== 'undefined'
                        ? rn.isDX
                        : (base?.isDX ?? false),
                diff:
                    rn.diff != null
                        ? rn.diff
                        : base?.diff != null
                          ? base.diff
                          : null,
                difficulty: rn.difficulty || base?.difficulty || 'unknown',
            };
            return out;
        });
        const wrapped = { results: finalList };
        const blob = new Blob([JSON.stringify(wrapped, null, 2)], {
            type: 'application/json',
        });
        const dlUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = dlUrl;
        a.download = 'maimai_rating_50_filtered.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(dlUrl);
        console.log(
            'Downloaded maimai_rating_50_filtered.json (items:' +
                finalList.length +
                ')'
        );
    } catch (err) {
        alert('Bookmarklet error: ' + (err && err.message ? err.message : err));
        console.error(err);
    }
})();
```

https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/cover/imgid.png
https://dp4p6x0xfi5o9.cloudfront.net/maimai/data.json

When you dont have the song, the entry would be empty because it would not be displayed on the maimai website
