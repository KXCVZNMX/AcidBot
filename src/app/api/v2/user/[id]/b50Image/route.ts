const SVG_WIDTH = 1320;
const SVG_HEIGHT = 1508;

export async function GET() {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_WIDTH}" height="${SVG_HEIGHT}" viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}">
	<image href="/b50/b50bg.png" width="${SVG_WIDTH}" height="${SVG_HEIGHT}" preserveAspectRatio="none" />
</svg>`;

    return new Response(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'no-store',
        },
    });
}
