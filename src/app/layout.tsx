import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { generateSEO } from '@/lib/seo';
import Script from 'next/script';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = generateSEO();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4134603910866620"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script id="structured-data" type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "MatrixTools",
            "url": "https://matrixtools.me",
            "description": "为新手提供最实用的工具推荐和详细教程，快速提升工作效率",
            "publisher": {
              "@type": "Organization",
              "name": "MatrixTools Team"
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://matrixtools.me/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }`}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
