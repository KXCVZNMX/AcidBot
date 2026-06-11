import { NextResponse } from 'next/server';

// Only returns the script to extract the clal token.
export async function GET() {
    const site_link = process.env.SITE_LINK ?? 'https://acid.kvznmx.com';

    const code = `javascript:(function () {var s=document.createElement('script');s.src=
    '${site_link}/api/v1/profile/clal-script';document.body.appendChild(s);})();void(0);`;

    return new NextResponse(code, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
}
