import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { generateSEO } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = generateSEO();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
