import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const siteLink = (process.env.SITE_LINK ?? 'https://acid.kvznmx.com').replace(/\/$/, '');
    const lastModified = process.env.NEXT_PUBLIC_BUILD_TIME ? new Date(process.env.NEXT_PUBLIC_BUILD_TIME) : new Date();

    const routes: Array<{
        route: string;
        changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
        priority: number;
    }> = [
        { route: '/', changeFrequency: 'daily', priority: 1 },
        { route: '/pages/b50', changeFrequency: 'weekly', priority: 0.9 },
        {
            route: '/pages/lv-score',
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            route: '/pages/skill-radar',
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        { route: '/pages/about', changeFrequency: 'weekly', priority: 0.8 },
        { route: '/pages/guides', changeFrequency: 'weekly', priority: 0.8 },
        {
            route: '/pages/guides/clal-guide',
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            route: '/pages/guides/usage-guide',
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];

    return routes.map((route) => ({
        url: `${siteLink}${route.route}`,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        lastModified,
    }));
}
