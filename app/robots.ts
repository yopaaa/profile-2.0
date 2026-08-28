import { MetadataRoute } from 'next';
import portfolioData from '../data/data.json';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = portfolioData.seo.siteUrl;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
