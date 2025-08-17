import { Metadata } from 'next';
import { SITE_CONFIG } from './constants';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

export function generateSEO({
  title,
  description = SITE_CONFIG.description,
  keywords = [],
  image = SITE_CONFIG.ogImage,
  url = SITE_CONFIG.url,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
}: SEOProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.title;
  const fullUrl = url.startsWith('http') ? url : `${SITE_CONFIG.url}${url}`;
  const fullImage = image.startsWith('http') ? image : `${SITE_CONFIG.url}${image}`;

  const defaultKeywords = [
    '工具分享',
    '在线工具',
    '效率工具',
    '开发工具',
    '设计工具',
    '免费工具',
    '工具推荐',
    '新手教程',
    'Google AdSense',
  ];

  const allKeywords = [...defaultKeywords, ...keywords].join(', ');

  return {
    title: fullTitle,
    description,
    keywords: allKeywords,
    authors: authors ? authors.map(name => ({ name })) : [{ name: SITE_CONFIG.creator }],
    creator: SITE_CONFIG.creator,
    publisher: SITE_CONFIG.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type,
      siteName: SITE_CONFIG.name,
      title: fullTitle,
      description,
      url: fullUrl,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
      creator: `@${SITE_CONFIG.creator}`,
    },
    alternates: {
      canonical: fullUrl,
    },
    category: '工具分享',
  };
}

export function generateStructuredData({
  type,
  name,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
}: {
  type: 'WebSite' | 'Article' | 'SoftwareApplication';
  name: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    description,
    url,
    ...(image && { image }),
  };

  if (type === 'WebSite') {
    return {
      ...baseData,
      publisher: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };
  }

  if (type === 'Article') {
    return {
      ...baseData,
      headline: name,
      ...(datePublished && { datePublished }),
      ...(dateModified && { dateModified }),
      author: {
        '@type': 'Person',
        name: author || SITE_CONFIG.creator,
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
      },
    };
  }

  return baseData;
}