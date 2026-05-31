import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const siteLink = (process.env.SITE_LINK ?? 'https://acid.kvznmx.com').replace(/\/$/, '')

    const routes = [
        '/',
        '/pages/Abouts',
        '/pages/Best50',
        '/pages/ClalFetchFailure',
        '/pages/ClalFetchSuccess',
        '/pages/Guides',
        '/pages/Guides/ClalGuide',
        '/pages/Guides/UsageGuide',
        '/pages/LvScore',
        '/pages/SkillRadar',
        '/pages/UserProfile',
    ]

    return routes.map((route) => ({
        url: `${siteLink}${route}`,
        changeFrequency: 'weekly',
        priority: route === '/' || route === '/pages/Best50' ? 1 : 0.7,
    }))
}