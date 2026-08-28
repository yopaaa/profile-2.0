import { MetadataRoute } from 'next';
import portfolioData from '../data/data.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = portfolioData.seo.siteUrl;

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];
}
