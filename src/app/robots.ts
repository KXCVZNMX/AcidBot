import type {MetadataRoute} from 'next';

const siteLink = (process.env.SITE_LINK ?? 'https://acid.kvznmx.com').replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/'],
        },
        sitemap: `${siteLink}/sitemap.xml`,
    };
}
