import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const siteLink = (process.env.SITE_LINK ?? 'https://acid.kvznmx.com').replace(/\/$/, '');
    const lastModified = process.env.NEXT_PUBLIC_BUILD_TIME
        ? new Date(process.env.NEXT_PUBLIC_BUILD_TIME)
        : new Date();

    const routes: Array<{
        route: string;
        changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
        priority: number;
    }> = [
        { route: '/', changeFrequency: 'daily', priority: 1 },
        { route: '/pages/Abouts', changeFrequency: 'weekly', priority: 0.8 },
        { route: '/pages/Guides', changeFrequency: 'weekly', priority: 0.8 },
        { route: '/pages/Guides/ClalGuide', changeFrequency: 'monthly', priority: 0.7 },
        { route: '/pages/Guides/UsageGuide', changeFrequency: 'monthly', priority: 0.7 },
    ]

    return routes.map((route) => ({
        url: `${siteLink}${route.route}`,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        lastModified,
    }))
}